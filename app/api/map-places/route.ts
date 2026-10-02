import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const BACKEND_URL =
  process.env.LAHELLA_BACKEND_URL ||
  process.env.EXPO_PUBLIC_BACKEND_URL ||
  'https://supabase-starter-4.preview.emergentagent.com'

type BackendPlace = {
  name?: string
  category?: string
  address?: string
  city?: string
  latitude?: number
  longitude?: number
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
  const accessToken = sessionData.session?.access_token

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const lat = Number(searchParams.get('lat'))
  const lon = Number(searchParams.get('lon'))
  const radiusKm = Number(searchParams.get('radius_km') || '10')
  const category = searchParams.get('category') || 'all'

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json({ error: 'Invalid GPS coordinates' }, { status: 400 })
  }

  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    radius_km: String(Math.min(Math.max(radiusKm || 10, 1), 15)),
  })

  if (category !== 'all') params.set('category', category)

  try {
    const response = await fetch(
      `${BACKEND_URL.replace(/\/$/, '')}/api/map-places/fetch-osm?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
        cache: 'no-store',
      }
    )

    const payload = await response.json().catch(() => null)

    if (!response.ok) {
      const message =
        typeof payload?.detail === 'string'
          ? payload.detail
          : `Backend returned ${response.status}`
      return NextResponse.json(
        { error: message },
        { status: response.status >= 500 ? 502 : response.status }
      )
    }

    const places = ((payload?.places || []) as BackendPlace[])
      .filter(
        (place) =>
          Number.isFinite(place.latitude) &&
          Number.isFinite(place.longitude) &&
          typeof place.name === 'string'
      )
      .map((place, index) => ({
        id: `osm-${place.category || 'place'}-${place.latitude}-${place.longitude}-${index}`,
        name: place.name,
        category: place.category || 'other',
        address: place.address || null,
        location_city: place.city || null,
        latitude: Number(place.latitude),
        longitude: Number(place.longitude),
        distance_meters: distanceMeters(
          lat,
          lon,
          Number(place.latitude),
          Number(place.longitude)
        ),
      }))
      .sort((a, b) => a.distance_meters - b.distance_meters)

    return NextResponse.json({
      places,
      center: { latitude: lat, longitude: lon },
      count: places.length,
    })
  } catch (error) {
    console.error('Map backend request failed:', error)
    return NextResponse.json(
      { error: 'Karttapaikkojen backend-haku epäonnistui.' },
      { status: 502 }
    )
  }
}
