"use client"

import { useState, useEffect } from "react"

export default function AdminPermitsPage() {
  const [applications, setApplications] = useState<any[]>([])
  const [filter, setFilter] = useState("All")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/admin/permits")
      if (response.ok) {
        const data = await response.json()
        setApplications(data.applications || [])
      }
    } catch (error) {
      console.error("Failed to fetch applications:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (userId: string) => {
    try {
      const response = await fetch("/api/admin/permits/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log("Permit approved:", result)
        alert("Permit approved successfully!")
        await fetchApplications() // Force refresh
      } else {
        const error = await response.json()
        console.error("Approve failed:", error.error)
        alert("Failed to approve permit: " + error.error)
      }
    } catch (error) {
      console.error("Failed to approve:", error)
      alert("Failed to approve permit")
    }
  }

  const handleDeny = async (userId: string, reason: string = "Does not meet requirements") => {
    try {
      const response = await fetch("/api/admin/permits/deny", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, reason })
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log("Permit denied:", result)
        alert("Permit rejected successfully!")
        await fetchApplications() // Force refresh
      } else {
        const error = await response.json()
        console.error("Deny failed:", error.error)
        alert("Failed to deny permit: " + error.error)
      }
    } catch (error) {
      console.error("Failed to deny:", error)
      alert("Failed to deny permit")
    }
  }

  const filteredApplications = applications.filter(app => {
    if (filter === "All") return true
    return app.status === filter
  })

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            User Permit Applications
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Review pending requests and manage approved or denied permits.
          </p>
        </div>
      </header>

      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2 text-xs">
            <FilterChip label="All" active={filter === "All"} onClick={() => setFilter("All")} />
            <FilterChip label="Pending" active={filter === "PENDING"} onClick={() => setFilter("PENDING")} />
            <FilterChip label="Approved" active={filter === "APPROVED"} onClick={() => setFilter("APPROVED")} />
            <FilterChip label="Rejected" active={filter === "REJECTED"} onClick={() => setFilter("REJECTED")} />
          </div>
          <div className="flex items-center gap-2 text-xs">
            <input
              type="text"
              placeholder="Search by name or email"
              className="w-48 rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-700 placeholder:text-slate-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2 text-xs">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-3 py-1.5">Applicant</th>
                <th className="px-3 py-1.5">Account Type</th>
                <th className="px-3 py-1.5">Email</th>
                <th className="px-3 py-1.5">Vehicle</th>
                <th className="px-3 py-1.5">Submitted</th>
                <th className="px-3 py-1.5">Status</th>
                <th className="px-3 py-1.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-sm text-slate-500">
                    Loading applications...
                  </td>
                </tr>
              ) : filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-sm text-slate-500">
                    No applications found
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <tr key={app.id}>
                    <td className="rounded-l-xl bg-slate-50 px-3 py-2">
                      <p className="font-semibold text-slate-900">{app.name}</p>
                      <p className="text-[11px] text-slate-500">{app.id}</p>
                    </td>
                    <td className="bg-slate-50 px-3 py-2 text-slate-700">
                      {app.type}
                    </td>
                    <td className="bg-slate-50 px-3 py-2 text-slate-700">
                      {app.email}
                    </td>
                    <td className="bg-slate-50 px-3 py-2 text-slate-700">
                      {app.vehicle}
                    </td>
                    <td className="bg-slate-50 px-3 py-2 text-slate-700">
                      {app.submitted}
                    </td>
                    <td className="bg-slate-50 px-3 py-2">
                      <StatusPill status={app.status} />
                    </td>
                    <td className="rounded-r-xl bg-slate-50 px-3 py-2 text-right">
                      {app.status === "Pending" ? (
                        <div className="inline-flex gap-1">
                          <button 
                            onClick={() => handleApprove(app.userId)}
                            className="rounded-full border border-emerald-200 px-3 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-50"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleDeny(app.userId)}
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

type Status = "Pending" | "Approved" | "Denied";

function StatusPill({ status }: { status: Status }) {
  if (status === "Approved") {
    return (
      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
        Approved
      </span>
    );
  }

  if (status === "Denied") {
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


