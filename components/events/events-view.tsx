'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

type EventItem = {
  id: string
  title: string
  description: string | null
  category: string | null
  location_address: string | null
  location_city: string | null
  starts_at: string
  ends_at: string | null
  max_participants: number | null
  participant_count: number
}

const categories = [
  ['all', 'Kaikki'],
  ['lapsille', 'Lapsille'],
  ['liikunta', 'Liikunta'],
  ['kulttuuri', 'Kulttuuri'],
  ['kokoontuminen', 'Kokoontuminen'],
]

function formatDate(value: string) {
  return new Intl.DateTimeFormat('fi-FI', {
    weekday: 'short',
    day: 'numeric',
    month: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function EventsView({ events }: { events: EventItem[] }) {
  const [category, setCategory] = useState('all')

  const filtered = useMemo(
    () => category === 'all' ? events : events.filter((event) => event.category === category),
    [events, category]
  )

  return (
    <section className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-terracotta">Lähellä</p>
          <h1 className="font-serif text-3xl font-semibold text-lahella-text">Tapahtumat</h1>
          <p className="mt-2 text-sm text-lahella-text2">Tapahtumat lähialueeltasi.</p>
        </div>
        <Link href="/create/event" className="rounded-xl bg-terracotta px-4 py-3 text-center text-sm font-semibold text-white">
          + Luo tapahtuma
        </Link>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {categories.map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setCategory(value)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${category === value ? 'bg-terracotta text-white' : 'bg-white text-lahella-text2 ring-1 ring-border'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <p className="font-serif text-xl font-semibold text-lahella-text">Ei tapahtumia vielä</p>
          <p className="mt-2 text-sm text-lahella-text2">Luo ensimmäinen tapahtuma alueellesi.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`} className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between gap-4">
                <span className="rounded-full bg-sage/10 px-3 py-1 text-xs font-semibold text-lahella-text2">
                  {event.category || 'Tapahtuma'}
                </span>
                <span className="text-xs text-lahella-muted">{formatDate(event.starts_at)}</span>
              </div>
              <h2 className="mt-4 font-serif text-xl font-semibold text-lahella-text">{event.title}</h2>
              {event.description && <p className="mt-2 line-clamp-2 text-sm leading-6 text-lahella-text2">{event.description}</p>}
              <div className="mt-4 space-y-1 text-sm text-lahella-text2">
                {event.location_address && <p>📍 {event.location_address}{event.location_city ? `, ${event.location_city}` : ''}</p>}
                <p>👥 {event.participant_count}{event.max_participants ? ` / ${event.max_participants}` : ''} osallistujaa</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
