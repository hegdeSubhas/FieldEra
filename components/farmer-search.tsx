"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { WorkerProfileView } from "@/components/worker-profile"
import { Search, Users, MapPin, Star, SlidersHorizontal, X, ArrowUpDown, UserPlus, ShoppingCart } from "lucide-react"

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

const AVAILABLE_SKILLS = [
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

const MOCK_WORKERS: Worker[] = [
  {
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
    bio: "Experienced agricultural worker with 8 years of expertise in various farming activities.",
    availability: [new Date(), new Date(Date.now() + 86400000)],
    isAvailable: true,
    languages: ["Kannada", "Hindi", "English"],
    distance: 5,
  },
  {
    id: "2",
    name: "Suresh Patil",
    phone: "+91 87654 32109",
    location: "Mysore, Karnataka",
    skills: ["Harvesting", "Pest Control", "Machinery Operation"],
    experience: 12,
    pricePerDay: 750,
    pricePerHour: 90,
    rating: 4.9,
    totalReviews: 38,
    bio: "Specialized in modern farming equipment and pest management techniques.",
    availability: [new Date(Date.now() + 86400000), new Date(Date.now() + 172800000)],
    isAvailable: true,
    languages: ["Kannada", "English"],
    distance: 15,
  },
  {
    id: "3",
    name: "Lakshmi Devi",
    phone: "+91 76543 21098",
    location: "Hassan, Karnataka",
    skills: ["Weeding", "Seeding", "Fertilizer Application", "Crop Monitoring"],
    experience: 6,
    pricePerDay: 500,
    pricePerHour: 65,
    rating: 4.7,
    totalReviews: 19,
    bio: "Expert in organic farming practices and crop care.",
    availability: [new Date(), new Date(Date.now() + 259200000)],
    isAvailable: true,
    languages: ["Kannada", "Hindi"],
    distance: 25,
  },
  {
    id: "4",
    name: "Manjunath Gowda",
    phone: "+91 65432 10987",
    location: "Tumkur, Karnataka",
    skills: ["Livestock Care", "Dairy Management", "Irrigation"],
    experience: 15,
    pricePerDay: 800,
    pricePerHour: 100,
    rating: 4.6,
    totalReviews: 42,
    bio: "Specialized in livestock management and dairy operations.",
    availability: [new Date(Date.now() + 86400000)],
    isAvailable: false,
    languages: ["Kannada", "English", "Hindi"],
    distance: 30,
  },
]

interface SearchFilters {
  searchQuery: string
  selectedSkills: string[]
  priceRange: [number, number]
  minRating: number
  maxDistance: number
  availableOnly: boolean
  sortBy: "rating" | "price" | "distance" | "experience"
  sortOrder: "asc" | "desc"
}

export function FarmerSearchInterface({ onBack }: { onBack: () => void }) {
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedWorkers, setSelectedWorkers] = useState<Worker[]>([])
  const [showGroupBooking, setShowGroupBooking] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    searchQuery: "",
    selectedSkills: [],
    priceRange: [0, 1000],
    minRating: 0,
    maxDistance: 50,
    availableOnly: false,
    sortBy: "rating",
    sortOrder: "desc",
  })

  const filteredWorkers = useMemo(() => {
    const filtered = MOCK_WORKERS.filter((worker) => {
      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        const matchesName = worker.name.toLowerCase().includes(query)
        const matchesLocation = worker.location.toLowerCase().includes(query)
        const matchesSkills = worker.skills.some((skill) => skill.toLowerCase().includes(query))
        if (!matchesName && !matchesLocation && !matchesSkills) {
          return false
        }
      }

      // Skills filter
      if (filters.selectedSkills.length > 0) {
        const hasRequiredSkills = filters.selectedSkills.some((skill) => worker.skills.includes(skill))
        if (!hasRequiredSkills) return false
      }

      // Price range filter
      if (worker.pricePerDay < filters.priceRange[0] || worker.pricePerDay > filters.priceRange[1]) {
        return false
      }

      // Rating filter
      if (worker.rating < filters.minRating) {
        return false
      }

      // Distance filter
      if (worker.distance && worker.distance > filters.maxDistance) {
        return false
      }

      // Availability filter
      if (filters.availableOnly && !worker.isAvailable) {
        return false
      }

      return true
    })

    // Sort results
    filtered.sort((a, b) => {
      let comparison = 0

      switch (filters.sortBy) {
        case "rating":
          comparison = a.rating - b.rating
          break
        case "price":
          comparison = a.pricePerDay - b.pricePerDay
          break
        case "distance":
          comparison = (a.distance || 0) - (b.distance || 0)
          break
        case "experience":
          comparison = a.experience - b.experience
          break
      }

      return filters.sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [filters])

  const clearFilters = () => {
    setFilters({
      searchQuery: "",
      selectedSkills: [],
      priceRange: [0, 1000],
      minRating: 0,
      maxDistance: 50,
      availableOnly: false,
      sortBy: "rating",
      sortOrder: "desc",
    })
  }

  const toggleWorkerSelection = (worker: Worker) => {
    setSelectedWorkers((prev) => {
      const isSelected = prev.some((w) => w.id === worker.id)
      if (isSelected) {
        return prev.filter((w) => w.id !== worker.id)
      } else {
        return [...prev, worker]
      }
    })
  }

  const clearSelectedWorkers = () => {
    setSelectedWorkers([])
  }

  const getTotalGroupPrice = () => {
    return selectedWorkers.reduce((total, worker) => total + worker.pricePerDay, 0)
  }

  if (selectedWorker) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => setSelectedWorker(null)}>
              ← Back to Search
            </Button>
            <div>
              <h1 className="text-xl font-bold">{selectedWorker.name}</h1>
              <p className="text-sm text-muted-foreground">Worker Profile</p>
            </div>
          </div>
        </header>
        <main className="p-4">
          <WorkerProfileView profile={selectedWorker} isOwner={false} />
        </main>
      </div>
    )
  }

  if (showGroupBooking) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => setShowGroupBooking(false)}>
              ← Back to Search
            </Button>
            <div>
              <h1 className="text-xl font-bold">Group Booking</h1>
              <p className="text-sm text-muted-foreground">{selectedWorkers.length} workers selected</p>
            </div>
          </div>
        </header>
        <main className="p-4 max-w-4xl mx-auto">
          <GroupBookingForm
            workers={selectedWorkers}
            onBack={() => setShowGroupBooking(false)}
            onRemoveWorker={(workerId) => {
              setSelectedWorkers((prev) => prev.filter((w) => w.id !== workerId))
            }}
          />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={onBack}>
              ← Back to Dashboard
            </Button>
            <div>
              <h1 className="text-xl font-bold">Find Workers</h1>
              <p className="text-sm text-muted-foreground">Search for agricultural laborers</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
            <Badge variant="secondary">{filteredWorkers.length} workers found</Badge>
            {selectedWorkers.length > 0 && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                <Badge variant="default" className="bg-primary">
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  {selectedWorkers.length} selected
                </Badge>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    onClick={() => setShowGroupBooking(true)}
                    className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none text-sm"
                    size="sm"
                  >
                    Book Group (₹{getTotalGroupPrice()})
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearSelectedWorkers}>
                    Clear
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Filters Sidebar */}
        <div className={`${showFilters ? "w-80" : "w-0"} transition-all duration-300 overflow-hidden border-r bg-card`}>
          <div className="p-4 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Filters</h3>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>

            {/* Skills Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Skills Required</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {AVAILABLE_SKILLS.map((skill) => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox
                      id={skill}
                      checked={filters.selectedSkills.includes(skill)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilters((prev) => ({
                            ...prev,
                            selectedSkills: [...prev.selectedSkills, skill],
                          }))
                        } else {
                          setFilters((prev) => ({
                            ...prev,
                            selectedSkills: prev.selectedSkills.filter((s) => s !== skill),
                          }))
                        }
                      }}
                    />
                    <Label htmlFor={skill} className="text-sm">
                      {skill}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Price Range Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Price Range: ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}/day
              </Label>
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, priceRange: value as [number, number] }))}
                max={1000}
                min={0}
                step={50}
                className="w-full"
              />
            </div>

            <Separator />

            {/* Rating Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Minimum Rating: {filters.minRating} stars</Label>
              <Slider
                value={[filters.minRating]}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, minRating: value[0] }))}
                max={5}
                min={0}
                step={0.5}
                className="w-full"
              />
            </div>

            <Separator />

            {/* Distance Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Maximum Distance: {filters.maxDistance} km</Label>
              <Slider
                value={[filters.maxDistance]}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, maxDistance: value[0] }))}
                max={100}
                min={5}
                step={5}
                className="w-full"
              />
            </div>

            <Separator />

            {/* Availability Filter */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="available"
                checked={filters.availableOnly}
                onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, availableOnly: !!checked }))}
              />
              <Label htmlFor="available" className="text-sm">
                Available now only
              </Label>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Search and Sort Bar */}
          <div className="p-4 bg-card border-b space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, location, or skills..."
                  value={filters.searchQuery}
                  onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
                  className="pl-10 h-12"
                />
              </div>
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="h-12 px-4">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {filters.selectedSkills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <button
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          selectedSkills: prev.selectedSkills.filter((s) => s !== skill),
                        }))
                      }
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-sm">Sort by:</Label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      sortBy: value as SearchFilters["sortBy"],
                    }))
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="distance">Distance</SelectItem>
                    <SelectItem value="experience">Experience</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
                    }))
                  }
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="p-4">
            {filteredWorkers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No workers found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search criteria or filters</p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWorkers.map((worker) => (
                  <WorkerCard
                    key={worker.id}
                    worker={worker}
                    onClick={() => setSelectedWorker(worker)}
                    isSelected={selectedWorkers.some((w) => w.id === worker.id)}
                    onToggleSelect={() => toggleWorkerSelection(worker)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function WorkerCard({
  worker,
  onClick,
  isSelected,
  onToggleSelect,
}: {
  worker: Worker
  onClick: () => void
  isSelected?: boolean
  onToggleSelect?: () => void
}) {
  return (
    <Card
      className={`cursor-pointer hover:shadow-lg transition-all ${isSelected ? "ring-2 ring-primary bg-primary/5" : ""}`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{worker.name}</h3>
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{worker.rating}</span>
                <span className="text-xs text-muted-foreground">({worker.totalReviews})</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-primary">₹{worker.pricePerDay}</p>
            <p className="text-xs text-muted-foreground">per day</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{worker.location}</span>
            {worker.distance && <span className="text-xs">• {worker.distance}km away</span>}
          </div>

          <div className="flex flex-wrap gap-1">
            {worker.skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {worker.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{worker.skills.length - 3} more
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{worker.experience} years exp.</span>
              <div className={`flex items-center gap-1 ${worker.isAvailable ? "text-green-600" : "text-red-600"}`}>
                <div className={`w-2 h-2 rounded-full ${worker.isAvailable ? "bg-green-600" : "bg-red-600"}`} />
                {worker.isAvailable ? "Available" : "Busy"}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" size="sm" onClick={onClick}>
            View Profile
          </Button>
          {onToggleSelect && (
            <Button
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onToggleSelect()
              }}
              className={isSelected ? "bg-primary" : ""}
            >
              <UserPlus className="h-4 w-4 mr-1" />
              {isSelected ? "Selected" : "Add to Group"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function GroupBookingForm({
  workers,
  onBack,
  onRemoveWorker,
}: {
  workers: Worker[]
  onBack: () => void
  onRemoveWorker: (workerId: string) => void
}) {
  const [bookingDetails, setBookingDetails] = useState({
    workType: "",
    startDate: "",
    endDate: "",
    workHours: 8,
    location: "",
    specialInstructions: "",
    paymentMethod: "cash",
  })

  const totalCost = workers.reduce((total, worker) => total + worker.pricePerDay, 0)
  const averageRating = workers.reduce((sum, worker) => sum + worker.rating, 0) / workers.length

  return (
    <div className="space-y-6">
      {/* Selected Workers Summary */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Selected Workers ({workers.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workers.map((worker) => (
              <div key={worker.id} className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium">{worker.name}</p>
                    <p className="text-sm text-muted-foreground">₹{worker.pricePerDay}/day</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveWorker(worker.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-green-800">Group Summary</p>
                <p className="text-sm text-green-600">Average Rating: {averageRating.toFixed(1)} ⭐</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-800">₹{totalCost}</p>
                <p className="text-sm text-green-600">Total per day</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Form */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Booking Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workType">Work Type</Label>
              <Select
                value={bookingDetails.workType}
                onValueChange={(value) => setBookingDetails((prev) => ({ ...prev, workType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select work type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="harvesting">Harvesting</SelectItem>
                  <SelectItem value="ploughing">Ploughing</SelectItem>
                  <SelectItem value="seeding">Seeding</SelectItem>
                  <SelectItem value="weeding">Weeding</SelectItem>
                  <SelectItem value="irrigation">Irrigation</SelectItem>
                  <SelectItem value="mixed">Mixed Activities</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="workHours">Work Hours per Day</Label>
              <Select
                value={bookingDetails.workHours.toString()}
                onValueChange={(value) => setBookingDetails((prev) => ({ ...prev, workHours: Number.parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">4 hours</SelectItem>
                  <SelectItem value="6">6 hours</SelectItem>
                  <SelectItem value="8">8 hours (Full day)</SelectItem>
                  <SelectItem value="10">10 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={bookingDetails.startDate}
                onChange={(e) => setBookingDetails((prev) => ({ ...prev, startDate: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={bookingDetails.endDate}
                onChange={(e) => setBookingDetails((prev) => ({ ...prev, endDate: e.target.value }))}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="location">Work Location</Label>
              <Input
                id="location"
                placeholder="Enter farm address or location"
                value={bookingDetails.location}
                onChange={(e) => setBookingDetails((prev) => ({ ...prev, location: e.target.value }))}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="instructions">Special Instructions</Label>
              <Input
                id="instructions"
                placeholder="Any specific requirements or instructions for the group"
                value={bookingDetails.specialInstructions}
                onChange={(e) => setBookingDetails((prev) => ({ ...prev, specialInstructions: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <Button variant="outline" onClick={onBack} className="w-full sm:w-auto bg-transparent">
          Back to Search
        </Button>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="w-full sm:w-auto bg-transparent">
            Save as Draft
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
            Confirm Group Booking - ₹{totalCost}
          </Button>
        </div>
      </div>
    </div>
  )
}
