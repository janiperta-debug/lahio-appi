'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'

type Profile = {
  id: string
  display_name: string
  bio: string | null
  search_radius_km: number | null
  location_city: string | null
  location_locked_until: string | null
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
  const locationLocked = !!profile.location_locked_until && new Date(profile.location_locked_until) > new Date()
  const lockDate = profile.location_locked_until ? new Date(profile.location_locked_until).toLocaleDateString('fi-FI') : null

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

  async function logout() {
    setError(''); setMessage('')
    const { error } = await supabase.auth.signOut()
    if (error) setError('Uloskirjautuminen epäonnistui.')
    else window.location.href = '/login'
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
          {profile.location_city && <p className="text-sm text-lahella-text2">Nykyinen sijainti: <span className="font-semibold text-lahella-text">{profile.location_city}</span></p>}
          {locationLocked && <p className="rounded-xl bg-terracotta-faint px-4 py-3 text-sm leading-5 text-lahella-text2">Sijainti on lukittu {lockDate} asti, koska sitä siirrettiin yli 2 km. Hakualueen voit silti vaihtaa.</p>}
          <input value={address} onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-3"
            placeholder="Osoite tai paikkakunta" />
          <button type="button" onClick={saveLocation} disabled={locating || !address.trim() || locationLocked}
            className="w-full rounded-xl border border-terracotta px-4 py-3 font-semibold text-terracotta disabled:opacity-50">
            {locating ? 'Haetaan sijaintia…' : locationLocked ? 'Sijainti lukittu' : 'Päivitä sijainti'}
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-red-100 bg-red-50/60 p-5">
        <h2 className="font-semibold text-lahella-text">Kirjautuminen</h2>
        <p className="mt-1 text-sm text-lahella-text2">Voit kirjautua ulos tällä laitteella milloin tahansa.</p>
        <button type="button" onClick={logout} className="mt-4 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100">
          Kirjaudu ulos
        </button>
      </section>

      {(message || error) && (
        <p className={`rounded-xl px-4 py-3 text-sm ${error ? 'bg-red-50 text-red-700' : 'bg-sage/10 text-lahella-text2'}`}>
          {error || message}
        </p>
      )}
    </div>
  )
}
