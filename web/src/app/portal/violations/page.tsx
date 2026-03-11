"use client";

import { useState, useEffect } from "react";

interface Violation {
  id: string;
  date: string;
  time: string;
  lot: string;
  type: string;
  amount: number;
  status: "unpaid" | "paid" | "appealed";
  description: string;
}

interface Appeal {
  id: string;
  violationId: string;
  reason: string;
  evidence: string;
  status: "pending" | "approved" | "denied";
}

export default function PortalViolationsPage() {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchViolations();
    fetchUserAppeals();
  }, []);

  const fetchViolations = async () => {
    try {
      const response = await fetch("/api/user/violations");
      if (response.ok) {
        const data = await response.json();
        setViolations(data.violations || []);
        setAppeals(data.appeals || []);
      }
    } catch (error) {
      console.error("Failed to fetch violations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const [showAppealForm, setShowAppealForm] = useState(false);
  const [selectedViolation, setSelectedViolation] = useState<string | null>(null);
  const [appealData, setAppealData] = useState({
    reason: "",
    evidence: "",
  });

  const fetchUserAppeals = async () => {
    try {
      const response = await fetch("/api/user/appeals");
      if (response.ok) {
        const data = await response.json();
        setAppeals(data.appeals || []);
      }
    } catch (error) {
      console.error("Failed to fetch appeals:", error);
    }
  };

  const handleSubmitAppeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedViolation && appealData.reason) {
      try {
        const response = await fetch("/api/user/appeals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            violationId: selectedViolation, 
            reason: appealData.reason,
            evidence: appealData.evidence 
          }),
        });
        
        if (response.ok) {
          alert("Appeal submitted successfully!");
          // Refresh appeals list
          fetchUserAppeals();
          setAppealData({ reason: "", evidence: "" });
          setShowAppealForm(false);
          setSelectedViolation(null);
        } else {
          const data = await response.json();
          alert(data.error || "Failed to submit appeal");
        }
      } catch (error) {
        console.error("Failed to submit appeal:", error);
        alert("Failed to submit appeal");
      }
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "unpaid") return "bg-rose-100 text-rose-700";
    if (status === "paid") return "bg-emerald-100 text-emerald-700";
    return "bg-amber-100 text-amber-700";
  };

  const getAppealStatusColor = (status: string) => {
    if (status === "pending") return "bg-amber-100 text-amber-700";
    if (status === "approved") return "bg-emerald-100 text-emerald-700";
    return "bg-rose-100 text-rose-700";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Violations & Appeals</h1>
        <p className="mt-1 text-sm text-slate-700">
          View your violations, appeal status, and manage payments
        </p>
      </div>

      {/* Violations Section */}
      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Violations</h2>
        <div className="space-y-3">
          {isLoading ? (
            <div className="py-8 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-rose-900"></div>
              <p className="mt-4 text-sm text-slate-700">Loading violations...</p>
            </div>
          ) : violations.length === 0 ? (
            <p className="text-sm text-slate-700">No violations recorded.</p>
          ) : (
            violations.map((v) => {
              const hasAppeal = appeals.some((a) => a.violationId === v.id);
              return (
                <div
                  key={v.id}
                  className="flex items-start justify-between rounded-lg border border-slate-200 p-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(v.status)}`}>
                        {v.status.toUpperCase()}
                      </span>
                      <p className="font-semibold text-slate-900">{v.type}</p>
                    </div>
                    <p className="text-sm text-slate-700">{v.date} at {v.time}</p>
                    <p className="text-sm text-slate-700">{v.lot}</p>
                    <p className="text-sm text-slate-700">{v.description}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-semibold text-slate-900">₱{v.amount}</p>
                    {!hasAppeal && v.status === "unpaid" && (
                      <button
                        onClick={() => {
                          setSelectedViolation(v.id);
                          setShowAppealForm(true);
                        }}
                        className="mt-2 text-sm text-rose-600 hover:text-rose-800 font-semibold"
                      >
                        Appeal
                      </button>
                    )}
                    {v.status === "paid" && (
                      <span className="text-xs text-emerald-600 font-semibold mt-2 block">Paid</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Appeals Section */}
      {appeals.length > 0 && (
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Appeals</h2>
          <div className="space-y-3">
            {appeals.map((a) => (
              <div key={a.id} className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-slate-900">Appeal for Violation {a.violationId}</p>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getAppealStatusColor(a.status)}`}>
                    {a.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-slate-700 mb-2">Reason: {a.reason}</p>
                {a.evidence && <p className="text-sm text-slate-700">Evidence: {a.evidence}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Appeal Form */}
      {showAppealForm && (
        <section className="rounded-2xl bg-rose-50 p-6 border-2 border-rose-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Submit Appeal</h2>
            <button
              onClick={() => {
                setShowAppealForm(false);
                setSelectedViolation(null);
              }}
              className="text-slate-500 hover:text-slate-700 text-2xl"
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleSubmitAppeal} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700">Reason for Appeal</label>
              <textarea
                value={appealData.reason}
                onChange={(e) => setAppealData({ ...appealData, reason: e.target.value })}
                placeholder="Explain why you believe this violation is incorrect..."
                required
                rows={4}
                className="mt-1 w-full rounded-lg border border-rose-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">Supporting Evidence</label>
              <input
                type="text"
                value={appealData.evidence}
                onChange={(e) => setAppealData({ ...appealData, evidence: e.target.value })}
                placeholder="e.g., Receipt, photo, permit number, etc."
                className="mt-1 w-full rounded-lg border border-rose-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-100"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 rounded-full bg-rose-800 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-900"
              >
                Submit Appeal
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAppealForm(false);
                  setSelectedViolation(null);
                }}
                className="flex-1 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}

