"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Users, Heart, Search, ArrowLeft, MessageCircle } from "lucide-react"
import Link from "next/link"

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [distanceFilter, setDistanceFilter] = useState("all")
  const [interestFilter, setInterestFilter] = useState("all")
  const [availabilityFilter, setAvailabilityFilter] = useState("all")

  const users = [
    {
      id: 1,
      name: "Anna",
      age: "30-luvulla",
      location: "Punavuori",
      distance: "0.5km",
      bio: "Rakastan luontoa ja rauhallisia hetkiä. Minulla on kaksi lasta ja koira. Etsimme leikkikavereita ja mukavia naapureita.",
      interests: ["Ulkoilu", "Lukeminen", "Käsityöt"],
      children: "Liisa (4v), Mikael (6v)",
      canHelp: ["Lastenhoito", "Ostosavut"],
      needsHelp: ["Puutarhatyöt"],
      available: true,
      lastActive: "2 tuntia sitten",
    },
    {
      id: 2,
      name: "Mikko",
      age: "40-luvulla",
      location: "Kamppi",
      distance: "1.1km",
      bio: "Kotona oleva isä, joka nauttii rauhallisista aktiviteeteista. Käymme usein kirjastossa ja puistoissa.",
      interests: ["Liikunta", "Musiikki", "Valokuvaus"],
      children: "Aino (5v)",
      canHelp: ["Tekninen apu", "Kuljetus"],
      needsHelp: ["Käsityöt"],
      available: true,
      lastActive: "1 tunti sitten",
    },
    {
      id: 3,
      name: "Sari",
      age: "35-vuotias",
      location: "Ullanlinna",
      distance: "1.3km",
      bio: "Rauhallinen perhe, joka arvostaa luontoa ja hitaampaa elämänrytmiä. Pidämme piknikkejä ja kävelyretkiä.",
      interests: ["Luonto", "Ruoanlaitto", "Puutarhanhoito"],
      children: "Ville (3v), Emma (7v)",
      canHelp: ["Ruoanlaitto", "Puutarhatyöt"],
      needsHelp: ["Tekninen apu"],
      available: false,
      lastActive: "1 päivä sitten",
    },
    {
      id: 4,
      name: "Elina",
      age: "28-vuotias",
      location: "Punavuori",
      distance: "0.7km",
      bio: "Käsityöharrastaja ja kirjallisuuden ystävä. Asun yksin ja etsin mukavia naapureita juttelemaan.",
      interests: ["Käsityöt", "Lukeminen", "Musiikki"],
      children: null,
      canHelp: ["Käsityöt", "Seurustelu"],
      needsHelp: ["Kodin korjaukset", "Ostosavut"],
      available: true,
      lastActive: "30 minuuttia sitten",
    },
    {
      id: 5,
      name: "Pekka",
      age: "50-luvulla",
      location: "Kamppi",
      distance: "1.2km",
      bio: "Eläkeläinen, joka nauttii auttamisesta ja uusien ihmisten tapaamisesta. Kokenut käsimies.",
      interests: ["Kodin korjaukset", "Puutarhanhoito", "Ulkoilu"],
      children: null,
      canHelp: ["Kodin korjaukset", "Puutarhatyöt", "Kuljetus"],
      needsHelp: ["Tekninen apu"],
      available: true,
      lastActive: "3 tuntia sitten",
    },
  ]

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.interests.some((interest) => interest.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesDistance =
      distanceFilter === "all" ||
      (distanceFilter === "nearby" && Number.parseFloat(user.distance) <= 1) ||
      (distanceFilter === "close" && Number.parseFloat(user.distance) <= 0.5)

    const matchesInterest = interestFilter === "all" || user.interests.includes(interestFilter)

    const matchesAvailability =
      availabilityFilter === "all" ||
      (availabilityFilter === "available" && user.available) ||
      (availabilityFilter === "parents" && user.children)

    return matchesSearch && matchesDistance && matchesInterest && matchesAvailability
  })

  return (
    <div className="min-h-screen bg-cyan-50 p-4">
      <div className="max-w-6xl mx-auto">
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
              <h1 className="text-3xl font-bold text-slate-800 font-sans mb-2">Löydä naapureita</h1>
              <p className="text-slate-600 leading-relaxed">Tutustu ihmisiin lähialueeltasi omaan tahtiisi</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Etsi nimellä, kiinnostuksilla..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-slate-300 focus:border-cyan-800 focus:ring-cyan-800"
                />
              </div>
            </div>

            <Select value={distanceFilter} onValueChange={setDistanceFilter}>
              <SelectTrigger className="border-slate-300 focus:border-cyan-800 focus:ring-cyan-800">
                <SelectValue placeholder="Etäisyys" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Kaikki etäisyydet</SelectItem>
                <SelectItem value="close">Alle 0.5km</SelectItem>
                <SelectItem value="nearby">Alle 1km</SelectItem>
              </SelectContent>
            </Select>

            <Select value={interestFilter} onValueChange={setInterestFilter}>
              <SelectTrigger className="border-slate-300 focus:border-cyan-800 focus:ring-cyan-800">
                <SelectValue placeholder="Kiinnostukset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Kaikki kiinnostukset</SelectItem>
                <SelectItem value="Ulkoilu">Ulkoilu</SelectItem>
                <SelectItem value="Käsityöt">Käsityöt</SelectItem>
                <SelectItem value="Lukeminen">Lukeminen</SelectItem>
                <SelectItem value="Liikunta">Liikunta</SelectItem>
                <SelectItem value="Musiikki">Musiikki</SelectItem>
                <SelectItem value="Ruoanlaitto">Ruoanlaitto</SelectItem>
              </SelectContent>
            </Select>

            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger className="border-slate-300 focus:border-cyan-800 focus:ring-cyan-800">
                <SelectValue placeholder="Tyyppi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Kaikki</SelectItem>
                <SelectItem value="available">Saatavilla</SelectItem>
                <SelectItem value="parents">Vanhemmat</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center gap-2 mb-4 text-sm text-slate-600">
          <Users className="w-4 h-4" />
          <span>{filteredUsers.length} naapuria löytyi</span>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="bg-white border-slate-200 hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                        <Heart className="w-6 h-6 text-cyan-800" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-slate-800 font-sans">{user.name}</CardTitle>
                        <CardDescription className="text-slate-600">{user.age}</CardDescription>
                      </div>
                    </div>
                  </div>
                  <Badge variant={user.available ? "default" : "secondary"} className="ml-2">
                    {user.available ? "Saatavilla" : "Ei saatavilla"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-slate-700 leading-relaxed line-clamp-3">{user.bio}</p>

                <div className="flex flex-wrap gap-4 text-xs text-slate-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {user.location} • {user.distance}
                  </div>
                </div>

                {user.children && (
                  <div className="text-xs text-slate-600">
                    <span className="font-medium">Lapset:</span> {user.children}
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {user.interests.slice(0, 3).map((interest) => (
                      <Badge key={interest} variant="outline" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                    {user.interests.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{user.interests.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="text-xs text-slate-500">Aktiivinen: {user.lastActive}</div>

                <div className="flex gap-2 pt-2">
                  <Link href={`/profile/${user.id}`} className="flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-cyan-800 text-cyan-800 hover:bg-cyan-50 bg-transparent"
                    >
                      Näytä profiili
                    </Button>
                  </Link>
                  <Button size="sm" className="bg-cyan-800 hover:bg-cyan-900 text-white">
                    <MessageCircle className="w-3 h-3 mr-1" />
                    Viesti
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">Ei naapureita löytynyt</h3>
            <p className="text-slate-500 mb-4">Kokeile muuttaa hakuehtoja tai laajentaa hakualuetta.</p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setDistanceFilter("all")
                setInterestFilter("all")
                setAvailabilityFilter("all")
              }}
              variant="outline"
              className="border-cyan-800 text-cyan-800 hover:bg-cyan-50 bg-transparent"
            >
              Tyhjennä suodattimet
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
