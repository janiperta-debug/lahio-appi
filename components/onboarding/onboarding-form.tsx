'use client'

import { FormEvent, useState } from 'react'

const radii = [1, 2, 3, 5, 10, 15, 25, 50]

export function OnboardingForm({
  initialName,
  initialRadius,
  initialCity,
}: {
  initialName: string
  initialRadius: number
  initialCity: string | null
}) {
  const [name, setName] = useState(initialName)
  const [radius, setRadius] = useState(String(initialRadius || 5))
  const [address, setAddress] = useState(initialCity ?? '')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      const profileResponse = await fetch('/api/profile/basic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: name.trim() }),
      })

      if (!profileResponse.ok) {
        const data = await profileResponse.json()
        throw new Error(data.error ?? 'Profiilin tallennus epäonnistui.')
      }

      const response = await fetch('/api/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: address.trim(), radiusKm: Number(radius) }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error ?? 'Sijainnin tallennus epäonnistui.')

      window.location.href = '/'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Käyttöönotto epäonnistui.')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="mt-7 space-y-5">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-lahella-text">Nimi</span>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-terracotta"
          placeholder="Etunimi tai nimimerkki"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-lahella-text">Missä asut?</span>
        <input
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-terracotta"
          placeholder="Osoite tai paikkakunta"
        />
        <span className="mt-2 block text-xs leading-5 text-lahella-muted">
          Tarkkaa sijaintipistettä ei näytetä muille käyttäjille. Sitä käytetään vain lähialueen sisältöjen löytämiseen.
        </span>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-lahella-text">Kuinka laajalta alueelta haluat löytää sisältöä?</span>
        <select
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-4 py-3"
        >
          {radii.map((value) => (
            <option key={value} value={value}>{value} km</option>
          ))}
        </select>
      </label>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <button
        disabled={saving || !name.trim() || !address.trim()}
        className="w-full rounded-xl bg-terracotta px-4 py-3 font-semibold text-white disabled:opacity-60"
      >
        {saving ? 'Otetaan käyttöön…' : 'Aloita Lähellä'}
      </button>
    </form>
  )
}
