# Deployment Guide - Next.js News App

## Deploy to Vercel (Recommended)

Vercel adalah platform terbaik untuk Next.js karena dibuat oleh tim yang sama.

### Quick Deploy (1-Click)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mohammadnovel/news-nuxt)

### Manual Setup

#### 1. Install Vercel CLI

```bash
npm install -g vercel
```

#### 2. Login to Vercel

```bash
vercel login
```

#### 3. Deploy

```bash
vercel
```

Follow the prompts:

- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- What's your project's name? **news-app**
- In which directory is your code located? **.**
- Want to override the settings? **N**

#### 4. Deploy to Production

```bash
vercel --prod
```

---

## GitHub Actions Setup

### Prerequisites

1. **Create Vercel Account**: https://vercel.com/signup
2. **Create New Project** in Vercel dashboard
3. **Get Vercel Tokens**

### Get Required Secrets

#### 1. Vercel Token

1. Go to https://vercel.com/account/tokens
2. Create new token
3. Copy the token

#### 2. Vercel Org ID & Project ID

```bash
# Run in your project directory
vercel link

# This creates .vercel/project.json
cat .vercel/project.json
```

You'll see:

```json
{
  "orgId": "team_xxxxx",
  "projectId": "prj_xxxxx"
}
```

### Add Secrets to GitHub

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add these secrets:

| Secret Name         | Value                     |
| ------------------- | ------------------------- |
| `VERCEL_TOKEN`      | Your Vercel token         |
| `VERCEL_ORG_ID`     | From .vercel/project.json |
| `VERCEL_PROJECT_ID` | From .vercel/project.json |

### Environment Variables

Add these in Vercel dashboard (Settings → Environment Variables):

```env
# Database
DATABASE_URL=file:./dev.db

# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Important**:

- Use production database URL for production
- Generate new `NEXTAUTH_SECRET`: `openssl rand -base64 32`
- Update `NEXTAUTH_URL` with your Vercel domain

---

## Alternative: GitHub Pages (Static Export)

For static deployment without server features.

### 1. Update next.config.ts

```typescript
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};
```

### 2. Create GitHub Actions

File: `.github/workflows/deploy-pages.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - run: npm ci
      - run: npm run build

      - uses: actions/upload-pages-artifact@v2
        with:
          path: ./out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v2
        id: deployment
```

### 3. Enable GitHub Pages

1. Repository Settings → Pages
2. Source: GitHub Actions
3. Save

**Note**: Static export has limitations:

- No API routes
- No server-side rendering
- No authentication
- No database

---

## Alternative: Netlify

### 1. Create netlify.toml

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### 2. Deploy

1. Go to https://netlify.com
2. Import from GitHub
3. Select repository
4. Deploy

---

## Post-Deployment Checklist

### 1. Database Setup

For production, use a proper database:

- **PostgreSQL**: Supabase, Neon, Railway
- **MySQL**: PlanetScale
- **MongoDB**: MongoDB Atlas

Update `DATABASE_URL` in environment variables.

### 2. Run Migrations

```bash
npx prisma migrate deploy
```

### 3. Seed Database

```bash
npx prisma db seed
```

### 4. Test Features

- ✅ Homepage loads
- ✅ Login works
- ✅ Dashboard accessible
- ✅ Create article
- ✅ Comments work
- ✅ Search works
- ✅ Analytics display

### 5. Configure Domain (Optional)

In Vercel:

1. Settings → Domains
2. Add custom domain
3. Update DNS records

---

## Troubleshooting

### Build Fails

**Issue**: `Module not found`
**Solution**:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Database Connection Error

**Issue**: `Can't reach database server`
**Solution**:

- Check `DATABASE_URL` is correct
- Ensure database is accessible from Vercel
- Use connection pooling for serverless

### Authentication Not Working

**Issue**: `NEXTAUTH_URL` mismatch
**Solution**:

- Update `NEXTAUTH_URL` to production domain
- Regenerate `NEXTAUTH_SECRET`
- Update Google OAuth redirect URIs

### Images Not Loading

**Issue**: Image optimization fails
**Solution**: Add to `next.config.ts`:

```typescript
images: {
  domains: ['your-domain.com'],
}
```

---

## Monitoring

### Vercel Analytics

Enable in Vercel dashboard:

1. Analytics → Enable
2. View real-time metrics
3. Monitor performance

### Error Tracking

Consider adding:

- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **Vercel Logs**: Built-in logging

---

## Continuous Deployment

With GitHub Actions setup:

1. **Push to main** → Auto-deploy to production
2. **Pull request** → Deploy preview
3. **Merge PR** → Update production

Every push triggers:

- ✅ Install dependencies
- ✅ Run build
- ✅ Deploy to Vercel
- ✅ Generate preview URL

---

## Cost

### Vercel Free Tier

- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Preview deployments
- ✅ Analytics

Perfect for this project!

---

## Quick Commands

```bash
# Deploy to production
vercel --prod

# View deployment logs
vercel logs

# List deployments
vercel ls

# Remove deployment
vercel rm [deployment-url]

# Open in browser
vercel open
```

---

## Next Steps

1. ✅ Push code to GitHub (Done)
2. ⬜ Create Vercel account
3. ⬜ Add GitHub secrets
4. ⬜ Configure environment variables
5. ⬜ Push to trigger deployment
6. ⬜ Test production site
7. ⬜ Add custom domain (optional)

Your app will be live at: `https://your-project.vercel.app` 🚀
