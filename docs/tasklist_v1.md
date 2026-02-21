# BharatSolve AI — Master Task List v1

> Generated: 2026-02-22
> Total Tasks: 50 | Completed: 18 | Pending: 32

---

## Status Legend

- [x] = Completed
- [ ] = Pending

---

## Category 1: Core Application (Built Features)

These are the features already built and functional in the codebase.

- [x] **1.01 — Landing page** — Full marketing page with hero, features, how-it-works, use cases, testimonials, pricing, FAQ, footer. Animations via Framer Motion. `client/src/pages/Landing.tsx`
- [x] **1.02 — Authentication system** — Replit OIDC login/logout via Passport.js, session management in PostgreSQL, `isAuthenticated` middleware, dev auto-login fallback. `server/replit_integrations/auth/`
- [x] **1.03 — Dashboard page** — Authenticated view showing user's problem cards, subscription card, referral card, ad placeholder. `client/src/pages/Dashboard.tsx`
- [x] **1.04 — Problem creation with AI** — Dialog form with 12-language selector, Zod validation, AI solution generation via OpenAI (GPT-4o-mini), mock fallback when no API key. `client/src/components/CreateProblemDialog.tsx`, `server/routes.ts`
- [x] **1.05 — Discussion/chat on problems** — Follow-up chat per problem, full message history, AI context-aware replies. `client/src/pages/ProblemDetail.tsx`, `client/src/hooks/use-discussion.ts`
- [x] **1.06 — Subscription system (basic)** — 30-day trial tracking, status management (trial/active/expired), upgrade button (no real payment). `client/src/components/SubscriptionCard.tsx`, `shared/schema.ts`
- [x] **1.07 — Referral system** — Unique referral codes per user, share/copy, redeem, free month rewards for both parties. `client/src/components/ReferralCard.tsx`, `server/routes.ts`
- [x] **1.08 — Database layer** — Full Drizzle ORM schema with PostgreSQL. `IStorage` interface with both `MemoryStorage` (dev) and `DatabaseStorage` (prod) implementations. `server/storage.ts`, `shared/schema.ts`
- [x] **1.09 — Security middleware (10-layer)** — Helmet, CORS, HPP, 3-tier rate limiting, content-type validation, payload scanning, XSS sanitization, session hardening, request size limits, error masking. `server/middleware/security.ts`
- [x] **1.10 — SEO infrastructure** — Meta tags, OG, Twitter cards, JSON-LD (3 schemas), dynamic per-page SEO hook, sitemap, robots.txt, crawler meta injection. `client/index.html`, `client/src/hooks/use-document-head.ts`, `server/static.ts`
- [x] **1.11 — Social sharing** — 5 platforms (WhatsApp, X, Facebook, LinkedIn, Telegram) + copy link + native share API. `client/src/components/SocialShare.tsx`
- [x] **1.12 — PWA manifest** — Installable web app with Indian branding (saffron theme, en-IN locale). `client/public/manifest.json`
- [x] **1.13 — Build system** — Vite client + esbuild server via custom build script. `script/build.ts`, `vite.config.ts`
- [x] **1.14 — Multi-language AI support** — 12 Indian languages with native script support + mock solutions in 4 languages. `shared/schema.ts`
- [x] **1.15 — Indian cultural CSS theme** — Saffron/green/blue palette, light + dark mode CSS variables, custom gradients, Outfit + Inter fonts. `client/src/index.css`, `tailwind.config.ts`
- [x] **1.16 — 40+ shadcn/ui components** — Full component library installed (accordion through tooltip). `client/src/components/ui/`
- [x] **1.17 — Zod API validation** — Server route handlers validate input using Zod schemas from `shared/routes.ts` with proper error handling. `server/routes.ts`
- [x] **1.18 — Toast notification system** — Ephemeral user feedback via shadcn toast. `client/src/hooks/use-toast.ts`, `client/src/components/ui/toaster.tsx`

**Subtotal: 18/18 completed**

---

## Category 2: Critical Missing Items (Launch Blockers)

Items that must be resolved before production launch.

- [ ] **2.01 — Create OG image (1200x630px)** — Referenced in `index.html`, OG tags, Twitter cards, and `server/static.ts` but `client/public/og-image.png` does not exist. Social shares will show broken previews. Design should include logo, tagline, saffron/green/blue Indian palette.
- [ ] **2.02 — Fix package.json name** — Currently `"name": "rest-express"`. Should be `"bharatsolve-ai"` or `"bharat-samajh-problem-solver-ai"`. `package.json` line 2.
- [ ] **2.03 — Create root README.md** — No README exists. Must cover: project description, tech stack, features, screenshots, quick start, environment variables, scripts, contributing, license.
- [ ] **2.04 — Set production domain** — All URLs hardcoded to `https://bharatsolve.ai`. Need to update or confirm: `client/index.html` (canonical, OG, JSON-LD), `client/public/robots.txt` (sitemap URL), `client/src/hooks/use-document-head.ts` (BASE_URL), `server/static.ts` (BASE_URL fallback).
- [ ] **2.05 — Create LICENSE file** — `package.json` declares MIT but no `LICENSE` file exists in project root.

**Subtotal: 0/5 completed**

---

## Category 3: Wire In Scaffolded Features

Modules fully built but NOT connected to the main routes or UI.

- [ ] **3.01 — Wire chat integration into main routes** — `server/replit_integrations/chat/` has `registerChatRoutes()` with storage, routes, and index. NOT registered in `server/routes.ts`. Needs route registration + frontend chat page/component using `conversations` and `messages` tables.
- [ ] **3.02 — Wire audio/voice AI into app** — Server: `server/replit_integrations/audio/` (STT, TTS routes). Client: `useVoiceRecorder`, `useVoiceStream`, `useAudioPlayback` hooks exist in `client/replit_integrations/audio/`. Neither is imported or used by any page. Could add voice input on problem creation and audio playback of AI solutions.
- [ ] **3.03 — Wire image generation into app** — `server/replit_integrations/image/` has `registerImageRoutes()` but is NOT called in `server/routes.ts`. Could enhance AI solutions with visual aids.
- [ ] **3.04 — Wire batch processing** — `server/replit_integrations/batch/` has `batchProcess()` and `batchProcessWithSSE()` utilities. Not imported anywhere.
- [ ] **3.05 — Add dark mode toggle button** — `next-themes` is installed, CSS variables for `.dark` are defined in `index.css`, but: (a) `ThemeProvider` is NOT used in `App.tsx` or `main.tsx`, (b) No visible toggle button exists in any component. Need to wrap app in `ThemeProvider` and add a toggle to the header/navbar.

**Subtotal: 0/5 completed**

---

## Category 4: Payment & Subscription

- [ ] **4.01 — Integrate payment gateway (Razorpay recommended)** — Subscribe button currently just flips a DB status field. No real payment processing. Razorpay is ideal for Indian market (UPI, netbanking, cards, wallets). Alternative: Stripe India.
- [ ] **4.02 — Implement subscription enforcement** — Ensure expired-trial users can't create new problems or access AI features. Add middleware to check subscription status before AI endpoints.
- [ ] **4.03 — Add subscription management page** — Allow users to view billing history, cancel subscription, update payment method, view invoices.
- [ ] **4.04 — Implement referral reward fulfillment** — Referral codes work in DB but don't actually extend subscription periods via the payment system. Connect referral logic to payment/billing.

**Subtotal: 0/4 completed**

---

## Category 5: Authentication & User Management

- [ ] **5.01 — Replace Replit Auth with standalone auth** — Current OIDC depends on Replit platform (`REPL_ID` env var). For independent deployment, implement email/password auth, or Google OAuth, or phone OTP (popular in India). Consider Firebase Auth or Auth.js.
- [ ] **5.02 — Add user profile editing** — No UI for users to update name, email, or profile picture. `use-profile.ts` hook fetches data but has no mutation. Need a profile settings page.
- [ ] **5.03 — Add account deletion** — Required for privacy compliance (GDPR, India's DPDP Act 2023). No delete account flow exists anywhere.
- [ ] **5.04 — Implement password reset flow** — Only needed if moving to email/password auth (task 5.01).

**Subtotal: 0/4 completed**

---

## Category 6: SEO & Digital Marketing Activation

From the activation checklist in `docs/digital-marketing.md`.

- [ ] **6.01 — Activate Google Tag Manager** — GTM snippets are commented out in `client/index.html` with placeholder `GTM-XXXXXXX`. Need: create GTM account, get container ID, uncomment both snippets, replace placeholder.
- [ ] **6.02 — Configure GA4 in GTM** — Set up GA4 property with recommended events: `sign_up`, `start_trial`, `submit_problem`, `subscription_purchase`, `referral_shared`, `social_share`.
- [ ] **6.03 — Submit sitemap to Google Search Console** — `GET /sitemap.xml` is auto-generated but not submitted. Go to https://search.google.com/search-console → Add property → Submit sitemap URL.
- [ ] **6.04 — Submit sitemap to Bing Webmaster Tools** — Submit at https://www.bing.com/webmasters.
- [ ] **6.05 — Validate structured data** — Test all 3 JSON-LD schemas (Organization, WebApplication, FAQPage) with https://search.google.com/test/rich-results.
- [ ] **6.06 — Test social previews** — Verify OG/Twitter cards on: Facebook Sharing Debugger, LinkedIn Post Inspector, Twitter Card Validator, WhatsApp (send link in chat).
- [ ] **6.07 — Generate PWA icon set** — Only `favicon.png` exists. Need icons at 48x48, 72x72, 96x96, 144x144, 192x192, 512x512. Update `icons` array in `client/public/manifest.json`.
- [ ] **6.08 — Add social media profile links** — Update `sameAs` array in Organization JSON-LD in `client/index.html` with real social URLs (Twitter, LinkedIn, Facebook, Instagram, YouTube).
- [ ] **6.09 — Add Twitter/X handle** — Add `<meta name="twitter:site" content="@YourHandle">` to `client/index.html` when handle is created.
- [ ] **6.10 — Replace placeholder ratings** — `aggregateRating` in WebApplication JSON-LD has fake data (`"ratingValue": "4.8"`, `"ratingCount": "10000"`). Replace with real metrics or remove until real data is available.

**Subtotal: 0/10 completed**

---

## Category 7: UI/UX Improvements

- [ ] **7.01 — Improve loading states with skeletons** — `Skeleton` component exists in `ui/skeleton.tsx` but is unused. Dashboard uses basic `animate-pulse` divs; ProblemDetail uses a spinner. Replace with proper skeleton layouts matching the actual content shape.
- [ ] **7.02 — Implement sidebar navigation** — `ui/sidebar.tsx` component exists but is unused. Could house navigation on desktop (Dashboard, Problems, Profile, Settings).
- [ ] **7.03 — Add analytics charts to dashboard** — `recharts` is installed but unused. `ui/chart.tsx` wraps it. Could show: problem submission trends, response times, category breakdown.
- [ ] **7.04 — Implement WebSocket real-time updates** — `ws` is in dependencies but unused. Could enable: real-time AI response streaming (instead of polling), live discussion updates.
- [ ] **7.05 — Add problem categories/tags** — Problems currently only have title + description + language. Add a `category` enum column (family, career, social, marriage, education, financial, health, legal, other). Improves AI context and enables filtering.
- [ ] **7.06 — Add problem search and filter** — Dashboard has no search input or filter controls. Add: text search on title/description, filter by status (pending/solved), filter by language, filter by category (if 7.05 is done).
- [ ] **7.07 — Add pagination on problem list** — `ui/pagination.tsx` exists but is unused. Dashboard renders all problems without pagination. Add server-side pagination with limit/offset.
- [ ] **7.08 — Add onboarding/welcome flow** — No first-time user guidance. Add a welcome modal or multi-step onboarding after first login explaining features, trial period, and how to create a problem.
- [ ] **7.09 — Add persistent notification system** — Toast exists for ephemeral feedback but no notification center. Add: bell icon in header, notification list (referral accepted, subscription changes, AI solution ready).
- [ ] **7.10 — Mobile responsiveness audit** — `use-mobile` hook exists. Verify all pages look good on mobile (320px–768px). Test: Landing page, Dashboard, ProblemDetail, CreateProblemDialog.

**Subtotal: 0/10 completed**

---

## Category 8: Backend Improvements

- [ ] **8.01 — Add health check endpoint** — No `/api/health` or `/api/status` endpoint. Add one that checks: server is up, database is connected, OpenAI key is configured. Essential for monitoring and load balancers.
- [ ] **8.02 — Implement proper database migrations** — Currently using `npm run db:push` (Drizzle Kit schema push). For production, switch to `drizzle-kit generate` + `drizzle-kit migrate` for versioned, reversible migrations.
- [ ] **8.03 — Add structured logging** — Only `console.log/warn/error` used. Add a structured logging library (pino recommended for Node.js performance) with JSON output, log levels, request correlation IDs.
- [ ] **8.04 — Add email service** — No email integration exists. Needed for: welcome emails, subscription receipts, password resets (if task 5.01), referral notifications. Consider Resend, SendGrid, or AWS SES.
- [ ] **8.05 — Add API versioning** — All routes use `/api/...` without versioning. Consider `/api/v1/...` to allow non-breaking API evolution.
- [ ] **8.06 — Tune database connection pool** — Default `pg` Pool settings. For production, tune `max`, `idleTimeoutMillis`, `connectionTimeoutMillis` based on expected traffic.

**Subtotal: 0/6 completed**

---

## Category 9: Testing & CI/CD

- [ ] **9.01 — Set up testing framework** — No tests exist. Add: Vitest for unit/integration tests, Playwright for E2E. Add `test` script to `package.json`.
- [ ] **9.02 — Write API endpoint tests** — Test all routes in `server/routes.ts`: auth flow, problems CRUD, discussion messages, profile/referral/subscription, sitemap.
- [ ] **9.03 — Write component tests** — Test key components: `CreateProblemDialog` (form validation, language selector), `ProblemCard` (rendering states), `SubscriptionCard` (trial/active/expired), `SocialShare` (link generation).
- [ ] **9.04 — Write E2E tests** — Test critical user flows: landing page → login → create problem → view solution → follow-up discussion → share → logout.
- [ ] **9.05 — Set up CI/CD pipeline (GitHub Actions)** — No `.github/workflows/` exists. Add workflows for: lint/typecheck on PR, run tests on PR, build verification, deploy on merge to main.

**Subtotal: 0/5 completed**

---

## Category 10: DevOps & Deployment

- [ ] **10.01 — Create Dockerfile** — No container configuration for deployment outside Replit. Add multi-stage Dockerfile: build stage (Vite + esbuild) → production stage (Node.js slim).
- [ ] **10.02 — Set up error monitoring (Sentry)** — No error tracking in production. Add Sentry SDK for both client (React) and server (Express) with source maps.
- [ ] **10.03 — Set up uptime monitoring** — No health checks or uptime monitoring. Use UptimeRobot, Better Uptime, or similar (requires task 8.01 health endpoint).
- [ ] **10.04 — Configure CDN for static assets** — No CDN configured. Consider Cloudflare or AWS CloudFront for global static asset delivery.
- [ ] **10.05 — Set up database backups** — No backup strategy documented or automated. Set up daily pg_dump or use managed PostgreSQL with automated backups.

**Subtotal: 0/5 completed**

---

## Category 11: Documentation

- [ ] **11.01 — Create root README.md** — Same as task 2.03. Comprehensive README with: badges, description, screenshots, features, tech stack, quick start, env vars, scripts, architecture, contributing, license.
- [ ] **11.02 — Add API documentation (OpenAPI/Swagger)** — No machine-readable API docs. Routes are documented in `docs/project-overview.md` but not interactive. Add Swagger UI or generate OpenAPI spec from Zod schemas.
- [ ] **11.03 — Add CONTRIBUTING.md** — No contributor guidelines. Cover: how to set up dev environment, coding standards, PR process, issue templates.
- [ ] **11.04 — Create LICENSE file** — Same as task 2.05. Add MIT license text file to project root.
- [ ] **11.05 — Add CHANGELOG.md** — No changelog tracking. Start with current feature set as v1.0.0. Use Keep a Changelog format.

**Subtotal: 0/5 completed**

---

## Summary Dashboard

| Category | Total | Done | Pending | Progress |
|---|:---:|:---:|:---:|:---:|
| 1. Core Application (Built Features) | 18 | 18 | 0 | 100% |
| 2. Critical Missing Items (Launch Blockers) | 5 | 0 | 5 | 0% |
| 3. Wire In Scaffolded Features | 5 | 0 | 5 | 0% |
| 4. Payment & Subscription | 4 | 0 | 4 | 0% |
| 5. Authentication & User Management | 4 | 0 | 4 | 0% |
| 6. SEO & Digital Marketing Activation | 10 | 0 | 10 | 0% |
| 7. UI/UX Improvements | 10 | 0 | 10 | 0% |
| 8. Backend Improvements | 6 | 0 | 6 | 0% |
| 9. Testing & CI/CD | 5 | 0 | 5 | 0% |
| 10. DevOps & Deployment | 5 | 0 | 5 | 0% |
| 11. Documentation | 5 | 0 | 5 | 0% |
| **TOTAL** | **77** | **18** | **59** | **23%** |

---

## Priority Matrix

| Priority | Tasks | Rationale |
|---|---|---|
| **P0 — Launch Blockers** | 2.01–2.05, 4.01, 5.01 | Cannot launch without payment, standalone auth, or basic assets |
| **P1 — High Value** | 3.01–3.05, 4.02, 6.01–6.06, 8.01, 9.01, 9.05, 10.01 | Major feature gaps, production readiness, SEO activation |
| **P2 — Important** | 4.03–4.04, 5.02–5.03, 6.07–6.10, 7.01–7.07, 8.02–8.03, 9.02–9.04, 11.01–11.05 | UX polish, backend hardening, testing, documentation |
| **P3 — Nice to Have** | 5.04, 7.08–7.10, 8.04–8.06, 10.02–10.05 | Refinements and operational maturity |

---

## Notes

- Tasks 2.03 and 11.01 overlap (README.md) — completing one completes both.
- Tasks 2.05 and 11.04 overlap (LICENSE file) — completing one completes both.
- Task 5.04 (password reset) only applies if task 5.01 uses email/password auth.
- Task 10.03 (uptime monitoring) depends on task 8.01 (health endpoint).
- Task 7.05 (problem categories) should be done before 7.06 (search/filter) for maximum value.
- The `setup-guide.md` documentation is already comprehensive for local development.
- The `digital-marketing.md` documentation is already comprehensive for SEO/marketing.
- The `project-overview.md` documentation is already comprehensive for architecture.
