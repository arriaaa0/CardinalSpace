"use client"

import { useState, useEffect } from "react"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/user/notifications")
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (timeString: string) => {
    const time = new Date(timeString)
    
    // Check if date is valid
    if (isNaN(time.getTime())) {
      return "Recently"
    }
    
    const now = new Date()
    const diffMs = now.getTime() - time.getTime()
    
    // Check if time difference is valid
    if (isNaN(diffMs) || diffMs < 0) {
      return "Recently"
    }
    
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours} hr ago`
    return `${diffDays} day ago`
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success": return "✅"
      case "error": return "❌"
      case "warning": return "⚠️"
      default: return "📢"
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success": return "border-emerald-200 bg-emerald-50"
      case "error": return "border-rose-200 bg-rose-50"
      case "warning": return "border-amber-200 bg-amber-50"
      default: return "border-slate-200 bg-slate-50"
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
          <p className="mt-2 text-slate-600">
            View all your notifications and updates
          </p>
        </header>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-rose-900"></div>
            <p className="mt-4 text-slate-600">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-slate-600">No notifications yet</p>
            <p className="text-sm text-slate-500 mt-2">
              You'll see notifications here when there are updates to your permits, violations, or appeals.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-2xl border p-6 ${getNotificationColor(notification.type)}`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-2xl">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1">
                      {notification.title}
                    </h3>
                    {notification.description && (
                      <p className="text-slate-700 mb-2">{notification.description}</p>
                    )}
                    <p className="text-sm text-slate-500">
                      {formatTime(notification.time)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
