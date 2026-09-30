import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AppShell } from '@/components/app-shell/app-shell'
import { ProfileForm } from '@/components/profile/profile-form'
import { createClient } from '@/lib/supabase/server'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const claims = claimsData?.claims

  if (!claims?.sub) redirect('/login')

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, display_name, bio, search_radius_km, location_city, location_locked_until, email')
    .eq('id', claims.sub)
    .single()

  const [{ count: playCount }, { count: helpCount }, { count: eventCount }] = await Promise.all([
    supabase.from('play_listings').select('id', { count: 'exact', head: true }).eq('user_id', claims.sub),
    supabase.from('help_listings').select('id', { count: 'exact', head: true }).eq('user_id', claims.sub),
    supabase.from('events').select('id', { count: 'exact', head: true }).eq('user_id', claims.sub),
  ])

  if (error || !profile) {
    return (
      <AppShell>
        <section className="mx-auto w-full max-w-3xl p-4 sm:p-6 lg:p-8">
          <p className="rounded-2xl border border-border bg-card p-5 text-sm text-red-700">
            Profiilin lataaminen epäonnistui.
          </p>
        </section>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <section className="mx-auto w-full max-w-3xl p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-terracotta">Lähellä</p>
            <h1 className="font-serif text-3xl font-semibold text-lahella-text">Profiili</h1>
            <p className="mt-2 text-sm text-lahella-text2">Hallitse omia tietojasi ja lähialuettasi.</p>
          </div>
          <Link
            href="/listings"
            className="inline-flex w-fit rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-lahella-text2 hover:text-terracotta"
          >
            Omat ilmoitukset
          </Link>
        </div>
        <div className="mb-5 grid grid-cols-3 overflow-hidden rounded-2xl border border-border bg-card">
          {[
            ['Peliseuraa', playCount ?? 0],
            ['Naapuriapua', helpCount ?? 0],
            ['Tapahtumia', eventCount ?? 0],
          ].map(([label, count]) => (
            <div key={String(label)} className="border-r border-border p-4 text-center last:border-r-0">
              <div className="text-2xl font-bold text-terracotta">{count}</div>
              <div className="mt-1 text-xs text-lahella-muted">{label}</div>
            </div>
          ))}
        </div>
        <ProfileForm profile={profile} />
      </section>
    </AppShell>
  )
}
