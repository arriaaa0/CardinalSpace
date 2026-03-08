"use client";

import Link from "next/link";
import { useState } from "react";

export default function PortalDashboardPage() {
  const [showQR, setShowQR] = useState(false);

  return (
    <div className="min-h-screen space-y-6 bg-slate-50">
      {/* Top area: welcome + quick actions */}
      <section className="rounded-2xl bg-gradient-to-r from-rose-900 via-rose-800 to-rose-700 p-5 text-white shadow-md">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-rose-100/90">
              Dashboard
            </p>
            <h1 className="mt-1 text-xl font-semibold">
              Welcome back, Maria Santos
            </h1>
            <p className="mt-1 text-xs text-rose-100/90">
              View your reservations, parking availability, and notifications.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs md:w-80">
            <QuickActionCard href="/portal/reservations" label="Reserve Parking" />
            <QuickActionCard href="/portal/map" label="View Map" />
            <QuickActionCard href="/portal/history" label="Parking History" />
          </div>
        </div>
      </section>

      {/* Main grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {/* Active booking */}
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <header className="mb-3 flex items-center justify-between text-xs">
              <p className="font-semibold text-slate-900">Active Booking</p>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                Active
              </span>
            </header>
            <div className="space-y-1 text-xs text-slate-600">
              <p className="font-semibold text-slate-800">
                Lot C - Basement 1 • Space C-15
              </p>
              <p>March 10, 2026 • 8:00 AM – 5:00 PM</p>
              <p>Vehicle • ABC 1234</p>
            </div>
            <button 
              onClick={() => setShowQR(true)}
              className="mt-4 inline-flex rounded-full bg-rose-800 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-900"
            >
              View QR Code
            </button>
          </section>

          {/* Parking availability list */}
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <header className="mb-3 flex items-center justify-between text-xs">
              <p className="font-semibold text-slate-900">
                Parking Availability
              </p>
              <Link href="/portal/map" className="text-[11px] font-semibold text-rose-700 hover:text-rose-800">
                View Full Map
              </Link>
            </header>
            <div className="space-y-3 text-xs">
              <AvailabilityRow lot="Lot A - Ground Floor" percent={24} />
              <AvailabilityRow lot="Lot B - Basement 1" percent={35} />
              <AvailabilityRow lot="Lot C - Basement 1" percent={8} />
              <AvailabilityRow lot="Lot D - Basement 2" percent={64} />
            </div>
          </section>
        </div>

        {/* Notifications column */}
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <header className="mb-3 flex items-center justify-between text-xs">
            <p className="font-semibold text-slate-900">Notifications</p>
            <Link href="#" className="text-[11px] font-semibold text-rose-700 hover:text-rose-800">
              View All
            </Link>
          </header>
          <div className="space-y-3 text-xs">
            <NotificationRow
              title="Your parking permit has been approved"
              time="2 hrs ago"
            />
            <NotificationRow
              title="Reservation ending in 30 minutes"
              time="1 hr ago"
            />
            <NotificationRow
              title="New parking lot available in Basement 2"
              time="1 day ago"
            />
          </div>
        </section>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Parking Access QR Code</h2>
              <button
                onClick={() => setShowQR(false)}
                className="text-slate-500 hover:text-slate-700 text-xl"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="h-64 w-64 bg-slate-100 border-2 border-slate-200 rounded-lg flex items-center justify-center">
                <svg className="w-32 h-32 text-slate-300" fill="currentColor" viewBox="0 0 100 100">
                  <rect x="10" y="10" width="30" height="30" fill="currentColor" />
                  <rect x="60" y="10" width="30" height="30" fill="currentColor" />
                  <rect x="10" y="60" width="30" height="30" fill="currentColor" />
                  <rect x="30" y="30" width="10" height="10" fill="currentColor" />
                  <rect x="60" y="30" width="10" height="10" fill="currentColor" />
                  <rect x="30" y="60" width="10" height="10" fill="currentColor" />
                  <rect x="60" y="60" width="10" height="10" fill="currentColor" />
                </svg>
              </div>
              <div className="text-center text-sm text-slate-600">
                <p className="font-semibold text-slate-900">Lot C - Space C-15</p>
                <p>Scan at parking entrance</p>
              </div>
              <button
                onClick={() => setShowQR(false)}
                className="mt-4 rounded-full bg-rose-800 px-6 py-2 text-sm font-semibold text-white hover:bg-rose-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function QuickActionCard({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="flex flex-col items-center justify-center rounded-xl bg-white/10 px-3 py-3 text-center text-[11px] font-semibold shadow-sm shadow-rose-900/20 hover:bg-white/15 transition-colors">
      <div className="mb-1 flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
        <span className="text-xs">◎</span>
      </div>
      {label}
    </Link>
  );
}

function AvailabilityRow({ lot, percent }: { lot: string; percent: number }) {
  const color =
    percent < 25 ? "bg-rose-500" : percent < 60 ? "bg-amber-400" : "bg-emerald-500";

  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <p className="font-medium text-slate-800">{lot}</p>
        <p className="text-slate-500">{percent}%</p>
      </div>
      <div className="mt-1 h-2 rounded-full bg-slate-100">
        <div
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-0.5 text-[11px] text-slate-500">
        {percent}% of slots available
      </p>
    </div>
  );
}

function NotificationRow({ title, time }: { title: string; time: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 h-6 w-6 rounded-full bg-emerald-100" />
      <div className="flex-1">
        <p className="text-xs font-semibold text-slate-800">{title}</p>
        <p className="text-[11px] text-slate-500">{time}</p>
      </div>
    </div>
  );
}


