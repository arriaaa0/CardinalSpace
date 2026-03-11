# Cardinal Space - Parking Management System

A production-ready parking reservation and management system built with Next.js, React, TypeScript, and Prisma.

## Tech Stack

- **Framework:** Next.js 16.1.6 (Turbopack)
- **Runtime:** React 19.2.3
- **Language:** TypeScript 5
- **Database:** SQLite with Prisma v6 ORM
- **Styling:** Tailwind CSS v4
- **Auth:** Custom JWT with HTTP-only cookies
- **Validation:** Zod

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

### 1. Install Dependencies

``ash
npm install
``

### 2. Set Up Environment Variables

Copy .env.example to .env.local and fill in your values:

``ash
cp .env.example .env.local
``

Then edit .env.local:
``
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-here"  # Generate: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3001"
``

### 3. Initialize Database

Run Prisma migrations to set up your local database:

``ash
npx prisma migrate dev
``

### 4. Start Development Server

``ash
npm run dev
``

Open [http://localhost:3001](http://localhost:3001) in your browser.

### 5. Login with Test Credentials

- **Admin:** admin@example.com / admin123
- **User:** user@example.com / user123

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
``

## Database

This project uses SQLite with Prisma. To view/edit your database:

``ash
npx prisma studio
``

## Contributing

1. Create a feature branch: git checkout -b feature/your-feature
2. Commit changes: git commit -am "Add feature"
3. Push to branch: git push origin feature/your-feature
4. Create a pull request

## Notes for Collaborators

- Each developer should have their own dev.db (generated locally via 
px prisma migrate dev)
- Never commit .env.local or *.db files
- The Prisma schema is in /prisma/schema.prisma
- All API routes require JWT authentication (check /src/lib/auth-actions.ts)
- User portal uses rose theme, admin uses amber theme
