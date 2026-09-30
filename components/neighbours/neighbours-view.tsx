"use client"

import Link from "next/link"
import { RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"

type Profile = {
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  location_city: string | null
}

type PlayListing = {
  id: string
  user_id: string
  title: string
  description: string
  child_age_min: number | null
  child_age_max: number | null
  tags: string[] | null
  location_city: string | null
  created_at: string
  profile: Profile | null
}

type HelpListing = {
  id: string
  user_id: string
  title: string
  description: string
  help_type: "request" | "offer"
  category: string | null
  tags: string[] | null
  location_city: string | null
  created_at: string
  profile: Profile | null
}

type Props = {
  playListings: PlayListing[]
  helpListings: HelpListing[]
  locationCity: string | null
  radiusKm: number
}

const PLAY_CATEGORIES = [
  { key: "all", emoji: "", label: "Kaikki" },
  { key: "leikkikaverit", emoji: "🧒", label: "Leikkikaverit" },
  { key: "harrastukset", emoji: "🌱", label: "Harrastukset" },
  { key: "seniorit", emoji: "👴", label: "Seniorit" },
  { key: "lemmikit", emoji: "🐕", label: "Lemmikit" },
]

const HELP_CATEGORIES = [
  { key: "all", emoji: "", label: "Kaikki" },
  { key: "lumityöt", emoji: "🌨️", label: "Lumityöt" },
  { key: "kauppa-asiat", emoji: "🛒", label: "Kauppa-asiat" },
  { key: "korjaukset", emoji: "🔧", label: "Korjaukset" },
  { key: "lemmikkihoito", emoji: "🐕", label: "Lemmikkihoito" },
  { key: "puutarha", emoji: "🌱", label: "Puutarha" },
]

function getTimeAgo(value: string) {
  const diff = Math.max(0, Date.now() - new Date(value).getTime())
  const hours = Math.floor(diff / (1000 * 60 * 60))

  if (hours < 24) return "Tänään"
  const days = Math.floor(hours / 24)
  if (days === 1) return "Eilen"
  return `${days} päivää sitten`
}

function initials(name: string | null | undefined) {
  return (name?.trim().charAt(0) || "?").toUpperCase()
}

export function NeighboursView({
  playListings,
  helpListings,
  locationCity,
  radiusKm,
}: Props) {
  const router = useRouter()
  const [section, setSection] = useState<"neighbours" | "help">("neighbours")
  const [category, setCategory] = useState("all")
  const [refreshing, setRefreshing] = useState(false)

  const listings = useMemo(() => {
    if (section === "neighbours") {
      return playListings.filter(
        (item) => category === "all" || item.tags?.includes(category),
      )
    }

    return helpListings.filter(
      (item) => category === "all" || item.category === category,
    )
  }, [category, helpListings, playListings, section])

  const categories =
    section === "neighbours" ? PLAY_CATEGORIES : HELP_CATEGORIES

  const neighbourCount = new Set(
    [...playListings, ...helpListings].map((item) => item.user_id),
  ).size

  const refresh = () => {
    setRefreshing(true)
    router.refresh()
    window.setTimeout(() => setRefreshing(false), 700)
  }

  return (
    <section className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-terracotta">Lähelläsi</p>
          <h1 className="font-serif text-3xl font-semibold text-lahella-text">
            {section === "neighbours" ? "Naapurit" : "Naapuriapu"}
          </h1>
          <p className="mt-2 text-sm text-lahella-text2">
            {locationCity || "Lähialue"} · {radiusKm} km säteellä
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/create/listing?type=${section === "help" ? "help" : "play"}`}
            className="rounded-xl bg-terracotta px-4 py-2.5 text-sm font-semibold text-white"
          >
            + {section === "help" ? "Pyydä tai tarjoa apua" : "Luo ilmoitus"}
          </Link>
          <button
            type="button"
            onClick={refresh}
            aria-label="Päivitä"
            className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-lahella-text2 transition-colors hover:text-terracotta"
          >
            <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="mb-3 grid grid-cols-2 rounded-2xl bg-lahella-surface3 p-1">
        <button
          type="button"
          onClick={() => {
            setSection("neighbours")
            setCategory("all")
          }}
          className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
            section === "neighbours"
              ? "bg-card text-terracotta shadow-sm"
              : "text-lahella-muted hover:text-lahella-text2"
          }`}
        >
          Naapurit
        </button>
        <button
          type="button"
          onClick={() => {
            setSection("help")
            setCategory("all")
          }}
          className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
            section === "help"
              ? "bg-card text-terracotta shadow-sm"
              : "text-lahella-muted hover:text-lahella-text2"
          }`}
        >
          Naapuriapu
        </button>
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {categories.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setCategory(item.key)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              category === item.key
                ? "bg-terracotta text-white"
                : "bg-lahella-surface3 text-lahella-text2 hover:bg-terracotta-faint"
            }`}
          >
            {item.emoji ? `${item.emoji} ` : ""}
            {item.label}
          </button>
        ))}
      </div>

      {listings.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card px-6 py-14 text-center">
          <div className="text-4xl">🌿</div>
          <h2 className="mt-4 font-serif text-xl font-semibold text-lahella-text">
            Ei ilmoituksia vielä
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-lahella-text2">
            Kun lähialueellasi julkaistaan ilmoituksia, ne näkyvät tässä.
          </p>
          <Link
            href={`/create/listing?type=${section === "help" ? "help" : "play"}`}
            className="mt-5 inline-flex rounded-xl bg-terracotta px-5 py-3 text-sm font-semibold text-white"
          >
            + Luo ensimmäinen ilmoitus
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {listings.map((item) => {
            const profile = item.profile
            const name = profile?.display_name || "Naapuri"
            const city = profile?.location_city || item.location_city
            const tags = item.tags?.slice(0, 3) || []
            const urgent =
              section === "help" &&
              item.help_type === "request" &&
              tags.some((tag) => tag.toLowerCase() === "kiireellinen")

            return (
              <article
                key={item.id}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  {profile?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.avatar_url}
                      alt=""
                      className="size-11 rounded-full border border-border object-cover"
                    />
                  ) : (
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-terracotta-faint2 text-base font-bold text-terracotta">
                      {initials(name)}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-lahella-text">
                      {name}
                    </p>
                    <p className="truncate text-xs text-lahella-muted">
                      {profile?.bio || city || "Lähialueen naapuri"}
                    </p>
                  </div>

                  {section === "help" && (
                    <span className="shrink-0 rounded-full bg-sage-faint px-2.5 py-1 text-xs font-semibold text-sage">
                      {item.help_type === "offer" ? "Tarjoaa apua" : "Pyytää apua"}
                    </span>
                  )}
                </div>

                <h2 className="mt-4 font-serif text-xl font-semibold text-lahella-text">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-lahella-text2">
                  {item.description}
                </p>

                {tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-lg bg-lahella-surface3 px-2.5 py-1 text-xs font-semibold text-lahella-text2"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {urgent && (
                  <span className="mt-3 inline-flex rounded-lg bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600">
                    Kiireellinen
                  </span>
                )}

                <div className="mt-4 border-t border-border pt-3 text-xs text-lahella-muted">
                  {getTimeAgo(item.created_at)}
                </div>
              </article>
            )
          })}
        </div>
      )}

      <div className="mt-5 rounded-2xl border border-border bg-card p-5">
        <h2 className="font-serif text-lg font-semibold text-lahella-text">
          Lähialueen tilanne
        </h2>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-lahella-surface2 p-3 text-center">
            <p className="text-2xl font-semibold text-terracotta">{neighbourCount}</p>
            <p className="mt-1 text-xs text-lahella-muted">Naapureita</p>
          </div>
          <div className="rounded-xl bg-lahella-surface2 p-3 text-center">
            <p className="text-2xl font-semibold text-terracotta">
              {playListings.length + helpListings.length}
            </p>
            <p className="mt-1 text-xs text-lahella-muted">Ilmoituksia</p>
          </div>
          <div className="rounded-xl bg-lahella-surface2 p-3 text-center">
            <p className="text-2xl font-semibold text-terracotta">{radiusKm}</p>
            <p className="mt-1 text-xs text-lahella-muted">Km säde</p>
          </div>
        </div>
      </div>
    </section>
  )
}
