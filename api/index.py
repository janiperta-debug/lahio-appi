from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Request, Depends
from starlette.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import os
import logging
import bcrypt
import httpx
import math
from datetime import datetime, timezone, timedelta
from pydantic import BaseModel
from typing import List, Optional
from gotrue.errors import AuthApiError

# Supabase
SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY", "")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

app = FastAPI()
api = APIRouter(prefix="/api")
@api.get("")
async def api_health():
    return {"status": "ok", "service": "lahio-api"}

DIGITRANSIT_URL = "https://api.digitransit.fi/routing/v2/finland/gtfs/v1"
DIGITRANSIT_KEY = os.environ.get("DIGITRANSIT_API_KEY", "")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ============================================================
# MODELS
# ============================================================

class RegisterRequest(BaseModel):
    email: str
    password: str
    display_name: str

class LoginRequest(BaseModel):
    email: str
    password: str

class ProfileUpdate(BaseModel):
    display_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    search_radius_km: Optional[float] = None

class AvatarUpload(BaseModel):
    image_base64: str  # base64 encoded image data (data:image/jpeg;base64,...)

class LocationUpdate(BaseModel):
    latitude: float
    longitude: float
    city: str
    search_radius_km: float = 5.0

class PlayListingCreate(BaseModel):
    title: str
    description: str
    child_age_min: Optional[int] = None
    child_age_max: Optional[int] = None
    tags: List[str] = []

class PlayListingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    child_age_min: Optional[int] = None
    child_age_max: Optional[int] = None
    tags: Optional[List[str]] = None
    status: Optional[str] = None

class HelpListingCreate(BaseModel):
    title: str
    description: str
    help_type: str
    category: str = "muu"
    tags: List[str] = []

class HelpListingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    help_type: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    status: Optional[str] = None

class EventCreate(BaseModel):
    title: str
    description: str
    category: str = ""
    location_address: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    city: Optional[str] = None
    starts_at: str
    ends_at: Optional[str] = None
    max_participants: Optional[int] = None
    recurrence: str = "none"

class RSVPRequest(BaseModel):
    status: str

class ReportCreate(BaseModel):
    target_type: str
    target_id: str
    reason: str
    details: Optional[str] = None

class MapPlaceCreate(BaseModel):
    name: str
    category: str
    description: Optional[str] = ""
    latitude: float
    longitude: float
    address: str
    city: str

# ============================================================
# HELPERS
# ============================================================

def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371000
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

def format_distance(meters):
    if meters < 1000:
        return f"{max(50, round(meters / 50) * 50)} m"
    elif meters < 10000:
        return f"{meters/1000:.1f} km"
    else:
        return f"{round(meters/1000)} km"

def point_wkt(lon, lat):
    return f"SRID=4326;POINT({lon} {lat})"

async def geocode_address(address: str):
    try:
        async with httpx.AsyncClient() as c:
            resp = await c.get(
                "https://nominatim.openstreetmap.org/search",
                params={"q": address, "format": "json", "limit": 1, "countrycodes": "fi"},
                headers={"User-Agent": "Lahella/1.0"}, timeout=10.0
            )
            data = resp.json()
            if data:
                return float(data[0]["lat"]), float(data[0]["lon"]), data[0].get("display_name", "")
    except Exception as e:
        logger.error(f"Geocoding failed: {e}")
    return None, None, None

async def get_current_user(request: Request) -> dict:
    """Authenticate via Supabase Auth token"""
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        raise HTTPException(401, "Not authenticated")
    token = auth[7:]
    try:
        user_resp = supabase.auth.get_user(token)
        if not user_resp or not user_resp.user:
            raise HTTPException(401, "Invalid token")
        uid = user_resp.user.id
        profile = supabase.table("profiles").select("*").eq("id", uid).single().execute()
        if not profile.data:
            raise HTTPException(401, "Profile not found")
        p = profile.data
        if p.get("is_banned"):
            raise HTTPException(403, "Account banned")
        # Never expose location_point
        p.pop("location_point", None)
        p.pop("previous_location_point", None)
        return p
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Auth error: {e}")
        raise HTTPException(401, "Authentication failed")

def clean_profile(p: dict) -> dict:
    """Remove sensitive fields from profile"""
    p.pop("location_point", None)
    p.pop("previous_location_point", None)
    return p

# ============================================================
# AUTH (via Supabase Auth)
# ============================================================

@api.post("/auth/register")
async def register(req: RegisterRequest):
    try:
        # Create user via admin API (auto-confirms email)
        admin_resp = supabase.auth.admin.create_user({
            "email": req.email.lower().strip(),
            "password": req.password,
            "email_confirm": True,
            "user_metadata": {"display_name": req.display_name}
        })
        if not admin_resp.user:
            raise HTTPException(400, "Registration failed")
        uid = admin_resp.user.id

        # Sign in to get session tokens
        login_resp = supabase.auth.sign_in_with_password({
            "email": req.email.lower().strip(),
            "password": req.password,
        })

        # Update profile display_name
        supabase.table("profiles").update({
            "display_name": req.display_name,
            "email": req.email.lower().strip(),
        }).eq("id", uid).execute()
        profile = supabase.table("profiles").select("*").eq("id", uid).single().execute()
        return {
            "access_token": login_resp.session.access_token if login_resp.session else "",
            "refresh_token": login_resp.session.refresh_token if login_resp.session else "",
            "user": clean_profile(profile.data) if profile.data else {"id": uid, "email": req.email, "display_name": req.display_name}
        }
    except AuthApiError as e:
        raise HTTPException(400, str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Register error: {e}")
        raise HTTPException(400, f"Registration failed: {str(e)}")

@api.post("/auth/login")
async def login(req: LoginRequest):
    try:
        auth_resp = supabase.auth.sign_in_with_password({
            "email": req.email.lower().strip(),
            "password": req.password,
        })
        if not auth_resp.user or not auth_resp.session:
            raise HTTPException(401, "Invalid credentials")
        uid = auth_resp.user.id
        profile = supabase.table("profiles").select("*").eq("id", uid).single().execute()
        return {
            "access_token": auth_resp.session.access_token,
            "refresh_token": auth_resp.session.refresh_token,
            "user": clean_profile(profile.data) if profile.data else {"id": uid}
        }
    except AuthApiError as e:
        raise HTTPException(401, "Invalid credentials")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(401, "Login failed")

@api.get("/auth/me")
async def get_me(user=Depends(get_current_user)):
    return {"user": user}

@api.post("/auth/refresh")
async def refresh_token(request: Request):
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        raise HTTPException(401, "No token")
    token = auth[7:]
    try:
        resp = supabase.auth.refresh_session(token)
        if resp.session:
            return {"access_token": resp.session.access_token, "refresh_token": resp.session.refresh_token}
        raise HTTPException(401, "Refresh failed")
    except Exception:
        raise HTTPException(401, "Refresh failed")

# ============================================================
# PROFILES
# ============================================================

@api.get("/profiles/me")
async def get_my_profile(user=Depends(get_current_user)):
    return user

@api.put("/profiles/me")
async def update_profile(update: ProfileUpdate, user=Depends(get_current_user)):
    updates = {k: v for k, v in update.model_dump().items() if v is not None}
    if updates:
        updates["updated_at"] = datetime.now(timezone.utc).isoformat()
        supabase.table("profiles").update(updates).eq("id", user["id"]).execute()
    profile = supabase.table("profiles").select("*").eq("id", user["id"]).single().execute()
    return clean_profile(profile.data)

@api.post("/profiles/upload-avatar")
async def upload_avatar(req: AvatarUpload, user=Depends(get_current_user)):
    """Upload avatar as base64 data URI, store in avatar_url field"""
    image_data = req.image_base64
    if not image_data.startswith("data:image/"):
        raise HTTPException(400, "Invalid image format. Expected data:image/... base64")
    # Limit size (~500KB base64 ≈ ~375KB image)
    if len(image_data) > 700000:
        raise HTTPException(400, "Image too large. Max ~500KB")
    supabase.table("profiles").update({
        "avatar_url": image_data,
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }).eq("id", user["id"]).execute()
    return {"avatar_url": image_data}

@api.post("/profiles/update-location")
async def update_location(req: LocationUpdate, user=Depends(get_current_user)):
    updates = {
        "location_point": point_wkt(req.longitude, req.latitude),
        "location_city": req.city,
        "search_radius_km": req.search_radius_km,
        "location_updated_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    supabase.table("profiles").update(updates).eq("id", user["id"]).execute()
    profile = supabase.table("profiles").select("*").eq("id", user["id"]).single().execute()
    return clean_profile(profile.data)

@api.get("/profiles/{user_id}")
async def get_public_profile(user_id: str):
    try:
        profile = supabase.table("profiles").select("id,display_name,avatar_url,bio,location_city,is_verified,created_at").eq("id", user_id).single().execute()
    except Exception:
        raise HTTPException(404, "User not found")
    if not profile.data:
        raise HTTPException(404, "User not found")
    p = profile.data
    play_count = len(supabase.table("play_listings").select("id").eq("user_id", user_id).eq("status", "active").execute().data)
    help_count = len(supabase.table("help_listings").select("id").eq("user_id", user_id).eq("status", "active").execute().data)
    event_count = len(supabase.table("events").select("id").eq("user_id", user_id).eq("status", "active").execute().data)
    p["listing_counts"] = {"play": play_count, "help": help_count, "events": event_count}
    return p

# ============================================================
# PLAY LISTINGS
# ============================================================

@api.get("/play-listings")
async def get_play_listings(category: Optional[str] = None, user=Depends(get_current_user)):
    q = supabase.table("play_listings").select("*,profiles!user_id(display_name,avatar_url,bio)").eq("status", "active").gte("expires_at", datetime.now(timezone.utc).isoformat()).order("created_at", desc=True).limit(50)
    if category and category != "all":
        q = q.contains("tags", [category])
    result = q.execute()
    listings = []
    for row in result.data:
        profile = row.pop("profiles", {}) or {}
        row["author_name"] = profile.get("display_name", "")
        row["author_avatar"] = profile.get("avatar_url", "")
        row["author_bio"] = profile.get("bio", "")
        row.pop("location_point", None)
        row["distance"] = ""
        listings.append(row)
    return {"listings": listings}

@api.post("/play-listings")
async def create_play_listing(req: PlayListingCreate, user=Depends(get_current_user)):
    # Get user's location
    profile = supabase.table("profiles").select("location_point,location_city,location_locked_until").eq("id", user["id"]).single().execute()
    p = profile.data
    if p.get("location_locked_until") and p["location_locked_until"] > datetime.now(timezone.utc).isoformat():
        raise HTTPException(403, "Location locked")
    if not p.get("location_point"):
        raise HTTPException(400, "Set your location first")
    listing = {
        "user_id": user["id"], "title": req.title, "description": req.description,
        "child_age_min": req.child_age_min, "child_age_max": req.child_age_max,
        "tags": req.tags, "status": "active",
        "location_point": p["location_point"], "location_city": p.get("location_city", ""),
        "expires_at": (datetime.now(timezone.utc) + timedelta(days=60)).isoformat(),
    }
    result = supabase.table("play_listings").insert(listing).execute()
    row = result.data[0] if result.data else listing
    row.pop("location_point", None)
    return row

@api.get("/play-listings/mine")
async def get_my_play_listings(user=Depends(get_current_user)):
    result = supabase.table("play_listings").select("*").eq("user_id", user["id"]).order("created_at", desc=True).execute()
    for row in result.data:
        row.pop("location_point", None)
    return {"listings": result.data}

@api.put("/play-listings/{listing_id}")
async def update_play_listing(listing_id: str, req: PlayListingUpdate, user=Depends(get_current_user)):
    updates = {k: v for k, v in req.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(400, "No fields to update")
    updates["updated_at"] = datetime.now(timezone.utc).isoformat()
    supabase.table("play_listings").update(updates).eq("id", listing_id).eq("user_id", user["id"]).execute()
    result = supabase.table("play_listings").select("*").eq("id", listing_id).single().execute()
    row = result.data
    row.pop("location_point", None)
    return row

@api.delete("/play-listings/{listing_id}")
async def delete_play_listing(listing_id: str, user=Depends(get_current_user)):
    supabase.table("play_listings").delete().eq("id", listing_id).eq("user_id", user["id"]).execute()
    return {"status": "deleted"}

# ============================================================
# HELP LISTINGS
# ============================================================

@api.get("/help-listings")
async def get_help_listings(help_type: Optional[str] = None, category: Optional[str] = None, user=Depends(get_current_user)):
    q = supabase.table("help_listings").select("*,profiles!user_id(display_name,avatar_url,bio)").eq("status", "active").gte("expires_at", datetime.now(timezone.utc).isoformat()).order("created_at", desc=True).limit(50)
    if help_type and help_type != "all":
        q = q.eq("help_type", help_type)
    if category and category != "all":
        q = q.eq("category", category)
    result = q.execute()
    listings = []
    for row in result.data:
        profile = row.pop("profiles", {}) or {}
        row["author_name"] = profile.get("display_name", "")
        row["author_avatar"] = profile.get("avatar_url", "")
        row["author_bio"] = profile.get("bio", "")
        row.pop("location_point", None)
        row["distance"] = ""
        listings.append(row)
    return {"listings": listings}

@api.post("/help-listings")
async def create_help_listing(req: HelpListingCreate, user=Depends(get_current_user)):
    profile = supabase.table("profiles").select("location_point,location_city,location_locked_until").eq("id", user["id"]).single().execute()
    p = profile.data
    if p.get("location_locked_until") and p["location_locked_until"] > datetime.now(timezone.utc).isoformat():
        raise HTTPException(403, "Location locked")
    if not p.get("location_point"):
        raise HTTPException(400, "Set your location first")
    listing = {
        "user_id": user["id"], "title": req.title, "description": req.description,
        "help_type": req.help_type, "category": req.category, "tags": req.tags,
        "status": "active", "location_point": p["location_point"],
        "location_city": p.get("location_city", ""),
        "expires_at": (datetime.now(timezone.utc) + timedelta(days=30)).isoformat(),
    }
    result = supabase.table("help_listings").insert(listing).execute()
    row = result.data[0] if result.data else listing
    row.pop("location_point", None)
    return row

@api.get("/help-listings/mine")
async def get_my_help_listings(user=Depends(get_current_user)):
    result = supabase.table("help_listings").select("*").eq("user_id", user["id"]).order("created_at", desc=True).execute()
    for row in result.data:
        row.pop("location_point", None)
    return {"listings": result.data}

@api.put("/help-listings/{listing_id}")
async def update_help_listing(listing_id: str, req: HelpListingUpdate, user=Depends(get_current_user)):
    updates = {k: v for k, v in req.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(400, "No fields to update")
    updates["updated_at"] = datetime.now(timezone.utc).isoformat()
    supabase.table("help_listings").update(updates).eq("id", listing_id).eq("user_id", user["id"]).execute()
    result = supabase.table("help_listings").select("*").eq("id", listing_id).single().execute()
    row = result.data
    row.pop("location_point", None)
    return row

@api.delete("/help-listings/{listing_id}")
async def delete_help_listing(listing_id: str, user=Depends(get_current_user)):
    supabase.table("help_listings").delete().eq("id", listing_id).eq("user_id", user["id"]).execute()
    return {"status": "deleted"}

# ============================================================
# EVENTS
# ============================================================

@api.get("/events")
async def get_events(category: Optional[str] = None, user=Depends(get_current_user)):
    q = supabase.table("events").select("*,profiles!user_id(display_name,avatar_url)").neq("status", "cancelled").order("starts_at").limit(50)
    if category and category != "all":
        q = q.eq("category", category)
    result = q.execute()
    events = []
    for row in result.data:
        profile = row.pop("profiles", {}) or {}
        row["author_name"] = profile.get("display_name", "")
        row.pop("location_point", None)
        pc = len(supabase.table("event_participants").select("id").eq("event_id", row["id"]).eq("status", "going").execute().data)
        row["participant_count"] = pc
        row["distance"] = ""
        events.append(row)
    return {"events": events}

@api.post("/events")
async def create_event(req: EventCreate, user=Depends(get_current_user)):
    lat, lon, city = req.latitude, req.longitude, req.city
    if not lat or not lon:
        lat, lon, display = await geocode_address(req.location_address)
        if not lat:
            raise HTTPException(400, "Could not geocode address")
        city = req.city or req.location_address.split(",")[0].strip()
    event = {
        "user_id": user["id"], "title": req.title, "description": req.description,
        "category": req.category, "location_address": req.location_address,
        "location_point": point_wkt(lon, lat), "location_city": city,
        "starts_at": req.starts_at, "ends_at": req.ends_at,
        "max_participants": req.max_participants, "recurrence": req.recurrence, "status": "active",
    }
    result = supabase.table("events").insert(event).execute()
    row = result.data[0] if result.data else event
    row.pop("location_point", None)
    return row

@api.get("/events/mine")
async def get_my_events(user=Depends(get_current_user)):
    result = supabase.table("events").select("*").eq("user_id", user["id"]).order("starts_at", desc=True).execute()
    events = []
    for row in result.data:
        row.pop("location_point", None)
        pc = len(supabase.table("event_participants").select("id").eq("event_id", row["id"]).eq("status", "going").execute().data)
        row["participant_count"] = pc
        events.append(row)
    return {"events": events}

@api.get("/events/{event_id}")
async def get_event_detail(event_id: str, user=Depends(get_current_user)):
    try:
        result = supabase.table("events").select("*,profiles!user_id(display_name,avatar_url)").eq("id", event_id).single().execute()
    except Exception:
        raise HTTPException(404, "Event not found")
    row = result.data
    if not row:
        raise HTTPException(404, "Event not found")
    profile = row.pop("profiles", {}) or {}
    row["author_name"] = profile.get("display_name", "")
    row.pop("location_point", None)
    parts = supabase.table("event_participants").select("*,profiles!user_id(display_name,avatar_url)").eq("event_id", event_id).execute()
    participants = []
    for p in parts.data:
        pp = p.pop("profiles", {}) or {}
        participants.append({
            "user_id": p["user_id"], "status": p["status"],
            "display_name": pp.get("display_name", ""), "avatar_url": pp.get("avatar_url", "")
        })
    row["participants"] = participants
    row["participant_count"] = len([p for p in participants if p["status"] == "going"])
    my_rsvp = supabase.table("event_participants").select("status").eq("event_id", event_id).eq("user_id", user["id"]).execute()
    row["my_rsvp"] = my_rsvp.data[0]["status"] if my_rsvp.data else None
    return row

@api.post("/events/{event_id}/rsvp")
async def rsvp_event(event_id: str, req: RSVPRequest, user=Depends(get_current_user)):
    existing = supabase.table("event_participants").select("id").eq("event_id", event_id).eq("user_id", user["id"]).execute()
    if existing.data:
        supabase.table("event_participants").update({"status": req.status}).eq("id", existing.data[0]["id"]).execute()
    else:
        supabase.table("event_participants").insert({
            "event_id": event_id, "user_id": user["id"], "status": req.status,
        }).execute()
    return {"status": req.status}

# ============================================================
# MAP PLACES
# ============================================================

OVERPASS_CATEGORY_TAGS = {
    "playground": ['["leisure"="playground"]'],
    "sports": ['["leisure"="sports_centre"]', '["leisure"="pitch"]', '["leisure"="fitness_station"]'],
    "nature": ['["leisure"="park"]', '["leisure"="nature_reserve"]', '["boundary"="national_park"]'],
    "swimming": ['["leisure"="swimming_pool"]', '["sport"="swimming"]', '["amenity"="public_bath"]'],
    "pets": ['["leisure"="dog_park"]'],
    "culture": ['["amenity"="library"]', '["amenity"="theatre"]', '["tourism"="museum"]', '["amenity"="community_centre"]'],
}

def osm_category(tags: dict) -> str:
    if tags.get("leisure") == "playground": return "playground"
    if tags.get("leisure") in ("sports_centre", "pitch", "fitness_station"): return "sports"
    if tags.get("leisure") in ("park", "nature_reserve") or tags.get("boundary") == "national_park": return "nature"
    if tags.get("leisure") == "swimming_pool" or tags.get("sport") == "swimming" or tags.get("amenity") == "public_bath": return "swimming"
    if tags.get("leisure") == "dog_park": return "pets"
    if tags.get("amenity") in ("library", "theatre", "community_centre") or tags.get("tourism") == "museum": return "culture"
    return "other"

@api.get("/map-places")
async def get_map_places(category: Optional[str] = None, lat: Optional[float] = None, lon: Optional[float] = None, radius_km: Optional[float] = None, user=Depends(get_current_user)):
    q = supabase.table("map_places").select("*").limit(200)
    if category and category != "all":
        q = q.eq("category", category)
    result = q.execute()
    places = []
    for row in result.data:
        row.pop("location_point", None)
        # Parse lat/lon from address or stored data if available
        # For now return what we have
        places.append(row)
    return {"places": places}

@api.get("/map-places/fetch-osm")
async def fetch_osm_places(category: Optional[str] = None, lat: Optional[float] = None, lon: Optional[float] = None, radius_km: Optional[float] = None, user=Depends(get_current_user)):
    q_lat = lat or 60.6312
    q_lon = lon or 24.8614
    q_radius = radius_km or 10
    radius_m = int(min(q_radius, 15) * 1000)

    if category and category in OVERPASS_CATEGORY_TAGS:
        tag_filters = OVERPASS_CATEGORY_TAGS[category]
    else:
        tag_filters = []
        for tags in OVERPASS_CATEGORY_TAGS.values():
            tag_filters.extend(tags)

    node_queries = "".join([f'node{t}(around:{radius_m},{q_lat},{q_lon});' for t in tag_filters])
    way_queries = "".join([f'way{t}(around:{radius_m},{q_lat},{q_lon});' for t in tag_filters])
    overpass_query = f"[out:json][timeout:15];({node_queries}{way_queries});out center tags 200;"

    try:
        async with httpx.AsyncClient() as c:
            resp = await c.post(
                "https://overpass-api.de/api/interpreter",
                data={"data": overpass_query},
                headers={"User-Agent": "Lahella/1.0 (community app)"},
                timeout=25.0
            )
            if resp.status_code != 200:
                raise HTTPException(502, "Overpass API error")
            data = resp.json()
    except httpx.TimeoutException:
        raise HTTPException(504, "Overpass API timeout")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Overpass error: {e}")
        raise HTTPException(502, "Overpass API error")

    places = []
    saved = 0
    for el in data.get("elements", []):
        el_lat = el.get("lat") or el.get("center", {}).get("lat")
        el_lon = el.get("lon") or el.get("center", {}).get("lon")
        tags = el.get("tags", {})
        name = tags.get("name")
        if not el_lat or not el_lon or not name:
            continue
        cat = osm_category(tags)
        osm_id = el.get("id")
        place_data = {
            "name": name, "category": cat,
            "latitude": el_lat, "longitude": el_lon,
            "address": (tags.get("addr:street", "") + " " + tags.get("addr:housenumber", "")).strip(),
            "city": tags.get("addr:city", user.get("location_city", "")),
            "source": "osm", "osm_id": osm_id,
        }
        places.append(place_data)

        # Upsert into Supabase
        if osm_id:
            existing = supabase.table("map_places").select("id").eq("osm_id", osm_id).execute()
            row_data = {
                "name": name, "category": cat,
                "location_point": point_wkt(el_lon, el_lat),
                "address": place_data["address"], "location_city": place_data["city"],
                "source": "osm", "osm_id": osm_id, "tags": tags,
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }
            if existing.data:
                supabase.table("map_places").update(row_data).eq("id", existing.data[0]["id"]).execute()
            else:
                supabase.table("map_places").insert(row_data).execute()
            saved += 1

    logger.info(f"Overpass: fetched {len(places)} places, saved {saved} to Supabase")
    return {"places": places, "count": len(places), "cached": saved}

@api.post("/map-places")
async def create_map_place(req: MapPlaceCreate, user=Depends(get_current_user)):
    place = {
        "name": req.name, "category": req.category,
        "location_point": point_wkt(req.longitude, req.latitude),
        "address": req.address, "location_city": req.city, "source": "user",
        "added_by": user["id"],
    }
    result = supabase.table("map_places").insert(place).execute()
    row = result.data[0] if result.data else place
    row.pop("location_point", None)
    row["latitude"] = req.latitude
    row["longitude"] = req.longitude
    return row

# ============================================================
# REPORTS
# ============================================================

@api.post("/reports")
async def create_report(req: ReportCreate, user=Depends(get_current_user)):
    supabase.table("reports").insert({
        "reporter_id": user["id"], "target_type": req.target_type,
        "target_id": req.target_id, "reason": req.reason,
        "details": req.details, "status": "pending",
    }).execute()
    return {"status": "reported"}

# ============================================================
# TRANSIT (Digitransit)
# ============================================================

@api.get("/transit/nearby-stops")
async def get_nearby_stops(lat: float, lon: float, radius_km: float = 1.0, user=Depends(get_current_user)):
    if not DIGITRANSIT_KEY:
        raise HTTPException(503, "Digitransit API key not configured")
    offset = radius_km * 0.009
    query = {
        "query": """{
            stopsByBbox(minLat:%f,minLon:%f,maxLat:%f,maxLon:%f) {
                gtfsId name lat lon platformCode
                stoptimesWithoutPatterns(numberOfDepartures:5) {
                    scheduledDeparture realtimeDeparture realtime serviceDay headsign
                    trip { route { shortName longName mode type } }
                }
            }
        }""" % (lat - offset, lon - offset, lat + offset, lon + offset)
    }
    try:
        async with httpx.AsyncClient() as c:
            resp = await c.post(DIGITRANSIT_URL, json=query,
                headers={"digitransit-subscription-key": DIGITRANSIT_KEY, "Content-Type": "application/json"},
                timeout=10.0)
            if resp.status_code != 200:
                raise HTTPException(502, "Digitransit API error")
            data = resp.json()
    except httpx.TimeoutException:
        raise HTTPException(504, "Digitransit timeout")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Digitransit error: {e}")
        raise HTTPException(502, "Transit API error")

    stops_raw = data.get("data", {}).get("stopsByBbox", [])
    stops = []
    for s in stops_raw:
        departures = []
        for dep in s.get("stoptimesWithoutPatterns", []):
            route = dep.get("trip", {}).get("route", {})
            sched = dep.get("scheduledDeparture", 0)
            real = dep.get("realtimeDeparture", sched)
            service_day = dep.get("serviceDay", 0)
            departure_ts = service_day + real
            is_realtime = dep.get("realtime", False)
            delay = real - sched if is_realtime else 0
            departures.append({
                "time": f"{(real // 3600) % 24:02d}:{(real % 3600) // 60:02d}",
                "scheduled_time": f"{(sched // 3600) % 24:02d}:{(sched % 3600) // 60:02d}",
                "departure_ts": departure_ts, "realtime": is_realtime,
                "delay_min": round(delay / 60), "headsign": dep.get("headsign", ""),
                "route_short": route.get("shortName", ""),
                "route_long": route.get("longName", ""),
                "mode": route.get("mode", "BUS"),
            })
        if not departures:
            continue
        dist = haversine_distance(lat, lon, s["lat"], s["lon"])
        stops.append({
            "gtfs_id": s["gtfsId"], "name": s["name"],
            "lat": s["lat"], "lon": s["lon"],
            "distance": format_distance(dist), "distance_m": dist,
            "departures": departures,
        })
    stops.sort(key=lambda x: x["distance_m"])
    return {"stops": stops[:30]}

# ============================================================
# STATS & GEOCODE
# ============================================================

@api.get("/stats")
async def get_area_stats(user=Depends(get_current_user)):
    total_users = len(supabase.table("profiles").select("id").execute().data)
    play_count = len(supabase.table("play_listings").select("id").eq("status", "active").execute().data)
    help_count = len(supabase.table("help_listings").select("id").eq("status", "active").execute().data)
    event_count = len(supabase.table("events").select("id").neq("status", "cancelled").execute().data)
    return {
        "neighbours": total_users, "play_listings": play_count,
        "help_listings": help_count, "events": event_count,
        "radius_km": user.get("search_radius_km", 5), "city": user.get("location_city", "")
    }

@api.get("/geocode")
async def geocode(address: str):
    lat, lon, display = await geocode_address(address)
    if lat is None:
        raise HTTPException(404, "Address not found")
    return {"latitude": lat, "longitude": lon, "display_name": display}

# ============================================================
# STARTUP
# ============================================================

app.include_router(api)
app.add_middleware(CORSMiddleware, allow_credentials=True, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.on_event("startup")
async def startup():
    logger.info("Lähellä backend started with Supabase!")

@app.on_event("shutdown")
async def shutdown():
    pass
