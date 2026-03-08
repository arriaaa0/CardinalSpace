export default function AdminPermitsPage() {
  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            User Permit Applications
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Review pending requests and manage approved or denied permits.
          </p>
        </div>
        <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          <span>Live data not connected – sample records only</span>
        </div>
      </header>

      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2 text-xs">
            <FilterChip label="All" active />
            <FilterChip label="Pending" />
            <FilterChip label="Approved" />
            <FilterChip label="Denied" />
          </div>
          <div className="flex items-center gap-2 text-xs">
            <input
              type="text"
              placeholder="Search by name or email"
              className="w-48 rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-700 placeholder:text-slate-400 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2 text-xs">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-3 py-1.5">Applicant</th>
                <th className="px-3 py-1.5">Account Type</th>
                <th className="px-3 py-1.5">Email</th>
                <th className="px-3 py-1.5">Vehicle</th>
                <th className="px-3 py-1.5">Submitted</th>
                <th className="px-3 py-1.5">Status</th>
                <th className="px-3 py-1.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sampleApplications.map((app) => (
                <tr key={app.id}>
                  <td className="rounded-l-xl bg-slate-50 px-3 py-2">
                    <p className="font-semibold text-slate-900">{app.name}</p>
                    <p className="text-[11px] text-slate-500">{app.id}</p>
                  </td>
                  <td className="bg-slate-50 px-3 py-2 text-slate-700">
                    {app.type}
                  </td>
                  <td className="bg-slate-50 px-3 py-2 text-slate-700">
                    {app.email}
                  </td>
                  <td className="bg-slate-50 px-3 py-2 text-slate-700">
                    {app.vehicle}
                  </td>
                  <td className="bg-slate-50 px-3 py-2 text-slate-700">
                    {app.submitted}
                  </td>
                  <td className="bg-slate-50 px-3 py-2">
                    <StatusPill status={app.status} />
                  </td>
                  <td className="rounded-r-xl bg-slate-50 px-3 py-2 text-right">
                    <div className="inline-flex gap-1">
                      <button className="rounded-full border border-emerald-200 px-3 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-50">
                        Approve
                      </button>
                      <button className="rounded-full border border-rose-200 px-3 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-50">
                        Deny
                      </button>
                    </div>
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

type Status = "Pending" | "Approved" | "Denied";

const sampleApplications: {
  id: string;
  name: string;
  type: string;
  email: string;
  vehicle: string;
  submitted: string;
  status: Status;
}[] = [
  {
    id: "U-001",
    name: "Juan Dela Cruz",
    type: "Student",
    email: "juan.delacruz@mymail.mapua.edu.ph",
    vehicle: "ABC 1234 • Sedan",
    submitted: "Feb 16, 2026",
    status: "Pending",
  },
  {
    id: "U-002",
    name: "Maria Santos",
    type: "Faculty",
    email: "maria.santos@mapua.edu.ph",
    vehicle: "XYZ 9876 • SUV",
    submitted: "Feb 15, 2026",
    status: "Approved",
  },
  {
    id: "U-003",
    name: "Carlos Reyes",
    type: "Visitor",
    email: "carlos.reyes@example.com",
    vehicle: "NAA 2231 • Hatchback",
    submitted: "Feb 14, 2026",
    status: "Denied",
  },
];

function StatusPill({ status }: { status: Status }) {
  if (status === "Approved") {
    return (
      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
        Approved
      </span>
    );
  }

  if (status === "Denied") {
    return (
      <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700">
        Denied
      </span>
    );
  }

  return (
    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
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


