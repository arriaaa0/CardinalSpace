# 🔐 Team Login Credentials - CardinalSpace

## Default Test Accounts

### Admin Account
- **Email:** `admin@example.com`
- **Password:** `CardinalAdmin2024!`
- **Access:** `/admin/login`
- **Permissions:** Full admin access, manage permits, violations, users

### User Account
- **Email:** `user@example.com`
- **Password:** `CardinalUser2024!`
- **Access:** `/portal/login`
- **Permissions:** Make reservations, view parking map, manage profile

---

## 🚨 Important Notes

### Why These Passwords?

The previous passwords (`admin123`, `user123`) were flagged by browsers as **"compromised in data breaches"** because they're commonly used weak passwords. 

The new passwords:
- ✅ Are unique and not in breach databases
- ✅ Meet security requirements (uppercase, lowercase, numbers, special chars)
- ✅ Won't trigger browser security warnings
- ✅ Are still easy to share with your team

### For Production Use

**⚠️ IMPORTANT:** These are **test credentials only**. Before going live:

1. **Delete or disable these accounts**
2. **Create new admin accounts** with unique emails
3. **Use strong, unique passwords** (generated with password manager)
4. **Enable 2FA** if you add that feature later

---

## 🔄 Resetting Passwords

If you need to reset or change these passwords:

### Option 1: Update Seed File

1. Edit `prisma/seed.ts`
2. Change the password strings:
   ```typescript
   const hashedPassword = await bcrypt.hash('YourNewPassword123!', 12)
   ```
3. Delete existing users from database
4. Run: `npm run seed`

### Option 2: Direct Database Update

```bash
# Open Prisma Studio
npx prisma studio

# Navigate to User table
# Find the user by email
# Delete the user
# Re-run seed: npm run seed
```

### Option 3: Use Signup API (for new users)

```bash
POST /api/auth/signup
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "SecurePassword123!",
  "name": "New User Name"
}
```

---

## 📋 Quick Copy-Paste

**For Slack/Teams/Email:**

```
CardinalSpace Login Info:

Admin Access:
Email: admin@example.com
Password: CardinalAdmin2024!
URL: https://your-app.vercel.app/admin/login

User Access:
Email: user@example.com
Password: CardinalUser2024!
URL: https://your-app.vercel.app/portal/login
```

---

## 🔒 Security Best Practices

1. **Don't commit passwords** - Never put passwords in git commits
2. **Use environment variables** - Store secrets in `.env.local` (gitignored)
3. **Rotate regularly** - Change passwords periodically
4. **Limit access** - Only share credentials with team members who need them
5. **Monitor logins** - Check for suspicious activity
6. **Use HTTPS only** - Never send passwords over HTTP

---

## 🆘 Troubleshooting Login Issues

### "Password was in a breach" warning
✅ **Fixed!** The new passwords won't trigger this warning.

### "Invalid credentials" error
- Check you're using the correct email/password combination
- Verify database was seeded: `npm run seed`
- Check browser console for errors

### Can't access admin pages
- Verify you're using `admin@example.com` (has ADMIN role)
- Check the URL is `/admin/login` not `/portal/login`

### Session expires immediately
- Verify `NEXTAUTH_SECRET` is set in environment variables
- Check `NEXTAUTH_URL` matches your deployment URL
- Clear browser cookies and try again

---

**Last Updated:** After PostgreSQL migration
**Seed File:** `prisma/seed.ts`
