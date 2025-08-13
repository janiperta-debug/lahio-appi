"use client"

import { Badge } from "@/components/ui/badge"
import { Shield, CheckCircle, Phone, Mail, Users, Star, Calendar } from "lucide-react"

interface TrustBadgesProps {
  verifications: {
    email?: boolean
    phone?: boolean
    identity?: boolean
    address?: boolean
    socialMedia?: boolean
  }
  trustScore?: number
  memberSince?: string
  endorsements?: number
  size?: "sm" | "md" | "lg"
}

export default function TrustBadges({
  verifications,
  trustScore = 0,
  memberSince,
  endorsements = 0,
  size = "md",
}: TrustBadgesProps) {
  const getBadgeSize = () => {
    switch (size) {
      case "sm":
        return "text-xs px-2 py-1"
      case "lg":
        return "text-sm px-3 py-2"
      default:
        return "text-xs px-2 py-1"
    }
  }

  const getIconSize = () => {
    switch (size) {
      case "sm":
        return "w-3 h-3"
      case "lg":
        return "w-4 h-4"
      default:
        return "w-3 h-3"
    }
  }

  const getTrustLevel = (score: number) => {
    if (score >= 90) return { label: "Erittäin luotettava", color: "bg-green-100 text-green-800", icon: Shield }
    if (score >= 75) return { label: "Luotettava", color: "bg-blue-100 text-blue-800", icon: CheckCircle }
    if (score >= 50) return { label: "Kohtuullinen", color: "bg-yellow-100 text-yellow-800", icon: Star }
    return { label: "Uusi käyttäjä", color: "bg-slate-100 text-slate-600", icon: Users }
  }

  const trustLevel = getTrustLevel(trustScore)
  const TrustIcon = trustLevel.icon

  return (
    <div className="flex flex-wrap gap-1">
      {/* Trust Score Badge */}
      {trustScore > 0 && (
        <Badge className={`${trustLevel.color} ${getBadgeSize()} flex items-center gap-1`}>
          <TrustIcon className={getIconSize()} />
          {trustLevel.label}
        </Badge>
      )}

      {/* Verification Badges */}
      {verifications.email && (
        <Badge className={`bg-green-100 text-green-800 ${getBadgeSize()} flex items-center gap-1`}>
          <Mail className={getIconSize()} />
          Sähköposti
        </Badge>
      )}

      {verifications.phone && (
        <Badge className={`bg-green-100 text-green-800 ${getBadgeSize()} flex items-center gap-1`}>
          <Phone className={getIconSize()} />
          Puhelin
        </Badge>
      )}

      {verifications.identity && (
        <Badge className={`bg-blue-100 text-blue-800 ${getBadgeSize()} flex items-center gap-1`}>
          <Shield className={getIconSize()} />
          Henkilöllisyys
        </Badge>
      )}

      {verifications.address && (
        <Badge className={`bg-purple-100 text-purple-800 ${getBadgeSize()} flex items-center gap-1`}>
          <CheckCircle className={getIconSize()} />
          Osoite
        </Badge>
      )}

      {/* Member Since */}
      {memberSince && (
        <Badge className={`bg-slate-100 text-slate-600 ${getBadgeSize()} flex items-center gap-1`}>
          <Calendar className={getIconSize()} />
          {memberSince}
        </Badge>
      )}

      {/* Endorsements */}
      {endorsements > 0 && (
        <Badge className={`bg-orange-100 text-orange-800 ${getBadgeSize()} flex items-center gap-1`}>
          <Users className={getIconSize()} />
          {endorsements} suositusta
        </Badge>
      )}
    </div>
  )
}
