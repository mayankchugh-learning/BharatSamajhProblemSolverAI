# BharatSolve AI — Master Task List v4

> Generated: 2026-02-23 | Updated: 2026-02-23
> Previous version: [tasklist_v3.md](./tasklist_v3.md)
> Total Tasks: 150 (line items) | Completed: 109 | Pending: 41

---

## Version History

| Version | Date | Tasks | Done | Pending | Key Changes |
|---|---|:---:|:---:|:---:|---|
| **v4** | 2026-02-23 | 150 | 109 | 41 | Added 11.07 application-cost-deployment-maintenance.md (DONE). Added Generation Logic section at bottom. |
| v3 | 2026-02-23 | 149 | 108 | 41 | UI/UX batch: 7.01–7.03, 7.06, 7.07, 7.10 DONE; Cat 8 fully done; 4.02 DONE |
| v2 | 2026-02-22 | 101 | 24 | 77 | Full code audit; bugs/security/quality categories |
| v1 | 2026-02-22 | 77 | 18 | 59 | Initial task list from project & docs review |

### Changes from v3 → v4

- **New completed task:** 11.07 — Application cost & TCO guide. `docs/application-cost-deployment-maintenance.md` exists with deployment tiers, cost components, AI cost model, TCO summary.
- **Added:** Generation Logic section (see bottom of file) documenting how tasklists are produced and updated.

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
- [x] **1.19 — Multi-locale system** — 12 locales (IN, SG, HK, JP, CN, US, GB, KR, AE, AU, DE, BR) with locale-specific content. `shared/locales.ts`, `client/src/contexts/locale-context.tsx`
- [x] **1.20 — Locale switcher component** — UI for switching between locales. `client/src/components/LocaleSwitcher.tsx`
- [x] **1.21 — Locale-aware branding** — Brand logo with locale-specific flags. `client/src/components/BrandLogo.tsx`
- [x] **1.22 — Dockerfile & Docker Compose** — Multi-stage Dockerfile, docker-compose.yml. `Dockerfile`, `docker-compose.yml`
- [x] **1.23 — Terraform infrastructure** — AWS ECS/Fargate, ALB, RDS PostgreSQL, Secrets Manager. `infrastructure/`
- [x] **1.24 — File upload scanner** — Validates uploaded files for suspicious content. `server/utils/file-scanner.ts`
- [x] **1.25 — Web search for AI context** — Brave/Serper integration. `server/utils/web-search.ts`, used in `getAISolution()`.
- [x] **1.26 — Feedback submission system** — FeedbackDialog, POST `/api/feedback`. `client/src/components/FeedbackDialog.tsx`.

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

- [x] **3.01 — Wire chat integration** — **DONE.** `registerChatRoutes(app, isAuthenticated)`.
- [x] **3.02 — Wire audio/voice AI** — **DONE.** `registerAudioRoutes(app, isAuthenticated)`.
- [x] **3.03 — Wire image generation** — **DONE.** `registerImageRoutes(app, isAuthenticated)`.
- [x] **3.04 — Wire batch processing** — **DONE.** `POST /api/problems/batch`.
- [x] **3.05 — Add dark mode toggle** — **DONE.** ThemeProvider, ThemeToggle.

**Subtotal: 5/5 completed**

---

## Category 4: Payment & Subscription

- [ ] **4.01 — Integrate payment gateway (Lemon Squeezy recommended)** — Subscribe button flips DB flag. No real payment.
- [x] **4.02 — Implement full subscription enforcement** — **DONE.** Trial check on problem create, batch, and discussion sendMessage.
- [ ] **4.03 — Add subscription management page** — No UI for billing history, cancel, payment method update.
- [ ] **4.04 — Implement referral reward fulfillment** — Referral codes update DB but don't extend via payment system.
- [ ] **4.05 — Create Lemon Squeezy products for 12 locales** — One product per locale in LS dashboard.
- [ ] **4.06 — Add Stripe HK (Phase 2)** — When revenue > HK$5,000/mo.
- [ ] **4.07 — Add annual subscription plans (Phase 3)** — 17% discount.
- [ ] **4.08 — Referral program optimizations** — Auto-append to WhatsApp, progress display, tiered rewards.

**Subtotal: 1/8 completed**

---

## Category 5: Authentication & User Management

- [ ] **5.01 — Replace Replit Auth with standalone auth** — OIDC depends on `REPL_ID`. Need email/password, Google OAuth, or phone OTP.
- [ ] **5.02 — Add user profile editing** — No UI for name/email/picture. `use-profile.ts` read-only.
- [ ] **5.03 — Add account deletion** — Backend DONE (15.06). Needs standalone auth integration.
- [ ] **5.04 — Implement password reset flow** — Only if 5.01 uses email/password.
- [x] **5.05 — Add CSRF protection** — **DONE.** X-CSRF-Token CORS, SameSite cookie.

**Subtotal: 1/5 completed**

---

## Category 6: SEO & Digital Marketing Activation

- [ ] **6.01 — Activate Google Tag Manager** — Commented out, placeholder `GTM-XXXXXXX`.
- [ ] **6.02 — Configure GA4 in GTM** — Custom events.
- [ ] **6.03 — Submit sitemap to Google Search Console** — Not submitted.
- [ ] **6.04 — Submit sitemap to Bing Webmaster Tools** — Not submitted.
- [ ] **6.05 — Validate structured data** — Google Rich Results Test.
- [ ] **6.06 — Test social previews** — Facebook, LinkedIn, Twitter, WhatsApp.
- [ ] **6.07 — Generate PWA icon set** — Need 48/72/96/144/192/512px + service worker.
- [ ] **6.08 — Add social media profile links** — `sameAs` in JSON-LD empty.
- [ ] **6.09 — Add Twitter/X handle** — Missing `twitter:site` meta.
- [x] **6.10 — Remove fake ratings** — **DONE.** Removed fabricated `aggregateRating`.
- [x] **6.11 — Sync JSON-LD languages** — **DONE.** `inLanguage` includes all languages.
- [ ] **6.12 — Make index.html meta tags locale-aware** — Server-side crawler handles; client defaults to India.

**Subtotal: 2/12 completed**

---

## Category 7: UI/UX Improvements

- [x] **7.01 — Improve loading states with skeletons** — **DONE.** ProblemCardSkeleton, ProblemDetailSkeleton.
- [x] **7.02 — Implement sidebar navigation** — **DONE.** AppShell, SidebarProvider, collapsible sidebar.
- [x] **7.03 — Add analytics charts** — **DONE.** DashboardCharts (PieChart + BarChart).
- [ ] **7.04 — Implement WebSocket real-time updates** — `ws` installed but unused.
- [x] **7.05 — Add problem categories** — **DONE.** 11 categories, 2-step CreateProblemDialog.
- [x] **7.06 — Add problem search and filter** — **DONE.** getProblemsFiltered, category/status select.
- [x] **7.07 — Add pagination** — **DONE.** Pagination component, server-side limit/offset.
- [ ] **7.08 — Add onboarding/welcome flow** — No first-time user guidance.
- [ ] **7.09 — Add persistent notification system** — Toast only. No notification center.
- [x] **7.10 — Mobile responsiveness audit** — **DONE.** Sidebar Sheet on mobile, responsive layout.
- [x] **7.11 — Add React error boundary** — **DONE.** ErrorBoundary in App.tsx.
- [x] **7.12 — Fix ProblemCard keyboard accessibility** — **DONE.**
- [x] **7.13 — Fix not-found page theme tokens** — **DONE.**
- [x] **7.14 — Add React StrictMode** — **DONE.**

**Subtotal: 10/14 completed**

---

## Category 8: Backend Improvements

- [x] **8.01 — Add health check endpoint** — **DONE.** `GET /api/health`.
- [x] **8.02 — Implement proper database migrations** — **DONE.** db:generate, db:migrate, drizzle/.
- [x] **8.03 — Add structured logging** — **DONE.** Pino, request IDs, logger.ts.
- [x] **8.04 — Add email service** — **DONE.** Resend in server/utils/email.ts.
- [x] **8.05 — Add API versioning** — **DONE.** Routes under `/api/v1/`.
- [x] **8.06 — Tune database connection pool** — **DONE.**
- [x] **8.07 — Fix unsafe null casts in db.ts** — **DONE.**
- [x] **8.08 — Add database SSL configuration** — **DONE.**

**Subtotal: 8/8 completed**

---

## Category 9: Testing & CI/CD

- [ ] **9.01 — Set up testing framework** — No tests. Add Vitest + Playwright.
- [ ] **9.02 — Write API endpoint tests** — Test all routes.
- [ ] **9.03 — Write component tests** — Key components.
- [ ] **9.04 — Write E2E tests** — Critical user flows.
- [ ] **9.05 — Set up CI/CD pipeline (GitHub Actions)** — No `.github/workflows/`.

**Subtotal: 0/5 completed**

---

## Category 10: DevOps & Deployment

- [x] **10.01 — Create Dockerfile** — **DONE.**
- [ ] **10.02 — Set up error monitoring (Sentry)** — No error tracking.
- [ ] **10.03 — Set up uptime monitoring** — UptimeRobot, etc.
- [ ] **10.04 — Configure CDN** — No CDN configured.
- [ ] **10.05 — Set up database backups** — No backup strategy.
- [x] **10.06 — Add production source maps** — **DONE.**

**Subtotal: 2/6 completed**

---

## Category 11: Documentation

- [x] **11.01 — Create root README.md** — **DONE.**
- [ ] **11.02 — Add API documentation (OpenAPI/Swagger)** — No machine-readable API docs.
- [ ] **11.03 — Add CONTRIBUTING.md** — No contributor guidelines.
- [x] **11.04 — Create LICENSE file** — **DONE.** MIT LICENSE.
- [ ] **11.05 — Add CHANGELOG.md** — No changelog.
- [x] **11.06 — Free hosting deployment guide** — **DONE.** `docs/free-hosting-deployment.md`.
- [x] **11.07 — Application cost & TCO guide (NEW in v4)** — **DONE.** `docs/application-cost-deployment-maintenance.md` — deployment tiers, cost components, AI cost model, TCO summary.

**Subtotal: 4/7 completed**

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
| 1. Core Application | 26 | 26 | 0 | 100% |
| 2. Critical Missing Items | 7 | 7 | 0 | 100% |
| 3. Wire In Scaffolded Features | 5 | 5 | 0 | 100% |
| 4. Payment & Subscription | 8 | 1 | 7 | 13% |
| 5. Authentication & User Management | 5 | 1 | 4 | 20% |
| 6. SEO & Digital Marketing | 12 | 2 | 10 | 17% |
| 7. UI/UX Improvements | 14 | 10 | 4 | 71% |
| 8. Backend Improvements | 8 | 8 | 0 | 100% |
| 9. Testing & CI/CD | 5 | 0 | 5 | 0% |
| 10. DevOps & Deployment | 6 | 2 | 4 | 33% |
| 11. Documentation | 7 | 4 | 3 | 57% |
| 12. Bugs & Code Quality | 21 | 21 | 0 | 100% |
| 13. Security Hardening | 9 | 9 | 0 | 100% |
| 14. Dependency Cleanup | 7 | 7 | 0 | 100% |
| 15. Privacy & Data Protection | 10 | 10 | 0 | 100% |
| **TOTAL** | **150** | **109** | **41** | **73%** |

---

## Priority Matrix

| Priority | Remaining Tasks | Rationale |
|---|---|---|
| **P0 — Launch Blockers** | 4.01, 5.01 | Payment integration and standalone auth |
| **P1 — Critical** | 6.01–6.06, 6.12, 9.01, 9.05 | SEO activation, testing framework, CI/CD |
| **P2 — Important** | 4.03–4.05, 5.02–5.03, 6.07–6.09, 7.08–7.09, 9.02–9.04, 11.02–11.03, 11.05 | UX polish, testing, docs |
| **P3 — Phase 2/3** | 4.06–4.08, 5.04, 7.04, 10.02–10.05 | WebSocket, Stripe, annual plans, refinements |

---

## Task Dependencies

```
5.01 ──→ 5.04, 15.06
8.01 ──→ 10.03
7.05 ──→ 7.06 [DONE]
9.01 ──→ 9.02, 9.03, 9.04
4.01 ──→ 4.02, 4.03, 4.04, 4.05
4.01 ──→ 4.06, 4.07
```

---

## Notes

- Tasks 2.03/11.01 overlap (README). Tasks 2.05/11.04 overlap (LICENSE).
- 5.04 only applies if 5.01 uses email/password auth.
- 12-locale system impacts SEO (6.11, 6.12) and payment (4.05).
- `docs/implementation-plan.md` — stage prompts for remaining work.
- `docs/monetization-strategy.md`, `docs/payment-options-hk.md` — payment integration.
- `docs/application-cost-deployment-maintenance.md` — cost and TCO analysis.

---

## Generation Logic

This section documents how tasklist versions are produced and updated. Use it when creating a new tasklist version (e.g. tasklist_v5.md).

### 1. Sources to Compare

| Source | Purpose |
|--------|---------|
| `docs/tasklist_v<N>.md` | Previous tasklist (base for diff) |
| `docs/project-overview.md` | Architecture, tech stack, features |
| `docs/implementation-plan.md` | Stage prompts, task mapping |
| `docs/monetization-strategy.md` | Payment roadmap, revenue tasks |
| `docs/payment-options-hk.md` | Payment provider options |
| `docs/digital-marketing.md` | SEO/marketing tasks |
| `docs/free-hosting-deployment.md` | Deployment guides |
| `docs/application-cost-deployment-maintenance.md` | Cost and TCO |
| `docs/Functionality.md` | Feature documentation |
| `docs/architecture.md` | System design |
| `client/src/**/*` | Frontend components, pages, hooks |
| `server/**/*` | Routes, middleware, integrations |
| `shared/**/*` | Schema, locales, types |
| `package.json` | Scripts, dependencies |
| `infrastructure/` | Terraform, Docker |
| `.github/workflows/` | CI/CD (if present) |

### 2. Criteria for Marking Tasks Done

A task is **[x] Completed** when:

- **Code exists:** Relevant files exist and implement the described behavior (e.g. component, route, middleware).
- **Integration is wired:** Feature is connected to main app (e.g. route registered, component used in layout).
- **Documentation exists:** For doc tasks, the referenced file exists and covers the topic.
- **Config/asset exists:** For config tasks (e.g. OG image, PWA icons), the file/asset exists.

A task remains **[ ] Pending** when:

- Code/docs/config are missing, or
- Code exists but is not integrated (scaffolded but not wired), or
- Feature is partially implemented (e.g. enforcement on some endpoints but not all).

### 3. Criteria for Adding New Tasks

Add a new task when:

- A new doc or feature is discovered that is not covered by existing tasks.
- Documentation (monetization, payment, implementation-plan) describes work that has no matching task.
- A new category emerges from the codebase or docs.

Use format: `- [ ] **N.NN — Title** — Description. `path/to/file` or reference.`

### 4. Version Increment Rules

- **Major version bump (v4 → v5):** New tasklist file. Never modify previous versions.
- **Header:** Update `Generated`, `Previous version`, `Total Tasks`, `Completed`, `Pending`.
- **Version History table:** Add new row for this version; keep prior rows.
- **Changes section:** List differences from previous version (new tasks, status changes, corrections).

### 5. Process Steps

1. Read previous tasklist (`tasklist_v<N>.md`).
2. Scan all sources above for changes (new files, new docs, new features, removed code).
3. For each existing task: verify status against codebase; update [x]/[ ] if needed.
4. Add new tasks for discovered gaps.
5. Recompute category subtotals and Summary Dashboard.
6. Update Priority Matrix and Task Dependencies if needed.
7. Append/update Notes with any overlap or caveats.
8. Save as `tasklist_v<N+1>.md`. Do not edit `tasklist_v1.md`, `tasklist_v2.md`, etc.

### 6. Naming Convention

- Files: `docs/tasklist_v1.md`, `docs/tasklist_v2.md`, ...
- Task IDs: `CATEGORY.TASK` (e.g. `4.01`, `7.06`).
- Categories: 1–15 as defined. Do not renumber; add new categories only when necessary.

### 7. Cross-References

- Link previous version: `[tasklist_v3.md](./tasklist_v3.md)`
- Link docs: `docs/monetization-strategy.md`, `docs/implementation-plan.md`
- Link code paths: `` `client/src/pages/Dashboard.tsx` ``
