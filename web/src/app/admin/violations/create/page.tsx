"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CreateViolationPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    userEmail: "",
    vehiclePlate: "",
    violationType: "",
    location: "",
    description: "",
    penaltyAmount: "",
    evidence: null as File | null
  })

  const violationTypes = [
    "Illegal Parking",
    "Overstaying",
    "Wrong Space Type",
    "No Permit Displayed",
    "Blocking Access",
    "Expired Permit",
    "Other"
  ]

  const locations = [
    "Basement 1 - Lot A",
    "Basement 1 - Lot B", 
    "Basement 1 - Lot C",
    "Basement 2 - Lot D",
    "Ground Floor - Visitor Area",
    "Roof Deck - Lot E"
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/admin/violations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        router.push("/admin/violations?message=Violation created successfully")
      } else {
        const error = await response.json()
        alert(`Error: ${error.message}`)
      }
    } catch (error) {
      alert("Failed to create violation")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Issue New Violation</h1>
        <p className="text-slate-600">Create a new parking violation record</p>
      </header>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                User Email *
              </label>
              <input
                type="email"
                required
                value={formData.userEmail}
                onChange={(e) => setFormData({...formData, userEmail: e.target.value})}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-100"
                placeholder="user@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Vehicle Plate *
              </label>
              <input
                type="text"
                required
                value={formData.vehiclePlate}
                onChange={(e) => setFormData({...formData, vehiclePlate: e.target.value.toUpperCase()})}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-100"
                placeholder="ABC1234"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Violation Type *
              </label>
              <select
                required
                value={formData.violationType}
                onChange={(e) => setFormData({...formData, violationType: e.target.value})}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-100"
              >
                <option value="">Select violation type</option>
                {violationTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Location *
              </label>
              <select
                required
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-100"
              >
                <option value="">Select location</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Penalty Amount (₱) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.penaltyAmount}
                onChange={(e) => setFormData({...formData, penaltyAmount: e.target.value})}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-100"
                placeholder="500.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Evidence Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({...formData, evidence: e.target.files?.[0] || null})}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-100"
              />
              <p className="mt-1 text-xs text-slate-500">
                Upload photo evidence (optional)
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-100"
              placeholder="Describe the violation details..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-rose-600 px-6 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Issue Violation"}
            </button>
            
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg border border-slate-300 px-6 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
