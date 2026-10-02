import Link from "next/link"
import type { HomeEvent, HomeListing, HomeOverviewData } from "@/app/page"
import { TransitHomeCard } from "@/components/home/transit-home-card"

function relativeTime(value: string) {
  const diff = Math.max(0, Date.now() - new Date(value).getTime())
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return "Juuri nyt"
  if (hours < 24) return `Tänään · ${hours} h sitten`
  const days = Math.floor(hours / 24)
  return days === 1 ? "Eilen" : `${days} päivää sitten`
}

function eventTime(value: string) {
  return new Intl.DateTimeFormat("fi-FI", {
    weekday: "short",
    day: "numeric",
    month: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))
}

function listingLabel(item: HomeListing) {
  if (item.type === "help") {
    return item.help_type === "offer" ? "Tarjoaa apua" : "Pyytää apua"
  }
  return item.tags?.find((tag) =>
    ["leikkikaverit", "harrastukset", "seniorit", "lemmikit"].includes(tag),
  ) ?? "Naapuri-ilmoitus"
}

function listingIcon(item: HomeListing) {
  if (item.type === "help") return item.help_type === "offer" ? "🤝" : "🙋"
  const tag = item.tags?.find((value) =>
    ["leikkikaverit", "harrastukset", "seniorit", "lemmikit"].includes(value),
  )
  return tag === "leikkikaverit" ? "🧒" : tag === "harrastukset" ? "🌱" : tag === "seniorit" ? "👴" : tag === "lemmikit" ? "🐕" : "👋"
}

export function HomeOverview({ data }: { data: HomeOverviewData }) {
  const area = data.location_city || "Oma lähialue"
  const radius = Number.isInteger(data.radius_km) ? data.radius_km : data.radius_km.toFixed(1)

  return (
    <section className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
      <header className="mb-7">
        <p className="text-sm font-semibold text-terracotta">Lähellä</p>
        <h1 className="mt-1 font-serif text-3xl font-semibold text-lahella-text sm:text-4xl">
          Mitä alueellasi tapahtuu?
        </h1>
        <p className="mt-2 text-sm text-lahella-text2">
          {area} · {radius} km säteellä
        </p>
      </header>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="self-start h-fit rounded-2xl border border-border bg-card p-2.5 sm:p-3">
          <p className="text-xl font-semibold text-terracotta sm:text-2xl">{data.member_count}</p>
          <p className="mt-0.5 text-[0.7rem] font-semibold leading-tight text-lahella-text sm:text-xs">Liittynyttä lähialueella</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-2.5 sm:p-3">
          <p className="text-xl font-semibold text-terracotta sm:text-2xl">{data.listing_count}</p>
          <p className="mt-0.5 text-[0.7rem] font-semibold leading-tight text-lahella-text sm:text-xs">Naapuruston julkaisuja</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-2.5 sm:p-3">
          <p className="text-xl font-semibold text-terracotta sm:text-2xl">{data.event_count}</p>
          <p className="mt-0.5 text-[0.7rem] font-semibold leading-tight text-lahella-text sm:text-xs">Tulevaa tapahtumaa</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div>
          <section className="rounded-2xl border border-border bg-card p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-sage">Kalenterissa</p>
            <div className="mt-1 flex items-baseline gap-3">
              <h2 className="font-serif text-2xl font-semibold text-lahella-text">Tapahtumat</h2>
              <span className="text-sm text-lahella-text2">{data.event_count} tulossa</span>
            </div>
            {data.events.length > 0 && (
              <div className="mt-4 space-y-2">
                {data.events.slice(0, 3).map((event: HomeEvent) => (
                  <div
                    key={event.id}
                    className="rounded-xl border border-border p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-xs font-semibold text-sage">{event.category || "Tapahtuma"}</span>
                        <h3 className="mt-1 font-semibold text-lahella-text">{event.title}</h3>
                      </div>
                      <span className="shrink-0 text-xs font-semibold text-lahella-muted">{eventTime(event.starts_at)}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-lahella-text2">
                      {event.location_address && <span>📍 {event.location_address}</span>}
                      <span>👥 {event.participant_count}{event.max_participants ? ` / ${event.max_participants}` : ""}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <div className="mt-6">
        <TransitHomeCard />
      </div>
    </section>
  )
}
