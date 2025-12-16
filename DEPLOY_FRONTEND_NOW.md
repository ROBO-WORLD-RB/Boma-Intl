# Deploy Frontend to Vercel - 5 Minutes

Your frontend is ready to deploy!

---

## Step 1: Go to Vercel

https://vercel.com/dashboard

---

## Step 2: Create New Project

1. Click **"Add New..."** → **"Project"**
2. Click **"Import Git Repository"**
3. Search for: `ROBO-WORLD-RB/Boma-Intl`
4. Click **"Import"**

---

## Step 3: Configure Project

**Framework Preset:** Next.js

**Root Directory:** `my-streetwear-brand`

**Build Command:** `npm run build`

**Output Directory:** `.next`

(Vercel will auto-detect these settings)

---

## Step 4: Add Environment Variables

Click **"Environment Variables"** and add:

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

(We'll update this after backend is deployed)

---

## Step 5: Deploy

Click **"Deploy"** button

Wait 2-3 minutes for deployment to complete.

---

## Step 6: Get Your Frontend URL

After deployment, you'll see:
```
https://boma-2025.vercel.app
```

Copy this URL.

---

## Step 7: Update Backend URL (After Backend Deployment)

Once you deploy the backend:

1. Go to Vercel dashboard
2. Select your frontend project
3. Go to **Settings** → **Environment Variables**
4. Update `NEXT_PUBLIC_API_URL`:
   ```
   https://your-backend-url.vercel.app/api/v1
   ```
5. Click **"Save"**
6. Vercel will auto-redeploy

---

## That's It! 🎉

Your frontend is now live!

**Frontend URL:** https://boma-2025.vercel.app

---

## Next Steps

1. ✅ Deploy frontend (this step)
2. Seed Supabase with 24 products
3. Deploy backend
4. Update frontend API URL
5. Test everything

