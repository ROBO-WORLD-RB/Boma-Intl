# Deploy Backend to Vercel

## 🚀 Quick Start (5 minutes)

### Step 1: Push Code to GitHub

```bash
git add .
git commit -m "Prepare backend for Vercel deployment"
git push origin main
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Select **"Import Git Repository"**
4. Find and select your **Boma-Intl** repository
5. Click **"Import"**

### Step 3: Configure Project

**Root Directory:** Leave as default (root of repo)

**Build Command:** `npm run build`

**Start Command:** `npm start`

**Output Directory:** `dist`

### Step 4: Add Environment Variables

Click **"Environment Variables"** and add:

```
DATABASE_URL=postgresql://postgres:Jerryjusticeboma8.2@db.uymizxygiyyolkajxnup.supabase.co:5432/postgres?schema=public&sslmode=require
JWT_SECRET=your-secure-jwt-secret-here
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=3001
APP_URL=https://yourdomain.com
PAYSTACK_SECRET_KEY=sk_live_xxxxx
PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=BOMA 2025 <noreply@boma2025.com>
```

### Step 5: Deploy

Click **"Deploy"** and wait for deployment to complete.

---

## 📋 Detailed Setup

### Prerequisites

- ✅ Code pushed to GitHub
- ✅ Supabase database ready (or use local Docker)
- ✅ Vercel account created

### Environment Variables Explained

| Variable | Value | Where to Get |
|----------|-------|--------------|
| `DATABASE_URL` | Your Supabase connection string | Supabase dashboard → Settings → Database |
| `JWT_SECRET` | Secure random string (64+ chars) | Generate: `openssl rand -base64 64` |
| `PAYSTACK_SECRET_KEY` | Your Paystack live key | Paystack dashboard → Settings → API Keys |
| `PAYSTACK_PUBLIC_KEY` | Your Paystack live key | Paystack dashboard → Settings → API Keys |
| `SMTP_USER` | Your Gmail address | your-email@gmail.com |
| `SMTP_PASS` | Gmail app password | Gmail → App passwords |

---

## 🔧 Vercel Configuration Files

### vercel.json (Already Created)

This file tells Vercel how to build and run your backend:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.ts"
    }
  ]
}
```

### package.json Scripts (Already Configured)

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "dev": "nodemon --exec ts-node src/server.ts"
  }
}
```

---

## 📊 Deployment Steps

### Step 1: Prepare Repository

```bash
# Make sure everything is committed
git status

# Should show: "nothing to commit, working tree clean"
```

### Step 2: Go to Vercel Dashboard

1. Visit https://vercel.com/dashboard
2. Click **"Add New..."**
3. Select **"Project"**

### Step 3: Import Repository

1. Click **"Import Git Repository"**
2. Search for **"Boma-Intl"**
3. Click **"Import"**

### Step 4: Configure Build Settings

**Project Name:** `boma-api` (or your choice)

**Framework Preset:** `Other`

**Root Directory:** `.` (default)

**Build Command:** `npm run build`

**Output Directory:** `dist`

**Install Command:** `npm install`

### Step 5: Add Environment Variables

1. Click **"Environment Variables"**
2. Add each variable from the list above
3. Make sure to use your actual values (not placeholders)

### Step 6: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (usually 2-3 minutes)
3. You'll get a URL like: `https://boma-api.vercel.app`

---

## ✅ After Deployment

### Verify Backend is Running

```bash
# Test API endpoint
curl https://boma-api.vercel.app/api/v1/products?page=1&limit=12

# Should return JSON with products
```

### Get Your Backend URL

Your backend URL will be shown in Vercel dashboard:
- Example: `https://boma-api.vercel.app`

### Update Frontend

1. Go to your frontend Vercel project
2. Settings → Environment Variables
3. Update `NEXT_PUBLIC_API_URL`:
   ```
   NEXT_PUBLIC_API_URL=https://boma-api.vercel.app/api/v1
   ```
4. Redeploy frontend

---

## 🔗 Connect Frontend to Backend

### In Frontend Vercel Project

1. Go to https://vercel.com/dashboard
2. Select your frontend project (`my-streetwear-brand`)
3. Go to **Settings** → **Environment Variables**
4. Update `NEXT_PUBLIC_API_URL`:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url/api/v1
   ```
5. Click **"Redeploy"** to apply changes

### Test Connection

1. Visit your frontend URL
2. Go to Shop page
3. Open DevTools → Network tab
4. Should see API calls to your backend
5. Products should load

---

## 🚨 Troubleshooting

### Build Failed

**Error:** `Command "npm run build" exited with 1`

**Solution:**
1. Check TypeScript errors: `npm run typecheck`
2. Fix any errors locally
3. Push to GitHub
4. Redeploy from Vercel

### Database Connection Failed

**Error:** `Can't reach database server`

**Solution:**
1. Verify DATABASE_URL is correct in Vercel
2. Check Supabase project is active
3. Try resetting Supabase password
4. Redeploy

### API Returns 500 Error

**Solution:**
1. Check Vercel logs: Click deployment → Logs
2. Look for error messages
3. Fix locally and redeploy

### Frontend Can't Connect to Backend

**Error:** CORS error or API calls fail

**Solution:**
1. Verify `NEXT_PUBLIC_API_URL` is correct in frontend
2. Check backend CORS settings in `src/app.ts`
3. Redeploy frontend

---

## 📈 Monitor Your Backend

### View Logs

1. Go to Vercel dashboard
2. Select your backend project
3. Click **"Deployments"**
4. Click latest deployment
5. Click **"Logs"** tab

### View Metrics

1. Go to project dashboard
2. Click **"Analytics"** tab
3. See requests, response times, errors

### Set Up Alerts

1. Go to **Settings** → **Alerts**
2. Configure notifications for failures

---

## 🔄 Redeploy

### Automatic Redeploy (On Push)

Every time you push to GitHub, Vercel automatically redeploys.

### Manual Redeploy

1. Go to Vercel dashboard
2. Select your project
3. Click **"Deployments"**
4. Click **"..."** on latest deployment
5. Click **"Redeploy"**

---

## 🎉 You're Live!

Your backend is now deployed to Vercel and connected to Supabase.

**Your Backend URL:** `https://boma-api.vercel.app` (or your custom domain)

**Next Steps:**
1. ✅ Update frontend with backend URL
2. ✅ Test API endpoints
3. ✅ Configure custom domain (optional)
4. ✅ Set up monitoring

---

## 📞 Support

- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- Check logs for detailed error messages

