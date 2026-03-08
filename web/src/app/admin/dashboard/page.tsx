export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* KPI cards row */}
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard
          label="Total Permits"
          value="1,247"
          trend="+12%"
          trendColor="text-emerald-600"
          iconBg="bg-sky-100"
        />
        <KpiCard
          label="Active Reservations"
          value="89"
          trend="+5%"
          trendColor="text-emerald-600"
          iconBg="bg-emerald-100"
        />
        <KpiCard
          label="Pending Reviews"
          value="23"
          trend="-8%"
          trendColor="text-amber-600"
          iconBg="bg-amber-100"
        />
        <KpiCard
          label="Violations"
          value="7"
          trend="-15%"
          trendColor="text-rose-600"
          iconBg="bg-rose-100"
        />
      </div>

      {/* Middle row: occupancy + recent activity */}
      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
          <header className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Real-Time Occupancy
              </h2>
              <p className="text-xs text-slate-500">
                Lot-level utilization based on IoT sensors
              </p>
            </div>
          </header>

          <div className="space-y-3 text-xs">
            <OccupancyRow
              lot="Lot A - Ground Floor"
              used={42}
              total={50}
              color="bg-rose-500"
            />
            <OccupancyRow
              lot="Lot B - Basement 1"
              used={56}
              total={80}
              color="bg-amber-400"
            />
            <OccupancyRow
              lot="Lot C - Basement 1"
              used={18}
              total={60}
              color="bg-emerald-500"
            />
            <OccupancyRow
              lot="Lot D - Basement 2"
              used={39}
              total={45}
              color="bg-rose-500"
            />
          </div>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <header className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Recent Activity
              </h2>
              <p className="text-xs text-slate-500">
                Latest approvals, violations, and reservations
              </p>
            </div>
          </header>

          <div className="space-y-3 text-xs">
            <ActivityRow
              name="John Smith"
              action="Permit application approved"
              time="5 min ago"
              dotClass="bg-emerald-500"
            />
            <ActivityRow
              name="Sarah Johnson"
              action="Parking violation reported"
              time="12 min ago"
              dotClass="bg-rose-500"
            />
            <ActivityRow
              name="Mike Davis"
              action="Reservation created for Lot A"
              time="23 min ago"
              dotClass="bg-sky-500"
            />
            <ActivityRow
              name="Emily Wilson"
              action="Appeal submitted"
              time="1 hour ago"
              dotClass="bg-amber-500"
            />
          </div>
        </section>
      </div>

      {/* Quick actions */}
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-3 text-sm font-semibold text-slate-900">
          Quick Actions
        </h2>
        <div className="grid gap-3 sm:grid-cols-4">
          <QuickAction label="Review Permits" />
          <QuickAction label="Violations" />
          <QuickAction label="Reservations" />
          <QuickAction label="View Appeals" />
        </div>
      </section>
    </div>
  );
}

type KpiProps = {
  label: string;
  value: string;
  trend: string;
  trendColor: string;
  iconBg: string;
};

function KpiCard({ label, value, trend, trendColor, iconBg }: KpiProps) {
  return (
    <section className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div>
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="mt-1 text-xl font-semibold text-slate-900">{value}</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${iconBg}`}>
          <span className="text-xs">◎</span>
        </div>
        <p className={`text-[11px] font-semibold ${trendColor}`}>{trend}</p>
      </div>
    </section>
  );
}

type OccupancyProps = {
  lot: string;
  used: number;
  total: number;
  color: string;
};

function OccupancyRow({ lot, used, total, color }: OccupancyProps) {
  const percent = Math.round((used / total) * 100);

  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <p className="font-medium text-slate-800">{lot}</p>
        <p className="text-slate-500">
          {used}/{total}
        </p>
      </div>
      <div className="mt-1 h-2 rounded-full bg-slate-100">
        <div
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-0.5 text-[11px] text-slate-500">{percent}% occupied</p>
    </div>
  );
}

type ActivityProps = {
  name: string;
  action: string;
  time: string;
  dotClass: string;
};

function ActivityRow({ name, action, time, dotClass }: ActivityProps) {
  return (
    <div className="flex items-start gap-3">
      <div className={`mt-1 h-2.5 w-2.5 rounded-full ${dotClass}`} />
      <div className="flex-1">
        <p className="text-xs font-semibold text-slate-800">{name}</p>
        <p className="text-[11px] text-slate-500">{action}</p>
      </div>
      <p className="text-[11px] text-slate-400">{time}</p>
    </div>
  );
}

function QuickAction({ label }: { label: string }) {
  return (
    <button className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-4 text-xs font-semibold text-slate-800 hover:border-rose-300 hover:bg-rose-50">
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-700">
        <span className="text-sm">◎</span>
      </div>
      {label}
    </button>
  );
}


