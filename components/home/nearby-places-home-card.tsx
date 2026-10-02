import { useEffect, useState } from "react"

type Place = {
  id: string
  name: string
  label: string
  icon: string
  distance: string
}

export function NearbyPlacesHomeCard() {
  const [places, setPlaces] = useState<Place[]>([])
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true
    fetch("/api/places/nearby?radius_km=2")
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((data) => {
        if (active) setPlaces(data.places ?? [])
      })
      .catch(() => {
        if (active) setError(true)
      })
    return () => { active = false }
  }, [])

  return (
    <section className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-terracotta">Lähialueella</p>
      <div className="mt-1 flex items-baseline gap-3">
        <h2 className="font-serif text-2xl font-semibold text-lahella-text">Paikkoja</h2>
        <span className="text-sm text-lahella-text2">liikuntaa, leikkiä ja muuta</span>
      </div>

      <div className="mt-4 space-y-2">
        {error ? (
          <p className="text-sm text-lahella-text2">Paikkoja ei voitu hakea juuri nyt.</p>
        ) : places.length === 0 ? (
          <p className="text-sm text-lahella-text2">Haetaan lähialueen paikkoja…</p>
        ) : (
          places.slice(0, 5).map((place) => (
            <div key={place.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-terracotta-faint text-base">
                {place.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-lahella-text">{place.name}</p>
                <p className="text-xs text-lahella-text2">{place.label}</p>
              </div>
              <span className="shrink-0 text-sm font-semibold text-terracotta">{place.distance}</span>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
