"use client"

import { useState, useEffect } from "react"

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [filter, setFilter] = useState("All")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      const response = await fetch("/api/admin/audit-logs")
      if (response.ok) {
        const data = await response.json()
        setLogs(data.logs || [])
      }
    } catch (error) {
      console.error("Failed to fetch logs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredLogs = logs.filter(log => {
    if (filter === "All") return true
    return log.type === filter
  })

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Audit Logs</h1>
        <p className="mt-1 text-sm text-slate-600">
          Complete audit trail of admin actions, user activities, and security events
        </p>
      </header>

      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <div className="mb-4 flex gap-2 text-xs">
          <FilterButton label="All" active={filter === "All"} onClick={() => setFilter("All")} />
          <FilterButton label="Admin Action" active={filter === "Admin Action"} onClick={() => setFilter("Admin Action")} />
          <FilterButton label="User Activity" active={filter === "User Activity"} onClick={() => setFilter("User Activity")} />
          <FilterButton label="Security" active={filter === "Security"} onClick={() => setFilter("Security")} />
        </div>

        <div className="space-y-2">
          {isLoading ? (
            <div className="py-8 text-center text-sm text-slate-500">
              Loading audit logs...
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">
              No audit logs found
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <LogTypeBadge type={log.type} />
                    <span className="font-semibold text-slate-900">{log.action}</span>
                  </div>
                  <p className="text-slate-600">{log.description}</p>
                  <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-500">
                    <span>User: {log.user}</span>
                    <span>•</span>
                    <span>{log.timestamp}</span>
                    {log.ipAddress && (
                      <>
                        <span>•</span>
                        <span>IP: {log.ipAddress}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function FilterButton({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) {
  if (active) {
    return (
      <button onClick={onClick} className="rounded-full bg-rose-800 px-3 py-1 text-[11px] font-semibold text-white">
        {label}
      </button>
    )
  }

  return (
    <button onClick={onClick} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-700 hover:border-rose-300 hover:text-rose-800">
      {label}
    </button>
  )
}

function LogTypeBadge({ type }: { type: string }) {
  if (type === "Admin Action") {
    return (
      <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-semibold text-purple-700">
        Admin
      </span>
    )
  }

  if (type === "Security") {
    return (
      <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-700">
        Security
      </span>
    )
  }

  return (
    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
      User
    </span>
  )
}

