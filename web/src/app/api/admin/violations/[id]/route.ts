import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    // Find the violation with user information
    const violation = await prisma.violation.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
          }
        },
        appeals: true
      }
    })

    if (!violation) {
      return NextResponse.json({ error: "Violation not found" }, { status: 404 })
    }

    return NextResponse.json({ 
      violation,
      user: violation.user
    })

  } catch (error) {
    console.error("Get violation details error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
