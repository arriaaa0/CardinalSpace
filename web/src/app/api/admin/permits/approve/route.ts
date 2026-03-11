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

    const { userId } = await req.json()

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
          status: "APPROVED"
        }
      })
    } else {
      // Find user's vehicle or create a placeholder
      const userVehicle = user.vehicles[0]
      
      if (!userVehicle) {
        return NextResponse.json({ error: "User has no registered vehicle" }, { status: 400 })
      }

      // Create new permit
      await prisma.permit.create({
        data: {
          userId,
          vehicleId: userVehicle.id,
          type: "STUDENT",
          status: "APPROVED",
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
          price: 0.0
        }
      })
    }

    // Log admin action (will implement audit log later)
    console.log(`Admin ${verified.payload.email} approved permit for user ${userId}`)

    return NextResponse.json({ 
      success: true,
      message: "Permit approved successfully" 
    })
  } catch (error) {
    console.error("Approve permit error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
