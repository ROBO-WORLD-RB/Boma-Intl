# Seed Supabase with 24 Products - 2 Minutes

Your database schema is created. Now add the sample data:

## Step 1: Open Supabase SQL Editor

1. Go to https://app.supabase.com
2. Select your project
3. Click **SQL Editor** (left sidebar)
4. Click **"New Query"**

## Step 2: Copy SQL

Open `SUPABASE_SEED_DATA.sql` from your repo and copy the entire content.

## Step 3: Paste & Run

1. Paste the SQL into the editor
2. Click **"Run"** button
3. Wait for completion

You should see:
```
total_products: 24
total_variants: 48
total_images: 24
```

## Step 4: Verify

Go to **Table Editor** and check:
- ✅ 24 products in "products" table
- ✅ 48 variants in "product_variants" table
- ✅ 24 images in "images" table

## Done! 🎉

Your Supabase database is now fully seeded and ready for deployment.

Next: Deploy backend to Vercel (see `DEPLOY_NOW.md`)

