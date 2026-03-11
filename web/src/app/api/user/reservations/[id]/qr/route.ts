import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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

    const { params } = context
    const reservationId = (await params).id

    // Find the reservation
    const reservation = await prisma.reservation.findFirst({
      where: { 
        id: reservationId,
        userId 
      },
      include: {
        vehicle: {
          select: {
            licensePlate: true,
            make: true,
            model: true
          }
        }
      }
    })

    if (!reservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
    }

    // Generate QR code data
    const qrData = {
      reservationId: reservation.id,
      userId: reservation.userId,
      lot: reservation.lot,
      space: reservation.space,
      vehiclePlate: reservation.vehicle?.licensePlate,
      validFrom: reservation.startDate.toISOString(),
      validTo: reservation.endDate.toISOString(),
      qrCode: reservation.qrCode
    }

    return NextResponse.json({
      success: true,
      qrData
    })

  } catch (error) {
    console.error("Get QR code error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
