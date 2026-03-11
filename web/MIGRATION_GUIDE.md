# Migration Guide: SQLite to PostgreSQL

## 🔄 For Existing Local Development

If you were previously using SQLite locally and want to switch to PostgreSQL:

### Option 1: Use Vercel Postgres for Development (Recommended)

1. **Create a development database** in Vercel (separate from production)
2. **Get connection strings** from Vercel dashboard
3. **Update your `.env.local`:**
   ```env
   DATABASE_URL="postgres://..."  # From Vercel Postgres
   DIRECT_URL="postgres://..."     # From Vercel Postgres
   NEXTAUTH_SECRET="your-secret"
   NEXTAUTH_URL="http://localhost:3001"
   ```

### Option 2: Use Local PostgreSQL

1. **Install PostgreSQL:**
   - Windows: Download from https://www.postgresql.org/download/windows/
   - Mac: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql`

2. **Create database:**
   ```bash
   # Start PostgreSQL
   # Windows: Use pgAdmin or Services
   # Mac/Linux: 
   brew services start postgresql  # Mac
   sudo service postgresql start   # Linux

   # Create database
   createdb cardinalspace
   ```

3. **Update `.env.local`:**
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/cardinalspace"
   DIRECT_URL="postgresql://postgres:password@localhost:5432/cardinalspace"
   NEXTAUTH_SECRET="your-secret"
   NEXTAUTH_URL="http://localhost:3001"
   ```

### Run Migrations

```bash
# Delete old SQLite migrations (they won't work with PostgreSQL)
rm -rf prisma/migrations

# Create initial migration for PostgreSQL
npx prisma migrate dev --name init

# Seed the database
npm run seed
```

---

## 📊 Migrating Existing Data (If You Have Important Data)

If you have existing data in SQLite that you need to migrate:

### Manual Export/Import

1. **Export from SQLite:**
   ```bash
   # Install sqlite3 if needed
   npm install -g sqlite3

   # Export users table
   sqlite3 dev.db "SELECT * FROM User;" > users.csv
   ```

2. **Import to PostgreSQL:**
   - Use a tool like pgAdmin or DBeaver
   - Import CSV files into PostgreSQL tables
   - Or write a migration script

### Using Prisma Studio

1. **Open old SQLite database:**
   ```bash
   DATABASE_URL="file:./dev.db" npx prisma studio
   ```

2. **Copy data manually** (for small datasets)

3. **Open new PostgreSQL database:**
   ```bash
   npx prisma studio
   ```

4. **Paste data** into new database

---

## ⚠️ Important Changes

### Schema Differences

PostgreSQL is more strict than SQLite. Key differences:

1. **Case Sensitivity:** PostgreSQL is case-sensitive for table/column names
2. **Data Types:** Some SQLite types map differently
3. **Constraints:** PostgreSQL enforces foreign keys strictly

### Code Changes (Already Done)

✅ Updated `prisma/schema.prisma` to use PostgreSQL
✅ Updated `package.json` build scripts
✅ Created `vercel.json` configuration
✅ Updated `.env.example`

---

## 🧪 Testing Locally

After migration:

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database
npm run seed

# Start dev server
npm run dev
```

Test:
- Login with admin@example.com / CardinalAdmin2024!
- Login with user@example.com / CardinalUser2024!
- Create a reservation
- Check all pages work

---

## 🔙 Rollback (If Needed)

If you need to go back to SQLite:

1. **Restore `prisma/schema.prisma`:**
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

2. **Restore `.env.local`:**
   ```env
   DATABASE_URL="file:./dev.db"
   ```

3. **Restore `package.json` build script:**
   ```json
   "build": "prisma migrate deploy && prisma db seed && next build"
   ```

4. **Delete `vercel.json`**

5. **Run migrations:**
   ```bash
   npx prisma migrate dev
   ```

---

## 📝 Notes

- Keep your old `dev.db` file as backup
- PostgreSQL requires a running database server (unlike SQLite)
- Connection pooling is handled automatically by Prisma
- Vercel Postgres free tier is generous for development/testing
