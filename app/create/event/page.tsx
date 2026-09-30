import { redirect } from 'next/navigation'
import { AppShell } from '@/components/app-shell/app-shell'
import { EventForm } from '@/components/events/event-form'
import { createClient } from '@/lib/supabase/server'

export default async function CreateEventPage() {
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  if (!claimsData?.claims?.sub) redirect('/login')
  return <AppShell><EventForm /></AppShell>
}