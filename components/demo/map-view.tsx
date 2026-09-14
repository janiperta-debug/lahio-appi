"use client"

import { useState } from "react"
import { Search, Plus, Minus, MapPin } from "lucide-react"
import { mapPins, profiles } from "@/lib/demo-data"

const mapFilters = ["Kaikki", "🧒 Perheet", "🤝 Apu", "📅 Tapahtumat"]

export function MapView() {
  const [activeFilter, setActiveFilter] = useState("Kaikki")

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Map area */}
      <div className="flex-1 relative bg-[#f5ede2] overflow-hidden">
        {/* Grid background */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              repeating-linear-gradient(0deg, rgba(45,36,25,0.03) 0px, transparent 1px, transparent 80px),
              repeating-linear-gradient(90deg, rgba(45,36,25,0.03) 0px, transparent 1px, transparent 80px)
            `,
          }}
        />

        {/* Roads */}
        <div className="absolute w-0.5 h-full left-[40%] top-0 bg-[rgba(255,255,255,0.7)] rounded-full" />
        <div className="absolute w-0.5 h-full left-[65%] top-0 bg-[rgba(255,255,255,0.7)] rounded-full opacity-50" />
        <div className="absolute h-0.5 w-full top-[45%] left-0 bg-[rgba(255,255,255,0.7)] rounded-full" />
        <div className="absolute h-0.5 w-full top-[70%] left-0 bg-[rgba(255,255,255,0.7)] rounded-full opacity-50" />

        {/* My location */}
        <div
          className="absolute w-3.5 h-3.5 rounded-full bg-terracotta -translate-x-1/2 -translate-y-1/2"
          style={{
            left: "40%",
            top: "45%",
            boxShadow: "0 0 0 4px rgba(232,115,74,0.2), 0 0 20px rgba(232,115,74,0.3)",
          }}
        />

        {/* Map pins */}
        {mapPins.map((pin, i) => (
          <div
            key={i}
            className="absolute flex flex-col items-center cursor-pointer -translate-x-1/2 -translate-y-full"
            style={{ left: pin.left, top: pin.top }}
          >
            <div
              className={`rounded-lg px-2.5 py-1 text-[0.65rem] font-bold whitespace-nowrap shadow-md ${
                pin.variant === "terra"
                  ? "border-[1.5px] border-terracotta/40 text-terracotta bg-[#fff8f5]"
                  : "border-[1.5px] border-sage/40 text-sage bg-[#f5faf6]"
              }`}
            >
              {pin.label}
            </div>
            <div
              className={`w-2 h-2 rounded-full mt-0.5 ${
                pin.variant === "terra"
                  ? "bg-terracotta shadow-[0_0_8px_rgba(232,115,74,0.4)]"
                  : "bg-sage shadow-[0_0_8px_rgba(122,170,138,0.4)]"
              }`}
            />
          </div>
        ))}

        {/* Search */}
        <div className="absolute top-4 left-4 bg-card border border-border rounded-xl py-2.5 px-4 flex items-center gap-2 text-sm text-lahella-muted w-64 shadow-md">
          <Search size={16} />
          {"Hae lähialueeltasi..."}
        </div>

        {/* Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {[
            { icon: <Plus size={16} />, label: "Lähennä" },
            { icon: <Minus size={16} />, label: "Loitonna" },
            { icon: <MapPin size={16} />, label: "Oma sijainti" },
          ].map((ctrl) => (
            <button
              key={ctrl.label}
              className="w-9 h-9 bg-card border border-border rounded-lg flex items-center justify-center text-lahella-text2 shadow-sm"
              aria-label={ctrl.label}
            >
              {ctrl.icon}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 flex gap-2">
          {mapFilters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border shadow-sm ${
                activeFilter === f
                  ? "bg-terracotta-faint border-terracotta/30 text-terracotta"
                  : "bg-card border-border text-lahella-text2"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Map sidebar */}
      <div className="hidden xl:flex flex-col w-80 border-l border-border bg-card p-5 overflow-y-auto gap-4">
        <h3 className="font-serif text-sm font-semibold text-lahella-text">{"8 naapuria lähellä"}</h3>
        {profiles.slice(0, 3).map((p) => (
          <div key={p.id} className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-start gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-base flex-shrink-0"
                style={{ background: p.avatarBg }}
              >
                {p.avatar}
              </div>
              <div>
                <div className="font-bold text-sm text-lahella-text">{p.name}</div>
                <div className="text-xs text-terracotta font-semibold">{`📍 ${p.dist}`}</div>
              </div>
            </div>
            <div className="flex gap-1 flex-wrap">
              {p.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag.label}
                  className={`text-[0.65rem] font-semibold px-2 py-0.5 rounded-full ${
                    tag.variant === "terra"
                      ? "bg-terracotta-faint text-terracotta"
                      : tag.variant === "sage"
                        ? "bg-sage-faint text-sage"
                        : "bg-sand text-lahella-text2"
                  }`}
                >
                  {tag.label}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
