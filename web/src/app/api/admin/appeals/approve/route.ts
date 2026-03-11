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

    const { appealId } = await req.json()

    // Update appeal status to APPROVED
    const appeal = await prisma.appeal.update({
      where: { id: appealId },
      data: { 
        status: "APPROVED",
        updatedAt: new Date()
      },
      include: {
        violation: true
      }
    })

    // Update the related violation status to DISMISSED
    if (appeal.violationId) {
      await prisma.violation.update({
        where: { id: appeal.violationId },
        data: { 
          status: "DISMISSED",
          updatedAt: new Date()
        }
      })
    }

    return NextResponse.json({ 
      success: true,
      message: "Appeal approved successfully" 
    })

  } catch (error) {
    console.error("Approve appeal error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
