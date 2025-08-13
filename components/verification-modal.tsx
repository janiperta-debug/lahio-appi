"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, X, Phone, Mail, Upload, CheckCircle } from "lucide-react"

interface VerificationModalProps {
  isOpen: boolean
  onClose: () => void
  verificationType: "email" | "phone" | "identity" | "address"
}

export default function VerificationModal({ isOpen, onClose, verificationType }: VerificationModalProps) {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [contactInfo, setContactInfo] = useState("")

  const verificationTypes = {
    email: {
      title: "Sähköpostin varmennus",
      description: "Varmenna sähköpostiosoitteesi lisätäksesi luottamusta",
      icon: Mail,
      placeholder: "sinun@email.fi",
      inputType: "email",
    },
    phone: {
      title: "Puhelinnumeron varmennus",
      description: "Varmenna puhelinnumerosi lisätäksesi luottamusta",
      icon: Phone,
      placeholder: "+358 40 123 4567",
      inputType: "tel",
    },
    identity: {
      title: "Henkilöllisyyden varmennus",
      description: "Varmenna henkilöllisyytesi turvallisesti",
      icon: Shield,
      placeholder: "",
      inputType: "file",
    },
    address: {
      title: "Osoitteen varmennus",
      description: "Varmenna asuinosoitteesi naapuruston vahvistamiseksi",
      icon: Shield,
      placeholder: "Katuosoite, Kaupunki",
      inputType: "text",
    },
  }

  const currentType = verificationTypes[verificationType]
  const IconComponent = currentType.icon

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      if (verificationType === "identity") {
        setStep(3) // Skip code verification for identity
      } else {
        setStep(2) // Go to code verification
      }
    }, 1500)
  }

  const handleVerifyCode = async () => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setStep(3) // Success
    }, 1000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white border-slate-200 shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <IconComponent className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg text-slate-800 font-sans">{currentType.title}</CardTitle>
                <CardDescription className="text-slate-600">{currentType.description}</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <>
              <div className="space-y-4">
                {verificationType === "identity" ? (
                  <div className="space-y-3">
                    <Label className="text-slate-700 font-medium">Lataa henkilöllisyystodistus</Label>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-600 mb-2">Vedä tiedosto tähän tai klikkaa valitaksesi</p>
                      <Button variant="outline" size="sm">
                        Valitse tiedosto
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Tuetut tiedostot: JPG, PNG, PDF. Tiedot käsitellään turvallisesti ja poistetaan varmennuksen
                      jälkeen.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="contact-info" className="text-slate-700 font-medium">
                      {verificationType === "email"
                        ? "Sähköpostiosoite"
                        : verificationType === "phone"
                          ? "Puhelinnumero"
                          : "Osoite"}
                    </Label>
                    <Input
                      id="contact-info"
                      type={currentType.inputType}
                      placeholder={currentType.placeholder}
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      className="border-slate-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                )}

                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-green-800 leading-relaxed">
                        Varmennuksesi lisää luottamusta profiiliisi ja auttaa muita naapureita tuntemaan sinut paremmin.
                        Tietosi pidetään turvassa ja yksityisinä.
                      </p>
                    </div>
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
                  disabled={(!contactInfo && verificationType !== "identity") || isSubmitting}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  {isSubmitting ? "Lähetetään..." : "Lähetä"}
                </Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <IconComponent className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">Varmennuskoodi lähetetty</h3>
                  <p className="text-sm text-slate-600">Lähetimme varmennuskoodin osoitteeseen {contactInfo}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="verification-code" className="text-slate-700 font-medium">
                    Varmennuskoodi
                  </Label>
                  <Input
                    id="verification-code"
                    type="text"
                    placeholder="123456"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="border-slate-300 focus:border-green-500 focus:ring-green-500 text-center text-lg tracking-widest"
                    maxLength={6}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 border-slate-300 text-slate-600 hover:bg-slate-50"
                >
                  Takaisin
                </Button>
                <Button
                  onClick={handleVerifyCode}
                  disabled={verificationCode.length !== 6 || isSubmitting}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  {isSubmitting ? "Varmennetaan..." : "Varmenna"}
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Varmennus onnistui!</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {currentType.title.toLowerCase()} on nyt varmennettu. Tämä lisää luottamusta profiiliisi.
              </p>
              <Button onClick={onClose} className="bg-green-600 hover:bg-green-700 text-white">
                Valmis
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
