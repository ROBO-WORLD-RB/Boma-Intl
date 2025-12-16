# BOMA Streetwear - Deployment Guide

## Quick Start

Your application is **production-ready**. Here's how to deploy:

---

## Pre-Deployment Checklist

```bash
# 1. Run full test suite (should pass 100%)
npm run test:all

# 2. Build for production
npm run build

# 3. Test production build locally
npm start
```

**Expected Results:**
- ✅ TypeScript: 0 errors
- ✅ ESLint: 0 errors (1 intentional warning)
- ✅ Tests: 8/8 passing
- ✅ Build: Compiled successfully

---

## Environment Variables

### Development (.env)
```
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/streetwear_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=3000
PAYSTACK_SECRET_KEY="sk_test_your_paystack_secret_key"
PAYSTACK_PUBLIC_KEY="pk_test_your_paystack_public_key"
```

### Production (.env.production)
Update these values before deploying:
```
NODE_ENV=production
DATABASE_URL="[YOUR_PRODUCTION_DATABASE_URL]"
JWT_SECRET="[GENERATE_NEW_SECURE_SECRET]"
PAYSTACK_SECRET_KEY="[YOUR_LIVE_PAYSTACK_SECRET]"
PAYSTACK_PUBLIC_KEY="[YOUR_LIVE_PAYSTACK_PUBLIC]"
```

---

## Deployment Platforms

### Option 1: Vercel (Recommended)

**Easiest deployment for Next.js**

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Set production environment variables in Vercel dashboard
# 4. Redeploy with: vercel --prod
```

### Option 2: AWS (EC2 / Elastic Beanstalk)

```bash
# 1. Build
npm run build

# 2. Start production server
npm start

# 3. Use PM2 for process management
npm i -g pm2
pm2 start npm --name "boma" -- start
pm2 save
pm2 startup
```

### Option 3: Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY .next ./.next
COPY public ./public

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t boma-streetwear .
docker run -p 3000:3000 -e NODE_ENV=production boma-streetwear
```

### Option 4: Railway / Render / Fly.io

These platforms auto-detect Next.js and handle deployment automatically.

---

## Post-Deployment Verification

### 1. Health Check
```bash
curl https://your-domain.com/
# Should return 200 OK with HTML content
```

### 2. Critical Routes
- [ ] Homepage: `https://your-domain.com/`
- [ ] Shop: `https://your-domain.com/shop`
- [ ] Collections: `https://your-domain.com/collections`
- [ ] About: `https://your-domain.com/about`

### 3. Assets
- [ ] Images load correctly
- [ ] CSS styles applied
- [ ] Fonts render properly
- [ ] Smooth scroll works

### 4. Functionality
- [ ] Navbar appears and is sticky
- [ ] Hero section displays
- [ ] Marquee scrolls
- [ ] Gallery images lazy load
- [ ] Navigation links work

### 5. Performance
```bash
# Check Lighthouse score
# Target: > 90 on all metrics
```

---

## Monitoring Setup

### Error Tracking (Sentry)

```bash
npm install @sentry/nextjs
```

Update `next.config.ts`:
```typescript
import { withSentryConfig } from "@sentry/nextjs";

export default withSentryConfig(nextConfig, {
  org: "your-org",
  project: "boma-streetwear",
  authToken: process.env.SENTRY_AUTH_TOKEN,
});
```

### Analytics (Google Analytics)

Add to `app/layout.tsx`:
```typescript
import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

## Security Checklist

- [ ] HTTPS enabled
- [ ] Security headers configured (done in next.config.ts)
- [ ] Environment variables not exposed
- [ ] Database credentials secured
- [ ] API keys rotated
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] DDoS protection active

---

## Performance Optimization

### Already Implemented
- ✅ Image optimization (AVIF/WebP)
- ✅ Lazy loading for gallery
- ✅ CSS minification
- ✅ JavaScript minification
- ✅ Font optimization
- ✅ Cache headers

### Additional Recommendations
- [ ] Set up CDN (Cloudflare, AWS CloudFront)
- [ ] Enable compression (gzip/brotli)
- [ ] Configure caching strategy
- [ ] Monitor Core Web Vitals
- [ ] Set up performance alerts

---

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Environment Variables Not Loading
```bash
# Verify .env.production exists
# Check variable names match exactly
# Restart application after changes
```

### Images Not Loading
```bash
# Check image paths in public/lookbook/
# Verify image permissions
# Check CDN configuration if using one
```

### Slow Performance
```bash
# Check Lighthouse score
# Review Core Web Vitals
# Check database query performance
# Monitor server resources
```

---

## Rollback Procedure

If deployment fails:

```bash
# 1. Identify the issue
# Check error logs and monitoring

# 2. Revert to previous version
git revert HEAD
git push

# 3. Redeploy
vercel --prod  # or your deployment command

# 4. Verify
# Test all critical routes
# Check error logs
```

---

## Maintenance Schedule

### Daily
- [ ] Monitor error logs
- [ ] Check uptime status
- [ ] Review critical alerts

### Weekly
- [ ] Review performance metrics
- [ ] Check security alerts
- [ ] Test critical user flows

### Monthly
- [ ] Update dependencies
- [ ] Review security advisories
- [ ] Analyze user analytics

### Quarterly
- [ ] Security audit
- [ ] Performance review
- [ ] Capacity planning

---

## Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs
- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com/docs

---

## Contact

For deployment issues or questions:
- Check PRODUCTION_CHECKLIST.md
- Review PRODUCTION_REPORT.md
- Check application logs
- Contact your DevOps team

---

**Last Updated**: December 4, 2025  
**Status**: Ready for Production ✅
