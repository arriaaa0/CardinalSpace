"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(null);

  // Allow admin login page without auth
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    const checkAuth = async () => {
      // If it's the login page, don't check auth
      if (isLoginPage) {
        setIsLoading(false);
        return;
      }

      try {
        const user = await getCurrentUser();
        if (!user || user.role !== "ADMIN") {
          router.push("/admin/login");
          return;
        }
        setIsAuthenticated(true);
        setAdminUser(user);
      } catch (error) {
        router.push("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, isLoginPage]);

  // For login page, render without auth layout
  if (isLoginPage) {
    return children;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-rose-200 border-t-rose-900 mx-auto"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Left sidebar */}
      <aside className="hidden w-64 flex-shrink-0 bg-rose-900 px-4 py-6 text-slate-50 md:flex md:flex-col">
        <div className="mb-8 flex items-center gap-3 px-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/30">
            <span className="text-base font-semibold text-white">C</span>
          </div>
        </div>

        <p className="px-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-100/80">
          Admin Portal
        </p>
        <p className="px-1 text-sm text-rose-50/90">CardinalSpace</p>

        <nav className="mt-6 flex-1 space-y-1 text-sm text-rose-50/90">
          <NavLink href="/admin/dashboard" label="Dashboard" />
          <NavLink href="/admin/permits" label="User Permits" />
          <NavLink href="/admin/permit-management" label="Permit Management" />
          <NavLink href="/admin/reservations" label="Reservations" />
          <NavLink href="/admin/access-logs" label="Access Logs" />
          <NavLink href="/admin/violations" label="Violations" />
          <NavLink href="/admin/appeals" label="Appeals" />
          <NavLink href="/admin/analytics" label="Analytics" />
          <NavLink href="/admin/audit-logs" label="Audit Logs" />
        </nav>
      </aside>

      {/* Right content area */}
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
              Dashboard
            </p>
            <p className="text-sm font-semibold text-slate-900">
              System Overview &amp; Monitoring
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm">
              !
            </button>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-rose-100" />
                <div className="text-xs text-right">
                  <p className="font-semibold text-slate-900">{adminUser?.name || adminUser?.email || "Admin User"}</p>
                  <p className="text-slate-500">System Administrator</p>
                </div>
              </div>
              <Link
                href="/admin/login"
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:border-rose-300 hover:text-rose-800"
              >
                Logout
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 bg-slate-100 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="mt-4 mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
      {label}
    </p>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center rounded-lg px-2 py-1.5 text-slate-200 hover:bg-slate-800 hover:text-amber-300"
    >
      {label}
    </Link>
  );
}

