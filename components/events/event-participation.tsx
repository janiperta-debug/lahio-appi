'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function EventParticipation({ eventId, initialStatus }: { eventId: string; initialStatus: string | null }) {
  const router = useRouter()
  const supabase = createClient()
  const [status, setStatus] = useState(initialStatus)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function toggle() {
    setLoading(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Kirjautuminen tarvitaan.'); setLoading(false); return }

    if (status) {
      const { error } = await supabase.from('event_participants').delete().eq('event_id', eventId).eq('user_id', user.id)
      if (error) setError(error.message)
      else setStatus(null)
    } else {
      const { error } = await supabase.from('event_participants').insert({ event_id: eventId, user_id: user.id, status: 'going' })
      if (error) setError(error.message)
      else setStatus('going')
    }
    setLoading(false)
    router.refresh()
  }

  return <div className="mt-6">
    <button onClick={toggle} disabled={loading} className={`w-full rounded-xl px-4 py-3 font-semibold disabled:opacity-60 ${status ? 'border border-border bg-background text-lahella-text' : 'bg-terracotta text-white'}`}>
      {loading ? 'Hetkinen…' : status ? 'Peruuta osallistuminen' : 'Osallistu tapahtumaan'}
    </button>
    {error && <p className="mt-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
  </div>
}
