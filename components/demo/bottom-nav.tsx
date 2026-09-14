"use client"

import { Users, Calendar, Handshake } from "lucide-react"

type ViewName = "browse" | "events" | "help"

const items = [
  { id: "browse" as const, icon: Users, label: "Naapurit" },
  { id: "events" as const, icon: Calendar, label: "Tapahtumat" },
  { id: "help" as const, icon: Handshake, label: "Apu" },
]

export function BottomNav({ activeView, onViewChange }: { activeView: ViewName; onViewChange: (view: ViewName) => void }) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex z-50 shadow-[0_-4px_16px_rgba(45,36,25,0.08)] pb-[env(safe-area-inset-bottom)]">
      {items.map((item) => {
        const Icon = item.icon
        const isActive = activeView === item.id
        return (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-[0.6rem] font-semibold relative transition-colors ${
              isActive ? "text-terracotta" : "text-lahella-muted"
            }`}
          >
            <Icon size={20} />
            {item.badge && (
              <span className="absolute top-1 right-[calc(50%-18px)] bg-terracotta text-primary-foreground text-[0.5rem] font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {item.badge}
              </span>
            )}
            <span>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
