"use client"

import { useState } from "react"
import { helpRequests, helpFilters } from "@/lib/demo-data"
import { RightPanel } from "./right-panel"

export function HelpView() {
  const [activeFilter, setActiveFilter] = useState("Kaikki")

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 flex flex-col gap-5">
        <h2 className="font-serif font-semibold text-xl tracking-tight text-lahella-text">
          {"Naapuriapu "}
          <span className="font-sans text-sm font-normal text-lahella-muted ml-2">
            {"Hyvinkää · 5 km"}
          </span>
        </h2>

        <div className="flex gap-2 flex-wrap lg:flex-nowrap overflow-x-auto pb-1">
          {helpFilters.map((f) => (
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
          {helpRequests.map((req) => (
            <div
              key={req.id}
              className="bg-card border border-border rounded-2xl p-4 hover:border-terracotta/20 transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="font-bold text-sm text-lahella-text">{req.title}</div>
                {req.urgent && (
                  <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full bg-[rgba(255,140,0,0.1)] text-[#e07800]">
                    {"Kiireellinen"}
                  </span>
                )}
              </div>
              <p className="text-xs text-lahella-text2 leading-relaxed mb-2">{req.desc}</p>
              <div className="flex justify-between items-center text-xs text-lahella-muted">
                <span>{`${req.authorIcon} ${req.author} · ${req.dist}`}</span>
                <span>{req.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden xl:block w-80 border-l border-border">
        <RightPanel variant="help" />
      </div>
    </div>
  )
}
