import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  try {
    // Delete all existing data first
    await prisma.reservation.deleteMany({})
    await prisma.permit.deleteMany({})
    await prisma.vehicle.deleteMany({})
    await prisma.user.deleteMany({})
    console.log('Deleted all existing data')

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

    // Create vehicles for users
    const adminVehicle = await prisma.vehicle.create({
      data: {
        userId: admin.id,
        make: 'Toyota',
        model: 'Camry',
        year: 2022,
        color: 'Silver',
        licensePlate: 'ADMIN123',
      },
    })
    console.log('Created admin vehicle:', adminVehicle.licensePlate)

    const userVehicle = await prisma.vehicle.create({
      data: {
        userId: user.id,
        make: 'Honda',
        model: 'Civic',
        year: 2021,
        color: 'Blue',
        licensePlate: 'USER456',
      },
    })
    console.log('Created user vehicle:', userVehicle.licensePlate)

    // Create approved permits for users (valid for 1 year from today)
    const today = new Date()
    const oneYearFromNow = new Date(today)
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)

    const adminPermit = await prisma.permit.create({
      data: {
        userId: admin.id,
        vehicleId: adminVehicle.id,
        type: 'FACULTY',
        status: 'APPROVED',
        startDate: today,
        endDate: oneYearFromNow,
        price: 1200.00, // Faculty permit price
      },
    })
    console.log('Created admin permit:', adminPermit.type)

    const userPermit = await prisma.permit.create({
      data: {
        userId: user.id,
        vehicleId: userVehicle.id,
        type: 'STUDENT',
        status: 'APPROVED',
        startDate: today,
        endDate: oneYearFromNow,
        price: 600.00, // Student permit price
      },
    })
    console.log('Created user permit:', userPermit.type)
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
