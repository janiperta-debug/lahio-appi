import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { AppShell } from '@/components/app-shell/app-shell'
import { ReportProfileForm } from '@/components/profile/report-profile-form'
import { createClient } from '@/lib/supabase/server'

type Props = { params: Promise<{ id: string }> }

export default async function PublicProfilePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const claims = claimsData?.claims

  if (!claims?.sub) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_url, bio, location_city, created_at')
    .eq('id', id)
    .single()

  if (!profile) notFound()

  const [{ count: playCount }, { count: helpCount }, { count: eventCount }] = await Promise.all([
    supabase.from('play_listings').select('id', { count: 'exact', head: true }).eq('user_id', id).eq('status', 'active'),
    supabase.from('help_listings').select('id', { count: 'exact', head: true }).eq('user_id', id).eq('status', 'active'),
    supabase.from('events').select('id', { count: 'exact', head: true }).eq('user_id', id).neq('status', 'cancelled'),
  ])

  const ownProfile = claims.sub === id

  return (
    <AppShell>
      <section className="mx-auto w-full max-w-3xl p-4 sm:p-6 lg:p-8">
        <Link href={ownProfile ? '/profile' : '/'} className="text-sm font-semibold text-terracotta">
          ← Takaisin
        </Link>

        <div className="mt-4 rounded-2xl border border-border bg-card p-6 text-center">
          <div className="mx-auto flex size-20 items-center justify-center overflow-hidden rounded-full border border-border bg-terracotta-faint text-2xl font-bold text-terracotta">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="size-full object-cover" />
            ) : (
              profile.display_name?.charAt(0).toUpperCase() || '?'
            )}
          </div>
          <h1 className="mt-4 font-serif text-3xl font-semibold text-lahella-text">{profile.display_name}</h1>
          {profile.bio && <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-lahella-text2">{profile.bio}</p>}
          {profile.location_city && <p className="mt-3 text-sm font-semibold text-terracotta">📍 {profile.location_city}</p>}
        </div>

        <div className="mt-4 grid grid-cols-3 overflow-hidden rounded-2xl border border-border bg-card">
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

        {!ownProfile && (
          <div className="mt-4 rounded-2xl border border-border bg-card p-5">
            <ReportProfileForm profileId={id} />
          </div>
        )}
      </section>
    </AppShell>
  )
}
