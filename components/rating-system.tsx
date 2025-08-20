"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Star, Users, ThumbsUp, MessageSquare, Calendar, CheckCircle } from "lucide-react"
import { format } from "date-fns"

interface Review {
  id: string
  bookingId: string
  workerId: string
  workerName: string
  farmerId: string
  farmerName: string
  rating: number
  comment: string
  workType: string[]
  workDate: Date
  createdAt: Date
  isHelpful?: boolean
  helpfulCount: number
  response?: {
    comment: string
    createdAt: Date
  }
}

interface BookingRequest {
  id: string
  workerId: string
  workerName: string
  farmerId: string
  farmerName: string
  workType: string[]
  startDate: Date
  endDate: Date
  startTime: string
  endTime: string
  paymentType: "hourly" | "daily"
  totalAmount: number
  description: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  createdAt: Date
  farmerLocation: string
  workerPhone: string
  hasReview?: boolean
}

const MOCK_REVIEWS: Review[] = [
  {
    id: "1",
    bookingId: "2",
    workerId: "2",
    workerName: "Suresh Patil",
    farmerId: "farmer1",
    farmerName: "Rajesh Kumar",
    rating: 5,
    comment:
      "Excellent work on harvesting. Very punctual and skilled worker. Used modern techniques and completed the work efficiently. Would definitely hire again for future farming needs.",
    workType: ["Harvesting"],
    workDate: new Date(Date.now() - 86400000),
    createdAt: new Date(Date.now() - 43200000),
    helpfulCount: 3,
    response: {
      comment:
        "Thank you for the kind words! It was a pleasure working on your farm. Looking forward to helping you again.",
      createdAt: new Date(Date.now() - 21600000),
    },
  },
  {
    id: "2",
    bookingId: "3",
    workerId: "1",
    workerName: "Ravi Kumar",
    farmerId: "farmer2",
    farmerName: "Priya Sharma",
    rating: 4,
    comment:
      "Good work on ploughing and irrigation setup. Worker was knowledgeable and completed the task on time. Minor issues with equipment but overall satisfied.",
    workType: ["Ploughing", "Irrigation"],
    workDate: new Date(Date.now() - 172800000),
    createdAt: new Date(Date.now() - 129600000),
    helpfulCount: 1,
  },
  {
    id: "3",
    bookingId: "4",
    workerId: "3",
    workerName: "Lakshmi Devi",
    farmerId: "farmer1",
    farmerName: "Rajesh Kumar",
    rating: 5,
    comment:
      "Outstanding work on organic farming practices. Very knowledgeable about pest control and crop monitoring. Helped improve our yield significantly.",
    workType: ["Pest Control", "Crop Monitoring"],
    workDate: new Date(Date.now() - 259200000),
    createdAt: new Date(Date.now() - 216000000),
    helpfulCount: 5,
  },
]

export function ReviewForm({
  booking,
  onBack,
  onReviewSubmit,
}: {
  booking: BookingRequest
  onBack: () => void
  onReviewSubmit: (review: Review) => void
}) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Please select a rating")
      return
    }

    if (comment.trim().length < 10) {
      alert("Please provide a detailed review (at least 10 characters)")
      return
    }

    setIsSubmitting(true)

    const review: Review = {
      id: Date.now().toString(),
      bookingId: booking.id,
      workerId: booking.workerId,
      workerName: booking.workerName,
      farmerId: booking.farmerId,
      farmerName: booking.farmerName,
      rating,
      comment: comment.trim(),
      workType: booking.workType,
      workDate: booking.endDate,
      createdAt: new Date(),
      helpfulCount: 0,
    }

    // Simulate API call
    setTimeout(() => {
      onReviewSubmit(review)
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onBack}>
            ← Back to Bookings
          </Button>
          <div>
            <h1 className="text-xl font-bold">Rate & Review</h1>
            <p className="text-sm text-muted-foreground">Share your experience with {booking.workerName}</p>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto space-y-6">
        {/* Booking Summary */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{booking.workerName}</h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(booking.startDate, "MMM dd")} - {format(booking.endDate, "MMM dd, yyyy")}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {booking.workType.map((type) => (
                    <Badge key={type} variant="outline" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">₹{booking.totalAmount}</p>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rating Form */}
        <Card>
          <CardHeader>
            <CardTitle>Rate Your Experience</CardTitle>
            <CardDescription>How would you rate the work quality and professionalism?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Star Rating */}
            <div className="text-center space-y-4">
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-10 w-10 ${
                        star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                {rating === 0 && "Click to rate"}
                {rating === 1 && "Poor - Not satisfied"}
                {rating === 2 && "Fair - Below expectations"}
                {rating === 3 && "Good - Met expectations"}
                {rating === 4 && "Very Good - Exceeded expectations"}
                {rating === 5 && "Excellent - Outstanding work"}
              </div>
            </div>

            <Separator />

            {/* Written Review */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="comment" className="text-base font-medium">
                  Write Your Review
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Share details about work quality, punctuality, professionalism, and overall experience
                </p>
              </div>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Describe your experience with this worker. What did they do well? Any areas for improvement? Would you hire them again?"
                rows={6}
                className="resize-none"
              />
              <div className="text-right text-sm text-muted-foreground">{comment.length}/500 characters</div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={rating === 0 || comment.trim().length < 10 || isSubmitting}
              className="w-full h-12"
            >
              {isSubmitting ? "Submitting Review..." : "Submit Review"}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export function ReviewSuccess({
  review,
  onClose,
}: {
  review: Review
  onClose: () => void
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 text-center space-y-6">
          <div className="p-4 bg-green-100 rounded-full w-fit mx-auto">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-2">Review Submitted!</h2>
            <p className="text-muted-foreground">
              Thank you for sharing your experience. Your review helps other farmers make informed decisions.
            </p>
          </div>

          <div className="text-left space-y-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Worker:</span>
              <span className="text-sm font-medium">{review.workerName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Your Rating:</span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Date:</span>
              <span className="text-sm font-medium">{format(review.createdAt, "MMM dd, yyyy")}</span>
            </div>
          </div>

          <Button onClick={onClose} className="w-full">
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export function ReviewManagement({
  userType,
  onBack,
}: {
  userType: "farmer" | "worker"
  onBack: () => void
}) {
  const [reviews] = useState<Review[]>(MOCK_REVIEWS)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)

  if (selectedReview) {
    return <ReviewDetails review={selectedReview} userType={userType} onBack={() => setSelectedReview(null)} />
  }

  const userReviews =
    userType === "farmer"
      ? reviews.filter((r) => r.farmerId === "farmer1") // Mock farmer ID
      : reviews.filter((r) => r.workerId === "1" || r.workerId === "2" || r.workerId === "3") // Mock worker IDs

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onBack}>
            ← Back to Dashboard
          </Button>
          <div>
            <h1 className="text-xl font-bold">{userType === "farmer" ? "My Reviews" : "Reviews About Me"}</h1>
            <p className="text-sm text-muted-foreground">
              {userType === "farmer" ? "Reviews you've written" : "Reviews from farmers"}
            </p>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-4xl mx-auto">
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Reviews</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="high-rated">High Rated</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {userReviews.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
                  <p className="text-muted-foreground">
                    {userType === "farmer"
                      ? "Complete bookings to leave reviews for workers"
                      : "Complete work to receive reviews from farmers"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              userReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  userType={userType}
                  onClick={() => setSelectedReview(review)}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            {userReviews
              .filter((r) => Date.now() - r.createdAt.getTime() < 7 * 24 * 60 * 60 * 1000) // Last 7 days
              .map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  userType={userType}
                  onClick={() => setSelectedReview(review)}
                />
              ))}
          </TabsContent>

          <TabsContent value="high-rated" className="space-y-4">
            {userReviews
              .filter((r) => r.rating >= 4)
              .map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  userType={userType}
                  onClick={() => setSelectedReview(review)}
                />
              ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function ReviewCard({
  review,
  userType,
  onClick,
}: {
  review: Review
  userType: "farmer" | "worker"
  onClick: () => void
}) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{userType === "farmer" ? review.workerName : review.farmerName}</h3>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
                <span className="text-sm text-muted-foreground ml-2">{format(review.createdAt, "MMM dd, yyyy")}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ThumbsUp className="h-4 w-4" />
            <span>{review.helpfulCount}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-1">
            {review.workType.map((type) => (
              <Badge key={type} variant="outline" className="text-xs">
                {type}
              </Badge>
            ))}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-3">{review.comment}</p>

          {review.response && (
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-secondary" />
                <span className="text-sm font-medium">Worker Response</span>
                <span className="text-xs text-muted-foreground">{format(review.response.createdAt, "MMM dd")}</span>
              </div>
              <p className="text-sm text-muted-foreground">{review.response.comment}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function ReviewDetails({
  review,
  userType,
  onBack,
}: {
  review: Review
  userType: "farmer" | "worker"
  onBack: () => void
}) {
  const [response, setResponse] = useState("")
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false)

  const handleResponseSubmit = async () => {
    if (response.trim().length < 10) {
      alert("Please provide a detailed response (at least 10 characters)")
      return
    }

    setIsSubmittingResponse(true)

    // Simulate API call
    setTimeout(() => {
      console.log("Response submitted:", response)
      setIsSubmittingResponse(false)
      onBack()
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onBack}>
            ← Back to Reviews
          </Button>
          <div>
            <h1 className="text-xl font-bold">Review Details</h1>
            <p className="text-sm text-muted-foreground">
              Review from {userType === "farmer" ? "you" : review.farmerName}
            </p>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Review Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    {userType === "farmer" ? review.workerName : review.farmerName}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                    <span className="text-sm text-muted-foreground ml-2">
                      {format(review.createdAt, "MMMM dd, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ThumbsUp className="h-4 w-4" />
                <span>{review.helpfulCount} helpful</span>
              </div>
            </div>

            <Separator />

            {/* Work Details */}
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Work Type</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {review.workType.map((type) => (
                    <Badge key={type} variant="secondary">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Work Date</Label>
                <p className="font-medium">{format(review.workDate, "MMMM dd, yyyy")}</p>
              </div>
            </div>

            <Separator />

            {/* Review Content */}
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Review</Label>
              <p className="mt-2 text-sm leading-relaxed">{review.comment}</p>
            </div>

            {/* Existing Response */}
            {review.response && (
              <>
                <Separator />
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="h-5 w-5 text-secondary" />
                    <span className="font-medium">Worker Response</span>
                    <span className="text-sm text-muted-foreground">
                      {format(review.response.createdAt, "MMM dd, yyyy")}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">{review.response.comment}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Response Form (for workers only) */}
        {userType === "worker" && !review.response && (
          <Card>
            <CardHeader>
              <CardTitle>Respond to Review</CardTitle>
              <CardDescription>Thank the farmer and address any feedback</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Thank the farmer for their feedback and share your thoughts about the work experience..."
                rows={4}
                className="resize-none"
              />
              <div className="text-right text-sm text-muted-foreground">{response.length}/300 characters</div>
              <Button
                onClick={handleResponseSubmit}
                disabled={response.trim().length < 10 || isSubmittingResponse}
                className="w-full"
              >
                {isSubmittingResponse ? "Submitting Response..." : "Submit Response"}
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
