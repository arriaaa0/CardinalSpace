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

    // Get user's permits with vehicle info
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

    return NextResponse.json({ permits })

  } catch (error) {
    console.error("Get permits error:", error)
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

    const { vehicleId, type } = await req.json()

    if (!vehicleId || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already has a pending or approved permit
    const existingPermit = await prisma.permit.findFirst({
      where: { userId }
    })

    if (existingPermit) {
      return NextResponse.json({ error: "You already have a permit application" }, { status: 400 })
    }

    // Check if vehicle belongs to user
    const vehicle = await prisma.vehicle.findFirst({
      where: { id: vehicleId, userId }
    })

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
    }

    // Calculate price based on type
    let price = 0
    switch (type) {
      case "STUDENT":
        price = 600.00
        break
      case "FACULTY":
        price = 1200.00
        break
      case "VISITOR":
        price = 300.00
        break
      default:
        price = 600.00
    }

    // Create permit application
    const permit = await prisma.permit.create({
      data: {
        userId,
        vehicleId,
        type,
        status: "PENDING",
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        price
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
      message: "Permit application submitted successfully",
      permit
    })

  } catch (error) {
    console.error("Create permit error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
