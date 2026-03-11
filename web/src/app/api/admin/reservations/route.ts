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
        startTime: "desc",
      },
    })

    const formattedReservations = reservations.map((res) => ({
      id: res.id,
      userName: res.user.name || res.user.email,
      vehiclePlate: res.vehicle?.licensePlate || "N/A",
      lotLocation: res.lotLocation || "N/A",
      spotNumber: res.spotNumber || "N/A",
      startTime: new Date(res.startTime).toLocaleString(),
      endTime: new Date(res.endTime).toLocaleString(),
      status: res.status,
    }))

    return NextResponse.json({ reservations: formattedReservations })
  } catch (error) {
    console.error("Error fetching reservations:", error)
    return NextResponse.json({ error: "Failed to fetch reservations" }, { status: 500 })
  }
}
