import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12">
      <main className="w-full max-w-4xl rounded-2xl bg-white/90 p-8 shadow-sm ring-1 ring-slate-200">
        <header className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">
              CARdinalSpace
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900 sm:text-3xl">
              Choose a portal
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-600">
              This web version mirrors your mobile prototype. Start in the{" "}
              user portal for student/faculty features, or the admin panel for
              permit, violations, and analytics workflows.
            </p>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <Link
            href="/portal/login"
            className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-6 transition hover:border-rose-500/70 hover:bg-white"
          >
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                User Portal
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Registration, login, real-time parking map, reservations, QR
                access, history, violations, vehicles, payments, and settings.
              </p>
            </div>
            <p className="mt-4 text-sm font-medium text-rose-600 group-hover:text-rose-700">
              Go to user login →
            </p>
          </Link>

          <Link
            href="/admin/login"
            className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-6 transition hover:border-amber-500/70 hover:bg-white"
          >
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Admin Panel
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Permit review, violation and penalty management, appeals,
                analytics & reports, and audit logs.
              </p>
            </div>
            <p className="mt-4 text-sm font-medium text-amber-600 group-hover:text-amber-700">
              Go to admin login →
            </p>
          </Link>
        </section>
      </main>
    </div>
  );
}
