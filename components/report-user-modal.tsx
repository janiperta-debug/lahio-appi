"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertTriangle, Shield, X } from "lucide-react"

interface ReportUserModalProps {
  isOpen: boolean
  onClose: () => void
  userName: string
  userId: string
}

export default function ReportUserModal({ isOpen, onClose, userName, userId }: ReportUserModalProps) {
  const [reportReasons, setReportReasons] = useState<string[]>([])
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const reportOptions = [
    { id: "harassment", label: "Häirintä tai uhkailu", description: "Sopimaton käytös tai uhkaileva viestintä" },
    { id: "inappropriate", label: "Sopimaton sisältö", description: "Loukkaava tai asiaton sisältö" },
    { id: "spam", label: "Roskaposti", description: "Ei-toivotut viestit tai mainokset" },
    { id: "fake", label: "Väärennetty profiili", description: "Epäilyttävä tai väärennetty käyttäjätili" },
    { id: "safety", label: "Turvallisuushuoli", description: "Huoli henkilökohtaisesta turvallisuudesta" },
    { id: "other", label: "Muu syy", description: "Jokin muu ongelma" },
  ]

  const handleReasonChange = (reasonId: string, checked: boolean) => {
    setReportReasons((prev) => (checked ? [...prev, reasonId] : prev.filter((r) => r !== reasonId)))
  }

  const handleSubmit = async () => {
    if (reportReasons.length === 0) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)

      // Auto-close after showing success
      setTimeout(() => {
        onClose()
        setIsSubmitted(false)
        setReportReasons([])
        setDescription("")
      }, 2000)
    }, 1500)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white border-slate-200 shadow-xl">
        {!isSubmitted ? (
          <>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-slate-800 font-sans">Raportoi käyttäjä</CardTitle>
                    <CardDescription className="text-slate-600">Raportoi: {userName}</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label className="text-slate-700 font-medium">Miksi raportoit tämän käyttäjän?</Label>
                <div className="space-y-3">
                  {reportOptions.map((option) => (
                    <div key={option.id} className="flex items-start space-x-3">
                      <Checkbox
                        id={option.id}
                        checked={reportReasons.includes(option.id)}
                        onCheckedChange={(checked) => handleReasonChange(option.id, checked as boolean)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label htmlFor={option.id} className="text-sm font-medium text-slate-700 cursor-pointer">
                          {option.label}
                        </Label>
                        <p className="text-xs text-slate-500 mt-1">{option.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-700 font-medium">
                  Lisätiedot (valinnainen)
                </Label>
                <Textarea
                  id="description"
                  placeholder="Kerro tarkemmin tapahtuneesta..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border-slate-300 focus:border-red-500 focus:ring-red-500 min-h-[80px]"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      Kaikki raportit käsitellään luottamuksellisesti. Väärinkäytöstapaukset johtavat toimenpiteisiin.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 border-slate-300 text-slate-600 hover:bg-slate-50 bg-transparent"
                >
                  Peruuta
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={reportReasons.length === 0 || isSubmitting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  {isSubmitting ? "Lähetetään..." : "Lähetä raportti"}
                </Button>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className="py-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Raportti lähetetty</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Kiitos raportista. Tutkimme asian ja ryhdymme tarvittaviin toimenpiteisiin.
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
