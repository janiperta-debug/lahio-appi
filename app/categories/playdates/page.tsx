"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, MapPin, Clock, Plus, Filter, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PlaydatesPage() {
  const [filter, setFilter] = useState("all")

  const playdates = [
    {
      id: 1,
      parent: "Anna",
      children: "Liisa (4v), Mikael (6v)",
      location: "Punavuori",
      distance: "0.8km",
      time: "Viikonloppuisin",
      description:
        "Etsimme leikkikavereita lapsille. Meillä on pieni piha ja paljon leluja. Vanhemmat voivat jutella kahvin ääressä.",
      interests: ["Ulkoilu", "Askartelu", "Lukeminen"],
      available: true,
    },
    {
      id: 2,
      parent: "Mikko",
      children: "Aino (5v)",
      location: "Kamppi",
      distance: "1.2km",
      time: "Arkipäivisin",
      description: "Kotona oleva isä etsii seuraa tyttärelleen. Käymme usein leikkipuistoissa ja kirjastossa.",
      interests: ["Liikunta", "Musiikki"],
      available: true,
    },
    {
      id: 3,
      parent: "Sari",
      children: "Ville (3v), Emma (7v)",
      location: "Ullanlinna",
      distance: "1.5km",
      time: "Iltapäivisin",
      description: "Rauhallinen perhe etsii mukavia leikkikavereita. Pidämme luonnosta ja rauhallisista leikeistä.",
      interests: ["Luonto", "Käsityöt"],
      available: false,
    },
  ]

  const filteredPlaydates = playdates.filter((playdate) => {
    if (filter === "available") return playdate.available
    if (filter === "nearby") return Number.parseFloat(playdate.distance) <= 1
    return true
  })

  return (
    <div className="min-h-screen bg-cyan-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-cyan-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Takaisin etusivulle
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 font-sans mb-2">Leikkikaverit</h1>
              <p className="text-slate-600 leading-relaxed">
                Löydä turvallisia leikkikavereita lapsillesi lähialueelta
              </p>
            </div>
            <Button className="bg-cyan-800 hover:bg-cyan-900 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Lisää ilmoitus
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6">
          <Filter className="w-4 h-4 text-slate-600" />
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className={
                filter === "all"
                  ? "bg-cyan-800 hover:bg-cyan-900 text-white"
                  : "border-slate-300 text-slate-600 hover:bg-slate-50 bg-transparent"
              }
            >
              Kaikki
            </Button>
            <Button
              variant={filter === "available" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("available")}
              className={
                filter === "available"
                  ? "bg-cyan-800 hover:bg-cyan-900 text-white"
                  : "border-slate-300 text-slate-600 hover:bg-slate-50 bg-transparent"
              }
            >
              Saatavilla
            </Button>
            <Button
              variant={filter === "nearby" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("nearby")}
              className={
                filter === "nearby"
                  ? "bg-cyan-800 hover:bg-cyan-900 text-white"
                  : "border-slate-300 text-slate-600 hover:bg-slate-50 bg-transparent"
              }
            >
              Lähellä
            </Button>
          </div>
        </div>

        {/* Playdates List */}
        <div className="space-y-4">
          {filteredPlaydates.map((playdate) => (
            <Card key={playdate.id} className="bg-white border-slate-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-cyan-800" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-slate-800 font-sans">{playdate.parent}</CardTitle>
                        <CardDescription className="text-slate-600">{playdate.children}</CardDescription>
                      </div>
                    </div>
                  </div>
                  <Badge variant={playdate.available ? "default" : "secondary"} className="ml-4">
                    {playdate.available ? "Saatavilla" : "Ei saatavilla"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-slate-700 leading-relaxed">{playdate.description}</p>

                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {playdate.location} • {playdate.distance}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {playdate.time}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {playdate.interests.map((interest) => (
                    <Badge key={interest} variant="outline" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-cyan-800 text-cyan-800 hover:bg-cyan-50 bg-transparent"
                  >
                    Näytä profiili
                  </Button>
                  <Button size="sm" className="bg-cyan-800 hover:bg-cyan-900 text-white">
                    Ota yhteyttä
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPlaydates.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">Ei leikkikavereita</h3>
            <p className="text-slate-500 mb-4">Valituilla suodattimilla ei löytynyt leikkikavereita.</p>
            <Button
              onClick={() => setFilter("all")}
              variant="outline"
              className="border-cyan-800 text-cyan-800 hover:bg-cyan-50 bg-transparent"
            >
              Näytä kaikki
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
