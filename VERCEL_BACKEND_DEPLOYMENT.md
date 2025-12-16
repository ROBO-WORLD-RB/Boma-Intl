# Deploy Backend to Vercel

## 🚀 Quick Start

Your backend is ready to deploy to Vercel. Follow these steps:

---

## Step 1: Push Code to GitHub

```bash
git add .
git commit -m "Backend ready for Vercel deployment"
git push origin main
```

---

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI (Fastest)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Option B: Using Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Click "Import Git Repository"
4. Select your GitHub repo: `ROBO-WORLD-RB/Boma-Intl`
5. Configure project:
   - **Framework Preset**: Other
   - **Root Directory**: `.` (root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Note**: Vercel will use `vercel.backend.json` for backend configuration
6. Click "Environment Variables" and add:

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

7. Click "Deploy"

---

## Step 3: Get Your Backend URL

After deployment, Vercel will show your backend URL:
```
https://boma-intl.vercel.app
```

---

## Step 4: Update Frontend

Update your frontend's `NEXT_PUBLIC_API_URL`:

1. Go to Vercel dashboard
2. Select your frontend project (`my-streetwear-brand`)
3. Settings → Environment Variables
4. Update `NEXT_PUBLIC_API_URL`:
   ```
   NEXT_PUBLIC_API_URL=https://boma-intl.vercel.app/api/v1
   ```
5. Redeploy frontend

---

## Step 5: Test Connection

1. Visit your frontend: `https://your-frontend-url.vercel.app`
2. Go to Shop page
3. Open DevTools → Network tab
4. Should see API calls to your backend
5. Products should load

---

## Environment Variables Explained

| Variable | Value | Where to Get |
|----------|-------|--------------|
| DATABASE_URL | Supabase connection string | Supabase dashboard |
| JWT_SECRET | Secure random string | Generate one |
| PAYSTACK_SECRET_KEY | Live key | Paystack dashboard |
| PAYSTACK_PUBLIC_KEY | Live key | Paystack dashboard |
| SMTP_USER | Your email | Gmail |
| SMTP_PASS | App password | Gmail app passwords |

---

## Troubleshooting

### "Build failed"
- Check `npm run build` works locally
- Verify all dependencies are in `package.json`
- Check Node.js version (should be 18+)

### "Database connection failed"
- Verify DATABASE_URL is correct
- Check Supabase project is active
- Verify password is correct

### "API calls failing"
- Check backend URL in frontend
- Verify CORS is enabled in backend
- Check environment variables are set

### "Deployment stuck"
- Check build logs in Vercel dashboard
- Try redeploying
- Check for large files (>100MB)

---

## Monitoring

### View Logs
1. Go to Vercel dashboard
2. Select your project
3. Click "Deployments"
4. Click latest deployment
5. Click "Logs"

### View Metrics
1. Go to Vercel dashboard
2. Select your project
3. Click "Analytics"

---

## Custom Domain (Optional)

1. In Vercel dashboard, go to Settings → Domains
2. Add your domain
3. Follow DNS configuration steps
4. Wait for DNS propagation (5-30 minutes)

---

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Deploy to Vercel
3. ✅ Get backend URL
4. ✅ Update frontend API URL
5. ✅ Test connection
6. ✅ Configure custom domain (optional)

---

## Your Deployment URLs

**Frontend (Already deployed):**
```
https://your-frontend-url.vercel.app
```

**Backend (After deployment):**
```
https://boma-intl.vercel.app
```

**API Base URL:**
```
https://boma-intl.vercel.app/api/v1
```

---

## Support

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Paystack Docs: https://paystack.com/docs

