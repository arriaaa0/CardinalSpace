"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

export default function ViolationDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [violation, setViolation] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchViolationDetails()
    }
  }, [params.id])

  const fetchViolationDetails = async () => {
    try {
      const response = await fetch(`/api/admin/violations/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setViolation(data.violation)
        setUser(data.user)
      }
    } catch (error) {
      console.error("Failed to fetch violation details:", error)
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
            <p className="mt-4 text-slate-600">Loading violation details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!violation || !user) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p className="text-slate-600">Violation not found</p>
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
              ← Back to Violations
            </button>
            <h1 className="text-2xl font-bold text-slate-900">Violation Details</h1>
          </div>
        </div>

        {/* Violation Information */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Violation Information</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-slate-600">Violation ID</p>
              <p className="font-semibold text-slate-900">{violation.id}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Type</p>
              <p className="font-semibold text-slate-900">{violation.type}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Fine Amount</p>
              <p className="font-semibold text-slate-900">₱{violation.fine}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Status</p>
              <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                violation.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' :
                violation.status === 'APPEALED' ? 'bg-amber-100 text-amber-800' :
                violation.status === 'DISMISSED' ? 'bg-slate-100 text-slate-800' :
                'bg-rose-100 text-rose-800'
              }`}>
                {violation.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-slate-600">Date Issued</p>
              <p className="font-semibold text-slate-900">
                {new Date(violation.issuedAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Location</p>
              <p className="font-semibold text-slate-900">{violation.lotId}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-slate-600">Description</p>
            <p className="font-semibold text-slate-900">{violation.description}</p>
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

        {/* Actions */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Actions</h2>
          <div className="flex gap-3">
            {violation.status === 'UNPAID' && (
              <>
                <button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
                  Mark as Paid
                </button>
                <button className="rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700">
                  Send Reminder
                </button>
              </>
            )}
            {violation.status === 'APPEALED' && (
              <>
                <button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
                  Approve Appeal
                </button>
                <button className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700">
                  Deny Appeal
                </button>
              </>
            )}
            <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Print Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
