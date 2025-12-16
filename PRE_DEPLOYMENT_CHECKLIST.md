# Pre-Deployment Checklist - BOMA 2025

## ✅ Backend Status

### Code Quality
- ✅ TypeScript compilation: **PASS**
- ✅ Build successful: `npm run build` ✓
- ✅ All tests passing: 65/65 ✓
- ✅ No TypeScript errors
- ✅ No console errors

### Configuration
- ✅ `vercel.json` configured
- ✅ `.env.production` has Supabase connection string
- ✅ `package.json` has all scripts
- ✅ Build command: `npm run build`
- ✅ Start command: `node dist/server.js`

### Database
- ✅ Supabase project created
- ✅ Database schema created (tables exist)
- ⏳ **PENDING**: Seed 24 products (run SQL in Supabase)

### API Endpoints
- ✅ Products API: `/api/v1/products`
- ✅ Auth API: `/api/v1/auth/login`, `/api/v1/auth/register`
- ✅ Orders API: `/api/v1/orders`
- ✅ Admin API: `/api/v1/admin/*`
- ✅ Reviews API: `/api/v1/reviews`
- ✅ Wishlist API: `/api/v1/wishlist`

---

## ✅ Frontend Status

### Code Quality
- ✅ Next.js build: **PASS**
- ✅ TypeScript compilation: **PASS**
- ✅ 17 routes generated successfully
- ✅ No build errors
- ✅ No TypeScript errors

### Configuration
- ✅ `.env.local` configured for development
- ✅ `.env.production` configured for production
- ✅ `NEXT_PUBLIC_API_URL` placeholder ready
- ✅ All environment variables in place

### Pages
- ✅ Home page: `/`
- ✅ Shop page: `/shop`
- ✅ Product detail: `/product/[slug]`
- ✅ Cart: `/cart`
- ✅ Checkout: `/checkout`
- ✅ Auth: `/auth/login`, `/auth/register`
- ✅ Account: `/account`
- ✅ Admin: `/admin`

---

## ⏳ Before Deployment

### Step 1: Seed Supabase (5 minutes)
- [ ] Go to https://app.supabase.com
- [ ] Open SQL Editor
- [ ] Run `SUPABASE_SEED_DATA.sql`
- [ ] Verify: 24 products created

### Step 2: Deploy Backend (5 minutes)
- [ ] Go to https://vercel.com/dashboard
- [ ] Create new project from GitHub
- [ ] Select root directory (not `my-streetwear-brand`)
- [ ] Add environment variables:
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
- [ ] Deploy
- [ ] Get backend URL (e.g., `https://boma-intl.vercel.app`)

### Step 3: Update Frontend (2 minutes)
- [ ] Go to Vercel dashboard
- [ ] Select frontend project (`my-streetwear-brand`)
- [ ] Settings → Environment Variables
- [ ] Update `NEXT_PUBLIC_API_URL`:
  ```
  https://boma-intl.vercel.app/api/v1
  ```
- [ ] Redeploy

### Step 4: Test Connection (5 minutes)
- [ ] Visit frontend URL
- [ ] Go to Shop page
- [ ] Products should load
- [ ] Open DevTools → Network tab
- [ ] Should see API calls to backend
- [ ] Try adding to cart
- [ ] Try checkout flow

---

## 🚨 Potential Issues & Solutions

### Issue 1: "Can't reach database server"
**Cause**: Supabase connection string incorrect or project paused
**Solution**:
- Verify DATABASE_URL in Vercel environment variables
- Check Supabase project is active (not paused)
- Verify password is correct

### Issue 2: "API calls failing from frontend"
**Cause**: NEXT_PUBLIC_API_URL incorrect
**Solution**:
- Verify backend URL is correct
- Check CORS is enabled in backend
- Verify backend is deployed and running

### Issue 3: "Products not loading"
**Cause**: Database not seeded
**Solution**:
- Run SUPABASE_SEED_DATA.sql in Supabase
- Verify 24 products exist in database

### Issue 4: "Checkout failing"
**Cause**: Missing Paystack keys or email config
**Solution**:
- Add PAYSTACK_SECRET_KEY and PAYSTACK_PUBLIC_KEY to Vercel
- Add SMTP credentials for email

### Issue 5: "Authentication not working"
**Cause**: JWT_SECRET not set or incorrect
**Solution**:
- Generate secure JWT_SECRET
- Add to Vercel environment variables
- Ensure same secret on backend

---

## 📊 Deployment Checklist

### Backend Deployment
- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables added
- [ ] Build successful
- [ ] Backend URL obtained
- [ ] API endpoints responding

### Frontend Deployment
- [ ] Code pushed to GitHub (already done)
- [ ] Vercel project created (already done)
- [ ] NEXT_PUBLIC_API_URL updated
- [ ] Build successful
- [ ] Frontend URL obtained
- [ ] Pages loading

### Database
- [ ] Supabase project active
- [ ] Schema created
- [ ] 24 products seeded
- [ ] Connection string correct

### Integration
- [ ] Frontend connects to backend
- [ ] Products load on shop page
- [ ] Cart functionality works
- [ ] Checkout works
- [ ] Payments work (Paystack)
- [ ] Emails send (SMTP)

### Domain (Optional)
- [ ] Domain purchased
- [ ] DNS records configured
- [ ] SSL certificate active
- [ ] HTTPS working

---

## 🎯 Current Status

**Backend**: ✅ Ready to deploy
**Frontend**: ✅ Already deployed
**Database**: ⏳ Needs seeding

**Next Action**: Seed Supabase with 24 products

---

## 📝 Important Notes

1. **Never commit secrets to GitHub**
   - `.env` and `.env.production` are in `.gitignore`
   - Set secrets in Vercel dashboard only

2. **Supabase connection string**
   - Already configured in `.env.production`
   - Will be set in Vercel environment variables

3. **Frontend API URL**
   - Will be set after backend deployment
   - Must match your backend URL

4. **Paystack keys**
   - Use LIVE keys for production
   - Set in Vercel environment variables

5. **Email configuration**
   - Gmail app password required
   - Set in Vercel environment variables

---

## 🚀 You're Almost There!

1. Seed Supabase (5 min)
2. Deploy backend (5 min)
3. Update frontend API URL (2 min)
4. Test connection (5 min)
5. **LIVE!** 🎉

Total time: ~20 minutes

