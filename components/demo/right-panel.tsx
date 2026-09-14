import { activity, messages } from "@/lib/demo-data"

type PanelVariant = "browse" | "events" | "help"

export function RightPanel({ variant }: { variant: PanelVariant }) {
  if (variant === "browse") return <BrowsePanel />
  if (variant === "events") return <EventsPanel />
  return <HelpPanel />
}

function BrowsePanel() {
  return (
    <div className="bg-card p-5 overflow-y-auto h-full flex flex-col gap-5">
      <div>
        <h3 className="font-serif text-sm font-semibold text-lahella-text mb-3">{"Lähialueesi tilanne"}</h3>
        <div className="grid grid-cols-3 gap-3">
          <StatCard value="24" label="Naapuria" />
          <StatCard value="8" label="Uutta" />
          <StatCard value="5" label="Km säde" />
        </div>
      </div>

      <div>
        <h3 className="font-serif text-sm font-semibold text-lahella-text mb-3">{"Viimeinen toiminta"}</h3>
        {activity.map((a, i) => (
          <div key={i} className="flex gap-3 py-3 border-b border-border text-sm">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
              style={{ background: a.iconBg }}
            >
              {a.icon}
            </div>
            <div>
              <div className="text-lahella-text2 leading-snug">
                <strong className="text-lahella-text font-bold">{a.text}</strong>{" "}
                {a.desc}
              </div>
              <div className="text-[0.68rem] text-lahella-muted mt-0.5">{a.time}</div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="font-serif text-sm font-semibold text-lahella-text mb-3">{"Viestit"}</h3>
        {messages.map((m) => (
          <div key={m.id} className="flex items-center gap-3 py-3 border-b border-border cursor-pointer hover:bg-terracotta-faint rounded-xl px-1 transition-colors">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: m.avatarBg }}
            >
              {m.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm text-lahella-text">{m.name}</div>
              <div className="text-xs text-lahella-muted truncate">{m.preview}</div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[0.68rem] text-lahella-muted">{m.time}</span>
              {m.unread && <div className="w-2 h-2 rounded-full bg-terracotta" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function EventsPanel() {
  return (
    <div className="bg-card p-5 overflow-y-auto h-full flex flex-col gap-5">
      <div>
        <h3 className="font-serif text-sm font-semibold text-lahella-text mb-3">{"Lähiajan tapahtumat"}</h3>
        <div className="grid grid-cols-3 gap-3">
          <StatCard value="12" label="Tapahtumaa" />
          <StatCard value="3" label="Tällä viikolla" />
          <StatCard value="0€" label="Kaikki ilmaisia" />
        </div>
      </div>

      <div>
        <h3 className="font-serif text-sm font-semibold text-lahella-text mb-3">{"Ilmoittautunut"}</h3>
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex gap-3 items-center">
            <div className="bg-terracotta-faint rounded-xl px-3 py-2 text-center min-w-[44px]">
              <div className="font-serif text-xl font-semibold text-terracotta leading-none">{"26"}</div>
              <div className="text-[0.65rem] font-bold text-lahella-muted uppercase">{"Hel"}</div>
            </div>
            <div>
              <div className="font-bold text-sm text-lahella-text">{"Kävelykerho"}</div>
              <div className="text-xs text-lahella-muted">{"klo 9:00 · Kotipolku"}</div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-serif text-sm font-semibold text-lahella-text mb-3">{"Järjestä oma tapahtuma"}</h3>
        <p className="text-sm text-lahella-text2 leading-relaxed mb-3">
          {"Järjestätkö jotain lähialueella? Lisää tapahtuma ja kutsu naapurit mukaan!"}
        </p>
        <button className="bg-terracotta text-primary-foreground text-sm font-bold py-2 px-4 rounded-full w-full">
          {"+ Lisää tapahtuma"}
        </button>
      </div>
    </div>
  )
}

function HelpPanel() {
  return (
    <div className="bg-card p-5 overflow-y-auto h-full flex flex-col gap-5">
      <div>
        <h3 className="font-serif text-sm font-semibold text-lahella-text mb-3">{"Apu lähialueella"}</h3>
        <div className="grid grid-cols-3 gap-3">
          <StatCard value="18" label="Pyyntöä" />
          <StatCard value="7" label="Tarjoaa apua" />
          <StatCard value="42" label="Autettua" />
        </div>
      </div>

      <div>
        <h3 className="font-serif text-sm font-semibold text-lahella-text mb-3">{"Pyydä apua"}</h3>
        <p className="text-sm text-lahella-text2 leading-relaxed mb-3">
          {"Tarvitsetko apua? Naapurit auttavat mielellään. Kysy rohkeasti!"}
        </p>
        <button className="bg-terracotta text-primary-foreground text-sm font-bold py-2 px-4 rounded-full w-full">
          {"+ Lisää pyyntö"}
        </button>
      </div>

      <div>
        <h3 className="font-serif text-sm font-semibold text-lahella-text mb-3">{"Apua tarjoavat"}</h3>
        {[
          { icon: "👴", bg: "#e8f0e8", name: "Erkki V.", skills: "Kotityöt, lumilapiointi, puutarha", dist: "1.2 km · Aktiivinen tänään" },
          { icon: "👩", bg: "#fde8dc", name: "Liisa H.", skills: "Lastenhoito, kauppa-asiat", dist: "2.1 km · Eilen" },
          { icon: "👨", bg: "#e8ecf5", name: "Timo K.", skills: "Kyyditykset, korjaustyöt", dist: "3.4 km · 2 päivää sitten" },
        ].map((helper) => (
          <div key={helper.name} className="flex gap-3 py-3 border-b border-border text-sm">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
              style={{ background: helper.bg }}
            >
              {helper.icon}
            </div>
            <div>
              <div className="text-lahella-text2 leading-snug">
                <strong className="text-lahella-text font-bold">{helper.name}</strong>{" — "}
                {helper.skills}
              </div>
              <div className="text-[0.68rem] text-lahella-muted mt-0.5">{helper.dist}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-lahella-surface2 rounded-xl py-3 px-2 text-center">
      <div className="font-serif text-2xl font-semibold text-terracotta">{value}</div>
      <div className="text-[0.68rem] text-lahella-muted mt-0.5">{label}</div>
    </div>
  )
}
