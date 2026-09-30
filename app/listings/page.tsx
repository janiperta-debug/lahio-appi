import { redirect } from "next/navigation"
import { AppShell } from "@/components/app-shell/app-shell"
import { MyListingsView } from "@/components/listings/my-listings-view"
import { createClient } from "@/lib/supabase/server"

export default async function ListingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const [{ data: playListings, error: playError }, { data: helpListings, error: helpError }] = await Promise.all([
    supabase
      .from("play_listings")
      .select("id,title,description,status,created_at,tags,child_age_min,child_age_max")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("help_listings")
      .select("id,title,description,status,created_at,category,tags,help_type")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ])

  if (playError) throw new Error(playError.message)
  if (helpError) throw new Error(helpError.message)

  const play = (playListings ?? []).map((item) => ({
    ...item,
    category: item.tags?.find((tag) => ["leikkikaverit", "harrastukset", "seniorit", "lemmikit"].includes(tag)) ?? null,
    help_type: null,
  }))

  const help = (helpListings ?? []).map((item) => ({
    ...item,
    category: item.category ?? null,
    child_age_min: null,
    child_age_max: null,
  }))

  return (
    <AppShell>
      <section className="mx-auto w-full max-w-4xl p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-terracotta">Omat sisällöt</p>
            <h1 className="font-serif text-3xl font-semibold text-lahella-text">Omat ilmoitukset</h1>
            <p className="mt-2 text-sm text-lahella-text2">Muokkaa, tauota tai poista omia ilmoituksiasi.</p>
          </div>
          <div className="flex gap-2">
            <a href="/create/listing?type=play" className="rounded-xl bg-terracotta px-4 py-2.5 text-sm font-semibold text-white">+ Ilmoitus</a>
            <a href="/create/listing?type=help" className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-lahella-text2">+ Apua</a>
          </div>
        </div>
        <MyListingsView playListings={play} helpListings={help} />
      </section>
    </AppShell>
  )
}
