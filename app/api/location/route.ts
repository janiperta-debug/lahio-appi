import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { claims } } = await supabase.auth.getClaims()

  if (!claims?.sub) {
    return NextResponse.json({ error: 'Kirjautuminen vaaditaan.' }, { status: 401 })
  }

  const body = (await request.json()) as { address?: string; radiusKm?: number }
  const address = body.address?.trim()

  if (!address) {
    return NextResponse.json({ error: 'Anna osoite tai paikkakunta.' }, { status: 400 })
  }

  const radiusKm = Math.min(100, Math.max(0.5, Number(body.radiusKm ?? 5)))
  const params = new URLSearchParams({
    q: address, format: 'json', limit: '1', countrycodes: 'fi', addressdetails: '1',
  })

  const geocodeResponse = await fetch(
    `https://nominatim.openstreetmap.org/search?${params.toString()}`,
    { headers: { 'User-Agent': 'Lahella/1.0' }, cache: 'no-store' }
  )

  if (!geocodeResponse.ok) {
    return NextResponse.json({ error: 'Sijainnin hakeminen epäonnistui.' }, { status: 502 })
  }

  const results = (await geocodeResponse.json()) as Array<{
    lat: string
    lon: string
    address?: { city?: string; town?: string; municipality?: string; village?: string }
  }>

  const result = results[0]
  if (!result) return NextResponse.json({ error: 'Sijaintia ei löytynyt.' }, { status: 404 })

  const latitude = Number(result.lat)
  const longitude = Number(result.lon)
  const city = result.address?.city ?? result.address?.town ?? result.address?.municipality ?? result.address?.village ?? address
  const point = `SRID=4326;POINT(${longitude} ${latitude})`

  const { error } = await supabase.rpc('update_user_location', {
    new_point: point,
    new_city: city,
  })

  if (error) return NextResponse.json({ error: 'Sijainnin tallennus epäonnistui.' }, { status: 500 })

  const { error: radiusError } = await supabase
    .from('profiles')
    .update({ search_radius_km: radiusKm })
    .eq('id', claims.sub)

  if (radiusError) return NextResponse.json({ error: 'Hakualueen tallennus epäonnistui.' }, { status: 500 })

  return NextResponse.json({ city, latitude, longitude, radiusKm })
}
