import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { AppShell } from "@/components/app-shell/app-shell"
import { ListingContactView } from "@/components/listings/listing-contact-view"
import { createClient } from "@/lib/supabase/server"

type Props = { params: Promise<{ id: string }> }

export default async function ContactPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: contact } = await supabase
    .from("listing_contacts")
    .select("id,owner_id,participant_id,play_listing_id,help_listing_id,closed_at")
    .eq("id", id)
    .maybeSingle()

  if (!contact) notFound()

  const listing = contact.play_listing_id
    ? await supabase.from("play_listings").select("id,title,description").eq("id", contact.play_listing_id).maybeSingle()
    : await supabase.from("help_listings").select("id,title,description").eq("id", contact.help_listing_id).maybeSingle()

  const otherUserId = contact.owner_id === user.id ? contact.participant_id : contact.owner_id
  const { data: other } = await supabase
    .from("profiles")
    .select("display_name,avatar_url")
    .eq("id", otherUserId)
    .maybeSingle()

  return (
    <AppShell>
      <section className="mx-auto w-full max-w-3xl p-4 sm:p-6 lg:p-8">
        <Link href="/listings" className="text-sm font-semibold text-terracotta hover:underline">← Omat ilmoitukset</Link>
        <div className="mt-5 rounded-2xl border border-border bg-card p-5">
          <p className="text-sm font-semibold text-terracotta">Yhteydenotto ilmoitukseen</p>
          <h1 className="mt-1 font-serif text-2xl font-semibold text-lahella-text">{listing.data?.title ?? "Ilmoitus"}</h1>
          <p className="mt-2 text-sm text-lahella-text2">{other?.display_name ?? "Naapuri"}</p>
        </div>
        <div className="mt-4">
          <ListingContactView contactId={contact.id} currentUserId={user.id} closed={Boolean(contact.closed_at)} />
        </div>
      </section>
    </AppShell>
  )
}
