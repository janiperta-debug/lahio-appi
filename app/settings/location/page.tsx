"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { MapPin, Home, Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function LocationSettingsPage() {
  const [address, setAddress] = useState("Punavuori, Helsinki")
  const [radius, setRadius] = useState([2])
  const [isVisible, setIsVisible] = useState(true)
  const [showExactLocation, setShowExactLocation] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const radiusOptions = [
    { value: 0.5, label: "500m" },
    { value: 1, label: "1km" },
    { value: 2, label: "2km" },
    { value: 5, label: "5km" },
    { value: 10, label: "10km" },
  ]

  const handleSave = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      // Show success message or redirect
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-cyan-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Back link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-cyan-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Takaisin hallintapaneeliin
        </Link>

        <Card className="bg-white border-slate-200 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-800 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-slate-800 font-sans">Sijaintiasetukset</CardTitle>
                <CardDescription className="text-slate-600">Hallitse sijaintiasi ja yksityisyyttäsi</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Privacy Controls */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 font-sans flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-800" />
                Yksityisyysasetukset
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <Label htmlFor="visibility" className="text-slate-700 font-medium">
                      Näkyvyys muille
                    </Label>
                    <p className="text-sm text-slate-600 mt-1">Muut voivat löytää sinut hakualueeltaan</p>
                  </div>
                  <Switch id="visibility" checked={isVisible} onCheckedChange={setIsVisible} />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <Label htmlFor="exact-location" className="text-slate-700 font-medium">
                      Tarkka sijainti
                    </Label>
                    <p className="text-sm text-slate-600 mt-1">Näytä tarkka osoite muille (ei suositella)</p>
                  </div>
                  <Switch id="exact-location" checked={showExactLocation} onCheckedChange={setShowExactLocation} />
                </div>
              </div>
            </div>

            {/* Location Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 font-sans flex items-center gap-2">
                <Home className="w-5 h-5 text-cyan-800" />
                Kotisijainti
              </h3>

              <div className="space-y-2">
                <Label htmlFor="current-address" className="text-slate-700">
                  Nykyinen sijainti
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="current-address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="border-slate-300 focus:border-cyan-800 focus:ring-cyan-800 flex-1"
                  />
                  <Button variant="outline" className="border-cyan-800 text-cyan-800 hover:bg-cyan-50 bg-transparent">
                    Päivitä
                  </Button>
                </div>
              </div>
            </div>

            {/* Radius Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 font-sans flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-800" />
                Hakusäde
              </h3>

              <div className="space-y-4">
                <div className="px-4">
                  <Slider value={radius} onValueChange={setRadius} max={10} min={0.5} step={0.5} className="w-full" />
                </div>

                <div className="text-center">
                  <div className="text-xl font-bold text-cyan-800 mb-1">
                    {radiusOptions.find((opt) => opt.value === radius[0])?.label || `${radius[0]}km`}
                  </div>
                  <div className="text-sm text-slate-600">Etsit naapureita tämän säteen sisältä</div>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {radiusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setRadius([option.value])}
                      className={`p-2 rounded text-center transition-colors text-sm ${
                        radius[0] === option.value
                          ? "bg-cyan-800 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
              <h4 className="font-semibold text-cyan-800 text-sm mb-2">Nykyinen tilanne</h4>
              <div className="space-y-1 text-sm text-cyan-700">
                <p>• Sijainti: {isVisible ? "Näkyvissä" : "Piilotettu"}</p>
                <p>• Hakusäde: {radius[0]}km</p>
                <p>• Alue: {address}</p>
                <p>• Tarkka osoite: {showExactLocation ? "Näkyvissä" : "Piilotettu"}</p>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-6 border-t border-slate-200">
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="w-full bg-cyan-800 hover:bg-cyan-900 text-white"
              >
                {isLoading ? "Tallennetaan..." : "Tallenna muutokset"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
