"use client"

import { FormEvent, useEffect, useState } from "react"

type Message = {
  id: string
  sender_id: string
  message: string
  created_at: string
}

type Props = {
  contactId: string
  currentUserId: string
  closed: boolean
}

export function ListingContactView({ contactId, currentUserId, closed }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [value, setValue] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")

  async function load() {
    const response = await fetch("/api/listing-contacts/" + contactId + "/messages", { cache: "no-store" })
    const data = await response.json()
    if (response.ok) setMessages(data.messages ?? [])
    else setError(data.error ?? "Viestien lataus epäonnistui.")
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [contactId])

  async function send(event: FormEvent) {
    event.preventDefault()
    if (!value.trim() || sending || closed) return

    setSending(true)
    setError("")
    const response = await fetch("/api/listing-contacts/" + contactId + "/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: value }),
    })
    const data = await response.json()

    if (!response.ok) {
      setError(data.error ?? "Viestin lähetys epäonnistui.")
    } else {
      setMessages((current) => [...current, data.message])
      setValue("")
    }
    setSending(false)
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="max-h-[55vh] min-h-64 space-y-3 overflow-y-auto p-4">
        {loading ? (
          <p className="text-sm text-lahella-muted">Ladataan viestejä…</p>
        ) : messages.length === 0 ? (
          <div className="flex min-h-52 items-center justify-center text-center">
            <div>
              <div className="text-3xl">💬</div>
              <p className="mt-3 font-semibold text-lahella-text">Yhteydenotto on avattu</p>
              <p className="mt-1 text-sm text-lahella-text2">Sopikaa tässä tapaamisesta, käytännöistä tai yhteystietojen vaihdosta.</p>
            </div>
          </div>
        ) : (
          messages.map((item) => (
            <div key={item.id} className={item.sender_id === currentUserId ? "flex justify-end" : "flex justify-start"}>
              <div className={item.sender_id === currentUserId ? "max-w-[80%] rounded-2xl rounded-br-md bg-terracotta px-4 py-3 text-sm text-white" : "max-w-[80%] rounded-2xl rounded-bl-md bg-lahella-surface3 px-4 py-3 text-sm text-lahella-text"}>
                {item.message}
                <div className={item.sender_id === currentUserId ? "mt-1 text-right text-[10px] text-white/70" : "mt-1 text-right text-[10px] text-lahella-muted"}>
                  {new Date(item.created_at).toLocaleString("fi-FI", { day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {closed ? (
        <div className="border-t border-border bg-lahella-surface3 px-4 py-3 text-sm text-lahella-muted">Yhteydenotto on suljettu.</div>
      ) : (
        <form onSubmit={send} className="border-t border-border p-3">
          {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              maxLength={4000}
              placeholder="Kirjoita viesti…"
              className="min-w-0 flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-terracotta"
            />
            <button disabled={sending || !value.trim()} className="rounded-xl bg-terracotta px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">
              {sending ? "…" : "Lähetä"}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
