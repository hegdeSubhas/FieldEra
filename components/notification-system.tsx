"use client"

import { useState, useEffect } from "react"
import { Bell, X, Check, Clock, AlertCircle, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Notification {
  id: string
  type: "booking" | "message" | "review" | "system"
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
}

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "booking",
      title: "नया बुकिंग अनुरोध / New Booking Request",
      message: "राम कुमार ने धान की कटाई के लिए आपको बुक किया है / Ram Kumar booked you for rice harvesting",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
    },
    {
      id: "2",
      type: "review",
      title: "नई समीक्षा / New Review",
      message: "आपको 5 स्टार रेटिंग मिली है / You received a 5-star rating",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
    },
    {
      id: "3",
      type: "message",
      title: "नया संदेश / New Message",
      message: "सुनीता देवी ने आपको संदेश भेजा है / Sunita Devi sent you a message",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
    },
  ])

  const [showNotifications, setShowNotifications] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<any>(null)

  useEffect(() => {
    // PWA install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setInstallPrompt(e)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "booking":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "message":
        return <MessageSquare className="h-4 w-4 text-green-600" />
      case "review":
        return <Check className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString()
  }

  const installPWA = async () => {
    if (installPrompt) {
      installPrompt.prompt()
      const result = await installPrompt.userChoice
      if (result.outcome === "accepted") {
        setInstallPrompt(null)
      }
    }
  }

  return (
    <>
      {/* Install PWA Banner */}
      {installPrompt && (
        <div className="fixed top-0 left-0 right-0 bg-forest-600 text-white p-3 z-50">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex-1">
              <p className="text-sm font-medium">ऐप इंस्टॉल करें / Install App</p>
              <p className="text-xs opacity-90">ऑफलाइन एक्सेस के लिए / For offline access</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={installPWA}>
                Install
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setInstallPrompt(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Bell */}
      <div className="relative">
        <Button variant="ghost" size="sm" onClick={() => setShowNotifications(!showNotifications)} className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500">
              {unreadCount}
            </Badge>
          )}
        </Button>

        {/* Notifications Dropdown */}
        {showNotifications && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
            <div className="p-3 border-b flex items-center justify-between">
              <h3 className="font-semibold">सूचनाएं / Notifications</h3>
              {unreadCount > 0 && (
                <Button size="sm" variant="ghost" onClick={markAllAsRead}>
                  Mark all read
                </Button>
              )}
            </div>

            <div className="divide-y">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">कोई सूचना नहीं / No notifications</div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 hover:bg-gray-50 ${!notification.read ? "bg-blue-50" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">{notification.title}</p>
                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatTime(notification.timestamp)}</p>
                      </div>
                      <div className="flex gap-1">
                        {!notification.read && (
                          <Button size="sm" variant="ghost" onClick={() => markAsRead(notification.id)}>
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => removeNotification(notification.id)}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-orange-500 text-white p-3 rounded-lg shadow-lg z-50">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm font-medium">ऑफलाइन मोड / Offline Mode - Limited functionality available</span>
      </div>
    </div>
  )
}
