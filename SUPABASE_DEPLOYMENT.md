# BOMA 2025 - Supabase Deployment Guide

## 🚀 Overview

This guide covers deploying the BOMA 2025 Streetwear E-commerce Platform using:
- **Backend**: Vercel or Railway (Node.js/Express)
- **Database**: Supabase (PostgreSQL)
- **Frontend**: Vercel (Next.js)

---

## 📋 Prerequisites

- GitHub account with code pushed
- Supabase account (free tier available)
- Vercel account (for frontend)
- Paystack account (for payments)
- Gmail account (for emails)

---

## Part 1: Supabase Database Setup

### Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign in with GitHub (recommended)
4. Create new organization (or use existing)
5. Create new project:
   - **Project name**: `boma-2025`
   - **Database password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing plan**: Free tier is fine for starting

### Step 2: Get Database Connection String

1. In Supabase dashboard, go to **Settings** → **Database**
2. Under "Connection string", select **URI**
3. Copy the connection string (looks like):
   ```
   postgresql://postgres:[PASSWORD]@[PROJECT-ID].supabase.co:5432/postgres?schema=public&sslmode=require
   ```
4. Replace `[PASSWORD]` with your database password

### Step 3: Run Database Migrations

1. In your local project, update `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:[PASSWORD]@[PROJECT-ID].supabase.co:5432/postgres?schema=public&sslmode=require"
   ```

2. Run migrations:
   ```bash
   npx prisma db push
   ```

3. Seed sample data:
   ```bash
   npm run db:seed
   ```

### Step 4: Verify Database

1. In Supabase dashboard, go to **SQL Editor**
2. Run query:
   ```sql
   SELECT COUNT(*) FROM "Product";
   ```
3. Should show 24 products (from seed)

---

## Part 2: Backend Deployment

### Option A: Deploy to Vercel (Recommended for Serverless)

#### Step 1: Prepare Backend for Vercel

1. Create `vercel.json` in root:
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
     ],
     "env": {
       "NODE_ENV": "production"
     }
   }
   ```

2. Update `package.json` scripts:
   ```json
   {
     "scripts": {
       "build": "tsc",
       "start": "node dist/src/server.js",
       "dev": "ts-node src/server.ts"
     }
   }
   ```

#### Step 2: Deploy to Vercel

1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Select root directory (not `my-streetwear-brand`)
5. Add environment variables:
   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@[PROJECT-ID].supabase.co:5432/postgres?schema=public&sslmode=require
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
6. Click "Deploy"
7. Get your backend URL (e.g., `https://boma-api.vercel.app`)

### Option B: Deploy to Railway

#### Step 1: Connect to Railway

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Connect your GitHub account
5. Select your repository
6. Select root directory

#### Step 2: Add Environment Variables

1. In Railway dashboard, go to **Variables**
2. Add all variables:
   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@[PROJECT-ID].supabase.co:5432/postgres?schema=public&sslmode=require
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

#### Step 3: Deploy

1. Railway automatically deploys on push
2. Get your backend URL from Railway dashboard

---

## Part 3: Frontend Deployment

### Step 1: Deploy to Vercel

1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Select `my-streetwear-brand` directory
5. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url/api/v1
   ```
   (Replace with your actual backend URL from Part 2)
6. Click "Deploy"
7. Get your frontend URL (e.g., `https://boma-2025.vercel.app`)

---

## Part 4: Connect Frontend to Backend

### Update Frontend Environment

1. In Vercel dashboard, go to **Settings** → **Environment Variables**
2. Update `NEXT_PUBLIC_API_URL`:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url/api/v1
   ```
3. Redeploy frontend

### Test Connection

1. Visit your frontend URL
2. Open browser DevTools → Network tab
3. Navigate to shop page
4. Should see API calls to your backend
5. Products should load

---

## Part 5: Configure Custom Domain

### Step 1: Purchase Domain

- Namecheap, GoDaddy, Google Domains, etc.

### Step 2: Configure DNS

**For Vercel Frontend:**
1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add your domain
3. Vercel shows DNS records to add
4. Add records to your domain registrar
5. Wait for DNS propagation (5-30 minutes)

**For Backend (if using custom domain):**
1. Add CNAME record pointing to your backend URL
2. Example: `api.yourdomain.com` → `your-backend-url`

### Step 3: Enable SSL

- Vercel: Automatic (free)
- Railway: Automatic (free)
- Supabase: Automatic (free)

---

## Part 6: Paystack Webhook Configuration

### Step 1: Get Backend URL

From Part 2, you have your backend URL (e.g., `https://boma-api.vercel.app`)

### Step 2: Configure Webhook in Paystack

1. Go to https://dashboard.paystack.com
2. Settings → API Keys & Webhooks
3. Add webhook URL:
   ```
   https://your-backend-url/api/v1/webhooks/paystack
   ```
4. Select events:
   - `charge.success`
   - `charge.failed`
5. Save

### Step 3: Test Webhook

1. In Paystack dashboard, go to Webhooks
2. Click "Send test event"
3. Check backend logs for webhook receipt

---

## Part 7: Email Configuration

### Using Gmail (Recommended)

1. Enable 2-Factor Authentication on Gmail
2. Generate App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Copy generated password
3. Add to environment variables:
   ```
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

### Using SendGrid

1. Create SendGrid account: https://sendgrid.com
2. Create API key
3. Add to environment variables:
   ```
   SMTP_HOST=smtp.sendgrid.net
   SMTP_USER=apikey
   SMTP_PASS=SG.xxxxxxxxxxxxx
   ```

---

## Part 8: Monitoring & Maintenance

### Monitor Backend

**Vercel:**
- Dashboard: https://vercel.com/dashboard
- Logs: Click project → "Deployments" → "Logs"

**Railway:**
- Dashboard: https://railway.app/dashboard
- Logs: Click project → "Logs"

### Monitor Database

**Supabase:**
- Dashboard: https://app.supabase.com
- Query editor: SQL Editor
- Backups: Settings → Backups

### Monitor Frontend

**Vercel:**
- Analytics: Dashboard → Analytics
- Performance: Dashboard → Performance

---

## Part 9: Backup & Recovery

### Supabase Backups

1. Go to Supabase dashboard
2. Settings → Backups
3. Automatic backups enabled (free tier: 7 days)
4. Manual backup: Click "Create backup"

### Database Export

```bash
# Export database
pg_dump "postgresql://postgres:[PASSWORD]@[PROJECT-ID].supabase.co:5432/postgres" > backup.sql

# Restore database
psql "postgresql://postgres:[PASSWORD]@[PROJECT-ID].supabase.co:5432/postgres" < backup.sql
```

---

## Part 10: Troubleshooting

### "Database connection failed"
- Verify DATABASE_URL is correct
- Check Supabase project is active
- Verify IP whitelist (Supabase allows all by default)

### "API calls failing"
- Check NEXT_PUBLIC_API_URL is correct
- Verify backend is deployed and running
- Check CORS settings in backend

### "Emails not sending"
- Verify SMTP credentials
- Check Gmail app password is correct
- Verify email address is correct

### "Paystack webhook not received"
- Verify webhook URL is correct
- Check backend logs for errors
- Test webhook from Paystack dashboard

---

## ✅ Deployment Checklist

### Supabase Setup
- [ ] Supabase project created
- [ ] Database connection string obtained
- [ ] Migrations run (`npx prisma db push`)
- [ ] Sample data seeded (`npm run db:seed`)
- [ ] Database verified in Supabase dashboard

### Backend Deployment
- [ ] Backend code pushed to GitHub
- [ ] Vercel/Railway project created
- [ ] All environment variables added
- [ ] Backend deployed successfully
- [ ] Backend URL obtained

### Frontend Deployment
- [ ] Frontend code pushed to GitHub
- [ ] Vercel project created
- [ ] NEXT_PUBLIC_API_URL configured
- [ ] Frontend deployed successfully
- [ ] Frontend URL obtained

### Integration
- [ ] Frontend connects to backend
- [ ] Products load on shop page
- [ ] Cart functionality works
- [ ] Checkout works
- [ ] Paystack payments work

### Domain & SSL
- [ ] Custom domain purchased
- [ ] DNS records configured
- [ ] SSL certificate active
- [ ] HTTPS working

### Monitoring
- [ ] Backend logs accessible
- [ ] Database backups enabled
- [ ] Paystack webhook configured
- [ ] Email sending works

---

## 🎉 You're Live!

Your BOMA 2025 Streetwear E-commerce Platform is now deployed on:
- **Frontend**: https://yourdomain.com (Vercel)
- **Backend**: https://api.yourdomain.com (Vercel/Railway)
- **Database**: Supabase PostgreSQL

**Next Steps:**
1. Monitor performance
2. Set up analytics
3. Configure email notifications
4. Plan marketing launch
5. Scale as needed

---

## 📞 Support

- Supabase Docs: https://supabase.com/docs
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Paystack Docs: https://paystack.com/docs

