"use client";

import { useState, useEffect } from "react";

const LOTS = [
  { id: "A", name: "Lot A - Ground Floor", available: 24, total: 100, hourlyRate: 40 },
  { id: "B", name: "Lot B - Basement 1", available: 35, total: 100, hourlyRate: 45 },
  { id: "C", name: "Lot C - Basement 1", available: 8, total: 100, hourlyRate: 50 },
  { id: "D", name: "Lot D - Basement 2", available: 64, total: 100, hourlyRate: 35 },
];

const SPACES = {
  A: Array.from({ length: 24 }, (_, i) => `A-${i + 1}`),
  B: Array.from({ length: 35 }, (_, i) => `B-${i + 1}`),
  C: Array.from({ length: 8 }, (_, i) => `C-${i + 1}`),
  D: Array.from({ length: 64 }, (_, i) => `D-${i + 1}`),
};

export default function PortalReservationsPage() {
  const [step, setStep] = useState<"list" | "book" | "payment">("list");
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [selectedLot, setSelectedLot] = useState("C");
  const [selectedSpace, setSelectedSpace] = useState("C-15");
  const [startDate, setStartDate] = useState("2026-03-10");
  const [startTime, setStartTime] = useState("10:00");
  const [endDate, setEndDate] = useState("2026-03-10");
  const [endTime, setEndTime] = useState("18:00");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showQRCode, setShowQRCode] = useState<string | null>(null);
  const [qrData, setQrData] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: "",
    parkingType: "all", // all, covered, uncovered
    accessibility: false,
    evCharging: false,
    permitCompatibility: true
  });
  const [permits, setPermits] = useState<any[]>([]);

  const selectedLotData = LOTS.find((l) => l.id === selectedLot)!;
  
  // Calculate duration in hours
  const calculateDuration = () => {
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return Math.max(0, durationHours);
  };

  const duration = calculateDuration();
  const totalAmount = Math.round(duration * selectedLotData.hourlyRate * 100) / 100;

  useEffect(() => {
    fetchReservations();
    fetchVehicles();
    fetchPermits();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await fetch("/api/user/vehicles");
      if (response.ok) {
        const data = await response.json();
        const vehicles = data.vehicles || [];
        setVehicles(vehicles);
        // Set first vehicle as default if none selected
        if (vehicles.length > 0 && !selectedVehicle) {
          setSelectedVehicle(vehicles[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await fetch("/api/user/reservations");
      if (response.ok) {
        const data = await response.json();
        setReservations(data.reservations || []);
      }
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
    }
  };

  const fetchPermits = async () => {
    try {
      const response = await fetch("/api/user/permits");
      if (response.ok) {
        const data = await response.json();
        setPermits(data.permits || []);
      }
    } catch (error) {
      console.error("Failed to fetch permits:", error);
    }
  };

  const debugPermitValidation = async () => {
    try {
      const response = await fetch("/api/debug/permit-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate: `${startDate}T${startTime}`,
          endDate: `${endDate}T${endTime}`
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log("Permit Validation Debug:", data);
        alert(`Debug Results:\nUser: ${data.user?.email}\nTotal Permits: ${data.analysis?.totalPermits}\nApproved Permits: ${data.analysis?.approvedPermits}\nStrict Validation: ${data.validationResults?.strict}\nFlexible Validation: ${data.validationResults?.flexible}\nIssue: ${data.analysis?.issue}\n\nCheck console for full details.`);
      } else {
        alert(`Debug failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Debug error:", error);
      alert("Debug error - check console");
    }
  };

  
  const handleConfirmReservation = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/user/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lot: selectedLotData.name,
          space: selectedSpace,
          startDate: `${startDate}T${startTime}`,
          endDate: `${endDate}T${endTime}`,
          vehicleId: selectedVehicle
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await fetchReservations();
        setStep("list");
        alert("Reservation created successfully!");
      } else {
        if (data.needsPermit) {
          alert("You need an approved permit to make reservations. Please go to the Permits page to apply for one.");
        } else {
          alert(`Failed: ${data.error || "Unknown error"}`);
        }
      }
    } catch (error) {
      console.error(error);
      alert("Error creating reservation");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (id: string) => {
    try {
      const response = await fetch(`/api/user/reservations/${id}`, {
        method: "DELETE"
      })
      
      if (response.ok) {
        setReservations(reservations.filter((r) => r.id !== id));
        alert("Reservation cancelled successfully!")
      } else {
        alert("Failed to cancel reservation")
      }
    } catch (error) {
      console.error("Cancel reservation error:", error)
      alert("Failed to cancel reservation")
    }
  };

  const handleShowQRCode = async (reservationId: string) => {
    try {
      const response = await fetch(`/api/user/reservations/${reservationId}/qr`)
      if (response.ok) {
        const data = await response.json()
        setQrData(data.qrData)
        setShowQRCode(reservationId)
      } else {
        alert("Failed to load QR code")
      }
    } catch (error) {
      console.error("QR code error:", error)
      alert("Failed to load QR code")
    }
  };

  if (step === "payment") {
    return (
      <div className="max-w-md mx-auto space-y-4">
        <header className="flex items-center gap-3 pb-4 border-b">
          <button
            onClick={() => setStep("book")}
            className="text-rose-700 hover:text-rose-800"
          >
            ←
          </button>
          <h1 className="text-xl font-semibold text-slate-900">Complete Payment</h1>
        </header>

        <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-4 border-2 border-rose-200">
          <p className="text-sm text-slate-700 mb-4">
            Select a payment method to process your reservation
          </p>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 p-3 border-2 border-slate-200 rounded-lg hover:border-rose-300 hover:bg-white">
              <span className="text-xl">💳</span>
              <span className="font-semibold text-slate-900">Credit Card</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 border-2 border-blue-300 rounded-lg hover:bg-blue-50">
              <span className="text-xl">💙</span>
              <span className="font-semibold text-slate-900">GCash</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 border-2 border-slate-200 rounded-lg hover:border-rose-300 hover:bg-white">
              <span className="text-xl">📱</span>
              <span className="font-semibold text-slate-900">PayMaya</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border-2 border-slate-200">
          <p className="text-sm font-semibold text-slate-900 mb-3">Amount Due</p>
          <p className="text-3xl font-bold text-rose-700">₱{totalAmount.toFixed(2)}</p>
        </div>

        <button
          onClick={() => setStep("list")}
          className="w-full rounded-full bg-rose-800 px-6 py-3 font-semibold text-white hover:bg-rose-900"
        >
          Complete Payment
        </button>
        <button
          onClick={() => setStep("book")}
          className="w-full rounded-full border-2 border-slate-200 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    );
  }

  if (step === "book") {
    return (
      <div className="max-w-md mx-auto space-y-4">
        <header className="flex items-center gap-3 pb-4 border-b">
          <button
            onClick={() => setStep("list")}
            className="text-rose-700 hover:text-rose-800 text-xl"
          >
            ←
          </button>
          <h1 className="text-xl font-semibold text-slate-900">Reserve Parking</h1>
        </header>

        {/* Search & Filter Panel */}
        <div className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-900 text-sm">Search & Filter</h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-rose-600 hover:text-rose-700 text-xs font-medium"
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          {showFilters && (
            <div className="space-y-3">
              {/* Location Filter */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Location
                </label>
                <select
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="">All Locations</option>
                  <option value="Main Building">Main Building</option>
                  <option value="Library">Library</option>
                  <option value="Cafeteria">Cafeteria</option>
                  <option value="Engineering Building">Engineering Building</option>
                  <option value="Labs">Labs</option>
                  <option value="Parking Exit">Parking Exit</option>
                  <option value="Student Center">Student Center</option>
                  <option value="Gym">Gym</option>
                  <option value="Sports Complex">Sports Complex</option>
                  <option value="Admin Building">Admin Building</option>
                  <option value="Auditorium">Auditorium</option>
                  <option value="Parking Entrance">Parking Entrance</option>
                </select>
              </div>

              {/* Parking Type Filter */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Parking Type
                </label>
                <div className="flex gap-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="parkingType"
                      value="all"
                      checked={filters.parkingType === "all"}
                      onChange={(e) => setFilters({...filters, parkingType: e.target.value})}
                      className="mr-1"
                    />
                    <span className="text-xs">All</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="parkingType"
                      value="covered"
                      checked={filters.parkingType === "covered"}
                      onChange={(e) => setFilters({...filters, parkingType: e.target.value})}
                      className="mr-1"
                    />
                    <span className="text-xs">Covered</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="parkingType"
                      value="uncovered"
                      checked={filters.parkingType === "uncovered"}
                      onChange={(e) => setFilters({...filters, parkingType: e.target.value})}
                      className="mr-1"
                    />
                    <span className="text-xs">Uncovered</span>
                  </label>
                </div>
              </div>

              {/* Accessibility & EV Charging Filters */}
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.accessibility}
                    onChange={(e) => setFilters({...filters, accessibility: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-xs font-medium text-slate-700">
                    ♿ PWD Accessible Only
                  </span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.evCharging}
                    onChange={(e) => setFilters({...filters, evCharging: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-xs font-medium text-slate-700">
                    ⚡ EV Charging Only
                  </span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.permitCompatibility}
                    onChange={(e) => setFilters({...filters, permitCompatibility: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-xs font-medium text-slate-700">
                    🎫 Permit Compatible Only
                  </span>
                </label>
              </div>

              {/* Filter Actions */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 bg-rose-600 text-white px-3 py-1.5 rounded-lg hover:bg-rose-700 transition-colors text-xs font-medium"
                >
                  Apply Filters
                </button>
                <button
                  onClick={() => setFilters({
                    location: "",
                    parkingType: "all",
                    accessibility: false,
                    evCharging: false,
                    permitCompatibility: true
                  })}
                  className="flex-1 bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-300 transition-colors text-xs font-medium"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Lot Selection */}
        <div className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="font-semibold text-slate-900">{selectedLotData.name}</p>
              <p className="text-sm text-slate-700 mt-1">
                Available: {selectedLotData.available}/{selectedLotData.total} spaces
              </p>
            </div>
            <button
              onClick={() => setStep("book")}
              className="text-rose-700 font-semibold text-sm hover:text-rose-800"
            >
              Change
            </button>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-sm font-semibold text-slate-900 mb-1">Selected Space</p>
            <p className="text-lg font-bold text-rose-700">{selectedSpace}</p>
          </div>
          <div className="mt-3 text-sm text-slate-700">
            Rate: <span className="font-semibold text-rose-700">₱{selectedLotData.hourlyRate}/hour</span>
          </div>
        </div>

        {/* Reservation Details */}
        <div className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-slate-200 space-y-4">
          <h2 className="font-semibold text-slate-900">Reservation Details</h2>

          {/* Start Time */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Start Time</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 bg-white"
              />
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 bg-white"
              />
            </div>
          </div>

          {/* End Time */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">End Time</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 bg-white"
              />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 bg-white"
              />
            </div>
          </div>

          {/* Duration */}
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-sm text-slate-700">Duration</p>
            <p className="text-lg font-bold text-slate-900">{duration.toFixed(1)} hours</p>
          </div>
        </div>

        {/* Select Vehicle */}
        <div className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-slate-200">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Select Vehicle</label>
          <select
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 bg-white"
          >
            {vehicles.map((v: any) => (
              <option key={v.id} value={v.id}>
                {v.make} {v.model} • {v.licensePlate}
              </option>
            ))}
          </select>
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-4 border-2 border-rose-200">
          <h2 className="font-semibold text-slate-900 mb-3">Reservation Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-700">Parking Lot</span>
              <span className="font-semibold text-slate-900">{selectedLotData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-700">Space</span>
              <span className="font-semibold text-slate-900">{selectedSpace}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-700">Date</span>
              <span className="font-semibold text-slate-900">{startDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-700">Time</span>
              <span className="font-semibold text-slate-900">{startTime} - {endTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-700">Vehicle</span>
              <span className="font-semibold text-slate-900">
                {vehicles.find((v: any) => v.id === selectedVehicle)?.licensePlate}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-700">Duration</span>
              <span className="font-semibold text-slate-900">{duration.toFixed(1)} hours</span>
            </div>
            <div className="border-t border-rose-300 pt-2 mt-2 flex justify-between">
              <span className="font-semibold text-slate-900">Total Amount</span>
              <span className="text-2xl font-bold text-rose-700">₱{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleConfirmReservation}
          disabled={loading}
          className="w-full rounded-full bg-rose-800 px-6 py-3 font-semibold text-white hover:bg-rose-900 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Confirm Reservation"}
        </button>
        <button
          onClick={() => setStep("list")}
          className="w-full rounded-full border-2 border-slate-200 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            My Reservations
          </h1>
          <p className="mt-1 text-sm text-slate-700">
            View and manage your parking reservations
          </p>
        </div>
        <button
          onClick={() => setStep("book")}
          className="rounded-full bg-rose-800 px-6 py-2 text-sm font-semibold text-white hover:bg-rose-900"
        >
          + Reserve
        </button>
      </header>

      {/* Permit Check Message */}
      {permits.length === 0 && (
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6">
          <div className="flex items-start gap-3">
            <div className="text-yellow-600 mt-0.5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-800 mb-1">Permit Required</h3>
              <p className="text-sm text-yellow-700 mb-3">
                You need an approved parking permit to make reservations.
              </p>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={debugPermitValidation}
                  className="inline-flex items-center gap-1.5 bg-purple-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                >
                  🔍 Debug Permit Issue
                </button>
                <a
                  href="/portal/permits"
                  className="inline-flex items-center gap-1.5 bg-yellow-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors"
                >
                  Apply for Permit
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
                <a
                  href="/portal/vehicles"
                  className="inline-flex items-center gap-1.5 bg-white text-yellow-700 border border-yellow-300 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-yellow-100 transition-colors"
                >
                  Add Vehicle
                </a>
              </div>
              <p className="text-xs text-yellow-600 mt-2">
                � Apply for a parking permit and wait for admin approval to make reservations
              </p>
            </div>
          </div>
        </div>
      )}

      {permits.length > 0 && permits.filter(p => p.status === "APPROVED").length === 0 && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
          <div className="flex items-start gap-3">
            <div className="text-blue-600 mt-0.5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-800 mb-1">Permit Pending Approval</h3>
              <p className="text-sm text-blue-700">
                Your permit application is pending admin approval. You'll be able to make reservations once it's approved.
              </p>
            </div>
          </div>
        </div>
      )}

      {reservations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-slate-500">No active reservations</p>
          <button
            onClick={() => setStep("book")}
            className="mt-4 text-sm font-semibold text-rose-700 hover:text-rose-800"
          >
            Create your first reservation
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {reservations.map((res) => (
            <div
              key={res.id}
              className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{res.lot}</p>
                  <p className="text-sm text-slate-700 mt-1">Space {res.space}</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {res.status === "active" ? "Active" : "Upcoming"}
                </span>
              </div>
              <div className="space-y-2 mb-4 text-sm text-slate-700">
                <p>
                  <span className="font-semibold">Start:</span> {new Date(res.startDate).toLocaleString()}
                </p>
                <p>
                  <span className="font-semibold">End:</span> {new Date(res.endDate).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleShowQRCode(res.id)}
                  className="flex-1 rounded-full bg-rose-800 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-900"
                >
                  View QR Code
                </button>
                <button
                  onClick={() => handleCancelReservation(res.id)}
                  className="flex-1 rounded-full border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Code Modal */}
      {showQRCode && qrData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">QR Code</h2>
              <button
                onClick={() => setShowQRCode(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            
            <div className="bg-slate-100 rounded-lg p-8 mb-4 text-center">
              <div className="w-48 h-48 bg-white rounded-lg mx-auto flex items-center justify-center border-2 border-slate-300">
                <div className="text-center">
                  <div className="text-4xl mb-2">🅿️</div>
                  <p className="text-xs text-slate-600 font-mono">{qrData.qrCode}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Reservation ID:</span>
                <span className="font-semibold text-slate-900">{qrData.reservationId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Location:</span>
                <span className="font-semibold text-slate-900">{qrData.lot} - {qrData.space}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Vehicle:</span>
                <span className="font-semibold text-slate-900">{qrData.vehiclePlate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Valid From:</span>
                <span className="font-semibold text-slate-900">{new Date(qrData.validFrom).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Valid To:</span>
                <span className="font-semibold text-slate-900">{new Date(qrData.validTo).toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-amber-50 rounded-lg">
              <p className="text-xs text-amber-800 text-center">
                ⚠️ Show this QR code at the parking entrance for validation
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


