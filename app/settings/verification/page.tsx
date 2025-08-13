"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, ArrowLeft, CheckCircle, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"
import VerificationModal from "@/components/verification-modal"
import TrustScoreDisplay from "@/components/trust-score-display"

export default function VerificationPage() {
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [verificationType, setVerificationType] = useState<"email" | "phone" | "identity" | "address">("email")

  const verificationStatus = {
    email: true,
    phone: true,
    identity: false,
    address: true,
    socialMedia: false,
  }

  const verificationOptions = [
    {
      type: "email" as const,
      title: "Sähköposti",
      description: "Varmenna sähköpostiosoitteesi",
      icon: Mail,
      verified: verificationStatus.email,
      points: 15,
      color: "text-green-600",
    },
    {
      type: "phone" as const,
      title: "Puhelinnumero",
      description: "Varmenna puhelinnumerosi",
      icon: Phone,
      verified: verificationStatus.phone,
      points: 20,
      color: "text-green-600",
    },
    {
      type: "identity" as const,
      title: "Henkilöllisyys",
      description: "Varmenna henkilöllisyytesi turvallisesti",
      icon: Shield,
      verified: verificationStatus.identity,
      points: 30,
      color: "text-blue-600",
    },
    {
      type: "address" as const,
      title: "Osoite",
      description: "Varmenna asuinosoitteesi",
      icon: MapPin,
      verified: verificationStatus.address,
      points: 25,
      color: "text-purple-600",
    },
  ]

  const handleStartVerification = (type: "email" | "phone" | "identity" | "address") => {
    setVerificationType(type)
    setShowVerificationModal(true)
  }

  const totalPoints = verificationOptions.reduce((sum, option) => sum + (option.verified ? option.points : 0), 0)

  const verifiedCount = Object.values(verificationStatus).filter(Boolean).length

  return (
    <div className="min-h-screen bg-cyan-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link
          href="/settings/safety"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-cyan-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Takaisin turvallisuusasetuksiin
        </Link>

        <div className="space-y-6">
          {/* Header */}
          <Card className="bg-white border-slate-200 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-slate-800 font-sans">Varmennukset</CardTitle>
                  <CardDescription className="text-slate-600">
                    Varmenna tietosi lisätäksesi luottamusta profiiliisi
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Verification Options */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-semibold text-slate-800 font-sans">Saatavilla olevat varmennukset</h2>

              {verificationOptions.map((option) => {
                const IconComponent = option.icon
                return (
                  <Card key={option.type} className="bg-white border-slate-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              option.verified ? "bg-green-100" : "bg-slate-100"
                            }`}
                          >
                            <IconComponent
                              className={`w-6 h-6 ${option.verified ? "text-green-600" : "text-slate-400"}`}
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-slate-800">{option.title}</h3>
                              {option.verified && <CheckCircle className="w-5 h-5 text-green-600" />}
                            </div>
                            <p className="text-sm text-slate-600 mt-1">{option.description}</p>
                            <p className="text-xs text-slate-500 mt-1">+{option.points} luottamuspistettä</p>
                          </div>
                        </div>
                        <div>
                          {option.verified ? (
                            <div className="text-center">
                              <div className="text-green-600 font-semibold text-sm">Varmennettu</div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2 border-slate-300 text-slate-600 hover:bg-slate-50 bg-transparent"
                              >
                                Päivitä
                              </Button>
                            </div>
                          ) : (
                            <Button
                              onClick={() => handleStartVerification(option.type)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Varmenna
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Trust Score Sidebar */}
            <div className="space-y-6">
              <TrustScoreDisplay
                trustScore={totalPoints}
                verificationCount={verifiedCount}
                reviewCount={12}
                endorsementCount={8}
                memberSince="Tammikuu 2024"
                showDetails={true}
              />

              {/* Benefits Card */}
              <Card className="bg-green-50 border-green-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-green-800 font-sans">Varmennuksen edut</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-green-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Lisää luottamusta profiiliisi
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Muut löytävät sinut helpommin
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Parempi sijoitus hauissa
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Turvallisempi yhteisö kaikille
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        verificationType={verificationType}
      />
    </div>
  )
}
