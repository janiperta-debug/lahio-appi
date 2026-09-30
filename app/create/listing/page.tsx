import { notFound, redirect } from "next/navigation"
import { AppShell } from "@/components/app-shell/app-shell"
import { ListingForm } from "@/components/listings/listing-form"
import { createClient } from "@/lib/supabase/server"

export default async function CreateListingPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; edit?: string }>
}) {
  const params = await searchParams
  const type = params.type === "help" ? "help" : params.type === "play" ? "play" : null

  if (!type) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  let listing = null

  if (params.edit) {
    const table = type === "play" ? "play_listings" : "help_listings"
    const { data, error } = await supabase
      .from(table)
      .select(type === "play"
        ? "id,title,description,tags,child_age_min,child_age_max"
        : "id,title,description,category,tags,help_type")
      .eq("id", params.edit)
      .eq("user_id", user.id)
      .maybeSingle()

    if (error) throw new Error(error.message)
    if (!data) notFound()

    listing = type === "play"
      ? {
          ...data,
          category: data.tags?.find((tag: string) => ["leikkikaverit", "harrastukset", "seniorit", "lemmikit"].includes(tag)) ?? null,
          help_type: null,
        }
      : {
          ...data,
          child_age_min: null,
          child_age_max: null,
        }
  }

  return (
    <AppShell>
      <section className="mx-auto w-full max-w-3xl p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <p className="text-sm font-semibold text-terracotta">{listing ? "Muokkaa ilmoitusta" : "Uusi ilmoitus"}</p>
          <h1 className="font-serif text-3xl font-semibold text-lahella-text">
            {type === "help" ? "Naapuriapu" : "Naapuri-ilmoitus"}
          </h1>
        </div>
        <ListingForm type={type} listing={listing} />
      </section>
    </AppShell>
  )
}
