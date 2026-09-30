"use client"

import Link from "next/link"
import { FormEvent, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

const PLAY_CATEGORIES = [
  ["leikkikaverit", "🧒 Leikkikaverit"],
  ["harrastukset", "🌱 Harrastukset"],
  ["seniorit", "👴 Seniorit"],
  ["lemmikit", "🐕 Lemmikit"],
] as const

const HELP_CATEGORIES = [
  ["lumityöt", "🌨️ Lumityöt"],
  ["kauppa-asiat", "🛒 Kauppa-asiat"],
  ["korjaukset", "🔧 Korjaukset"],
  ["lemmikkihoito", "🐕 Lemmikkihoito"],
  ["puutarha", "🌱 Puutarha"],
  ["muu", "Muu"],
] as const

type Listing = {
  id: string
  title: string
  description: string
  category: string | null
  tags: string[] | null
  help_type: "request" | "offer" | null
  child_age_min: number | null
  child_age_max: number | null
}

type Props = {
  type: "play" | "help"
  listing?: Listing | null
}

export function ListingForm({ type, listing }: Props) {
  const router = useRouter()
  const isHelp = type === "help"
  const editing = Boolean(listing)

  const playCategory = listing?.category || listing?.tags?.find((tag) =>
    PLAY_CATEGORIES.some(([key]) => key === tag),
  ) || "leikkikaverit"

  const [title, setTitle] = useState(listing?.title ?? "")
  const [description, setDescription] = useState(listing?.description ?? "")
  const [category, setCategory] = useState(listing?.category ?? (isHelp ? "muu" : playCategory))
  const [helpType, setHelpType] = useState<"request" | "offer">(listing?.help_type ?? "request")
  const [minAge, setMinAge] = useState(listing?.child_age_min != null ? String(listing.child_age_min) : "")
  const [maxAge, setMaxAge] = useState(listing?.child_age_max != null ? String(listing.child_age_max) : "")
  const initialTags = useMemo(() => {
    if (!listing?.tags) return ""
    const categoryTags = new Set([...PLAY_CATEGORIES.map(([key]) => key), ...HELP_CATEGORIES.map(([key]) => key)])
    return listing.tags.filter((tag) => !categoryTags.has(tag)).join(", ")
  }, [listing])
  const [tags, setTags] = useState(initialTags)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const categories = isHelp ? HELP_CATEGORIES : PLAY_CATEGORIES

  async function submit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError("")

    const payload: Record<string, unknown> = {
      title,
      description,
      category,
      tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
    }

    if (isHelp) {
      payload.help_type = helpType
    } else {
      payload.child_age_min = minAge
      payload.child_age_max = maxAge
    }

    const endpoint = editing
      ? `/api/${isHelp ? "help-listings" : "play-listings"}/${listing!.id}`
      : `/api/${isHelp ? "help-listings" : "play-listings"}`

    try {
      const response = await fetch(endpoint, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error ?? "Ilmoituksen tallennus epäonnistui.")

      router.push("/listings")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ilmoituksen tallennus epäonnistui.")
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="font-semibold text-lahella-text">{isHelp ? "Naapuriapu" : "Naapuri-ilmoitus"}</h2>
        <p className="mt-1 text-sm leading-6 text-lahella-text2">
          {isHelp
            ? "Kerro, tarvitsetko apua vai haluatko tarjota sitä lähialueellasi."
            : "Kerro millaista seuraa, tekemistä tai yhteistä harrastusta etsit."}
        </p>

        {isHelp && (
          <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-lahella-surface3 p-1">
            <button
              type="button"
              onClick={() => setHelpType("request")}
              className={`rounded-lg px-3 py-2.5 text-sm font-semibold ${helpType === "request" ? "bg-card text-terracotta shadow-sm" : "text-lahella-muted"}`}
            >
              🙋 Pyydän apua
            </button>
            <button
              type="button"
              onClick={() => setHelpType("offer")}
              className={`rounded-lg px-3 py-2.5 text-sm font-semibold ${helpType === "offer" ? "bg-card text-sage shadow-sm" : "text-lahella-muted"}`}
            >
              🤝 Tarjoan apua
            </button>
          </div>
        )}

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-lahella-text">Otsikko</span>
            <input
              required
              maxLength={120}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-terracotta"
              placeholder={isHelp ? "Esim. Apua lumitöihin" : "Esim. Leikkiseuraa 5-vuotiaalle"}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-lahella-text">Kuvaus</span>
            <textarea
              required
              rows={5}
              maxLength={2000}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-terracotta"
              placeholder="Kerro hieman tarkemmin…"
            />
          </label>

          <div>
            <span className="mb-2 block text-sm font-semibold text-lahella-text">Kategoria</span>
            <div className="flex flex-wrap gap-2">
              {categories.map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCategory(key)}
                  className={`rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${category === key ? "bg-terracotta text-white" : "bg-lahella-surface3 text-lahella-text2 hover:bg-terracotta-faint"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {!isHelp && (
            <div className="grid grid-cols-2 gap-3">
              <label>
                <span className="mb-1.5 block text-sm font-semibold text-lahella-text">Ikä vähintään</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={minAge}
                  onChange={(event) => setMinAge(event.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-terracotta"
                  placeholder="0"
                />
              </label>
              <label>
                <span className="mb-1.5 block text-sm font-semibold text-lahella-text">Ikä enintään</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={maxAge}
                  onChange={(event) => setMaxAge(event.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-terracotta"
                  placeholder="10"
                />
              </label>
            </div>
          )}

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-lahella-text">Lisätagit <span className="font-normal text-lahella-muted">(pilkuilla eroteltuna)</span></span>
            <input
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              maxLength={300}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-terracotta"
              placeholder="esim. lautapelit, ulkoilu, viikonloppu"
            />
          </label>
        </div>
      </div>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link href="/listings" className="rounded-xl border border-border bg-card px-5 py-3 text-center text-sm font-semibold text-lahella-text2">
          Peruuta
        </Link>
        <button disabled={saving} className="rounded-xl bg-terracotta px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
          {saving ? "Tallennetaan…" : editing ? "Tallenna muutokset" : "Julkaise ilmoitus"}
        </button>
      </div>
    </form>
  )
}
