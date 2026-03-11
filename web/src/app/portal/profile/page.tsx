"use client"

import { useState, useEffect } from "react"

export default function PortalProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"profile" | "vehicles" | "settings">("profile")
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [vehicleForm, setVehicleForm] = useState({
    make: "",
    model: "",
    year: "",
    color: "",
    licensePlate: ""
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/user/profile")
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setFormData(prev => ({ ...prev, name: data.user.name || "" }))
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error)
    }
  }

  const handleUpdateProfile = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        await fetchProfile()
        setEditMode(false)
        setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }))
        alert("Profile updated successfully!")
      } else {
        alert(data.error || "Failed to update profile")
      }
    } catch (error) {
      console.error("Update profile error:", error)
      alert("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const handleAddVehicle = async () => {
    if (!vehicleForm.make || !vehicleForm.model || !vehicleForm.year || !vehicleForm.color || !vehicleForm.licensePlate) {
      alert("All fields are required")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/user/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vehicleForm)
      })

      const data = await response.json()

      if (response.ok) {
        await fetchProfile()
        setVehicleForm({ make: "", model: "", year: "", color: "", licensePlate: "" })
        alert("Vehicle added successfully!")
      } else {
        alert(data.error || "Failed to add vehicle")
      }
    } catch (error) {
      console.error("Add vehicle error:", error)
      alert("Failed to add vehicle")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="space-y-4">
        <header>
          <h1 className="text-2xl font-semibold text-slate-900">Profile</h1>
        </header>
        <div className="text-center py-12">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-rose-900"></div>
          <p className="mt-4 text-slate-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Account Settings</h1>
        <p className="mt-1 text-sm text-slate-600">Manage your profile and preferences</p>
      </header>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 font-semibold text-sm border-b-2 transition-colors ${
            activeTab === "profile"
              ? "text-rose-700 border-rose-700"
              : "text-slate-600 border-transparent hover:text-slate-900"
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab("vehicles")}
          className={`px-4 py-2 font-semibold text-sm border-b-2 transition-colors ${
            activeTab === "vehicles"
              ? "text-rose-700 border-rose-700"
              : "text-slate-600 border-transparent hover:text-slate-900"
          }`}
        >
          Vehicles
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2 font-semibold text-sm border-b-2 transition-colors ${
            activeTab === "settings"
              ? "text-rose-700 border-rose-700"
              : "text-slate-600 border-transparent hover:text-slate-900"
          }`}
        >
          Settings
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="max-w-2xl">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900">Personal Information</h2>
              <button
                onClick={() => {
                  setEditMode(!editMode)
                  if (!editMode) {
                    setFormData(prev => ({ ...prev, name: user.name || "" }))
                  }
                }}
                className="text-rose-700 font-semibold text-sm hover:text-rose-800"
              >
                {editMode ? "Cancel" : "Edit"}
              </button>
            </div>

            {editMode ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold text-slate-900 mb-4">Change Password</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Current Password</label>
                      <input
                        type="password"
                        value={formData.currentPassword}
                        onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
                      <input
                        type="password"
                        value={formData.newPassword}
                        onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleUpdateProfile}
                    disabled={loading}
                    className="rounded-full bg-rose-800 px-6 py-2 text-sm font-semibold text-white hover:bg-rose-900 disabled:opacity-50"
                  >
                    {loading ? "Updating..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(false)
                      setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }))
                    }}
                    className="rounded-full border border-slate-300 px-6 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-slate-700">Name</p>
                  <p className="text-slate-900">{user.name || "Not set"}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Email</p>
                  <p className="text-slate-900">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Account Type</p>
                  <p className="text-slate-900">{user.role}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Member Since</p>
                  <p className="text-slate-900">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Vehicles Tab */}
      {activeTab === "vehicles" && (
        <div className="max-w-4xl">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">My Vehicles</h2>
            
            {/* Add Vehicle Form */}
            <div className="mb-6 p-4 border-2 border-dashed border-slate-300 rounded-lg">
              <h3 className="font-semibold text-slate-900 mb-4">Add New Vehicle</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Make</label>
                  <input
                    type="text"
                    value={vehicleForm.make}
                    onChange={(e) => setVehicleForm(prev => ({ ...prev, make: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Model</label>
                  <input
                    type="text"
                    value={vehicleForm.model}
                    onChange={(e) => setVehicleForm(prev => ({ ...prev, model: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Year</label>
                  <input
                    type="number"
                    value={vehicleForm.year}
                    onChange={(e) => setVehicleForm(prev => ({ ...prev, year: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Color</label>
                  <input
                    type="text"
                    value={vehicleForm.color}
                    onChange={(e) => setVehicleForm(prev => ({ ...prev, color: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">License Plate</label>
                  <input
                    type="text"
                    value={vehicleForm.licensePlate}
                    onChange={(e) => setVehicleForm(prev => ({ ...prev, licensePlate: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <button
                onClick={handleAddVehicle}
                disabled={loading}
                className="mt-4 rounded-full bg-rose-800 px-6 py-2 text-sm font-semibold text-white hover:bg-rose-900 disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Vehicle"}
              </button>
            </div>

            {/* Vehicle List */}
            <div className="space-y-3">
              {user.vehicles?.length > 0 ? (
                user.vehicles.map((vehicle: any) => (
                  <div key={vehicle.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div>
                      <p className="font-semibold text-slate-900">{vehicle.make} {vehicle.model}</p>
                      <p className="text-sm text-slate-600">{vehicle.year} • {vehicle.color}</p>
                      <p className="text-sm font-medium text-rose-700">{vehicle.licensePlate}</p>
                    </div>
                    <button className="text-rose-700 font-semibold text-sm hover:text-rose-800">
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-center py-8">No vehicles registered</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="max-w-2xl">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Notification Preferences</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">Push Notifications</p>
                  <p className="text-sm text-slate-600">Receive notifications about your reservations and violations</p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-rose-800">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">Email Notifications</p>
                  <p className="text-sm text-slate-600">Receive email updates about your account</p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-rose-800">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">Violation Alerts</p>
                  <p className="text-sm text-slate-600">Critical violation notifications (cannot be disabled)</p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-rose-800" disabled>
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
