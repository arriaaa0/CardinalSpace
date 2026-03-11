import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Fetch actual reservations from database
    const reservations = await prisma.reservation.findMany({
      include: {
        user: true,
        vehicle: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    const formattedReservations = reservations.map((res) => ({
      id: res.id,
      userName: res.user.name || res.user.email,
      vehiclePlate: res.vehicle?.licensePlate || "N/A",
      lot: res.lot || "N/A",
      space: res.space || "N/A",
      startDate: new Date(res.startDate).toLocaleString(),
      endDate: new Date(res.endDate).toLocaleString(),
      status: res.status,
    }))

    return NextResponse.json({ reservations: formattedReservations })
  } catch (error) {
    console.error("Error fetching reservations:", error)
    return NextResponse.json({ error: "Failed to fetch reservations" }, { status: 500 })
  }
}
