"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function PortalLoginPage() {
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
        router.refresh()
        router.push("/portal/dashboard")
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
      <div className="flex h-44 items-center justify-center bg-gradient-to-b from-rose-900 via-rose-800 to-rose-700 px-4">
        <div className="w-80">
          <img src="/logo.png" alt="CardinalSpace" className="w-full h-auto" />
        </div>
      </div>

      {/* Centered login card in white area */}
      <div className="mt-8 flex flex-1 items-start justify-center px-4 pb-12">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
          <header className="mb-6 text-center">
            <h1 className="text-2xl font-semibold text-slate-900">
              Welcome Back
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Sign in to access your parking dashboard
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
                  Email
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
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <div className="mt-1 flex items-center rounded-full border border-rose-200 bg-rose-50/40 px-3 py-2 text-sm shadow-sm focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-100">
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

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 rounded border-rose-200"
                />
                <label htmlFor="remember" className="text-slate-600">
                  Remember me
                </label>
              </div>
              <Link
                href="/portal/forgot-password"
                className="font-medium text-rose-600 hover:text-rose-700"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-rose-800 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose-900/30 hover:bg-rose-900 disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Login"}
            </button>

            <p className="mt-3 text-center text-xs text-slate-600">
              Demo: Use <strong>test@example.com</strong> / <strong>password</strong>
            </p>

            <p className="mt-3 text-center text-xs text-slate-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/portal/signup"
                className="font-semibold text-rose-700 hover:text-rose-800"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

