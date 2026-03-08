export default function PortalVehiclesPage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Vehicles</h1>
        <p className="mt-1 text-sm text-slate-600">
          Placeholder management screen for registered vehicles, aligned with
          TC77–TC81.
        </p>
      </header>

      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
        This page will support adding, editing, and removing vehicles, and will
        enforce rules like preventing removal when a vehicle is linked to an
        active booking. Right now it exists so navigation doesn&apos;t 404.
      </div>
    </div>
  );
}

