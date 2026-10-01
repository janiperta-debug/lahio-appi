import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Kirjautuminen vaaditaan." }, { status: 401 })

  const body = await request.json()
  const playListingId = typeof body.play_listing_id === "string" ? body.play_listing_id : null
  const helpListingId = typeof body.help_listing_id === "string" ? body.help_listing_id : null

  if ((playListingId && helpListingId) || (!playListingId && !helpListingId)) {
    return NextResponse.json({ error: "Valitse ilmoitus." }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("listing_interests")
    .insert({
      play_listing_id: playListingId,
      help_listing_id: helpListingId,
      user_id: user.id,
    })
    .select("id,status")
    .single()

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Olet jo ilmoittanut kiinnostuksesi tähän ilmoitukseen." }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ interest: data }, { status: 201 })
}
