# BOMA 2025 - Complete Environment Setup Guide

## 📋 Overview

This guide covers setting up environment variables for both **development** and **production** environments.

---

## � Docke1r Setup (Your Current Setup)

### What is Docker?
Docker is a containerization platform that packages PostgreSQL (and other services) in isolated containers. Instead of installing PostgreSQL directly on your system, Docker runs it in a container.

### Your Current Docker Setup
You have a PostgreSQL container named `streetwear-db` running on port `5432`.

**Docker commands you'll need:**
```bash
# View all containers
docker ps -a

# Start the PostgreSQL container
docker start streetwear-db

# Stop the container
docker stop streetwear-db

# View container logs
docker logs streetwear-db

# Connect to PostgreSQL inside container
docker exec -it streetwear-db psql -U postgres

# Remove container (careful!)
docker rm streetwear-db
```

---

## 🔧 Part 1: Backend Environment Setup

### Location: `.env` (Root Directory)

#### Step 1: Database Configuration

**Using Docker (Your Current Setup) ✅**

You're already running PostgreSQL in Docker! Your container `streetwear-db` is running on port `5432`.

**Your connection string:**
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/streetwear_db?schema=public"
```

**To verify Docker container is running:**
```bash
docker ps
# You should see: streetwear-db running on 5432:5432
```

**To start/stop the container:**
```bash
# Start
docker start streetwear-db

# Stop
docker stop streetwear-db

# View logs
docker logs streetwear-db
```

**For Production (Cloud Database):**

**Railway (Recommended - You're using this!):**
- Image: `ghcr.io/railwayapp-templates/postgres-ssl:17`
- Go to https://railway.app
- Create new PostgreSQL service
- Connection string will be provided automatically
- Example: `postgresql://user:password@rail.proxy.rlwy.net:5432/railway?schema=public`

**Other Options:**
- Render: https://render.com (has built-in PostgreSQL)
- AWS RDS: https://aws.amazon.com/rds/
- Supabase: https://supabase.com (PostgreSQL + extras)

Example Railway connection string:
```
DATABASE_URL="postgresql://user:password@rail.proxy.rlwy.net:5432/railway?schema=public"
```

---

#### Step 2: JWT Configuration

**Generate a secure JWT secret:**

```bash
# On Windows (PowerShell)
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString() + (New-Guid).ToString())) | Out-String

# On Mac/Linux
openssl rand -base64 32
```

**Add to .env:**
```env
JWT_SECRET="your-generated-secret-here"
JWT_EXPIRES_IN="7d"
```

---

#### Step 3: Paystack Payment Integration

**Get Paystack Keys:**

1. Go to https://paystack.com
2. Sign up for an account
3. Go to Settings → API Keys & Webhooks
4. Copy your **TEST keys** for development

**For Development (.env):**
```env
PAYSTACK_SECRET_KEY="sk_test_xxxxxxxxxxxxx"
PAYSTACK_PUBLIC_KEY="pk_test_xxxxxxxxxxxxx"
```

**For Production (.env.production):**
```env
PAYSTACK_SECRET_KEY="sk_live_xxxxxxxxxxxxx"
PAYSTACK_PUBLIC_KEY="pk_live_xxxxxxxxxxxxx"
```

**Configure Webhook (Production):**
1. In Paystack dashboard, go to Settings → API Keys & Webhooks
2. Add webhook URL: `https://yourdomain.com/api/v1/webhooks/paystack`
3. Select events: `charge.success`, `charge.failed`

---

#### Step 4: Email Configuration (SMTP)

**Using Gmail:**

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Copy the generated password

3. Add to .env:
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password-here"
EMAIL_FROM="BOMA 2025 <noreply@boma2025.com>"
```

**Using Other Email Providers:**

**SendGrid:**
```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER="apikey"
SMTP_PASS="SG.xxxxxxxxxxxxx"
EMAIL_FROM="BOMA 2025 <noreply@boma2025.com>"
```

**AWS SES:**
```env
SMTP_HOST="email-smtp.region.amazonaws.com"
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER="your-ses-username"
SMTP_PASS="your-ses-password"
EMAIL_FROM="BOMA 2025 <noreply@boma2025.com>"
```

---

#### Step 5: Server Configuration

```env
PORT=3001
NODE_ENV=development
APP_URL="http://localhost:3000"
```

**For Production:**
```env
PORT=3001
NODE_ENV=production
APP_URL="https://yourdomain.com"
```

---

### Complete Backend .env Example (Development)

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/streetwear_db?schema=public"

# JWT
JWT_SECRET="your-secure-jwt-secret-here"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV=development
APP_URL="http://localhost:3000"

# Paystack (TEST keys)
PAYSTACK_SECRET_KEY="sk_test_xxxxxxxxxxxxx"
PAYSTACK_PUBLIC_KEY="pk_test_xxxxxxxxxxxxx"

# Email (Gmail)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
EMAIL_FROM="BOMA 2025 <noreply@boma2025.com>"
```

---

## 🎨 Part 2: Frontend Environment Setup

### Location: `my-streetwear-brand/.env.local` (Development)

Create a new file: `my-streetwear-brand/.env.local`

```env
# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:3001/api/v1"

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=""
```

### Location: `my-streetwear-brand/.env.production` (Production)

Update the existing file with:

```env
# API Configuration
NEXT_PUBLIC_API_URL="https://api.yourdomain.com/api/v1"

# Analytics (Optional)
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"

# Node Environment
NODE_ENV=production
```

---

## 🚀 Part 3: Production Deployment Setup

### Step 1: Choose Your Hosting

**Option A: Vercel (Frontend) + Railway (Backend) - RECOMMENDED**

**Backend on Railway (Step-by-step):**

1. Go to https://railway.app and sign up
2. Create new project
3. Add PostgreSQL service:
   - Click "Add Service" → "Database" → "PostgreSQL"
   - Railway creates a PostgreSQL container with SSL
4. Connect your GitHub repo:
   - Click "Add Service" → "GitHub Repo"
   - Select your streetwear-api repo
5. Configure environment variables in Railway:
   - Go to Variables tab
   - Add all variables from your `.env`:
     ```
     DATABASE_URL=postgresql://postgres:password@rail.proxy.rlwy.net:5432/railway?schema=public&sslmode=require
     JWT_SECRET=your-secure-secret
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
6. Deploy - Railway automatically builds and deploys
7. Get your backend URL from Railway dashboard

**Frontend on Vercel:**
1. Push code to GitHub
2. Go to https://vercel.com
3. Import your project (`my-streetwear-brand`)
4. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-backend-url/api/v1
   ```
5. Deploy

**Connect Frontend to Backend:**
- In Vercel, set `NEXT_PUBLIC_API_URL` to your Railway backend URL
- Example: `https://streetwear-api-production.up.railway.app/api/v1`

---

### Step 2: Database for Production

**Using Railway PostgreSQL (Recommended):**

1. Go to https://railway.app
2. Create new project
3. Add PostgreSQL service (uses `ghcr.io/railwayapp-templates/postgres-ssl:17`)
4. Railway automatically provides:
   - Connection string
   - Database name
   - Username & password
5. Copy the connection string to your backend environment variables

**Example Railway Connection String:**
```
postgresql://postgres:password@rail.proxy.rlwy.net:5432/railway?schema=public&sslmode=require
```

**Using AWS RDS:**

1. Create RDS PostgreSQL instance
2. Get endpoint: `your-db.xxxxx.us-east-1.rds.amazonaws.com`
3. Create connection string:
   ```
   postgresql://admin:password@your-db.xxxxx.us-east-1.rds.amazonaws.com:5432/streetwear_db
   ```

---

### Step 3: Domain & SSL

1. Purchase domain (e.g., bomaintl.com)
2. Configure DNS to point to your hosting
3. Enable SSL certificate (automatic on Vercel/Railway)

---

### Step 4: Environment Variables Checklist

**Backend Production (.env on Railway/Render):**
- [ ] DATABASE_URL (production database)
- [ ] JWT_SECRET (secure random string)
- [ ] PAYSTACK_SECRET_KEY (LIVE key)
- [ ] PAYSTACK_PUBLIC_KEY (LIVE key)
- [ ] SMTP_HOST, SMTP_USER, SMTP_PASS (real email)
- [ ] NODE_ENV=production
- [ ] PORT=3001
- [ ] APP_URL=https://yourdomain.com

**Frontend Production (Vercel):**
- [ ] NEXT_PUBLIC_API_URL=https://your-backend-url/api/v1
- [ ] NEXT_PUBLIC_GA_ID (optional)

---

## 🔐 Security Best Practices

### 1. Never Commit Secrets
```bash
# .gitignore should include:
.env
.env.local
.env.*.local
```

### 2. Use Environment Variable Management
- Vercel: Built-in environment variables
- Railway: Built-in secrets
- AWS: AWS Secrets Manager
- HashiCorp: Vault

### 3. Rotate Secrets Regularly
- Change JWT_SECRET every 6 months
- Rotate database passwords
- Update API keys

### 4. Use HTTPS Only
- All production URLs must be HTTPS
- Enable HSTS headers

---

## 🧪 Testing Your Setup

### Test Backend Connection

```bash
# In backend directory
npm run dev

# You should see:
# ✅ Database connected
# 🚀 Server running on port 3001
```

### Test Frontend Connection

```bash
# In frontend directory
npm run dev

# Visit http://localhost:3000
# Check browser console for API calls
```

### Test API Endpoint

```bash
curl http://localhost:3001/api/v1/products?page=1&limit=12
```

---

## 📝 Environment Variables Reference

### Backend Variables

| Variable | Type | Example | Required |
|----------|------|---------|----------|
| DATABASE_URL | String | postgresql://... | ✅ |
| JWT_SECRET | String | random-64-chars | ✅ |
| JWT_EXPIRES_IN | String | 7d | ✅ |
| PORT | Number | 3001 | ✅ |
| NODE_ENV | String | development/production | ✅ |
| PAYSTACK_SECRET_KEY | String | sk_test_... | ✅ |
| PAYSTACK_PUBLIC_KEY | String | pk_test_... | ✅ |
| SMTP_HOST | String | smtp.gmail.com | ✅ |
| SMTP_PORT | Number | 587 | ✅ |
| SMTP_SECURE | Boolean | false | ✅ |
| SMTP_USER | String | email@gmail.com | ✅ |
| SMTP_PASS | String | app-password | ✅ |
| EMAIL_FROM | String | BOMA <noreply@...> | ✅ |
| APP_URL | String | http://localhost:3000 | ✅ |

### Frontend Variables

| Variable | Type | Example | Required |
|----------|------|---------|----------|
| NEXT_PUBLIC_API_URL | String | http://localhost:3001/api/v1 | ✅ |
| NEXT_PUBLIC_GA_ID | String | G-XXXXXXXXXX | ❌ |

---

## 🆘 Troubleshooting

### "Database connection failed"
- Check DATABASE_URL is correct
- Verify PostgreSQL is running
- Check firewall rules

### "Invalid JWT Secret"
- Ensure JWT_SECRET is at least 32 characters
- Regenerate using openssl command

### "Paystack payment failed"
- Verify you're using TEST keys for development
- Check webhook URL is configured
- Ensure PAYSTACK_SECRET_KEY is correct

### "Emails not sending"
- Verify SMTP credentials
- Check Gmail app password is correct
- Enable "Less secure app access" if using Gmail

---

## ✅ Final Checklist

### Local Development
- [ ] Backend .env configured
- [ ] Frontend .env.local configured
- [ ] Docker PostgreSQL running (`docker ps` shows streetwear-db)
- [ ] Paystack TEST account set up
- [ ] Email configured (Gmail app password)
- [ ] JWT secret generated
- [ ] Backend tests passing (65/65)
- [ ] Frontend builds successfully
- [ ] Local development working

### Production Deployment (Railway + Vercel)
- [ ] Railway account created
- [ ] PostgreSQL service created on Railway
- [ ] Backend repo connected to Railway
- [ ] All environment variables added to Railway
- [ ] Backend deployed successfully
- [ ] Vercel account created
- [ ] Frontend repo connected to Vercel
- [ ] NEXT_PUBLIC_API_URL set to Railway backend URL
- [ ] Frontend deployed successfully
- [ ] Domain configured and SSL enabled
- [ ] Paystack LIVE keys configured
- [ ] Email configured for production
- [ ] Database migrations run on production

---

## 🚀 Quick Deploy Commands

**Local Development:**
```bash
# Start Docker PostgreSQL
docker start streetwear-db

# Backend
npm run dev

# Frontend (in another terminal)
cd my-streetwear-brand
npm run dev
```

**Production (Railway):**
```bash
# Push to GitHub
git push origin main

# Railway automatically deploys on push
# Monitor at https://railway.app/dashboard
```

**You're ready to deploy!** 🚀
