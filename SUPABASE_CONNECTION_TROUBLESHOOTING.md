# Supabase Connection Troubleshooting

## Connection Error: Can't reach database server

If you're getting this error:
```
Error: P1001: Can't reach database server at `db.uymizxygiyyolkajxnup.supabase.co:5432`
```

Follow these steps:

---

## Step 1: Verify Supabase Project is Active

1. Go to https://app.supabase.com
2. Check if your project shows as **Active** (green status)
3. If paused, click **Resume** to activate it
4. Wait 30 seconds for it to fully start

---

## Step 2: Verify Database Password

1. In Supabase dashboard, go to **Settings** → **Database**
2. Look for **Connection string** section
3. Copy the full connection string (it includes the password)
4. Verify the password matches what you entered in `.env`

**Your connection string should look like:**
```
postgresql://postgres:Jerryjusticeboma8.2@db.uymizxygiyyolkajxnup.supabase.co:5432/postgres?schema=public&sslmode=require
```

---

## Step 3: Check Network Connectivity

Try connecting with a different tool to verify network access:

**Option A: Using Node.js (if psql not available)**

Create a test file `test-db.js`:
```javascript
const { Client } = require('pg');

const client = new Client({
  host: 'db.uymizxygiyyolkajxnup.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'Jerryjusticeboma8.2',
  ssl: { rejectUnauthorized: false }
});

client.connect((err) => {
  if (err) {
    console.error('Connection failed:', err.message);
  } else {
    console.log('✅ Connected to Supabase!');
    client.end();
  }
});
```

Run it:
```bash
npm install pg
node test-db.js
```

**Option B: Using curl (test if port is open)**
```bash
curl -v telnet://db.uymizxygiyyolkajxnup.supabase.co:5432
```

---

## Step 4: Check Firewall/Network

- **Corporate/School Network**: May block port 5432
- **ISP Restrictions**: Some ISPs block database ports
- **VPN**: Try connecting with/without VPN

**Solution**: If blocked, you can:
1. Use a different network (mobile hotspot, home WiFi)
2. Use Supabase's REST API instead of direct connection
3. Deploy backend first, then connect from there

---

## Step 5: Verify .env File Format

Make sure your `.env` file has the correct format:

```env
DATABASE_URL="postgresql://postgres:Jerryjusticeboma8.2@db.uymizxygiyyolkajxnup.supabase.co:5432/postgres?schema=public&sslmode=require"
```

**Check for:**
- ✅ Correct password: `Jerryjusticeboma8.2`
- ✅ Correct host: `db.uymizxygiyyolkajxnup.supabase.co`
- ✅ Port: `5432`
- ✅ Database: `postgres`
- ✅ Schema: `public`
- ✅ SSL mode: `require`

---

## Step 6: Try Alternative Connection Method

If direct connection fails, you can:

1. **Deploy backend to Vercel/Railway first**
   - They have better network connectivity
   - Run migrations from there

2. **Use Supabase REST API**
   - No direct database connection needed
   - Works through HTTP

3. **Use Supabase SQL Editor**
   - Go to SQL Editor in Supabase dashboard
   - Paste your schema manually

---

## Step 7: Check Supabase Status

1. Go to https://status.supabase.com
2. Check if there are any service outages
3. If there's an outage, wait for it to be resolved

---

## If Still Not Working

**Option A: Reset Database Password**

1. Go to Supabase dashboard
2. Settings → Database
3. Click **Reset database password**
4. Copy the new password
5. Update `.env` with new password
6. Try again

**Option B: Create New Supabase Project**

1. Go to https://app.supabase.com
2. Create new project
3. Get new connection string
4. Update `.env` with new connection string
5. Try migrations again

---

## Alternative: Use Docker PostgreSQL Locally

If Supabase connection continues to fail, you can use Docker locally:

```bash
# Start Docker PostgreSQL
docker start streetwear-db

# Update .env to use local database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/streetwear_db?schema=public"

# Run migrations
npx prisma db push
npm run db:seed

# Later, when deploying to production, update to Supabase
```

---

## Next Steps

Once connection is working:

```bash
# Push schema to Supabase
npx prisma db push

# Seed sample data
npm run db:seed

# Verify in Supabase dashboard
# Go to SQL Editor and run: SELECT COUNT(*) FROM "Product";
```

