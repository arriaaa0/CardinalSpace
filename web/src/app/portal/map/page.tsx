"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const LOTS = {
  A: {
    name: "Lot A - Ground Floor",
    rows: 5,
    cols: 20,
    available: 24,
    total: 100,
  },
  B: {
    name: "Lot B - Basement 1",
    rows: 5,
    cols: 20,
    available: 35,
    total: 100,
  },
  C: {
    name: "Lot C - Basement 1",
    rows: 4,
    cols: 20,
    available: 8,
    total: 100,
  },
  D: {
    name: "Lot D - Basement 2",
    rows: 5,
    cols: 20,
    available: 64,
    total: 100,
  },
};

export default function PortalMapPage() {
  const [activeLot, setActiveLot] = useState<keyof typeof LOTS>("A");
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [lots, setLots] = useState(LOTS);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: "",
    parkingType: "all", // all, covered, uncovered
    accessibility: false,
    evCharging: false,
    permitCompatibility: true
  });

  const lotKey = activeLot as keyof typeof LOTS;
  const lot = lots[lotKey];
  const { rows, cols, available } = lot;

  // Simulate IoT sensor updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLots(prevLots => {
        const updatedLots = { ...prevLots };
        Object.keys(updatedLots).forEach(key => {
          const lotKey = key as keyof typeof LOTS;
          const lot = updatedLots[lotKey];
          // Randomly change availability by -2, -1, 0, +1, or +2
          const change = Math.floor(Math.random() * 5) - 2;
          const newAvailable = Math.max(0, Math.min(lot.total, lot.available + change));
          updatedLots[lotKey] = { ...lot, available: newAvailable };
        });
        return updatedLots;
      });
      setLastUpdate(new Date());
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Generate available spaces with enhanced properties
  const totalSpaces = rows * cols;
  const availableIndices = new Set<number>();
  let count = 0;
  while (count < available) {
    const idx = Math.floor(Math.random() * totalSpaces);
    availableIndices.add(idx);
    count = availableIndices.size;
  }

  const spaces = Array.from({ length: totalSpaces }, (_, idx) => {
    const row = Math.floor(idx / cols);
    const col = idx % cols;
    const spaceNum = idx + 1;
    const isAvailable = availableIndices.has(idx);

    // Enhanced space properties for filtering
    const isCovered = col < 10; // First half is covered
    const isAccessible = spaceNum % 7 === 0; // Every 7th space is accessible
    
    // More realistic EV charging distribution:
    // - Lot A: Every 8th space (premium lot, more EV)
    // - Lot B: Every 10th space (good EV coverage)
    // - Lot C: Every 6th space (basement, high EV density)
    // - Lot D: Every 12th space (budget lot, fewer EV)
    let hasEVCharging = false;
    if (lotKey === 'A') hasEVCharging = spaceNum % 8 === 0;
    else if (lotKey === 'B') hasEVCharging = spaceNum % 10 === 0;
    else if (lotKey === 'C') hasEVCharging = spaceNum % 6 === 0;
    else if (lotKey === 'D') hasEVCharging = spaceNum % 12 === 0;
    
    const location = getSpaceLocation(lotKey, row, col);

    return {
      id: `${lotKey}-${spaceNum}`,
      number: spaceNum,
      row,
      col,
      available: isAvailable,
      covered: isCovered,
      accessible: isAccessible,
      evCharging: hasEVCharging,
      location,
    };
  });

  // Get location based on position
  function getSpaceLocation(lot: string, row: number, col: number) {
    const locations = {
      A: ["Main Building", "Library", "Cafeteria"],
      B: ["Engineering Building", "Labs", "Parking Exit"],
      C: ["Student Center", "Gym", "Sports Complex"],
      D: ["Admin Building", "Auditorium", "Parking Entrance"]
    };
    
    const lotLocations = locations[lot as keyof typeof locations];
    const locationIndex = Math.floor((row + col) / 10) % lotLocations.length;
    return lotLocations[locationIndex];
  }

  // Apply filters to spaces
  const filteredSpaces = spaces.filter(space => {
    if (!space.available) return false;
    
    // Location filter
    if (filters.location && space.location !== filters.location) return false;
    
    // Parking type filter
    if (filters.parkingType === "covered" && !space.covered) return false;
    if (filters.parkingType === "uncovered" && space.covered) return false;
    
    // Accessibility filter
    if (filters.accessibility && !space.accessible) return false;
    
    // EV Charging filter
    if (filters.evCharging && !space.evCharging) return false;
    
    return true;
  });

  // Clear filters function
  const clearFilters = () => {
    setFilters({
      location: "",
      parkingType: "all",
      accessibility: false,
      evCharging: false,
      permitCompatibility: true
    });
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Real-Time Parking Map
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Click on a parking space to reserve it
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Live • Updated {Math.floor((Date.now() - lastUpdate.getTime()) / 1000)}s ago
          </div>
        </div>
        <Link
          href="/portal/reservations"
          className="rounded-full bg-rose-800 px-6 py-2 text-sm font-semibold text-white hover:bg-rose-900"
        >
          Go to Reservations
        </Link>
      </header>

      {/* Search & Filter Panel */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">Search & Filter</h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-rose-600 hover:text-rose-700 text-sm font-medium"
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {showFilters && (
          <div className="space-y-4">
            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Location
              </label>
              <select
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
                className="w-full px-3 py-2 text-sm text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
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
              <label className="block text-sm font-medium text-slate-700 mb-2">
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
                    className="mr-2"
                  />
                  <span className="text-sm text-slate-900">All</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="parkingType"
                    value="covered"
                    checked={filters.parkingType === "covered"}
                    onChange={(e) => setFilters({...filters, parkingType: e.target.value})}
                    className="mr-2"
                  />
                  <span className="text-sm text-slate-900">Covered</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="parkingType"
                    value="uncovered"
                    checked={filters.parkingType === "uncovered"}
                    onChange={(e) => setFilters({...filters, parkingType: e.target.value})}
                    className="mr-2"
                  />
                  <span className="text-sm text-slate-900">Uncovered</span>
                </label>
              </div>
            </div>

            {/* Accessibility & EV Charging Filters */}
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.accessibility}
                  onChange={(e) => setFilters({...filters, accessibility: e.target.checked})}
                  className="mr-3"
                />
                <span className="text-sm font-medium text-slate-700">
                  ♿ PWD Accessible Only
                </span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.evCharging}
                  onChange={(e) => setFilters({...filters, evCharging: e.target.checked})}
                  className="mr-3"
                />
                <span className="text-sm font-medium text-slate-700">
                  ⚡ EV Charging Only
                </span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.permitCompatibility}
                  onChange={(e) => setFilters({...filters, permitCompatibility: e.target.checked})}
                  className="mr-3"
                />
                <span className="text-sm font-medium text-slate-700">
                  🎫 Permit Compatible Only
                </span>
              </label>
            </div>

            {/* Filter Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors text-sm font-medium"
              >
                Apply Filters
              </button>
              <button
                onClick={clearFilters}
                className="flex-1 bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors text-sm font-medium"
              >
                Clear/Reset Filters
              </button>
            </div>

            {/* Filter Results Summary */}
            <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
              <p>
                Showing <span className="font-semibold text-rose-600">{filteredSpaces.length}</span> of{" "}
                <span className="font-semibold">{available}</span> available spaces
              </p>
              {Object.values(filters).some(v => v !== "" && v !== "all" && v !== false) && (
                <p className="text-xs text-slate-500 mt-1">
                  Filters active: {Object.entries(filters).filter(([key, value]) => 
                    key !== "permitCompatibility" && value !== "" && value !== "all" && value !== false
                  ).length}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Lot selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(Object.keys(LOTS) as Array<keyof typeof LOTS>).map((key) => (
          <button
            key={key}
            onClick={() => {
              setActiveLot(key);
              setSelectedSpace(null);
            }}
            className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-colors ${
              activeLot === key
                ? "bg-rose-800 text-white"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
          >
            {LOTS[key].name}
          </button>
        ))}
      </div>

      {/* Interactive Map */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">{lot.name}</h2>
            <p className="text-sm text-slate-600">
              {available} / {lot.total} spaces available
            </p>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-emerald-500"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-slate-300"></div>
              <span>Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border-2 border-rose-600"></div>
              <span>Selected</span>
            </div>
          </div>
        </div>

        {/* Parking Grid */}
        <div className="overflow-x-auto rounded-lg bg-slate-50 p-4">
          <div className="inline-block">
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
              {spaces.map((space) => {
                const isFilteredOut = showFilters && !filteredSpaces.includes(space);
                const isSelected = selectedSpace === space.id;
                
                return (
                  <button
                    key={space.id}
                    onClick={() =>
                      setSelectedSpace(
                        isSelected ? null : space.id
                      )
                    }
                    disabled={!space.available || isFilteredOut}
                    className={`h-10 w-10 rounded text-xs font-semibold transition-all relative ${
                      isSelected
                        ? "border-2 border-rose-600 bg-rose-100"
                        : isFilteredOut
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed opacity-40"
                        : space.available
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 cursor-pointer"
                        : "bg-slate-300 text-slate-500 cursor-not-allowed opacity-60"
                    }`}
                    title={`Space ${space.number} - ${
                      isFilteredOut 
                        ? "Filtered out" 
                        : space.available 
                          ? `Available • ${space.location}${space.covered ? " • Covered" : ""}${space.accessible ? " • ♿ Accessible" : ""}${space.evCharging ? " • ⚡ EV Charging" : ""}`
                          : "Occupied"
                    }`}
                  >
                    {space.number}
                    {/* Special feature indicators */}
                    <div className="absolute -top-1 -right-1 flex flex-wrap gap-0.5">
                      {space.accessible && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" title="♿ Accessible"></div>
                      )}
                      {space.evCharging && (
                        <div className="w-2 h-2 bg-yellow-500 rounded-full" title="⚡ EV Charging"></div>
                      )}
                      {space.covered && (
                        <div className="w-2 h-2 bg-purple-500 rounded-full" title="🏢 Covered"></div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Enhanced Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-emerald-500"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-slate-300"></div>
              <span>Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border-2 border-rose-600"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-slate-200 opacity-40"></div>
              <span>Filtered Out</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>♿ Accessible</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>⚡ EV Charging</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>🏢 Covered</span>
            </div>
          </div>
        </div>

        {/* Quick booking */}
        {selectedSpace && (
          <div className="mt-4 rounded-lg bg-gradient-to-r from-rose-50 to-pink-50 border-2 border-rose-200 p-4">
            <p className="text-sm font-semibold text-slate-900 mb-2">
              Space {selectedSpace.split("-")[1]} Selected
            </p>
            <p className="text-xs text-slate-600 mb-4">
              Go to reservations to complete your booking for this space
            </p>
            <Link
              href="/portal/reservations"
              onClick={() => {
                // Store selected space in session storage for the reservations page
                sessionStorage.setItem("selectedLot", lotKey);
                sessionStorage.setItem("selectedSpace", selectedSpace);
              }}
              className="inline-flex rounded-full bg-rose-800 px-6 py-2 text-sm font-semibold text-white hover:bg-rose-900"
            >
              Book Space {selectedSpace.split("-")[1]}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
