# 🚀 Quick Start - Deploy to Vercel in 10 Minutes

## What Changed?

Your CardinalSpace app has been **migrated from SQLite to PostgreSQL** and is now **ready for Vercel deployment**.

### Files Modified:
- ✅ `prisma/schema.prisma` - Now uses PostgreSQL
- ✅ `package.json` - Updated build scripts for Vercel
- ✅ `.env.example` - Updated with PostgreSQL connection strings
- ✅ `src/lib/prisma.ts` - Added connection pooling for performance
- ✅ `README.md` - Updated documentation

### Files Created:
- ✅ `vercel.json` - Vercel configuration
- ✅ `VERCEL_DEPLOYMENT.md` - Complete deployment guide
- ✅ `MIGRATION_GUIDE.md` - Migration instructions
- ✅ `QUICK_START.md` - This file!

---

## 🎯 Deploy Now (10 Minutes)

### Step 1: Push to GitHub (2 min)
```bash
cd web
git add .
git commit -m "Migrate to PostgreSQL for Vercel deployment"
git push origin main
```

### Step 2: Create Vercel Account (1 min)
- Go to https://vercel.com/signup
- Sign up with GitHub (free)

### Step 3: Create Database (2 min)
1. Go to https://vercel.com/dashboard
2. Click **Storage** → **Create Database** → **Postgres**
3. Name it: `cardinalspace-db`
4. Click **Create**

### Step 4: Deploy App (3 min)
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. **Root Directory:** `web`
4. Click **Deploy**

### Step 5: Add Environment Variables (2 min)
1. Go to your project → **Settings** → **Environment Variables**
2. Add these 4 variables:

   **DATABASE_URL:**
   - Go to Storage → cardinalspace-db → `.env.local` tab
   - Copy `POSTGRES_PRISMA_URL` value
   
   **DIRECT_URL:**
   - Copy `POSTGRES_URL_NON_POOLING` value
   
   **NEXTAUTH_SECRET:**
   - Generate: https://generate-secret.vercel.app/32
   
   **NEXTAUTH_URL:**
   - Your Vercel URL (e.g., `https://your-app.vercel.app`)

3. Click **Save**
4. **Redeploy** (Deployments → Click ⋯ → Redeploy)

### Step 6: Run Migrations (2 min)
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
cd web
vercel link

# Pull environment variables
vercel env pull .env.local

# Run migrations
npx prisma migrate deploy

# Seed database
npm run seed
```

---

## ✅ Done! Test Your App

Visit your Vercel URL and login:
- **Admin:** admin@example.com / CardinalAdmin2024!
- **User:** user@example.com / CardinalUser2024!

---

## 📚 Need More Details?

- **Full deployment guide:** See `VERCEL_DEPLOYMENT.md`
- **Migration help:** See `MIGRATION_GUIDE.md`
- **Troubleshooting:** Check deployment logs in Vercel dashboard

---

## 🎉 What You Get (Free Tier)

- **Vercel Hosting:** 100 GB bandwidth/month
- **PostgreSQL Database:** 256 MB storage, 60 hours compute/month
- **Automatic HTTPS**
- **Auto-deploy on git push**
- **Global CDN**
- **Zero configuration**

---

## ⚡ Performance Optimizations Applied

✅ Connection pooling configured
✅ Prisma query logging (dev only)
✅ Serverless-optimized build
✅ PostgreSQL connection pooling via Vercel
✅ Efficient middleware
✅ No file system dependencies

**Your app is production-ready with minimal lag/jitter!**
