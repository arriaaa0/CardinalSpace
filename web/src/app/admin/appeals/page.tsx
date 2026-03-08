export default function AdminAppealsPage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-slate-50">Appeal review</h1>
        <p className="mt-1 text-sm text-slate-400">
          Placeholder for listing and reviewing user appeals, and approving or
          rejecting them (TC100–TC103).
        </p>
      </header>

      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-6 text-sm text-slate-300">
        Here the admin will see each appeal with the explanation and supporting
        documents, then decide to approve or reject. The page now exists so
        navigation is complete.
      </div>
    </div>
  );
}

