import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST() {
  try {
    // Delete all existing users first
    await prisma.user.deleteMany({})
    console.log('Deleted all existing users')

    // Create test admin user
    const adminEmail = 'admin@example.com'
    const hashedAdminPassword = await bcrypt.hash('CardinalAdmin2024!', 12)
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedAdminPassword,
        name: 'Admin User',
        role: 'ADMIN',
      },
    })
    console.log('Created admin user:', admin.email)

    // Create test regular user
    const userEmail = 'user@example.com'
    const hashedUserPassword = await bcrypt.hash('CardinalUser2024!', 12)
    const user = await prisma.user.create({
      data: {
        email: userEmail,
        password: hashedUserPassword,
        name: 'Test User',
        role: 'USER',
      },
    })
    console.log('Created test user:', user.email)

    return NextResponse.json({ 
      success: true,
      message: "Database seeded successfully",
      admin: admin.email,
      user: user.email
    })
  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json({ 
      error: "Failed to seed database",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
