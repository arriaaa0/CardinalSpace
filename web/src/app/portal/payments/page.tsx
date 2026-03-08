export default function PortalPaymentsPage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">
          Payment methods
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Placeholder for adding and managing payment methods used for hourly
          parking and penalties (TC46–TC53).
        </p>
      </header>

      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
        This page will allow users to add cards or digital wallets, select a
        default method, and see basic payment status. Right now it&apos;s a
        simple stub to keep the navigation working.
      </div>
    </div>
  );
}

