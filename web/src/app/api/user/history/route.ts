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
    const userId = verified.payload.sub as string

    // Get completed reservations (parking history)
    const completedReservations = await prisma.reservation.findMany({
      where: { 
        userId,
        status: "COMPLETED"
      },
      include: {
        vehicle: {
          select: {
            licensePlate: true,
            make: true,
            model: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    // Get paid violations
    const paidViolations = await prisma.violation.findMany({
      where: { 
        userId,
        status: "PAID"
      },
      include: {
        vehicle: {
          select: {
            licensePlate: true,
            make: true,
            model: true
          }
        }
      },
      orderBy: { issuedAt: "desc" }
    })

    // Get payments
    const payments = await prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    })

    // Calculate statistics
    const totalSessions = completedReservations.length
    const totalViolations = paidViolations.length
    const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0)

    // Most frequently used lot
    const lotFrequency = completedReservations.reduce((acc: any, res) => {
      acc[res.lot] = (acc[res.lot] || 0) + 1
      return acc
    }, {})
    const mostUsedLot = Object.keys(lotFrequency).length > 0 
      ? Object.entries(lotFrequency).sort(([,a], [,b]) => (Number(b) - Number(a)))[0][0]
      : null

    // Average session duration
    const avgDuration = completedReservations.length > 0
      ? completedReservations.reduce((sum, res) => {
          const duration = new Date(res.endDate).getTime() - new Date(res.startDate).getTime()
          return sum + duration
        }, 0) / completedReservations.length / (1000 * 60 * 60) // Convert to hours
      : 0

    return NextResponse.json({
      history: {
        reservations: completedReservations,
        violations: paidViolations,
        payments
      },
      statistics: {
        totalSessions,
        totalViolations,
        totalAmount,
        mostUsedLot,
        avgDuration: Math.round(avgDuration * 10) / 10
      }
    })

  } catch (error) {
    console.error("Get history error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
