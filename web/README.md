# Cardinal Space - Parking Management System

A production-ready parking reservation and management system built with Next.js, React, TypeScript, and Prisma.

## Tech Stack

- **Framework:** Next.js 16.1.6 (Turbopack)
- **Runtime:** React 19.2.3
- **Language:** TypeScript 5
- **Database:** PostgreSQL with Prisma v6 ORM
- **Styling:** Tailwind CSS v4
- **Auth:** Custom JWT with HTTP-only cookies
- **Validation:** Zod
- **Deployment:** Vercel (with Vercel Postgres)

## Features

✅ User authentication (login/signup with bcrypt)
✅ Role-based access (ADMIN/USER)
✅ Interactive parking lot map with space selection
✅ Three-step reservation workflow
✅ Time pickers with duration auto-calculation
✅ Hourly pricing system (₱/hour per lot)
✅ Payment method selection UI
✅ User settings/profile management
✅ Responsive mobile-first design

## Getting Started

### Quick Setup (SQLite - Recommended for Development)

For easy setup with SQLite (no database server needed):

#### Windows:
```bash
setup.bat
```

#### Mac/Linux:
```bash
chmod +x setup.sh
./setup.sh
```

#### Manual Setup:
```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

### Production Setup (PostgreSQL)

### 1. Install Dependencies

``bash
npm install
```

### 2. Set Up Environment Variables

Copy .env.example to .env.local and fill in your values:

``bash
cp .env.example .env.local
```

Then edit .env.local:
```
DATABASE_URL="postgresql://user:password@localhost:5432/cardinalspace"
DIRECT_URL="postgresql://user:password@localhost:5432/cardinalspace"
NEXTAUTH_SECRET="your-secret-here"  # Generate: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3001"
```

**Note:** You'll need PostgreSQL installed locally, or use Vercel Postgres for development.

### 3. Initialize Database

Run Prisma migrations to set up your local database:

``bash
npx prisma migrate dev
```

### 4. Start Development Server

``bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### 5. Login with Test Credentials

- **Admin:** admin@example.com / CardinalAdmin2024!
- **User:** user@example.com / CardinalUser2024!

## Project Structure

``
web/
├── src/
│   ├── app/
│   │   ├── admin/          # Admin dashboard (role-protected)
│   │   ├── portal/         # User portal
│   │   │   ├── dashboard/  # User home
│   │   │   ├── map/        # Interactive parking lot
│   │   │   ├── reservations/ # Booking system
│   │   │   └── settings/   # Profile & preferences
│   │   └── api/            # API routes
│   ├── lib/                # Auth utilities & shared code
│   └── prisma/             # Database schema & migrations
``

## Key Pages

- / - Landing page
- /portal/login - User login
- /portal/signup - User registration
- /portal/dashboard - User home with quick actions
- /portal/map - Interactive parking lot browser
- /portal/reservations - Booking & payment
- /portal/settings - Profile & account settings
- /admin/dashboard - Admin analytics
- /admin/permits - Permit management
- /admin/violations - Violation tracking

## Development Commands

``ash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Run production server
npm run lint         # Run ESLint
npx prisma studio   # Open Prisma database GUI
npx prisma migrate dev  # Create new migration
```

## Database

This project uses PostgreSQL with Prisma. To view/edit your database:

``bash
npx prisma studio
```

For local development, you can either:
- Install PostgreSQL locally
- Use Vercel Postgres (recommended - see VERCEL_DEPLOYMENT.md)

## Deployment

See **VERCEL_DEPLOYMENT.md** for complete instructions on deploying to Vercel with PostgreSQL.

For migrating from SQLite to PostgreSQL, see **MIGRATION_GUIDE.md**.

## Contributing

1. Create a feature branch: git checkout -b feature/your-feature
2. Commit changes: git commit -am "Add feature"
3. Push to branch: git push origin feature/your-feature
4. Create a pull request

## Notes for Collaborators

- Each developer should have their own PostgreSQL database (local or Vercel Postgres)
- Run `npx prisma migrate dev` to set up your database schema
- Never commit .env.local or *.db files
- The Prisma schema is in /prisma/schema.prisma
- All API routes require JWT authentication (check /src/lib/auth-actions.ts)
- User portal uses rose theme, admin uses amber theme
