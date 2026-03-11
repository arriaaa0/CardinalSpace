# Vercel Deployment Guide - Cardinal Space

## 🚀 Quick Deploy to Vercel

### Prerequisites
- GitHub account
- Vercel account (free tier)
- Your code pushed to a GitHub repository

---

## Step 1: Set Up Vercel Postgres Database

1. **Go to Vercel Dashboard** → https://vercel.com/dashboard
2. **Click "Storage"** tab
3. **Click "Create Database"** → Select **"Postgres"**
4. **Choose a name:** `cardinalspace-db` (or any name you prefer)
5. **Select region:** Choose closest to your users
6. **Click "Create"**

✅ **Free Tier Limits:**
- 256 MB storage
- 60 hours compute/month
- 256 MB data transfer/month
- Perfect for small to medium apps!

---

## Step 2: Connect Your GitHub Repository

1. **Go to Vercel Dashboard** → https://vercel.com/new
2. **Import your GitHub repository** (CardinalSpace)
3. **Configure Project:**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./web` (if your Next.js app is in the web folder)
   - Build Command: Leave default or use `npm run vercel-build`
   - Output Directory: Leave default (`.next`)

---

## Step 3: Configure Environment Variables

In the Vercel project settings, add these environment variables:

### Required Variables:

1. **DATABASE_URL** (from Vercel Postgres)
   - Go to Storage → Your Database → `.env.local` tab
   - Copy the `POSTGRES_PRISMA_URL` value
   - Add as `DATABASE_URL` in Vercel project settings

2. **DIRECT_URL** (from Vercel Postgres)
   - Copy the `POSTGRES_URL_NON_POOLING` value
   - Add as `DIRECT_URL` in Vercel project settings

3. **NEXTAUTH_SECRET**
   - Generate a secure random string:
     ```bash
     openssl rand -base64 32
     ```
   - Or use: https://generate-secret.vercel.app/32
   - Add to Vercel environment variables

4. **NEXTAUTH_URL**
   - For production: `https://your-app-name.vercel.app`
   - Vercel will auto-assign a URL, update this after first deploy
   - You can also use a custom domain

---

## Step 4: Deploy

1. **Click "Deploy"** in Vercel dashboard
2. Wait for build to complete (~2-3 minutes)
3. **First deployment will succeed** but database will be empty

---

## Step 5: Run Database Migrations

After first successful deployment:

### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
cd web
vercel link

# Pull environment variables
vercel env pull .env.local

# Run migrations locally against production database
npx prisma migrate deploy

# Seed the database
npm run seed
```

### Option B: Using Vercel Dashboard

1. Go to your project → **Settings** → **Functions**
2. Add a temporary API route to run migrations:
   - Create `src/app/api/migrate/route.ts`:
   ```typescript
   import { NextResponse } from 'next/server'
   import { exec } from 'child_process'
   import { promisify } from 'util'

   const execAsync = promisify(exec)

   export async function GET(request: Request) {
     // Add authentication check here!
     const authHeader = request.headers.get('authorization')
     if (authHeader !== 'Bearer YOUR_SECRET_TOKEN') {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
     }

     try {
       await execAsync('npx prisma migrate deploy')
       return NextResponse.json({ success: true })
     } catch (error) {
       return NextResponse.json({ error: String(error) }, { status: 500 })
     }
   }
   ```
3. Visit: `https://your-app.vercel.app/api/migrate` with auth header
4. **Delete this route after migration!**

---

## Step 6: Seed Initial Data

Run the seed script to create admin and test users:

```bash
# Using Vercel CLI (with production database)
vercel env pull .env.local
npm run seed
```

**Default Credentials:**
- Admin: `admin@example.com` / `CardinalAdmin2024!`
- User: `user@example.com` / `CardinalUser2024!`

---

## Step 7: Update NEXTAUTH_URL

1. After deployment, Vercel assigns a URL like `https://cardinalspace.vercel.app`
2. Go to **Settings** → **Environment Variables**
3. Update `NEXTAUTH_URL` to your actual deployment URL
4. **Redeploy** for changes to take effect

---

## 🎯 Post-Deployment Checklist

- [ ] Database created and connected
- [ ] All environment variables set
- [ ] Migrations deployed successfully
- [ ] Database seeded with initial users
- [ ] `NEXTAUTH_URL` updated to production URL
- [ ] Test login with admin credentials
- [ ] Test login with user credentials
- [ ] Test creating a reservation
- [ ] Check all pages load correctly

---

## 🔧 Troubleshooting

### Build Fails with Prisma Error
**Solution:** Ensure `DATABASE_URL` and `DIRECT_URL` are set in Vercel environment variables

### "Invalid token" or Authentication Issues
**Solution:** 
- Verify `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL` matches your deployment URL
- Clear browser cookies and try again

### Database Connection Errors
**Solution:**
- Check Vercel Postgres is active
- Verify connection strings are correct
- Ensure you're using `POSTGRES_PRISMA_URL` for `DATABASE_URL`
- Ensure you're using `POSTGRES_URL_NON_POOLING` for `DIRECT_URL`

### Cold Starts / Slow First Request
**Normal behavior** on free tier - first request after inactivity takes 2-3 seconds

### "Table does not exist" Error
**Solution:** Run migrations using Vercel CLI:
```bash
vercel env pull .env.local
npx prisma migrate deploy
```

---

## 🌐 Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` environment variable
5. Redeploy

---

## 📊 Monitoring & Logs

- **View Logs:** Project → Deployments → Click deployment → Runtime Logs
- **Database Metrics:** Storage → Your Database → Metrics
- **Function Analytics:** Project → Analytics

---

## 🔄 Continuous Deployment

Every push to your main branch will automatically:
1. Trigger a new build
2. Run `prisma generate`
3. Run `prisma migrate deploy`
4. Deploy new version

**Note:** Migrations run automatically, but seeding does not. Seed manually when needed.

---

## 💰 Cost Optimization

**Free Tier Limits:**
- Vercel: 100 GB bandwidth, 100 deployments/day
- Postgres: 256 MB storage, 60 hours compute/month

**Tips to stay within limits:**
- Use connection pooling (already configured)
- Optimize images with Next.js Image component
- Enable caching headers
- Monitor usage in Vercel dashboard

---

## 🚨 Important Notes

1. **Never commit `.env` files** - they're gitignored
2. **Rotate `NEXTAUTH_SECRET`** if exposed
3. **Backup database** regularly (Vercel provides automatic backups)
4. **Monitor usage** to avoid hitting free tier limits
5. **Use Prisma Studio** for database management:
   ```bash
   vercel env pull .env.local
   npx prisma studio
   ```

---

## 📚 Additional Resources

- [Vercel Postgres Docs](https://vercel.com/docs/storage/vercel-postgres)
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Prisma with Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)

---

**Need Help?** Check Vercel deployment logs or Prisma migration status for detailed error messages.
