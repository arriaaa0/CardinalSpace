import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    // Check if reservation exists and belongs to user
    const reservation = await prisma.reservation.findFirst({
      where: { 
        id: id,
        userId 
      }
    })

    if (!reservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
    }

    // Delete the reservation
    await prisma.reservation.delete({
      where: { id: id }
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
