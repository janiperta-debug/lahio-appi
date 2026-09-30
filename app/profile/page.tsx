import { redirect } from 'next/navigation'
import { AppShell } from '@/components/app-shell/app-shell'
import { ProfileForm } from '@/components/profile/profile-form'
import { createClient } from '@/lib/supabase/server'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { claims } } = await supabase.auth.getClaims()

  if (!claims?.sub) redirect('/login')

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, display_name, bio, search_radius_km, location_city, email')
    .eq('id', claims.sub)
    .single()

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
        <div className="mb-6">
          <p className="text-sm font-semibold text-terracotta">Lähellä</p>
          <h1 className="font-serif text-3xl font-semibold text-lahella-text">Profiili</h1>
          <p className="mt-2 text-sm text-lahella-text2">Hallitse omia tietojasi ja lähialuettasi.</p>
        </div>
        <ProfileForm profile={profile} />
      </section>
    </AppShell>
  )
}
