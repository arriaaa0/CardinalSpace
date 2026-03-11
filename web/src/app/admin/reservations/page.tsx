"use client"

import { useState, useEffect } from "react"

type Reservation = {
  id: string
  userName: string
  vehiclePlate: string
  lotLocation: string
  spotNumber: string
  startTime: string
  endTime: string
  status: "Active" | "Pending" | "Completed" | "Cancelled"
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [filter, setFilter] = useState<"all" | "active" | "pending" | "completed">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      const response = await fetch("/api/admin/reservations")
      if (response.ok) {
        const data = await response.json()
        setReservations(data.reservations || [])
      }
    } catch (error) {
      console.error("Failed to fetch reservations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredReservations = reservations.filter((reservation) => {
    const matchesFilter =
      filter === "all" ||
      reservation.status.toLowerCase() === filter

    const matchesSearch =
      searchQuery === "" ||
      reservation.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.lotLocation.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reservations</h1>
        <p className="text-sm text-slate-500">Manage parking space reservations</p>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search reservations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-100"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              filter === "all"
                ? "bg-rose-900 text-white"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              filter === "active"
                ? "bg-rose-900 text-white"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              filter === "pending"
                ? "bg-rose-900 text-white"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              filter === "completed"
                ? "bg-rose-900 text-white"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Reservations List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="rounded-lg bg-white p-8 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-rose-900"></div>
            <p className="mt-4 text-sm text-slate-600">Loading reservations...</p>
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center">
            <p className="text-slate-600">No reservations found</p>
          </div>
        ) : (
          filteredReservations.map((reservation) => (
            <div key={reservation.id} className="rounded-lg bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900">{reservation.userName}</h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        reservation.status === "Active"
                          ? "bg-green-50 text-green-700"
                          : reservation.status === "Pending"
                          ? "bg-yellow-50 text-yellow-700"
                          : reservation.status === "Completed"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {reservation.status}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-sm text-slate-600">
                    <span>🚗 {reservation.vehiclePlate}</span>
                    <span>📍 {reservation.lotLocation} - Spot {reservation.spotNumber}</span>
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {reservation.startTime} → {reservation.endTime}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    View
                  </button>
                  {reservation.status === "Pending" && (
                    <button className="rounded-lg bg-rose-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-800">
                      Approve
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
