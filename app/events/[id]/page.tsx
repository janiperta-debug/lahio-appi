import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { AppShell } from '@/components/app-shell/app-shell'
import { createClient } from '@/lib/supabase/server'
import { EventParticipation } from '@/components/events/event-participation'

function formatDate(value: string) {
  return new Intl.DateTimeFormat('fi-FI', { weekday:'long', day:'numeric', month:'long', hour:'2-digit', minute:'2-digit' }).format(new Date(value))
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  if (!claimsData?.claims?.sub) redirect('/login')
  const { data: event } = await supabase
    .from('events')
    .select('id,title,description,category,location_address,location_city,starts_at,ends_at,max_participants,event_participants(user_id,status,profiles(display_name))')
    .eq('id', (await params).id)
    .maybeSingle()
  if (!event) notFound()
  const participants = event.event_participants ?? []
  const currentUserId = claimsData.claims.sub
  const currentParticipation = participants.find((participant: any) => participant.user_id === currentUserId)?.status ?? null
  return <AppShell><section className="mx-auto w-full max-w-3xl p-4 sm:p-6 lg:p-8">
    <Link href="/events" className="text-sm font-semibold text-terracotta">← Tapahtumat</Link>
    <article className="mt-4 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <span className="rounded-full bg-sage/10 px-3 py-1 text-xs font-semibold text-lahella-text2">{event.category || 'Tapahtuma'}</span>
      <h1 className="mt-4 font-serif text-3xl font-semibold text-lahella-text">{event.title}</h1>
      {event.description && <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-lahella-text2">{event.description}</p>}
      <div className="mt-6 space-y-2 border-t border-border pt-5 text-sm text-lahella-text2">
        <p>🗓️ {formatDate(event.starts_at)}</p>
        {event.ends_at && <p>🏁 Päättyy {formatDate(event.ends_at)}</p>}
        {event.location_address && <p>📍 {event.location_address}{event.location_city ? `, ${event.location_city}` : ''}</p>}
        <p>👥 {participants.length}{event.max_participants ? ` / ${event.max_participants}` : ''} osallistujaa</p>
      </div>
      <EventParticipation eventId={event.id} initialStatus={currentParticipation} />
      <div className="mt-7"><h2 className="font-serif text-xl font-semibold text-lahella-text">Osallistujat</h2>
        {participants.length === 0 ? <p className="mt-2 text-sm text-lahella-text2">Ei osallistujia vielä.</p> :
        <div className="mt-3 space-y-2">{participants.map((p:any)=><div key={p.user_id} className="rounded-xl bg-background px-4 py-3 text-sm text-lahella-text">{p.profiles?.display_name || 'Lähellä-käyttäjä'}</div>)}</div>}
      </div>
    </article>
  </section></AppShell>
}