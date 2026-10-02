import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const OVERPASS_URL = "https://overpass.kumi.systems/api/interpreter"

function distance(a: number, b: number, c: number, d: number) {
  const R = 6371000
  const p1 = a * Math.PI / 180
  const p2 = c * Math.PI / 180
  const dp = (c - a) * Math.PI / 180
  const dl = (d - b) * Math.PI / 180
  const x = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))
}

function category(tags: Record<string, string>) {
  if (tags.leisure === "playground") return { key: "play", label: "Leikki", icon: "🛝" }
  if (tags.leisure === "dog_park") return { key: "pets", label: "Lemmikit", icon: "🐕" }
  if (tags.leisure === "park") return { key: "outdoors", label: "Ulkoilu", icon: "🌳" }
  if (tags.leisure === "fitness_centre" || tags.leisure === "sports_centre" || tags.leisure === "pitch" || tags.leisure === "track" || tags.leisure === "swimming_pool" || tags.sport) {
    return { key: "sports", label: "Liikunta", icon: "🏃" }
  }
  if (tags.amenity === "library") return { key: "community", label: "Yhteisö", icon: "📚" }
  if (tags.amenity === "community_centre" || tags.amenity === "social_centre" || tags.amenity === "youth_centre") {
    return { key: "community", label: "Yhteisö", icon: "🏠" }
  }
  return { key: "other", label: "Paikka", icon: "📍" }
}

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims?.sub) return NextResponse.json({ error: "Kirjautuminen vaaditaan." }, { status: 401 })

  const radius = Math.min(3, Math.max(0.5, Number(req.nextUrl.searchParams.get("radius_km") ?? 2)))
  const { data: coords } = await supabase.rpc("get_my_location_coordinates")
  if (!coords?.[0]) return NextResponse.json({ error: "Aseta ensin sijaintisi profiilissa." }, { status: 400 })

  const lat = Number(coords[0].latitude)
  const lon = Number(coords[0].longitude)
  const radiusM = radius * 1000

  const query = `[out:json][timeout:15];
(
  nwr(around:${radiusM},${lat},${lon})["leisure"~"playground|dog_park|park|fitness_centre|sports_centre|pitch|track|swimming_pool"];
  nwr(around:${radiusM},${lat},${lon})["sport"];
  nwr(around:${radiusM},${lat},${lon})["amenity"~"library|community_centre|social_centre|youth_centre"];
);
out center tags;`

  try {
    const res = await fetch(OVERPASS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Lahella/1.0 (https://www.janope.fi/)",
      },
      body: new URLSearchParams({ data: query }),
      cache: "no-store",
    })

    if (!res.ok) return NextResponse.json({ error: "Paikkatietopalvelu hylkäsi pyynnön.", details: `HTTP ${res.status}` }, { status: 502 })

    const json = await res.json()
    const seen = new Set<string>()

    const places = (json.elements ?? [])
      .map((item: any) => {
        const tags = item.tags ?? {}
        const name = tags.name || tags["name:fi"] || tags["name:sv"]
        if (!name) return null
        const itemLat = Number(item.lat ?? item.center?.lat)
        const itemLon = Number(item.lon ?? item.center?.lon)
        if (!Number.isFinite(itemLat) || !Number.isFinite(itemLon)) return null

        const kind = category(tags)
        const key = `${kind.key}:${name.toLowerCase()}`
        if (seen.has(key)) return null
        seen.add(key)

        const distanceM = distance(lat, lon, itemLat, itemLon)
        return {
          id: `${item.type}-${item.id}`,
          name,
          ...kind,
          distance_m: distanceM,
          distance: distanceM < 1000 ? `${Math.max(50, Math.round(distanceM / 50) * 50)} m` : `${(distanceM / 1000).toFixed(1)} km`,
        }
      })
      .filter(Boolean)
      .sort((a: any, b: any) => a.distance_m - b.distance_m)
      .slice(0, 8)

    return NextResponse.json({ places })
  } catch {
    return NextResponse.json({ error: "Paikkatietopalvelu ei vastannut." }, { status: 502 })
  }
}
