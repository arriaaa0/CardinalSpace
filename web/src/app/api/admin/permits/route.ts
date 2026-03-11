import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"

export async function GET(req: NextRequest) {
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

    // Get all users with their vehicles
    const users = await prisma.user.findMany({
      include: {
        vehicles: true,
        permits: true
      },
      orderBy: { createdAt: "desc" }
    })

    const applications = users.map(user => {
      const vehicle = user.vehicles[0]
      const permit = user.permits[0]
      
      return {
        id: user.id.substring(0, 8).toUpperCase(),
        userId: user.id,
        name: user.name || "Unknown",
        type: user.role === "ADMIN" ? "Admin" : "Student",
        email: user.email,
        vehicle: vehicle 
          ? `${vehicle.licensePlate} • ${vehicle.make} ${vehicle.model}`
          : "No vehicle",
        submitted: new Date(user.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        }),
        status: permit?.status || "PENDING"
      }
    })

    return NextResponse.json({ applications })
  } catch (error) {
    console.error("Get permits error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
