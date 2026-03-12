"use client";

import { useState, useEffect } from "react";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  plate: string;
}

export default function PortalVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await fetch("/api/user/vehicles");
      if (response.ok) {
        const data = await response.json();
        setVehicles(data.vehicles || []);
      }
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    color: "",
    plate: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.make && formData.model && formData.plate) {
      try {
        const response = await fetch("/api/user/vehicles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            make: formData.make,
            model: formData.model,
            year: formData.year,
            color: formData.color,
            licensePlate: formData.plate
          })
        });

        const data = await response.json();

        if (response.ok) {
          // Refresh vehicles list
          await fetchVehicles();
          setFormData({
            make: "",
            model: "",
            year: new Date().getFullYear(),
            color: "",
            plate: "",
          });
          setShowForm(false);
          alert("Vehicle added successfully!");
        } else {
          alert(`Failed to add vehicle: ${data.error}`);
        }
      } catch (error) {
        console.error("Add vehicle error:", error);
        alert("Error adding vehicle");
      }
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    if (confirm("Are you sure you want to delete this vehicle? This action cannot be undone and will remove the vehicle from all your permits and reservations.")) {
      try {
        const response = await fetch(`/api/user/vehicles/${id}`, {
          method: "DELETE"
        });

        if (response.ok) {
          await fetchVehicles();
          alert("Vehicle deleted successfully!");
        } else {
          alert("Failed to delete vehicle");
        }
      } catch (error) {
        console.error("Delete vehicle error:", error);
        alert("Error deleting vehicle");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Your Vehicles</h1>
          <p className="mt-1 text-sm text-slate-700">
            Add and manage vehicles for your parking reservations
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-full bg-rose-800 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-900"
        >
          {showForm ? "Cancel" : "+ Add Vehicle"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddVehicle} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-slate-700">Make</label>
              <input
                type="text"
                name="make"
                value={formData.make}
                onChange={handleInputChange}
                placeholder="e.g., Toyota"
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-rose-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">Model</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                placeholder="e.g., Camry"
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-rose-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">Year</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                min="1990"
                max={new Date().getFullYear()}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-rose-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">Color</label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                placeholder="e.g., Silver"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-rose-500 focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700">License Plate</label>
              <input
                type="text"
                name="plate"
                value={formData.plate}
                onChange={handleInputChange}
                placeholder="e.g., ABC 1234"
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-rose-500 focus:outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 w-full rounded-full bg-rose-800 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-900"
          >
            Add Vehicle
          </button>
        </form>
      )}

      <div className="space-y-3">
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <div className="animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-1/4 mx-auto mb-4"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2 mx-auto mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-1/3 mx-auto"></div>
            </div>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No vehicles yet</h3>
            <p className="text-sm text-slate-600 mb-4">Add your first vehicle to get started with parking reservations</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-700"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Your First Vehicle
            </button>
          </div>
        ) : (
          vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
            >
              <div className="flex-1">
                <p className="font-semibold text-slate-900">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </p>
                <p className="text-sm text-slate-700">{vehicle.plate}</p>
                <p className="text-xs text-slate-500">{vehicle.color}</p>
              </div>
              <button
                onClick={() => handleDeleteVehicle(vehicle.id)}
                className="text-rose-600 hover:text-rose-800 font-semibold text-sm"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
