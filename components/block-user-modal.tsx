"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserX, Shield, X } from "lucide-react"

interface BlockUserModalProps {
  isOpen: boolean
  onClose: () => void
  userName: string
  userId: string
}

export default function BlockUserModal({ isOpen, onClose, userName, userId }: BlockUserModalProps) {
  const [isBlocking, setIsBlocking] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)

  const handleBlock = async () => {
    setIsBlocking(true)

    // Simulate API call
    setTimeout(() => {
      setIsBlocking(false)
      setIsBlocked(true)

      // Auto-close after showing success
      setTimeout(() => {
        onClose()
        setIsBlocked(false)
      }, 2000)
    }, 1000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white border-slate-200 shadow-xl">
        {!isBlocked ? (
          <>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <UserX className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-slate-800 font-sans">Estä käyttäjä</CardTitle>
                    <CardDescription className="text-slate-600">Estä: {userName}</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4">
                <p className="text-sm text-slate-700 leading-relaxed">Kun estät käyttäjän:</p>
                <ul className="text-sm text-slate-600 space-y-2 ml-4">
                  <li>• He eivät voi lähettää sinulle viestejä</li>
                  <li>• He eivät näe profiiliasi hauissa</li>
                  <li>• Et näe heidän profiiliaan tai viestejään</li>
                  <li>• Voit perua eston milloin tahansa</li>
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-red-800 leading-relaxed">
                      Jos käyttäjä on käyttäytynyt sopimattomasti, suosittelemme myös raportoimaan heidät.
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
                  onClick={handleBlock}
                  disabled={isBlocking}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  {isBlocking ? "Estetään..." : "Estä käyttäjä"}
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
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Käyttäjä estetty</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {userName} on nyt estetty. Voit hallita estettyjä käyttäjiä asetuksista.
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
