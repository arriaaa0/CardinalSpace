export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-slate-50">
          Analytics & reports
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Placeholder dashboard for parking usage reports and violation trends
          (TC105–TC108).
        </p>
      </header>

      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-6 text-sm text-slate-300">
        This page will later show charts and exportable reports. For now, it
        exists so the admin can navigate through all modules without hitting a
        404.
      </div>
    </div>
  );
}

