"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

export default function PermitDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [permit, setPermit] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchPermitDetails()
    }
  }, [params.id])

  const fetchPermitDetails = async () => {
    try {
      const response = await fetch(`/api/admin/permits/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setPermit(data.permit)
        setUser(data.user)
      }
    } catch (error) {
      console.error("Failed to fetch permit details:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-rose-900"></div>
            <p className="mt-4 text-slate-600">Loading permit details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!permit || !user) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p className="text-slate-600">Permit not found</p>
            <button 
              onClick={() => router.back()}
              className="mt-4 rounded-full bg-rose-800 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-900"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button 
              onClick={() => router.back()}
              className="text-rose-700 hover:text-rose-800 font-semibold text-sm mb-2"
            >
              ← Back to Permits
            </button>
            <h1 className="text-2xl font-bold text-slate-900">Permit Details</h1>
          </div>
        </div>

        {/* Permit Information */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Permit Information</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-slate-600">Permit ID</p>
              <p className="font-semibold text-slate-900">{permit.id}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Status</p>
              <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                permit.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                permit.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                'bg-amber-100 text-amber-800'
              }`}>
                {permit.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-slate-600">Type</p>
              <p className="font-semibold text-slate-900">{permit.type}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Valid Until</p>
              <p className="font-semibold text-slate-900">
                {new Date(permit.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* User Information */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">User Information</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-slate-600">Name</p>
              <p className="font-semibold text-slate-900">{user.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Email</p>
              <p className="font-semibold text-slate-900">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Role</p>
              <p className="font-semibold text-slate-900">{user.role}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Member Since</p>
              <p className="font-semibold text-slate-900">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Vehicle Information</h2>
          {permit.vehicle ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-slate-600">License Plate</p>
                <p className="font-semibold text-slate-900">{permit.vehicle.licensePlate}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Make</p>
                <p className="font-semibold text-slate-900">{permit.vehicle.make}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Model</p>
                <p className="font-semibold text-slate-900">{permit.vehicle.model}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Year</p>
                <p className="font-semibold text-slate-900">{permit.vehicle.year}</p>
              </div>
            </div>
          ) : (
            <p className="text-slate-600">No vehicle information available</p>
          )}
        </div>
      </div>
    </div>
  )
}
