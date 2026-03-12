import { NextRequest, NextResponse } from "next/server"
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

    // Get user's reservations with vehicle info
    const reservations = await prisma.reservation.findMany({
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

    return NextResponse.json({ reservations })

  } catch (error) {
    console.error("Get reservations error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
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

    const { lot, space, startDate, endDate, vehicleId } = await req.json()

    if (!lot || !space || !startDate || !endDate || !vehicleId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate dates
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (end <= start) {
      return NextResponse.json({ error: "End time must be after start time" }, { status: 400 })
    }

    // Check if user has any approved permit (simplified for school parking)
    const userPermit = await prisma.permit.findFirst({
      where: { 
        userId,
        status: "APPROVED"
      }
    })

    if (!userPermit) {
      return NextResponse.json({ 
        error: "Parking permit required for reservations. Please apply for a permit through the Permits page and wait for admin approval.",
        needsPermit: true
      }, { status: 400 })
    }

    // Check for conflicting reservations
    const conflictingReservation = await prisma.reservation.findFirst({
      where: {
        space,
        status: "ACTIVE",
        OR: [
          {
            startDate: { lte: start },
            endDate: { gte: start }
          },
          {
            startDate: { lte: end },
            endDate: { gte: end }
          },
          {
            startDate: { gte: start },
            endDate: { lte: end }
          }
        ]
      }
    })

    if (conflictingReservation) {
      return NextResponse.json({ error: "This space is already reserved for the selected time" }, { status: 400 })
    }

    // Generate QR code
    const qrCode = `RES-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Create the reservation
    const reservation = await prisma.reservation.create({
      data: {
        userId,
        vehicleId,
        lot,
        space,
        startDate: start,
        endDate: end,
        status: "ACTIVE",
        qrCode
      },
      include: {
        vehicle: {
          select: {
            id: true,
            make: true,
            model: true,
            licensePlate: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: "Reservation created successfully",
      reservation
    })

  } catch (error) {
    console.error("Create reservation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
