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
    const userId = verified.payload.sub as string

    const { violationId, reason } = await req.json()

    if (!violationId || !reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if violation exists and belongs to user
    const violation = await prisma.violation.findFirst({
      where: { 
        id: violationId,
        userId 
      }
    })

    if (!violation) {
      return NextResponse.json({ error: "Violation not found" }, { status: 404 })
    }

    // Check if appeal already exists
    const existingAppeal = await prisma.appeal.findFirst({
      where: { 
        violationId,
        userId 
      }
    })

    if (existingAppeal) {
      return NextResponse.json({ error: "Appeal already submitted for this violation" }, { status: 400 })
    }

    // Create the appeal
    const appeal = await prisma.appeal.create({
      data: {
        userId,
        violationId,
        reason,
        status: "PENDING"
      }
    })

    return NextResponse.json({
      success: true,
      message: "Appeal submitted successfully",
      appeal
    })

  } catch (error) {
    console.error("Submit appeal error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
