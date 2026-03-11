"use client";

import { useState, useEffect } from "react";

export default function PortalHistoryPage() {
  const [historyData, setHistoryData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [filterDate, setFilterDate] = useState("")
  const [filterLot, setFilterLot] = useState("")

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/user/history")
      if (response.ok) {
        const data = await response.json()
        setHistoryData(data)
      }
    } catch (error) {
      console.error("Failed to fetch history:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredHistory = historyData?.history?.reservations?.filter((h: any) => {
    if (filterDate && new Date(h.startDate).toLocaleDateString() !== filterDate) return false;
    if (filterLot && h.lot !== filterLot) return false;
    return true;
  }) || [];

  const totalSpent = historyData?.statistics?.totalAmount || 0;

  const lots = [...new Set(historyData?.history?.reservations?.map((h: any) => h.lot) || [])];

  if (loading) {
    return (
      <div className="space-y-4">
        <header>
          <h1 className="text-2xl font-semibold text-slate-900">Parking History</h1>
        </header>
        <div className="text-center py-12">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-rose-900"></div>
          <p className="mt-4 text-slate-600">Loading history...</p>
        </div>
      </div>
    )
  }

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
          <p className="mt-2 text-3xl font-bold text-slate-900">{historyData?.statistics?.totalSessions || 0}</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Total Spent</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">₱{totalSpent}</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Violations</p>
          <p className="mt-2 text-3xl font-bold text-rose-600">
            {historyData?.statistics?.totalViolations || 0}
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
              {lots.map((lot: any) => (
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
                filteredHistory.map((entry: any) => (
                  <tr key={entry.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-900">{new Date(entry.startDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(entry.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} – {new Date(entry.endDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <p className="font-semibold text-slate-900">{entry.lot}</p>
                      <p className="text-xs text-slate-500">Space {entry.space}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{entry.vehicle?.licensePlate || "N/A"}</td>
                    <td className="px-6 py-4 text-slate-600">{Math.round((new Date(entry.endDate).getTime() - new Date(entry.startDate).getTime()) / (1000 * 60 * 60) * 10) / 10} hrs</td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-900">
                      ₱{Math.round((new Date(entry.endDate).getTime() - new Date(entry.startDate).getTime()) / (1000 * 60 * 60) * 40 * 100) / 100}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                          entry.status === "COMPLETED"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {entry.status === "COMPLETED" ? "Completed" : entry.status}
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

