'use client'

import { FormEvent, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Profile = {
  id: string
  display_name: string
  bio: string | null
  search_radius_km: number | null
  location_city: string | null
  email: string | null
}

export function ProfileForm({ profile }: { profile: Profile }) {
  const supabase = createClient()
  const [name, setName] = useState(profile.display_name ?? '')
  const [bio, setBio] = useState(profile.bio ?? '')
  const [radius, setRadius] = useState(String(profile.search_radius_km ?? 5))
  const [address, setAddress] = useState(profile.location_city ?? '')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [locating, setLocating] = useState(false)

  async function saveProfile(event: FormEvent) {
    event.preventDefault()
    setSaving(true); setError(''); setMessage('')
    const { error } = await supabase.from('profiles').update({
      display_name: name.trim(),
      bio: bio.trim() || null,
      search_radius_km: Math.min(100, Math.max(0.5, Number(radius))),
    }).eq('id', profile.id)
    if (error) setError(error.message)
    else setMessage('Profiili tallennettu.')
    setSaving(false)
  }

  async function saveLocation() {
    setLocating(true); setError(''); setMessage('')
    try {
      const response = await fetch('/api/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, radiusKm: Number(radius) }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error ?? 'Sijainnin tallennus epäonnistui.')
      setMessage(`Sijainti päivitetty: ${data.city}.`)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Sijainnin tallennus epäonnistui.')
    } finally { setLocating(false) }
  }

  return (
    <div className="space-y-5">
      <form onSubmit={saveProfile} className="rounded-2xl border border-border bg-card p-5">
        <h2 className="font-semibold text-lahella-text">Profiili</h2>
        <div className="mt-4 grid gap-4">
          <label><span className="mb-1.5 block text-sm font-medium">Nimi</span>
            <input required value={name} onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3" />
          </label>
          <label><span className="mb-1.5 block text-sm font-medium">Sähköposti</span>
            <input readOnly value={profile.email ?? ''}
              className="w-full rounded-xl border border-border bg-muted px-4 py-3 text-lahella-text2" />
          </label>
          <label><span className="mb-1.5 block text-sm font-medium">Esittely</span>
            <textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3"
              placeholder="Kerro lyhyesti itsestäsi." />
          </label>
          <label><span className="mb-1.5 block text-sm font-medium">Hakualue</span>
            <select value={radius} onChange={(e) => setRadius(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3">
              {[1,2,3,5,10,15,25,50].map((value) => <option key={value} value={value}>{value} km</option>)}
            </select>
          </label>
          <button disabled={saving} className="rounded-xl bg-terracotta px-4 py-3 font-semibold text-white disabled:opacity-60">
            {saving ? 'Tallennetaan…' : 'Tallenna profiili'}
          </button>
        </div>
      </form>

      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="font-semibold text-lahella-text">Sijainti</h2>
        <p className="mt-1 text-sm leading-6 text-lahella-text2">
          Lähellä käyttää sijaintia lähialueen ihmisten, ilmoitusten ja tapahtumien löytämiseen.
          Tarkkaa sijaintipistettä ei näytetä muille käyttäjille.
        </p>
        <div className="mt-4 space-y-3">
          <input value={address} onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-3"
            placeholder="Osoite tai paikkakunta" />
          <button type="button" onClick={saveLocation} disabled={locating || !address.trim()}
            className="w-full rounded-xl border border-terracotta px-4 py-3 font-semibold text-terracotta disabled:opacity-50">
            {locating ? 'Haetaan sijaintia…' : 'Päivitä sijainti'}
          </button>
        </div>
      </section>

      {(message || error) && (
        <p className={`rounded-xl px-4 py-3 text-sm ${error ? 'bg-red-50 text-red-700' : 'bg-sage/10 text-lahella-text2'}`}>
          {error || message}
        </p>
      )}
    </div>
  )
}
