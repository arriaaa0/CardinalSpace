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
    const userId = verified.payload.sub as string

    const violations = await prisma.violation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        vehicle: true,
      },
    })

    const appeals = await prisma.appeal.findMany({
      where: { 
        violation: {
          userId
        }
      },
      include: {
        violation: true,
      },
    })

    return NextResponse.json({ 
      violations: violations.map(v => ({
        id: v.id,
        date: new Date(v.issuedAt).toISOString().split('T')[0],
        time: new Date(v.issuedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        lot: v.lotId || "N/A",
        type: v.type,
        amount: v.fine || 0,
        status: v.status.toLowerCase(),
        description: v.description || "",
      })),
      appeals: appeals.map(a => ({
        id: a.id,
        violationId: a.violationId,
        reason: a.reason,
        evidence: "",
        status: a.status.toLowerCase(),
      }))
    })
  } catch (error) {
    console.error("Get violations error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
