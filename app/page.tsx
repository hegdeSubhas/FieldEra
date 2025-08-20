"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Sprout, Users, MapPin, Star } from "lucide-react"
import { WorkerProfileView } from "@/components/worker-profile"
import { FarmerSearchInterface } from "@/components/farmer-search"
import { BookingManagement } from "@/components/booking-system"
import { ReviewManagement } from "@/components/rating-system"
import { NotificationSystem, OfflineIndicator } from "@/components/notification-system"

export default function HomePage() {
  const [userType, setUserType] = useState<"farmer" | "worker" | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  if (!userType) {
    return <RoleSelection onSelectRole={setUserType} />
  }

  if (!isAuthenticated) {
    return (
      <AuthenticationForm
        userType={userType}
        onAuth={() => setIsAuthenticated(true)}
        onBack={() => setUserType(null)}
      />
    )
  }

  return (
    <>
      {userType === "farmer" ? <FarmerDashboard /> : <WorkerDashboard />}
      <OfflineIndicator />
    </>
  )
}

function RoleSelection({ onSelectRole }: { onSelectRole: (role: "farmer" | "worker") => void }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-primary/10 rounded-full">
              <Sprout className="h-12 w-12 text-primary" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">FieldEra</h1>
            <p className="text-muted-foreground mt-2">Village Workers Platform</p>
            <p className="text-sm text-muted-foreground">ಗ್ರಾಮೀಣ ಕಾರ್ಮಿಕ • ग्रामीण कार्मिक</p>
          </div>
        </div>

        <div className="space-y-4">
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary/50"
            onClick={() => onSelectRole("farmer")}
          >
            <CardContent className="p-6 text-center space-y-4">
              <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto">
                <Sprout className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">I'm a Farmer</h3>
                <p className="text-sm text-muted-foreground mt-1">Find skilled agricultural workers</p>
                <p className="text-xs text-muted-foreground">ನಾನು ರೈತ • मैं किसान हूँ</p>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-secondary/50"
            onClick={() => onSelectRole("worker")}
          >
            <CardContent className="p-6 text-center space-y-4">
              <div className="p-3 bg-secondary/10 rounded-full w-fit mx-auto">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">I'm a Worker</h3>
                <p className="text-sm text-muted-foreground mt-1">Offer your agricultural services</p>
                <p className="text-xs text-muted-foreground">ನಾನು ಕೆಲಸಗಾರ • मैं मजदूर हूँ</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function AuthenticationForm({
  userType,
  onAuth,
  onBack,
}: {
  userType: "farmer" | "worker"
  onAuth: () => void
  onBack: () => void
}) {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            ← Back to Role Selection
          </Button>
          <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto">
            {userType === "farmer" ? (
              <Sprout className="h-8 w-8 text-primary" />
            ) : (
              <Users className="h-8 w-8 text-secondary" />
            )}
          </div>
          <h2 className="text-2xl font-bold">
            {userType === "farmer" ? "Farmer" : "Worker"} {isLogin ? "Login" : "Sign Up"}
          </h2>
        </div>

        <Tabs value={isLogin ? "login" : "signup"} onValueChange={(v) => setIsLogin(v === "login")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+91 98765 43210" className="text-lg h-12" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" className="text-lg h-12" />
              </div>
              <Button onClick={onAuth} className="w-full h-12 text-lg">
                Login
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter your full name" className="text-lg h-12" />
              </div>
              <div>
                <Label htmlFor="phone-signup">Phone Number</Label>
                <Input id="phone-signup" type="tel" placeholder="+91 98765 43210" className="text-lg h-12" />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Village, District" className="text-lg h-12" />
              </div>
              <div>
                <Label htmlFor="password-signup">Password</Label>
                <Input id="password-signup" type="password" className="text-lg h-12" />
              </div>
              <Button onClick={onAuth} className="w-full h-12 text-lg">
                Create Account
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function FarmerDashboard() {
  const [currentView, setCurrentView] = useState<"dashboard" | "search" | "bookings" | "reviews" | "messages">(
    "dashboard",
  )

  if (currentView === "search") {
    return <FarmerSearchInterface onBack={() => setCurrentView("dashboard")} />
  }

  if (currentView === "bookings") {
    return <BookingManagement userType="farmer" onBack={() => setCurrentView("dashboard")} />
  }

  if (currentView === "reviews") {
    return <ReviewManagement userType="farmer" onBack={() => setCurrentView("dashboard")} />
  }

  if (currentView === "messages") {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => setCurrentView("dashboard")}>
                ← Back to Dashboard
              </Button>
              <Sprout className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">Messages</h1>
                <p className="text-sm text-muted-foreground">Chat with Workers</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <NotificationSystem />
              <Badge variant="secondary">Farmer</Badge>
            </div>
          </div>
        </header>
        <main className="p-4">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Messages Yet</h3>
              <p className="text-muted-foreground">Start booking workers to begin conversations</p>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sprout className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold">FieldEra</h1>
              <p className="text-sm text-muted-foreground">Farmer Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <NotificationSystem />
            <Badge variant="secondary">Farmer</Badge>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Find Workers</CardTitle>
              <CardDescription>Search for skilled agricultural laborers</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setCurrentView("search")} className="w-full h-12">
                Browse Workers
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">My Bookings</CardTitle>
              <CardDescription>View and manage your bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setCurrentView("bookings")}
                variant="outline"
                className="w-full h-12 bg-transparent"
              >
                View Bookings
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">My Reviews</CardTitle>
              <CardDescription>Reviews you've written</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setCurrentView("reviews")}
                variant="outline"
                className="w-full h-12 bg-transparent"
              >
                View Reviews
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Messages</CardTitle>
              <CardDescription>Chat with workers</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setCurrentView("messages")}
                variant="outline"
                className="w-full h-12 bg-transparent"
              >
                Open Messages
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Workers</CardTitle>
            <CardDescription>Workers you've recently viewed or booked</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold">Worker Name {i}</h4>
                      <p className="text-sm text-muted-foreground">Ploughing, Harvesting</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">4.{5 + i}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left sm:text-right flex-shrink-0">
                    <p className="font-semibold">₹{500 + i * 50}/day</p>
                    <Button onClick={() => setCurrentView("search")} size="sm" className="mt-2 h-10 px-4">
                      Book Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

function WorkerDashboard() {
  const [currentView, setCurrentView] = useState<"dashboard" | "profile" | "bookings" | "reviews" | "earnings">(
    "dashboard",
  )

  // Mock worker profile data
  const mockWorkerProfile = {
    id: "1",
    name: "Ravi Kumar",
    phone: "+91 98765 43210",
    location: "Mandya, Karnataka",
    skills: ["Ploughing", "Harvesting", "Irrigation", "Seeding"],
    experience: 8,
    pricePerDay: 600,
    pricePerHour: 75,
    rating: 4.8,
    totalReviews: 24,
    bio: "Experienced agricultural worker with 8 years of expertise in various farming activities. Specialized in modern farming techniques and machinery operation. Committed to helping farmers achieve better crop yields.",
    availability: [new Date(), new Date(Date.now() + 86400000), new Date(Date.now() + 172800000)],
    isAvailable: true,
    languages: ["Kannada", "Hindi", "English"],
  }

  if (currentView === "profile") {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => setCurrentView("dashboard")}>
                ← Back to Dashboard
              </Button>
              <Users className="h-8 w-8 text-secondary" />
              <div>
                <h1 className="text-xl font-bold">My Profile</h1>
                <p className="text-sm text-muted-foreground">Worker Profile</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <NotificationSystem />
              <Badge variant="outline">Worker</Badge>
            </div>
          </div>
        </header>

        <main className="p-4">
          <WorkerProfileView profile={mockWorkerProfile} isOwner={true} />
        </main>
      </div>
    )
  }

  if (currentView === "bookings") {
    return <BookingManagement userType="worker" onBack={() => setCurrentView("dashboard")} />
  }

  if (currentView === "reviews") {
    return <ReviewManagement userType="worker" onBack={() => setCurrentView("dashboard")} />
  }

  if (currentView === "earnings") {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => setCurrentView("dashboard")}>
                ← Back to Dashboard
              </Button>
              <Users className="h-8 w-8 text-secondary" />
              <div>
                <h1 className="text-xl font-bold">Earnings</h1>
                <p className="text-sm text-muted-foreground">Track Your Income</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <NotificationSystem />
              <Badge variant="outline">Worker</Badge>
            </div>
          </div>
        </header>
        <main className="p-4 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">₹12,500</p>
                <p className="text-sm text-muted-foreground">15 days worked</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Last Month</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">₹18,200</p>
                <p className="text-sm text-muted-foreground">22 days worked</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Total Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">₹1,45,600</p>
                <p className="text-sm text-muted-foreground">Since joining</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-secondary" />
            <div>
              <h1 className="text-xl font-bold">FieldEra</h1>
              <p className="text-sm text-muted-foreground">Worker Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <NotificationSystem />
            <Badge variant="outline">Worker</Badge>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">My Profile</CardTitle>
              <CardDescription>Update your skills and availability</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setCurrentView("profile")} className="w-full h-12">
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Job Requests</CardTitle>
              <CardDescription>View booking requests from farmers</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setCurrentView("bookings")}
                variant="outline"
                className="w-full h-12 bg-transparent"
              >
                View Requests
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">My Reviews</CardTitle>
              <CardDescription>Reviews from farmers</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setCurrentView("reviews")}
                variant="outline"
                className="w-full h-12 bg-transparent"
              >
                View Reviews
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Earnings</CardTitle>
              <CardDescription>Track your income</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setCurrentView("earnings")}
                variant="outline"
                className="w-full h-12 bg-transparent"
              >
                View Earnings
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold">{mockWorkerProfile.name}</h3>
                <p className="text-muted-foreground">Agricultural Worker</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">
                    {mockWorkerProfile.rating} ({mockWorkerProfile.totalReviews} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Skills</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {mockWorkerProfile.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                  {mockWorkerProfile.skills.length > 3 && (
                    <Badge variant="outline">+{mockWorkerProfile.skills.length - 3} more</Badge>
                  )}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Rate</Label>
                <p className="text-lg font-semibold mt-2">₹{mockWorkerProfile.pricePerDay}/day</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="break-words">{mockWorkerProfile.location}</span>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
