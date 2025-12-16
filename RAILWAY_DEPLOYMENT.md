# BOMA 2025 - Railway Deployment Guide

⚠️ **NOTE**: We've switched to **Supabase** for the database. See `SUPABASE_DEPLOYMENT.md` for the updated deployment guide.

This guide is kept for reference if you want to use Railway for the backend service.

---

## 🚀 Your Railway Setup

**Database Connection String (Legacy - Use Supabase instead):**
```
postgresql://postgres:dCkegaZCuHGKRlDWQoNdiTyQhEGYtUTo@yamanote.proxy.rlwy.net:28658/railway?schema=public&sslmode=require
```

---

## 📋 Step 1: Prepare Your Code

### 1.1 Update Environment Variables

**In `.env.production` (already created):**
```env
DATABASE_URL="postgresql://postgres:dCkegaZCuHGKRlDWQoNdiTyQhEGYtUTo@yamanote.proxy.rlwy.net:28658/railway?schema=public&sslmode=require"
JWT_SECRET="generate-a-secure-64-char-random-string"
NODE_ENV=production
PORT=3001
APP_URL="https://yourdomain.com"
PAYSTACK_SECRET_KEY="sk_live_xxxxx"
PAYSTACK_PUBLIC_KEY="pk_live_xxxxx"
```

### 1.2 Generate Secure JWT Secret

```bash
# Windows (PowerShell)
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString() + (New-Guid).ToString() + (New-Guid).ToString())) | Out-String

# Mac/Linux
openssl rand -base64 64
```

Copy the generated secret and update `.env.production`:
```env
JWT_SECRET="your-generated-64-char-secret"
```

---

## 🔧 Step 2: Deploy Backend to Railway

### 2.1 Push Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - BOMA 2025 streetwear API"

# Add remote (replace with your GitHub repo)
git remote add origin https://github.com/yourusername/boma-streetwear-api.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 2.2 Connect to Railway

1. Go to https://railway.app
2. Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Select your `boma-streetwear-api` repository
6. Railway automatically detects it's a Node.js project

### 2.3 Add Environment Variables to Railway

1. In Railway dashboard, go to your project
2. Click on the service (your repo)
3. Go to "Variables" tab
4. Add each variable from `.env.production`:

```
DATABASE_URL=postgresql://postgres:dCkegaZCuHGKRlDWQoNdiTyQhEGYtUTo@yamanote.proxy.rlwy.net:28658/railway?schema=public&sslmode=require
JWT_SECRET=your-generated-secret
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=production
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

### 2.4 Deploy

1. Railway automatically deploys when you push to GitHub
2. Monitor deployment in Railway dashboard
3. Once deployed, you'll get a URL like: `https://streetwear-api-production.up.railway.app`

### 2.5 Run Database Migrations

After first deployment:

```bash
# SSH into Railway container
railway shell

# Run migrations
npx prisma migrate deploy

# Seed database (optional)
npm run db:seed

# Exit
exit
```

---

## 🎨 Step 3: Deploy Frontend to Vercel

### 3.1 Push Frontend Code to GitHub

```bash
cd my-streetwear-brand

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - BOMA 2025 frontend"

# Add remote
git remote add origin https://github.com/yourusername/boma-streetwear-frontend.git

# Push
git branch -M main
git push -u origin main
```

### 3.2 Deploy to Vercel

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New..." → "Project"
4. Select your `boma-streetwear-frontend` repository
5. Vercel auto-detects Next.js project
6. Click "Deploy"

### 3.3 Add Environment Variables to Vercel

1. In Vercel dashboard, go to your project
2. Go to "Settings" → "Environment Variables"
3. Add:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-backend-url/api/v1
   ```
   
   Replace with your actual Railway URL (e.g., `https://streetwear-api-production.up.railway.app/api/v1`)

4. Redeploy to apply changes

---

## 🌐 Step 4: Configure Custom Domain

### 4.1 Purchase Domain

- Go to Namecheap, GoDaddy, or Google Domains
- Purchase your domain (e.g., `bomaintl.com`)

### 4.2 Configure DNS

**For Vercel (Frontend):**
1. In Vercel dashboard, go to "Settings" → "Domains"
2. Add your domain
3. Vercel provides DNS records to add
4. Add records to your domain registrar

**For Railway (Backend):**
1. In Railway dashboard, go to "Settings" → "Domains"
2. Add subdomain (e.g., `api.bomaintl.com`)
3. Railway provides DNS records
4. Add records to your domain registrar

### 4.3 SSL Certificate

- Vercel: Automatic SSL (Let's Encrypt)
- Railway: Automatic SSL (Let's Encrypt)

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed to Railway
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set in Railway
- [ ] Environment variables set in Vercel
- [ ] Database migrations run
- [ ] Database seeded with products
- [ ] Backend URL working (test API endpoint)
- [ ] Frontend connects to backend
- [ ] Domain configured
- [ ] SSL certificates active
- [ ] Paystack LIVE keys configured
- [ ] Email configured
- [ ] Admin user created

---

## 🧪 Testing Production

### Test Backend API

```bash
# Replace with your Railway URL
curl https://your-railway-url/api/v1/products?page=1&limit=12
```

### Test Frontend

1. Visit your Vercel domain
2. Test user registration
3. Test product browsing
4. Test checkout flow
5. Test payment (use Paystack test card if needed)

---

## 📊 Monitoring

### Railway Dashboard
- Monitor CPU/Memory usage
- View logs
- Check deployment status

### Vercel Dashboard
- Monitor build status
- View analytics
- Check error logs

---

## 🆘 Troubleshooting

### Backend won't start
- Check environment variables in Railway
- Check logs: `railway logs`
- Verify DATABASE_URL is correct

### Frontend can't connect to backend
- Check NEXT_PUBLIC_API_URL in Vercel
- Verify backend is running
- Check CORS settings in backend

### Database connection failed
- Verify DATABASE_URL includes `?sslmode=require`
- Check Railway PostgreSQL is running
- Verify credentials are correct

### Emails not sending
- Verify SMTP credentials
- Check Gmail app password is correct
- Enable "Less secure app access" if using Gmail

---

## 🚀 Your Production URLs

**Backend:** `https://your-railway-url/api/v1`
**Frontend:** `https://your-vercel-domain.com`
**Admin:** `https://your-vercel-domain.com/admin`

---

**Deployment Complete!** 🎉

Your BOMA 2025 streetwear store is now live to the world!
