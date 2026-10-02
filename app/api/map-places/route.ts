import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const OVERPASS_CATEGORY_TAGS: Record<string, string[]> = {
  playground: ['["leisure"="playground"]'],
  sports: ['["leisure"="sports_centre"]', '["leisure"="pitch"]', '["leisure"="fitness_station"]'],
  nature: ['["leisure"="park"]', '["leisure"="nature_reserve"]', '["boundary"="national_park"]'],
  swimming: ['["leisure"="swimming_pool"]', '["sport"="swimming"]', '["amenity"="public_bath"]'],
  pets: ['["leisure"="dog_park"]'],
  culture: ['["amenity"="library"]', '["amenity"="theatre"]', '["tourism"="museum"]', '["amenity"="community_centre"]'],
}

type OSMElement = {
  id?: number
  lat?: number
  lon?: number
  center?: { lat?: number; lon?: number }
  tags?: Record<string, string>
}

function osmCategory(tags: Record<string, string>): string {
  if (tags.leisure === 'playground') return 'playground'
  if (['sports_centre', 'pitch', 'fitness_station'].includes(tags.leisure)) return 'sports'
  if (['park', 'nature_reserve'].includes(tags.leisure) || tags.boundary === 'national_park') {
    return 'nature'
  }
  if (
    tags.leisure === 'swimming_pool' ||
    tags.sport === 'swimming' ||
    tags.amenity === 'public_bath'
  ) {
    return 'swimming'
  }
  if (tags.leisure === 'dog_park') return 'pets'
  if (
    ['library', 'theatre', 'community_centre'].includes(tags.amenity) ||
    tags.tourism === 'museum'
  ) {
    return 'culture'
  }
  return 'other'
}

function distanceMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const earthRadius = 6371000
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2

  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: sessionData } = await supabase.auth.getSession()

  if (!sessionData.session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const lat = Number(searchParams.get('lat'))
  const lon = Number(searchParams.get('lon'))
  const radiusKm = Number(searchParams.get('radius_km') || '10')
  const category = searchParams.get('category') || 'all'

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lon) ||
    lat < -90 ||
    lat > 90 ||
    lon < -180 ||
    lon > 180
  ) {
    return NextResponse.json({ error: 'Invalid GPS coordinates' }, { status: 400 })
  }

  const radius = Math.min(Math.max(Number.isFinite(radiusKm) ? radiusKm : 10, 1), 15)
  const radiusMeters = Math.round(radius * 1000)

  const tagFilters =
    category !== 'all' && OVERPASS_CATEGORY_TAGS[category]
      ? OVERPASS_CATEGORY_TAGS[category]
      : Object.values(OVERPASS_CATEGORY_TAGS).flat()

  const nodeQueries = tagFilters
    .map((tag) => `node${tag}(around:${radiusMeters},${lat},${lon});`)
    .join('')
  const wayQueries = tagFilters
    .map((tag) => `way${tag}(around:${radiusMeters},${lat},${lon});`)
    .join('')

  const overpassQuery =
    `[out:json][timeout:15];(${nodeQueries}${wayQueries});out center tags 200;`

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Accept: 'application/json',
        'User-Agent': 'Lahella/1.0 (community app)',
        Referer: new URL(request.url).origin,
      },
      body: new URLSearchParams({ data: overpassQuery }),
      cache: 'no-store',
    })

    const payload = await response.json().catch(() => null)

    if (!response.ok) {
      console.error('Overpass returned', response.status, payload)
      return NextResponse.json(
        { error: `Overpass API error (${response.status})` },
        { status: 502 }
      )
    }

    const places = (Array.isArray(payload?.elements) ? payload.elements : [])
      .map((element: OSMElement, index: number) => {
        const latitude = element.lat ?? element.center?.lat
        const longitude = element.lon ?? element.center?.lon
        const tags = element.tags ?? {}
        const name = tags.name

        if (
          !Number.isFinite(latitude) ||
          !Number.isFinite(longitude) ||
          !name
        ) {
          return null
        }

        const categoryName = osmCategory(tags)
        const address = [tags['addr:street'], tags['addr:housenumber']]
          .filter(Boolean)
          .join(' ')

        return {
          id: `osm-${element.id ?? index}`,
          name,
          category: categoryName,
          address: address || null,
          location_city: tags['addr:city'] || null,
          latitude: Number(latitude),
          longitude: Number(longitude),
          distance_meters: distanceMeters(
            lat,
            lon,
            Number(latitude),
            Number(longitude)
          ),
        }
      })
      .filter(
        (
          place
        ): place is {
          id: string
          name: string
          category: string
          address: string | null
          location_city: string | null
          latitude: number
          longitude: number
          distance_meters: number
        } => place !== null
      )
      .sort((a, b) => a.distance_meters - b.distance_meters)

    return NextResponse.json({
      places,
      center: { latitude: lat, longitude: lon },
      count: places.length,
    })
  } catch (error) {
    console.error('Direct Overpass request failed:', error)
    return NextResponse.json(
      { error: 'Overpass API -haku epäonnistui.' },
      { status: 502 }
    )
  }
}
