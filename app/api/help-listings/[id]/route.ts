import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const HELP_CATEGORIES = ["lumityöt", "kauppa-asiat", "korjaukset", "lemmikkihoito", "puutarha", "muu"]

function cleanTags(value: unknown) {
  if (!Array.isArray(value)) return []
  return value
    .filter((tag): tag is string => typeof tag === "string")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 10)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Kirjautuminen vaaditaan." }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const updates: Record<string, unknown> = {}

  if (typeof body.title === "string") updates.title = body.title.trim()
  if (typeof body.description === "string") updates.description = body.description.trim()
  if (typeof body.category === "string") {
    const category = body.category.trim().toLowerCase()
    if (!HELP_CATEGORIES.includes(category)) return NextResponse.json({ error: "Valitse kategoria." }, { status: 400 })
    updates.category = category
  }
  if (body.help_type === "request" || body.help_type === "offer") updates.help_type = body.help_type
  if (body.tags !== undefined) updates.tags = cleanTags(body.tags)
  if (body.status === "active" || body.status === "paused") updates.status = body.status

  if (typeof updates.title === "string" && !updates.title) return NextResponse.json({ error: "Otsikko ei voi olla tyhjä." }, { status: 400 })
  if (typeof updates.description === "string" && !updates.description) return NextResponse.json({ error: "Kuvaus ei voi olla tyhjä." }, { status: 400 })

  const { data, error } = await supabase
    .from("help_listings")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  if (!data) return NextResponse.json({ error: "Ilmoitusta ei löytynyt." }, { status: 404 })

  return NextResponse.json({ listing: data })
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Kirjautuminen vaaditaan." }, { status: 401 })

  const { id } = await params
  const { data, error } = await supabase
    .from("help_listings")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  if (!data) return NextResponse.json({ error: "Ilmoitusta ei löytynyt." }, { status: 404 })

  return NextResponse.json({ ok: true })
}
