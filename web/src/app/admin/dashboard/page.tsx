"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalPermits: 0,
    activeReservations: 0,
    pendingReviews: 0,
    violations: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  useEffect(() => {
    // Fetch real dashboard stats
    fetch("/api/admin/dashboard/stats")
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch stats')
        }
        return res.json()
      })
      .then(data => {
        if (data.error) {
          throw new Error(data.error)
        }
        setStats(data)
      })
      .catch(error => {
        console.error("Failed to fetch dashboard stats:", error)
        // Keep default values on error
      })
      .finally(() => {
        setIsLoading(false)
      })

    // Fetch recent activity
    fetchRecentActivity()
  }, [])

  const fetchRecentActivity = async () => {
    try {
      const [permitsRes, violationsRes, appealsRes, reservationsRes] = await Promise.all([
        fetch("/api/admin/permits"),
        fetch("/api/admin/violations"),
        fetch("/api/admin/appeals"),
        fetch("/api/admin/reservations")
      ])

      const permits = await permitsRes.json().catch(() => ({ applications: [] }))
      const violations = await violationsRes.json().catch(() => ({ violations: [] }))
      const appeals = await appealsRes.json().catch(() => ({ appeals: [] }))
      const reservations = await reservationsRes.json().catch(() => ({ reservations: [] }))

      const activities: any[] = []

      // Add permit activities
      permits.applications?.slice(0, 2).forEach((permit: any) => {
        activities.push({
          name: permit.name,
          action: `Permit ${permit.status.toLowerCase()}`,
          time: formatTime(permit.submitted),
          dotClass: permit.status === 'APPROVED' ? 'bg-emerald-500' : 'bg-rose-500'
        })
      })

      // Add violation activities
      violations.violations?.slice(0, 2).forEach((violation: any) => {
        activities.push({
          name: violation.user?.name || 'Unknown',
          action: `Violation issued: ${violation.type}`,
          time: formatTime(violation.issuedAt),
          dotClass: 'bg-rose-500'
        })
      })

      // Add appeal activities
      appeals.appeals?.slice(0, 2).forEach((appeal: any) => {
        activities.push({
          name: appeal.user?.name || 'Unknown',
          action: `Appeal ${appeal.status.toLowerCase()}`,
          time: formatTime(appeal.createdAt),
          dotClass: appeal.status === 'APPROVED' ? 'bg-emerald-500' : appeal.status === 'DENIED' ? 'bg-rose-500' : 'bg-amber-500'
        })
      })

      // Add reservation activities
      reservations.reservations?.slice(0, 2).forEach((reservation: any) => {
        activities.push({
          name: `User ${reservation.userId}`,
          action: `Reservation for ${reservation.lot}`,
          time: formatTime(reservation.createdAt),
          dotClass: 'bg-sky-500'
        })
      })

      // Sort by time and take latest 4
      setRecentActivity(activities.slice(0, 4))
    } catch (error) {
      console.error("Failed to fetch recent activity:", error)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours} hr ago`
    return `${diffDays} day ago`
  }

  return (
    <div className="space-y-6">
      {/* KPI cards row */}
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard
          label="Total Permits"
          value={stats.totalPermits.toString()}
          trend="+12%"
          trendColor="text-emerald-600"
          iconBg="bg-sky-100"
        />
        <KpiCard
          label="Active Reservations"
          value={stats.activeReservations.toString()}
          trend="+5%"
          trendColor="text-emerald-600"
          iconBg="bg-emerald-100"
        />
        <KpiCard
          label="Pending Reviews"
          value={stats.pendingReviews.toString()}
          trend="-8%"
          trendColor="text-amber-600"
          iconBg="bg-amber-100"
        />
        <KpiCard
          label="Violations"
          value={stats.violations.toString()}
          trend="-15%"
          trendColor="text-rose-600"
          iconBg="bg-rose-100"
        />
      </div>

      {/* Middle row: occupancy + recent activity */}
      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
          <header className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Real-Time Occupancy
              </h2>
              <p className="text-xs text-slate-500">
                Lot-level utilization based on IoT sensors
              </p>
            </div>
          </header>

          <div className="space-y-3 text-xs">
            <OccupancyRow
              lot="Lot A - Ground Floor"
              used={42}
              total={50}
              color="bg-rose-500"
            />
            <OccupancyRow
              lot="Lot B - Basement 1"
              used={56}
              total={80}
              color="bg-amber-400"
            />
            <OccupancyRow
              lot="Lot C - Basement 1"
              used={18}
              total={60}
              color="bg-emerald-500"
            />
            <OccupancyRow
              lot="Lot D - Basement 2"
              used={39}
              total={45}
              color="bg-rose-500"
            />
          </div>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <header className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Recent Activity
              </h2>
              <p className="text-xs text-slate-500">
                Latest approvals, violations, and reservations
              </p>
            </div>
          </header>

          <div className="space-y-3 text-xs">
            {recentActivity.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No recent activity</p>
            ) : (
              recentActivity.map((activity, index) => (
                <ActivityRow
                  key={index}
                  name={activity.name}
                  action={activity.action}
                  time={activity.time}
                  dotClass={activity.dotClass}
                />
              ))
            )}
          </div>
        </section>
      </div>

      {/* Quick actions */}
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-3 text-sm font-semibold text-slate-900">
          Quick Actions
        </h2>
        <div className="grid gap-3 sm:grid-cols-4">
          <QuickAction label="Review Permits" onClick={() => router.push("/admin/permits")} />
          <QuickAction label="Violations" onClick={() => router.push("/admin/violations")} />
          <QuickAction label="Reservations" onClick={() => router.push("/admin/reservations")} />
          <QuickAction label="View Appeals" onClick={() => router.push("/admin/appeals")} />
        </div>
      </section>
    </div>
  );
}

type KpiProps = {
  label: string;
  value: string;
  trend: string;
  trendColor: string;
  iconBg: string;
};

function KpiCard({ label, value, trend, trendColor, iconBg }: KpiProps) {
  return (
    <section className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div>
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="mt-1 text-xl font-semibold text-slate-900">{value}</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${iconBg}`}>
          <span className="text-xs">◎</span>
        </div>
        <p className={`text-[11px] font-semibold ${trendColor}`}>{trend}</p>
      </div>
    </section>
  );
}

type OccupancyProps = {
  lot: string;
  used: number;
  total: number;
  color: string;
};

function OccupancyRow({ lot, used, total, color }: OccupancyProps) {
  const percent = Math.round((used / total) * 100);

  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <p className="font-medium text-slate-800">{lot}</p>
        <p className="text-slate-500">
          {used}/{total}
        </p>
      </div>
      <div className="mt-1 h-2 rounded-full bg-slate-100">
        <div
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-0.5 text-[11px] text-slate-500">{percent}% occupied</p>
    </div>
  );
}

type ActivityProps = {
  name: string;
  action: string;
  time: string;
  dotClass: string;
};

function ActivityRow({ name, action, time, dotClass }: ActivityProps) {
  return (
    <div className="flex items-start gap-3">
      <div className={`mt-1 h-2.5 w-2.5 rounded-full ${dotClass}`} />
      <div className="flex-1">
        <p className="text-xs font-semibold text-slate-800">{name}</p>
        <p className="text-[11px] text-slate-500">{action}</p>
      </div>
      <p className="text-[11px] text-slate-400">{time}</p>
    </div>
  );
}

function QuickAction({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-4 text-xs font-semibold text-slate-800 hover:border-rose-300 hover:bg-rose-50">
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-700">
        <span className="text-sm">◎</span>
      </div>
      {label}
    </button>
  );
}


