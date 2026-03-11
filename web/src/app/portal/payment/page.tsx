"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentData, setPaymentData] = useState({
    reservationId: "",
    amount: 0,
    description: "",
    paymentMethod: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    name: ""
  })

  useEffect(() => {
    const reservationId = searchParams.get("reservationId")
    const amount = searchParams.get("amount")
    const description = searchParams.get("description")

    if (reservationId && amount && description) {
      setPaymentData(prev => ({
        ...prev,
        reservationId,
        amount: parseFloat(amount),
        description
      }))
    }
  }, [searchParams])

  const paymentMethods = [
    { id: "card", name: "Credit/Debit Card", icon: "💳" },
    { id: "gcash", name: "GCash", icon: "📱" },
    { id: "maya", name: "Maya", icon: "💰" },
    { id: "campus", name: "Campus Account", icon: "🎓" }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      const response = await fetch("/api/payment/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData)
      })

      if (response.ok) {
        const result = await response.json()
        router.push(`/portal/payment/success?transactionId=${result.transactionId}`)
      } else {
        const error = await response.json()
        alert(`Payment failed: ${error.message}`)
      }
    } catch (error) {
      alert("Payment processing failed")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Payment</h1>
        <p className="text-slate-600">Complete your parking reservation payment</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-medium text-slate-900 mb-4">Payment Method</h2>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {paymentMethods.map(method => (
                <button
                  key={method.id}
                  onClick={() => setPaymentData({...paymentData, paymentMethod: method.id})}
                  className={`p-4 rounded-xl border-2 text-left transition ${
                    paymentData.paymentMethod === method.id
                      ? "border-rose-500 bg-rose-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{method.icon}</span>
                    <span className="font-medium text-slate-900">{method.name}</span>
                  </div>
                </button>
              ))}
            </div>

            {paymentData.paymentMethod === "card" && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    value={paymentData.cardNumber}
                    onChange={(e) => setPaymentData({...paymentData, cardNumber: e.target.value})}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-100"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={paymentData.expiryDate}
                      onChange={(e) => setPaymentData({...paymentData, expiryDate: e.target.value})}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={3}
                      value={paymentData.cvv}
                      onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value})}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-100"
                      placeholder="123"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    required
                    value={paymentData.name}
                    onChange={(e) => setPaymentData({...paymentData, name: e.target.value})}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-100"
                    placeholder="John Doe"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full rounded-lg bg-rose-600 px-6 py-3 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Processing..." : `Pay ₱${paymentData.amount.toFixed(2)}`}
                </button>
              </form>
            )}

            {paymentData.paymentMethod && paymentData.paymentMethod !== "card" && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-800">
                    You will be redirected to {paymentMethods.find(m => m.id === paymentData.paymentMethod)?.name} to complete the payment.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full rounded-lg bg-rose-600 px-6 py-3 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Processing..." : `Pay ₱${paymentData.amount.toFixed(2)}`}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-medium text-slate-900 mb-4">Order Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">{paymentData.description}</span>
                <span className="font-medium">₱{paymentData.amount.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Service Fee</span>
                <span className="font-medium">₱10.00</span>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-900">Total</span>
                  <span className="font-bold text-rose-600 text-lg">
                    ₱{(paymentData.amount + 10).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200">
            <h3 className="font-medium text-slate-900 mb-2">Payment Security</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                SSL Encrypted Transaction
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                PCI DSS Compliant
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                Fraud Protection
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
