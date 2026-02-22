# BharatSolve AI — End-to-End Implementation Plan with Stage Prompts

> Generated: 2026-02-23
> Current Progress: 69% complete (99/143 tasks done)
> Remaining: 44 tasks across 9 categories
> Estimated Effort: ~120-160 hours across 10 stages

---

## How to Use This Document

This plan organizes the **remaining 44 tasks** into **10 sequential implementation stages**. Each stage includes:

1. **Objective** — what you're building and why
2. **Tasks covered** — mapped to tasklist_v2 IDs
3. **Prerequisites** — what must be done before this stage
4. **Deliverables** — what you'll have when the stage is complete
5. **Prompt** — a ready-to-use AI assistant prompt for that stage
6. **Verification checklist** — how to confirm the stage is complete

Stages are ordered by dependency and priority. Complete them in sequence, but Stages 6-10 can be parallelized where noted.

---

## Current State Summary

| Area | Status |
|---|---|
| Core app (landing, dashboard, problem creation, discussion, AI) | 100% done |
| Database layer (Drizzle, dual storage, schemas) | 100% done |
| Security (10-layer middleware, PII guard, file scanner) | 100% done |
| Privacy (policy, consent, account deletion, data export) | 100% done |
| Bugs & code quality | 100% done |
| Docker & Terraform infrastructure | 100% done |
| Multi-locale (IN/SG/HK) | 100% done |
| **Payment integration** | **0% — no real payments** |
| **Standalone auth** | **0% — depends on Replit OIDC** |
| **Testing** | **0% — no tests exist** |
| **SEO activation** | **17% — infrastructure built, not activated** |
| **UI/UX polish** | **29% — critical fixes done, polish pending** |

---

## Stage Overview

| Stage | Name | Tasks | Priority | Est. Hours |
|---|---|:---:|---|:---:|
| 1 | Standalone Authentication | 4 | P0 (Launch Blocker) | 16-20 |
| 2 | Payment Integration | 4 | P0 (Launch Blocker) | 20-24 |
| 3 | Backend Hardening | 4 | P1 (Production Readiness) | 8-12 |
| 4 | UI/UX Polish — Core | 5 | P2 (User Experience) | 12-16 |
| 5 | UI/UX Polish — Advanced | 5 | P3 (Enhancement) | 10-14 |
| 6 | Testing Framework & Tests | 5 | P1 (Quality) | 16-20 |
| 7 | SEO & Marketing Activation | 10 | P2 (Growth) | 8-12 |
| 8 | DevOps & Monitoring | 4 | P2 (Operations) | 8-10 |
| 9 | Documentation | 3 | P2 (Developer Experience) | 4-6 |
| 10 | Production Launch | — | P0 (Go-Live) | 8-12 |

---

## Stage 1: Standalone Authentication

### Objective

Replace Replit-dependent OIDC with a standalone auth system that works on any deployment. This is **P0** — without this, any non-Replit deployment auto-enables dev mode with no authentication (task 13.06 fixed dev mode detection, but there's still no real auth provider outside Replit).

### Tasks Covered

| ID | Task | Notes |
|---|---|---|
| 5.01 | Replace Replit Auth with standalone auth | Email/password + Google OAuth + phone OTP |
| 5.02 | Add user profile editing | Name, email, profile picture |
| 5.03 | Add account deletion | Backend done (15.06), needs standalone auth integration |
| 5.04 | Implement password reset flow | Email-based reset |

### Prerequisites

- None (this is Stage 1)

### Deliverables

- Email/password registration and login
- Google OAuth social login
- Password reset via email
- Profile editing page
- Session management independent of Replit

### Prompt

```
I have an Express 5 + React 18 TypeScript app (monorepo: client/, server/, shared/).
Current auth is in server/replit_integrations/auth/ and depends on Replit OIDC (REPL_ID env var).
Dev mode detection is already fixed to use NODE_ENV !== "production" (not REPL_ID).
Sessions use express-session with memorystore (dev) or connect-pg-simple (prod).
The IStorage interface is in server/storage.ts with MemoryStorage and DatabaseStorage.
User schema is in shared/models/auth.ts and shared/schema.ts (Drizzle ORM, PostgreSQL).
Account deletion endpoint already exists: DELETE /api/profile (from privacy compliance work).

TASK: Replace Replit OIDC with standalone authentication. Implement:

1. EMAIL/PASSWORD AUTH:
   - Add password_hash, email_verified, verification_token, reset_token, reset_token_expires
     columns to the users table in shared/schema.ts
   - POST /api/auth/register — email + password registration with bcrypt hashing, Zod
     validation (min 8 chars, must have uppercase + number), auto-create user_profiles
     with 30-day trial
   - POST /api/auth/login — email + password login, create session
   - POST /api/auth/forgot-password — generate reset token, send email
   - POST /api/auth/reset-password — verify token, update password
   - POST /api/auth/verify-email — verify email token
   - Keep dev auto-login fallback when NODE_ENV=development

2. GOOGLE OAUTH:
   - Use passport-google-oauth20
   - GET /api/auth/google — redirect to Google
   - GET /api/auth/google/callback — handle callback, upsert user, create session
   - Environment variables: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
   - When no Google credentials, gracefully hide the button (don't crash)

3. FRONTEND AUTH PAGES:
   - client/src/pages/Login.tsx — email/password form + "Sign in with Google" button +
     "Forgot password?" link. Redirect to /dashboard if already logged in.
   - client/src/pages/Register.tsx — registration form with password strength indicator,
     link to login
   - client/src/pages/ForgotPassword.tsx — email input form
   - client/src/pages/ResetPassword.tsx — new password form (accepts token from URL)
   - All pages use shadcn/ui components, saffron/green theme, Framer Motion animations

4. PROFILE EDITING:
   - client/src/pages/Profile.tsx — form to update name, email, profile picture (with
     image upload via existing multer setup)
   - PUT /api/profile — update user fields
   - Reuse existing useProfile hook, add mutation

5. ROUTING UPDATES:
   - Add routes in client/src/App.tsx using Wouter: /login, /register, /forgot-password,
     /reset-password/:token, /profile
   - Update useAuth hook to handle new auth flow
   - Redirect unauthenticated users to /login instead of /api/login
   - Update Landing.tsx CTA buttons to link to /register

6. MIGRATION:
   - Keep backward compatibility with existing users table structure
   - Old Replit auth code can remain but should only activate when REPL_ID is set
   - New auth is the default when REPL_ID is NOT set and NODE_ENV=production

Add bcrypt and passport-google-oauth20 to dependencies.
Use the existing security middleware (rate limiting, CSRF) — the login rate limiter
(10/15min) already exists in server/middleware/security.ts.
```

### Verification Checklist

- [ ] Can register with email/password
- [ ] Can login with email/password
- [ ] Can login with Google (when credentials configured)
- [ ] Password reset email flow works
- [ ] Profile editing saves changes
- [ ] Dev auto-login still works in development
- [ ] Sessions persist across server restarts (with PostgreSQL)
- [ ] Rate limiting applies to auth endpoints
- [ ] Existing account deletion flow still works

---

## Stage 2: Payment Integration

### Objective

Replace the fake subscription toggle with real payment processing. Using Lemon Squeezy as the Merchant of Record (no business entity needed, handles global tax). See `docs/payment-options-hk.md` for the full analysis.

### Tasks Covered

| ID | Task | Notes |
|---|---|---|
| 4.01 | Integrate payment gateway | Lemon Squeezy (MoR, no business entity) |
| 4.02 | Implement subscription enforcement | Middleware to check status before AI endpoints |
| 4.03 | Add subscription management page | Billing history, cancel, update payment |
| 4.04 | Implement referral reward fulfillment | Connect referrals to payment system |

### Prerequisites

- Stage 1 (standalone auth — need real user accounts for billing)

### Deliverables

- Lemon Squeezy checkout integration
- Webhook handler for subscription lifecycle
- Subscription enforcement middleware
- Billing management page
- Referral rewards connected to subscription extension

### Prompt

```
I have an Express 5 + React 18 TypeScript monorepo (client/, server/, shared/).
The subscription system currently has:
- user_profiles table with: subscription_status (trial/active/expired), trial_start_date,
  referral_code, referred_by, free_months_earned
- POST /api/profile/subscribe just sets subscription_status='active' with ZERO payment
- 30-day trial tracked via trial_start_date
- Referral system works in DB but doesn't extend subscriptions via payments
- Multi-locale pricing: IN ₹499, SG S$15, HK HK$99, JP ¥1,500, US $10, GB £8, etc.

The app uses Lemon Squeezy as the payment provider (Merchant of Record).
Locale system is in shared/locales.ts with pricing per locale.
Storage layer uses IStorage interface (server/storage.ts) with Memory and Database
implementations.

TASK: Integrate Lemon Squeezy for real subscription payments.

1. SCHEMA UPDATES (shared/schema.ts):
   - Add to user_profiles: lemon_squeezy_customer_id, subscription_id (external),
     current_period_end (timestamp), cancel_at_period_end (boolean),
     payment_status (active/past_due/cancelled/none)
   - Add new table: payment_events (id, user_id, event_type, provider_event_id,
     amount, currency, metadata jsonb, created_at) — for audit trail

2. BACKEND — CHECKOUT & WEBHOOKS:
   - Install @lemonsqueezy/lemonsqueezy.js SDK
   - POST /api/checkout — create Lemon Squeezy checkout session for the user's locale
     pricing. Return checkout URL. Requires auth.
   - POST /api/webhooks/lemonsqueezy — webhook handler (NO auth middleware).
     Verify webhook signature using LEMONSQUEEZY_WEBHOOK_SECRET.
     Handle events:
       * subscription_created → set subscription_status='active', store IDs, set
         current_period_end
       * subscription_updated → update current_period_end, handle plan changes
       * subscription_cancelled → set cancel_at_period_end=true
       * subscription_expired → set subscription_status='expired'
       * subscription_payment_failed → set payment_status='past_due'
       * subscription_payment_success → set payment_status='active'
     Log all events to payment_events table.
   - GET /api/subscription — return current subscription details + billing portal URL

3. SUBSCRIPTION ENFORCEMENT MIDDLEWARE:
   - Create server/middleware/subscription.ts
   - requireActiveSubscription middleware that checks:
     a) Is user in active trial (trial_start_date + 30 days > now AND free_months > 0)?
     b) Is subscription_status='active' AND current_period_end > now?
     c) If neither → return 403 { error: 'subscription_required', trialExpired: true }
   - Apply to: POST /api/problems, POST /api/problems/:id/messages,
     POST /api/problems/batch, all AI endpoints
   - Do NOT apply to: GET endpoints, auth, profile, webhook, health

4. REFERRAL REWARD FULFILLMENT:
   - When a referral code is applied (POST /api/profile/referral), if both users have
     active subscriptions, use Lemon Squeezy API to add 30 free days to both
   - If referrer/referee is on trial, add free_months_earned to extend trial by 30 days
   - Update applyReferral in storage to also call Lemon Squeezy API when applicable

5. FRONTEND — SUBSCRIPTION FLOW:
   - Update SubscriptionCard.tsx: "Subscribe" button now calls POST /api/checkout and
     redirects to Lemon Squeezy checkout URL. Show loading state during redirect.
   - Create client/src/pages/Billing.tsx:
     * Current plan display (trial/active/expired with dates)
     * Usage stats (problems created this month)
     * "Manage Subscription" button → Lemon Squeezy customer portal
     * Payment history from payment_events
     * Cancel subscription option with confirmation dialog
   - Handle 403 subscription_required in the global error handler (queryClient.ts):
     show a modal/toast with "Your trial has expired. Subscribe to continue."
     with a CTA button to /billing
   - Add /billing route in App.tsx

6. ENVIRONMENT VARIABLES:
   - LEMONSQUEEZY_API_KEY
   - LEMONSQUEEZY_STORE_ID
   - LEMONSQUEEZY_WEBHOOK_SECRET
   - Add to .env.example with documentation

Ensure the webhook endpoint is excluded from CSRF protection, JSON body parsing
(needs raw body for signature verification), and rate limiting.
The webhook should be idempotent (handle duplicate events gracefully using
provider_event_id).
```

### Verification Checklist

- [ ] Clicking Subscribe redirects to Lemon Squeezy checkout
- [ ] Successful payment activates subscription via webhook
- [ ] Expired trial users cannot create problems (get 403)
- [ ] Active subscribers can use all features
- [ ] Billing page shows correct subscription status
- [ ] Cancel subscription works and respects current period end
- [ ] Referral rewards extend subscription/trial correctly
- [ ] Webhook handles duplicate events safely
- [ ] Payment events logged for audit

---

## Stage 3: Backend Hardening

### Objective

Production-ready backend with proper migrations, structured logging, email service, and API versioning.

### Tasks Covered

| ID | Task | Notes |
|---|---|---|
| 8.02 | Implement proper database migrations | Versioned, reversible migrations |
| 8.03 | Add structured logging | Pino with JSON output |
| 8.04 | Add email service | For auth flows + notifications |
| 8.05 | Add API versioning | /api/v1/ prefix |

### Prerequisites

- Stage 1 (auth needs email service for password reset)
- Can be done in parallel with Stage 2

### Deliverables

- Drizzle Kit migration workflow
- Pino structured logging with request correlation IDs
- Email service (Resend) for transactional emails
- API routes under /api/v1/ with backward compatibility

### Prompt

```
I have an Express 5 TypeScript backend (server/) with Drizzle ORM (PostgreSQL).
Current state:
- Database migrations use `drizzle-kit push` (schema push, no versioning)
- Logging is console.log/warn/error only, privacy-aware (no PII logged)
- No email service exists (needed for auth password resets, subscription receipts)
- All routes are at /api/* with no version prefix
- drizzle.config.ts exists at project root

TASK: Harden the backend for production.

1. PROPER DATABASE MIGRATIONS:
   - Switch from `drizzle-kit push` to `drizzle-kit generate` + `drizzle-kit migrate`
   - Update drizzle.config.ts to output migrations to `drizzle/` folder
   - Add npm scripts: "db:generate" (drizzle-kit generate), "db:migrate"
     (drizzle-kit migrate), keep "db:push" for dev convenience
   - Update docker-compose.yml migrate service to use db:migrate instead of db:push
   - Add drizzle/ folder to .gitignore exceptions (track migration files)
   - Generate initial migration from current schema as baseline

2. STRUCTURED LOGGING (pino):
   - Install pino and pino-pretty (dev dependency)
   - Create server/lib/logger.ts:
     * Export a pino logger instance
     * JSON format in production, pretty in development
     * Log levels: trace/debug/info/warn/error/fatal
     * Base fields: service='bharatsolve-api', environment, version from package.json
   - Create request logging middleware:
     * Generate unique request ID (crypto.randomUUID)
     * Attach to req and response header (X-Request-ID)
     * Log request start: method, path, userAgent (info level)
     * Log request end: method, path, statusCode, duration_ms (info level)
     * Log errors: include requestId for correlation (error level)
   - Replace ALL console.log/warn/error calls across server/ with logger calls
   - Ensure NO PII is logged (maintain current privacy-aware logging)
   - Add LOG_LEVEL env var (default: 'info' in prod, 'debug' in dev)

3. EMAIL SERVICE (Resend):
   - Install resend SDK
   - Create server/lib/email.ts:
     * Initialize Resend client with RESEND_API_KEY
     * If no API key, log a warning and return mock success (dev mode)
     * Export functions:
       - sendWelcomeEmail(to, name)
       - sendPasswordResetEmail(to, name, resetUrl)
       - sendEmailVerification(to, name, verifyUrl)
       - sendSubscriptionConfirmation(to, name, plan, nextBillingDate)
       - sendSubscriptionCancelled(to, name, endDate)
     * All emails use a simple, clean HTML template with BharatSolve AI branding
       (saffron header, logo, footer with unsubscribe)
     * From address: noreply@bharatsolve.ai (configurable via EMAIL_FROM env var)
   - Wire into auth flows (Stage 1) and payment webhooks (Stage 2)
   - Add RESEND_API_KEY and EMAIL_FROM to .env.example

4. API VERSIONING:
   - Create a router factory: server/lib/api-router.ts that prefixes all routes
   - Mount current routes under both /api/* (backward compat) and /api/v1/*
   - Add a deprecation header on /api/* (non-versioned) responses:
     Deprecation: true, Sunset: <date 6 months from now>
   - Document the versioning strategy in a code comment
   - Update shared/routes.ts path definitions to use /api/v1/ prefix
   - Update all frontend API calls to use /api/v1/
   - Keep /api/health and /api/webhooks/* unversioned (infrastructure endpoints)

Add pino, pino-pretty (dev), and resend to package.json.
```

### Verification Checklist

- [ ] `npm run db:generate` creates migration SQL files in `drizzle/`
- [ ] `npm run db:migrate` applies pending migrations
- [ ] Server logs are JSON in production, pretty in development
- [ ] Every request has X-Request-ID header
- [ ] Email sends (or logs mock) for each template
- [ ] /api/v1/* routes work identically to /api/* routes
- [ ] /api/* routes include Deprecation header

---

## Stage 4: UI/UX Polish — Core

### Objective

Improve the daily user experience with skeleton loading, navigation, search/filter, pagination, and problem categories.

### Tasks Covered

| ID | Task | Notes |
|---|---|---|
| 7.01 | Improve loading states with skeletons | Replace spinners/pulse with Skeleton |
| 7.02 | Implement sidebar navigation | Use existing ui/sidebar.tsx |
| 7.05 | Add problem categories/tags | New category column |
| 7.06 | Add problem search and filter | Text search + filter controls |
| 7.07 | Add pagination on problem list | Server-side pagination |

### Prerequisites

- None (can run in parallel with Stages 1-3)

### Deliverables

- Skeleton loading states matching content layout
- Desktop sidebar navigation
- Problem categories for creation and filtering
- Search bar with text + category + status filters
- Paginated problem list (server-side)

### Prompt

```
I have a React 18 + TypeScript app with shadcn/ui, Tailwind CSS, TanStack React Query.
Pages: Landing.tsx, Dashboard.tsx, ProblemDetail.tsx, PrivacyPolicy.tsx.
Components exist: ui/skeleton.tsx (unused), ui/sidebar.tsx (unused),
ui/pagination.tsx (unused).
Data fetching hooks in client/src/hooks/: use-problems.ts (useProblems, useCreateProblem),
use-auth.ts, use-profile.ts, use-discussion.ts.
Backend API: GET /api/problems returns all problems, POST /api/problems creates one.
Storage interface: IStorage in server/storage.ts.
Schema: shared/schema.ts (Drizzle, problems table has: id, userId, title, description,
language, solution, status, createdAt).

TASK: Implement 5 UI/UX improvements.

1. SKELETON LOADING STATES:
   - Create a DashboardSkeleton component matching the Dashboard layout:
     * Grid of 6 ProblemCard-shaped skeletons (title bar, 2 description lines, badge)
     * SubscriptionCard skeleton
     * ReferralCard skeleton
   - Create a ProblemDetailSkeleton matching ProblemDetail layout:
     * Title skeleton, status badge, description block, solution block
     * 3 message bubble skeletons
   - Replace current animate-pulse divs in Dashboard and spinner in ProblemDetail
     with these skeleton components
   - Show skeletons when TanStack Query isLoading is true

2. SIDEBAR NAVIGATION:
   - Create client/src/components/AppLayout.tsx wrapping authenticated pages
   - Desktop (>=1024px): fixed left sidebar (280px) with:
     * BrandLogo at top
     * Nav items: Dashboard (LayoutDashboard icon), My Problems (MessageSquare),
       Billing (CreditCard), Profile (User), Privacy (Shield)
     * Active item highlighted with saffron accent
     * Theme toggle at bottom
     * Logout button at bottom
   - Mobile (<1024px): collapsible sheet sidebar triggered by hamburger menu in header
   - Use the existing ui/sidebar.tsx component as the base
   - Wrap Dashboard, ProblemDetail, Billing, Profile pages with AppLayout
   - Landing and auth pages should NOT have the sidebar

3. PROBLEM CATEGORIES:
   - Add 'category' column to problems table in shared/schema.ts:
     pgEnum('problem_category', ['family', 'career', 'relationships', 'finance',
     'health', 'legal', 'education', 'community', 'elder_care', 'other'])
   - Default: 'other', nullable for backward compat with existing problems
   - Update CreateProblemDialog.tsx: add a category Select dropdown (with Lucide icons
     per category) between title and description fields
   - Update the AI system prompt in server/routes.ts to include category context:
     "The user has categorized this as a {category} problem..."
   - Update ProblemCard.tsx to show a colored category badge
   - Update ProblemDetail.tsx header to show category

4. SEARCH AND FILTER:
   - Add a search/filter bar at the top of Dashboard above the problem grid:
     * Text search Input (searches title + description, debounced 300ms)
     * Category Select filter (multi-select with "All" option)
     * Status Select filter (All, Pending, Solved)
     * Language Select filter (All + 12 languages)
     * "Clear filters" button when any filter is active
   - Filtering should be SERVER-SIDE for efficiency
   - Update GET /api/problems to accept query params: ?q=, ?category=, ?status=,
     ?language=, ?page=, ?limit=
   - Update IStorage.getProblems() to accept filter options
   - Update both MemoryStorage and DatabaseStorage
   - Update useProblems hook to pass filter params

5. PAGINATION:
   - GET /api/problems returns: { problems: Problem[], total: number, page: number,
     limit: number, totalPages: number }
   - Default: page=1, limit=12
   - Use ui/pagination.tsx at the bottom of the Dashboard problem grid
   - Show "Showing X-Y of Z problems" text
   - Update useProblems hook to accept { page, limit } and include them in query key
     (so TanStack Query caches per page)
   - Maintain filter state across page changes

Use Lucide icons for all new UI elements. Maintain the saffron/green/blue theme.
Animations with Framer Motion for filter bar entrance.
```

### Verification Checklist

- [ ] Skeletons appear during data loading (match content shape)
- [ ] Sidebar navigation works on desktop and mobile
- [ ] Can create problems with categories
- [ ] Category badge shows on problem cards
- [ ] Text search filters problems in real-time (debounced)
- [ ] Category, status, and language filters work
- [ ] Pagination controls work and show correct counts
- [ ] Filters persist across page changes
- [ ] Clear filters button resets all filters

---

## Stage 5: UI/UX Polish — Advanced

### Objective

Advanced UX improvements: analytics charts, real-time updates, onboarding, notifications, and mobile polish.

### Tasks Covered

| ID | Task | Notes |
|---|---|---|
| 7.03 | Add analytics charts to dashboard | recharts (already installed) |
| 7.04 | Implement WebSocket real-time updates | ws (already installed) |
| 7.08 | Add onboarding/welcome flow | First-time user guidance |
| 7.09 | Add persistent notification system | Bell icon, notification center |
| 7.10 | Mobile responsiveness audit | 320px-768px verification |

### Prerequisites

- Stage 4 (sidebar, categories exist for charts/notifications)
- Stage 1 (auth for onboarding flow)

### Deliverables

- Analytics section on dashboard with problem trends
- WebSocket for real-time AI streaming
- Onboarding modal for new users
- Notification center with bell icon
- Mobile-optimized responsive layout

### Prompt

```
I have a React 18 + TypeScript app with shadcn/ui, Tailwind CSS, TanStack React Query,
Framer Motion. Backend is Express 5 with WebSocket support (ws package installed).
recharts is installed with a ui/chart.tsx wrapper. use-mobile.tsx hook exists.
Users have problems with categories, subscription with trial tracking, referral system.
Dashboard has a sidebar (from Stage 4).

TASK: Implement 5 advanced UI/UX improvements.

1. ANALYTICS CHARTS ON DASHBOARD:
   - Add a collapsible "Analytics" section at the top of the Dashboard (below header,
     above problem grid)
   - Use recharts via the existing ui/chart.tsx wrapper
   - Charts (responsive, themed with saffron/green/blue):
     a) Problem submissions over time — AreaChart showing problems created per week
        (last 8 weeks)
     b) Category breakdown — PieChart/DonutChart of problems by category
     c) Status overview — simple stat cards: Total, Pending, Solved, This Month
   - Add GET /api/analytics endpoint returning aggregated data (auth required)
   - Add analytics method to IStorage interface + both implementations
   - Charts should gracefully show "No data yet" when user has 0 problems

2. WEBSOCKET REAL-TIME UPDATES:
   - Create server/ws.ts:
     * Upgrade HTTP server to support WebSocket (use existing ws package)
     * Authenticate WebSocket connections via session cookie
     * Events: 'problem:solved' (when AI solution is ready), 'discussion:reply'
       (when AI responds), 'subscription:updated', 'notification:new'
   - Create client/src/hooks/use-websocket.ts:
     * Connect to ws://host/ws on mount (with reconnect logic, exponential backoff)
     * Parse incoming events and dispatch to appropriate handlers
     * Auto-invalidate relevant TanStack Query caches on events
   - Use WebSocket for AI solution streaming:
     * When creating a problem, return immediately with status='pending'
     * Stream AI response via WebSocket, update problem when complete
     * Show real-time typing indicator on ProblemDetail
   - Graceful fallback: if WebSocket fails, fall back to polling (current behavior)

3. ONBOARDING/WELCOME FLOW:
   - Show a multi-step welcome dialog on first login (check localStorage flag):
     Step 1: "Welcome to BharatSolve AI!" — brief intro with app screenshot
     Step 2: "How it works" — 3 icons: Describe → AI Solves → Discuss
     Step 3: "Your free trial" — "You have 30 days free. Create your first problem!"
       with a CTA button that opens CreateProblemDialog
   - Use shadcn Dialog with step indicators (dots)
   - Animate transitions between steps with Framer Motion
   - Set localStorage 'onboarding_complete' = true when dismissed
   - Also show inline tips on empty states:
     * Empty dashboard: "No problems yet — click + to create your first one"
     * Empty discussion: "Ask follow-up questions to get more specific advice"

4. PERSISTENT NOTIFICATION SYSTEM:
   - Add a notifications table: id, user_id, type (enum), title, message, read
     (boolean), metadata (jsonb), created_at
   - Types: referral_applied, subscription_changed, solution_ready, trial_expiring,
     system_announcement
   - Backend: POST /api/notifications/mark-read, GET /api/notifications (with
     unread count), auto-create notifications on relevant events
   - Frontend: Bell icon in sidebar header showing unread count badge
   - Notification dropdown/sheet: list of notifications with time stamps,
     click to mark read, "Mark all read" button
   - Create useNotifications hook with TanStack Query
   - Push new notifications via WebSocket (from task 2 above)
   - Auto-create notifications: "Your AI solution is ready!", "Trial expires in 3 days",
     "Referral code applied — 1 free month earned!"

5. MOBILE RESPONSIVENESS AUDIT & FIXES:
   - Test and fix all pages at 320px, 375px, 414px, 768px breakpoints:
     a) Landing page: ensure hero text doesn't overflow, feature grid stacks to 1 column,
        testimonials scroll horizontally, pricing cards stack vertically
     b) Dashboard: problem grid 1 column on mobile, sidebar becomes sheet,
        analytics charts scroll horizontally if needed, search/filter stacks vertically
     c) ProblemDetail: chat bubbles max 85% width on mobile, attachment preview grid
        2 columns on mobile, input bar sticky at bottom
     d) CreateProblemDialog: full-screen on mobile (not centered dialog)
     e) Auth pages: centered, max-width 400px, full-width inputs
   - Use the existing use-mobile hook for breakpoint detection
   - Add touch-friendly targets (min 44px tap targets)
   - Ensure no horizontal scroll on any page at any width
```

### Verification Checklist

- [ ] Analytics charts render with real data
- [ ] Charts show "No data yet" for new users
- [ ] WebSocket connects and receives real-time events
- [ ] AI streaming shows typing indicator
- [ ] Onboarding shows on first login only
- [ ] Bell icon shows unread notification count
- [ ] Notification list updates in real-time
- [ ] All pages render correctly at 320px width
- [ ] No horizontal scroll on mobile
- [ ] Touch targets are at least 44px

---

## Stage 6: Testing Framework & Tests

### Objective

Establish a testing foundation with unit tests, API integration tests, component tests, and E2E tests.

### Tasks Covered

| ID | Task | Notes |
|---|---|---|
| 9.01 | Set up testing framework | Vitest + Playwright |
| 9.02 | Write API endpoint tests | All routes in server/routes.ts |
| 9.03 | Write component tests | Key UI components |
| 9.04 | Write E2E tests | Critical user flows |
| 9.05 | Set up CI/CD pipeline | GitHub Actions |

### Prerequisites

- Stage 1 (auth system to test auth flows)
- Stage 2 (payment to test subscription enforcement)
- Can start framework setup (9.01, 9.05) in parallel with earlier stages

### Deliverables

- Vitest configured for unit + integration tests
- Playwright configured for E2E tests
- 80%+ route coverage in API tests
- Component tests for 5 key components
- E2E tests for 3 critical user flows
- GitHub Actions CI pipeline

### Prompt

```
I have a TypeScript monorepo: client/ (React 18, Vite), server/ (Express 5),
shared/ (Drizzle schemas, Zod). Build: Vite + esbuild. Package manager: npm.
No tests exist currently. No .github/ directory exists.

TASK: Set up a complete testing framework and write tests.

1. TESTING FRAMEWORK SETUP:
   - Install: vitest, @testing-library/react, @testing-library/jest-dom,
     @testing-library/user-event, jsdom, @playwright/test, supertest,
     @types/supertest
   - Create vitest.config.ts (separate from vite.config.ts):
     * Two test environments: 'node' for server tests, 'jsdom' for client tests
     * Path aliases matching vite.config.ts (@/, @shared/)
     * Coverage with v8 provider, thresholds: 60% statements
     * Exclude: node_modules, dist, *.config.*, client/src/components/ui/
   - Create playwright.config.ts:
     * Base URL: http://localhost:3000
     * Projects: chromium, mobile-chrome
     * Web server: npm run dev (auto-start)
     * Screenshot on failure
   - Add scripts to package.json:
     "test": "vitest run"
     "test:watch": "vitest"
     "test:coverage": "vitest run --coverage"
     "test:e2e": "playwright test"
     "test:e2e:ui": "playwright test --ui"

2. API ENDPOINT TESTS (server/__tests__/):
   Create a test helper that:
   - Creates an Express app with all routes registered
   - Uses MemoryStorage (no DB needed for tests)
   - Provides an authenticated session (mock session middleware)
   - Provides a helper to create test users and problems

   Write tests for:
   a) server/__tests__/auth.test.ts:
      - Registration: success, duplicate email, weak password, missing fields
      - Login: success, wrong password, non-existent user
      - Logout: clears session
      - GET /api/auth/user: returns user when authenticated, 401 when not
   b) server/__tests__/problems.test.ts:
      - Create problem: success with mock AI, validation errors, auth required
      - List problems: returns only user's problems, empty list for new user
      - Get problem by ID: success, 404 for non-existent, 403 for other user's
   c) server/__tests__/discussion.test.ts:
      - Send message: success, auth required, problem not found
      - List messages: returns messages in order, empty for new problem
      - File attachment handling
   d) server/__tests__/subscription.test.ts:
      - Trial status calculation (active, expired, extended by referral)
      - Subscription enforcement middleware (allow active, block expired)
      - Referral code application (success, already used, own code)
   e) server/__tests__/profile.test.ts:
      - Get profile, update profile, delete account, export data

3. COMPONENT TESTS (client/src/__tests__/):
   Write tests for key components using @testing-library/react:
   a) CreateProblemDialog.test.tsx:
      - Opens on trigger click
      - Form validation (empty title, description too short)
      - Language selector shows 12 languages
      - Category selector shows all categories
      - Submit calls mutation with correct data
   b) ProblemCard.test.tsx:
      - Renders title, description preview, status badge, category badge
      - Click navigates to problem detail
      - Keyboard accessible (Enter/Space)
   c) SubscriptionCard.test.tsx:
      - Shows trial days remaining
      - Shows "Trial Expired" when expired
      - Shows "Premium Active" when subscribed
      - Subscribe button links to checkout
   d) SocialShare.test.tsx:
      - Renders all 5 platform buttons
      - WhatsApp link has correct URL encoding
      - Copy link copies to clipboard
   e) ReferralCard.test.tsx:
      - Shows referral code
      - Copy button works
      - Apply code input and submit

4. E2E TESTS (e2e/):
   Write Playwright E2E tests for critical flows:
   a) e2e/auth-flow.spec.ts:
      - Register → verify redirect to dashboard → logout → login
   b) e2e/problem-flow.spec.ts:
      - Login → create problem (fill form, select category + language) →
        see AI solution → send follow-up message → see AI reply
   c) e2e/subscription-flow.spec.ts:
      - Login → check trial status → verify problem creation works →
        (mock) trial expired → verify problem creation blocked → see upgrade prompt

   Use dev mode (NODE_ENV=development) so no external services needed.
   Use mock AI (no OPENAI_API_KEY).

5. GITHUB ACTIONS CI PIPELINE (.github/workflows/ci.yml):
   Triggered on: push to main, pull requests to main
   Jobs:
   a) lint-and-typecheck:
      - npm ci
      - npm run check (TypeScript)
   b) unit-tests:
      - npm ci
      - npm test -- --coverage
      - Upload coverage report as artifact
   c) build:
      - npm ci
      - npm run build
      - Upload dist/ as artifact
   d) e2e-tests (depends on build):
      - Install Playwright browsers
      - npm run test:e2e
      - Upload test results and screenshots as artifacts
   e) docker-build:
      - Build Docker image (don't push, just verify it builds)

   Use Node.js 20, ubuntu-latest. Cache npm dependencies.
   Add branch protection rules comment in the workflow file.
```

### Verification Checklist

- [ ] `npm test` runs and passes all unit/integration tests
- [ ] `npm run test:coverage` shows >60% coverage
- [ ] `npm run test:e2e` runs Playwright tests successfully
- [ ] GitHub Actions pipeline runs on push to main
- [ ] All CI jobs pass (lint, test, build, e2e, docker)
- [ ] Test failures produce clear error messages

---

## Stage 7: SEO & Marketing Activation

### Objective

Activate all the SEO infrastructure that was built but not connected to real services.

### Tasks Covered

| ID | Task | Notes |
|---|---|---|
| 6.01 | Activate Google Tag Manager | Replace GTM-XXXXXXX |
| 6.02 | Configure GA4 in GTM | Custom events |
| 6.03 | Submit sitemap to Google Search Console | Manual step + prompt |
| 6.04 | Submit sitemap to Bing Webmaster Tools | Manual step |
| 6.05 | Validate structured data | Rich Results Test |
| 6.06 | Test social previews | All platforms |
| 6.07 | Generate PWA icon set | Multiple sizes + service worker |
| 6.08 | Add social media profile links | JSON-LD sameAs |
| 6.09 | Add Twitter/X handle | twitter:site meta |
| 6.12 | Make index.html meta tags locale-aware | Dynamic based on locale |

### Prerequisites

- Production domain configured (task 2.04 already done)
- OG image exists (task 2.01 already done)

### Deliverables

- GTM active with GA4 tracking
- Sitemaps submitted to Google and Bing
- Validated structured data
- PWA icons at all required sizes
- Social previews working on all platforms

### Prompt

```
I have a React 18 SPA with Express 5 backend serving static files.
SEO infrastructure is built but NOT activated:
- client/index.html has GTM snippets commented out with GTM-XXXXXXX placeholder
- client/index.html has JSON-LD for Organization, WebApplication, FAQPage
- Unused GTM preconnect already removed (task 6.10 done)
- Fake aggregateRating already removed (task 6.10 done)
- OG image exists at client/public/og-image.png (1200x630px)
- Dynamic sitemap at GET /sitemap.xml
- robots.txt at client/public/robots.txt
- server/static.ts injects locale-aware meta for social crawlers
- client/public/manifest.json has PWA config but only favicon.png icon
- Multi-locale system: IN, SG, HK (shared/locales.ts)
- useDocumentHead hook for per-page SEO

TASK: Activate all SEO and marketing infrastructure.

1. GOOGLE TAG MANAGER ACTIVATION:
   - In client/index.html, uncomment both GTM snippets (head + body noscript)
   - Replace GTM-XXXXXXX with a configurable approach:
     * Add a <script> that reads window.__GTM_ID__ (set by server-side injection)
     * In server/static.ts, inject GTM_ID from process.env.GTM_CONTAINER_ID
     * If no GTM_CONTAINER_ID, don't inject GTM (safe for dev)
   - Add GTM_CONTAINER_ID to .env.example
   - Add a dataLayer.push helper utility in client/src/lib/analytics.ts:
     * trackEvent(eventName, params) — pushes to GTM dataLayer
     * Export named event functions:
       - trackSignUp() — fires on registration
       - trackStartTrial() — fires when trial begins
       - trackSubmitProblem(category, language) — fires on problem creation
       - trackSubscriptionPurchase(plan, currency, amount) — fires on subscribe
       - trackReferralShared() — fires when referral code is copied
       - trackSocialShare(platform) — fires on social share click
   - Wire these into the appropriate components:
     * Register page → trackSignUp()
     * CreateProblemDialog → trackSubmitProblem()
     * SubscriptionCard/Billing → trackSubscriptionPurchase()
     * ReferralCard copy → trackReferralShared()
     * SocialShare → trackSocialShare()

2. PWA ICON SET + SERVICE WORKER:
   - Create icons at these sizes from the existing favicon.png:
     48x48, 72x72, 96x96, 128x128, 144x144, 192x192, 384x384, 512x512
     (use sharp or canvas in a script, or provide manual instructions)
   - Update client/public/manifest.json icons array with all sizes
   - Add a maskable icon variant (512x512 with padding)
   - Create a basic service worker (client/public/sw.js):
     * Cache-first for static assets (JS, CSS, images)
     * Network-first for API calls
     * Offline fallback page showing "You're offline" with BharatSolve branding
   - Register service worker in client/src/main.tsx (production only)

3. LOCALE-AWARE META TAGS IN INDEX.HTML:
   - The server-side crawler injection (server/static.ts) already handles this for
     social crawlers. For the client-side SPA:
   - Update useDocumentHead hook to also set:
     * <meta property="og:locale"> based on current locale context
     * <meta name="geo.region"> based on locale (IN, SG, HK)
     * <link rel="alternate" hreflang="..."> for each locale
   - The default index.html should have generic (non-locale-specific) meta as fallback

4. SOCIAL MEDIA LINKS:
   - Update Organization JSON-LD in client/index.html:
     * Add "sameAs" array — leave as template variables injected by server
     * In server/static.ts, inject real social URLs from env vars:
       SOCIAL_TWITTER, SOCIAL_LINKEDIN, SOCIAL_FACEBOOK, SOCIAL_INSTAGRAM
   - Add <meta name="twitter:site" content="@BharatSolveAI"> (configurable via
     TWITTER_HANDLE env var)

5. VALIDATION & TESTING INSTRUCTIONS:
   Create docs/seo-validation-checklist.md with step-by-step instructions:
   - How to set up GTM account and get container ID
   - How to configure GA4 property in GTM with the 6 custom events
   - How to submit sitemap to Google Search Console (with screenshots guide)
   - How to submit sitemap to Bing Webmaster Tools
   - How to validate JSON-LD at https://search.google.com/test/rich-results
   - How to test social previews on Facebook, LinkedIn, Twitter, WhatsApp
   - How to verify PWA installability in Chrome DevTools
```

### Verification Checklist

- [ ] GTM loads when GTM_CONTAINER_ID is set
- [ ] GTM does NOT load when GTM_CONTAINER_ID is not set
- [ ] Analytics events fire on user actions (check GTM preview mode)
- [ ] PWA icons show at all sizes in manifest
- [ ] Service worker caches static assets
- [ ] Offline fallback page shows
- [ ] Social previews work on Facebook, LinkedIn, Twitter
- [ ] JSON-LD passes Rich Results Test
- [ ] Locale-specific meta tags update on locale switch
- [ ] SEO validation checklist document is complete

---

## Stage 8: DevOps & Monitoring

### Objective

Production monitoring, error tracking, CDN configuration, and database backups.

### Tasks Covered

| ID | Task | Notes |
|---|---|---|
| 10.02 | Set up error monitoring (Sentry) | React + Express |
| 10.03 | Set up uptime monitoring | Health endpoint (8.01 already done) |
| 10.04 | Configure CDN for static assets | Cloudflare or CloudFront |
| 10.05 | Set up database backups | Automated pg_dump |

### Prerequisites

- Stage 3 (structured logging for context in Sentry)
- Health endpoint already exists (GET /api/health)

### Deliverables

- Sentry error tracking for client and server
- Uptime monitoring via external service
- CDN for static assets with cache headers
- Automated daily database backups

### Prompt

```
I have a TypeScript monorepo deployed via Docker on AWS ECS Fargate (Terraform in
infrastructure/). Express 5 backend, React 18 frontend, PostgreSQL via RDS.
Health endpoint: GET /api/health returns { status: "ok", timestamp }.
Build: Vite (client to dist/public/) + esbuild (server to dist/index.cjs).
Structured logging via pino (from Stage 3).
Source maps enabled in production (script/build.ts has sourcemap: true).

TASK: Set up production monitoring and operations infrastructure.

1. SENTRY ERROR MONITORING:
   - Install @sentry/react (client) and @sentry/node (server)
   - Client (client/src/main.tsx):
     * Initialize Sentry with VITE_SENTRY_DSN env var
     * BrowserTracing integration for performance monitoring
     * React error boundary integration (enhance existing ErrorBoundary)
     * Set environment (development/production) and release (package.json version)
     * Filter out: network errors from ad blockers, ResizeObserver loop errors
     * Sample rate: 1.0 for errors, 0.1 for transactions (10%)
   - Server (server/index.ts):
     * Initialize Sentry with SENTRY_DSN env var
     * Express request handler (middleware, add early)
     * Express error handler (middleware, add as last error handler)
     * Attach requestId (from Stage 3 logging) as Sentry tag
     * Strip PII from error reports (use existing pii-guard.ts patterns)
     * Sample rate: 1.0 for errors, 0.2 for transactions (20%)
   - Add SENTRY_DSN and VITE_SENTRY_DSN to .env.example
   - Sentry should be no-op when DSN is not configured (safe for dev)
   - Upload source maps during build (add to script/build.ts or CI pipeline)

2. UPTIME MONITORING SETUP:
   - Create docs/monitoring-setup.md with instructions for:
     * UptimeRobot (free tier: 50 monitors, 5-min intervals)
     * Configure HTTP monitor on https://bharatsolve.ai/api/health
     * Expected response: 200 with body containing "ok"
     * Alert channels: email + Slack/Discord webhook
   - Enhance GET /api/health to include more checks:
     * Database connectivity (quick SELECT 1 query, with timeout)
     * Memory usage (process.memoryUsage())
     * Uptime (process.uptime())
     * Return: { status: "ok"|"degraded"|"down", checks: {...}, timestamp }
     * If DB is down, return status: "degraded" (not "down" — app still works
       with in-memory storage)

3. CDN CONFIGURATION:
   - Add cache-control headers in server/static.ts for static assets:
     * dist/public/assets/* (hashed files): Cache-Control: public, max-age=31536000,
       immutable
     * dist/public/*.html: Cache-Control: no-cache (always revalidate)
     * dist/public/manifest.json, robots.txt: Cache-Control: public, max-age=3600
     * /uploads/*: Cache-Control: public, max-age=86400
   - Create docs/cdn-setup.md with instructions for Cloudflare:
     * Add domain to Cloudflare
     * Enable "Full (strict)" SSL
     * Page rules for caching
     * Recommended Cloudflare settings (Brotli, minification, rocket loader off)
   - Add Vary: Accept-Encoding header
   - Add ETag headers for static files

4. DATABASE BACKUP AUTOMATION:
   - Create scripts/backup-db.sh:
     * Uses pg_dump to create a compressed backup
     * Filename: bharatsolve_backup_YYYY-MM-DD_HH-MM.sql.gz
     * Configurable retention (delete backups older than 30 days)
     * Upload to S3 bucket if AWS_S3_BACKUP_BUCKET is set
     * Log backup success/failure
   - Create a CronJob-style approach:
     * For Docker: add a backup service to docker-compose.yml using
       postgres:16-alpine with cron
     * For AWS: document using AWS Backup or RDS automated snapshots
   - Add backup configuration to infrastructure/ Terraform:
     * Enable RDS automated backups (already 7-day retention)
     * Add S3 bucket for manual backup storage
     * Add IAM policy for ECS task to write to S3
   - Create docs/backup-restore.md:
     * How to take a manual backup
     * How to restore from backup
     * How to verify backup integrity
     * Disaster recovery runbook
```

### Verification Checklist

- [ ] Sentry captures client-side errors (test with manual throw)
- [ ] Sentry captures server-side errors (test with /api/test-error)
- [ ] Sentry reports include requestId tag
- [ ] GET /api/health returns detailed status with DB check
- [ ] Static assets have correct Cache-Control headers
- [ ] Hashed assets have immutable cache headers
- [ ] Backup script creates valid .sql.gz files
- [ ] Restore from backup works correctly
- [ ] Monitoring setup documentation is complete

---

## Stage 9: Documentation

### Objective

Complete all documentation for developers, contributors, and API consumers.

### Tasks Covered

| ID | Task | Notes |
|---|---|---|
| 11.02 | Add API documentation (OpenAPI/Swagger) | Interactive API docs |
| 11.03 | Add CONTRIBUTING.md | Developer guidelines |
| 11.05 | Add CHANGELOG.md | Version tracking |

### Prerequisites

- Stages 1-3 (API is finalized after auth + payment + versioning)

### Deliverables

- OpenAPI spec with Swagger UI at /api/docs
- CONTRIBUTING.md with development workflow
- CHANGELOG.md starting at v1.0.0

### Prompt

```
I have a TypeScript monorepo with Express 5 backend, React 18 frontend,
PostgreSQL + Drizzle ORM. API routes are defined with Zod schemas in shared/routes.ts.
All routes are under /api/v1/. README.md (321 lines) and project-overview.md already
exist with comprehensive documentation.

TASK: Complete project documentation.

1. OPENAPI/SWAGGER DOCUMENTATION:
   - Install swagger-ui-express and zod-to-openapi (or generate manually)
   - Create server/lib/openapi.ts:
     * Generate OpenAPI 3.1 spec from the Zod schemas in shared/routes.ts
     * Include all routes with:
       - Path, method, description
       - Request body schema (from Zod)
       - Response schemas per status code
       - Authentication requirements (mark which need session)
       - Rate limiting info in headers
     * Group by tags: Auth, Problems, Discussion, Profile, Subscription, Analytics,
       Notifications, Health
   - Mount Swagger UI at GET /api/docs (HTML UI) and GET /api/docs/openapi.json (raw spec)
   - Only enable in development + staging (disable in production via env flag ENABLE_API_DOCS)
   - Include example request/response bodies for each endpoint
   - Add API authentication note: "All endpoints except /api/v1/auth/* and
     /api/health require an authenticated session cookie"

2. CONTRIBUTING.md:
   - Project overview (1 paragraph)
   - Getting started:
     * Prerequisites (Node.js 20, npm, optionally Docker + PostgreSQL)
     * Clone + install
     * Environment setup (.env from .env.example)
     * Running dev server (npm run dev)
     * Running with Docker (docker compose up)
   - Development workflow:
     * Branch naming: feature/, bugfix/, hotfix/
     * Commit message format: conventional commits (feat:, fix:, docs:, etc.)
     * PR process: create branch → make changes → run checks → open PR
   - Code standards:
     * TypeScript strict mode
     * Zod validation for all inputs
     * IStorage interface for all data access
     * shadcn/ui for UI components
     * No inline imports (imports at top of file)
     * No console.log in production code (use pino logger)
   - Testing:
     * Run tests before PR: npm test, npm run test:e2e
     * Coverage threshold: 60%
     * Write tests for new features
   - Project structure diagram (from project-overview.md)
   - Code of Conduct reference (link to standard)

3. CHANGELOG.md:
   - Use Keep a Changelog format (https://keepachangelog.com)
   - Start with v1.0.0 covering all current features:
     * Added: Core app (AI problem solving, discussion, subscription, referral)
     * Added: Multi-locale system (IN, SG, HK)
     * Added: Privacy compliance (policy, consent, account deletion, data export, PII guard)
     * Added: Security (10-layer middleware, file scanner)
     * Added: Docker + Terraform infrastructure
     * Added: SEO infrastructure (meta, OG, JSON-LD, sitemap, PWA)
   - Add v1.1.0 section for the work done in this implementation plan:
     * Added: Standalone authentication (email/password + Google OAuth)
     * Added: Payment integration (Lemon Squeezy)
     * Added: Subscription enforcement
     * Added: Problem categories and search/filter
     * Added: Analytics dashboard, WebSocket, onboarding
     * Added: Testing framework (Vitest + Playwright)
     * Added: CI/CD pipeline (GitHub Actions)
     * Added: Structured logging (pino), email service (Resend)
     * Added: Sentry error monitoring
     * Added: OpenAPI documentation
   - Include an [Unreleased] section at top for ongoing work
```

### Verification Checklist

- [ ] /api/docs shows Swagger UI with all endpoints
- [ ] /api/docs/openapi.json returns valid OpenAPI spec
- [ ] CONTRIBUTING.md covers setup, workflow, standards
- [ ] CHANGELOG.md has v1.0.0 and v1.1.0 entries
- [ ] All endpoint examples work when tried from Swagger UI

---

## Stage 10: Production Launch

### Objective

Final pre-launch verification, performance optimization, and go-live.

### Tasks Covered

This stage is a synthesis — it doesn't map to specific tasklist IDs but ensures everything is production-ready.

### Prerequisites

- All Stages 1-9 complete

### Deliverables

- Production environment configured and verified
- Performance optimized (bundle size, Lighthouse score)
- Launch checklist completed
- Go-live with monitoring active

### Prompt

```
I have a full-stack TypeScript app ready for production launch:
- React 18 + Vite (client)
- Express 5 + PostgreSQL (server)
- Docker + Terraform for AWS ECS deployment
- Sentry monitoring, pino logging, CDN configured
- Lemon Squeezy payments, standalone auth
- Full test suite passing

TASK: Prepare for production launch. Complete these final steps:

1. PERFORMANCE OPTIMIZATION:
   - Analyze Vite bundle with rollup-plugin-visualizer:
     * Identify large chunks, code-split where needed
     * Ensure vendor chunks are properly separated (react, radix, recharts)
     * Target: main bundle < 200KB gzipped
   - Add React.lazy() for route-level code splitting:
     * Landing, Dashboard, ProblemDetail, Billing, Profile, Privacy, Auth pages
       should each be separate chunks
     * Add a loading fallback component with skeleton
   - Optimize images:
     * og-image.png — compress to < 200KB
     * favicon — ensure all PWA icon sizes are optimized
   - Add font preloading for Outfit and Inter fonts
   - Run Lighthouse audit and fix any scores below 90:
     * Performance, Accessibility, Best Practices, SEO
   - Add resource hints: dns-prefetch for API domain, preconnect for CDN

2. SECURITY FINAL REVIEW:
   - Verify all env vars are set and not using defaults:
     * SESSION_SECRET is not 'dev-secret'
     * DATABASE_URL uses SSL
     * All API keys are production keys (not test)
   - Run: npm audit (fix any high/critical vulnerabilities)
   - Verify rate limits are appropriate for expected traffic
   - Verify CORS ALLOWED_ORIGIN is set to production domain
   - Verify CSP headers are correct for production
   - Test: attempt common attacks (XSS, SQL injection) and verify they're blocked

3. DATABASE PREPARATION:
   - Run all migrations on production database
   - Verify all indexes are created (add indexes for common queries):
     * problems: user_id (for dashboard queries)
     * problems: created_at (for sorting/pagination)
     * discussion_messages: problem_id (for message listing)
     * notifications: user_id, read (for unread count)
     * user_profiles: referral_code (for referral lookup)
   - Verify connection pool settings are appropriate
   - Take a baseline backup before launch

4. ENVIRONMENT CONFIGURATION:
   - Create a production .env template with all required variables documented
   - Configure AWS resources via Terraform:
     * terraform plan -var-file=environments/prod.tfvars
     * terraform apply (after review)
   - Configure DNS: point domain to ALB
   - Configure SSL certificate via ACM
   - Verify health check passes: curl https://bharatsolve.ai/api/health

5. LAUNCH CHECKLIST (create docs/launch-checklist.md):
   Pre-launch:
   - [ ] All tests passing (npm test, npm run test:e2e)
   - [ ] TypeScript check passing (npm run check)
   - [ ] Docker build succeeds
   - [ ] Production env vars configured
   - [ ] Database migrated
   - [ ] Database backup taken
   - [ ] Sentry DSN configured
   - [ ] GTM container ID configured
   - [ ] Lemon Squeezy products created for all locales
   - [ ] Lemon Squeezy webhook endpoint configured
   - [ ] DNS configured and propagated
   - [ ] SSL certificate valid
   - [ ] CDN configured
   - [ ] Uptime monitor configured

   Launch:
   - [ ] Deploy via: docker compose up -d (or terraform apply)
   - [ ] Verify /api/health returns ok
   - [ ] Verify landing page loads
   - [ ] Test registration + login flow
   - [ ] Test problem creation with AI
   - [ ] Test payment flow (test mode)
   - [ ] Verify social sharing previews
   - [ ] Verify sitemap accessible
   - [ ] Check Sentry for any errors
   - [ ] Check server logs for any warnings

   Post-launch (first 24 hours):
   - [ ] Monitor error rate in Sentry
   - [ ] Monitor server response times
   - [ ] Monitor database connection pool
   - [ ] Verify uptime monitor is green
   - [ ] Submit sitemap to Google Search Console
   - [ ] Submit sitemap to Bing Webmaster Tools
   - [ ] Announce on social media
```

### Verification Checklist

- [ ] Lighthouse scores > 90 on all categories
- [ ] Bundle size < 200KB gzipped (main chunk)
- [ ] All production env vars configured
- [ ] Database fully migrated with indexes
- [ ] SSL certificate valid
- [ ] Health check returns ok
- [ ] Full user flow works end-to-end
- [ ] Payment test transaction succeeds
- [ ] Monitoring is active and alerting works
- [ ] Launch checklist 100% complete

---

## Dependency Graph

```
Stage 1 (Auth) ────────────────┐
     │                         │
     ▼                         ▼
Stage 2 (Payment)        Stage 3 (Backend Hardening)
     │                         │
     ├─────────┬───────────────┤
     ▼         ▼               ▼
Stage 4     Stage 6         Stage 7
(UI Core)   (Testing)       (SEO)
     │         │               │
     ▼         │               │
Stage 5       │               │
(UI Adv)      │               │
     │         │               │
     ├─────────┼───────────────┤
     ▼         ▼               ▼
          Stage 8 (DevOps)
               │
               ▼
          Stage 9 (Docs)
               │
               ▼
          Stage 10 (Launch)
```

**Parallelization opportunities:**
- Stages 4 + 6 + 7 can run in parallel (after Stage 1-3)
- Stage 5 depends only on Stage 4
- Stage 8 depends on Stage 3
- Stage 9 depends on Stages 1-3 (API is finalized)
- Stage 10 requires everything

---

## Timeline Estimates

### Solo Developer (Full-time)

| Week | Stages | Focus |
|---|---|---|
| Week 1-2 | Stage 1 | Standalone auth system |
| Week 3 | Stage 2 | Payment integration |
| Week 4 | Stage 3 + 4 | Backend hardening + UI core |
| Week 5 | Stage 5 + 7 | Advanced UI + SEO |
| Week 6 | Stage 6 | Testing framework + tests |
| Week 7 | Stage 8 + 9 | DevOps + Documentation |
| Week 8 | Stage 10 | Launch prep + go-live |

**Total: ~8 weeks (full-time) or ~12-16 weeks (part-time)**

### With AI Assistant (Cursor/Copilot)

Estimated 40-60% faster using the prompts in this document:

| Week | Stages |
|---|---|
| Week 1 | Stages 1 + 3 |
| Week 2 | Stage 2 |
| Week 3 | Stages 4 + 5 + 7 (parallel) |
| Week 4 | Stage 6 + 8 |
| Week 5 | Stages 9 + 10 |

**Total: ~5 weeks (full-time with AI assistance)**

---

## Quick Reference: All Stage Prompts

| Stage | Prompt Location | Key Dependencies |
|---|---|---|
| 1 - Auth | [Stage 1 Prompt](#prompt) | bcrypt, passport-google-oauth20 |
| 2 - Payment | [Stage 2 Prompt](#prompt-1) | @lemonsqueezy/lemonsqueezy.js |
| 3 - Backend | [Stage 3 Prompt](#prompt-2) | pino, resend |
| 4 - UI Core | [Stage 4 Prompt](#prompt-3) | None (uses existing deps) |
| 5 - UI Advanced | [Stage 5 Prompt](#prompt-4) | None (uses existing deps) |
| 6 - Testing | [Stage 6 Prompt](#prompt-5) | vitest, playwright, supertest |
| 7 - SEO | [Stage 7 Prompt](#prompt-6) | swagger-ui-express |
| 8 - DevOps | [Stage 8 Prompt](#prompt-7) | @sentry/react, @sentry/node |
| 9 - Docs | [Stage 9 Prompt](#prompt-8) | zod-to-openapi |
| 10 - Launch | [Stage 10 Prompt](#prompt-9) | rollup-plugin-visualizer |
