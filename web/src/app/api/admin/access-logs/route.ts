import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // For now, return mock data. You can replace this with actual database queries
    const mockLogs = [
      {
        id: "1",
        logId: "LOG-2026-8001",
        userName: "John Smith",
        vehiclePlate: "ABC 1234",
        qrCode: "QR-5A9B2C1D",
        actionType: "Entry" as const,
        location: "Lot A - Main Entrance",
        timestamp: "2/16/2026, 8:15:23 AM",
        status: "Approved" as const,
      },
      {
        id: "2",
        logId: "LOG-2026-8002",
        userName: "Dr. Sarah Johnson",
        vehiclePlate: "XYZ 5678",
        qrCode: "QR-7B3C4D2E",
        actionType: "Entry" as const,
        location: "Lot A - Reserved Entrance",
        timestamp: "2/16/2026, 8:20:45 AM",
        status: "Approved" as const,
      },
      {
        id: "3",
        logId: "LOG-2026-8003",
        userName: "Unknown User",
        vehiclePlate: "N/A",
        qrCode: "QR-INVALID",
        actionType: "Entry" as const,
        location: "Lot B - Side Entrance",
        timestamp: "2/16/2026, 9:05:12 AM",
        status: "Denied" as const,
      },
      {
        id: "4",
        logId: "LOG-2026-8004",
        userName: "Mike Davis",
        vehiclePlate: "DEF 9012",
        qrCode: "QR-9D5E6F3G",
        actionType: "Exit" as const,
        location: "Lot C - Main Exit",
        timestamp: "2/16/2026, 5:30:00 PM",
        status: "Approved" as const,
      },
    ]

    return NextResponse.json({ logs: mockLogs })
  } catch (error) {
    console.error("Error fetching access logs:", error)
    return NextResponse.json({ error: "Failed to fetch access logs" }, { status: 500 })
  }
}
