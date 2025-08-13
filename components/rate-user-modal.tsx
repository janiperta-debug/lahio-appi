"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Star, X, Heart } from "lucide-react"

interface RateUserModalProps {
  isOpen: boolean
  onClose: () => void
  userName: string
  userId: string
  interactionType?: string
}

export default function RateUserModal({
  isOpen,
  onClose,
  userName,
  userId,
  interactionType = "yhteistyö",
}: RateUserModalProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [review, setReview] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)

      // Auto-close after showing success
      setTimeout(() => {
        onClose()
        setIsSubmitted(false)
        setRating(0)
        setReview("")
      }, 2000)
    }, 1500)
  }

  const ratingLabels = ["", "Huono kokemus", "Ei kovin hyvä", "Ihan ok", "Hyvä kokemus", "Erinomainen!"]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white border-slate-200 shadow-xl">
        {!isSubmitted ? (
          <>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-slate-800 font-sans">Arvostele {userName}</CardTitle>
                    <CardDescription className="text-slate-600">Miten {interactionType} sujui?</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="flex justify-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-slate-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {(hoveredRating || rating) > 0 && (
                    <p className="text-sm font-medium text-slate-700">{ratingLabels[hoveredRating || rating]}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="review" className="text-sm font-medium text-slate-700">
                  Kerro kokemuksestasi (valinnainen)
                </label>
                <Textarea
                  id="review"
                  placeholder="Esim. Anna oli erittäin ystävällinen ja auttoi ostoksissa tehokkaasti. Suosittelen!"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="border-slate-300 focus:border-yellow-500 focus:ring-yellow-500 min-h-[80px]"
                />
                <p className="text-xs text-slate-500">
                  Arvostelusi auttaa muita naapureita luottamaan ja löytämään hyviä yhteistyökumppaneita.
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Heart className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-yellow-800 leading-relaxed">
                      Arvostelut ovat julkisia ja auttavat rakentamaan luottamusta yhteisössä. Ole rehellinen mutta
                      ystävällinen.
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
                  disabled={rating === 0 || isSubmitting}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  {isSubmitting ? "Lähetetään..." : "Lähetä arvostelu"}
                </Button>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className="py-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Kiitos arvostelusta!</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Arvostelusi auttaa rakentamaan luottamusta yhteisössä.
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
