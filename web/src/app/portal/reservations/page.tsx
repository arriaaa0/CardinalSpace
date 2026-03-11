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
        alert(`Failed: ${data.error || "Unknown error"}`);
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


