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

    const { userId, reason } = await req.json()

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { vehicles: true }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if permit already exists
    const existingPermit = await prisma.permit.findFirst({
      where: { userId }
    })

    if (existingPermit) {
      // Update existing permit
      await prisma.permit.update({
        where: { id: existingPermit.id },
        data: { 
          status: "REJECTED"
        }
      })
    } else {
      // Find user's vehicle
      const userVehicle = user.vehicles[0]
      
      if (!userVehicle) {
        return NextResponse.json({ error: "User has no registered vehicle" }, { status: 400 })
      }

      // Create denied permit record
      await prisma.permit.create({
        data: {
          userId,
          vehicleId: userVehicle.id,
          type: "STUDENT",
          status: "REJECTED",
          startDate: new Date(),
          endDate: new Date(),
          price: 0.0
        }
      })
    }

    // Log admin action
    console.log(`Admin ${verified.payload.email} denied permit for user ${userId}. Reason: ${reason}`)

    return NextResponse.json({ 
      success: true,
      message: "Permit denied" 
    })
  } catch (error) {
    console.error("Deny permit error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
