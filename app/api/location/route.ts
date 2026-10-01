import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const claims = claimsData?.claims

  if (!claims?.sub) return NextResponse.json({ error: 'Kirjautuminen vaaditaan.' }, { status: 401 })

  const body = (await request.json()) as { address?: string; radiusKm?: number }
  const address = body.address?.trim()
  if (!address) return NextResponse.json({ error: 'Anna osoite tai paikkakunta.' }, { status: 400 })

  const radiusKm = Math.min(100, Math.max(0.5, Number(body.radiusKm ?? 5)))
  const params = new URLSearchParams({
    q: address,
    format: 'jsonv2',
    limit: '1',
    countrycodes: 'fi',
    addressdetails: '1',
  })

  let geocodeResponse: Response
  try {
    geocodeResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?${params.toString()}`,
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Lahella/1.0',
          Referer: new URL(request.url).origin,
        },
        cache: 'no-store',
      }
    )
  } catch {
    return NextResponse.json({ error: 'Sijaintipalveluun ei saatu yhteyttä.' }, { status: 502 })
  }

  if (!geocodeResponse.ok) {
    return NextResponse.json({ error: 'Sijaintipalvelu ei vastannut.' }, { status: 502 })
  }

  let results: Array<{
    lat: string
    lon: string
    display_name?: string
    address?: { road?: string; house_number?: string; postcode?: string; city?: string; town?: string; municipality?: string; village?: string }
  }>

  try {
    results = (await geocodeResponse.json()) as Array<{
      lat: string
      lon: string
      address?: { city?: string; town?: string; municipality?: string; village?: string }
    }>
  } catch {
    return NextResponse.json({ error: 'Sijaintipalvelu palautti virheellisen vastauksen.' }, { status: 502 })
  }

  const result = results[0]
  if (!result) return NextResponse.json({ error: 'Sijaintia ei löytynyt.' }, { status: 404 })

  const latitude = Number(result.lat)
  const longitude = Number(result.lon)
  const city = result.address?.city ?? result.address?.town ?? result.address?.municipality ?? result.address?.village ?? address
  const street = [result.address?.road, result.address?.house_number].filter(Boolean).join(' ')
  const locationDisplay = [street, [result.address?.postcode, city].filter(Boolean).join(' ')].filter(Boolean).join(', ') || result.display_name || address
  const point = `SRID=4326;POINT(${longitude} ${latitude})`

  const { error } = await supabase.rpc('update_user_location', { new_point: point, new_city: city })
  if (error) {
    const locked = error.message.includes('Sijaintia ei voi siirtää yli 2 km')
    return NextResponse.json(
      { error: locked
        ? 'Sijaintisi on lukittu 7 päiväksi, koska sitä siirrettiin yli 2 km. Voit muuttaa sitä uudelleen lukituksen päätyttyä.'
        : 'Sijainnin tallennus epäonnistui.' },
      { status: locked ? 409 : 500 }
    )
  }

  const { error: radiusError } = await supabase
    .from('profiles')
    .update({ search_radius_km: radiusKm })
    .eq('id', claims.sub)
  if (radiusError) return NextResponse.json({ error: 'Hakualueen tallennus epäonnistui.' }, { status: 500 })

  const { error: displayError } = await supabase
    .from('profiles')
    .update({ location_display: locationDisplay })
    .eq('id', claims.sub)
  if (displayError) return NextResponse.json({ error: 'Sijainnin näyttötiedon tallennus epäonnistui.' }, { status: 500 })

  return NextResponse.json({ city, locationDisplay, latitude, longitude, radiusKm })
}
