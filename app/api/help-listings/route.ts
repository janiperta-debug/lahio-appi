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

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: "Kirjautuminen vaaditaan." }, { status: 401 })

  const body = await request.json()
  const title = typeof body.title === "string" ? body.title.trim() : ""
  const description = typeof body.description === "string" ? body.description.trim() : ""
  const category = typeof body.category === "string" ? body.category.trim().toLowerCase() : ""
  const helpType = body.help_type === "offer" ? "offer" : "request"
  const tags = cleanTags(body.tags)

  if (!title || !description) {
    return NextResponse.json({ error: "Täytä otsikko ja kuvaus." }, { status: 400 })
  }
  if (!HELP_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "Valitse kategoria." }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("help_listings")
    .insert({
      user_id: user.id,
      help_type: helpType,
      title,
      description,
      category,
      tags,
    })
    .select("id")
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ listing: data }, { status: 201 })
}
