import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "npm:@supabase/supabase-js@2"

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
)

const OVERPASS_URL = Deno.env.get("OVERPASS_URL") || "https://overpass-api.de/api/interpreter"
const DEFAULT_RADIUS_KM = 10
const MAX_RADIUS_KM = 15

const OVERPASS_CATEGORY_TAGS: Record<string, string[]> = {
  playground: ['["leisure"="playground"]'],
  sports: ['["leisure"="sports_centre"]', '["leisure"="pitch"]', '["leisure"="fitness_station"]'],
  nature: ['["leisure"="park"]', '["leisure"="nature_reserve"]', '["boundary"="national_park"]'],
  swimming: ['["leisure"="swimming_pool"]', '["sport"="swimming"]', '["amenity"="public_bath"]'],
  pets: ['["leisure"="dog_park"]'],
  culture: ['["amenity"="library"]', '["amenity"="theatre"]', '["tourism"="museum"]', '["amenity"="community_centre"]'],
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

function categoryFor(tags: Record<string, string>) {
  if (tags.leisure === "playground") return "playground"
  if (["sports_centre", "pitch", "fitness_station"].includes(tags.leisure)) return "sports"
  if (["park", "nature_reserve"].includes(tags.leisure) || tags.boundary === "national_park") return "nature"
  if (tags.leisure === "swimming_pool" || tags.sport === "swimming" || tags.amenity === "public_bath") return "swimming"
  if (tags.leisure === "dog_park") return "pets"
  if (["library", "theatre", "community_centre"].includes(tags.amenity) || tags.tourism === "museum") return "culture"
  return "other"
}

function addressFor(tags: Record<string, string>) {
  const street = tags["addr:street"]
  const houseNumber = tags["addr:housenumber"]
  const postcode = tags["addr:postcode"]
  const city = tags["addr:city"] || tags["addr:town"] || tags["addr:village"]
  const first = [street, houseNumber].filter(Boolean).join(" ")
  return [first, postcode, city].filter(Boolean).join(", ") || null
}

function queryFor(lat: number, lon: number, radiusM: number, category: string) {
  const tagFilters = category !== "all" && OVERPASS_CATEGORY_TAGS[category]
    ? OVERPASS_CATEGORY_TAGS[category]
    : Object.values(OVERPASS_CATEGORY_TAGS).flat()

  const nodeQueries = tagFilters.map((tag) => `node${tag}(around:${radiusM},${lat},${lon});`).join("")
  const wayQueries = tagFilters.map((tag) => `way${tag}(around:${radiusM},${lat},${lon});`).join("")

  return `[out:json][timeout:15];(${nodeQueries}${wayQueries});out center tags 200;`
}

function normalize(element: any) {
  const tags = element.tags || {}
  const lat = element.lat ?? element.center?.lat
  const lon = element.lon ?? element.center?.lon

  if (!element.id || !tags.name || lat == null || lon == null) return null

  return {
    osm_id: element.id,
    name: tags.name,
    category: categoryFor(tags),
    address: addressFor(tags),
    location_city: tags["addr:city"] || tags["addr:town"] || tags["addr:village"] || null,
    location_point: `SRID=4326;POINT(${lon} ${lat})`,
    source: "osm",
    tags,
    updated_at: new Date().toISOString(),
  }
}

async function readPlaces(lat: number, lon: number, radiusKm: number, category: string) {
  const { data, error } = await supabase.rpc("get_map_places_at_point", {
    p_lat: lat,
    p_lon: lon,
    p_radius_km: radiusKm,
    p_category: category,
  })
  if (error) throw error
  return data ?? []
}

async function refreshFromOsm(lat: number, lon: number, radiusKm: number, category: string) {
  const radiusM = Math.min(radiusKm, MAX_RADIUS_KM) * 1000
  const overpassQuery = queryFor(lat, lon, radiusM, category)

  // Match the working Expo implementation: Overpass receives form data,
  // not a raw text/plain request.
  const body = new URLSearchParams({ data: overpassQuery })

  const response = await fetch(OVERPASS_URL, {
    method: "POST",
    headers: {
      "User-Agent": "Lahella/1.0 (community app)",
    },
    body,
    signal: AbortSignal.timeout(25000),
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => "")
    throw new Error(`Overpass: ${response.status}${detail ? ` ${detail.slice(0, 120)}` : ""}`)
  }

  const json = await response.json()
  const places = json.elements.map(normalize).filter(Boolean)

  if (places.length) {
    const { error } = await supabase.from("map_places").upsert(places, { onConflict: "osm_id" })
    if (error) throw error
  }

  return places.length
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })

  try {
    const body = await req.json()
    const lat = Number(body.lat)
    const lon = Number(body.lon)
    const radiusKm = Math.min(MAX_RADIUS_KM, Math.max(0.5, Number(body.radiusKm ?? DEFAULT_RADIUS_KM)))
    const category = String(body.category ?? "all")

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return Response.json({ error: "Virheellinen sijainti." }, { status: 400, headers: corsHeaders })
    }

    let places = await readPlaces(lat, lon, radiusKm, category)
    let refreshed = false
    let refreshError = ""

    if (places.length === 0) {
      try {
        await refreshFromOsm(lat, lon, radiusKm, category)
        refreshed = true
        places = await readPlaces(lat, lon, radiusKm, category)
      } catch (error) {
        refreshError = error instanceof Error ? error.message : String(error)
        console.error("Map OSM refresh failed", refreshError)
      }
    }

    return Response.json({
      places,
      center: { latitude: lat, longitude: lon },
      radiusKm,
      refreshed,
      refreshError,
    }, { headers: corsHeaders })
  } catch (error) {
    console.error("Map places function failed", error)
    return Response.json({ error: "Karttapaikkojen haku epäonnistui." }, { status: 502, headers: corsHeaders })
  }
})
