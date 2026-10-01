import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

type Props = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Kirjautuminen vaaditaan." }, { status: 401 })

  const { data, error } = await supabase
    .from("listing_messages")
    .select("id,sender_id,message,created_at")
    .eq("contact_id", id)
    .order("created_at", { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ messages: data ?? [] })
}

export async function POST(request: Request, { params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Kirjautuminen vaaditaan." }, { status: 401 })

  const body = await request.json()
  const message = typeof body.message === "string" ? body.message.trim() : ""
  if (!message) return NextResponse.json({ error: "Kirjoita viesti." }, { status: 400 })
  if (message.length > 4000) return NextResponse.json({ error: "Viesti on liian pitkä." }, { status: 400 })

  const { data, error } = await supabase
    .from("listing_messages")
    .insert({ contact_id: id, sender_id: user.id, message })
    .select("id,sender_id,message,created_at")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ message: data }, { status: 201 })
}
