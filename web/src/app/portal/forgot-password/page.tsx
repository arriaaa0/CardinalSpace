"use client"

import { useState } from "react"
import Link from "next/link"

export default function PortalForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
      } else {
        setError(data.error || "An error occurred")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <div className="flex h-44 items-center justify-center bg-gradient-to-b from-rose-900 via-rose-800 to-rose-700 px-4">
        <div className="w-80">
          <img src="/logo.png" alt="CardinalSpace" className="w-full h-auto" />
        </div>
      </div>

      <div className="-mt-16 flex flex-1 items-start justify-center px-4 pb-12">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
          <header className="mb-6 text-center">
            <h1 className="text-2xl font-semibold text-slate-900">
              Forgot Password?
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Enter your email to receive a password reset link
            </p>
          </header>

          {success ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700">
                Password reset link sent to your email
              </div>
              <p className="text-sm text-slate-600 text-center">
                Check your inbox for the reset link. The link is valid for 24 hours.
              </p>
              <Link
                href="/portal/login"
                className="block w-full rounded-full bg-rose-800 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-rose-900"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Email Address
                </label>
                <div className="mt-1 flex items-center rounded-full border border-rose-200 bg-rose-50/40 px-3 py-2 text-sm shadow-sm focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-100">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full bg-rose-800 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-rose-900 disabled:opacity-50"
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>

              <p className="text-center text-xs text-slate-600">
                Remember your password?{" "}
                <Link
                  href="/portal/login"
                  className="font-semibold text-rose-700 hover:text-rose-800"
                >
                  Sign In
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

