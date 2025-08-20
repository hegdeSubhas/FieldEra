"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  CalendarIcon,
  Clock,
  Users,
  MapPin,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  CreditCard,
  Banknote,
  Smartphone,
  QrCode,
  Copy,
  Download,
} from "lucide-react"
import { format } from "date-fns"
import { ReviewForm, ReviewSuccess } from "@/components/rating-system"

interface Worker {
  id: string
  name: string
  phone: string
  location: string
  skills: string[]
  experience: number
  pricePerDay: number
  pricePerHour: number
  rating: number
  totalReviews: number
  bio: string
  availability: Date[]
  isAvailable: boolean
  languages: string[]
  distance?: number
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
  paymentMethod: "cash" | "upi" | "phonepe" | "gpay"
  totalAmount: number
  description: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  createdAt: Date
  farmerLocation: string
  workerPhone: string
  hasReview?: boolean
}

const WORK_TYPES = [
  "Ploughing",
  "Harvesting",
  "Irrigation",
  "Seeding",
  "Weeding",
  "Fertilizer Application",
  "Pest Control",
  "Crop Monitoring",
  "Machinery Operation",
  "Livestock Care",
  "Dairy Management",
]

const TIME_SLOTS = [
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
]

const MOCK_BOOKINGS: BookingRequest[] = [
  {
    id: "1",
    workerId: "1",
    workerName: "Ravi Kumar",
    farmerId: "farmer1",
    farmerName: "Suresh Farmer",
    workType: ["Ploughing", "Seeding"],
    startDate: new Date(Date.now() + 86400000),
    endDate: new Date(Date.now() + 172800000),
    startTime: "08:00",
    endTime: "16:00",
    paymentType: "daily",
    paymentMethod: "cash",
    totalAmount: 1200,
    description: "Need ploughing for 2 acres and seeding work",
    status: "pending",
    createdAt: new Date(),
    farmerLocation: "Mandya, Karnataka",
    workerPhone: "+91 98765 43210",
  },
  {
    id: "2",
    workerId: "2",
    workerName: "Suresh Patil",
    farmerId: "farmer1",
    farmerName: "Suresh Farmer",
    workType: ["Harvesting"],
    startDate: new Date(Date.now() - 86400000),
    endDate: new Date(Date.now() - 86400000),
    startTime: "07:00",
    endTime: "15:00",
    paymentType: "daily",
    paymentMethod: "upi",
    totalAmount: 750,
    description: "Harvesting rice crop",
    status: "completed",
    createdAt: new Date(Date.now() - 172800000),
    farmerLocation: "Mandya, Karnataka",
    workerPhone: "+91 87654 32109",
  },
]

export function BookingForm({
  worker,
  onBack,
  onBookingComplete,
}: {
  worker: Worker
  onBack: () => void
  onBookingComplete: (booking: BookingRequest) => void
}) {
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>([])
  const [paymentType, setPaymentType] = useState<"hourly" | "daily">("daily")
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "upi" | "phonepe" | "gpay">("cash")
  const [description, setDescription] = useState("")
  const [farmerLocation, setFarmerLocation] = useState("")

  const calculateAmount = () => {
    if (selectedDates.length === 0) return 0

    if (paymentType === "daily") {
      return selectedDates.length * worker.pricePerDay
    } else {
      if (!startTime || !endTime) return 0
      const start = Number.parseInt(startTime.split(":")[0])
      const end = Number.parseInt(endTime.split(":")[0])
      const hours = end - start
      return selectedDates.length * hours * worker.pricePerHour
    }
  }

  const handleSubmit = () => {
    if (selectedDates.length === 0 || selectedWorkTypes.length === 0 || !farmerLocation) {
      alert("Please fill all required fields")
      return
    }

    const booking: BookingRequest = {
      id: Date.now().toString(),
      workerId: worker.id,
      workerName: worker.name,
      farmerId: "farmer1", // Mock farmer ID
      farmerName: "Current Farmer", // Mock farmer name
      workType: selectedWorkTypes,
      startDate: selectedDates[0],
      endDate: selectedDates[selectedDates.length - 1],
      startTime,
      endTime,
      paymentType,
      paymentMethod,
      totalAmount: calculateAmount(),
      description,
      status: "pending",
      createdAt: new Date(),
      farmerLocation,
      workerPhone: worker.phone,
    }

    onBookingComplete(booking)
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "cash":
        return <Banknote className="h-4 w-4" />
      case "upi":
        return <CreditCard className="h-4 w-4" />
      case "phonepe":
        return <Smartphone className="h-4 w-4 text-purple-600" />
      case "gpay":
        return <Smartphone className="h-4 w-4 text-blue-600" />
      default:
        return <CreditCard className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onBack}>
            ← Back to Profile
          </Button>
          <div>
            <h1 className="text-xl font-bold">Book {worker.name}</h1>
            <p className="text-sm text-muted-foreground">Create a new booking request</p>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-4xl mx-auto space-y-6">
        {/* Worker Summary */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{worker.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">
                    {worker.rating} ({worker.totalReviews} reviews)
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{worker.location}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">₹{worker.pricePerDay}/day</p>
                <p className="text-sm text-muted-foreground">₹{worker.pricePerHour}/hour</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* Date Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Select Dates
                </CardTitle>
                <CardDescription>Choose the dates you need the worker</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="multiple"
                  selected={selectedDates}
                  onSelect={(dates) => setSelectedDates(dates || [])}
                  disabled={(date) =>
                    date < new Date() || !worker.availability.some((d) => d.toDateString() === date.toDateString())
                  }
                  className="rounded-md border"
                />
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>Selected dates: {selectedDates.length}</p>
                  {selectedDates.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedDates.map((date, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {format(date, "MMM dd")}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Work Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Work Type</CardTitle>
                <CardDescription>Select the type of work needed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {worker.skills.map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={skill}
                        checked={selectedWorkTypes.includes(skill)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedWorkTypes([...selectedWorkTypes, skill])
                          } else {
                            setSelectedWorkTypes(selectedWorkTypes.filter((t) => t !== skill))
                          }
                        }}
                        className="rounded"
                      />
                      <Label htmlFor={skill} className="text-sm">
                        {skill}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Time and Payment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Time & Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Payment Type</Label>
                  <Select value={paymentType} onValueChange={(value: "hourly" | "daily") => setPaymentType(value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily Rate (₹{worker.pricePerDay}/day)</SelectItem>
                      <SelectItem value="hourly">Hourly Rate (₹{worker.pricePerHour}/hour)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Payment Method</Label>
                  <Select
                    value={paymentMethod}
                    onValueChange={(value: "cash" | "upi" | "phonepe" | "gpay") => setPaymentMethod(value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">
                        <div className="flex items-center gap-2">
                          <Banknote className="h-4 w-4" />
                          <span>Cash Payment</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="upi">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          <span>UPI Payment</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="phonepe">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4 text-purple-600" />
                          <span>PhonePe</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="gpay">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4 text-blue-600" />
                          <span>Google Pay</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {paymentMethod === "cash" && "Payment will be made in cash at the work location"}
                    {paymentMethod === "upi" && "Payment via UPI ID or QR code"}
                    {paymentMethod === "phonepe" && "Payment through PhonePe app"}
                    {paymentMethod === "gpay" && "Payment through Google Pay app"}
                  </p>
                </div>

                {paymentType === "hourly" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startTime">Start Time</Label>
                      <Select value={startTime} onValueChange={setStartTime}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select start time" />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_SLOTS.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="endTime">End Time</Label>
                      <Select value={endTime} onValueChange={setEndTime}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select end time" />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_SLOTS.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                <div className="p-4 bg-primary/5 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total Amount:</span>
                    <span className="text-xl font-bold text-primary">₹{calculateAmount()}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedDates.length} day(s) × ₹
                    {paymentType === "daily"
                      ? worker.pricePerDay
                      : startTime && endTime
                        ? (Number.parseInt(endTime.split(":")[0]) - Number.parseInt(startTime.split(":")[0])) *
                          worker.pricePerHour
                        : 0}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    {getPaymentMethodIcon(paymentMethod)}
                    <span>
                      {paymentMethod === "cash" && "Cash Payment"}
                      {paymentMethod === "upi" && "UPI Payment"}
                      {paymentMethod === "phonepe" && "PhonePe Payment"}
                      {paymentMethod === "gpay" && "Google Pay Payment"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Details */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="location">Farm Location *</Label>
                  <Input
                    id="location"
                    value={farmerLocation}
                    onChange={(e) => setFarmerLocation(e.target.value)}
                    placeholder="Enter your farm location"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Work Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the work requirements, field size, special instructions..."
                    rows={4}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleSubmit} className="w-full h-12 text-lg">
              Send Booking Request
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

export function BookingConfirmation({
  booking,
  onClose,
}: {
  booking: BookingRequest
  onClose: () => void
}) {
  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "cash":
        return <Banknote className="h-4 w-4" />
      case "upi":
        return <CreditCard className="h-4 w-4" />
      case "phonepe":
        return <Smartphone className="h-4 w-4 text-purple-600" />
      case "gpay":
        return <Smartphone className="h-4 w-4 text-blue-600" />
      default:
        return <CreditCard className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 text-center space-y-6">
          <div className="p-4 bg-green-100 rounded-full w-fit mx-auto">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-2">Booking Request Sent!</h2>
            <p className="text-muted-foreground">
              Your booking request has been sent to {booking.workerName}. You'll receive a notification once they
              respond.
            </p>
          </div>

          <div className="text-left space-y-2 p-4 bg-muted/50 rounded-lg">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Booking ID:</span>
              <span className="text-sm font-medium">#{booking.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Worker:</span>
              <span className="text-sm font-medium">{booking.workerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Dates:</span>
              <span className="text-sm font-medium">
                {format(booking.startDate, "MMM dd")} - {format(booking.endDate, "MMM dd")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total:</span>
              <span className="text-sm font-bold text-primary">₹{booking.totalAmount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Payment:</span>
              <div className="flex items-center gap-1">
                {getPaymentMethodIcon(booking.paymentMethod)}
                <span className="text-sm font-medium capitalize">
                  {booking.paymentMethod === "phonepe"
                    ? "PhonePe"
                    : booking.paymentMethod === "gpay"
                      ? "Google Pay"
                      : booking.paymentMethod.toUpperCase()}
                </span>
              </div>
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

export function BookingManagement({
  userType,
  onBack,
}: {
  userType: "farmer" | "worker"
  onBack: () => void
}) {
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null)
  const [bookings] = useState<BookingRequest[]>(MOCK_BOOKINGS)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [showReviewSuccess, setShowReviewSuccess] = useState(false)
  const [submittedReview, setSubmittedReview] = useState<any>(null)

  const updateBookingStatus = (bookingId: string, status: BookingRequest["status"]) => {
    // In a real app, this would update the backend
    console.log(`Updating booking ${bookingId} to ${status}`)
  }

  const handleReviewSubmit = (review: any) => {
    setSubmittedReview(review)
    setShowReviewForm(false)
    setShowReviewSuccess(true)
  }

  if (showReviewSuccess && submittedReview) {
    return (
      <ReviewSuccess
        review={submittedReview}
        onClose={() => {
          setShowReviewSuccess(false)
          setSubmittedReview(null)
          setSelectedBooking(null)
        }}
      />
    )
  }

  if (showReviewForm && selectedBooking) {
    return (
      <ReviewForm
        booking={selectedBooking}
        onBack={() => setShowReviewForm(false)}
        onReviewSubmit={handleReviewSubmit}
      />
    )
  }

  if (selectedBooking) {
    return (
      <BookingDetails
        booking={selectedBooking}
        userType={userType}
        onBack={() => setSelectedBooking(null)}
        onUpdateStatus={updateBookingStatus}
        onReviewClick={() => setShowReviewForm(true)}
      />
    )
  }

  const getStatusColor = (status: BookingRequest["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: BookingRequest["status"]) => {
    switch (status) {
      case "pending":
        return <AlertCircle className="h-4 w-4" />
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onBack}>
            ← Back to Dashboard
          </Button>
          <div>
            <h1 className="text-xl font-bold">{userType === "farmer" ? "My Bookings" : "Job Requests"}</h1>
            <p className="text-sm text-muted-foreground">
              {userType === "farmer" ? "Manage your worker bookings" : "View and respond to booking requests"}
            </p>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-4xl mx-auto">
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          {["all", "pending", "confirmed", "completed"].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              {bookings
                .filter((booking) => tab === "all" || booking.status === tab)
                .map((booking) => (
                  <Card
                    key={booking.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">
                              {userType === "farmer" ? booking.workerName : booking.farmerName}
                            </h3>
                            <Badge className={`${getStatusColor(booking.status)} flex items-center gap-1`}>
                              {getStatusIcon(booking.status)}
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </Badge>
                            {userType === "farmer" && booking.status === "completed" && !booking.hasReview && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200"
                              >
                                Review Pending
                              </Badge>
                            )}
                          </div>

                          <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="h-4 w-4" />
                              <span>
                                {format(booking.startDate, "MMM dd, yyyy")} - {format(booking.endDate, "MMM dd, yyyy")}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{userType === "farmer" ? booking.workerName : booking.farmerLocation}</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {booking.workType.map((type) => (
                                <Badge key={type} variant="outline" className="text-xs">
                                  {type}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-xl font-bold text-primary">₹{booking.totalAmount}</p>
                          <p className="text-xs text-muted-foreground">
                            {booking.paymentType === "daily" ? "Daily rate" : "Hourly rate"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  )
}

function BookingDetails({
  booking,
  userType,
  onBack,
  onUpdateStatus,
  onReviewClick,
}: {
  booking: BookingRequest
  userType: "farmer" | "worker"
  onBack: () => void
  onUpdateStatus: (bookingId: string, status: BookingRequest["status"]) => void
  onReviewClick?: () => void
}) {
  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "cash":
        return <Banknote className="h-4 w-4" />
      case "upi":
        return <CreditCard className="h-4 w-4" />
      case "phonepe":
        return <Smartphone className="h-4 w-4 text-purple-600" />
      case "gpay":
        return <Smartphone className="h-4 w-4 text-blue-600" />
      default:
        return <CreditCard className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onBack}>
            ← Back to Bookings
          </Button>
          <div>
            <h1 className="text-xl font-bold">Booking #{booking.id}</h1>
            <p className="text-sm text-muted-foreground">Booking details and actions</p>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Booking Details</span>
              <Badge
                className={`${
                  booking.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : booking.status === "confirmed"
                      ? "bg-blue-100 text-blue-800"
                      : booking.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                }`}
              >
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  {userType === "farmer" ? "Worker" : "Farmer"}
                </Label>
                <p className="font-semibold">{userType === "farmer" ? booking.workerName : booking.farmerName}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Total Amount</Label>
                <p className="font-semibold text-primary text-xl">₹{booking.totalAmount}</p>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-muted-foreground">Payment Method</Label>
              <div className="flex items-center gap-2 mt-1">
                {getPaymentMethodIcon(booking.paymentMethod)}
                <span className="font-semibold">
                  {booking.paymentMethod === "cash" && "Cash Payment"}
                  {booking.paymentMethod === "upi" && "UPI Payment"}
                  {booking.paymentMethod === "phonepe" && "PhonePe"}
                  {booking.paymentMethod === "gpay" && "Google Pay"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {booking.paymentMethod === "cash" && "Payment will be made in cash at work completion"}
                {booking.paymentMethod === "upi" && "Payment via UPI transfer"}
                {booking.paymentMethod === "phonepe" && "Payment through PhonePe app"}
                {booking.paymentMethod === "gpay" && "Payment through Google Pay app"}
              </p>

              {userType === "farmer" && (booking.paymentMethod === "phonepe" || booking.paymentMethod === "gpay") && (
                <div className="mt-3">
                  <QRCodePayment
                    paymentMethod={booking.paymentMethod}
                    amount={booking.totalAmount}
                    workerName={booking.workerName}
                    workerPhone={booking.workerPhone}
                  />
                </div>
              )}
            </div>

            <Separator />

            <div>
              <Label className="text-sm font-medium text-muted-foreground">Work Dates</Label>
              <p className="font-semibold">
                {format(booking.startDate, "MMMM dd, yyyy")} - {format(booking.endDate, "MMMM dd, yyyy")}
              </p>
            </div>

            {booking.startTime && booking.endTime && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Work Hours</Label>
                <p className="font-semibold">
                  {booking.startTime} - {booking.endTime}
                </p>
              </div>
            )}

            <div>
              <Label className="text-sm font-medium text-muted-foreground">Work Type</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {booking.workType.map((type) => (
                  <Badge key={type} variant="secondary">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-muted-foreground">Location</Label>
              <p className="font-semibold">{booking.farmerLocation}</p>
            </div>

            {booking.description && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                <p className="text-sm">{booking.description}</p>
              </div>
            )}

            <Separator />

            <div>
              <Label className="text-sm font-medium text-muted-foreground">Contact</Label>
              <p className="font-semibold">{booking.workerPhone}</p>
            </div>
          </CardContent>
        </Card>

        {userType === "worker" && booking.status === "pending" && (
          <div className="flex gap-4">
            <Button onClick={() => onUpdateStatus(booking.id, "confirmed")} className="flex-1">
              Accept Booking
            </Button>
            <Button onClick={() => onUpdateStatus(booking.id, "cancelled")} variant="outline" className="flex-1">
              Decline Booking
            </Button>
          </div>
        )}

        {booking.status === "confirmed" && (
          <Button onClick={() => onUpdateStatus(booking.id, "completed")} className="w-full">
            Mark as Completed
          </Button>
        )}

        {userType === "farmer" && booking.status === "completed" && !booking.hasReview && onReviewClick && (
          <Button onClick={onReviewClick} className="w-full bg-transparent" variant="outline">
            <Star className="h-4 w-4 mr-2" />
            Rate & Review Worker
          </Button>
        )}
      </main>
    </div>
  )
}

function QRCodePayment({
  paymentMethod,
  amount,
  workerName,
  workerPhone,
}: {
  paymentMethod: "phonepe" | "gpay"
  amount: number
  workerName: string
  workerPhone: string
}) {
  const [qrGenerated, setQrGenerated] = useState(false)

  const generateQRCode = () => {
    setQrGenerated(true)
  }

  const copyUPIId = () => {
    const upiId = `${workerPhone.replace(/\s+/g, "")}@${paymentMethod === "phonepe" ? "ybl" : "okaxis"}`
    navigator.clipboard.writeText(upiId)
  }

  const downloadQR = () => {
    // In a real app, this would download the QR code image
    console.log("[v0] Downloading QR code")
  }

  const upiId = `${workerPhone.replace(/\s+/g, "")}@${paymentMethod === "phonepe" ? "ybl" : "okaxis"}`
  const paymentUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(workerName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Payment for agricultural work - ${workerName}`)}`

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          onClick={generateQRCode}
          className={`w-full ${paymentMethod === "phonepe" ? "bg-purple-600 hover:bg-purple-700" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          <QrCode className="h-4 w-4 mr-2" />
          Generate {paymentMethod === "phonepe" ? "PhonePe" : "GPay"} QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className={`h-5 w-5 ${paymentMethod === "phonepe" ? "text-purple-600" : "text-blue-600"}`} />
            {paymentMethod === "phonepe" ? "PhonePe" : "Google Pay"} Payment
          </DialogTitle>
          <DialogDescription>
            Scan the QR code with your {paymentMethod === "phonepe" ? "PhonePe" : "Google Pay"} app to pay {workerName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* QR Code Display */}
          <div className="flex justify-center p-6 bg-white border-2 border-dashed border-gray-300 rounded-lg">
            {qrGenerated ? (
              <div className="text-center space-y-2">
                {/* QR Code Placeholder - In real app, this would be actual QR code */}
                <div className="w-48 h-48 bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <QrCode className="h-16 w-16 mx-auto mb-2 text-gray-400" />
                    <p className="text-xs text-gray-500">QR Code for ₹{amount}</p>
                  </div>
                </div>
                <p className="text-sm font-medium">{workerName}</p>
                <p className="text-lg font-bold text-primary">₹{amount}</p>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <QrCode className="h-12 w-12 mx-auto mb-2" />
                <p>Click "Generate QR Code" to create payment QR</p>
              </div>
            )}
          </div>

          {qrGenerated && (
            <>
              {/* Payment Details */}
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">UPI ID:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono">{upiId}</span>
                    <Button size="sm" variant="ghost" onClick={copyUPIId}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Amount:</span>
                  <span className="text-sm font-semibold">₹{amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Payee:</span>
                  <span className="text-sm font-semibold">{workerName}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={downloadQR}>
                  <Download className="h-4 w-4 mr-2" />
                  Download QR
                </Button>
                <Button
                  className={`flex-1 ${paymentMethod === "phonepe" ? "bg-purple-600 hover:bg-purple-700" : "bg-blue-600 hover:bg-blue-700"}`}
                  onClick={() => window.open(paymentUrl, "_blank")}
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  Open {paymentMethod === "phonepe" ? "PhonePe" : "GPay"}
                </Button>
              </div>

              {/* Instructions */}
              <div className="text-xs text-gray-600 space-y-1">
                <p>• Scan the QR code using your {paymentMethod === "phonepe" ? "PhonePe" : "Google Pay"} app</p>
                <p>• Verify the amount and payee details</p>
                <p>• Complete the payment and share screenshot with worker</p>
                <p>• Keep the transaction ID for your records</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
