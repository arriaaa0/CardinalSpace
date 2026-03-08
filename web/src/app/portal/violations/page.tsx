export default function PortalViolationsPage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">
          Violations & appeals
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Placeholder list and detail view for user violations, evidence, and
          appeals (TC62–TC75).
        </p>
      </header>

      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
        Here we&apos;ll mirror your mobile violations experience: notifications,
        violation list with status, detail view with photo evidence, submit
        appeal form, and appeal status tracking. For now, it&apos;s a simple
        stub page so routing works.
      </div>
    </div>
  );
}

