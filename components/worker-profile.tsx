"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, MapPin, Star, IndianRupee, Edit, Save, X, Plus } from "lucide-react"
import { BookingForm } from "@/components/booking-system"

interface WorkerProfile {
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

const LANGUAGES = ["English", "Hindi", "Kannada", "Telugu", "Tamil"]

export function WorkerProfileView({
  profile,
  isOwner = false,
}: {
  profile: WorkerProfile
  isOwner?: boolean
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<WorkerProfile>(profile)
  const [showBookingForm, setShowBookingForm] = useState(false)

  const handleSave = () => {
    // Here you would save to your backend
    console.log("Saving profile:", editedProfile)
    setIsEditing(false)
  }

  const addSkill = (skill: string) => {
    if (!editedProfile.skills.includes(skill)) {
      setEditedProfile({
        ...editedProfile,
        skills: [...editedProfile.skills, skill],
      })
    }
  }

  const removeSkill = (skill: string) => {
    setEditedProfile({
      ...editedProfile,
      skills: editedProfile.skills.filter((s) => s !== skill),
    })
  }

  if (showBookingForm) {
    return (
      <BookingForm
        worker={profile}
        onBack={() => setShowBookingForm(false)}
        onBookingComplete={(booking) => {
          console.log("Booking completed:", booking)
          setShowBookingForm(false)
        }}
      />
    )
  }

  if (isEditing) {
    return (
      <EditWorkerProfile
        profile={editedProfile}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
        onChange={setEditedProfile}
        onAddSkill={addSkill}
        onRemoveSkill={removeSkill}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center">
                <Users className="h-10 w-10 text-secondary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-muted-foreground">Agricultural Worker</p>
                <div className="flex items-center gap-1 mt-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{profile.rating}</span>
                  <span className="text-muted-foreground">({profile.totalReviews} reviews)</span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.location}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {isOwner ? (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <Button onClick={() => setShowBookingForm(true)} className="h-12 px-6">
                  Book Now
                </Button>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <p className="text-2xl font-bold text-primary">₹{profile.pricePerDay}</p>
              <p className="text-sm text-muted-foreground">Per Day</p>
            </div>
            <div className="text-center p-4 bg-secondary/5 rounded-lg">
              <p className="text-2xl font-bold text-secondary">₹{profile.pricePerHour}</p>
              <p className="text-sm text-muted-foreground">Per Hour</p>
            </div>
            <div className="text-center p-4 bg-accent/5 rounded-lg">
              <p className="text-2xl font-bold">{profile.experience}</p>
              <p className="text-sm text-muted-foreground">Years Experience</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{profile.bio || "No bio available."}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mobile Number</p>
                    <p className="font-semibold">{profile.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-secondary/5 rounded-lg">
                  <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-semibold">{profile.location}</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-accent/5 rounded-lg border-l-4 border-accent">
                <p className="text-sm text-muted-foreground mb-1">Contact Information</p>
                <p className="text-sm">
                  <span className="font-medium">Phone:</span> Available for direct contact during working hours (6 AM -
                  6 PM)
                </p>
                <p className="text-sm">
                  <span className="font-medium">Location:</span> Available for work within 25km radius
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.languages.map((lang) => (
                  <Badge key={lang} variant="outline">
                    {lang}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agricultural Skills</CardTitle>
              <CardDescription>Specialized skills and expertise</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-sm py-2 px-3">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Availability Calendar</CardTitle>
              <CardDescription>Available dates for booking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary rounded"></div>
                  <span className="text-sm">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-muted rounded"></div>
                  <span className="text-sm">Unavailable</span>
                </div>
              </div>
              <Calendar mode="multiple" selected={profile.availability} className="rounded-md border" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reviews & Ratings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold">F{i}</span>
                      </div>
                      <span className="font-medium">Farmer {i}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          className={`h-4 w-4 ${j < 4 + (i % 2) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Excellent work on harvesting. Very punctual and skilled worker. Would definitely hire again for
                    future farming needs.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">2 days ago</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function EditWorkerProfile({
  profile,
  onSave,
  onCancel,
  onChange,
  onAddSkill,
  onRemoveSkill,
}: {
  profile: WorkerProfile
  onSave: () => void
  onCancel: () => void
  onChange: (profile: WorkerProfile) => void
  onAddSkill: (skill: string) => void
  onRemoveSkill: (skill: string) => void
}) {
  const [selectedSkill, setSelectedSkill] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("")

  const addLanguage = (language: string) => {
    if (!profile.languages.includes(language)) {
      onChange({
        ...profile,
        languages: [...profile.languages, language],
      })
    }
    setSelectedLanguage("")
  }

  const removeLanguage = (language: string) => {
    onChange({
      ...profile,
      languages: profile.languages.filter((l) => l !== language),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Profile</h1>
        <div className="flex gap-2">
          <Button onClick={onSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
          <Button onClick={onCancel} variant="outline" className="flex items-center gap-2 bg-transparent">
            <X className="h-4 w-4" />
            Cancel
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => onChange({ ...profile, name: e.target.value })}
                    className="h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => onChange({ ...profile, phone: e.target.value })}
                    className="h-12"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => onChange({ ...profile, location: e.target.value })}
                  placeholder="Village, District, State"
                  className="h-12"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Enter your complete address (Village, District, State)
                </p>
              </div>

              <div>
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  value={profile.experience}
                  onChange={(e) => onChange({ ...profile, experience: Number.parseInt(e.target.value) || 0 })}
                  className="h-12"
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => onChange({ ...profile, bio: e.target.value })}
                  placeholder="Tell farmers about your experience and expertise..."
                  rows={4}
                />
              </div>

              <div>
                <Label>Languages</Label>
                <div className="flex flex-wrap gap-2 mt-2 mb-3">
                  {profile.languages.map((lang) => (
                    <Badge key={lang} variant="secondary" className="flex items-center gap-1">
                      {lang}
                      <button onClick={() => removeLanguage(lang)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Add a language" />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.filter((lang) => !profile.languages.includes(lang)).map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={() => selectedLanguage && addLanguage(selectedLanguage)}
                    disabled={!selectedLanguage}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agricultural Skills</CardTitle>
              <CardDescription>Add your specialized skills and expertise</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <button onClick={() => onRemoveSkill(skill)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Add a skill" />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_SKILLS.filter((skill) => !profile.skills.includes(skill)).map((skill) => (
                      <SelectItem key={skill} value={skill}>
                        {skill}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={() => selectedSkill && onAddSkill(selectedSkill)} disabled={!selectedSkill}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
              <CardDescription>Set your rates for different work arrangements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pricePerDay">Price Per Day (₹)</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="pricePerDay"
                      type="number"
                      value={profile.pricePerDay}
                      onChange={(e) => onChange({ ...profile, pricePerDay: Number.parseInt(e.target.value) || 0 })}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="pricePerHour">Price Per Hour (₹)</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="pricePerHour"
                      type="number"
                      value={profile.pricePerHour}
                      onChange={(e) => onChange({ ...profile, pricePerHour: Number.parseInt(e.target.value) || 0 })}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="availability"
                  checked={profile.isAvailable}
                  onCheckedChange={(checked) => onChange({ ...profile, isAvailable: checked })}
                />
                <Label htmlFor="availability">Currently available for work</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Availability Calendar</CardTitle>
              <CardDescription>Mark the dates when you're available for work</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="multiple"
                selected={profile.availability}
                onSelect={(dates) => onChange({ ...profile, availability: dates || [] })}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
