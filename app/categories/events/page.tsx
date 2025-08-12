"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Plus, Filter, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EventsPage() {
  const [filter, setFilter] = useState("all")

  const events = [
    {
      id: 1,
      title: "Kirjastossa lukupiiri",
      organizer: "Kaisa",
      date: "La 15.2. klo 14:00",
      location: "Rikhardinkadun kirjasto",
      distance: "0.6km",
      participants: "3/8",
      description: "Rauhallinen lukupiiri aikuisille. Luemme suomalaista kirjallisuutta ja keskustelemme hiljaa.",
      category: "Kulttuuri",
      upcoming: true,
    },
    {
      id: 2,
      title: "Kävelykierros Kaivopuistossa",
      organizer: "Matti",
      date: "Su 16.2. klo 11:00",
      location: "Kaivopuisto",
      distance: "1.2km",
      participants: "5/10",
      description: "Rauhallinen kävelykierros puistossa. Sopii kaikenikäisille. Pysähdymme ihailemaan luontoa.",
      category: "Ulkoilu",
      upcoming: true,
    },
    {
      id: 3,
      title: "Käsityökerho",
      organizer: "Elina",
      date: "Ti 18.2. klo 18:00",
      location: "Yhteisötila Punavuoressa",
      distance: "0.8km",
      participants: "4/6",
      description: "Neulomista ja virkkaamista yhdessä. Tuomme omat työt ja juttelemme hiljaa.",
      category: "Käsityöt",
      upcoming: true,
    },
    {
      id: 4,
      title: "Valokuvausretki",
      organizer: "Jukka",
      date: "La 8.2. klo 10:00",
      location: "Suomenlinna",
      distance: "2.1km",
      participants: "6/6",
      description: "Rauhallinen valokuvausretki Suomenlinnaan. Keskitymme luontoon ja arkkitehtuuriin.",
      category: "Valokuvaus",
      upcoming: false,
    },
  ]

  const filteredEvents = events.filter((event) => {
    if (filter === "upcoming") return event.upcoming
    if (filter === "nearby") return Number.parseFloat(event.distance) <= 1
    if (filter === "available") return event.participants.split("/")[0] < event.participants.split("/")[1]
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
              <h1 className="text-3xl font-bold text-slate-800 font-sans mb-2">Lähihetket</h1>
              <p className="text-slate-600 leading-relaxed">Rauhallisia tapahtumia ja kokoontumisia lähellä</p>
            </div>
            <Button className="bg-cyan-800 hover:bg-cyan-900 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Luo tapahtuma
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6">
          <Filter className="w-4 h-4 text-slate-600" />
          <div className="flex gap-2 flex-wrap">
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
              variant={filter === "upcoming" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("upcoming")}
              className={
                filter === "upcoming"
                  ? "bg-cyan-800 hover:bg-cyan-900 text-white"
                  : "border-slate-300 text-slate-600 hover:bg-slate-50 bg-transparent"
              }
            >
              Tulevat
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
              Tilaa jäljellä
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

        {/* Events List */}
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="bg-white border-slate-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-cyan-800" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-slate-800 font-sans">{event.title}</CardTitle>
                        <CardDescription className="text-slate-600">Järjestäjä: {event.organizer}</CardDescription>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Badge variant={event.upcoming ? "default" : "secondary"}>
                      {event.upcoming ? "Tuleva" : "Mennyt"}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {event.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-slate-700 leading-relaxed">{event.description}</p>

                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {event.location} • {event.distance}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {event.participants} osallistujaa
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-cyan-800 text-cyan-800 hover:bg-cyan-50 bg-transparent"
                  >
                    Lisätiedot
                  </Button>
                  {event.upcoming && (
                    <Button
                      size="sm"
                      className="bg-cyan-800 hover:bg-cyan-900 text-white"
                      disabled={event.participants.split("/")[0] >= event.participants.split("/")[1]}
                    >
                      {event.participants.split("/")[0] >= event.participants.split("/")[1] ? "Täynnä" : "Ilmoittaudu"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">Ei tapahtumia</h3>
            <p className="text-slate-500 mb-4">Valituilla suodattimilla ei löytynyt tapahtumia.</p>
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
