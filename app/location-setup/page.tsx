"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { MapPin, Home, Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function LocationSetupPage() {
  const [address, setAddress] = useState("")
  const [radius, setRadius] = useState([2])
  const [isLoading, setIsLoading] = useState(false)
  const [locationFound, setLocationFound] = useState(false)

  const handleAddressSearch = async () => {
    setIsLoading(true)
    // Simulate geocoding API call
    setTimeout(() => {
      setLocationFound(true)
      setIsLoading(false)
    }, 1500)
  }

  const handleSaveLocation = () => {
    // Save location settings and redirect to dashboard
    window.location.href = "/dashboard"
  }

  const radiusOptions = [
    { value: 0.5, label: "500m", description: "Lähimmät naapurit" },
    { value: 1, label: "1km", description: "Kävelymatkan päässä" },
    { value: 2, label: "2km", description: "Pyöräilymatka" },
    { value: 5, label: "5km", description: "Laajempi alue" },
    { value: 10, label: "10km", description: "Koko kaupunginosa" },
  ]

  const getCurrentOption = () => {
    const currentRadius = radius[0]
    return radiusOptions.find((opt) => opt.value === currentRadius) || radiusOptions[2]
  }

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Back link */}
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 text-stone-600 hover:text-amber-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Takaisin
        </Link>

        <Card className="bg-white border-stone-200 shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="w-12 h-12 bg-amber-700 rounded-lg flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl text-stone-800 font-sans">Aseta kotisi</CardTitle>
            <CardDescription className="text-stone-600 leading-relaxed">
              Määritä kotisi sijainti ja valitse, kuinka kaukaa haluat löytää naapureita
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Privacy Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-amber-700 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-amber-800 text-sm mb-1">Yksityisyytesi on turvassa</h4>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Tarkkaa osoitettasi ei näytetä muille. Muut näkevät vain likimääräisen alueesi ja etäisyyden sinuun.
                  </p>
                </div>
              </div>
            </div>

            {/* Address Input */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Home className="w-5 h-5 text-amber-700" />
                <h3 className="text-lg font-semibold text-stone-800 font-sans">Kotiosoitteesi</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-stone-700">
                  Osoite tai kaupunginosa
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="address"
                    type="text"
                    placeholder="Esim. Punavuori, Helsinki tai Hämeenkatu 1, Tampere"
                    className="border-stone-300 focus:border-amber-700 focus:ring-amber-700 flex-1"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <Button
                    onClick={handleAddressSearch}
                    disabled={!address || isLoading}
                    className="bg-amber-700 hover:bg-amber-800 text-white px-6"
                  >
                    {isLoading ? "Etsitään..." : "Etsi"}
                  </Button>
                </div>
              </div>

              {locationFound && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800">✓ Sijainti löytyi! Punavuori, Helsinki</p>
                </div>
              )}
            </div>

            {/* Radius Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-amber-700" />
                <h3 className="text-lg font-semibold text-stone-800 font-sans">Hakusäde</h3>
              </div>

              <div className="space-y-4">
                <div className="px-4">
                  <Slider value={radius} onValueChange={setRadius} max={10} min={0.5} step={0.5} className="w-full" />
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-700 mb-1">{getCurrentOption().label}</div>
                  <div className="text-sm text-stone-600">{getCurrentOption().description}</div>
                </div>

                <div className="grid grid-cols-5 gap-2 text-xs">
                  {radiusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setRadius([option.value])}
                      className={`p-2 rounded text-center transition-colors ${
                        radius[0] === option.value
                          ? "bg-amber-700 text-white"
                          : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                      }`}
                    >
                      <div className="font-semibold">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Map Preview Placeholder */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-stone-700">Esikatselualue</h4>
              <div className="bg-stone-100 rounded-lg h-48 flex items-center justify-center border-2 border-dashed border-stone-300">
                <div className="text-center text-stone-500">
                  <MapPin className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Karttaesikatselu tulossa</p>
                  <p className="text-xs">Näet hakualueesi kartalla</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-stone-200">
              <Button
                variant="outline"
                className="flex-1 border-stone-300 text-stone-600 hover:bg-stone-50 bg-transparent"
                onClick={() => (window.location.href = "/dashboard")}
              >
                Ohita toistaiseksi
              </Button>
              <Button
                onClick={handleSaveLocation}
                disabled={!locationFound}
                className="flex-1 bg-amber-700 hover:bg-amber-800 text-white"
              >
                Tallenna sijainti
              </Button>
            </div>

            <p className="text-xs text-stone-500 text-center">
              Voit muuttaa sijaintiasi ja hakusädettä milloin tahansa asetuksista
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
