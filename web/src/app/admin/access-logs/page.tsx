"use client"

import { useState, useEffect } from "react"

type AccessLog = {
  id: string
  logId: string
  userName: string
  vehiclePlate: string
  qrCode: string
  actionType: "Entry" | "Exit"
  location: string
  timestamp: string
  status: "Approved" | "Denied"
}

export default function AccessLogsPage() {
  const [logs, setLogs] = useState<AccessLog[]>([])
  const [filter, setFilter] = useState<"all" | "approved" | "denied">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLog, setSelectedLog] = useState<AccessLog | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAccessLogs()
  }, [])

  const fetchAccessLogs = async () => {
    try {
      const response = await fetch("/api/admin/access-logs")
      if (response.ok) {
        const data = await response.json()
        setLogs(data.logs || [])
      }
    } catch (error) {
      console.error("Failed to fetch access logs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredLogs = logs.filter((log) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "approved" && log.status === "Approved") ||
      (filter === "denied" && log.status === "Denied")

    const matchesSearch =
      searchQuery === "" ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.logId.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const handleExport = () => {
    const csvContent = [
      ["Log ID", "User", "Vehicle", "QR Code", "Action", "Location", "Timestamp", "Status"],
      ...filteredLogs.map((log) => [
        log.logId,
        log.userName,
        log.vehiclePlate,
        log.qrCode,
        log.actionType,
        log.location,
        log.timestamp,
        log.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `access-logs-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">QR Code Validation &amp; Access Logs</h1>
          <p className="text-sm text-slate-500">Entry and exit validation records for audit purposes</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 rounded-lg bg-rose-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-rose-800"
        >
          Export
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-100"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              filter === "all"
                ? "bg-rose-900 text-white"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            All ({logs.length})
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              filter === "approved"
                ? "bg-rose-900 text-white"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter("denied")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              filter === "denied"
                ? "bg-rose-900 text-white"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            Denied
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Logs List */}
        <div className="lg:col-span-2 space-y-3">
          {isLoading ? (
            <div className="rounded-lg bg-white p-8 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-rose-900"></div>
              <p className="mt-4 text-sm text-slate-600">Loading access logs...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="rounded-lg bg-white p-8 text-center">
              <p className="text-slate-600">No access logs found</p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                onClick={() => setSelectedLog(log)}
                className={`cursor-pointer rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-md ${
                  selectedLog?.id === log.id ? "ring-2 ring-rose-500" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{log.userName}</h3>
                      <span className="text-xs text-slate-500">{log.logId}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          log.status === "Approved"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {log.status}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <span className="font-medium">{log.actionType}</span>
                      </span>
                      <span>📍 {log.location}</span>
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      ⏰ {log.timestamp}
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block rounded px-2 py-1 text-xs font-medium ${
                        log.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {log.status === "Approved" ? "✓ Approved" : "✗ Denied"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Details Panel */}
        <div className="lg:col-span-1">
          {selectedLog ? (
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-center rounded-lg bg-green-50 p-4">
                <div className="text-center">
                  <div className="mb-2 text-4xl">✓</div>
                  <p className="text-sm font-semibold text-green-800">Access Approved</p>
                  <p className="text-xs text-green-600">QR code validated successfully. Access granted.</p>
                </div>
              </div>

              <h3 className="mb-4 text-lg font-bold text-slate-900">Access Event Details</h3>
              <p className="mb-4 text-xs text-slate-500">{selectedLog.logId}</p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">⏰ Timestamp</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">{selectedLog.timestamp}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">🔑 QR Code</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">{selectedLog.qrCode}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">📍 Location</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">{selectedLog.location}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">🚪 Action Type</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">{selectedLog.actionType}</p>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <h4 className="mb-3 text-sm font-semibold text-slate-900">User &amp; Vehicle Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500">👤 User Name</p>
                      <p className="mt-1 text-sm font-medium text-slate-900">{selectedLog.userName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">🚗 Vehicle Plate</p>
                      <p className="mt-1 text-sm font-medium text-slate-900">{selectedLog.vehiclePlate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg bg-white p-8 text-center shadow-sm">
              <div className="mb-4 text-4xl">📋</div>
              <p className="text-sm text-slate-600">Select a log to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
