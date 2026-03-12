"use client"

import Link from "next/link";
import type { ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser, removeAuthCookie } from "@/lib/auth";

export default function PortalLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Routes that don't require authentication
  const publicRoutes = ["/portal/login", "/portal/signup", "/portal/forgot-password"];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    // If it's a public route, don't check auth
    if (isPublicRoute) {
      setLoading(false);
      return;
    }

    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push("/portal/login");
      } else {
        setUser(currentUser);
      }
    } catch (error) {
      router.push("/portal/login");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // Fallback to removing cookie directly
      await removeAuthCookie();
      router.push("/");
    }
  };

  // For public routes, render without auth check
  if (isPublicRoute) {
    return children;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-200 border-t-rose-600 mx-auto"></div>
          <p className="mt-2 text-sm text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-64 flex-shrink-0 bg-gradient-to-b from-rose-900 via-rose-800 to-rose-700 px-4 py-6 md:block">
        <div className="mb-6">
          <img src="/logo.png" alt="CardinalSpace" className="w-full h-auto mb-2" />
          <p className="mt-1 text-sm font-medium text-white">
            User Portal
          </p>
        </div>
        <nav className="space-y-1 text-sm">
          <SectionLabel label="Overview" />
          <NavLink href="/portal/dashboard" label="Home dashboard" />
          <NavLink href="/portal/map" label="Real-time parking map" />

          <SectionLabel label="Parking" />
          <NavLink href="/portal/permits" label="Permits" />
          <NavLink href="/portal/reservations" label="Active bookings" />
          <NavLink href="/portal/history" label="Parking & payments history" />

          <SectionLabel label="Account" />
          <NavLink href="/portal/violations" label="Violations & appeals" />
          <NavLink href="/portal/vehicles" label="Vehicles" />
          <NavLink href="/portal/settings" label="Account & settings" />
          <NavLink href="/portal/payments" label="Payment methods" />
        </nav>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="hidden text-xs font-medium uppercase tracking-[0.2em] text-rose-600 sm:inline">
              CARdinalSpace
            </span>
            <span className="h-4 w-px bg-slate-200 sm:inline-block" />
            <span>User portal</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-sm text-slate-600">
              Welcome, {user.name || user.email}
            </span>
            <button
              onClick={handleSignOut}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-rose-500/70 hover:bg-white"
            >
              Sign Out
            </button>
            <Link
              href="/"
              className="text-xs font-medium text-slate-500 hover:text-slate-800"
            >
              Switch portal
            </Link>
          </div>
        </header>

        <main className="flex-1 bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="mt-4 mb-1 text-xs font-semibold uppercase tracking-wide text-white">
      {label}
    </p>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center rounded-lg px-2 py-1.5 text-white hover:bg-white/10 hover:text-white transition-colors"
    >
      {label}
    </Link>
  );
}

