"use client"

import { Users, Calendar, Handshake, MessageCircle, User, Settings } from "lucide-react"

type ViewName = "browse" | "events" | "help"

const browseItems = [
  { id: "browse" as const, icon: Users, label: "Naapurit", badge: null },
  { id: "events" as const, icon: Calendar, label: "Tapahtumat", badge: null },
  { id: "help" as const, icon: Handshake, label: "Naapuriapu", badge: null },
]

const personalItems = [
  { icon: MessageCircle, label: "Viestit", badge: "3" },
  { icon: User, label: "Profiili", badge: null },
  { icon: Settings, label: "Asetukset", badge: null },
]

export function Sidebar({ activeView, onViewChange }: { activeView: ViewName; onViewChange: (view: ViewName) => void }) {
  return (
    <aside className="hidden lg:flex flex-col bg-card border-r border-border py-6 gap-0.5">
      <div className="text-[0.65rem] tracking-wider uppercase text-lahella-muted px-5 pb-1 font-semibold">
        {"Selaa"}
      </div>
      {browseItems.map((item) => {
        const Icon = item.icon
        const isActive = activeView === item.id
        return (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`flex items-center gap-3 px-5 py-2.5 text-sm font-medium border-l-2 transition-all text-left ${
              isActive
                ? "text-terracotta bg-terracotta-faint border-l-terracotta font-semibold"
                : "text-lahella-text2 border-l-transparent hover:text-lahella-text hover:bg-terracotta-faint"
            }`}
          >
            <Icon size={18} />
            {item.label}
            {item.badge && (
              <span className="ml-auto bg-terracotta text-primary-foreground text-[0.6rem] font-extrabold px-1.5 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        )
      })}
      <div className="text-[0.65rem] tracking-wider uppercase text-lahella-muted px-5 pb-1 pt-4 font-semibold">
        {"Minä"}
      </div>
      {personalItems.map((item) => {
        const Icon = item.icon
        return (
          <button
            key={item.label}
            className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-lahella-text2 border-l-2 border-l-transparent hover:text-lahella-text hover:bg-terracotta-faint transition-all text-left"
          >
            <Icon size={18} />
            {item.label}
            {item.badge && (
              <span className="ml-auto bg-terracotta text-primary-foreground text-[0.6rem] font-extrabold px-1.5 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        )
      })}
    </aside>
  )
}
