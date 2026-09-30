import { redirect } from 'next/navigation'
import { AppShell } from '@/components/app-shell/app-shell'
import { EventsView } from '@/components/events/events-view'
import { createClient } from '@/lib/supabase/server'

export default async function EventsPage() {
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const claims = claimsData?.claims

  if (!claims?.sub) redirect('/login')

  const { data: events } = await supabase
    .from('events')
    .select('id,title,description,category,location_address,location_city,starts_at,ends_at,max_participants,event_participants(count)')
    .eq('status', 'active')
    .gte('starts_at', new Date().toISOString())
    .order('starts_at', { ascending: true })
    .limit(50)

  const items = (events ?? []).map((event: any) => ({
    ...event,
    participant_count: event.event_participants?.[0]?.count ?? 0,
  }))

  return <AppShell><EventsView events={items} /></AppShell>
}