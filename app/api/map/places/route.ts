import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  if (!claimsData?.claims?.sub) {
    return NextResponse.json({ error: 'Kirjautuminen vaaditaan.' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const requestedRadius = Number(searchParams.get('radius_km') ?? 25)
  const radiusKm = Math.min(50, Math.max(0.5, Number.isFinite(requestedRadius) ? requestedRadius : 25))
  const category = searchParams.get('category') ?? 'all'

  const [{ data: places, error: placesError }, { data: location, error: locationError }] = await Promise.all([
    supabase.rpc('get_map_places_discovery', {
      p_radius_km: radiusKm,
      p_category: category,
    }),
    supabase.rpc('get_my_location_coordinates'),
  ])

  if (placesError) {
    console.error('Map discovery query failed:', placesError)
    return NextResponse.json({ error: 'Karttapaikkojen haku epäonnistui.' }, { status: 502 })
  }

  if (locationError || !location?.[0]) {
    return NextResponse.json({ error: 'Sijaintia ei ole vielä määritetty.' }, { status: 400 })
  }

  const center = {
    latitude: Number(location[0].latitude),
    longitude: Number(location[0].longitude),
  }

  return NextResponse.json({
    places: places ?? [],
    center,
    radiusKm,
  })
}
