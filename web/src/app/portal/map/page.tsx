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

  // Generate available spaces
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

    return {
      id: `${lotKey}-${spaceNum}`,
      number: spaceNum,
      row,
      col,
      available: isAvailable,
    };
  });

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
              {spaces.map((space) => (
                <button
                  key={space.id}
                  onClick={() =>
                    setSelectedSpace(
                      selectedSpace === space.id ? null : space.id
                    )
                  }
                  disabled={!space.available}
                  className={`h-10 w-10 rounded text-xs font-semibold transition-all ${
                    selectedSpace === space.id
                      ? "border-2 border-rose-600 bg-rose-100"
                      : space.available
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 cursor-pointer"
                      : "bg-slate-300 text-slate-500 cursor-not-allowed opacity-60"
                  }`}
                  title={`Space ${space.number} - ${space.available ? "Available" : "Occupied"}`}
                >
                  {space.number}
                </button>
              ))}
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
