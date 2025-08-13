"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Phone, AlertTriangle, MessageCircle } from "lucide-react"

export default function SafetyQuickActions() {
  const [emergencyMode, setEmergencyMode] = useState(false)

  const handleEmergencyCall = () => {
    // In a real app, this would trigger emergency protocols
    window.open("tel:112", "_self")
  }

  const handleSafetyReport = () => {
    // In a real app, this would open a quick safety report
    console.log("Opening safety report")
  }

  const handleEmergencyContact = () => {
    // In a real app, this would contact the user's emergency contact
    console.log("Contacting emergency contact")
  }

  return (
    <Card className="bg-red-50 border-red-200 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-red-600" />
          <h4 className="font-semibold text-red-800 text-sm">Turvallisuus</h4>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleEmergencyCall}
            className="border-red-300 text-red-600 hover:bg-red-100 h-auto p-2 bg-transparent"
          >
            <div className="text-center">
              <Phone className="w-4 h-4 mx-auto mb-1" />
              <div className="text-xs font-medium">Hätä 112</div>
            </div>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSafetyReport}
            className="border-red-300 text-red-600 hover:bg-red-100 h-auto p-2 bg-transparent"
          >
            <div className="text-center">
              <AlertTriangle className="w-4 h-4 mx-auto mb-1" />
              <div className="text-xs font-medium">Raportoi</div>
            </div>
          </Button>
        </div>

        <div className="mt-3 pt-3 border-t border-red-200">
          <Button
            variant="outline"
            size="sm"
            onClick={handleEmergencyContact}
            className="w-full border-red-300 text-red-600 hover:bg-red-100 text-xs bg-transparent"
          >
            <MessageCircle className="w-3 h-3 mr-1" />
            Ilmoita hätäyhteyshenkilölle
          </Button>
        </div>

        <p className="text-xs text-red-700 mt-2 leading-relaxed">Käytä vain todellisissa hätätilanteissa</p>
      </CardContent>
    </Card>
  )
}
