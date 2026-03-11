import { NextResponse } from "next/server"

export async function GET() {
  try {
    // This is a one-time setup endpoint
    // In production, you should remove this after creating the admin account
    
    const adminData = {
      email: "admin@example.com",
      password: "CardinalAdmin2024!",
      instructions: [
        "1. Connect to your Neon database directly",
        "2. Run this SQL query:",
        "INSERT INTO \"User\" (id, email, password, name, role, createdAt, updatedAt) VALUES",
        "('admin-id', 'admin@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LrD2m', 'System Admin', 'ADMIN', NOW(), NOW());",
        "3. Or use the Prisma CLI: npx prisma db seed --force-reset"
      ]
    }

    return NextResponse.json({
      message: "Admin setup instructions",
      ...adminData
    })
  } catch (error) {
    return NextResponse.json({ error: "Setup failed" }, { status: 500 })
  }
}
