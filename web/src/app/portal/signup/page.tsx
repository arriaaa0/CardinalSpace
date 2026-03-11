"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function PortalSignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/[...nextauth]?action=signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "An error occurred")
        return
      }

      // Redirect to login page
      router.push("/portal/login?message=Account created successfully")
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

      {/* Centered signup card overlapping header */}
      <div className="-mt-16 flex flex-1 items-start justify-center px-4 pb-12">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-200">
          <header className="mb-6 text-center">
            <h1 className="text-2xl font-semibold text-slate-900">
              Create Account
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Sign up to access parking services
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
                  Full Name
                </label>
                <div className="mt-1 flex items-center rounded-full border border-rose-200 bg-rose-50/40 px-3 py-2 text-sm shadow-sm focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-100">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Email
                </label>
                <div className="mt-1 flex items-center rounded-full border border-rose-200 bg-rose-50/40 px-3 py-2 text-sm shadow-sm focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-100">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
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
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    placeholder="Create a password"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Confirm Password
                </label>
                <div className="mt-1 flex items-center rounded-full border border-rose-200 bg-rose-50/40 px-3 py-2 text-sm shadow-sm focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-100">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-rose-800 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose-900/30 hover:bg-rose-900 disabled:opacity-50"
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>

            <p className="mt-3 text-center text-xs text-slate-600">
              Already have an account?{" "}
              <Link
                href="/portal/login"
                className="font-semibold text-rose-700 hover:text-rose-800"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

