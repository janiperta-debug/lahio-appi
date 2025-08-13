"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Heart,
  MessageCircle,
  ArrowLeft,
  Clock,
  Users,
  HandHeart,
  MoreVertical,
  AlertTriangle,
  UserX,
  Star,
} from "lucide-react"
import Link from "next/link"
import ReportUserModal from "@/components/report-user-modal"
import BlockUserModal from "@/components/block-user-modal"
import RateUserModal from "@/components/rate-user-modal"
import UserReviews from "@/components/user-reviews"
import TrustBadges from "@/components/trust-badges"
import TrustScoreDisplay from "@/components/trust-score-display"

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [showReportModal, setShowReportModal] = useState(false)
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [showRateModal, setShowRateModal] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)

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
    averageRating: 4.7,
    totalReviews: 12,
    // Added trust and verification data
    trustScore: 85,
    verifications: {
      email: true,
      phone: true,
      identity: false,
      address: true,
      socialMedia: false,
    },
    endorsements: 8,
  }

  const reviews = [
    {
      id: 1,
      reviewerName: "Mikko",
      rating: 5,
      comment:
        "Anna oli erittäin ystävällinen ja auttoi ostoksissa tehokkaasti. Lapset tulivat hyvin toimeen keskenään. Suosittelen lämpimästi!",
      date: "2 viikkoa sitten",
      interactionType: "Ostosavut",
    },
    {
      id: 2,
      reviewerName: "Sari",
      rating: 5,
      comment:
        "Loistava leikkipäivä! Anna on luotettava ja lapset rakastivat hänen koiraansa. Ehdottomasti tapaamme uudelleen.",
      date: "1 kuukausi sitten",
      interactionType: "Leikkikaverit",
    },
    {
      id: 3,
      reviewerName: "Elina",
      rating: 4,
      comment: "Mukava käsityökerho. Anna jakoi hyviä vinkkejä ja oli kärsivällinen opettaja.",
      date: "2 kuukautta sitten",
      interactionType: "Käsityöt",
    },
  ]

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
          <div className="lg:col-span-2 space-y-6">
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
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium text-slate-700">{user.averageRating}</span>
                        </div>
                        <span className="text-sm text-slate-500">({user.totalReviews} arvostelua)</span>
                      </div>
                      {/* Added trust badges to profile header */}
                      <div className="mt-3">
                        <TrustBadges
                          verifications={user.verifications}
                          trustScore={user.trustScore}
                          memberSince={user.memberSince}
                          endorsements={user.endorsements}
                          size="sm"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={user.available ? "default" : "secondary"}>
                      {user.available ? "Saatavilla" : "Ei saatavilla"}
                    </Badge>
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setShowMoreMenu(!showMoreMenu)}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                      {showMoreMenu && (
                        <div className="absolute right-0 top-10 bg-white border border-slate-200 rounded-lg shadow-lg py-2 z-10 min-w-[160px]">
                          <button
                            onClick={() => {
                              setShowRateModal(true)
                              setShowMoreMenu(false)
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-yellow-600 hover:bg-yellow-50 flex items-center gap-2"
                          >
                            <Star className="w-4 h-4" />
                            Arvostele käyttäjä
                          </button>
                          <button
                            onClick={() => {
                              setShowReportModal(true)
                              setShowMoreMenu(false)
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <AlertTriangle className="w-4 h-4" />
                            Raportoi käyttäjä
                          </button>
                          <button
                            onClick={() => {
                              setShowBlockModal(true)
                              setShowMoreMenu(false)
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <UserX className="w-4 h-4" />
                            Estä käyttäjä
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
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

            <UserReviews reviews={reviews} averageRating={user.averageRating} totalReviews={user.totalReviews} />
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

            {/* Added trust score display to sidebar */}
            <TrustScoreDisplay
              trustScore={user.trustScore}
              verificationCount={Object.values(user.verifications).filter(Boolean).length}
              reviewCount={user.totalReviews}
              endorsementCount={user.endorsements}
              memberSince={user.memberSince}
              showDetails={true}
            />

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

      {/* Modals */}
      <ReportUserModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        userName={user.name}
        userId={user.id.toString()}
      />
      <BlockUserModal
        isOpen={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        userName={user.name}
        userId={user.id.toString()}
      />
      <RateUserModal
        isOpen={showRateModal}
        onClose={() => setShowRateModal(false)}
        userName={user.name}
        userId={user.id.toString()}
        interactionType="yhteistyö"
      />
    </div>
  )
}
