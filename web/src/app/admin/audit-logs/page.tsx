export default function AdminAuditLogsPage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-slate-50">Audit logs</h1>
        <p className="mt-1 text-sm text-slate-400">
          Placeholder view for admin actions, user activities, and security
          events (TC109–TC113).
        </p>
      </header>

      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-6 text-sm text-slate-300">
        This screen will show a complete audit trail including admin actions,
        user events, and unauthorized access attempts. Right now it&apos;s a
        stub so the route is valid and browsable.
      </div>
    </div>
  );
}

