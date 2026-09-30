import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const claims = claimsData?.claims

  if (!claims?.sub) {
    return NextResponse.json({ error: 'Kirjautuminen vaaditaan.' }, { status: 401 })
  }

  const body = (await request.json()) as { displayName?: string }
  const displayName = body.displayName?.trim()

  if (!displayName) {
    return NextResponse.json({ error: 'Anna nimi tai nimimerkki.' }, { status: 400 })
  }

  const { error } = await supabase
    .from('profiles')
    .update({ display_name: displayName })
    .eq('id', claims.sub)

  if (error) {
    return NextResponse.json({ error: 'Profiilin tallennus epäonnistui.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
