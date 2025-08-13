"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Shield, X } from "lucide-react"
import { useState } from "react"

interface SafetyTipCardProps {
  tip: string
  type?: "info" | "warning" | "success"
  dismissible?: boolean
}

export default function SafetyTipCard({ tip, type = "info", dismissible = true }: SafetyTipCardProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const getStyles = () => {
    switch (type) {
      case "warning":
        return "bg-amber-50 border-amber-200 text-amber-800"
      case "success":
        return "bg-green-50 border-green-200 text-green-800"
      default:
        return "bg-cyan-50 border-cyan-200 text-cyan-800"
    }
  }

  const getIconColor = () => {
    switch (type) {
      case "warning":
        return "text-amber-600"
      case "success":
        return "text-green-600"
      default:
        return "text-cyan-600"
    }
  }

  return (
    <Card className={`${getStyles()} shadow-sm`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Shield className={`w-5 h-5 ${getIconColor()} mt-0.5 flex-shrink-0`} />
          <div className="flex-1">
            <p className="text-sm leading-relaxed">{tip}</p>
          </div>
          {dismissible && (
            <button
              onClick={() => setIsVisible(false)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
