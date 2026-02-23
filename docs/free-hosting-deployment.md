# BharatSolve AI - Free Hosting & Deployment Guide

## Project Profile

| Aspect | Detail |
|---|---|
| **Type** | Full-stack monorepo (single-port architecture) |
| **Runtime** | Node.js 20 + Express backend serving React SPA |
| **Database** | Optional PostgreSQL (can run in-memory without it) |
| **Docker** | Ready (multi-stage Dockerfile + docker-compose) |
| **External APIs** | Optional OpenAI (has mock AI fallback) |
| **Min Requirements** | ~256 MB RAM, Node.js 20 |

---

## Cheapest Deployment Path ($0/month) — With Proper Database

The **cheapest option with a proper PostgreSQL database** is $0/month: free hosting + Neon (forever-free PostgreSQL) + mock AI. No credit card required.

| Choice | Cheapest Option | Why |
|--------|-----------------|-----|
| **Hosting** | Koyeb or Render | Both free, no credit card. Koyeb = always-on; Render = sleeps after 15 min |
| **Database** | **Neon PostgreSQL** | Forever free (0.5 GB). Standard PostgreSQL, works with Drizzle ORM |
| **AI** | Mock AI (omit `OPENAI_API_KEY`) | Culturally themed demo responses, no OpenAI cost |

**Total cost: $0.** Users, problems, subscriptions, and referrals persist across restarts.

---

### Step-by-Step: Cheapest Deployment (Koyeb + Neon PostgreSQL + Mock AI)

#### 1. Pre-flight (local)

```bash
npm run check                    # TypeScript
npm run build                    # Production build
git add -A && git status         # Ensure .env is NOT staged
git push origin main
```

#### 2. Create Neon database

1. Go to [neon.tech](https://neon.tech) and sign up (GitHub or email)
2. **New Project** → name it (e.g. `bharatsolve`)
3. Copy the **connection string** (looks like `postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`)
4. Add `?sslmode=require` if not already present

#### 3. Run database migration (local, once)

```bash
DATABASE_URL="postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require" npm run db:push
```

This creates the tables (`users`, `problems`, `user_profiles`, `sessions`, etc.). You should see output like "Pushing schema changes..."

#### 4. Create Koyeb account and deploy

1. Go to [koyeb.com](https://www.koyeb.com) and sign up with GitHub (no credit card)
2. **Create App** → **GitHub** → authorize Koyeb → select your repo
3. **Builder:** Docker (auto-detects `Dockerfile`)
4. **Instance type:** Nano (free)
5. **Port:** `3000`
6. **Region:** Choose closest (e.g. Singapore for India)

#### 5. Environment variables

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `SESSION_SECRET` | Generate: `openssl rand -base64 32` |
| `DATABASE_URL` | Your Neon connection string from step 2 |

**Do NOT set** `OPENAI_API_KEY` if using mock AI (or add it for real AI responses).

#### 6. Deploy

Click **Deploy**. Koyeb builds the Docker image and runs the app. Your URL: `https://<app-name>-<org>.koyeb.app`.

#### 7. Verify

- Landing page loads
- `GET https://<your-url>/api/health` returns `{"status":"ok"}`
- Create a problem → mock AI returns a solution; **data persists** (refresh or revisit)
- Login works; user and session stored in PostgreSQL
- Subscription and referral data persists across restarts

---

### Alternative: Render (same stack, sleeps after 15 min)

| Step | Action |
|------|--------|
| 1 | Create Neon DB at [neon.tech](https://neon.tech); copy connection string |
| 2 | Run `DATABASE_URL="<neon-url>" npm run db:push` locally |
| 3 | [render.com](https://render.com) → New Web Service → connect GitHub repo |
| 4 | Build: `npm run build`, Start: `npm start` |
| 5 | Env vars: `NODE_ENV`, `SESSION_SECRET`, `DATABASE_URL` |
| 6 | Deploy |

**Still $0.** Render sleeps after inactivity; first request after sleep takes ~30–60s.

---

### Optional: In-Memory (no database)

If you only need a quick demo and **don't care about persistence**, omit `DATABASE_URL`. Data resets on every restart. No Neon setup required.

---

### Cheapest Path Quick Reference

| Scenario | Hosting | Database | AI | Cost | Notes |
|----------|---------|----------|-----|------|-------|
| **Recommended** | Koyeb | **Neon PostgreSQL** | Mock | $0 | Proper DB, persistent data, no credit card |
| **Easy start, sleeps** | Render | **Neon PostgreSQL** | Mock | $0 | Same stack; cold starts after 15 min idle |
| **Real AI, free** | Koyeb | **Neon PostgreSQL** | OpenAI ($5 credit) | $0 initially | Add `OPENAI_API_KEY` for real responses |
| **Quick demo only** | Koyeb | In-memory | Mock | $0 | No DB setup; data resets on restart |

---

## Hosting Options

### Option 1: Render (Recommended - Easiest Start)

| Component | Service | Free Tier |
|---|---|---|
| **App** | Web Service | 750 hrs/month, auto-sleep after 15 min inactivity |
| **Database** | Managed PostgreSQL | Free for 90 days (256 MB), then $7/month |

**Pros:**
- Native Docker support (uses existing `Dockerfile`)
- Auto-deploy from GitHub on every push
- Free TLS/SSL and custom domain support
- Environment variables UI in dashboard
- Zero config beyond connecting your repo

**Cons:**
- Free tier sleeps after 15 min inactivity (cold starts ~30-60s)
- Free PostgreSQL expires after 90 days
- 512 MB RAM limit on free tier

**Deploy Steps:**
1. Push repo to GitHub
2. Create a Render account at [render.com](https://render.com)
3. Dashboard -> **New Web Service** -> connect your GitHub repo
4. Set **Build Command**: `npm run build`
5. Set **Start Command**: `npm start`
6. Add environment variables: `DATABASE_URL`, `SESSION_SECRET`, `OPENAI_API_KEY` (optional)
7. Create a free PostgreSQL instance -> copy the internal `DATABASE_URL` into your web service env vars
8. Deploy triggers automatically on each `git push`

---

### Option 2: Railway (Best Developer Experience)

| Component | Service | Free Tier |
|---|---|---|
| **App + DB** | Railway Project | $5 free credits/month (no credit card required) |

**Pros:**
- One-click PostgreSQL provisioning
- Native Docker deployment
- Excellent dashboard and real-time logs
- Auto-deploy from GitHub
- No sleep / no cold start issues (while credits last)
- Built-in `DATABASE_URL` injection

**Cons:**
- $5/month credit limit may run out under heavy usage (~500 hrs of small instance)
- Need to monitor usage in dashboard

**Deploy Steps:**
1. Sign up at [railway.app](https://railway.app) with GitHub
2. **New Project** -> **Deploy from GitHub Repo** -> select your repo
3. Add a **PostgreSQL** service (one click in dashboard)
4. Railway auto-detects the `Dockerfile` and builds
5. Set environment variables (`SESSION_SECRET`, `OPENAI_API_KEY`, etc.) in the **Variables** tab
6. Railway auto-injects `DATABASE_URL` for the linked PostgreSQL service

---

### Option 3: Fly.io (Best Performance on Free Tier)

| Component | Service | Free Tier |
|---|---|---|
| **App** | Fly Machine | 3 shared-cpu VMs (256 MB each) |
| **Database** | Fly Postgres | 1 free shared instance (1 GB storage) |

**Pros:**
- No cold starts (machines stay running)
- Global edge deployment (deploy close to India - Mumbai region)
- Native Docker support
- Free persistent PostgreSQL
- Custom domains + TLS

**Cons:**
- Requires credit card for signup (but free tier is truly free)
- CLI-based deployment (slightly more complex)
- 256 MB RAM per VM

**Deploy Steps:**
1. Install `flyctl` CLI: `brew install flyctl` (macOS) or see [fly.io/docs](https://fly.io/docs/flyctl/install/)
2. `fly auth signup` or `fly auth login`
3. In the project root: `fly launch` (auto-detects `Dockerfile`)
4. Choose region: **maa** (Chennai) or **bom** (Mumbai) for Indian users
5. Create a free Postgres cluster: `fly postgres create`
6. Attach DB to app: `fly postgres attach <db-name>`
7. Set secrets:
   ```bash
   fly secrets set SESSION_SECRET="your-strong-secret"
   fly secrets set OPENAI_API_KEY="sk-..."
   ```
8. Deploy: `fly deploy`

---

### Option 4: Koyeb (No Credit Card, Always-On)

| Component | Service | Free Tier |
|---|---|---|
| **App** | Nano instance | 1 free nano service (always on, no sleep) |
| **Database** | External (use Neon or Supabase) | See database section below |

**Pros:**
- Always-on (no cold starts!)
- No credit card required
- Docker deployment supported
- Auto-deploy from GitHub
- Free custom domain + TLS

**Cons:**
- Only 1 free service (nano = 256 MB RAM, 0.1 vCPU)
- No managed database (must use external free DB)
- Limited build minutes

**Deploy Steps:**
1. Sign up at [koyeb.com](https://www.koyeb.com)
2. **Create App** -> **GitHub** -> select your repo
3. Choose **Docker** builder (auto-detects `Dockerfile`)
4. Add environment variables in the settings panel
5. Set the exposed port to `3000`
6. Deploy

---

### Option 5: Hugging Face Spaces (Best for AI Demos)

| Component | Service | Free Tier |
|---|---|---|
| **App** | Docker Space | 2 vCPU, 16 GB RAM (free CPU basic tier) |
| **Database** | External (use Neon or Supabase) | See database section below |

**Pros:**
- Very generous free compute (16 GB RAM)
- Native Docker support
- No credit card required
- Good visibility for AI-focused projects

**Cons:**
- Sleeps after inactivity
- Not designed for traditional web apps
- Custom domain requires Pro plan ($9/month)
- App port must be `7860` (requires minor env var change)

**Deploy Steps:**
1. Create a Hugging Face account at [huggingface.co](https://huggingface.co)
2. **New Space** -> choose **Docker** SDK
3. Push your repo to the Space's Git remote (or link GitHub)
4. Set `PORT=7860` in environment variables (or add a `Spacefile`)
5. Add other env vars: `SESSION_SECRET`, `OPENAI_API_KEY` (optional)

---

## Free PostgreSQL Database Providers

Use any of these when your hosting platform doesn't include a managed database.

| Provider | Free Tier | Storage | Connection Limit | Notes |
|---|---|---|---|---|
| **[Neon](https://neon.tech)** | Forever free | 0.5 GB | 100 simultaneous | Serverless, auto-scales to zero, best for dev |
| **[Supabase](https://supabase.com)** | Forever free | 500 MB | 60 simultaneous | Full PostgreSQL + auth/realtime extras |
| **[Aiven](https://aiven.io)** | Free plan | 1 GB | Limited | Managed PostgreSQL, no credit card |
| **[CockroachDB](https://cockroachlabs.com)** | Serverless free | 10 GB | Generous | PostgreSQL-compatible, best storage limits |

**Recommendation:** Use **Neon** for development and small production loads. It provides a standard `postgresql://` connection string that works directly with Drizzle ORM and your existing `DATABASE_URL` env var.

---

## In-Memory Mode (Zero External Dependencies)

BharatSolve AI can run **without any database or API key**:

- Omit `DATABASE_URL` -> in-memory storage (data resets on restart)
- Omit `OPENAI_API_KEY` -> mock AI responses (culturally themed test data)

This is useful for demos, testing, and quick deployments on any free Node.js host. All features work; data simply doesn't persist across restarts.

---

## Comparison Matrix

| Feature | Render | Railway | Fly.io | Koyeb | HF Spaces |
|---|---|---|---|---|---|
| **Credit Card Required** | No | No | Yes | No | No |
| **Always On (no sleep)** | No | Yes | Yes | Yes | No |
| **Free PostgreSQL** | 90 days | Yes ($5 credit) | Yes | No (external) | No (external) |
| **Docker Support** | Yes | Yes | Yes | Yes | Yes |
| **Auto-deploy from GitHub** | Yes | Yes | Yes | Yes | Yes |
| **Custom Domain** | Free | Free | Free | Free | Paid |
| **Cold Start Time** | ~30-60s | None | None | None | ~30-60s |
| **RAM** | 512 MB | ~512 MB | 256 MB | 256 MB | 16 GB |
| **Best For** | Easy start | Best DX | Performance | Always-on | AI demos |

---

## Recommended Strategy

| Use Case | Platform | Database | Cost |
|---|---|---|---|
| **Quick demo / development** | Render | Neon (free) or in-memory | $0 |
| **Production-like (Indian users)** | Fly.io (Mumbai region) | Fly Postgres (free) | $0 |
| **Best developer experience** | Railway | Railway PostgreSQL | $0 (within $5 credits) |
| **Always-on, no credit card** | Koyeb | Neon (free) | $0 |
| **Maximum simplicity** | Any platform | In-memory (no DB) | $0 |

---

## Environment Variables Reference

Set these on your chosen platform's dashboard or CLI:

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `DATABASE_URL` | No | _(empty = in-memory)_ | PostgreSQL connection string |
| `SESSION_SECRET` | Production | `dev-secret` | Express session encryption |
| `OPENAI_API_KEY` | No | _(empty = mock AI)_ | OpenAI API key |
| `OPENAI_MODEL` | No | `gpt-4o-mini` | LLM model name |
| `AI_INTEGRATIONS_OPENAI_BASE_URL` | No | _(OpenAI default)_ | Custom API base URL |
| `BASE_URL` | No | `https://bharatsolve.ai` | Production domain for SEO/sitemap |
| `ALLOWED_ORIGIN` | No | _(all in dev)_ | CORS allowed origin |
| `PORT` | No | `3000` | Server port (set to `7860` for HF Spaces) |
| `NODE_ENV` | No | `development` | Set to `production` for deployments |

---

## Database Migration Guide

BharatSolve AI uses Drizzle ORM with two approaches for schema setup:

| Command | When to Use | What It Does |
|---------|-------------|--------------|
| `npm run db:push` | **First deploy** or **dev** | Syncs schema directly to DB. No migration files. Fast, but no version history. |
| `npm run db:generate` | **Schema changes** | Creates migration files in `drizzle/` from `shared/schema.ts`. Run before `db:migrate`. |
| `npm run db:migrate` | **Production** | Applies pending migration files. Use for versioned, repeatable deploys. |

### Migration Strategy by Scenario

| Scenario | Approach |
|----------|----------|
| **Brand new deploy, no DB yet** | Provision DB → set `DATABASE_URL` → run `db:push` once (or `db:migrate` if you have migrations) |
| **Existing project with migrations** | Run `db:migrate` before app start on each deploy |
| **Schema changed locally** | `npm run db:generate` → commit `drizzle/` → run `db:migrate` on deploy |

### How to Run Migrations on Each Platform

**Render, Koyeb, Hugging Face Spaces (external DB):**
- Run migrations **locally** before deploy: `DATABASE_URL=<your-connection-string> npm run db:push` (first time) or `npm run db:migrate` (if using migrations)
- Or add a **Build** or **Release** command that runs migration before start (see platform docs)

**Railway:**
- Add a one-off **Deploy Command** in the service: `npm run db:migrate && npm start`
- Or run `railway run npm run db:migrate` once after provisioning Postgres

**Fly.io:**
- Add to `fly.toml` under `[processes]` or use a release command
- Or run once: `fly ssh console` then `npm run db:migrate`

**Docker Compose (local or self-hosted):**
```bash
# Start DB, run migrations, then app
docker compose --profile migrate up
# Or: docker compose up db -d && docker compose run --rm migrate
```

**External DB (Neon, Supabase, etc.) from your machine:**
```bash
# First-time schema setup
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require" npm run db:push

# Or with migration files
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require" npm run db:migrate
```

---

## Step-by-Step Deployment Guide

### 1. Pre-Deployment (Local)

1. **Validate code:**
   ```bash
   npm run check    # TypeScript
   npm run build    # Production build
   ```

2. **Ensure `.env` is not committed** (check `.gitignore`)

3. **Commit and push** to GitHub

4. **Choose storage:** PostgreSQL (persistent) or in-memory (no DB, data resets on restart)

### 2. Provision Database (if using PostgreSQL)

- **Platform-included:** Create Postgres on Render, Railway, or Fly.io; copy `DATABASE_URL`
- **External:** Create a free DB on [Neon](https://neon.tech) or [Supabase](https://supabase.com); copy the connection string

### 3. Run Initial Migration

- **Option A (db:push):** `DATABASE_URL="<your-url>" npm run db:push`
- **Option B (db:migrate):** If you have migrations in `drizzle/`, run `DATABASE_URL="<your-url>" npm run db:migrate`

### 4. Configure Hosting Platform

- Connect GitHub repo
- Set **Environment Variables** (see table below)
- Set **Port** to `3000` (or `7860` for Hugging Face Spaces)
- Build/Start: Use Dockerfile (auto-detected) or `npm run build` + `npm start`

### 5. Deploy and Verify

- Trigger deploy (often automatic on push)
- Check logs for startup errors
- Visit deployed URL and verify: `/` loads, `/api/health` returns `200`

---

## Deployment Checklist

Use this checklist when deploying to any platform.

### Pre-Deployment

- [ ] Code is pushed to GitHub (public or private repo)
- [ ] `npm run build` succeeds locally without errors
- [ ] `npm run check` (TypeScript) passes without errors
- [ ] `.env` file is **not** committed to Git (verify `.gitignore`)
- [ ] `Dockerfile` is present at the repo root
- [ ] Decide on storage mode: **PostgreSQL** or **in-memory**

### Database Setup (if using PostgreSQL)

- [ ] Provision PostgreSQL (Neon, Supabase, Render, Railway, Fly Postgres, etc.)
- [ ] Copy connection string; add `?sslmode=require` if using Neon/Supabase
- [ ] Run initial migration: `DATABASE_URL="<url>" npm run db:push` (first time) or `npm run db:migrate` (if using migrations)
- [ ] Verify tables exist (e.g. `users`, `problems`, `user_profiles`, `sessions`)

### Platform Setup

- [ ] Create account on chosen hosting platform
- [ ] Connect GitHub repository to the platform
- [ ] Verify the platform detects the `Dockerfile` (or set build/start commands)
- [ ] Set the exposed port to `3000` (or `7860` for Hugging Face Spaces)

### Environment Variables

- [ ] Set `NODE_ENV=production`
- [ ] Set `SESSION_SECRET` to a strong random value (e.g. `openssl rand -base64 32`)
- [ ] Set `DATABASE_URL` if using PostgreSQL (copy from your DB provider)
- [ ] Set `OPENAI_API_KEY` if using real AI (leave empty for mock AI)
- [ ] Set `BASE_URL` to your actual deployed domain
- [ ] Set `ALLOWED_ORIGIN` to your domain for CORS protection

### Migration on Deploy (if using migrations)

- [ ] Ensure `db:migrate` runs before app start (platform release/deploy command, or run manually once)
- [ ] For schema changes: `npm run db:generate` locally, commit `drizzle/`, redeploy

### Post-Deployment Verification

- [ ] Application starts without errors (check platform logs)
- [ ] Landing page loads at the deployed URL
- [ ] Health check endpoint responds: `GET /api/health`
- [ ] Login flow works (dev auto-login or OIDC)
- [ ] Creating a problem returns an AI-generated solution
- [ ] Subscription and referral pages render correctly
- [ ] Custom domain configured (if applicable)
- [ ] HTTPS/TLS is active (should be automatic on all platforms)

### Performance & Monitoring

- [ ] Check cold start time (if on a sleeping platform like Render)
- [ ] Monitor RAM usage stays within free tier limits
- [ ] Set up uptime monitoring (e.g., [UptimeRobot](https://uptimerobot.com) - free) to ping the app and reduce cold starts
- [ ] Review platform logs for any runtime warnings or errors

### Security

- [ ] `SESSION_SECRET` is unique and not the default `dev-secret`
- [ ] `ALLOWED_ORIGIN` is set to restrict CORS in production
- [ ] No secrets or `.env` files are committed to Git
- [ ] Rate limiting is active (built into the app's security middleware)

---

## Quick Start Commands

### Local Pre-Flight Checks

```bash
npm run check                    # TypeScript
npm run build                    # Production build
git status                       # Ensure .env not staged
```

### Database Migration (before first deploy)

```bash
# Option A: db:push (first-time schema sync)
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require" npm run db:push

# Option B: db:migrate (if using migration files)
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require" npm run db:migrate

# Option C: Docker Compose (local Postgres)
docker compose up db -d
docker compose --profile migrate up
```

### Local Docker Test (before deploying)

```bash
# Build and run locally with Docker
docker compose up --build

# Or run without database (in-memory mode)
docker build -t bharatsolve .
docker run -p 3000:3000 -e NODE_ENV=production -e SESSION_SECRET=test-secret bharatsolve
```

### Fly.io Deployment

```bash
fly auth login
fly launch
fly postgres create
fly postgres attach <db-name>
fly secrets set SESSION_SECRET="$(openssl rand -base64 32)"
# Run migration once: fly ssh console -> npm run db:migrate (or use release command)
fly deploy
```

### Render Deployment

No CLI needed -- everything is configured through the Render dashboard at [dashboard.render.com](https://dashboard.render.com). Run migrations locally with `DATABASE_URL` before deploy, or add a build command: `npm run db:migrate && npm run build`.

### Railway Deployment

```bash
# Option A: Dashboard (recommended)
# Go to railway.app -> New Project -> Deploy from GitHub
# Add deploy command: npm run db:migrate && npm start

# Option B: CLI
npm install -g @railway/cli
railway login
railway init
railway add --plugin postgresql
railway run npm run db:migrate   # Run once after DB is linked
railway up
```

### Koyeb / Neon / Supabase (external DB)

```bash
# 1. Create free DB on Neon or Supabase
# 2. Run migration locally
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require" npm run db:push

# 3. Deploy to Koyeb; set DATABASE_URL in Koyeb env vars
```

---

*Last updated: February 2026*
