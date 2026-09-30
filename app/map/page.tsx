import { redirect } from 'next/navigation'
import { AppShell } from '@/components/app-shell/app-shell'
import { MapView } from '@/components/map/map-view'
import { createClient } from '@/lib/supabase/server'

export default async function MapPage(){
  const supabase=await createClient()
  const {data:claimsData}=await supabase.auth.getClaims()
  if(!claimsData?.claims?.sub) redirect('/login')
  const {data:places,error}=await supabase.rpc('get_nearby_map_places')
  return <AppShell><MapView places={error?[]:(places??[])} /></AppShell>
}