"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Shield, CheckCircle, Star, Users, TrendingUp } from "lucide-react"

interface TrustScoreDisplayProps {
  trustScore: number
  verificationCount: number
  reviewCount: number
  endorsementCount: number
  memberSince: string
  showDetails?: boolean
}

export default function TrustScoreDisplay({
  trustScore,
  verificationCount,
  reviewCount,
  endorsementCount,
  memberSince,
  showDetails = true,
}: TrustScoreDisplayProps) {
  const getTrustLevel = (score: number) => {
    if (score >= 90)
      return {
        label: "Erittäin luotettava",
        color: "text-green-600",
        bgColor: "bg-green-100",
        description: "Vahvasti varmennettu ja yhteisön arvostama jäsen",
      }
    if (score >= 75)
      return {
        label: "Luotettava",
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        description: "Hyvin varmennettu ja luotettava yhteisön jäsen",
      }
    if (score >= 50)
      return {
        label: "Kohtuullinen",
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
        description: "Osittain varmennettu, rakentaa luottamusta",
      }
    return {
      label: "Uusi käyttäjä",
      color: "text-slate-600",
      bgColor: "bg-slate-100",
      description: "Uusi yhteisön jäsen, ei vielä paljon tietoa",
    }
  }

  const trustLevel = getTrustLevel(trustScore)

  const trustFactors = [
    {
      icon: CheckCircle,
      label: "Varmennukset",
      value: verificationCount,
      max: 5,
      color: "text-green-600",
    },
    {
      icon: Star,
      label: "Arvostelut",
      value: reviewCount,
      max: 20,
      color: "text-yellow-600",
    },
    {
      icon: Users,
      label: "Suositukset",
      value: endorsementCount,
      max: 10,
      color: "text-blue-600",
    },
    {
      icon: TrendingUp,
      label: "Aktiivisuus",
      value: Math.min(100, trustScore),
      max: 100,
      color: "text-purple-600",
    },
  ]

  return (
    <Card className="bg-white border-slate-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg text-slate-800 font-sans flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-800" />
          Luottamuspisteet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Trust Score */}
        <div className="text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${trustLevel.bgColor} mb-3`}>
            <Shield className={`w-5 h-5 ${trustLevel.color}`} />
            <span className={`font-semibold ${trustLevel.color}`}>{trustLevel.label}</span>
          </div>
          <div className="text-3xl font-bold text-slate-800 mb-2">{trustScore}/100</div>
          <Progress value={trustScore} className="w-full mb-2" />
          <p className="text-sm text-slate-600">{trustLevel.description}</p>
        </div>

        {showDetails && (
          <>
            {/* Trust Factors */}
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-700 text-sm">Luottamustekijät</h4>
              <div className="grid grid-cols-2 gap-4">
                {trustFactors.map((factor, index) => {
                  const IconComponent = factor.icon
                  const percentage = Math.min(100, (factor.value / factor.max) * 100)

                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <IconComponent className={`w-4 h-4 ${factor.color}`} />
                        <span className="text-sm text-slate-700">{factor.label}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-600">
                          <span>{factor.value}</span>
                          <span>{factor.max}</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Member Info */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Jäsen:</span>
                <span className="font-medium text-slate-800">{memberSince}</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
