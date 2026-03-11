export default function AdminViolationsPage() {
  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Violations &amp; Penalties
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Review reported violations, issue penalties, and track resolution
            status.
          </p>
        </div>
        <a
          href="/admin/violations/create"
          className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
        >
          Issue Violation
        </a>
      </header>

      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs">
          <div className="flex gap-2">
            <FilterChip label="All" active />
            <FilterChip label="Pending" />
            <FilterChip label="Penalty Issued" />
            <FilterChip label="Resolved" />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search by user or plate"
              className="w-48 rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-700 placeholder:text-slate-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2 text-xs">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-3 py-1.5">User</th>
                <th className="px-3 py-1.5">Plate</th>
                <th className="px-3 py-1.5">Violation</th>
                <th className="px-3 py-1.5">Date / Time</th>
                <th className="px-3 py-1.5">Location</th>
                <th className="px-3 py-1.5">Penalty</th>
                <th className="px-3 py-1.5">Status</th>
                <th className="px-3 py-1.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sampleViolations.map((v) => (
                <tr key={v.id}>
                  <td className="rounded-l-xl bg-slate-50 px-3 py-2">
                    <p className="font-semibold text-slate-900">{v.user}</p>
                    <p className="text-[11px] text-slate-500">{v.id}</p>
                  </td>
                  <td className="bg-slate-50 px-3 py-2 text-slate-700">
                    {v.plate}
                  </td>
                  <td className="bg-slate-50 px-3 py-2 text-slate-700">
                    {v.type}
                  </td>
                  <td className="bg-slate-50 px-3 py-2 text-slate-700">
                    {v.date}
                  </td>
                  <td className="bg-slate-50 px-3 py-2 text-slate-700">
                    {v.location}
                  </td>
                  <td className="bg-slate-50 px-3 py-2 text-slate-700">
                    {v.penalty}
                  </td>
                  <td className="bg-slate-50 px-3 py-2">
                    <StatusPill status={v.status} />
                  </td>
                  <td className="rounded-r-xl bg-slate-50 px-3 py-2 text-right">
                    <button className="rounded-full border border-rose-200 px-3 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-50">
                      Issue Penalty
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

type VStatus = "Pending" | "Penalty Issued" | "Resolved";

const sampleViolations: {
  id: string;
  user: string;
  plate: string;
  type: string;
  date: string;
  location: string;
  penalty: string;
  status: VStatus;
}[] = [
  {
    id: "V-101",
    user: "John Smith",
    plate: "ABC 1234",
    type: "Unauthorized Parking",
    date: "Feb 16, 2026 • 9:45 AM",
    location: "Lot A - Ground Floor",
    penalty: "₱500",
    status: "Pending",
  },
  {
    id: "V-102",
    user: "Sarah Johnson",
    plate: "XYZ 9876",
    type: "Overstayed Reservation",
    date: "Feb 15, 2026 • 3:10 PM",
    location: "Lot C - Basement 1",
    penalty: "₱300",
    status: "Penalty Issued",
  },
  {
    id: "V-103",
    user: "Emily Wilson",
    plate: "NAA 2231",
    type: "Reserved Space Misuse",
    date: "Feb 14, 2026 • 11:20 AM",
    location: "Lot B - Basement 2",
    penalty: "₱400",
    status: "Resolved",
  },
];

function StatusPill({ status }: { status: VStatus }) {
  if (status === "Resolved") {
    return (
      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
        Resolved
      </span>
    );
  }
  if (status === "Penalty Issued") {
    return (
      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
        Penalty Issued
      </span>
    );
  }
  return (
    <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700">
      Pending
    </span>
  );
}

function FilterChip({ label, active }: { label: string; active?: boolean }) {
  if (active) {
    return (
      <button className="rounded-full bg-rose-800 px-3 py-1 text-[11px] font-semibold text-white">
        {label}
      </button>
    );
  }
  return (
    <button className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-700 hover:border-rose-300 hover:text-rose-800">
      {label}
    </button>
  );
}


