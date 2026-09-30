"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

type Listing = {
  id: string
  title: string
  description: string
  status: "active" | "paused" | "closed" | null
  created_at: string | null
  category: string | null
  tags: string[] | null
  help_type: "request" | "offer" | null
  child_age_min: number | null
  child_age_max: number | null
}

type Props = {
  playListings: Listing[]
  helpListings: Listing[]
}

function date(value: string | null) {
  return value ? new Date(value).toLocaleDateString("fi-FI") : ""
}

export function MyListingsView({ playListings, helpListings }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<"play" | "help">("play")
  const [busy, setBusy] = useState<string | null>(null)
  const listings = tab === "play" ? playListings : helpListings

  async function updateListing(item: Listing, status: "active" | "paused") {
    setBusy(item.id)
    try {
      const response = await fetch(`/api/${tab === "play" ? "play-listings" : "help-listings"}/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error ?? "Tallennus epäonnistui.")
      }
      router.refresh()
    } finally {
      setBusy(null)
    }
  }

  async function deleteListing(item: Listing) {
    if (!window.confirm(`Poistetaanko ilmoitus "${item.title}"?`)) return
    setBusy(item.id)
    try {
      const response = await fetch(`/api/${tab === "play" ? "play-listings" : "help-listings"}/${item.id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error ?? "Poistaminen epäonnistui.")
      }
      router.refresh()
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Poistaminen epäonnistui.")
    } finally {
      setBusy(null)
    }
  }

  return (
    <div>
      <div className="mb-5 grid grid-cols-2 rounded-2xl bg-lahella-surface3 p-1">
        <button onClick={() => setTab("play")} className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${tab === "play" ? "bg-card text-terracotta shadow-sm" : "text-lahella-muted"}`}>
          🧒 Naapuri-ilmoitukset
        </button>
        <button onClick={() => setTab("help")} className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${tab === "help" ? "bg-card text-terracotta shadow-sm" : "text-lahella-muted"}`}>
          🤝 Naapuriapu
        </button>
      </div>

      {listings.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card px-6 py-14 text-center">
          <div className="text-4xl">{tab === "play" ? "🧒" : "🤝"}</div>
          <h2 className="mt-4 font-serif text-xl font-semibold text-lahella-text">Ei ilmoituksia vielä</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-lahella-text2">
            Voit julkaista ensimmäisen ilmoituksesi ja se näkyy lähialueesi naapureille.
          </p>
          <Link href={`/create/listing?type=${tab}`} className="mt-5 inline-flex rounded-xl bg-terracotta px-5 py-3 text-sm font-semibold text-white">
            + Lisää ilmoitus
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {listings.map((item) => {
            const paused = item.status === "paused"
            return (
              <article key={item.id} className={`rounded-2xl border border-border bg-card p-5 ${paused ? "opacity-70" : ""}`}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-serif text-xl font-semibold text-lahella-text">{item.title}</h2>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${paused ? "bg-amber-50 text-amber-700" : "bg-sage-faint text-sage"}`}>
                        {paused ? "Tauolla" : "Aktiivinen"}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-lahella-text2">{item.description}</p>
                    <p className="mt-3 text-xs text-lahella-muted">
                      {tab === "help" ? (item.help_type === "offer" ? "Tarjoan apua" : "Pyydän apua") : "Naapuri-ilmoitus"}
                      {item.category ? ` · ${item.category}` : ""}
                      {item.created_at ? ` · ${date(item.created_at)}` : ""}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Link href={`/create/listing?type=${tab}&edit=${item.id}`} className="rounded-lg bg-lahella-surface3 px-3 py-2 text-xs font-semibold text-lahella-text2">
                      Muokkaa
                    </Link>
                    <button
                      disabled={busy === item.id}
                      onClick={() => updateListing(item, paused ? "active" : "paused")}
                      className="rounded-lg bg-lahella-surface3 px-3 py-2 text-xs font-semibold text-lahella-text2 disabled:opacity-50"
                    >
                      {paused ? "Aktivoi" : "Tauolle"}
                    </button>
                    <button
                      disabled={busy === item.id}
                      onClick={() => deleteListing(item)}
                      className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 disabled:opacity-50"
                    >
                      Poista
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
