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

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: "Kirjautuminen vaaditaan." }, { status: 401 })

  const body = await request.json()
  const title = typeof body.title === "string" ? body.title.trim() : ""
  const description = typeof body.description === "string" ? body.description.trim() : ""
  const category = typeof body.category === "string" ? body.category.trim().toLowerCase() : ""
  const tags = cleanTags(body.tags).filter((tag) => !PLAY_CATEGORIES.includes(tag))

  if (!title || !description) {
    return NextResponse.json({ error: "Täytä otsikko ja kuvaus." }, { status: 400 })
  }
  if (!PLAY_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "Valitse kategoria." }, { status: 400 })
  }

  const minAge = body.child_age_min === "" || body.child_age_min == null ? null : Number(body.child_age_min)
  const maxAge = body.child_age_max === "" || body.child_age_max == null ? null : Number(body.child_age_max)

  if (minAge !== null && (!Number.isInteger(minAge) || minAge < 0 || minAge > 100)) {
    return NextResponse.json({ error: "Ikäraja ei ole kelvollinen." }, { status: 400 })
  }
  if (maxAge !== null && (!Number.isInteger(maxAge) || maxAge < 0 || maxAge > 100)) {
    return NextResponse.json({ error: "Ikäraja ei ole kelvollinen." }, { status: 400 })
  }
  if (minAge !== null && maxAge !== null && minAge > maxAge) {
    return NextResponse.json({ error: "Minimi-ikä ei voi olla maksimi-ikää suurempi." }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("play_listings")
    .insert({
      user_id: user.id,
      title,
      description,
      child_age_min: minAge,
      child_age_max: maxAge,
      tags: [category, ...tags],
    })
    .select("id")
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ listing: data }, { status: 201 })
}
