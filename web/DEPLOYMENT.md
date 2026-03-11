# Deployment Guide - Cardinal Space

## Quick Start for Production

### Windows PowerShell (Recommended)

```powershell
# Method 1: Run the startup script (automatic build + environment setup)
.\start-prod.ps1

# Method 2: Manual (if you prefer)
$env:NODE_ENV = "production"
$env:PORT = "3000"
npm start
```

### Windows Command Prompt (CMD)

```cmd
# Run the batch startup script (automatic build + environment setup)
start-prod.bat
```

### Linux/Mac

```bash
NODE_ENV=production PORT=3000 npm start
```

### 1. Initial Setup (One-time)

After cloning and installing dependencies:

```bash
npm install
npm run setup
npm run build
npm start
```

The `npm run setup` command automatically:
- Runs database migrations
- Seeds the database with test users

### 2. Default Test Credentials

After initial setup, you can log in with:

**Admin Portal:**
- Email: `admin@example.com`
- Password: `CardinalAdmin2024!`
- Access: `http://localhost:3000/admin/login`

**User Portal:**
- Email: `user@example.com`
- Password: `CardinalUser2024!`
- Access: `http://localhost:3000/portal/login`

### 3. Environment Configuration

Copy `.env.production` and update with your deployment details:

```bash
# Database (SQLite file path - ensure writable directory)
DATABASE_URL="file:/var/lib/cardinalspace/prod.db"

# Generate a secure random secret (min 32 chars)
NEXTAUTH_SECRET="your-secure-random-secret-here"

# Your production domain
NEXTAUTH_URL="https://yourdomain.com"

NODE_ENV="production"
PORT=3000
```

⚠️ **CRITICAL: Always set `NODE_ENV=production`** - Without this, the app runs in dev mode and generates different chunk files, causing 404 errors.

### 4. Build & Deploy

```bash
npm run build      # Builds the application with optimized chunks
npm start          # Starts production server on specified PORT
```

### 5. Authentication Flow

- **Route Protection:** Middleware automatically redirects unauthenticated users to login
- **Session:** JWT token stored in HTTP-only cookie (secure in production)
- **Auto-redirect:** After login, users are redirected to appropriate dashboard
  - Admins → `/admin/dashboard`
  - Users → `/portal/dashboard`

### 6. Database Notes

- **SQLite** with Prisma ORM
- Migrations run automatically during build
- Data persists in the database file location specified in `DATABASE_URL`
- Ensure the directory is writable and backed up

### 7. Customizing Credentials

To create additional admin or user accounts after deployment:

**Edit `prisma/seed.ts` with desired credentials, then run:**
```bash
npm run seed
```

Or use the signup API endpoint:
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "secure-password",
  "name": "User Name"
}
```

### 8. Troubleshooting

**404 errors on CSS/JS chunks:**
- Ensure `NODE_ENV=production` is set before starting
- Use the `start-prod.bat` or `start-prod.ps1` scripts to auto-set environment
- If still failing, run `npm run build` again

**401 errors on login:**
- Run `npm run setup` to ensure database is seeded
- Check that password credentials match seeded values

**Database errors:**
- Ensure `DATABASE_URL` path exists and is writable
- Verify migrations ran: `npx prisma migrate status`

**Authentication not working:**
- Check `NEXTAUTH_SECRET` is set and same across instances
- Verify `NEXTAUTH_URL` matches your domain
- Clear browser cookies if having issues
- Verify `NODE_ENV=production` is set

### 9. Production Checklist

- [ ] Always use `NODE_ENV=production` environment variable
- [ ] Generate new `NEXTAUTH_SECRET` (don't use default)
- [ ] Update `NEXTAUTH_URL` to your domain
- [ ] Configure `DATABASE_URL` to persistent storage
- [ ] Run `npm run build` once (builds 21 chunks)
- [ ] Use `start-prod.bat` or `start-prod.ps1` to start
- [ ] Test login with admin and user accounts
- [ ] Set up SSL/HTTPS on your server
- [ ] Configure environment variables on hosting platform
- [ ] Set up database backups

---

**Tech Stack:**
- Next.js 16.1.6 (Turbopack)
- React 19.2.3
- TypeScript 5
- SQLite + Prisma v6
- Tailwind CSS v4
- Custom JWT Auth

