import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  try {
    // Create test admin user
    const adminEmail = 'admin@example.com'
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    })

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('CardinalAdmin2024!', 12)
      const admin = await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          name: 'Admin User',
          role: 'ADMIN',
        },
      })
      console.log('Created admin user:', admin)
    } else {
      console.log('Admin user already exists')
    }

    // Create test regular user
    const userEmail = 'user@example.com'
    const existingUser = await prisma.user.findUnique({
      where: { email: userEmail },
    })

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('CardinalUser2024!', 12)
      const user = await prisma.user.create({
        data: {
          email: userEmail,
          password: hashedPassword,
          name: 'Test User',
          role: 'USER',
        },
      })
      console.log('Created test user:', user)
    } else {
      console.log('Test user already exists')
    }
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
