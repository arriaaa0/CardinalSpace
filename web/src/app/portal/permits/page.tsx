"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function PortalPermitsPage() {
  const [permits, setPermits] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showApplication, setShowApplication] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [permitType, setPermitType] = useState("STUDENT");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPermits();
    fetchVehicles();
  }, []);

  const fetchPermits = async () => {
    try {
      const response = await fetch("/api/user/permits");
      if (response.ok) {
        const data = await response.json();
        setPermits(data.permits || []);
      }
    } catch (error) {
      console.error("Failed to fetch permits:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await fetch("/api/user/vehicles");
      if (response.ok) {
        const data = await response.json();
        setVehicles(data.vehicles || []);
        if (data.vehicles?.length > 0) {
          setSelectedVehicle(data.vehicles[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
    }
  };

  const handleSubmitApplication = async () => {
    if (!selectedVehicle) {
      alert("Please select a vehicle");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/user/permits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId: selectedVehicle,
          type: permitType
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Permit application submitted successfully! Please wait for admin approval.");
        setShowApplication(false);
        await fetchPermits();
      } else {
        alert(`Failed: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error(error);
      alert("Error submitting application");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "STUDENT":
        return "bg-blue-100 text-blue-800";
      case "FACULTY":
        return "bg-purple-100 text-purple-800";
      case "VISITOR":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-4">
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Parking Permits</h1>
          <p className="text-gray-600 mt-2">Manage your parking permit applications</p>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              <p className="text-sm text-gray-600 mt-1">
                {permits.length === 0 
                  ? "Apply for your first parking permit" 
                  : "You have an existing permit application"}
              </p>
            </div>
            {permits.length === 0 && vehicles.length > 0 && (
              <button
                onClick={() => setShowApplication(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply for Permit
              </button>
            )}
            {permits.length === 0 && vehicles.length === 0 && (
              <Link
                href="/portal/vehicles"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Vehicle First
              </Link>
            )}
          </div>
        </div>

        {/* Application Form */}
        {showApplication && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Apply for Parking Permit</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle
                </label>
                <select
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.licensePlate} • {vehicle.make} {vehicle.model}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permit Type
                </label>
                <select
                  value={permitType}
                  onChange={(e) => setPermitType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="STUDENT">Student Permit (₱600.00)</option>
                  <option value="FACULTY">Faculty Permit (₱1200.00)</option>
                  <option value="VISITOR">Visitor Permit (₱300.00)</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSubmitApplication}
                  disabled={submitting}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to cancel this permit application? All entered data will be lost.")) {
                      setShowApplication(false);
                      setSelectedVehicle("");
                      setPermitType("STUDENT");
                    }
                  }}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Permits List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Your Permits</h2>
          </div>
          
          {permits.length === 0 ? (
            <div className="p-6 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Permit Applications</h3>
              <p className="text-gray-600 mb-4">
                Apply for a parking permit to start making reservations
              </p>
              {vehicles.length === 0 && (
                <Link
                  href="/portal/vehicles"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Vehicle
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {permits.map((permit) => (
                <div key={permit.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(permit.status)}`}>
                          {permit.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(permit.type)}`}>
                          {permit.type}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">Vehicle:</span> {permit.vehicle.licensePlate} • {permit.vehicle.make} {permit.vehicle.model}
                        </p>
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">Price:</span> ₱{permit.price.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">Valid:</span> {new Date(permit.startDate).toLocaleDateString()} - {new Date(permit.endDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          Applied: {new Date(permit.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {permit.status === "PENDING" && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        Your application is pending admin approval. You'll be notified once approved.
                      </p>
                    </div>
                  )}
                  
                  {permit.status === "APPROVED" && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        Your permit is approved! You can now make reservations.
                      </p>
                    </div>
                  )}
                  
                  {permit.status === "REJECTED" && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800">
                        Your application was rejected. Please contact admin for details.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
