"use client"

import { useState, useEffect } from "react"

type Permit = {
  id: string
  permitNumber: string
  userName: string
  userEmail: string
  vehiclePlate: string
  permitType: string
  status: "Active" | "Pending" | "Expired" | "Revoked"
  issueDate: string
  expiryDate: string
}

export default function PermitManagementPage() {
  const [permits, setPermits] = useState<Permit[]>([])
  const [filter, setFilter] = useState<"all" | "active" | "pending" | "expired">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPermits()
  }, [])

  const fetchPermits = async () => {
    try {
      const response = await fetch("/api/admin/permits")
      if (response.ok) {
        const data = await response.json()
        setPermits(data.permits || [])
      }
    } catch (error) {
      console.error("Failed to fetch permits:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredPermits = permits.filter((permit) => {
    const matchesFilter =
      filter === "all" ||
      permit.status.toLowerCase() === filter

    const matchesSearch =
      searchQuery === "" ||
      permit.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      permit.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      permit.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      permit.permitNumber.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Permit Management</h1>
          <p className="text-sm text-slate-500">Manage and approve parking permits</p>
        </div>
        <button className="rounded-lg bg-rose-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-rose-800">
          Issue New Permit
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search permits..."
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
            onClick={() => setFilter("expired")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              filter === "expired"
                ? "bg-rose-900 text-white"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            Expired
          </button>
        </div>
      </div>

      {/* Permits Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Permit #</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">User</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Vehicle</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Expiry</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-rose-900"></div>
                  <p className="mt-4 text-sm text-slate-600">Loading permits...</p>
                </td>
              </tr>
            ) : filteredPermits.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-600">
                  No permits found
                </td>
              </tr>
            ) : (
              filteredPermits.map((permit) => (
                <tr key={permit.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">{permit.permitNumber}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-slate-900">{permit.userName}</div>
                    <div className="text-xs text-slate-500">{permit.userEmail}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{permit.vehiclePlate}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{permit.permitType}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        permit.status === "Active"
                          ? "bg-green-50 text-green-700"
                          : permit.status === "Pending"
                          ? "bg-yellow-50 text-yellow-700"
                          : permit.status === "Expired"
                          ? "bg-red-50 text-red-700"
                          : "bg-slate-50 text-slate-700"
                      }`}
                    >
                      {permit.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{permit.expiryDate}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="text-sm text-rose-900 hover:underline">View</button>
                      {permit.status === "Pending" && (
                        <button className="text-sm text-green-700 hover:underline">Approve</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
