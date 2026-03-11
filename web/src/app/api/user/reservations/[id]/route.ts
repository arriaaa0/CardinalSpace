import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"

export async function DELETE(
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
      }
    })

    if (!reservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
    }

    // Check if reservation can be cancelled (not started yet)
    const now = new Date()
    const reservationStart = new Date(reservation.startDate)

    if (now >= reservationStart) {
      return NextResponse.json({ 
        error: "Cannot cancel reservation that has already started" 
      }, { status: 400 })
    }

    // Delete the reservation
    await prisma.reservation.delete({
      where: { id: reservationId }
    })

    return NextResponse.json({
      success: true,
      message: "Reservation cancelled successfully"
    })

  } catch (error) {
    console.error("Cancel reservation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
