"use client"

import { useState } from "react"
import { events, eventFilters } from "@/lib/demo-data"
import { RightPanel } from "./right-panel"

export function EventsView() {
  const [activeFilter, setActiveFilter] = useState("Kaikki")

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 flex flex-col gap-5">
        <h2 className="font-serif font-semibold text-xl tracking-tight text-lahella-text">
          {"Tapahtumat "}
          <span className="font-sans text-sm font-normal text-lahella-muted ml-2">
            {"Hyvinkää · tulossa"}
          </span>
        </h2>

        <div className="flex gap-2 flex-wrap lg:flex-nowrap overflow-x-auto pb-1">
          {eventFilters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap transition-all flex-shrink-0 ${
                activeFilter === f
                  ? "bg-terracotta-faint border-terracotta/15 text-terracotta"
                  : "bg-card border-border text-lahella-text2 hover:border-terracotta/15 hover:text-terracotta"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-card border border-border rounded-2xl p-4 flex gap-4 items-start hover:border-terracotta/20 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="bg-terracotta-faint rounded-xl px-3 py-2 text-center min-w-[52px] flex-shrink-0">
                <div className="font-serif text-xl font-semibold text-terracotta leading-none">
                  {event.day}
                </div>
                <div className="text-[0.65rem] font-bold text-lahella-muted uppercase">
                  {event.month}
                </div>
              </div>
              <div className="flex-1">
                <div className="font-bold text-sm text-lahella-text mb-1">{event.name}</div>
                <div className="text-xs text-lahella-muted mb-1.5">{`📍 ${event.loc}`}</div>
                <div className="flex gap-2 text-xs text-lahella-text2 flex-wrap">
                  <span>{`👥 ${event.participants} osallistujaa`}</span>
                  {event.badges.map((badge) => (
                    <span
                      key={badge}
                      className={`text-[0.65rem] font-bold px-2 py-0.5 rounded-full ${
                        badge === "Ilmainen"
                          ? "bg-sage-faint text-sage"
                          : "bg-terracotta-faint text-terracotta"
                      }`}
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden xl:block w-80 border-l border-border">
        <RightPanel variant="events" />
      </div>
    </div>
  )
}
