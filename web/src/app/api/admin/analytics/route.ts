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
      
      // Monthly data (last 6 months)
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', issued_at) as month,
          COUNT(*) as violations,
          0 as permits,
          0 as reservations
        FROM violations 
        WHERE issued_at >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', issued_at)
        
        UNION ALL
        
        SELECT 
          DATE_TRUNC('month', created_at) as month,
          0 as violations,
          COUNT(*) as permits,
          0 as reservations
        FROM permits 
        WHERE created_at >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', created_at)
        
        UNION ALL
        
        SELECT 
          DATE_TRUNC('month', created_at) as month,
          0 as violations,
          0 as permits,
          COUNT(*) as reservations
        FROM reservations 
        WHERE created_at >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', created_at)
        
        ORDER BY month DESC
        LIMIT 18
      `,
      
      // Recent activity summary
      prisma.$queryRaw`
        SELECT 
          'permits' as type,
          COUNT(*) as count,
          DATE(created_at) as date
        FROM permits 
        WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY DATE(created_at)
        
        UNION ALL
        
        SELECT 
          'violations' as type,
          COUNT(*) as count,
          DATE(issued_at) as date
        FROM violations 
        WHERE issued_at >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY DATE(issued_at)
        
        UNION ALL
        
        SELECT 
          'appeals' as type,
          COUNT(*) as count,
          DATE(created_at) as date
        FROM appeals 
        WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY DATE(created_at)
        
        ORDER BY date DESC
      `
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
      monthlyData: monthlyData,
      recentActivity: recentActivity
    })

  } catch (error) {
    console.error("Get analytics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
