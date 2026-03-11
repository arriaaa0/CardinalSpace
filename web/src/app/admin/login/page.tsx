"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/[...nextauth]?action=login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Invalid credentials")
      } else {
        // Check if user is admin
        if (data.role !== "ADMIN") {
          setError("You do not have admin access")
          return
        }
        router.refresh()
        router.push("/admin/dashboard")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Top header with logo */}
      <div className="flex h-48 items-center justify-center bg-gradient-to-b from-rose-900 via-rose-800 to-rose-700 px-4">
        <div className="w-80">
          <img src="/logo.png" alt="CardinalSpace" className="w-full h-auto" />
        </div>
      </div>

      {/* Centered login card overlapping header */}
      <div className="-mt-8 flex flex-1 items-start justify-center px-4 pb-12">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
          <header className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-200">
              <span className="text-sm font-semibold">A</span>
            </div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Admin Portal
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Access the parking management system
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Admin Email
                </label>
                <div className="mt-1 flex items-center rounded-full border border-amber-200 bg-amber-50/40 px-3 py-2 text-sm shadow-sm focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-100">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    placeholder="Enter your admin email"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <div className="mt-1 flex items-center rounded-full border border-amber-200 bg-amber-50/40 px-3 py-2 text-sm shadow-sm focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-100">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-amber-800 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-900/30 hover:bg-amber-900 disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Login as Admin"}
            </button>

            <p className="mt-3 text-[11px] text-slate-500">
              Secure authentication for authorized personnel only.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

