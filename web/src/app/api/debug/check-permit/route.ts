import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "No auth token" }, { status: 401 })
    }

    const secret = new TextEncoder().encode(
      process.env.NEXTAUTH_SECRET || "e8f7g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8"
    )
    const verified = await jwtVerify(token, secret)
    const userId = verified.payload.sub as string

    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true }
    })

    // Get user's permits
    const permits = await prisma.permit.findMany({
      where: { userId },
      include: {
        vehicle: {
          select: {
            id: true,
            make: true,
            model: true,
            licensePlate: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    // Get user's vehicles
    const vehicles = await prisma.vehicle.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    })

    // Test permit validation logic
    const now = new Date()
    const testStart = new Date(now.getTime() + 60 * 60 * 1000) // 1 hour from now
    const testEnd = new Date(now.getTime() + 5 * 60 * 60 * 1000) // 5 hours from now

    const validPermit = await prisma.permit.findFirst({
      where: { 
        userId,
        status: "APPROVED",
        startDate: { lte: testStart },
        endDate: { gte: testEnd }
      }
    })

    return NextResponse.json({
      user,
      permits,
      vehicles,
      debug: {
        currentTime: now,
        testStartTime: testStart,
        testEndTime: testEnd,
        hasValidPermit: !!validPermit,
        validPermitDetails: validPermit,
        totalPermits: permits.length,
        approvedPermits: permits.filter(p => p.status === "APPROVED").length
      }
    })

  } catch (error) {
    console.error("Debug check permit error:", error)
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
