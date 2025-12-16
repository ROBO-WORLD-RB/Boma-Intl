# 🚀 Deploy Backend to Vercel NOW

Your backend is ready to deploy! Follow these simple steps:

---

## Step 1: Go to Vercel Dashboard

https://vercel.com/dashboard

---

## Step 2: Create New Project

1. Click **"Add New..."** → **"Project"**
2. Click **"Import Git Repository"**
3. Search for: `ROBO-WORLD-RB/Boma-Intl`
4. Click **"Import"**

---

## Step 3: Configure Project

**Framework Preset:** Other

**Root Directory:** `.` (root - NOT my-streetwear-brand)

**Build Command:** Leave empty (vercel.json handles it)

**Output Directory:** Leave empty (vercel.json handles it)

---

## Step 4: Add Environment Variables

Click **"Environment Variables"** and add these:

```
DATABASE_URL=postgresql://postgres:Jerryjusticeboma8.2@db.uymizxygiyyolkajxnup.supabase.co:5432/postgres?schema=public&sslmode=require

JWT_SECRET=your-secure-jwt-secret-here

JWT_EXPIRES_IN=7d

NODE_ENV=production

PORT=3001

APP_URL=https://yourdomain.com

PAYSTACK_SECRET_KEY=sk_live_your_key

PAYSTACK_PUBLIC_KEY=pk_live_your_key

SMTP_HOST=smtp.gmail.com

SMTP_PORT=587

SMTP_SECURE=false

SMTP_USER=your-email@gmail.com

SMTP_PASS=your-app-password

EMAIL_FROM=BOMA 2025 <noreply@boma2025.com>
```

---

## Step 5: Deploy

Click **"Deploy"** button

Wait 2-3 minutes for deployment to complete.

---

## Step 6: Get Your Backend URL

After deployment, you'll see:
```
https://boma-intl.vercel.app
```

Copy this URL.

---

## Step 7: Update Frontend

1. Go to Vercel dashboard
2. Select your frontend project (`my-streetwear-brand`)
3. Go to **Settings** → **Environment Variables**
4. Find `NEXT_PUBLIC_API_URL`
5. Update it to:
   ```
   https://boma-intl.vercel.app/api/v1
   ```
6. Click **"Save"**
7. Vercel will auto-redeploy

---

## Step 8: Test

1. Visit your frontend URL
2. Go to Shop page
3. Products should load from your backend
4. ✅ Done!

---

## That's It! 🎉

Your BOMA 2025 platform is now live:
- **Frontend**: https://your-frontend-url.vercel.app
- **Backend**: https://boma-intl.vercel.app
- **Database**: Supabase

---

## Need Help?

See `VERCEL_BACKEND_DEPLOYMENT.md` for detailed instructions.

