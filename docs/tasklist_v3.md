# BharatSolve AI — Master Task List v3

> Generated: 2026-02-23 | Updated: 2026-02-23
> Previous version: [tasklist_v2.md](./tasklist_v2.md)
> Total Tasks: 149 (line items) | Completed: 108 | Pending: 41

---

## Version History

| Version | Date | Tasks | Done | Pending | Key Changes |
|---|---|:---:|:---:|:---:|---|
| **v3** | 2026-02-23 | 149 | 108 | 41 | UI/UX batch: 7.01–7.03, 7.06, 7.07, 7.10 DONE (skeletons, sidebar, charts, search/filter, pagination). Cat 8 fully done (migrations, logging, email, API versioning). |
| v2 | 2026-02-22 | 101 | 24 | 77 | Full code audit; bugs/security/quality categories; corrected v1 errors |
| v1 | 2026-02-22 | 77 | 18 | 59 | Initial task list from project & docs review |

### Changes from v2 → v3

- **Corrected v2 status:** Task 7.05 (problem categories) is DONE — schema has category column, CreateProblemDialog has 2-step flow (category first), ProblemCard/ProblemDetail show category badges, AI uses category-specific prompts (11 categories: education, law, health, finance, career, family, technology, government, housing, mental_wellness, other)
- **New completed tasks:** 1.25 Web search for AI context (Brave/Serper in `server/utils/web-search.ts`, used in getAISolution), 1.26 Feedback submission system (FeedbackDialog, POST /api/feedback)
- **1.19 updated:** Multi-locale now covers 12 locales (IN, SG, HK, JP, CN, US, GB, KR, AE, AU, DE, BR), not just IN/SG/HK
- **4.02 partial:** Subscription enforcement exists for problem create + batch; missing for discussion sendMessage (expired users can still get AI replies on follow-ups)
- **New tasks from monetization-strategy.md & payment-options-hk.md:** 4.05 Create Lemon Squeezy products for 12 locales, 4.06 Add Stripe HK (Phase 2), 4.07 Annual subscription plans, 4.08 Referral program optimizations

---

## Status Legend

- [x] = Completed
- [ ] = Pending

---

## Category 1: Core Application (Built Features)

- [x] **1.01 — Landing page** — Full marketing page with hero, features, how-it-works, use cases, testimonials, pricing, FAQ, footer. Framer Motion animations. `client/src/pages/Landing.tsx`
- [x] **1.02 — Authentication system** — Replit OIDC login/logout via Passport.js, session management in PostgreSQL, `isAuthenticated` middleware, dev auto-login fallback. `server/replit_integrations/auth/`
- [x] **1.03 — Dashboard page** — Authenticated view showing problem cards, subscription card, referral card, ad placeholder. `client/src/pages/Dashboard.tsx`
- [x] **1.04 — Problem creation with AI** — Dialog form with language selector, Zod validation, AI solution generation via OpenAI, mock fallback. `client/src/components/CreateProblemDialog.tsx`, `server/routes.ts`
- [x] **1.05 — Discussion/chat on problems** — Follow-up chat per problem, full message history, AI context-aware replies. `client/src/pages/ProblemDetail.tsx`
- [x] **1.06 — Subscription system (basic)** — 30-day trial tracking, status management (trial/active/expired). `client/src/components/SubscriptionCard.tsx`
- [x] **1.07 — Referral system** — Unique codes, share/copy, redeem, free month rewards. `client/src/components/ReferralCard.tsx`, `server/routes.ts`
- [x] **1.08 — Database layer** — Drizzle ORM with `IStorage` interface, `MemoryStorage` + `DatabaseStorage`. `server/storage.ts`, `shared/schema.ts`
- [x] **1.09 — Security middleware (10-layer)** — Helmet, CORS, HPP, 3-tier rate limiting, content-type validation, payload scanning, XSS sanitization, session hardening, size limits, error masking. `server/middleware/security.ts`
- [x] **1.10 — SEO infrastructure** — Meta tags, OG, Twitter cards, JSON-LD (3 schemas), dynamic per-page SEO, sitemap, robots.txt, crawler meta injection. `client/index.html`, `use-document-head.ts`, `server/static.ts`
- [x] **1.11 — Social sharing** — WhatsApp, X, Facebook, LinkedIn, Telegram + copy link + native share API. `client/src/components/SocialShare.tsx`
- [x] **1.12 — PWA manifest** — Installable web app with saffron theme. `client/public/manifest.json`
- [x] **1.13 — Build system** — Vite client + esbuild server. `script/build.ts`, `vite.config.ts`
- [x] **1.14 — Multi-language AI support** — 12+ languages with native script support + mock solutions. `shared/schema.ts`
- [x] **1.15 — Cultural CSS theme** — Saffron/green/blue palette, light + dark mode CSS variables. `client/src/index.css`, `tailwind.config.ts`
- [x] **1.16 — 40+ shadcn/ui components** — Full component library. `client/src/components/ui/`
- [x] **1.17 — Zod API validation** — Server route handlers validate input with Zod schemas. `server/routes.ts`
- [x] **1.18 — Toast notification system** — Ephemeral user feedback via shadcn toast. `use-toast.ts`, `toaster.tsx`
- [x] **1.19 — Multi-locale system** — 12 locales (IN, SG, HK, JP, CN, US, GB, KR, AE, AU, DE, BR) with locale-specific content (testimonials, FAQs, use cases, pricing). `shared/locales.ts`, `client/src/contexts/locale-context.tsx`
- [x] **1.20 — Locale switcher component** — UI for switching between locales. `client/src/components/LocaleSwitcher.tsx`
- [x] **1.21 — Locale-aware branding** — Brand logo with locale-specific flags. `client/src/components/BrandLogo.tsx`
- [x] **1.22 — Dockerfile & Docker Compose** — Multi-stage Dockerfile, docker-compose.yml with PostgreSQL, app, migrate services. `Dockerfile`, `docker-compose.yml`
- [x] **1.23 — Terraform infrastructure** — AWS ECS/Fargate, ALB, RDS PostgreSQL, Secrets Manager. `infrastructure/`
- [x] **1.24 — File upload scanner** — Validates uploaded files for suspicious content. `server/utils/file-scanner.ts`
- [x] **1.25 — Web search for AI context (NEW in v3)** — Brave Search / Serper integration enriches AI solutions with real-time web context. `server/utils/web-search.ts`, used in `getAISolution()`. Configurable via `BRAVE_SEARCH_API_KEY` or `SERPER_API_KEY`.
- [x] **1.26 — Feedback submission system (NEW in v3)** — FeedbackDialog for bug/feature/improvement reports. POST `/api/feedback` with category. `client/src/components/FeedbackDialog.tsx`, `server/routes.ts`, `shared/schema.ts` (feedback table).

**Subtotal: 26/26 completed**

---

## Category 2: Critical Missing Items (Launch Blockers)

- [x] **2.01 — Create OG image (1200x630px)** — **DONE.** `client/public/og-image.png` exists.
- [x] **2.02 — Fix package.json name** — **DONE.** `"bharatsolve-ai"`.
- [x] **2.03 — Create root README.md** — **DONE.** Comprehensive README exists.
- [x] **2.04 — Set production domain** — **DONE.** Locale-aware BASE_URL, robots.txt, meta.
- [x] **2.05 — Create LICENSE file** — **DONE.** MIT LICENSE in project root.
- [x] **2.06 — Create .env.example file** — **DONE.** `.env.example` with documented variables.
- [x] **2.07 — Fix README clone URL** — **DONE.** Updated to correct repo URL.

**Subtotal: 7/7 completed**

---

## Category 3: Wire In Scaffolded Features

- [x] **3.01 — Wire chat integration into main routes** — **DONE.** `registerChatRoutes(app, isAuthenticated)` in `server/routes.ts`.
- [x] **3.02 — Wire audio/voice AI into app** — **DONE.** `registerAudioRoutes(app, isAuthenticated)`.
- [x] **3.03 — Wire image generation into app** — **DONE.** `registerImageRoutes(app, isAuthenticated)`.
- [x] **3.04 — Wire batch processing** — **DONE.** `POST /api/problems/batch` endpoint.
- [x] **3.05 — Add dark mode toggle button** — **DONE.** ThemeProvider, ThemeToggle in nav/header.

**Subtotal: 5/5 completed**

---

## Category 4: Payment & Subscription

- [ ] **4.01 — Integrate payment gateway (Lemon Squeezy recommended)** — Subscribe button just flips a DB flag. No real payment. Lemon Squeezy is Merchant of Record (no business entity needed). See `docs/monetization-strategy.md`, `docs/payment-options-hk.md`.
- [x] **4.02 — Implement full subscription enforcement** — **DONE.** Trial check exists for problem create + batch + discussion sendMessage. Added check to POST `/api/problems/:id/messages` — expired users now get 403 before AI reply.
- [ ] **4.03 — Add subscription management page** — No UI for billing history, cancel, payment method update.
- [ ] **4.04 — Implement referral reward fulfillment** — Referral codes update DB but don't extend subscription via payment system.
- [ ] **4.05 — Create Lemon Squeezy products for 12 locales (NEW in v3)** — Create one subscription product per locale in LS dashboard (IN ₹499, SG S$15, HK HK$99, JP ¥1,500, US $10, GB £8, etc.). Map variant IDs in code.
- [ ] **4.06 — Add Stripe HK as secondary processor (Phase 2, NEW in v3)** — When revenue > HK$5,000/mo. Requires HK sole proprietor. Route Asian users (HK, SG, JP, CN, KR) to Stripe for Alipay/WeChat Pay. See `docs/payment-options-hk.md`.
- [ ] **4.07 — Add annual subscription plans (Phase 3, NEW in v3)** — 17% discount (e.g. ₹4,990/yr vs ₹499/mo). Improves retention and cash flow.
- [ ] **4.08 — Referral program optimizations (NEW in v3)** — From monetization-strategy: auto-append referral code to WhatsApp shares, show "You've referred X friends, earned X free months", tiered rewards (Refer 5 → 2 months; Refer 10 → 3 months).

**Subtotal: 1/8 completed**

---

## Category 5: Authentication & User Management

- [ ] **5.01 — Replace Replit Auth with standalone auth** — Current OIDC depends on `REPL_ID`. Dev mode uses `NODE_ENV !== "production"`. Must implement email/password, Google OAuth, or phone OTP for independent deployment.
- [ ] **5.02 — Add user profile editing** — No UI for name/email/picture updates. `use-profile.ts` is read-only.
- [ ] **5.03 — Add account deletion** — **Backend DONE (15.06).** Needs standalone auth integration for full UX.
- [ ] **5.04 — Implement password reset flow** — Only if task 5.01 uses email/password auth.
- [x] **5.05 — Add CSRF protection** — **DONE.** X-CSRF-Token CORS, SameSite cookie policy.

**Subtotal: 1/5 completed**

---

## Category 6: SEO & Digital Marketing Activation

- [ ] **6.01 — Activate Google Tag Manager** — Commented out with placeholder `GTM-XXXXXXX`.
- [ ] **6.02 — Configure GA4 in GTM** — Events: `sign_up`, `start_trial`, `submit_problem`, `subscription_purchase`, `referral_shared`, `social_share`.
- [ ] **6.03 — Submit sitemap to Google Search Console** — Sitemap auto-generated but not submitted.
- [ ] **6.04 — Submit sitemap to Bing Webmaster Tools** — Not submitted.
- [ ] **6.05 — Validate structured data** — Test JSON-LD with Google Rich Results Test.
- [ ] **6.06 — Test social previews** — Verify on Facebook, LinkedIn, Twitter, WhatsApp.
- [ ] **6.07 — Generate PWA icon set** — Only `favicon.png` exists. Need 48/72/96/144/192/512px. Add service worker for offline.
- [ ] **6.08 — Add social media profile links** — `sameAs` array in Organization JSON-LD is empty.
- [ ] **6.09 — Add Twitter/X handle** — Missing `twitter:site` meta tag.
- [x] **6.10 — Remove/replace fake ratings** — **DONE.** Removed fabricated `aggregateRating`.
- [x] **6.11 — Sync JSON-LD languages with locale system** — **DONE.** `inLanguage` includes all supported languages.
- [ ] **6.12 — Make index.html meta tags locale-aware** — Hardcoded for India; server-side crawler injection handles locale; client defaults to India.

**Subtotal: 2/12 completed**

---

## Category 7: UI/UX Improvements

- [x] **7.01 — Improve loading states with skeletons** — **DONE.** ProblemCardSkeleton, ProblemDetailSkeleton; Dashboard and ProblemDetail use skeletons instead of spinners.
- [x] **7.02 — Implement sidebar navigation** — **DONE.** AppShell with SidebarProvider, collapsible sidebar, nav links (Dashboard, Tasks, Admin, Help, Resources).
- [x] **7.03 — Add analytics charts to dashboard** — **DONE.** DashboardCharts with PieChart (status) and BarChart (categories). recharts + ui/chart.tsx.
- [ ] **7.04 — Implement WebSocket real-time updates** — `ws` in dependencies but unused. Could enable streaming AI responses.
- [x] **7.05 — Add problem categories/tags** — **DONE (corrected in v3).** Schema has category column. CreateProblemDialog 2-step flow (category first). 11 categories. ProblemCard/ProblemDetail show badges. AI uses category-specific prompts.
- [x] **7.06 — Add problem search and filter** — **DONE.** Search input, category select, status select; server-side getProblemsFiltered in storage.
- [x] **7.07 — Add pagination on problem list** — **DONE.** Pagination component, server-side limit/offset, page state.
- [ ] **7.08 — Add onboarding/welcome flow** — No first-time user guidance.
- [ ] **7.09 — Add persistent notification system** — Toast only. No notification center/bell icon.
- [x] **7.10 — Mobile responsiveness audit** — **DONE.** Sidebar uses Sheet on mobile; filters full-width on small screens; responsive padding/gaps.
- [x] **7.11 — Add React error boundary** — **DONE.** ErrorBoundary in App.tsx.
- [x] **7.12 — Fix ProblemCard keyboard accessibility** — **DONE.** tabIndex, role="button", onKeyDown.
- [x] **7.13 — Fix not-found page theme tokens** — **DONE.** Replaced gray with theme tokens.
- [x] **7.14 — Add React StrictMode** — **DONE.** Wrapped App in StrictMode.

**Subtotal: 10/14 completed**

---

## Category 8: Backend Improvements

- [x] **8.01 — Add health check endpoint** — **DONE.** `GET /api/health`.
- [x] **8.02 — Implement proper database migrations** — **DONE.** `npm run db:generate` + `npm run db:migrate`. Migrations in `drizzle/`, docker-compose uses `db:migrate`.
- [x] **8.03 — Add structured logging** — **DONE.** Pino with JSON (prod), pretty (dev), request IDs via `X-Request-ID`, `server/utils/logger.ts`, `server/middleware/request-logger.ts`. LOG_LEVEL env.
- [x] **8.04 — Add email service** — **DONE.** Resend in `server/utils/email.ts`: sendWelcomeEmail, sendPasswordResetEmail, sendEmailVerification, sendSubscriptionConfirmation, sendSubscriptionCancelled. RESEND_API_KEY, EMAIL_FROM.
- [x] **8.05 — Add API versioning** — **DONE.** All API routes under `/api/v1/`. Health, login, logout, callback remain unversioned.
- [x] **8.06 — Tune database connection pool** — **DONE.** max: 20, timeouts, error handler.
- [x] **8.07 — Fix unsafe null casts in db.ts** — **DONE.**
- [x] **8.08 — Add database SSL configuration** — **DONE.** Conditional SSL for production.

**Subtotal: 8/8 completed**

---

## Category 9: Testing & CI/CD

- [ ] **9.01 — Set up testing framework** — No tests. Add Vitest + Playwright. Add `test` script.
- [ ] **9.02 — Write API endpoint tests** — Test all routes.
- [ ] **9.03 — Write component tests** — CreateProblemDialog, ProblemCard, SubscriptionCard, SocialShare, ReferralCard.
- [ ] **9.04 — Write E2E tests** — Critical user flows.
- [ ] **9.05 — Set up CI/CD pipeline (GitHub Actions)** — No `.github/workflows/` exists.

**Subtotal: 0/5 completed**

---

## Category 10: DevOps & Deployment

- [x] **10.01 — Create Dockerfile** — **DONE.** Multi-stage Dockerfile.
- [ ] **10.02 — Set up error monitoring (Sentry)** — No error tracking in production.
- [ ] **10.03 — Set up uptime monitoring** — Depends on 8.01. UptimeRobot, etc.
- [ ] **10.04 — Configure CDN for static assets** — No CDN. Cloudflare or CloudFront.
- [ ] **10.05 — Set up database backups** — No backup strategy.
- [x] **10.06 — Add production source maps** — **DONE.** sourcemap: true in esbuild config.

**Subtotal: 2/6 completed**

---

## Category 11: Documentation

- [x] **11.01 — Create root README.md** — **DONE.** Comprehensive.
- [ ] **11.02 — Add API documentation (OpenAPI/Swagger)** — No machine-readable API docs.
- [ ] **11.03 — Add CONTRIBUTING.md** — No contributor guidelines.
- [x] **11.04 — Create LICENSE file** — **DONE.** MIT LICENSE.
- [ ] **11.05 — Add CHANGELOG.md** — No changelog.
- [x] **11.06 — Free hosting deployment guide** — **DONE.** `docs/free-hosting-deployment.md`.

**Subtotal: 3/6 completed**

---

## Category 12: Bugs & Code Quality

- [x] **12.01 — Fix `Number(req.params.id)` NaN vulnerability** — **DONE.**
- [x] **12.02 — Fix trial expiry bypass via referral free months** — **DONE.**
- [x] **12.03 — Fix problem created before AI with no rollback** — **DONE.**
- [x] **12.04 — Fix race condition in applyReferral** — **DONE.**
- [x] **12.05 — Fix missing existence check on update+returning** — **DONE.**
- [x] **12.06 — Fix chat/audio duplicate route paths** — **DONE.**
- [x] **12.07 — Fix chat storage missing MemoryStorage fallback** — **DONE.**
- [x] **12.08 — Fix ProblemDetail pendingFiles memory leak** — **DONE.**
- [x] **12.09 — Fix user message lost on send failure** — **DONE.**
- [x] **12.10 — Fix useDocumentHead incomplete dependency array** — **DONE.**
- [x] **12.11 — Fix ReferralCard input cleared before mutation completes** — **DONE.**
- [x] **12.12 — Fix SocialShare native share + popover conflict** — **DONE.**
- [x] **12.13 — Fix ReferralCard clipboard.writeText missing try/catch** — **DONE.**
- [x] **12.14 — Fix SubscriptionCard null trialStartDate** — **DONE.**
- [x] **12.15 — Fix Advertisement "Learn More" dead button** — **DONE.**
- [x] **12.16 — Remove dead code: auth-utils.ts** — **DONE.**
- [x] **12.17 — Remove dead code: apiRequest in queryClient.ts** — **DONE.**
- [x] **12.18 — Remove dead code: commented delay in use-problems.ts** — **DONE.**
- [x] **12.19 — Remove dead code: sanitizeObject in security.ts** — **DONE.**
- [x] **12.20 — Remove dead code: unused imports** — **DONE.**
- [x] **12.21 — Remove dead code: rawBody capture in server/index.ts** — **DONE.**

**Subtotal: 21/21 completed**

---

## Category 13: Security Hardening

- [x] **13.01 — Add authentication to scaffolded routes** — **DONE.**
- [x] **13.02 — Add authentication to file uploads** — **DONE.**
- [x] **13.03 — Fix input sanitization approach** — **DONE.**
- [x] **13.04 — Fix CSP unsafe-inline scripts** — **DONE.** Documented for nonce-based CSP.
- [x] **13.05 — Reduce false positives in payload blocking** — **DONE.**
- [x] **13.06 — Fix dev mode detection** — **DONE.** Uses NODE_ENV.
- [x] **13.07 — Secure token storage in sessions** — **DONE.**
- [x] **13.08 — Fix synchronous file reads in static.ts** — **DONE.**
- [x] **13.09 — Add rate limiting to scaffolded AI routes** — **DONE.**

**Subtotal: 9/9 completed**

---

## Category 14: Dependency Cleanup

- [x] **14.01 — Remove `@tailwindcss/vite`** — **DONE.**
- [x] **14.02 — Remove `tw-animate-css`** — **DONE.**
- [x] **14.03 — Move @types packages to devDependencies** — **DONE.**
- [x] **14.04 — Add `@assets` path alias to tsconfig.json** — **DONE.**
- [x] **14.05 — Add `.cache/` and `*.log` to .gitignore** — **DONE.**
- [x] **14.06 — Clean build script external allowlist** — **DONE.**
- [x] **14.07 — Remove `.upm/` directory** — **DONE.**

**Subtotal: 7/7 completed**

---

## Category 15: Privacy & Data Protection

- [x] **15.01 — Create Privacy & Data Protection Policy document** — **DONE.** `docs/privacy-policy.md`
- [x] **15.02 — Enhance FAQ privacy answers across all locales** — **DONE.**
- [x] **15.03 — Add privacy trust indicator in problem creation dialog** — **DONE.** ShieldCheck badge.
- [x] **15.04 — Add Privacy section to Landing page** — **DONE.**
- [x] **15.05 — Create dedicated Privacy Policy page** — **DONE.** `/privacy` route.
- [x] **15.06 — Implement account deletion flow** — **DONE.** DELETE /api/profile.
- [x] **15.07 — Add data export/portability endpoint** — **DONE.** GET /api/profile/export.
- [x] **15.08 — Add cookie consent banner** — **DONE.** CookieConsent component.
- [x] **15.09 — Strip PII from AI requests explicitly** — **DONE.** server/utils/pii-guard.ts.
- [x] **15.10 — Add privacy-aware logging** — **DONE.** No PII in server logs.

**Subtotal: 10/10 completed**

---

## Summary Dashboard

| Category | Total | Done | Pending | Progress |
|---|:---:|:---:|:---:|:---:|
| 1. Core Application (Built Features) | 26 | 26 | 0 | 100% |
| 2. Critical Missing Items (Launch Blockers) | 7 | 7 | 0 | 100% |
| 3. Wire In Scaffolded Features | 5 | 5 | 0 | 100% |
| 4. Payment & Subscription | 8 | 1 | 7 | 13% |
| 5. Authentication & User Management | 5 | 1 | 4 | 20% |
| 6. SEO & Digital Marketing Activation | 12 | 2 | 10 | 17% |
| 7. UI/UX Improvements | 14 | 10 | 4 | 71% |
| 8. Backend Improvements | 8 | 8 | 0 | 100% |
| 9. Testing & CI/CD | 5 | 0 | 5 | 0% |
| 10. DevOps & Deployment | 6 | 2 | 4 | 33% |
| 11. Documentation | 6 | 3 | 3 | 50% |
| 12. Bugs & Code Quality | 21 | 21 | 0 | **100%** |
| 13. Security Hardening | 9 | 9 | 0 | **100%** |
| 14. Dependency Cleanup | 7 | 7 | 0 | **100%** |
| 15. Privacy & Data Protection | 10 | 10 | 0 | **100%** |
| **TOTAL** | **149** | **108** | **41** | **72%** |

---

## Priority Matrix

| Priority | Remaining Tasks | Rationale |
|---|---|---|
| **P0 — Launch Blockers** | 4.01, 5.01 | Cannot launch without payment integration and standalone auth |
| **P1 — Critical** | 6.01–6.06, 6.12, 9.01, 9.05 | SEO activation, testing framework, CI/CD |
| **P2 — Important** | 4.03–4.05, 5.02–5.03, 6.07–6.09, 7.08–7.09, 9.02–9.04, 11.02–11.03, 11.05 | Onboarding, notification center, testing, docs |
| **P3 — Phase 2/3** | 4.06–4.08, 5.04, 7.04, 10.02–10.05 | WebSocket, Stripe, annual plans, referral optimizations, refinements |

---

## Task Dependencies

```
5.01 (standalone auth) ──→ 5.04 (password reset)
5.01 (standalone auth) ──→ 15.06 (account deletion integration)
8.01 (health endpoint) ──→ 10.03 (uptime monitoring)
7.05 (problem categories) ──→ 7.06 (search/filter) [7.05 DONE]
9.01 (test framework) ──→ 9.02, 9.03, 9.04
4.01 (payment integration) ──→ 4.02 (full enforcement), 4.03, 4.04, 4.05
4.01 (payment) ──→ 4.06 (Stripe Phase 2), 4.07 (annual plans)
```

---

## Notes

- Tasks 2.03/11.01 overlap (README.md). Tasks 2.05/11.04 overlap (LICENSE).
- Task 5.04 (password reset) only applies if 5.01 uses email/password auth.
- 12-locale system (shared/locales.ts) impacts SEO tasks (6.11, 6.12) and payment (4.05).
- `docs/implementation-plan.md` maps remaining tasks to 10 implementation stages with AI prompts.
- `docs/monetization-strategy.md` and `docs/payment-options-hk.md` provide payment integration guidance.
- 4.02 DONE: Trial/subscription check added to POST `/api/problems/:id/messages` (discussion sendMessage).
- UI/UX batch (7.01, 7.02, 7.03, 7.06, 7.07, 7.10): ProblemCardSkeleton, ProblemDetailSkeleton, AppShell sidebar, DashboardCharts (PieChart + BarChart), search/filter/pagination via getProblemsFiltered, responsive layout.
