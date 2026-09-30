'use client'

import { FormEvent, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function ReportProfileForm({ profileId }: { profileId: string }) {
  const supabase = createClient()
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!reason.trim()) return
    setSaving(true)
    setMessage('')

    const { error } = await supabase.from('reports').insert({
      reporter_id: (await supabase.auth.getUser()).data.user?.id,
      target_type: 'profile',
      target_id: profileId,
      reason: reason.trim(),
    })

    if (error) {
      setMessage('Ilmoituksen lähettäminen epäonnistui.')
    } else {
      setReason('')
      setOpen(false)
      setMessage('Ilmoitus lähetetty.')
    }
    setSaving(false)
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100"
      >
        Ilmoita käyttäjästä
      </button>

      {message && <p className="mt-3 text-sm text-lahella-text2">{message}</p>}

      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-card p-5 shadow-xl">
            <h2 className="font-serif text-xl font-semibold text-lahella-text">Ilmoita käyttäjästä</h2>
            <p className="mt-2 text-sm leading-6 text-lahella-text2">
              Kerro lyhyesti, miksi haluat ilmoittaa tästä profiilista.
            </p>
            <textarea
              required
              autoFocus
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="mt-4 w-full rounded-xl border border-border bg-background px-4 py-3"
              placeholder="Syy ilmoitukselle"
            />
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-xl border border-border px-4 py-3 text-sm font-semibold"
              >
                Peruuta
              </button>
              <button
                type="submit"
                disabled={saving || !reason.trim()}
                className="flex-1 rounded-xl bg-terracotta px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                {saving ? 'Lähetetään…' : 'Lähetä ilmoitus'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
