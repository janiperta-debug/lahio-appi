import { redirect } from 'next/navigation'
import { AppShell } from '@/components/app-shell/app-shell'
import { MapView } from '@/components/map/map-view'
import { createClient } from '@/lib/supabase/server'

export default async function MapPage() {
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  if (!claimsData?.claims?.sub) redirect('/login')

  const { data: location } = await supabase.rpc('get_my_location_coordinates')
  const center = location?.[0]
    ? { latitude: Number(location[0].latitude), longitude: Number(location[0].longitude) }
    : null

  return (
    <AppShell>
      <MapView places={[]} initialCenter={center} />
    </AppShell>
  )
}
