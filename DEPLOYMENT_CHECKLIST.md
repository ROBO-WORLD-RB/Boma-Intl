# BOMA 2025 - Deployment Readiness Checklist

## ✅ Build Status

### Backend (Express + Prisma)
- ✅ TypeScript compilation: **PASSED**
- ✅ All tests: **65/65 PASSED**
- ✅ Database schema: Ready
- ✅ API endpoints: Fully functional

### Frontend (Next.js 16)
- ✅ Production build: **PASSED**
- ✅ TypeScript: No errors
- ✅ Static pages generated: 17 routes
- ✅ Dynamic routes configured

---

## 🔧 Pre-Deployment Tasks

### 1. Environment Variables (CRITICAL)

**Backend (.env)**
```env
# MUST CHANGE for production:
DATABASE_URL="postgresql://user:password@YOUR_PROD_DB:5432/streetwear_db"
JWT_SECRET="generate-a-secure-64-char-random-string"
NODE_ENV=production
PORT=3001

# Paystack (use LIVE keys for production)
PAYSTACK_SECRET_KEY="sk_live_xxxxx"
PAYSTACK_PUBLIC_KEY="pk_live_xxxxx"

# Email (configure real SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-real-email@gmail.com"
SMTP_PASS="your-app-password"
```

**Frontend (.env.production)**
```env
NEXT_PUBLIC_API_URL="https://api.yourdomain.com/api/v1"
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"  # Optional: Google Analytics
```

### 2. Database Setup
- [ ] Create production PostgreSQL database
- [ ] Run `npx prisma migrate deploy` on production
- [ ] Run `npm run db:seed` to create admin user and sample products
- [ ] Update product images with real product photos

### 3. Security Checklist
- [ ] Change JWT_SECRET to a secure random string (64+ chars)
- [ ] Use HTTPS for all endpoints
- [ ] Configure CORS for your domain only
- [ ] Enable rate limiting in production
- [ ] Set secure cookie options

### 4. Payment Integration
- [ ] Switch from Paystack TEST keys to LIVE keys
- [ ] Configure webhook URL in Paystack dashboard
- [ ] Test payment flow with real card

---

## 📦 Deployment Options

### Option A: Vercel (Frontend) + Railway/Render (Backend)

**Frontend (Vercel):**
```bash
cd my-streetwear-brand
vercel --prod
```

**Backend (Railway):**
1. Connect GitHub repo
2. Set environment variables
3. Deploy

### Option B: Single VPS (DigitalOcean/AWS)

```bash
# Backend
npm run build
npm start

# Frontend
cd my-streetwear-brand
npm run build
npm start
```

### Option C: Docker (Recommended for production)
- Create Dockerfiles for both services
- Use docker-compose for orchestration

---

## 🌐 Domain & DNS

- [ ] Purchase domain (e.g., bomaintl.com)
- [ ] Configure DNS records
- [ ] Set up SSL certificates (Let's Encrypt)
- [ ] Configure reverse proxy (nginx)

---

## 📱 Social Media Links (Configured)

- Instagram: https://instagram.com/boma.intl
- Twitter: https://twitter.com/boma_intl
- TikTok: https://tiktok.com/@boma.intl

---

## 🧪 Final Testing Before Launch

- [ ] Test user registration/login
- [ ] Test product browsing and filtering
- [ ] Test add to cart functionality
- [ ] Test checkout flow (COD)
- [ ] Test checkout flow (Paystack)
- [ ] Test order confirmation emails
- [ ] Test mobile responsiveness
- [ ] Test on multiple browsers

---

## 📊 Post-Launch Monitoring

- [ ] Set up error tracking (Sentry)
- [ ] Configure uptime monitoring
- [ ] Set up Google Analytics
- [ ] Monitor server resources

---

## Admin Access

Default admin credentials (CHANGE AFTER FIRST LOGIN):
- Email: admin@streetwear.com
- Password: admin123

---

**Status: READY FOR DEPLOYMENT** ✅

All critical systems are functional. Complete the pre-deployment tasks above before going live.
