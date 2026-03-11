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

    // Get analytics data
    const [
      totalUsers,
      totalPermits,
      totalViolations,
      totalReservations,
      totalAppeals,
      permitsByStatus,
      violationsByType,
      violationsByStatus,
      monthlyData,
      recentActivity
    ] = await Promise.all([
      // Total counts
      prisma.user.count({ where: { role: "USER" } }),
      prisma.permit.count(),
      prisma.violation.count(),
      prisma.reservation.count(),
      prisma.appeal.count(),
      
      // Permits by status
      prisma.permit.groupBy({
        by: ['status'],
        _count: { status: true }
      }),
      
      // Violations by type
      prisma.violation.groupBy({
        by: ['type'],
        _count: { type: true }
      }),
      
      // Violations by status
      prisma.violation.groupBy({
        by: ['status'],
        _count: { status: true }
      }),
      
      // Monthly data (simplified)
      [],
      
      // Recent activity summary (simplified)
      []
    ])

    // Calculate revenue from violations
    const paidViolations = await prisma.violation.aggregate({
      where: { status: 'PAID' },
      _sum: { fine: true }
    })

    const totalRevenue = paidViolations._sum.fine || 0

    return NextResponse.json({
      overview: {
        totalUsers,
        totalPermits,
        totalViolations,
        totalReservations,
        totalAppeals,
        totalRevenue
      },
      permitsByStatus: permitsByStatus.reduce((acc, item) => {
        acc[item.status] = item._count.status
        return acc
      }, {} as Record<string, number>),
      violationsByType: violationsByType.reduce((acc, item) => {
        acc[item.type] = item._count.type
        return acc
      }, {} as Record<string, number>),
      violationsByStatus: violationsByStatus.reduce((acc, item) => {
        acc[item.status] = item._count.status
        return acc
      }, {} as Record<string, number>),
      monthlyData: [],
      recentActivity: []
    })

  } catch (error) {
    console.error("Get analytics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
