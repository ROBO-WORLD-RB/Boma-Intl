# Supabase Setup - Step by Step

## Your Supabase Project ID
```
db.uymizxygiyyolkajxnup.supabase.co
```

---

## Step 1: Get Your Database Password

1. Go to https://app.supabase.com
2. Select your project
3. Go to **Settings** → **Database**
4. Look for **Connection string** section
5. You'll see the password in the connection string, or you can reset it:
   - Click **Reset database password**
   - Copy the new password

---

## Step 2: Update Your .env File

Replace `[password]` with your actual Supabase password:

**File: `.env`**
```env
DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD_HERE]@db.uymizxygiyyolkajxnup.supabase.co:5432/postgres?schema=public&sslmode=require"
```

Example:
```env
DATABASE_URL="postgresql://postgres:MySecurePassword123@db.uymizxygiyyolkajxnup.supabase.co:5432/postgres?schema=public&sslmode=require"
```

---

## Step 3: Run Database Migrations

Once you've updated `.env` with your password:

```bash
# Push schema to Supabase
npx prisma db push

# Seed sample data
npm run db:seed
```

---

## Step 4: Verify Database

1. Go to https://app.supabase.com
2. Select your project
3. Go to **SQL Editor**
4. Run this query:
   ```sql
   SELECT COUNT(*) FROM "Product";
   ```
5. Should show 24 products (from seed)

---

## Step 5: Update .env.production

Also update `.env.production` with your password:

**File: `.env.production`**
```env
DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD_HERE]@db.uymizxygiyyolkajxnup.supabase.co:5432/postgres?schema=public&sslmode=require"
```

---

## ⚠️ Important Security Notes

- **Never commit your password to GitHub**
- `.env` and `.env.production` are in `.gitignore` for security
- When deploying to Vercel/Railway, set DATABASE_URL in their dashboard (not in git)
- Use strong passwords (Supabase generates them automatically)

---

## Next Steps

1. Update `.env` with your password
2. Run `npx prisma db push`
3. Run `npm run db:seed`
4. Verify in Supabase dashboard
5. Update `.env.production` with same password
6. Deploy to Vercel/Railway

