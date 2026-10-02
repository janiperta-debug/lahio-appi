import { redirect } from "next/navigation"
import { AppShell } from "@/components/app-shell/app-shell"
import { HomeOverview } from "@/components/home/home-overview"
import { createClient } from "@/lib/supabase/server"

export type HomeListing = {
  type: "play" | "help"
  id: string
  title: string
  description: string
  created_at: string
  category: string | null
  help_type: string | null
  tags: string[] | null
  display_name: string | null
}

export type HomeEvent = {
  id: string
  title: string
  description: string | null
  category: string | null
  location_address: string | null
  location_city: string | null
  starts_at: string
  max_participants: number | null
  participant_count: number
}

export type HomeOverviewData = {
  location_city: string | null
  radius_km: number
  member_count: number
  listing_count: number
  event_count: number
  listings: HomeListing[]
  events: HomeEvent[]
}

export default async function Home() {
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()

  if (!claimsData?.claims?.sub) {
    redirect("/login")
  }

  const { data, error } = await supabase.rpc("get_home_overview")

  if (error) {
    throw new Error(error.message)
  }

  const overview = (data ?? {}) as Partial<HomeOverviewData>

  return (
    <AppShell>
      <HomeOverview
        data={{
          location_city: overview.location_city ?? null,
          radius_km: Number(overview.radius_km ?? 5),
          member_count: Number(overview.member_count ?? 0),
          listing_count: Number(overview.listing_count ?? 0),
          event_count: Number(overview.event_count ?? 0),
          listings: Array.isArray(overview.listings) ? overview.listings : [],
          events: Array.isArray(overview.events) ? overview.events : [],
        }}
      />
    </AppShell>
  )
}
