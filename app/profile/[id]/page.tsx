"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Heart, MessageCircle, ArrowLeft, Clock, Users, HandHeart } from "lucide-react"
import Link from "next/link"

export default function ProfilePage({ params }: { params: { id: string } }) {
  // In a real app, this would fetch user data based on the ID
  const user = {
    id: 1,
    name: "Anna",
    age: "30-luvulla",
    location: "Punavuori",
    distance: "0.5km",
    bio: "Rakastan luontoa ja rauhallisia hetkiä. Minulla on kaksi lasta ja koira. Etsimme leikkikavereita ja mukavia naapureita. Pidän käsitöistä ja lukemisesta, ja nautin ulkoilusta lasten kanssa. Olemme rauhallinen perhe, joka arvostaa aitoja kohtaamisia.",
    interests: ["Ulkoilu", "Lukeminen", "Käsityöt", "Puutarhanhoito", "Valokuvaus"],
    children: "Liisa (4v), Mikael (6v)",
    canHelp: ["Lastenhoito", "Ostosavut", "Käsityöt"],
    needsHelp: ["Puutarhatyöt", "Tekninen apu"],
    available: true,
    lastActive: "2 tuntia sitten",
    memberSince: "Tammikuu 2024",
    responseRate: "95%",
    responseTime: "Yleensä 2 tunnin sisään",
  }

  return (
    <div className="min-h-screen bg-cyan-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Navigation */}
        <Link
          href="/discover"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-cyan-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Takaisin hakuun
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Card */}
          <div className="lg:col-span-2">
            <Card className="bg-white border-slate-200 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center">
                      <Heart className="w-8 h-8 text-cyan-800" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-slate-800 font-sans">{user.name}</CardTitle>
                      <CardDescription className="text-slate-600 text-base">{user.age}</CardDescription>
                      <div className="flex items-center gap-1 mt-1 text-sm text-slate-600">
                        <MapPin className="w-4 h-4" />
                        {user.location} • {user.distance} päässä
                      </div>
                    </div>
                  </div>
                  <Badge variant={user.available ? "default" : "secondary"}>
                    {user.available ? "Saatavilla" : "Ei saatavilla"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Bio */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 font-sans mb-3">Tietoja minusta</h3>
                  <p className="text-slate-700 leading-relaxed">{user.bio}</p>
                </div>

                <Separator />

                {/* Children */}
                {user.children && (
                  <>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 font-sans mb-3 flex items-center gap-2">
                        <Users className="w-5 h-5 text-cyan-800" />
                        Lapset
                      </h3>
                      <p className="text-slate-700">{user.children}</p>
                    </div>
                    <Separator />
                  </>
                )}

                {/* Interests */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 font-sans mb-3">Kiinnostuksen kohteet</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.interests.map((interest) => (
                      <Badge key={interest} variant="outline" className="text-sm">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Help */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 font-sans mb-3 flex items-center gap-2">
                      <HandHeart className="w-5 h-5 text-green-600" />
                      Voin auttaa
                    </h3>
                    <div className="space-y-2">
                      {user.canHelp.map((help) => (
                        <Badge key={help} className="mr-2 mb-2 bg-green-100 text-green-800">
                          {help}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 font-sans mb-3 flex items-center gap-2">
                      <HandHeart className="w-5 h-5 text-orange-600" />
                      Kaipaan apua
                    </h3>
                    <div className="space-y-2">
                      {user.needsHelp.map((help) => (
                        <Badge key={help} className="mr-2 mb-2 bg-orange-100 text-orange-800">
                          {help}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="bg-white border-slate-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-slate-800 font-sans">Ota yhteyttä</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-cyan-800 hover:bg-cyan-900 text-white">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Lähetä viesti
                </Button>
                <p className="text-xs text-slate-500 text-center leading-relaxed">
                  Viestit ovat yksityisiä ja turvallisia. Voit aina estää käyttäjän tarvittaessa.
                </p>
              </CardContent>
            </Card>

            {/* Activity Info */}
            <Card className="bg-white border-slate-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-slate-800 font-sans">Aktiivisuus</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-600">Aktiivinen: {user.lastActive}</span>
                </div>
                <div className="text-sm text-slate-600">
                  <span className="font-medium">Jäsen:</span> {user.memberSince}
                </div>
                <div className="text-sm text-slate-600">
                  <span className="font-medium">Vastausprosentti:</span> {user.responseRate}
                </div>
                <div className="text-sm text-slate-600">
                  <span className="font-medium">Vastausaika:</span> {user.responseTime}
                </div>
              </CardContent>
            </Card>

            {/* Safety Notice */}
            <Card className="bg-cyan-50 border-cyan-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-8 h-8 bg-cyan-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-cyan-800 text-sm mb-2">Turvallinen tutustuminen</h4>
                  <p className="text-xs text-cyan-700 leading-relaxed">
                    Tapaa aina julkisessa paikassa ensimmäisellä kerralla. Luota vaistoihisi ja ota yhteyttä tukeen, jos
                    tarvitset apua.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
