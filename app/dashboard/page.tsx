"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, MessageCircle, Users, MapPin, Settings, Bell } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const recentActivity = [
    {
      id: 1,
      type: "message",
      title: "Uusi viesti Annalta",
      description: "Kiitos avusta ostoksissa!",
      time: "2 tuntia sitten",
    },
    {
      id: 2,
      type: "playdate",
      title: "Leikkipäivä huomenna",
      description: "Mikko ja Aino tulevat klo 14",
      time: "4 tuntia sitten",
    },
    {
      id: 3,
      type: "help",
      title: "Apupyyntö lähellä",
      description: "Sari kaipaa apua puutarhatyöhön",
      time: "1 päivä sitten",
    },
  ]

  const quickStats = {
    messages: 3,
    connections: 12,
    helpRequests: 2,
    events: 1,
  }

  return (
    <div className="min-h-screen bg-cyan-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 font-sans mb-2">Tervetuloa takaisin!</h1>
            <p className="text-slate-600 leading-relaxed">Tässä on mitä naapurustossasi tapahtuu</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-cyan-800">
              <Bell className="w-4 h-4" />
            </Button>
            <Link href="/settings/location">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-cyan-800">
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-white border-slate-200">
                <CardContent className="p-4 text-center">
                  <MessageCircle className="w-6 h-6 text-cyan-800 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-slate-800">{quickStats.messages}</div>
                  <div className="text-xs text-slate-600">Uutta viestiä</div>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200">
                <CardContent className="p-4 text-center">
                  <Users className="w-6 h-6 text-cyan-800 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-slate-800">{quickStats.connections}</div>
                  <div className="text-xs text-slate-600">Yhteyttä</div>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200">
                <CardContent className="p-4 text-center">
                  <Heart className="w-6 h-6 text-violet-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-slate-800">{quickStats.helpRequests}</div>
                  <div className="text-xs text-slate-600">Apupyyntöä</div>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200">
                <CardContent className="p-4 text-center">
                  <MapPin className="w-6 h-6 text-cyan-800 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-slate-800">{quickStats.events}</div>
                  <div className="text-xs text-slate-600">Tapahtuma</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800 font-sans">Viimeisimmät tapahtumat</CardTitle>
                <CardDescription className="text-slate-600">Mitä naapurustossasi on tapahtunut</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0">
                      {activity.type === "message" && <MessageCircle className="w-4 h-4 text-cyan-800" />}
                      {activity.type === "playdate" && <Users className="w-4 h-4 text-cyan-800" />}
                      {activity.type === "help" && <Heart className="w-4 h-4 text-violet-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-800 text-sm">{activity.title}</h4>
                      <p className="text-sm text-slate-600 truncate">{activity.description}</p>
                      <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg text-slate-800 font-sans">Pikavalinnat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/discover">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-cyan-800 text-cyan-800 hover:bg-cyan-50 bg-transparent"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Löydä naapureita
                  </Button>
                </Link>
                <Link href="/messages">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-cyan-800 text-cyan-800 hover:bg-cyan-50 bg-transparent"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Viestit
                  </Button>
                </Link>
                <Link href="/categories/help">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-violet-600 text-violet-600 hover:bg-violet-50 bg-transparent"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Auta naapuria
                  </Button>
                </Link>
                <Link href="/categories/events">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-cyan-800 text-cyan-800 hover:bg-cyan-50 bg-transparent"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Lähitapahtumat
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Location Status */}
            <Card className="bg-cyan-50 border-cyan-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-cyan-800 mx-auto mb-3" />
                  <h4 className="font-semibold text-cyan-800 text-sm mb-2">Sijaintisi</h4>
                  <p className="text-xs text-cyan-700 mb-3">Punavuori, Helsinki</p>
                  <p className="text-xs text-cyan-700 mb-4">Hakusäde: 2km</p>
                  <Link href="/settings/location">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-cyan-800 text-cyan-800 hover:bg-cyan-100 bg-transparent"
                    >
                      Muuta asetuksia
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
