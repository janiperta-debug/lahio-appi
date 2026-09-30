'use client'

import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Mode = 'login' | 'register'

export function AuthForm({ mode }: { mode: Mode }) {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else window.location.href = '/'
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      })

      if (error) setError(error.message)
      else if (data.session) window.location.href = '/'
      else setMessage('Tarkista sähköpostisi ja vahvista tilisi ennen kirjautumista.')
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-lahella-bg px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center">
        <section className="w-full rounded-3xl border border-border bg-card p-7 shadow-sm sm:p-9">
          <p className="text-sm font-semibold text-terracotta">Lähellä</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-lahella-text">
            {mode === 'login' ? 'Tervetuloa takaisin' : 'Liity Lähelle'}
          </h1>
          <p className="mt-2 text-sm leading-6 text-lahella-text2">
            {mode === 'login'
              ? 'Kirjaudu sisään jatkaaksesi.'
              : 'Luo tili ja löydä ihmisiä, tapahtumia ja naapuriapua läheltäsi.'}
          </p>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium text-lahella-muted">tai sähköpostilla</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-lahella-text">Nimi</span>
                <input required value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-terracotta"
                  placeholder="Etunimi tai nimimerkki" />
              </label>
            )}
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-lahella-text">Sähköposti</span>
              <input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-terracotta" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-lahella-text">Salasana</span>
              <input required type="password" minLength={6}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-terracotta" />
            </label>

            {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            {message && <p className="rounded-xl bg-sage/10 px-4 py-3 text-sm text-lahella-text2">{message}</p>}

            <button disabled={loading}
              className="w-full rounded-xl bg-terracotta px-4 py-3 font-semibold text-white disabled:opacity-60">
              {loading ? 'Hetkinen…' : mode === 'login' ? 'Kirjaudu' : 'Luo tili'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-lahella-text2">
            {mode === 'login' ? 'Eikö sinulla ole vielä tiliä?' : 'Onko sinulla jo tili?'}{' '}
            <Link href={mode === 'login' ? '/register' : '/login'} className="font-semibold text-terracotta hover:underline">
              {mode === 'login' ? 'Luo tili' : 'Kirjaudu'}
            </Link>
          </p>
        </section>
      </div>
    </main>
  )
}
