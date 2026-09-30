import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OnboardingForm } from '@/components/onboarding/onboarding-form'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const claims = claimsData?.claims

  if (!claims?.sub) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, search_radius_km, location_city, location_point')
    .eq('id', claims.sub)
    .maybeSingle()

  if (profile?.location_point) redirect('/')

  return (
    <main className="min-h-screen bg-lahella-bg px-4 py-8 sm:py-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-xl items-center">
        <section className="w-full rounded-3xl border border-border bg-card p-7 shadow-sm sm:p-9">
          <p className="text-sm font-semibold text-terracotta">Lähellä</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-lahella-text">
            Aloitetaan lähialueestasi
          </h1>
          <p className="mt-3 text-sm leading-6 text-lahella-text2">
            Kerro missä asut ja kuinka laajalta alueelta haluat löytää naapureita,
            ilmoituksia ja tapahtumia. Voit muuttaa hakualueen myöhemmin profiilissasi.
          </p>
          <OnboardingForm
            initialName={profile?.display_name ?? ''}
            initialRadius={Number(profile?.search_radius_km ?? 5)}
            initialCity={profile?.location_city ?? null}
          />
        </section>
      </div>
    </main>
  )
}
