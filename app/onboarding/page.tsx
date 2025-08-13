"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Heart, User, Users, MapPin, ArrowRight, ArrowLeft } from "lucide-react"

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    bio: "",
    interests: [] as string[],
    hasChildren: false,
    childrenAges: "",
    canHelp: [] as string[],
    needsHelp: [] as string[],
  })

  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

  const interestOptions = [
    "Ulkoilu ja luonto",
    "Käsityöt ja askartelu",
    "Lukeminen",
    "Ruoanlaitto",
    "Puutarhanhoito",
    "Liikunta",
    "Musiikki",
    "Valokuvaus",
  ]

  const helpOptions = [
    "Ostosavut",
    "Lastenhoito",
    "Kodin pienet korjaukset",
    "Puutarhatyöt",
    "Tekninen apu",
    "Kuljetus",
    "Seurustelu",
    "Käsityöt",
  ]

  const handleInterestChange = (interest: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      interests: checked ? [...prev.interests, interest] : prev.interests.filter((i) => i !== interest),
    }))
  }

  const handleHelpChange = (help: string, checked: boolean, type: "canHelp" | "needsHelp") => {
    setFormData((prev) => ({
      ...prev,
      [type]: checked ? [...prev[type], help] : prev[type].filter((h) => h !== help),
    }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      window.location.href = "/location-setup"
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="bg-white border-stone-200 shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="w-12 h-12 bg-amber-700 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl text-stone-800 font-sans">Kerro itsestäsi</CardTitle>
            <CardDescription className="text-stone-600 leading-relaxed">
              Vaihe {currentStep} / {totalSteps} - Voit hypätä yli tai palata myöhemmin
            </CardDescription>
            <Progress value={progress} className="mt-4" />
          </CardHeader>

          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <User className="w-5 h-5 text-amber-700" />
                  <h3 className="text-lg font-semibold text-stone-800 font-sans">Perustiedot</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-stone-700">
                    Kerro itsestäsi lyhyesti
                  </Label>
                  <Textarea
                    id="bio"
                    placeholder="Esim. Rakastan luontoa ja käsitöitä. Asun perheen kanssa ja nautin rauhallisista hetkistä..."
                    className="border-stone-300 focus:border-amber-700 focus:ring-amber-700 min-h-[100px]"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  />
                  <p className="text-xs text-stone-500">Vapaaehtoinen - auttaa muita tutustumaan sinuun</p>
                </div>

                <div className="space-y-3">
                  <Label className="text-stone-700">Kiinnostuksen kohteet</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {interestOptions.map((interest) => (
                      <div key={interest} className="flex items-center space-x-2">
                        <Checkbox
                          id={interest}
                          checked={formData.interests.includes(interest)}
                          onCheckedChange={(checked) => handleInterestChange(interest, checked as boolean)}
                        />
                        <Label htmlFor={interest} className="text-sm text-stone-600 cursor-pointer">
                          {interest}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-5 h-5 text-amber-700" />
                  <h3 className="text-lg font-semibold text-stone-800 font-sans">Perhe ja lapset</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasChildren"
                      checked={formData.hasChildren}
                      onCheckedChange={(checked) => setFormData({ ...formData, hasChildren: checked as boolean })}
                    />
                    <Label htmlFor="hasChildren" className="text-stone-700 cursor-pointer">
                      Minulla on lapsia
                    </Label>
                  </div>

                  {formData.hasChildren && (
                    <div className="space-y-2 ml-6">
                      <Label htmlFor="childrenAges" className="text-stone-700">
                        Lasten iät
                      </Label>
                      <Input
                        id="childrenAges"
                        placeholder="Esim. 3v, 7v"
                        className="border-stone-300 focus:border-amber-700 focus:ring-amber-700"
                        value={formData.childrenAges}
                        onChange={(e) => setFormData({ ...formData, childrenAges: e.target.value })}
                      />
                      <p className="text-xs text-stone-500">Auttaa löytämään sopivan ikäisiä leikkikavereita</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-amber-700" />
                  <h3 className="text-lg font-semibold text-stone-800 font-sans">Auttaminen ja tuki</h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-stone-700">Voin auttaa näissä</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {helpOptions.map((help) => (
                        <div key={help} className="flex items-center space-x-2">
                          <Checkbox
                            id={`can-${help}`}
                            checked={formData.canHelp.includes(help)}
                            onCheckedChange={(checked) => handleHelpChange(help, checked as boolean, "canHelp")}
                          />
                          <Label htmlFor={`can-${help}`} className="text-sm text-stone-600 cursor-pointer">
                            {help}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-stone-700">Kaipaisin apua näissä</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {helpOptions.map((help) => (
                        <div key={help} className="flex items-center space-x-2">
                          <Checkbox
                            id={`need-${help}`}
                            checked={formData.needsHelp.includes(help)}
                            onCheckedChange={(checked) => handleHelpChange(help, checked as boolean, "needsHelp")}
                          />
                          <Label htmlFor={`need-${help}`} className="text-sm text-stone-600 cursor-pointer">
                            {help}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6 border-t border-stone-200">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="border-stone-300 text-stone-600 hover:bg-stone-50 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Edellinen
              </Button>

              <Button onClick={nextStep} className="bg-amber-700 hover:bg-amber-800 text-white">
                {currentStep === totalSteps ? "Valmis!" : "Seuraava"}
                {currentStep < totalSteps && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>

            <p className="text-xs text-stone-500 text-center">
              Voit muuttaa kaikkia tietoja myöhemmin profiiliasetuksista
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
