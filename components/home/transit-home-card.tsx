"use client"

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"

type Departure = {
  time: string
  departure_ts: number
  delay_min: number
  headsign: string
  route_short: string
  mode: string
}

type Stop = {
  gtfs_id: string
  name: string
  distance: string
  departures: Departure[]
}

const modes: Record<string, string> = {
  BUS: "🚌",
  TRAM: "🚊",
  RAIL: "🚂",
  SUBWAY: "🚇",
  FERRY: "⛴️",
}

export function TransitHomeCard() {
  const [stops, setStops] = useState<Stop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/transit/nearby-stops?radius_km=2", {
        cache: "no-store",
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? "Lähiliikenteen haku epäonnistui.")
      }

      setStops((data.stops ?? []).slice(0, 3))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lähiliikenteen haku epäonnistui.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
    const interval = window.setInterval(() => void load(), 60000)
    return () => window.clearInterval(interval)
  }, [load])

  return (
    <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-terracotta">Arki alueella</p>
          <h2 className="mt-1 font-serif text-2xl font-semibold text-lahella-text">Lähimmät pysäkit</h2>
        </div>
        <Link href="/transit" className="text-sm font-semibold text-terracotta">Lähiliikenne →</Link>
      </div>

      {loading ? (
        <div className="rounded-xl bg-lahella-surface3 p-8 text-center text-sm text-lahella-muted">
          Haetaan lähimpiä pysäkkejä…
        </div>
      ) : error ? (
        <div className="rounded-xl bg-lahella-surface3 p-5">
          <p className="text-sm font-semibold text-lahella-text">{error}</p>
          <p className="mt-1 text-xs text-lahella-muted">
            Pysäkit perustuvat profiiliisi valittuun alueeseen.
          </p>
        </div>
      ) : stops.length === 0 ? (
        <div className="rounded-xl bg-lahella-surface3 p-8 text-center">
          <div className="text-3xl">🚏</div>
          <p className="mt-2 font-semibold text-lahella-text">Pysäkkejä ei löytynyt</p>
          <p className="mt-1 text-sm text-lahella-text2">Lähiliikenteen tiedot eivät ulotu alueellesi.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {stops.map((stop) => (
            <article key={stop.gtfs_id} className="rounded-xl border border-border p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="truncate font-semibold text-lahella-text">🚏 {stop.name}</h3>
                <span className="shrink-0 rounded-full bg-terracotta-faint px-2.5 py-1 text-xs font-bold text-terracotta">
                  {stop.distance}
                </span>
              </div>

              <div className="space-y-1.5">
                {stop.departures.slice(0, 3).map((departure, index) => {
                  const minutes = Math.max(
                    0,
                    Math.floor((departure.departure_ts - Date.now() / 1000) / 60),
                  )

                  return (
                    <div
                      key={departure.route_short + departure.departure_ts + index}
                      className="grid grid-cols-[auto_auto_1fr_auto] items-center gap-2 text-sm"
                    >
                      <span>{modes[departure.mode] ?? "🚌"}</span>
                      <span className="rounded-md bg-terracotta px-2 py-0.5 text-xs font-bold text-white">
                        {departure.route_short || "—"}
                      </span>
                      <span className="truncate text-lahella-text2">
                        → {departure.headsign || "Määränpää ei tiedossa"}
                      </span>
                      <span className={`font-bold ${minutes <= 5 ? "text-terracotta" : "text-lahella-text"}`}>
                        {minutes <= 0 ? "nyt" : minutes < 60 ? `${minutes} min` : departure.time}
                      </span>
                    </div>
                  )
                })}
              </div>
            </article>
          ))}
        </div>
      )}

      <p className="mt-4 text-xs leading-5 text-lahella-muted">
        Aikataulut haetaan reaaliaikaisesti. Sijaintina käytetään profiiliisi valittua aluetta, ei laitteen GPS-sijaintia.
      </p>
    </section>
  )
}
