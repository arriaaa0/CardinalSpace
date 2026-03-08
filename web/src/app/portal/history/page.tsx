export default function PortalHistoryPage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">
          Parking & payments history
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Placeholder for past parking sessions, receipts, filters, and
          transaction history (TC54–TC61).
        </p>
      </header>

      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
        This screen will show historical reservations, amounts paid, receipt
        download links, and search/filter by date, lot, or vehicle. Navigation
        is wired; data and filters will come later.
      </div>
    </div>
  );
}

