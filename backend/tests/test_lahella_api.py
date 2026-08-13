"""
Lähellä Backend API Tests
Tests for: Auth, Play Listings, Help Listings, Events, Stats, Map Places
"""
import pytest
import requests
import os
from datetime import datetime, timedelta

# Read BASE_URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('EXPO_PUBLIC_BACKEND_URL='):
                    return line.split('=', 1)[1].strip().rstrip('/')
    except:
        pass
    return 'https://supabase-starter-4.preview.emergentagent.com'

BASE_URL = get_backend_url()

@pytest.fixture
def api_client():
    """Shared requests session"""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session

@pytest.fixture
def admin_token(api_client):
    """Get admin token for authenticated requests"""
    response = api_client.post(f"{BASE_URL}/api/auth/login", json={
        "email": "admin@lahella.fi",
        "password": "admin123"
    })
    if response.status_code != 200:
        pytest.skip(f"Admin login failed: {response.status_code}")
    data = response.json()
    return data.get("access_token")

@pytest.fixture
def demo_user_token(api_client):
    """Get demo user token"""
    response = api_client.post(f"{BASE_URL}/api/auth/login", json={
        "email": "sarik@demo.fi",
        "password": "demo123"
    })
    if response.status_code != 200:
        pytest.skip(f"Demo user login failed: {response.status_code}")
    data = response.json()
    return data.get("access_token")

# ============================================================
# AUTH TESTS
# ============================================================

class TestAuth:
    """Authentication endpoint tests"""

    def test_admin_login_success(self, api_client):
        """Test admin login with correct credentials"""
        response = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@lahella.fi",
            "password": "admin123"
        })
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "access_token" in data, "Missing access_token in response"
        assert "refresh_token" in data, "Missing refresh_token in response"
        assert "user" in data, "Missing user in response"
        assert data["user"]["email"] == "admin@lahella.fi"
        assert data["user"]["role"] == "admin"

    def test_demo_user_login_success(self, api_client):
        """Test demo user login"""
        response = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": "sarik@demo.fi",
            "password": "demo123"
        })
        assert response.status_code == 200
        
        data = response.json()
        assert "access_token" in data
        assert data["user"]["email"] == "sarik@demo.fi"

    def test_login_invalid_credentials(self, api_client):
        """Test login with wrong password"""
        response = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@lahella.fi",
            "password": "wrongpassword"
        })
        assert response.status_code == 401

    def test_login_nonexistent_user(self, api_client):
        """Test login with non-existent email"""
        response = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": "nonexistent@test.com",
            "password": "password123"
        })
        assert response.status_code == 401

    def test_get_me_authenticated(self, api_client, admin_token):
        """Test /auth/me with valid token"""
        api_client.headers.update({"Authorization": f"Bearer {admin_token}"})
        response = api_client.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 200
        
        data = response.json()
        assert "user" in data
        assert data["user"]["email"] == "admin@lahella.fi"

    def test_get_me_unauthenticated(self, api_client):
        """Test /auth/me without token"""
        response = api_client.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 401

    def test_register_new_user(self, api_client):
        """Test user registration"""
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        response = api_client.post(f"{BASE_URL}/api/auth/register", json={
            "email": f"TEST_newuser_{timestamp}@test.com",
            "password": "testpass123",
            "display_name": "Test User"
        })
        assert response.status_code == 200
        
        data = response.json()
        assert "access_token" in data
        assert "user" in data
        assert data["user"]["display_name"] == "Test User"

    def test_register_duplicate_email(self, api_client):
        """Test registration with existing email"""
        response = api_client.post(f"{BASE_URL}/api/auth/register", json={
            "email": "admin@lahella.fi",
            "password": "password123",
            "display_name": "Duplicate"
        })
        assert response.status_code == 400

# ============================================================
# PLAY LISTINGS TESTS
# ============================================================

class TestPlayListings:
    """Play listings (Naapurit) endpoint tests"""

    def test_get_play_listings(self, api_client, admin_token):
        """Test GET /api/play-listings returns listings"""
        api_client.headers.update({"Authorization": f"Bearer {admin_token}"})
        response = api_client.get(f"{BASE_URL}/api/play-listings")
        assert response.status_code == 200
        
        data = response.json()
        assert "listings" in data
        assert isinstance(data["listings"], list)
        # Should have demo data
        assert len(data["listings"]) > 0, "Expected demo play listings"

    def test_get_play_listings_by_category(self, api_client, admin_token):
        """Test category filter on play listings"""
        api_client.headers.update({"Authorization": f"Bearer {admin_token}"})
        response = api_client.get(f"{BASE_URL}/api/play-listings?category=leikkikaverit")
        assert response.status_code == 200
        
        data = response.json()
        assert "listings" in data
        # All returned listings should match category
        for listing in data["listings"]:
            assert listing["category"] == "leikkikaverit"

    def test_get_play_listings_unauthenticated(self, api_client):
        """Test play listings require authentication"""
        response = api_client.get(f"{BASE_URL}/api/play-listings")
        assert response.status_code == 401

# ============================================================
# HELP LISTINGS TESTS
# ============================================================

class TestHelpListings:
    """Help listings (Naapuriapu) endpoint tests"""

    def test_get_help_listings(self, api_client, admin_token):
        """Test GET /api/help-listings returns listings"""
        api_client.headers.update({"Authorization": f"Bearer {admin_token}"})
        response = api_client.get(f"{BASE_URL}/api/help-listings")
        assert response.status_code == 200
        
        data = response.json()
        assert "listings" in data
        assert isinstance(data["listings"], list)
        assert len(data["listings"]) > 0, "Expected demo help listings"

    def test_get_help_listings_by_category(self, api_client, admin_token):
        """Test category filter on help listings"""
        api_client.headers.update({"Authorization": f"Bearer {admin_token}"})
        response = api_client.get(f"{BASE_URL}/api/help-listings?category=lumityöt")
        assert response.status_code == 200
        
        data = response.json()
        assert "listings" in data

    def test_get_help_listings_unauthenticated(self, api_client):
        """Test help listings require authentication"""
        response = api_client.get(f"{BASE_URL}/api/help-listings")
        assert response.status_code == 401

# ============================================================
# EVENTS TESTS
# ============================================================

class TestEvents:
    """Events (Tapahtumat) endpoint tests"""

    def test_get_events(self, api_client, admin_token):
        """Test GET /api/events returns events"""
        api_client.headers.update({"Authorization": f"Bearer {admin_token}"})
        response = api_client.get(f"{BASE_URL}/api/events")
        assert response.status_code == 200
        
        data = response.json()
        assert "events" in data
        assert isinstance(data["events"], list)
        assert len(data["events"]) > 0, "Expected demo events"
        
        # Verify event structure
        if data["events"]:
            event = data["events"][0]
            assert "id" in event
            assert "title" in event
            assert "starts_at" in event
            assert "participant_count" in event

    def test_get_events_by_category(self, api_client, admin_token):
        """Test category filter on events"""
        api_client.headers.update({"Authorization": f"Bearer {admin_token}"})
        response = api_client.get(f"{BASE_URL}/api/events?category=lapsille")
        assert response.status_code == 200
        
        data = response.json()
        assert "events" in data

    def test_get_event_detail(self, api_client, admin_token):
        """Test GET /api/events/{id} returns event details"""
        api_client.headers.update({"Authorization": f"Bearer {admin_token}"})
        
        # First get list of events
        list_response = api_client.get(f"{BASE_URL}/api/events")
        events = list_response.json()["events"]
        
        if events:
            event_id = events[0]["id"]
            detail_response = api_client.get(f"{BASE_URL}/api/events/{event_id}")
            assert detail_response.status_code == 200
            
            event = detail_response.json()
            assert event["id"] == event_id
            assert "participants" in event
            assert "my_rsvp" in event

    def test_get_events_unauthenticated(self, api_client):
        """Test events require authentication"""
        response = api_client.get(f"{BASE_URL}/api/events")
        assert response.status_code == 401

# ============================================================
# STATS TESTS
# ============================================================

class TestStats:
    """Area stats endpoint tests"""

    def test_get_stats(self, api_client, admin_token):
        """Test GET /api/stats returns area statistics"""
        api_client.headers.update({"Authorization": f"Bearer {admin_token}"})
        response = api_client.get(f"{BASE_URL}/api/stats")
        assert response.status_code == 200
        
        data = response.json()
        assert "neighbours" in data
        assert "play_listings" in data
        assert "help_listings" in data
        assert "events" in data
        assert "radius_km" in data
        
        # Verify data types
        assert isinstance(data["neighbours"], int)
        assert isinstance(data["play_listings"], int)
        assert isinstance(data["help_listings"], int)
        assert isinstance(data["events"], int)
        
        # Should have demo data
        assert data["neighbours"] > 0, "Expected demo users"
        assert data["play_listings"] > 0, "Expected demo play listings"

    def test_get_stats_unauthenticated(self, api_client):
        """Test stats require authentication"""
        response = api_client.get(f"{BASE_URL}/api/stats")
        assert response.status_code == 401

# ============================================================
# MAP PLACES TESTS
# ============================================================

class TestMapPlaces:
    """Map places (Kartta) endpoint tests"""

    def test_get_map_places(self, api_client, admin_token):
        """Test GET /api/map-places returns places"""
        api_client.headers.update({"Authorization": f"Bearer {admin_token}"})
        response = api_client.get(f"{BASE_URL}/api/map-places")
        assert response.status_code == 200
        
        data = response.json()
        assert "places" in data
        assert isinstance(data["places"], list)
        assert len(data["places"]) > 0, "Expected demo map places"
        
        # Verify place structure
        if data["places"]:
            place = data["places"][0]
            assert "id" in place
            assert "name" in place
            assert "category" in place
            assert "latitude" in place
            assert "longitude" in place

    def test_get_map_places_by_category(self, api_client, admin_token):
        """Test category filter on map places"""
        api_client.headers.update({"Authorization": f"Bearer {admin_token}"})
        response = api_client.get(f"{BASE_URL}/api/map-places?category=playground")
        assert response.status_code == 200
        
        data = response.json()
        assert "places" in data
        # All returned places should match category
        for place in data["places"]:
            assert place["category"] == "playground"

    def test_get_map_places_unauthenticated(self, api_client):
        """Test map places require authentication"""
        response = api_client.get(f"{BASE_URL}/api/map-places")
        assert response.status_code == 401

# ============================================================
# PROFILE TESTS
# ============================================================

class TestProfile:
    """Profile endpoint tests"""

    def test_get_my_profile(self, api_client, admin_token):
        """Test GET /api/profiles/me"""
        api_client.headers.update({"Authorization": f"Bearer {admin_token}"})
        response = api_client.get(f"{BASE_URL}/api/profiles/me")
        assert response.status_code == 200
        
        data = response.json()
        assert "id" in data
        assert "email" in data
        assert "display_name" in data

    def test_update_profile(self, api_client, admin_token):
        """Test PUT /api/profiles/me"""
        api_client.headers.update({"Authorization": f"Bearer {admin_token}"})
        response = api_client.put(f"{BASE_URL}/api/profiles/me", json={
            "bio": "Updated bio for testing"
        })
        assert response.status_code == 200
        
        data = response.json()
        assert data["bio"] == "Updated bio for testing"

# ============================================================
# MESSAGES TESTS
# ============================================================

class TestMessages:
    """Messages (Viestit) endpoint tests"""

    def test_get_conversations(self, api_client, admin_token):
        """Test GET /api/conversations"""
        api_client.headers.update({"Authorization": f"Bearer {admin_token}"})
        response = api_client.get(f"{BASE_URL}/api/conversations")
        assert response.status_code == 200
        
        data = response.json()
        assert "conversations" in data
        assert isinstance(data["conversations"], list)

    def test_get_conversations_unauthenticated(self, api_client):
        """Test conversations require authentication"""
        response = api_client.get(f"{BASE_URL}/api/conversations")
        assert response.status_code == 401
