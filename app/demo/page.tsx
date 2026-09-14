"use client"

import { useState } from "react"
import { Topbar } from "@/components/demo/topbar"
import { Sidebar } from "@/components/demo/sidebar"
import { BottomNav } from "@/components/demo/bottom-nav"
import { BrowseView } from "@/components/demo/browse-view"
import { EventsView } from "@/components/demo/events-view"
import { HelpView } from "@/components/demo/help-view"

type ViewName = "browse" | "events" | "help"

const viewTabs: { id: ViewName; label: string }[] = [
  { id: "browse", label: "Naapurit" },
  { id: "events", label: "Tapahtumat" },
  { id: "help", label: "Naapuriapu" },
]

export default function DemoPage() {
  const [activeView, setActiveView] = useState<ViewName>("browse")

  return (
    <div className="bg-background h-dvh flex flex-col">
      <Topbar />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* View tabs (desktop) */}
          <div className="hidden lg:flex border-b border-border bg-card px-6">
            {viewTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`px-5 py-3 text-sm font-semibold border-b-2 -mb-px transition-all ${
                  activeView === tab.id
                    ? "text-terracotta border-b-terracotta"
                    : "text-lahella-muted border-b-transparent hover:text-lahella-text"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active view */}
          <div className="flex-1 flex flex-col overflow-hidden pb-16 lg:pb-0">
            {activeView === "browse" && <BrowseView />}
            {activeView === "events" && <EventsView />}
            {activeView === "help" && <HelpView />}
          </div>
        </div>
      </div>

      <BottomNav activeView={activeView} onViewChange={setActiveView} />
    </div>
  )
}
