"use client"

import { useState, useEffect } from "react"

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/admin/analytics")
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <header>
          <h1 className="text-2xl font-semibold text-slate-900">
            Analytics & Reports
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Parking usage reports and violation trends
          </p>
        </header>
        <div className="text-center py-12">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-rose-900"></div>
          <p className="mt-4 text-slate-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="space-y-4">
        <header>
          <h1 className="text-2xl font-semibold text-slate-900">
            Analytics & Reports
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Parking usage reports and violation trends
          </p>
        </header>
        <div className="text-center py-12">
          <p className="text-slate-600">Failed to load analytics data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Analytics & Reports
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Parking usage reports and violation trends
          </p>
        </div>
        <button className="rounded-full bg-rose-800 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-900">
          Export Report
        </button>
      </header>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-600">Total Users</p>
              <p className="text-2xl font-bold text-slate-900">{analytics.overview.totalUsers}</p>
            </div>
            <div className="rounded-full bg-sky-100 p-2">
              <div className="h-4 w-4 rounded bg-sky-500"></div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-600">Active Permits</p>
              <p className="text-2xl font-bold text-slate-900">{analytics.overview.totalPermits}</p>
            </div>
            <div className="rounded-full bg-emerald-100 p-2">
              <div className="h-4 w-4 rounded bg-emerald-500"></div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-600">Violations</p>
              <p className="text-2xl font-bold text-slate-900">{analytics.overview.totalViolations}</p>
            </div>
            <div className="rounded-full bg-rose-100 p-2">
              <div className="h-4 w-4 rounded bg-rose-500"></div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-600">Reservations</p>
              <p className="text-2xl font-bold text-slate-900">{analytics.overview.totalReservations}</p>
            </div>
            <div className="rounded-full bg-amber-100 p-2">
              <div className="h-4 w-4 rounded bg-amber-500"></div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-600">Total Revenue</p>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(analytics.overview.totalRevenue)}</p>
            </div>
            <div className="rounded-full bg-purple-100 p-2">
              <div className="h-4 w-4 rounded bg-purple-500"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Permits by Status */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Permits by Status</h2>
          <div className="space-y-3">
            {Object.entries(analytics.permitsByStatus).map(([status, count]) => {
              const total = Object.values(analytics.permitsByStatus).reduce((sum: number, val: any) => sum + val, 0)
              const percentage = total > 0 ? (Number(count) / total) * 100 : 0
              const colors = {
                PENDING: 'bg-amber-500',
                APPROVED: 'bg-emerald-500',
                REJECTED: 'bg-rose-500'
              }
              
              return (
                <div key={status}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">{status}</span>
                    <span className="text-slate-600">{Number(count)} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div 
                      className={`h-2 rounded-full ${colors[status as keyof typeof colors] || 'bg-slate-400'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Violations by Type */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Violations by Type</h2>
          <div className="space-y-3">
            {Object.entries(analytics.violationsByType).map(([type, count]) => {
              const total = Object.values(analytics.violationsByType).reduce((sum: number, val: any) => sum + val, 0)
              const percentage = total > 0 ? (Number(count) / total) * 100 : 0
              
              return (
                <div key={type}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">{type}</span>
                    <span className="text-slate-600">{Number(count)} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div 
                      className="h-2 rounded-full bg-rose-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Violations by Status */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Violations by Status</h2>
          <div className="space-y-3">
            {Object.entries(analytics.violationsByStatus).map(([status, count]) => {
              const total = Object.values(analytics.violationsByStatus).reduce((sum: number, val: any) => sum + val, 0)
              const percentage = total > 0 ? (Number(count) / total) * 100 : 0
              const colors = {
                UNPAID: 'bg-rose-500',
                PAID: 'bg-emerald-500',
                APPEALED: 'bg-amber-500',
                DISMISSED: 'bg-slate-400'
              }
              
              return (
                <div key={status}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">{status}</span>
                    <span className="text-slate-600">{Number(count)} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div 
                      className={`h-2 rounded-full ${colors[status as keyof typeof colors] || 'bg-slate-400'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Activity Summary */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">7-Day Activity Summary</h2>
          <div className="space-y-3">
            {analytics.recentActivity?.slice(0, 7).map((activity: any, index: number) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${
                    activity.type === 'permits' ? 'bg-emerald-500' :
                    activity.type === 'violations' ? 'bg-rose-500' :
                    'bg-amber-500'
                  }`} />
                  <span className="font-medium text-slate-700 capitalize">{activity.type}</span>
                </div>
                <span className="text-slate-600">{activity.count} on {new Date(activity.date).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Monthly Trends (Last 6 Months)</h2>
        <div className="space-y-4">
          {analytics.monthlyData?.slice(0, 6).map((month: any, index: number) => (
            <div key={index}>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium text-slate-700">
                  {new Date(month.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <div className="flex gap-4 text-slate-600">
                  <span>Violations: {month.violations}</span>
                  <span>Permits: {month.permits}</span>
                  <span>Reservations: {month.reservations}</span>
                </div>
              </div>
              <div className="flex gap-1 h-2">
                <div 
                  className="h-2 rounded-l-full bg-rose-500"
                  style={{ width: `${(month.violations / Math.max(month.violations, month.permits, month.reservations)) * 33}%` }}
                />
                <div 
                  className="h-2 bg-emerald-500"
                  style={{ width: `${(month.permits / Math.max(month.violations, month.permits, month.reservations)) * 33}%` }}
                />
                <div 
                  className="h-2 rounded-r-full bg-amber-500"
                  style={{ width: `${(month.reservations / Math.max(month.violations, month.permits, month.reservations)) * 33}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

