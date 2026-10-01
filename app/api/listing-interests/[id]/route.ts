import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

type Props = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Kirjautuminen vaaditaan." }, { status: 401 })

  const body = await request.json()
  const status = body.status === "withdrawn" ? "withdrawn" : body.status === "accepted" ? "accepted" : body.status === "declined" ? "declined" : null
  if (!status) return NextResponse.json({ error: "Virheellinen tila." }, { status: 400 })

  const { data: interest, error: interestError } = await supabase
    .from("listing_interests")
    .select("id,status,play_listing_id,help_listing_id,user_id")
    .eq("id", id)
    .single()

  if (interestError || !interest) {
    return NextResponse.json({ error: "Kiinnostusta ei löytynyt." }, { status: 404 })
  }

  const { data: ownerListing } = interest.play_listing_id
    ? await supabase.from("play_listings").select("user_id").eq("id", interest.play_listing_id).maybeSingle()
    : await supabase.from("help_listings").select("user_id").eq("id", interest.help_listing_id).maybeSingle()

  const isOwner = ownerListing?.user_id === user.id
  const isParticipant = interest.user_id === user.id

  if (status === "withdrawn" && !isParticipant) {
    return NextResponse.json({ error: "Vain kiinnostuksen jättänyt käyttäjä voi perua sen." }, { status: 403 })
  }
  if (status !== "withdrawn" && !isOwner) {
    return NextResponse.json({ error: "Vain ilmoituksen omistaja voi käsitellä kiinnostuksen." }, { status: 403 })
  }

  const { data, error } = await supabase
    .from("listing_interests")
    .update({ status })
    .eq("id", id)
    .select("id,status,play_listing_id,help_listing_id,user_id")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  if (status === "accepted") {
    const payload = {
      play_listing_id: interest.play_listing_id,
      help_listing_id: interest.help_listing_id,
      owner_id: user.id,
      participant_id: interest.user_id,
    }

    const { data: contact, error: contactError } = await supabase
      .from("listing_contacts")
      .insert(payload)
      .select("id")
      .single()

    if (contactError && contactError.code !== "23505") {
      return NextResponse.json({ error: contactError.message }, { status: 400 })
    }

    return NextResponse.json({ interest: data, contact: contact ?? null })
  }

  return NextResponse.json({ interest: data })
}
