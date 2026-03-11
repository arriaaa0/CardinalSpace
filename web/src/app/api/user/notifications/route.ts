import { NextResponse } from "next/server"
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

    // Get user's permits, violations, and appeals to generate notifications
    const [permits, violations, appeals] = await Promise.all([
      prisma.permit.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5
      }),
      prisma.violation.findMany({
        where: { userId },
        include: { appeals: true },
        orderBy: { issuedAt: "desc" },
        take: 5
      }),
      prisma.appeal.findMany({
        where: { userId },
        include: { violation: true },
        orderBy: { createdAt: "desc" },
        take: 5
      })
    ])

    // Generate notifications from real data
    const notifications: any[] = []

    // Permit notifications
    permits.forEach(permit => {
      if (permit.status === "APPROVED") {
        notifications.push({
          id: `permit-${permit.id}`,
          title: "Your parking permit has been approved",
          description: "You can now access parking facilities",
          time: new Date(permit.updatedAt).toLocaleString(),
          type: "success"
        })
      } else if (permit.status === "REJECTED") {
        notifications.push({
          id: `permit-${permit.id}`,
          title: "Your parking permit was rejected",
          description: "Please contact admin for more information",
          time: new Date(permit.updatedAt).toLocaleString(),
          type: "error"
        })
      }
    })

    // Violation notifications
    violations.forEach(violation => {
      notifications.push({
        id: `violation-${violation.id}`,
        title: `New violation issued: ${violation.type}`,
        description: `Fine: ₱${violation.fine} - ${violation.description}`,
        time: new Date(violation.issuedAt).toLocaleString(),
        type: "warning"
      })
    })

    // Appeal notifications
    appeals.forEach(appeal => {
      if (appeal.status === "APPROVED") {
        notifications.push({
          id: `appeal-${appeal.id}`,
          title: "Your appeal has been approved",
          description: `Violation ${appeal.violationId} penalty has been waived`,
          time: new Date(appeal.updatedAt || appeal.createdAt).toLocaleString(),
          type: "success"
        })
      } else if (appeal.status === "DENIED") {
        notifications.push({
          id: `appeal-${appeal.id}`,
          title: "Your appeal has been denied",
          description: `Violation ${appeal.violationId} penalty still applies`,
          time: new Date(appeal.updatedAt || appeal.createdAt).toLocaleString(),
          type: "error"
        })
      }
    })

    // Sort by time (most recent first)
    notifications.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

    return NextResponse.json({ notifications })

  } catch (error) {
    console.error("Get notifications error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
