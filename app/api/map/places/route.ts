import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const categoryTags: Record<string, string[]> = {
  playground: ['["leisure"="playground"]'],
  sports: ['["leisure"="sports_centre"]', '["leisure"="pitch"]', '["leisure"="fitness_station"]'],
  nature: ['["leisure"="park"]', '["leisure"="nature_reserve"]', '["boundary"="national_park"]'],
  swimming: ['["leisure"="swimming_pool"]', '["sport"="swimming"]', '["amenity"="public_bath"]'],
  pets: ['["leisure"="dog_park"]'],
  culture: ['["amenity"="library"]', '["amenity"="theatre"]', '["tourism"="museum"]', '["amenity"="community_centre"]'],
}

function category(tags: Record<string, string>) {
  if (tags.leisure === 'playground') return 'playground'
  if (['sports_centre', 'pitch', 'fitness_station'].includes(tags.leisure)) return 'sports'
  if (['park', 'nature_reserve'].includes(tags.leisure) || tags.boundary === 'national_park') return 'nature'
  if (tags.leisure === 'swimming_pool' || tags.sport === 'swimming' || tags.amenity === 'public_bath') return 'swimming'
  if (tags.leisure === 'dog_park') return 'pets'
  if (['library', 'theatre', 'community_centre'].includes(tags.amenity) || tags.tourism === 'museum') return 'culture'
  return 'other'
}

function distanceMeters(aLat: number, aLon: number, bLat: number, bLon: number) {
  const R = 6371000
  const p1 = aLat * Math.PI / 180
  const p2 = bLat * Math.PI / 180
  const dp = (bLat - aLat) * Math.PI / 180
  const dl = (bLon - aLon) * Math.PI / 180
  const x = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))
}

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  if (!claimsData?.claims?.sub) return NextResponse.json({ error: 'Kirjautuminen vaaditaan.' }, { status: 401 })

  const { data: location, error: locationError } = await supabase.rpc('get_my_location_coordinates')
  if (locationError || !location?.[0]) {
    return NextResponse.json({ error: 'Sijaintia ei ole vielä määritetty.' }, { status: 400 })
  }

  const lat = Number(location[0].latitude)
  const lon = Number(location[0].longitude)
  const { searchParams } = new URL(request.url)
  const requestedRadius = Number(searchParams.get('radius_km') ?? 25)
  const radiusKm = Math.min(50, Math.max(0.5, Number.isFinite(requestedRadius) ? requestedRadius : 25))
  const radiusM = Math.round(radiusKm * 1000)
  const selectedCategory = searchParams.get('category') ?? 'all'

  const filterParts = selectedCategory === 'all'
    ? [
        'nwr["leisure"~"playground|sports_centre|pitch|fitness_station|park|nature_reserve|swimming_pool|dog_park"]["name"](around:R,LAT,LON);',
        'nwr["boundary"="national_park"]["name"](around:R,LAT,LON);',
        'nwr["sport"="swimming"]["name"](around:R,LAT,LON);',
        'nwr["amenity"~"public_bath|library|theatre|community_centre"]["name"](around:R,LAT,LON);',
        'nwr["tourism"="museum"]["name"](around:R,LAT,LON);',
      ]
    : selectedCategory === 'playground'
      ? ['nwr["leisure"="playground"](around:R,LAT,LON);']
      : selectedCategory === 'sports'
        ? ['nwr["leisure"~"sports_centre|pitch|fitness_station"](around:R,LAT,LON);']
        : selectedCategory === 'nature'
          ? ['nwr["leisure"~"park|nature_reserve"](around:R,LAT,LON);','nwr["boundary"="national_park"]["name"](around:R,LAT,LON);']
          : selectedCategory === 'swimming'
            ? ['nwr["leisure"="swimming_pool"](around:R,LAT,LON);','nwr["sport"="swimming"]["name"](around:R,LAT,LON);','nwr["amenity"="public_bath"](around:R,LAT,LON);']
            : selectedCategory === 'pets'
              ? ['nwr["leisure"="dog_park"](around:R,LAT,LON);']
              : selectedCategory === 'culture'
                ? ['nwr["amenity"~"library|theatre|community_centre"](around:R,LAT,LON);','nwr["tourism"="museum"]["name"](around:R,LAT,LON);']
                : []

  if (!filterParts.length) return NextResponse.json({ places: [], center: { latitude: lat, longitude: lon } })

  const query = `[out:json][timeout:15];(${filterParts.map(part => part.replaceAll('R', String(radiusM)).replaceAll('LAT', String(lat)).replaceAll('LON', String(lon))).join('')});out center tags;`
  const overpassEndpoints = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
  ]

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 12000)

  let response: Response | null = null
  try {
    response = await Promise.any(overpassEndpoints.map(async endpoint => {
      const candidate = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Lahella/1.0 (community app)',
        },
        body: new URLSearchParams({ data: query }),
        cache: 'no-store',
        signal: controller.signal,
      })
      if (!candidate.ok) throw new Error('Overpass request failed')
      return candidate
    }))
    controller.abort()
  } catch {
    response = null
  } finally {
    clearTimeout(timeout)
  }

  if (!response) {
    return NextResponse.json({ error: 'Karttapaikkojen palvelu ei vastannut.', center: { latitude: lat, longitude: lon } }, { status: 502 })
  }

  let data: { elements?: Array<{ id: number; lat?: number; lon?: number; center?: { lat: number; lon: number }; tags?: Record<string, string> }> }
  try {
    data = await response.json()
  } catch {
    return NextResponse.json({ error: 'Karttapaikkojen palvelu palautti virheellisen vastauksen.', center: { latitude: lat, longitude: lon } }, { status: 502 })
  }

  const seen = new Set<number>()
  const places = (data.elements ?? []).flatMap(element => {
    const tags = element.tags ?? {}
    const name = tags.name
    const pLat = element.lat ?? element.center?.lat
    const pLon = element.lon ?? element.center?.lon
    if (!name || pLat == null || pLon == null || seen.has(element.id)) return []
    seen.add(element.id)
    const address = [tags['addr:street'], tags['addr:housenumber']].filter(Boolean).join(' ')
    return [{
      id: `osm-${element.id}`,
      name,
      category: category(tags),
      address: address || null,
      location_city: tags['addr:city'] ?? null,
      latitude: pLat,
      longitude: pLon,
      distance_meters: Math.round(distanceMeters(lat, lon, pLat, pLon)),
    }]
  }).sort((a, b) => a.distance_meters - b.distance_meters)

  return NextResponse.json({
    places,
    center: { latitude: lat, longitude: lon },
    radiusKm,
  })
}
