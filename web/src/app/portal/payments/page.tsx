"use client";

import { useState } from "react";

interface PaymentMethod {
  id: string;
  type: "credit" | "debit" | "digital";
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
}

export default function PortalPaymentsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "credit",
      cardNumber: "4111****1111",
      cardHolder: "Maria Santos",
      expiryMonth: "12",
      expiryYear: "2025",
      isDefault: true,
    },
    {
      id: "2",
      type: "debit",
      cardNumber: "5555****4444",
      cardHolder: "Maria Santos",
      expiryMonth: "08",
      expiryYear: "2026",
      isDefault: false,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    cardHolder: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    type: "credit" as const,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let value = e.target.value;
    if (e.target.name === "cardNumber") {
      value = value.replace(/\s/g, "").slice(0, 16);
    }
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.cardHolder && formData.cardNumber && formData.expiryMonth && formData.expiryYear) {
      const lastFour = formData.cardNumber.slice(-4);
      setPaymentMethods([
        ...paymentMethods,
        {
          id: Date.now().toString(),
          type: formData.type,
          cardNumber: `****${lastFour}`,
          cardHolder: formData.cardHolder,
          expiryMonth: formData.expiryMonth,
          expiryYear: formData.expiryYear,
          isDefault: false,
        },
      ]);
      setFormData({
        cardHolder: "",
        cardNumber: "",
        expiryMonth: "",
        expiryYear: "",
        cvv: "",
        type: "credit",
      });
      setShowForm(false);
    }
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((pm) => ({
        ...pm,
        isDefault: pm.id === id,
      }))
    );
  };

  const handleDeletePayment = (id: string) => {
    setPaymentMethods(paymentMethods.filter((pm) => pm.id !== id));
  };

  const getCardIcon = (type: string) => {
    if (type === "credit") return "💳";
    if (type === "debit") return "💳";
    return "📱";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Payment Methods</h1>
          <p className="mt-1 text-sm text-slate-600">
            Add and manage your payment methods for parking reservations
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-full bg-rose-800 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-900"
        >
          {showForm ? "Cancel" : "+ Add Card"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddPayment} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700">Card Holder Name</label>
              <input
                type="text"
                name="cardHolder"
                value={formData.cardHolder}
                onChange={handleInputChange}
                placeholder="Full name on card"
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700">Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                maxLength={16}
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">Card Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none"
              >
                <option value="credit">Credit Card</option>
                <option value="debit">Debit Card</option>
                <option value="digital">Digital Wallet</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">Expiry Date</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="expiryMonth"
                  value={formData.expiryMonth}
                  onChange={handleInputChange}
                  placeholder="MM"
                  min="1"
                  max="12"
                  maxLength={2}
                  required
                  className="mt-1 w-1/3 rounded-lg border border-slate-300 px-2 py-2 text-sm focus:border-rose-500 focus:outline-none"
                />
                <span className="mt-2">/</span>
                <input
                  type="number"
                  name="expiryYear"
                  value={formData.expiryYear}
                  onChange={handleInputChange}
                  placeholder="YY"
                  min="24"
                  max="35"
                  maxLength={2}
                  required
                  className="mt-1 w-1/3 rounded-lg border border-slate-300 px-2 py-2 text-sm focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">CVV</label>
              <input
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={handleInputChange}
                placeholder="123"
                maxLength={4}
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 w-full rounded-full bg-rose-800 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-900"
          >
            Add Payment Method
          </button>
        </form>
      )}

      <div className="grid gap-4">
        {paymentMethods.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <p className="text-slate-600">No payment methods added. Add one to make reservations!</p>
          </div>
        ) : (
          paymentMethods.map((pm) => (
            <div
              key={pm.id}
              className={`rounded-2xl p-4 shadow-sm ring-1 ${
                pm.isDefault
                  ? "bg-rose-50 ring-rose-200"
                  : "bg-white ring-slate-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-3xl">{getCardIcon(pm.type)}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">
                      {pm.type === "credit" ? "Credit Card" : pm.type === "debit" ? "Debit Card" : "Digital Wallet"}
                    </p>
                    <p className="text-sm text-slate-600">{pm.cardNumber}</p>
                    <p className="text-xs text-slate-500">Expires {pm.expiryMonth}/{pm.expiryYear}</p>
                    <p className="text-xs font-semibold text-slate-600 mt-1">{pm.cardHolder}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {pm.isDefault && (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Default
                    </span>
                  )}
                  {!pm.isDefault && (
                    <button
                      onClick={() => handleSetDefault(pm.id)}
                      className="text-rose-600 hover:text-rose-800 font-semibold text-sm"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => handleDeletePayment(pm.id)}
                    className="text-slate-400 hover:text-slate-600 text-sm"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

