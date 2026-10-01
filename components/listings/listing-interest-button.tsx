"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Props = {
  playListingId?: string
  helpListingId?: string
  status?: string | null
}

export function ListingInterestButton({ playListingId, helpListingId, status }: Props) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  if (status === "accepted") {
    return (
      <span className="rounded-xl bg-sage-faint px-3 py-2 text-xs font-semibold text-sage">
        Yhteydenotto avattu
      </span>
    )
  }

  if (status === "pending") {
    return (
      <span className="rounded-xl bg-lahella-surface3 px-3 py-2 text-xs font-semibold text-lahella-text2">
        Kiinnostus ilmoitettu
      </span>
    )
  }

  if (status === "declined") {
    return (
      <span className="rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
        Ei tällä kertaa
      </span>
    )
  }

  async function sendInterest() {
    setBusy(true)
    setError("")
    const response = await fetch("/api/listing-interests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ play_listing_id: playListingId, help_listing_id: helpListingId }),
    })
    const data = await response.json()
    if (!response.ok) setError(data.error ?? "Kiinnostuksen ilmoittaminen epäonnistui.")
    else router.refresh()
    setBusy(false)
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={sendInterest}
        disabled={busy}
        className="rounded-xl bg-terracotta px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
      >
        {busy ? "…" : helpListingId ? "Voin auttaa" : "Olen kiinnostunut"}
      </button>
      {error && <span className="max-w-40 text-right text-[11px] text-red-600">{error}</span>}
    </div>
  )
}
