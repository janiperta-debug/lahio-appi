const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const OVERPASS_URL = process.env.OVERPASS_URL || "https://overpass-api.de/api/interpreter"
const OSM_CENTERS = (process.env.OSM_CENTERS || "61.0150966,24.4348754;60.6312,24.8614")
  .split(";")
  .map(value => value.split(",").map(Number))
  .filter(([lat, lon]) => Number.isFinite(lat) && Number.isFinite(lon))
const OSM_RADIUS_KM = Number(process.env.OSM_RADIUS_KM || 25)

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.")
}

const radiusM = Math.min(50000, Math.max(1000, OSM_RADIUS_KM * 1000))

const queryFor = (lat, lon) => `
[out:json][timeout:60];
(
  nwr["leisure"~"playground|sports_centre|pitch|fitness_station|park|nature_reserve|swimming_pool|dog_park"]["name"](around:${radiusM},${lat},${lon});
  nwr["boundary"="national_park"]["name"](around:${radiusM},${lat},${lon});
  nwr["sport"="swimming"]["name"](around:${radiusM},${lat},${lon});
  nwr["amenity"~"public_bath|library|theatre|community_centre"]["name"](around:${radiusM},${lat},${lon});
  nwr["tourism"="museum"]["name"](around:${radiusM},${lat},${lon});
);
out center tags;
`

const headers = {
  apikey: SUPABASE_SERVICE_ROLE_KEY,
  Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
  "Content-Type": "application/json",
}

function categoryFor(tags) {
  if (tags.leisure === "playground") return "playground"
  if (tags.leisure === "swimming_pool" || tags.sport === "swimming" || tags.amenity === "public_bath") return "swimming"
  if (tags.leisure === "dog_park") return "pets"
  if (["sports_centre", "pitch", "fitness_station"].includes(tags.leisure)) return "sports"
  if (["park", "nature_reserve"].includes(tags.leisure) || tags.boundary === "national_park") return "nature"
  if (["library", "theatre", "community_centre"].includes(tags.amenity) || tags.tourism === "museum") return "culture"
  return "other"
}

function addressFor(tags) {
  const street = tags["addr:street"]
  const houseNumber = tags["addr:housenumber"]
  const postcode = tags["addr:postcode"]
  const city = tags["addr:city"] || tags["addr:town"] || tags["addr:village"]
  const first = [street, houseNumber].filter(Boolean).join(" ")
  return [first, postcode, city].filter(Boolean).join(", ") || null
}

function normalize(element) {
  const tags = element.tags || {}
  const latitude = element.lat ?? element.center?.lat ?? null
  const longitude = element.lon ?? element.center?.lon ?? null
  if (!element.id || !tags.name || latitude == null || longitude == null) return null

  return {
    osm_id: element.id,
    name: tags.name,
    category: categoryFor(tags),
    address: addressFor(tags),
    location_city: tags["addr:city"] || tags["addr:town"] || tags["addr:village"] || null,
    location_point: `POINT(${longitude} ${latitude})`,
    source: "osm",
    tags,
  }
}

async function importCenter(lat, lon) {
  const response = await fetch(OVERPASS_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain", "User-Agent": "Lahella/1.0 (community app)" },
    body: queryFor(lat, lon),
  })

  if (!response.ok) {
    throw new Error(`Overpass request failed: ${response.status} ${await response.text()}`)
  }

  const overpass = await response.json()
  const places = overpass.elements.map(normalize).filter(Boolean)
  if (!places.length) return 0

  const response2 = await fetch(
    `${SUPABASE_URL}/rest/v1/map_places?on_conflict=osm_id`,
    {
      method: "POST",
      headers: { ...headers, Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify(places),
    },
  )

  if (!response2.ok) {
    throw new Error(`Supabase upsert failed: ${response2.status} ${await response2.text()}`)
  }

  return places.length
}

let total = 0
for (const [lat, lon] of OSM_CENTERS) {
  const count = await importCenter(lat, lon)
  console.log(`Imported ${count} OSM places around ${lat},${lon}`)
  total += count
}

console.log(`Lähellä OSM import complete: ${total} records processed.`)
