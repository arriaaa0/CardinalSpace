import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
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

    const { startDate, endDate } = await req.json()

    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true }
    })

    // Get all user permits
    const allPermits = await prisma.permit.findMany({
      where: { userId },
      include: {
        vehicle: true
      },
      orderBy: { createdAt: "desc" }
    })

    // Parse dates
    const start = new Date(startDate)
    const end = new Date(endDate)

    // Test different validation approaches
    const strictValidation = await prisma.permit.findFirst({
      where: { 
        userId,
        status: "APPROVED",
        startDate: { lte: start },
        endDate: { gte: end }
      }
    })

    const flexibleValidation = await prisma.permit.findFirst({
      where: { 
        userId,
        status: "APPROVED",
        startDate: { lte: end },
        endDate: { gte: start }
      }
    })

    const justApproved = await prisma.permit.findFirst({
      where: { 
        userId,
        status: "APPROVED"
      }
    })

    return NextResponse.json({
      user: {
        email: user?.email,
        role: user?.role
      },
      reservationDates: {
        start: start.toISOString(),
        end: end.toISOString()
      },
      permits: allPermits.map(p => ({
        id: p.id,
        type: p.type,
        status: p.status,
        startDate: p.startDate.toISOString(),
        endDate: p.endDate.toISOString(),
        vehicle: `${p.vehicle.make} ${p.vehicle.model} (${p.vehicle.licensePlate})`
      })),
      validationResults: {
        strict: !!strictValidation,
        flexible: !!flexibleValidation,
        justApproved: !!justApproved
      },
      analysis: {
        totalPermits: allPermits.length,
        approvedPermits: allPermits.filter(p => p.status === "APPROVED").length,
        issue: !strictValidation && !flexibleValidation ? 
          "No valid permit found for reservation dates" :
          strictValidation ? "Strict validation passed" :
          flexibleValidation ? "Flexible validation passed" :
          "Just checking approval status"
      }
    })

  } catch (error) {
    console.error("Permit check debug error:", error)
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
