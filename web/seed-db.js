#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({});

async function main() {
  try {
    // Check if admin exists
    const adminExists = await prisma.user.findUnique({
      where: { email: 'admin@example.com' }
    });

    if (!adminExists) {
      await prisma.user.create({
        data: {
          email: 'admin@example.com',
          password: '$2b$12$6ZXnKt3a5QQ5oBqlSKbSTeZuhIPjIiGM9jWnVywTVn/QPqloDlLrq',
          name: 'Admin User',
          role: 'ADMIN'
        }
      });
      console.log('✓ Created admin user');
    } else {
      console.log('✓ Admin user already exists');
    }

    // Check if test user exists
    const userExists = await prisma.user.findUnique({
      where: { email: 'user@example.com' }
    });

    if (!userExists) {
      await prisma.user.create({
        data: {
          email: 'user@example.com',
          password: '$2b$12$HJQZ1a7B9rmUSaZraEGbUewRgZRK.VY8zMVtqpmIaddT50Smcek8.',
          name: 'Test User',
          role: 'USER'
        }
      });
      console.log('✓ Created test user');
    } else {
      console.log('✓ Test user already exists');
    }

    console.log('\n✓ Database seeding complete!');
    console.log('\nTest credentials:');
    console.log('Admin: admin@example.com / admin123');
    console.log('User:  user@example.com / user123');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
