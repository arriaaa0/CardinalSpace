# Database Setup Guide for CardinalSpace

## System Requirements

### Database
- **SQLite** (recommended for development)
- **PostgreSQL** (recommended for production)

### Environment Setup
- Node.js 18+ 
- npm or yarn
- Prisma ORM

## Quick Setup Instructions

### 1. Database Configuration

#### Option A: SQLite (Development)
```bash
# The system is already configured for SQLite
# Database file: dev.db (auto-created)
```

#### Option B: PostgreSQL (Production)
```bash
# Update .env file:
DATABASE_URL="postgresql://username:password@localhost:5432/cardinal_db"
```

### 2. Database Initialization

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client
npx prisma generate

# 3. Create database schema
npx prisma db push

# 4. Seed initial data
npm run seed
# OR manually: curl -X POST http://localhost:3000/api/seed
```

### 3. Environment Variables

Create `.env` file:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-here"
NODE_ENV="development"
```

## Database Schema

### Core Tables
- **Users** (authentication, roles)
- **Vehicles** (user vehicle information)
- **Permits** (parking permits)
- **Reservations** (time-based parking)
- **Violations** (parking violations)
- **Payments** (transaction records)
- **Appeals** (violation appeals)

### Relationships
- Users → Vehicles (one-to-many)
- Users → Permits (one-to-many)
- Users → Reservations (one-to-many)
- Vehicles → Reservations (one-to-one)
- Users → Violations (one-to-many)

## Default Credentials

### Admin Account
- **Email:** admin@example.com
- **Password:** CardinalAdmin2024!
- **Role:** ADMIN

### Test User Account
- **Email:** user@example.com
- **Password:** CardinalUser2024!
- **Role:** USER

## Production Deployment

### Vercel Setup
1. Connect repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy - Vercel handles database automatically

### Manual Deployment
```bash
# Build for production
npm run build

# Start production server
npm start
```

## Database Migration

If migrating from development to production:
```bash
# Export development data
npx prisma db seed

# Update production DATABASE_URL
# Run migration
npx prisma migrate deploy
```

## Troubleshooting

### Common Issues
1. **Database connection failed**
   - Check DATABASE_URL in .env
   - Ensure database server is running

2. **Prisma client error**
   - Run: `npx prisma generate`
   - Restart development server

3. **Migration issues**
   - Reset: `npx prisma db push --force-reset`
   - Re-seed data

### Support
- Check Prisma documentation: https://www.prisma.io/docs
- Review logs in development server
- Verify environment variables are correctly set
