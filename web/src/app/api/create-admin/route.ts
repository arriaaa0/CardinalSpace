import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (existingAdmin) {
      return NextResponse.json({ 
        message: "Admin already exists",
        email: existingAdmin.email 
      })
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('CardinalAdmin2024!', 12)
    const admin = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: hashedPassword,
        name: 'System Admin',
        role: 'ADMIN',
      },
    })

    return NextResponse.json({ 
      success: true,
      message: "Admin account created successfully",
      email: admin.email,
      password: 'CardinalAdmin2024!'
    })
  } catch (error) {
    console.error('Error creating admin:', error)
    return NextResponse.json({ 
      error: "Failed to create admin",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
