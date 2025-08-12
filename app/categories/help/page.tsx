"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HandHeart, MapPin, Clock, Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function HelpPage() {
  const [filter, setFilter] = useState("all")

  const helpOffers = [
    {
      id: 1,
      name: "Marja",
      type: "offer",
      category: "Ostosavut",
      location: "Punavuori",
      distance: "0.5km",
      time: "Arkipäivisin",
      description:
        "Voin auttaa ostoksissa käymisessä. Käyn itse kaupassa päivittäin, joten voin ottaa muutaman tuotteen mukaan.",
      available: true,
    },
    {
      id: 2,
      name: "Pekka",
      type: "offer",
      category: "Kodin korjaukset",
      location: "Kamppi",
      distance: "1.1km",
      time: "Viikonloppuisin",
      description:
        "Kokenut käsimies auttaa pienissä kodin korjauksissa. Hanojen korjaus, seinien maalaus, hyllyjen kiinnitys.",
      available: true,
    },
    {
      id: 3,
      name: "Liisa",
      type: "request",
      category: "Puutarhatyöt",
      location: "Ullanlinna",
      distance: "1.3km",
      time: "Joustavasti",
      description: "Kaipaisin apua pienen puutarhan kunnostuksessa. Rikkaruohojen kitkemistä ja kasvien istutusta.",
      available: true,
    },
  ]

  const helpRequests = [
    {
      id: 4,
      name: "Aino",
      type: "request",
      category: "Tekninen apu",
      location: "Punavuori",
      distance: "0.7km",
      time: "Arkipäivisin",
      description: "Tarvitsen apua tietokoneen kanssa. Sähköposti ei toimi ja kuvat eivät aukea.",
      available: true,
    },
    {
      id: 5,
      name: "Ville",
      type: "request",
      category: "Kuljetus",
      location: "Kamppi",
      distance: "0.9km",
      time: "Ensi viikolla",
      description: "Tarvitsen kyydin lääkäriin. Julkinen liikenne on hankalaa ja taksi kallis.",
      available: true,
    },
  ]

  const offers = helpOffers.filter((item) => item.type === "offer")
  const requests = helpOffers.concat(helpRequests).filter((item) => item.type === "request")

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
              <h1 className="text-3xl font-bold text-slate-800 font-sans mb-2">Auttavat kädet</h1>
              <p className="text-slate-600 leading-relaxed">Pyydä apua tai tarjoa omaasi naapureille</p>
            </div>
            <Button className="bg-violet-600 hover:bg-violet-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Lisää ilmoitus
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="offers" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="offers" className="text-sm">
              Tarjoan apua ({offers.length})
            </TabsTrigger>
            <TabsTrigger value="requests" className="text-sm">
              Kaipaan apua ({requests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="offers" className="space-y-4">
            {offers.map((offer) => (
              <Card key={offer.id} className="bg-white border-slate-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
                          <HandHeart className="w-5 h-5 text-violet-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-slate-800 font-sans">{offer.name}</CardTitle>
                          <CardDescription className="text-slate-600">{offer.category}</CardDescription>
                        </div>
                      </div>
                    </div>
                    <Badge className="ml-4 bg-green-100 text-green-800">Tarjoan</Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-slate-700 leading-relaxed">{offer.description}</p>

                  <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {offer.location} • {offer.distance}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {offer.time}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-violet-600 text-violet-600 hover:bg-violet-50 bg-transparent"
                    >
                      Näytä profiili
                    </Button>
                    <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white">
                      Ota yhteyttä
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} className="bg-white border-slate-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <HandHeart className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-slate-800 font-sans">{request.name}</CardTitle>
                          <CardDescription className="text-slate-600">{request.category}</CardDescription>
                        </div>
                      </div>
                    </div>
                    <Badge className="ml-4 bg-orange-100 text-orange-800">Kaipaan</Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-slate-700 leading-relaxed">{request.description}</p>

                  <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {request.location} • {request.distance}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {request.time}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-orange-600 text-orange-600 hover:bg-orange-50 bg-transparent"
                    >
                      Näytä profiili
                    </Button>
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                      Tarjoudu auttamaan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
