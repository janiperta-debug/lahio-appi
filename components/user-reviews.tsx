"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, User } from "lucide-react"

interface Review {
  id: number
  reviewerName: string
  rating: number
  comment: string
  date: string
  interactionType: string
}

interface UserReviewsProps {
  reviews: Review[]
  averageRating: number
  totalReviews: number
}

export default function UserReviews({ reviews, averageRating, totalReviews }: UserReviewsProps) {
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}`}
          />
        ))}
      </div>
    )
  }

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0]
    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating - 1]++
      }
    })
    return distribution.reverse() // Show 5 stars first
  }

  const distribution = getRatingDistribution()

  return (
    <Card className="bg-white border-slate-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg text-slate-800 font-sans flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-600" />
          Arvostelut ({totalReviews})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rating Summary */}
        <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-800">{averageRating.toFixed(1)}</div>
            <div className="flex justify-center mb-1">{renderStars(Math.round(averageRating))}</div>
            <div className="text-xs text-yellow-700">{totalReviews} arvostelua</div>
          </div>

          <div className="flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map((stars, index) => (
              <div key={stars} className="flex items-center gap-2 text-xs">
                <span className="w-3 text-slate-600">{stars}</span>
                <Star className="w-3 h-3 text-yellow-500" />
                <div className="flex-1 bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{
                      width: totalReviews > 0 ? `${(distribution[index] / totalReviews) * 100}%` : "0%",
                    }}
                  />
                </div>
                <span className="w-6 text-slate-600">{distribution[index]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Individual Reviews */}
        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="border-b border-slate-100 pb-4 last:border-b-0">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-cyan-800" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-slate-800 text-sm">{review.reviewerName}</span>
                      <Badge variant="outline" className="text-xs">
                        {review.interactionType}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(review.rating)}
                      <span className="text-xs text-slate-500">{review.date}</span>
                    </div>
                    {review.comment && <p className="text-sm text-slate-700 leading-relaxed">{review.comment}</p>}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-slate-500">
              <Star className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              <p className="text-sm">Ei vielä arvosteluja</p>
            </div>
          )}

          {reviews.length > 3 && (
            <div className="text-center pt-2">
              <button className="text-sm text-cyan-800 hover:text-cyan-900 font-medium">
                Näytä kaikki {totalReviews} arvostelua
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
