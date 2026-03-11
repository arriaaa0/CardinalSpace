"use client"

import { useState, useEffect } from "react"

export default function AdminAppealsPage() {
  const [appeals, setAppeals] = useState<any[]>([])
  const [filter, setFilter] = useState("All")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAppeals()
  }, [])

  const fetchAppeals = async () => {
    try {
      const response = await fetch("/api/admin/appeals")
      if (response.ok) {
        const data = await response.json()
        setAppeals(data.appeals || [])
      }
    } catch (error) {
      console.error("Failed to fetch appeals:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApproveAppeal = async (appealId: string) => {
    try {
      const response = await fetch("/api/admin/appeals/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appealId })
      })
      
      if (response.ok) {
        alert("Appeal approved successfully!")
        fetchAppeals()
      } else {
        alert("Failed to approve appeal")
      }
    } catch (error) {
      console.error("Failed to approve appeal:", error)
      alert("Failed to approve appeal")
    }
  }

  const handleDenyAppeal = async (appealId: string) => {
    try {
      const response = await fetch("/api/admin/appeals/deny", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appealId })
      })
      
      if (response.ok) {
        alert("Appeal denied successfully!")
        fetchAppeals()
      } else {
        alert("Failed to deny appeal")
      }
    } catch (error) {
      console.error("Failed to deny appeal:", error)
      alert("Failed to deny appeal")
    }
  }

  const filteredAppeals = appeals.filter(appeal => {
    if (filter === "All") return true
    return appeal.status === filter
  })

  function FilterChip({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) {
    if (active) {
      return (
        <button onClick={onClick} className="rounded-full bg-rose-800 px-3 py-1 text-[11px] font-semibold text-white">
          {label}
        </button>
      );
    }
    return (
      <button onClick={onClick} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-700 hover:border-rose-300 hover:text-rose-800">
        {label}
      </button>
    );
  }

  function StatusPill({ status }: { status: string }) {
    if (status === "APPROVED") {
      return (
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
          Approved
        </span>
      );
    }
    if (status === "DENIED") {
      return (
        <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700">
          Denied
        </span>
      );
    }
    return (
      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
        Pending
      </span>
    );
  }

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Appeal Reviews
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Review and manage user violation appeals
          </p>
        </div>
      </header>

      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs">
          <div className="flex gap-2">
            <FilterChip label="All" active={filter === "All"} onClick={() => setFilter("All")} />
            <FilterChip label="Pending" active={filter === "PENDING"} onClick={() => setFilter("PENDING")} />
            <FilterChip label="Approved" active={filter === "APPROVED"} onClick={() => setFilter("APPROVED")} />
            <FilterChip label="Denied" active={filter === "DENIED"} onClick={() => setFilter("DENIED")} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2 text-xs">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-3 py-1.5">User</th>
                <th className="px-3 py-1.5">Violation</th>
                <th className="px-3 py-1.5">Reason</th>
                <th className="px-3 py-1.5">Date</th>
                <th className="px-3 py-1.5">Status</th>
                <th className="px-3 py-1.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-slate-500">
                    Loading appeals...
                  </td>
                </tr>
              ) : filteredAppeals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-slate-500">
                    No appeals found
                  </td>
                </tr>
              ) : (
                filteredAppeals.map((appeal) => (
                  <tr key={appeal.id}>
                    <td className="rounded-l-xl bg-slate-50 px-3 py-2">
                      <p className="font-semibold text-slate-900">{appeal.user?.name || 'Unknown'}</p>
                      <p className="text-[11px] text-slate-500">{appeal.user?.email || ''}</p>
                    </td>
                    <td className="bg-slate-50 px-3 py-2 text-slate-700">
                      {appeal.violation?.type || 'N/A'}
                    </td>
                    <td className="bg-slate-50 px-3 py-2 text-slate-700 max-w-xs truncate">
                      {appeal.reason}
                    </td>
                    <td className="bg-slate-50 px-3 py-2 text-slate-700">
                      {new Date(appeal.createdAt).toLocaleDateString()}
                    </td>
                    <td className="bg-slate-50 px-3 py-2">
                      <StatusPill status={appeal.status} />
                    </td>
                    <td className="rounded-r-xl bg-slate-50 px-3 py-2 text-right">
                      {appeal.status === "PENDING" ? (
                        <div className="inline-flex gap-1">
                          <button 
                            onClick={() => handleApproveAppeal(appeal.id)}
                            className="rounded-full border border-emerald-200 px-3 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-50"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleDenyAppeal(appeal.id)}
                            className="rounded-full border border-rose-200 px-3 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-50"
                          >
                            Deny
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500">—</span>
                      )}
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

