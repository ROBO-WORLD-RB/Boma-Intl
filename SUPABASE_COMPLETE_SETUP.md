# Supabase Complete Setup Checklist

## Current Status

✅ **Done:**
- Supabase project created
- Project ID: `db.uymizxygiyyolkajxnup.supabase.co`
- Database credentials configured
- `.env.production` has connection string

⚠️ **Still Need To Do:**
- Create database schema
- Seed sample data (24 products)

---

## Step 1: Create Database Schema

### Option A: Using SQL Editor (Recommended - 2 minutes)

1. Go to https://app.supabase.com
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Click **"New Query"**
5. Copy entire content from `SUPABASE_SCHEMA.sql` file
6. Paste into the SQL editor
7. Click **"Run"** button
8. Wait for completion (should see ✅ success)

### Option B: Using Prisma (If connection works)

```bash
npx prisma db push
```

---

## Step 2: Verify Schema Created

1. In Supabase, go to **Table Editor** (left sidebar)
2. You should see these tables:
   - ✅ users
   - ✅ products
   - ✅ product_variants
   - ✅ images
   - ✅ orders
   - ✅ order_items
   - ✅ reviews
   - ✅ wishlist_items
   - ✅ newsletter_subscriptions

---

## Step 3: Seed Sample Data (24 Products)

### Option A: Using Prisma (Recommended)

```bash
npm run db:seed
```

This will create:
- 1 admin user: `admin@streetwear.com`
- 24 sample products with variants and images

### Option B: Manual SQL

If Prisma doesn't work, I can provide SQL insert statements.

---

## Step 4: Verify Data

1. In Supabase, go to **SQL Editor**
2. Run this query:
   ```sql
   SELECT COUNT(*) as product_count FROM "products";
   ```
3. Should show: `24`

4. Run this query:
   ```sql
   SELECT COUNT(*) as user_count FROM "users";
   ```
5. Should show: `1` (admin user)

---

## Step 5: Test Connection from Backend

Once schema is created, test locally:

```bash
# Make sure Docker PostgreSQL is running
docker start streetwear-db

# Run backend
npm run dev

# You should see:
# ✅ Database connected
# 🚀 Server running on port 3001
```

---

## Step 6: Deploy to Vercel

Once everything is verified:

1. Go to https://vercel.com/dashboard
2. Create new project from GitHub
3. Add environment variables (including DATABASE_URL with Supabase credentials)
4. Deploy

---

## Checklist

- [ ] Supabase project created
- [ ] SQL schema created (run SUPABASE_SCHEMA.sql)
- [ ] Tables visible in Table Editor
- [ ] Sample data seeded (24 products)
- [ ] Product count verified (SELECT COUNT)
- [ ] Admin user created
- [ ] Backend tested locally
- [ ] Backend deployed to Vercel
- [ ] Frontend updated with backend URL
- [ ] Connection tested end-to-end

---

## Your Supabase Details

**Project ID:** `db.uymizxygiyyolkajxnup.supabase.co`

**Database:** `postgres`

**User:** `postgres`

**Password:** `Jerryjusticeboma8.2`

**Connection String:**
```
postgresql://postgres:Jerryjusticeboma8.2@db.uymizxygiyyolkajxnup.supabase.co:5432/postgres?schema=public&sslmode=require
```

---

## Next Steps

1. **Right now:** Run SQL schema in Supabase SQL Editor
2. **Then:** Seed sample data with `npm run db:seed`
3. **Then:** Deploy backend to Vercel
4. **Then:** Update frontend API URL
5. **Done:** Your platform is live! 🚀

---

## Need Help?

- Supabase Docs: https://supabase.com/docs
- SQL Editor Guide: https://supabase.com/docs/guides/database/sql-editor
- Prisma Docs: https://www.prisma.io/docs/

