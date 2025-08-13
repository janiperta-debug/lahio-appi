"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Shield, UserX, ArrowLeft, AlertTriangle, Phone, Eye, MessageCircle } from "lucide-react"
import Link from "next/link"

export default function SafetySettingsPage() {
  const [safetySettings, setSafetySettings] = useState({
    profileVisibility: true,
    showOnlineStatus: true,
    allowMessages: true,
    requireMutualInterest: false,
    hideExactLocation: true,
    emergencyContactEnabled: false,
    safetyNotifications: true,
    autoBlockReported: true,
  })

  const [emergencyContact, setEmergencyContact] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const blockedUsers = [
    { id: 1, name: "Käyttäjä123", blockedDate: "2 viikkoa sitten", reason: "Sopimaton käytös" },
    { id: 2, name: "TestiHenkilö", blockedDate: "1 kuukausi sitten", reason: "Häirintä" },
  ]

  const handleSave = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const handleUnblock = (userId: number) => {
    // In a real app, this would call an API to unblock the user
    console.log("Unblocking user:", userId)
  }

  const updateSetting = (key: string, value: boolean) => {
    setSafetySettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-screen bg-cyan-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-cyan-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Takaisin hallintapaneeliin
        </Link>

        <div className="space-y-6">
          {/* Header */}
          <Card className="bg-white border-slate-200 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-slate-800 font-sans">Turvallisuusasetukset</CardTitle>
                  <CardDescription className="text-slate-600">
                    Hallitse yksityisyyttäsi ja turvallisuuttasi yhteisössä
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Privacy Controls */}
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg text-slate-800 font-sans flex items-center gap-2">
                <Eye className="w-5 h-5 text-cyan-800" />
                Yksityisyysasetukset
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <Label className="text-slate-700 font-medium">Profiilin näkyvyys</Label>
                    <p className="text-sm text-slate-600 mt-1">Muut voivat löytää profiilisi hauissa</p>
                  </div>
                  <Switch
                    checked={safetySettings.profileVisibility}
                    onCheckedChange={(checked) => updateSetting("profileVisibility", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <Label className="text-slate-700 font-medium">Online-tila näkyvissä</Label>
                    <p className="text-sm text-slate-600 mt-1">Näytä milloin olet aktiivinen</p>
                  </div>
                  <Switch
                    checked={safetySettings.showOnlineStatus}
                    onCheckedChange={(checked) => updateSetting("showOnlineStatus", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <Label className="text-slate-700 font-medium">Tarkka sijainti piilotettu</Label>
                    <p className="text-sm text-slate-600 mt-1">Näytä vain likimääräinen alue</p>
                  </div>
                  <Switch
                    checked={safetySettings.hideExactLocation}
                    onCheckedChange={(checked) => updateSetting("hideExactLocation", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Communication Controls */}
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg text-slate-800 font-sans flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-cyan-800" />
                Viestintäasetukset
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <Label className="text-slate-700 font-medium">Salli viestit kaikilta</Label>
                    <p className="text-sm text-slate-600 mt-1">Kuka tahansa voi lähettää sinulle viestin</p>
                  </div>
                  <Switch
                    checked={safetySettings.allowMessages}
                    onCheckedChange={(checked) => updateSetting("allowMessages", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <Label className="text-slate-700 font-medium">Vaadi molemminpuolinen kiinnostus</Label>
                    <p className="text-sm text-slate-600 mt-1">Vain ne voivat viestiä, joita olet myös kiinnostunut</p>
                  </div>
                  <Switch
                    checked={safetySettings.requireMutualInterest}
                    onCheckedChange={(checked) => updateSetting("requireMutualInterest", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Safety Features */}
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg text-slate-800 font-sans flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Turvallisuusominaisuudet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <Label className="text-slate-700 font-medium">Turvallisuusilmoitukset</Label>
                    <p className="text-sm text-slate-600 mt-1">
                      Saa ilmoituksia turvallisuusvinkeistä ja varoituksista
                    </p>
                  </div>
                  <Switch
                    checked={safetySettings.safetyNotifications}
                    onCheckedChange={(checked) => updateSetting("safetyNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <Label className="text-slate-700 font-medium">Automaattinen esto raportoiduille</Label>
                    <p className="text-sm text-slate-600 mt-1">
                      Estä automaattisesti käyttäjät, jotka on raportoitu useasti
                    </p>
                  </div>
                  <Switch
                    checked={safetySettings.autoBlockReported}
                    onCheckedChange={(checked) => updateSetting("autoBlockReported", checked)}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <Label className="text-slate-700 font-medium">Hätäyhteystieto</Label>
                      <p className="text-sm text-slate-600 mt-1">
                        Luotettu henkilö, joka saa ilmoituksen hätätilanteessa
                      </p>
                    </div>
                    <Switch
                      checked={safetySettings.emergencyContactEnabled}
                      onCheckedChange={(checked) => updateSetting("emergencyContactEnabled", checked)}
                    />
                  </div>

                  {safetySettings.emergencyContactEnabled && (
                    <div className="ml-4 space-y-2">
                      <Label htmlFor="emergency-contact" className="text-slate-700">
                        Hätäyhteyshenkilön puhelinnumero
                      </Label>
                      <Input
                        id="emergency-contact"
                        type="tel"
                        placeholder="+358 40 123 4567"
                        value={emergencyContact}
                        onChange={(e) => setEmergencyContact(e.target.value)}
                        className="border-slate-300 focus:border-red-500 focus:ring-red-500"
                      />
                      <p className="text-xs text-slate-500">Tätä numeroa käytetään vain todellisissa hätätilanteissa</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Blocked Users */}
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg text-slate-800 font-sans flex items-center gap-2">
                <UserX className="w-5 h-5 text-red-600" />
                Estetyt käyttäjät ({blockedUsers.length})
              </CardTitle>
              <CardDescription>
                Hallitse estettyjä käyttäjiä. Estetyt käyttäjät eivät voi ottaa sinuun yhteyttä.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {blockedUsers.length > 0 ? (
                <div className="space-y-3">
                  {blockedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <UserX className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{user.name}</p>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span>Estetty {user.blockedDate}</span>
                            <Badge variant="outline" className="text-xs">
                              {user.reason}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnblock(user.id)}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        Poista esto
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <UserX className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                  <p className="text-sm">Ei estettyjä käyttäjiä</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Emergency Actions */}
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="text-lg text-red-800 font-sans flex items-center gap-2">
                <Phone className="w-5 h-5 text-red-600" />
                Hätätilanteet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-100 h-auto p-4 bg-transparent"
                >
                  <div className="text-center">
                    <Phone className="w-6 h-6 mx-auto mb-2" />
                    <div className="font-medium">Hätänumero</div>
                    <div className="text-sm opacity-75">112</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-100 h-auto p-4 bg-transparent"
                >
                  <div className="text-center">
                    <Shield className="w-6 h-6 mx-auto mb-2" />
                    <div className="font-medium">Yhteisön tuki</div>
                    <div className="text-sm opacity-75">Ota yhteyttä</div>
                  </div>
                </Button>
              </div>
              <div className="bg-red-100 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800 leading-relaxed">
                  <strong>Muista:</strong> Tapaa aina uudet ihmiset julkisessa paikassa. Kerro luotetulle henkilölle
                  missä olet menossa. Luota vaistoihisi ja poistu tilanteesta, jos tunnet olosi epämukavaksi.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isLoading} className="bg-cyan-800 hover:bg-cyan-900 text-white px-8">
              {isLoading ? "Tallennetaan..." : "Tallenna asetukset"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
