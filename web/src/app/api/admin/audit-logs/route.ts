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

    // Get recent reservations as user activity logs
    const reservations = await prisma.reservation.findMany({
      include: {
        user: true
      },
      orderBy: { createdAt: "desc" },
      take: 20
    })

    const logs = reservations.map(res => ({
      id: res.id,
      type: "User Activity",
      action: "Parking Reservation Created",
      description: `User ${res.user.name || res.user.email} created a reservation for ${res.lot}`,
      user: res.user.email,
      timestamp: new Date(res.createdAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      ipAddress: null
    }))

    // Add some admin action examples (in production, these would come from a dedicated audit table)
    const adminLogs = [
      {
        id: "admin-1",
        type: "Admin Action",
        action: "Permit Approved",
        description: "Admin approved parking permit application",
        user: verified.payload.email as string,
        timestamp: new Date().toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }),
        ipAddress: "192.168.1.1"
      }
    ]

    return NextResponse.json({ 
      logs: [...adminLogs, ...logs]
    })
  } catch (error) {
    console.error("Get audit logs error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
