import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const secret = new TextEncoder().encode(
      process.env.NEXTAUTH_SECRET || "e8f7g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8"
    )
    const verified = await jwtVerify(token, secret)
    
    if (verified.payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Fetch real stats from database
    const [totalPermits, activeReservations, pendingReviews, violations] = await Promise.all([
      prisma.permit.count(),
      prisma.reservation.count({ where: { status: "ACTIVE" } }),
      prisma.permit.count({ where: { status: "PENDING" } }),
      prisma.violation.count({ where: { status: "UNPAID" } })
    ])

    return NextResponse.json({
      totalPermits,
      activeReservations,
      pendingReviews,
      violations
    })

  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
