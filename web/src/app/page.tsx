import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <div className="flex h-44 items-center justify-center bg-gradient-to-b from-rose-900 via-rose-800 to-rose-700 px-4">
        <div className="w-80">
          <img src="/logo.png" alt="CardinalSpace" className="w-full h-auto" />
        </div>
      </div>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900">
              Welcome to CardinalSpace
            </h1>
            <p className="mt-2 text-slate-600">
              Choose your portal to get started
            </p>
          </header>

          <section className="grid gap-6 md:grid-cols-2">
            <Link
              href="/portal/login"
              className="group flex flex-col justify-between rounded-xl border border-rose-200 bg-rose-50/60 p-6 transition hover:border-rose-500/70 hover:bg-white"
            >
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  User Portal
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Registration, parking reservations, QR access, violations, and more.
                </p>
              </div>
              <p className="mt-4 text-sm font-medium text-rose-600 group-hover:text-rose-700">
                Go to user login →
              </p>
            </Link>

            <Link
              href="/admin/login"
              className="group flex flex-col justify-between rounded-xl border border-amber-200 bg-amber-50/60 p-6 transition hover:border-amber-500/70 hover:bg-white"
            >
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Admin Panel
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Permit approval, violation management, analytics, and audit logs.
                </p>
              </div>
              <p className="mt-4 text-sm font-medium text-amber-600 group-hover:text-amber-700">
                Go to admin login →
              </p>
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
