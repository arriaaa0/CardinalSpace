import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"

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
    
    if (verified.payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { userEmail, vehiclePlate, violationType, location, description, penaltyAmount } = await req.json()

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create violation
    const violation = await prisma.violation.create({
      data: {
        userId: user.id,
        type: "NO_PERMIT", // Default type, can be updated based on violationType
        description,
        lotId: location,
        fine: parseFloat(penaltyAmount),
        status: "UNPAID",
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        vehicleId: null // Will be linked if vehicle found
      }
    })

    // Log admin action
    console.log(`Admin ${verified.payload.email} issued violation ${violation.id} to user ${userEmail}`)

    return NextResponse.json({ 
      success: true,
      message: "Violation issued successfully",
      violationId: violation.id
    })

  } catch (error) {
    console.error("Create violation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
