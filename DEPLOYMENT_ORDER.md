# Complete Deployment Order - BOMA 2025

Follow these steps in order to deploy everything successfully.

---

## 📋 Deployment Sequence

### Step 1: Deploy Frontend (5 minutes)
**File:** `DEPLOY_FRONTEND_NOW.md`

1. Go to https://vercel.com/dashboard
2. Create new project from GitHub
3. Select `my-streetwear-brand` directory
4. Add `NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1` (temporary)
5. Deploy
6. **Save your frontend URL** (e.g., `https://boma-2025.vercel.app`)

✅ **Result:** Frontend is live at your Vercel URL

---

### Step 2: Seed Supabase Database (5 minutes)
**File:** `SEED_SUPABASE_NOW.md`

1. Go to https://app.supabase.com
2. Select your project
3. SQL Editor → New Query
4. Copy entire `SUPABASE_SEED_DATA.sql`
5. Paste and Run
6. Verify: 24 products created

✅ **Result:** Database has 24 products ready

---

### Step 3: Deploy Backend (5 minutes)
**File:** `DEPLOY_NOW.md`

1. Go to https://vercel.com/dashboard
2. Create new project from GitHub
3. Select root directory (NOT `my-streetwear-brand`)
4. Add environment variables:
   ```
   DATABASE_URL=postgresql://postgres:Jerryjusticeboma8.2@db.uymizxygiyyolkajxnup.supabase.co:5432/postgres?schema=public&sslmode=require
   JWT_SECRET=your-secure-jwt-secret
   PAYSTACK_SECRET_KEY=sk_live_xxxxx
   PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   EMAIL_FROM=BOMA 2025 <noreply@boma2025.com>
   NODE_ENV=production
   PORT=3001
   APP_URL=https://yourdomain.com
   ```
5. Deploy
6. **Save your backend URL** (e.g., `https://boma-intl.vercel.app`)

✅ **Result:** Backend API is live

---

### Step 4: Update Frontend API URL (2 minutes)

1. Go to https://vercel.com/dashboard
2. Select your frontend project (`my-streetwear-brand`)
3. Settings → Environment Variables
4. Update `NEXT_PUBLIC_API_URL`:
   ```
   https://your-backend-url.vercel.app/api/v1
   ```
   (Replace with your actual backend URL from Step 3)
5. Click Save
6. Vercel auto-redeploys

✅ **Result:** Frontend now connects to backend

---

### Step 5: Test Everything (5 minutes)

1. Visit your frontend URL
2. Go to Shop page
3. Products should load from backend
4. Try adding to cart
5. Try checkout flow
6. Check DevTools → Network tab for API calls

✅ **Result:** Everything works!

---

## 🎯 Your URLs After Deployment

```
Frontend:  https://boma-2025.vercel.app
Backend:   https://boma-intl.vercel.app
API:       https://boma-intl.vercel.app/api/v1
Database:  Supabase (db.uymizxygiyyolkajxnup.supabase.co)
```

---

## ⏱️ Total Time: ~20 Minutes

- Step 1 (Frontend): 5 min
- Step 2 (Seed DB): 5 min
- Step 3 (Backend): 5 min
- Step 4 (Update URL): 2 min
- Step 5 (Test): 5 min

---

## 🚨 Important Notes

### Frontend Deployment
- Use `my-streetwear-brand` directory
- Build command: `npm run build`
- Output: `.next`

### Backend Deployment
- Use root directory (NOT `my-streetwear-brand`)
- Build command: `npm run build`
- Output: `dist`

### Database
- Supabase project ID: `db.uymizxygiyyolkajxnup.supabase.co`
- Password: `Jerryjusticeboma8.2`
- Must seed before backend deployment

### Environment Variables
- Frontend: Only `NEXT_PUBLIC_API_URL`
- Backend: All variables (see Step 3)
- Never commit secrets to GitHub

---

## ✅ Checklist

### Before Deployment
- [ ] Code pushed to GitHub
- [ ] Frontend builds successfully
- [ ] Backend builds successfully
- [ ] Supabase project created
- [ ] All documentation reviewed

### During Deployment
- [ ] Step 1: Frontend deployed
- [ ] Step 2: Database seeded
- [ ] Step 3: Backend deployed
- [ ] Step 4: Frontend API URL updated
- [ ] Step 5: Everything tested

### After Deployment
- [ ] Frontend URL working
- [ ] Backend URL working
- [ ] Products loading
- [ ] Cart working
- [ ] Checkout working
- [ ] Emails configured
- [ ] Payments configured

---

## 🎉 You're Ready!

Start with Step 1: `DEPLOY_FRONTEND_NOW.md`

