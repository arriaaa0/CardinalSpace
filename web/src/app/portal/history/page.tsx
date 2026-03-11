"use client";

import { useState } from "react";

interface HistoryEntry {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  lot: string;
  space: string;
  vehicle: string;
  duration: number;
  rate: number;
  amount: number;
  status: "completed" | "cancelled";
}

export default function PortalHistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      id: "H001",
      date: "2026-03-10",
      startTime: "08:00",
      endTime: "17:00",
      lot: "Lot C - Basement 1",
      space: "C-15",
      vehicle: "ABC 1234",
      duration: 9,
      rate: 50,
      amount: 450,
      status: "completed",
    },
    {
      id: "H002",
      date: "2026-03-09",
      startTime: "10:30",
      endTime: "14:45",
      lot: "Lot A - Ground Floor",
      space: "A-42",
      vehicle: "ABC 1234",
      duration: 4.25,
      rate: 40,
      amount: 170,
      status: "completed",
    },
    {
      id: "H003",
      date: "2026-03-08",
      startTime: "09:00",
      endTime: "16:00",
      lot: "Lot B - Basement 1",
      space: "B-28",
      vehicle: "XYZ 5678",
      duration: 7,
      rate: 45,
      amount: 315,
      status: "completed",
    },
    {
      id: "H004",
      date: "2026-03-07",
      startTime: "11:00",
      endTime: "13:00",
      lot: "Lot D - Basement 2",
      space: "D-61",
      vehicle: "ABC 1234",
      duration: 2,
      rate: 35,
      amount: 70,
      status: "cancelled",
    },
  ]);

  const [filterDate, setFilterDate] = useState("");
  const [filterLot, setFilterLot] = useState("");

  const filteredHistory = history.filter((h) => {
    if (filterDate && h.date !== filterDate) return false;
    if (filterLot && h.lot !== filterLot) return false;
    return true;
  });

  const totalSpent = history
    .filter((h) => h.status === "completed")
    .reduce((sum, h) => sum + h.amount, 0);

  const lots = [...new Set(history.map((h) => h.lot))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Parking History</h1>
        <p className="mt-1 text-sm text-slate-600">
          View your past reservations and payment history
        </p>
      </div>

      {/* Summary Card */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Total Sessions</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{history.length}</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Total Spent</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">₱{totalSpent}</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Completed</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {history.filter((h) => h.status === "completed").length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h3 className="font-semibold text-slate-900 mb-4">Filters</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Date</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Parking Lot</label>
            <select
              value={filterLot}
              onChange={(e) => setFilterLot(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none"
            >
              <option value="">All Lots</option>
              {lots.map((lot) => (
                <option key={lot} value={lot}>
                  {lot}
                </option>
              ))}
            </select>
          </div>
        </div>
        {(filterDate || filterLot) && (
          <button
            onClick={() => {
              setFilterDate("");
              setFilterLot("");
            }}
            className="mt-4 text-sm text-rose-600 hover:text-rose-800 font-semibold"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* History Table */}
      <section className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-slate-900">Date</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-900">Time</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-900">Lot & Space</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-900">Vehicle</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-900">Duration</th>
                <th className="px-6 py-3 text-right font-semibold text-slate-900">Amount</th>
                <th className="px-6 py-3 text-center font-semibold text-slate-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-600">
                    No parking history found.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((entry) => (
                  <tr key={entry.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-900">{entry.date}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {entry.startTime} – {entry.endTime}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <p className="font-semibold text-slate-900">{entry.lot}</p>
                      <p className="text-xs text-slate-500">Space {entry.space}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{entry.vehicle}</td>
                    <td className="px-6 py-4 text-slate-600">{entry.duration} hrs</td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-900">
                      ₱{entry.amount}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                          entry.status === "completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {entry.status === "completed" ? "Completed" : "Cancelled"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

