import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const PLAY_CATEGORIES = ["leikkikaverit", "harrastukset", "seniorit", "lemmikit"]

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

  if (body.category !== undefined) {
    const category = typeof body.category === "string" ? body.category.trim().toLowerCase() : ""
    if (!PLAY_CATEGORIES.includes(category)) return NextResponse.json({ error: "Valitse kategoria." }, { status: 400 })
    const tags = cleanTags(body.tags)
    updates.tags = [category, ...tags.filter((tag) => !PLAY_CATEGORIES.includes(tag))]
  } else if (body.tags !== undefined) {
    updates.tags = cleanTags(body.tags)
  }

  if (body.child_age_min !== undefined) updates.child_age_min = body.child_age_min === "" || body.child_age_min == null ? null : Number(body.child_age_min)
  if (body.child_age_max !== undefined) updates.child_age_max = body.child_age_max === "" || body.child_age_max == null ? null : Number(body.child_age_max)
  if (body.status === "active" || body.status === "paused") updates.status = body.status

  if (typeof updates.title === "string" && !updates.title) return NextResponse.json({ error: "Otsikko ei voi olla tyhjä." }, { status: 400 })
  if (typeof updates.description === "string" && !updates.description) return NextResponse.json({ error: "Kuvaus ei voi olla tyhjä." }, { status: 400 })

  const minAge = updates.child_age_min
  const maxAge = updates.child_age_max
  if (typeof minAge === "number" && (!Number.isInteger(minAge) || minAge < 0 || minAge > 100)) return NextResponse.json({ error: "Ikäraja ei ole kelvollinen." }, { status: 400 })
  if (typeof maxAge === "number" && (!Number.isInteger(maxAge) || maxAge < 0 || maxAge > 100)) return NextResponse.json({ error: "Ikäraja ei ole kelvollinen." }, { status: 400 })
  if (typeof minAge === "number" && typeof maxAge === "number" && minAge > maxAge) return NextResponse.json({ error: "Minimi-ikä ei voi olla maksimi-ikää suurempi." }, { status: 400 })

  const { data, error } = await supabase
    .from("play_listings")
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
    .from("play_listings")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  if (!data) return NextResponse.json({ error: "Ilmoitusta ei löytynyt." }, { status: 404 })

  return NextResponse.json({ ok: true })
}
