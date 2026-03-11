const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Delete existing admin if exists
    await prisma.user.deleteMany({
      where: { email: 'admin@example.com' }
    });

    // Create new admin
    const hashedPassword = await bcrypt.hash('CardinalAdmin2024!', 12);
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: hashedPassword,
        name: 'System Admin',
        role: 'ADMIN',
      },
    });

    console.log('✅ Admin account created successfully!');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password: CardinalAdmin2024!');
    console.log('🌐 Login at: cardinal-space.vercel.app/admin/login');
    
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
