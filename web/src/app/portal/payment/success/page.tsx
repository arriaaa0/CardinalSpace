"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [countdown, setCountdown] = useState(10)

  const transactionId = searchParams.get("transactionId")

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push("/portal/dashboard")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h1>
          <p className="text-slate-600">Your payment has been processed successfully</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 mb-6">
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Transaction ID</span>
              <span className="font-mono text-slate-900">{transactionId}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Status</span>
              <span className="text-green-600 font-medium">Completed</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Date</span>
              <span className="text-slate-900">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.push("/portal/dashboard")}
            className="w-full rounded-lg bg-rose-600 px-6 py-3 text-sm font-semibold text-white hover:bg-rose-700"
          >
            Go to Dashboard
          </button>
          
          <button
            onClick={() => window.print()}
            className="w-full rounded-lg border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Download Receipt
          </button>
        </div>

        <div className="mt-6 text-xs text-slate-500">
          Redirecting to dashboard in {countdown} seconds...
        </div>
      </div>
    </div>
  )
}
