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
    
    const { reservationId, amount, paymentMethod, cardNumber, name } = await req.json()

    // Create payment transaction
    const transaction = await prisma.payment.create({
      data: {
        userId: verified.payload.userId as string,
        amount: amount + 10, // Including service fee
        type: "RESERVATION",
        status: "COMPLETED",
        description: `Payment for ${paymentMethod} - ${name}`,
        stripePaymentId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      }
    })

    // Update reservation status if applicable
    if (reservationId) {
      await prisma.reservation.update({
        where: { id: reservationId },
        data: { status: "ACTIVE" }
      })
    }

    // Log transaction
    console.log(`Payment processed: ${transaction.stripePaymentId} for user ${verified.payload.email}`)

    return NextResponse.json({ 
      success: true,
      message: "Payment processed successfully",
      transactionId: transaction.stripePaymentId,
      amount: transaction.amount
    })

  } catch (error) {
    console.error("Payment processing error:", error)
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 })
  }
}
