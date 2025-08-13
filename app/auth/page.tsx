"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Redirect to profile setup
      window.location.href = "/onboarding"
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-cyan-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Takaisin etusivulle
        </Link>

        <Card className="bg-white border-slate-200 shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="w-12 h-12 bg-cyan-800 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl text-slate-800 font-sans">Tervetuloa mukaan</CardTitle>
            <CardDescription className="text-slate-600 leading-relaxed">
              Luo tili ja aloita tutustuminen naapureihin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="register" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="register" className="text-sm">
                  Liity mukaan
                </TabsTrigger>
                <TabsTrigger value="login" className="text-sm">
                  Kirjaudu sisään
                </TabsTrigger>
              </TabsList>

              <TabsContent value="register">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-700">
                      Nimesi
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Miten sinua kutsutaan?"
                      className="border-slate-300 focus:border-cyan-800 focus:ring-cyan-800"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700">
                      Sähköposti
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="sinun@email.fi"
                      className="border-slate-300 focus:border-cyan-800 focus:ring-cyan-800"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-700">
                      Salasana
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Turvallinen salasana"
                      className="border-slate-300 focus:border-cyan-800 focus:ring-cyan-800"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-cyan-800 hover:bg-cyan-900 text-white mt-6"
                    disabled={isLoading}
                  >
                    {isLoading ? "Luodaan tiliä..." : "Luo tili"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="login">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-slate-700">
                      Sähköposti
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="sinun@email.fi"
                      className="border-slate-300 focus:border-cyan-800 focus:ring-cyan-800"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-slate-700">
                      Salasana
                    </Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Salasanasi"
                      className="border-slate-300 focus:border-cyan-800 focus:ring-cyan-800"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-cyan-800 hover:bg-cyan-900 text-white mt-6"
                    disabled={isLoading}
                  >
                    {isLoading ? "Kirjaudutaan..." : "Kirjaudu sisään"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <p className="text-xs text-slate-500 text-center mt-6 leading-relaxed">
              Liittymällä hyväksyt, että käsittelemme tietojasi turvallisesti.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
