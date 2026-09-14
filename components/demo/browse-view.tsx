"use client"

import { useState } from "react"
import { profiles, browseFilters } from "@/lib/demo-data"
import { RightPanel } from "./right-panel"

const tagVariantClasses = {
  terra: "bg-terracotta-faint text-terracotta",
  sage: "bg-sage-faint text-sage",
  sand: "bg-sand text-lahella-text2",
}

export function BrowseView() {
  const [activeFilter, setActiveFilter] = useState("Kaikki")

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 flex flex-col gap-5">
        <h2 className="font-serif font-semibold text-xl tracking-tight text-lahella-text">
          {"Naapurit "}
          <span className="font-sans text-sm font-normal text-lahella-muted ml-2">
            {"Hyvinkää · 5 km säde"}
          </span>
        </h2>

        <div className="flex gap-2 flex-wrap lg:flex-nowrap overflow-x-auto pb-1">
          {browseFilters.map((f) => (
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profiles.map((p) => (
            <div
              key={p.id}
              className="bg-card border border-border rounded-2xl p-5 hover:border-terracotta/15 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: p.avatarBg }}
                >
                  {p.avatar}
                </div>
                <div>
                  <div className="font-bold text-sm text-lahella-text">{p.name}</div>
                  <div className="text-xs text-terracotta font-semibold mt-0.5">{`📍 ${p.dist}`}</div>
                  <div className="text-[0.68rem] text-lahella-muted mt-0.5">{p.type}</div>
                </div>
              </div>
              <p className="text-sm text-lahella-text2 leading-relaxed mb-3">{p.text}</p>
              <div className="flex gap-1.5 flex-wrap mb-3">
                {p.tags.map((tag) => (
                  <span
                    key={tag.label}
                    className={`text-[0.65rem] font-semibold px-2 py-0.5 rounded-full ${tagVariantClasses[tag.variant]}`}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-border">
                <span className="text-[0.68rem] text-lahella-muted">{p.time}</span>
                <button className="bg-terracotta text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full">
                  {"Ota yhteyttä"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="hidden xl:block w-80 border-l border-border">
        <RightPanel variant="browse" />
      </div>
    </div>
  )
}
