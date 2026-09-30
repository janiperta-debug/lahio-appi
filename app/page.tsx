import { redirect } from "next/navigation"
import { AppShell } from "@/components/app-shell/app-shell"
import { NeighboursView } from "@/components/neighbours/neighbours-view"
import { createClient } from "@/lib/supabase/server"

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const [{ data: profile }, { data: playListings, error: playError }, { data: helpListings, error: helpError }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("display_name,location_city,search_radius_km")
        .eq("id", user.id)
        .maybeSingle(),
      supabase
        .from("play_listings")
        .select(
          "id,user_id,title,description,child_age_min,child_age_max,tags,location_city,created_at,profile:profiles!play_listings_user_id_fkey(display_name,avatar_url,bio,location_city)",
        )
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("help_listings")
        .select(
          "id,user_id,title,description,help_type,category,tags,location_city,created_at,profile:profiles!help_listings_user_id_fkey(display_name,avatar_url,bio,location_city)",
        )
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(50),
    ])

  if (playError) throw new Error(playError.message)
  if (helpError) throw new Error(helpError.message)

  return (
    <AppShell>
      <NeighboursView
        playListings={playListings ?? []}
        helpListings={helpListings ?? []}
        locationCity={profile?.location_city ?? null}
        radiusKm={Number(profile?.search_radius_km ?? 5)}
      />
    </AppShell>
  )
}
