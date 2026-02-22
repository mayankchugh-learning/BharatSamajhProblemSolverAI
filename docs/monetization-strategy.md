# BharatSolve AI — Monetization Strategy & Execution Plan

> **Situation:** Solo developer based in Hong Kong, no business entity.
> **Product:** Multi-country AI problem-solving SaaS (12 locales: IN, SG, HK, JP, CN, US, UK, KR, UAE, AU, DE, BR).
> **Current State:** App built with freemium model, subscribe button has no payment verification, strong SEO/marketing infra built but not activated.

---

## Table of Contents

1. [Revenue Model Overview](#1-revenue-model-overview)
2. [Revenue Streams](#2-revenue-streams)
3. [Pricing Strategy](#3-pricing-strategy)
4. [Payment Integration Roadmap](#4-payment-integration-roadmap)
5. [Digital Marketing Funnel](#5-digital-marketing-funnel)
6. [User Acquisition Strategy](#6-user-acquisition-strategy)
7. [Conversion Optimization](#7-conversion-optimization)
8. [Retention & Churn Reduction](#8-retention--churn-reduction)
9. [Referral Program Monetization](#9-referral-program-monetization)
10. [Revenue Projections](#10-revenue-projections)
11. [Execution Phases](#11-execution-phases)
12. [KPIs & Metrics Dashboard](#12-kpis--metrics-dashboard)
13. [Risk Mitigation](#13-risk-mitigation)

---

## 1. Revenue Model Overview

BharatSolve AI uses a **freemium subscription model** with multiple revenue amplifiers:

```
FREE TIER (User Acquisition)
  └─ 30-day trial with full access
       └─ PAID SUBSCRIPTION (Core Revenue)
            └─ Monthly recurring subscription
                 └─ REFERRAL PROGRAM (Organic Growth)
                      └─ Both parties earn free months
                           └─ VIRAL LOOP (Compounding Growth)
```

**Why freemium works for this product:**
- AI advice is a trust-based product — users need to experience value before paying
- 30-day trial covers enough time for users to form a habit (3+ problems solved)
- Multi-language support creates natural word-of-mouth in language communities

---

## 2. Revenue Streams

### Stream 1: Monthly Subscriptions (Primary — ~85% of revenue)

The core revenue engine. Locale-specific pricing designed around local purchasing power parity (PPP):

| Locale | Price | Currency | USD Equivalent | PPP Multiplier |
|---|---|---|---|---|
| India | ₹499 | INR | ~$5.95 | 1.0x (base) |
| Singapore | S$15 | SGD | ~$11.25 | 1.9x |
| Hong Kong | HK$99 | HKD | ~$12.70 | 2.1x |
| Japan | ¥1,500 | JPY | ~$10.00 | 1.7x |
| China | ¥49 | CNY | ~$6.75 | 1.1x |
| USA | $10 | USD | $10.00 | 1.7x |
| UK | £8 | GBP | ~$10.15 | 1.7x |
| Korea | ₩13,000 | KRW | ~$9.75 | 1.6x |
| UAE | AED 39 | AED | ~$10.60 | 1.8x |
| Australia | A$15 | AUD | ~$9.75 | 1.6x |
| Germany | €9 | EUR | ~$9.80 | 1.6x |
| Brazil | R$29 | BRL | ~$5.00 | 0.8x |

**Blended ARPU estimate:** ~$8.50/month (weighted towards India users)

### Stream 2: Annual Subscription Discount (Revenue Stability — ~10% of revenue)

Offer annual plans at a 2-month-free discount to improve cash flow predictability and reduce churn:

| Locale | Monthly | Annual | Annual Savings |
|---|---|---|---|
| India | ₹499/mo | ₹4,990/yr | Save ₹998 (17%) |
| USA | $10/mo | $100/yr | Save $20 (17%) |
| UK | £8/mo | £80/yr | Save £16 (17%) |

**Why annual matters:**
- Annual churn rate is ~50% lower than monthly
- 10 months paid upfront improves cash runway
- Signal of committed users (higher LTV)

### Stream 3: Referral Rewards (Growth Engine — indirect revenue)

Both referrer and referee get 1 free month. This is a cost center, not revenue — but it drives LTV:
- CAC via referral = $0 (compared to $3–8 via paid ads)
- Referred users have 37% higher retention (industry average)
- Each active referrer creates 2.4 new users on average

### Stream 4: Future — Premium AI Features (Phase 3+)

When the user base matures, introduce premium add-ons:

| Feature | Price | Description |
|---|---|---|
| Priority AI Queue | +50% of base | Skip queue during peak hours, faster responses |
| Voice Conversations | +30% of base | Voice AI (STT/TTS) — infra already built |
| AI Image Generation | +20% of base | Visual advice/charts — infra already built |
| Family Plan (5 users) | 3x base | Shared subscription for families |
| Export to PDF | Included in Pro | Download solutions as formatted PDFs |

---

## 3. Pricing Strategy

### 3a. Psychological Pricing Principles

1. **Anchor effect:** Show "value" of AI advice (therapist: $150/hr, career counselor: $100/hr) vs. ₹499/mo unlimited
2. **Free trial removes risk:** 30 days is enough time for 5+ problems solved, creating switching cost
3. **Local currency display:** Customers see their own currency — no mental conversion friction
4. **Odd pricing:** ₹499 not ₹500, $9.99 not $10 (where applicable per locale)

### 3b. India-Specific Pricing Rationale

India is the primary market. ₹499/mo (~$6) is positioned:
- Below Netflix India (₹199–₹649) — comparable value perception
- Below therapy/counseling (₹1,500–₹3,000/session) — massive value gap
- Above commodity apps (₹49–₹99) — signals quality
- At par with Headspace India (~₹499/mo) — validated price point for wellness/life apps

### 3c. Competitive Pricing Map

| Competitor | Price | BharatSolve Advantage |
|---|---|---|
| BetterHelp India | $65/week | 50x cheaper; AI-first, instant responses |
| Headspace | ₹499/mo | Same price; BharatSolve is culturally tuned |
| ChatGPT Plus | $20/mo | 3x cheaper; purpose-built for life problems |
| Generic AI chatbots | Free | BharatSolve has cultural context, structured solutions, history |

---

## 4. Payment Integration Roadmap

### Phase 1: Launch Payments (Week 1–2) — Lemon Squeezy

**Why Lemon Squeezy first:** No business entity needed. They handle global taxes. You can go live in 1–2 days.

| Step | Action | Timeline |
|---|---|---|
| 1 | Create Lemon Squeezy account (personal email + HK bank) | Day 1 |
| 2 | Create 12 subscription products (one per locale/currency) | Day 1 |
| 3 | Get API key and webhook secret | Day 1 |
| 4 | Implement checkout flow: Subscribe button → LS checkout overlay | Day 2–3 |
| 5 | Implement webhook handler: `subscription.created` → activate subscription | Day 3 |
| 6 | Implement webhook: `subscription.cancelled` → mark expired | Day 3 |
| 7 | Implement webhook: `payment.failed` → grace period → expire | Day 4 |
| 8 | Add subscription enforcement middleware (block AI endpoints for expired users) | Day 4 |
| 9 | Test end-to-end with LS test mode | Day 5 |
| 10 | Go live | Day 5 |

**Codebase changes required:**
- `server/routes.ts` — Replace `POST /api/profile/subscribe` with Lemon Squeezy checkout session creation
- `shared/schema.ts` — Add `lemonSqueezyCustomerId`, `subscriptionId`, `currentPeriodEnd`, `cancelAtPeriodEnd` to `user_profiles`
- `client/src/components/SubscriptionCard.tsx` — Replace direct subscribe call with LS checkout redirect
- New: `POST /api/webhooks/lemonsqueezy` — Webhook endpoint for subscription lifecycle events
- New: Subscription enforcement middleware before AI endpoints

**Cost at this phase:**
- Lemon Squeezy free tier: 5% + $0.50 per transaction
- On ₹499 (≈$5.95): fee = $0.80 → you receive $5.15 → **86% revenue retention**

### Phase 2: Optimize Payments (When revenue > HK$5,000/mo) — Add Stripe

| Step | Action | Timeline |
|---|---|---|
| 1 | Register HK sole proprietor (Form 1(a), HK$2,200, 1 day) | Day 1 |
| 2 | Open Stripe HK account with HKID + BRC | Day 2–4 |
| 3 | Implement Stripe Billing alongside Lemon Squeezy | Week 2 |
| 4 | Route Asian users (HK, SG, JP, CN, KR) to Stripe (for Alipay/WeChat Pay) | Week 2 |
| 5 | Route other users to Lemon Squeezy (simpler tax compliance) | Week 2 |
| 6 | Add Stripe Tax (+0.5%) for automatic tax calculation | Week 3 |

**Cost at this phase:**
- Stripe: 3.4% + HK$2.35 per transaction → **~91% revenue retention**
- Savings vs Lemon Squeezy: ~5% per transaction (adds up with scale)
- Break-even on HK$2,200 sole prop fee: ~60 transactions

### Phase 3: Premium Expansion (Revenue > HK$20,000/mo) — Annual Plans + Add-ons

| Step | Action |
|---|---|
| 1 | Launch annual subscription plans (17% discount) |
| 2 | Add PayPal as secondary payment option (trust factor for some demographics) |
| 3 | Implement subscription upgrade/downgrade flows |
| 4 | Launch voice AI as paid add-on (infra already built) |
| 5 | Register HK Limited Company for liability protection |

---

## 5. Digital Marketing Funnel

Leverage the already-built marketing infrastructure to create a complete acquisition funnel:

```
AWARENESS (Top of Funnel)
  │  SEO organic traffic (Google, Bing)
  │  Social media sharing (WhatsApp, Facebook, LinkedIn, Twitter, Telegram)
  │  Referral program word-of-mouth
  │  Content marketing (blog/SEO pages)
  │
  ▼
INTEREST (Middle of Funnel)
  │  Landing page with social proof, testimonials, FAQ
  │  JSON-LD rich snippets in Google results
  │  PWA install prompt ("Add to Home Screen")
  │
  ▼
TRIAL (Conversion Point)
  │  30-day free trial signup
  │  Immediate AI problem-solving experience
  │  No credit card required
  │
  ▼
ACTIVATION (Value Delivery)
  │  First problem solved within 5 minutes
  │  Follow-up discussion on solutions
  │  Multi-language support creates "wow" moment
  │
  ▼
SUBSCRIPTION (Revenue)
  │  Trial expiry → subscription prompt
  │  Subscription card with countdown timer
  │  Simple one-click payment via Lemon Squeezy/Stripe
  │
  ▼
RETENTION (LTV Growth)
  │  Ongoing problem solving creates habit
  │  Referral rewards incentivize sharing
  │  Annual plan lock-in reduces churn
  │
  ▼
REFERRAL (Viral Loop)
     Share via WhatsApp/social → new user → repeat cycle
```

---

## 6. User Acquisition Strategy

### Channel 1: SEO & Organic Search (Lowest CAC — already built)

**Status:** Infrastructure built, needs activation.

| Action | Effort | Impact | Status |
|---|---|---|---|
| Activate Google Tag Manager | 30 min | Enables all analytics | Task 6.01 |
| Configure GA4 with conversion events | 1 hr | Track signup → trial → paid funnel | Task 6.02 |
| Submit sitemap to Google Search Console | 15 min | Index all pages | Task 6.03 |
| Submit sitemap to Bing Webmaster | 15 min | Bing/DuckDuckGo coverage | Task 6.04 |
| Validate JSON-LD structured data | 30 min | Rich snippets in search results | Task 6.05 |
| Test social preview cards | 1 hr | Better CTR on shares | Task 6.06 |

**Target keywords already configured:**
- "AI problem solver India" — high intent, low competition
- "Indian AI advisor" — culturally specific, unique positioning
- "family problem solver" — emotional need, high search volume in India
- "career advice India" — practical need, recurring searches
- "AI counsellor Hindi" — language-specific long-tail

**SEO content strategy for each locale:**
- India: Family dynamics, career, marriage, education, joint family conflicts
- Singapore: Expat life, education stress, cost of living, work-life balance
- Hong Kong: Housing stress, family expectations, career transitions
- Japan: Work culture, social pressure, relationship norms

### Channel 2: WhatsApp Viral Sharing (Highest potential for India)

**Status:** Social sharing component built and deployed.

WhatsApp is the dominant messaging platform in India (500M+ users). The sharing flow:

```
User solves a problem → sees "Share" button → shares on WhatsApp
  → Contact receives: "BharatSolve AI helped me solve: [problem title]"
  → Link to bharatsolve.ai with OG preview card
  → Contact visits → sees landing page with testimonials
  → Signs up for free trial
```

**Amplification tactics:**
1. **Post-solution share prompt:** After AI delivers a solution, show "This helped? Share with someone who needs it"
2. **Referral code in WhatsApp message:** Auto-append referral code to shared messages
3. **Family group targeting:** Encourage sharing to family WhatsApp groups (natural fit for family problem solver)

### Channel 3: Content Marketing (Medium-term — Month 2+)

Create SEO-optimized public pages targeting long-tail search:

| Page | Target Keyword | Search Intent |
|---|---|---|
| `/advice/joint-family-problems` | "how to deal with joint family" | Informational → conversion |
| `/advice/career-change-india` | "career change at 30 india" | Informational → conversion |
| `/advice/arrange-marriage-doubts` | "arranged marriage advice india" | Emotional → conversion |
| `/advice/work-life-balance-singapore` | "work life balance singapore tips" | Informational → conversion |
| `/advice/housing-stress-hong-kong` | "hong kong housing stress solutions" | Emotional → conversion |

Each page: SEO content + CTA to sign up + structured data + social sharing.

### Channel 4: Social Media Presence (Ongoing — Month 1+)

| Platform | Target Audience | Content Type |
|---|---|---|
| Instagram Reels | Indian 18–35, urban | 60-sec "AI solved my problem" stories |
| YouTube Shorts | Hindi speakers | Demo: "Ask BharatSolve in Hindi" |
| LinkedIn | Singapore/HK professionals | Work-life balance, career advice tips |
| Twitter/X | Tech-savvy, all locales | Product updates, user testimonials |
| Facebook Groups | Indian families, parents | Family advice posts with BharatSolve mention |
| Telegram Channels | Tech communities | Product announcements, early access |

**Cost: $0** (organic posting). Scale to paid ads only after product-market fit is validated (>100 paying users).

### Channel 5: App Store Presence via PWA (No cost)

**Status:** PWA manifest built, needs icon generation (Task 6.07).

- List on Microsoft Store via PWABuilder (free)
- Appear in Google Play Web Apps section
- iOS "Add to Home Screen" prompt
- Increases discoverability without App Store fees

---

## 7. Conversion Optimization

### 7a. Trial-to-Paid Conversion Tactics

**Target:** 8–12% trial-to-paid conversion (SaaS industry average: 5–15%)

| Tactic | When | How |
|---|---|---|
| **First value in 5 min** | Signup | Onboarding guides user to submit first problem immediately |
| **Day 3 engagement check** | Day 3 | If no problem submitted, prompt via in-app notification |
| **Day 14 midpoint nudge** | Day 14 | "You've solved X problems. 16 days left in your trial." |
| **Day 25 urgency** | Day 25 | "5 days left! Subscribe to keep your solutions." |
| **Day 28 final push** | Day 28 | "Your trial ends in 2 days. Subscribe now — ₹499/mo." |
| **Day 30 expiry** | Day 30 | Feature lock + "Reactivate" CTA on every page |
| **Day 37 win-back** | Day 37 | Email: "We miss you. Here's 7 extra free days." (if email set up) |

### 7b. Pricing Page Optimization

The landing page pricing section should:
1. Show crossed-out "per-session therapy cost" vs. BharatSolve monthly cost
2. Display locale-specific pricing automatically (already built via locale system)
3. Show trust badges: "30-day free trial", "Cancel anytime", "No credit card required"
4. Include micro-testimonial near the subscribe button

### 7c. Payment Page Optimization

- **Reduce checkout friction:** Lemon Squeezy overlay (no redirect) keeps users on-site
- **Multiple payment methods:** Cards + PayPal + Apple Pay + Google Pay (all supported by LS)
- **Trust signals on checkout:** "Secure payment via Lemon Squeezy" badge, "Cancel anytime"
- **Recovery for failed payments:** Lemon Squeezy handles dunning (retry failed payments automatically)

---

## 8. Retention & Churn Reduction

**Target monthly churn:** <5% (industry average for wellness SaaS: 6–8%)

### 8a. Habit Formation Loop

```
Problem arises in user's life
  → User opens BharatSolve (habit trigger)
  → Submits problem (investment)
  → Gets AI solution (variable reward)
  → Discusses follow-up (deeper engagement)
  → Problem resolved (satisfaction)
  → Repeat cycle
```

### 8b. Retention Tactics

| Tactic | Implementation | Impact |
|---|---|---|
| **Solution history** | Already built — users see all past problems | Switching cost (don't want to lose history) |
| **Follow-up discussions** | Already built — chat on each problem | Deepens engagement per session |
| **Multi-language** | Already built — 12+ languages | "This is the only AI that understands my language" |
| **Annual plan incentive** | New — 17% discount for annual commitment | Locks in 12 months of revenue |
| **Referral rewards** | Already built — free months for referrals | Active referrers have 3x lower churn |
| **Weekly insights email** | New (requires email service, Task 8.04) | Re-engagement for dormant users |
| **Problem categories** | New (Task 7.05) | Better organization → more submissions |
| **PWA home screen** | Already built — PWA manifest | Daily visibility on phone home screen |

### 8c. Involuntary Churn Prevention

Involuntary churn (failed payments) accounts for 20–40% of all SaaS churn:

- **Lemon Squeezy:** Built-in smart payment retries over 14 days
- **Stripe (Phase 2):** Stripe Billing Smart Retries + failed payment emails
- **Grace period:** 3 days after payment failure before feature lock
- **Card update prompt:** Notify users before card expiry (if email available)

---

## 9. Referral Program Monetization

### Current State
- Each user gets a unique referral code
- Both referrer and referee get 1 free month
- Share via clipboard copy (built)
- Share via social channels (built)

### Optimization Steps

| Step | Action | Revenue Impact |
|---|---|---|
| 1 | **Auto-append referral code to WhatsApp shares** | More referrals from organic sharing |
| 2 | **Show referral progress:** "You've referred 3 friends, earned 3 free months" | Gamification increases sharing |
| 3 | **Tiered rewards:** Refer 5 → get 2 months; Refer 10 → get 3 months | Incentivize power referrers |
| 4 | **Referral leaderboard** (anonymous) | Social competition drives sharing |
| 5 | **"Refer to skip payment"** messaging | Frames referral as alternative to paying |

### Referral Economics

| Metric | Value |
|---|---|
| Cost per referral (1 free month given away) | ₹499 (~$6) |
| CAC via paid advertising (India) | ₹250–₹650 ($3–$8) |
| LTV of referred user (37% higher retention) | ~₹8,000 ($95) |
| **ROI per referral** | **~13x** |

Referrals are the most cost-effective growth channel. Each ₹499 "cost" generates ~₹8,000 in LTV.

---

## 10. Revenue Projections

### Conservative Scenario (Organic Growth Only)

| Month | Trial Users | Paid Users | MRR (blended $8.50 ARPU) | Cumulative Revenue |
|---|---|---|---|---|
| 1 | 100 | 0 | $0 | $0 |
| 2 | 150 | 10 (10% conversion) | $85 | $85 |
| 3 | 200 | 25 | $213 | $298 |
| 4 | 280 | 45 | $383 | $681 |
| 5 | 380 | 70 | $595 | $1,276 |
| 6 | 500 | 100 | $850 | $2,126 |
| 9 | 1,000 | 200 | $1,700 | $6,476 |
| 12 | 2,000 | 400 | $3,400 | $16,676 |

**Key milestones:**
- **Month 2:** First revenue. Validates product-market fit.
- **Month 5:** HK$5,000/mo threshold → trigger Stripe HK setup (Phase 2)
- **Month 8:** Revenue covers Stripe Tax + sole prop registration costs
- **Month 12:** $3,400 MRR ($40,800 ARR) — sustainable solo SaaS

### Moderate Scenario (SEO + Referrals + Content Marketing)

| Month | Trial Users | Paid Users | MRR | Notes |
|---|---|---|---|---|
| 3 | 500 | 50 | $425 | SEO starts ranking |
| 6 | 2,000 | 300 | $2,550 | Referral viral loop kicks in |
| 9 | 5,000 | 700 | $5,950 | Content pages driving long-tail traffic |
| 12 | 10,000 | 1,500 | $12,750 | $153K ARR |

### Payment Provider Fees Impact

| Provider | At 100 users | At 1,000 users | At 5,000 users |
|---|---|---|---|
| **Lemon Squeezy (5% + $0.50)** | $130/mo fees | $1,300/mo | $6,500/mo |
| **Stripe (3.4% + $0.30)** | $59/mo fees | $590/mo | $2,950/mo |
| **Savings with Stripe** | $71/mo | $710/mo | $3,550/mo |

At 1,000+ users, switching primary processor to Stripe saves ~$8,500/year.

---

## 11. Execution Phases

### Phase 1: Payment Launch (Weeks 1–2) — "Start Collecting Revenue"

**Goal:** Go from $0 to first payment.

| # | Task | Priority | Depends On |
|---|---|---|---|
| 1.1 | Create Lemon Squeezy account + 12 products | P0 | None |
| 1.2 | Add payment schema fields to `user_profiles` | P0 | None |
| 1.3 | Implement LS checkout + webhook handler | P0 | 1.1, 1.2 |
| 1.4 | Add subscription enforcement middleware | P0 | 1.3 |
| 1.5 | Update `SubscriptionCard.tsx` with real checkout | P0 | 1.3 |
| 1.6 | Test end-to-end in LS sandbox mode | P0 | 1.5 |
| 1.7 | Go live with payments | P0 | 1.6 |

### Phase 2: Marketing Activation (Weeks 2–3) — "Drive Traffic"

**Goal:** Turn on all built marketing infrastructure.

| # | Task | Priority | Depends On |
|---|---|---|---|
| 2.1 | Activate Google Tag Manager (Task 6.01) | P1 | None |
| 2.2 | Configure GA4 with conversion events (Task 6.02) | P1 | 2.1 |
| 2.3 | Submit sitemap to Google + Bing (Tasks 6.03, 6.04) | P1 | None |
| 2.4 | Validate structured data (Task 6.05) | P1 | None |
| 2.5 | Test social previews on all platforms (Task 6.06) | P1 | None |
| 2.6 | Generate PWA icon set (Task 6.07) | P2 | None |
| 2.7 | Set up social media accounts + update JSON-LD (Tasks 6.08, 6.09) | P2 | None |

### Phase 3: Conversion Optimization (Weeks 3–5) — "Convert More Users"

**Goal:** Improve trial-to-paid conversion from baseline to 10%+.

| # | Task | Priority |
|---|---|---|
| 3.1 | Implement trial countdown notifications in SubscriptionCard | P1 |
| 3.2 | Add subscription management page (Task 4.03) | P1 |
| 3.3 | Add onboarding flow for first-time users (Task 7.08) | P2 |
| 3.4 | Implement annual subscription plans | P2 |
| 3.5 | Optimize pricing section on landing page | P2 |

### Phase 4: Growth Engine (Weeks 5–8) — "Scale User Acquisition"

**Goal:** Build sustainable organic growth flywheel.

| # | Task | Priority |
|---|---|---|
| 4.1 | Auto-append referral code to social shares | P1 |
| 4.2 | Create 5 SEO content pages (advice articles) | P2 |
| 4.3 | Launch social media presence (Instagram, YouTube, LinkedIn) | P2 |
| 4.4 | Add Microsoft Clarity for heatmaps (free) | P2 |
| 4.5 | Implement email collection + drip campaigns (Task 8.04) | P3 |

### Phase 5: Payment Optimization (When MRR > $650) — "Reduce Costs"

**Goal:** Migrate to Stripe for lower fees and Asian payment methods.

| # | Task | Priority |
|---|---|---|
| 5.1 | Register HK sole proprietor | P1 |
| 5.2 | Open Stripe HK account | P1 |
| 5.3 | Implement Stripe Billing parallel to Lemon Squeezy | P1 |
| 5.4 | Route Asian users to Stripe (Alipay, WeChat Pay) | P2 |
| 5.5 | Enable Stripe Tax for automated compliance | P2 |

### Phase 6: Revenue Expansion (Month 4+) — "Increase ARPU"

**Goal:** Extract more value from existing users.

| # | Task | Priority |
|---|---|---|
| 6.1 | Launch voice AI as premium add-on | P2 |
| 6.2 | Launch family plan (5 users) | P3 |
| 6.3 | Introduce tiered referral rewards | P3 |
| 6.4 | Explore B2B licensing (HR departments, schools) | P4 |

---

## 12. KPIs & Metrics Dashboard

### North Star Metric

**Monthly Recurring Revenue (MRR)** — The single number that matters most.

### Funnel Metrics (configure in GA4 via GTM)

| Metric | GA4 Event | Target |
|---|---|---|
| **Visitors** | `page_view` (landing page) | Growing month-over-month |
| **Signups** | `sign_up` | >15% of visitors |
| **First Problem** | `submit_problem` (first) | >60% of signups within 24 hours |
| **Active Users** | `submit_problem` (any) | >40% of signups in first week |
| **Trial-to-Paid** | `subscription_purchase` | >10% of trial users |
| **Monthly Churn** | (cancelled + expired) / total paid | <5% |
| **Referrals Sent** | `referral_shared` | >20% of active users share |
| **Referral Conversion** | `sign_up` via referral code | >30% of referred visitors |

### Revenue Metrics

| Metric | Formula | Target |
|---|---|---|
| **MRR** | Sum of all active subscriptions | Growing 15%+ month-over-month |
| **ARPU** | MRR / paid users | ~$8.50 (blended across locales) |
| **LTV** | ARPU / monthly churn rate | >$170 (at 5% churn) |
| **CAC** | Marketing spend / new paid users | <$10 (organic-heavy) |
| **LTV:CAC Ratio** | LTV / CAC | >3:1 (healthy SaaS) |
| **Net Revenue Retention** | (MRR + expansion - churn) / starting MRR | >100% |

### Operational Metrics

| Metric | Target |
|---|---|
| Payment success rate | >95% |
| Webhook delivery rate | >99.9% |
| Average response time (AI) | <10 seconds |
| Uptime | >99.5% |

---

## 13. Risk Mitigation

### Risk 1: Low Trial-to-Paid Conversion

**Mitigation:**
- A/B test pricing (₹399 vs ₹499 vs ₹599)
- Test longer trial (45 days) vs shorter (14 days)
- Add "problems solved" counter to show cumulative value
- Implement hard paywall at 3 free problems (instead of 30-day time limit)

### Risk 2: High Churn After First Month

**Mitigation:**
- Introduce annual plan with discount (locks users in)
- Add problem categories and search (Task 7.05, 7.06) to increase engagement
- Implement "Your month in review" summary to remind users of value
- Enable push notifications via PWA for re-engagement

### Risk 3: Payment Gateway Issues (Account Freeze)

**Mitigation:**
- Start with Lemon Squeezy (MoR model = less risk of account issues)
- Add Stripe as secondary processor in Phase 2
- Keep PayPal as emergency backup
- Never hold >$10K in any single payment provider without diversifying

### Risk 4: Competitive Pressure from ChatGPT/Gemini

**Mitigation:**
- BharatSolve's moat is **cultural specificity** — generic AI doesn't understand joint family dynamics, Indian marriage customs, or caste/community nuances
- Multi-language with cultural tuning (not just translation)
- Structured problem-solution format (not just chat)
- Solution history and follow-up discussions (ChatGPT conversations are transient)

### Risk 5: Tax/Compliance Complexity at Scale

**Mitigation:**
- Phase 1 (Lemon Squeezy): They handle ALL global taxes — zero compliance burden on you
- Phase 2 (Stripe): Enable Stripe Tax (+0.5%) for automated compliance
- Phase 3 (Scale): Engage a cross-border tax advisor when ARR > $50K
- HK sole proprietor tax is simple: 7.5% on first HK$2M profits, file annually

---

## Quick-Start Checklist

The **minimum steps** to go from $0 to revenue-generating:

- [ ] **1. Create Lemon Squeezy account** — lemonsqueezy.com, personal email, HK bank for payouts
- [ ] **2. Create 12 subscription products** — one per locale with local currency pricing
- [ ] **3. Get API keys** — API key + webhook secret from LS dashboard
- [ ] **4. Add env vars** — `LEMONSQUEEZY_API_KEY`, `LEMONSQUEEZY_STORE_ID`, `LEMONSQUEEZY_WEBHOOK_SECRET`
- [ ] **5. Update database schema** — Add payment fields to `user_profiles`
- [ ] **6. Implement checkout flow** — Subscribe button → LS checkout overlay → webhook → activate
- [ ] **7. Add subscription enforcement** — Middleware blocking AI endpoints for expired users
- [ ] **8. Activate Google Tag Manager** — Uncomment GTM, add container ID, configure GA4
- [ ] **9. Submit sitemap** — Google Search Console + Bing Webmaster Tools
- [ ] **10. Launch** — Go live and start sharing on social media

**Estimated time from start to first possible payment: 5–7 days.**

---

---

## 14. Implementation Guide — Step-by-Step Code Changes

This section provides exact, file-by-file implementation instructions. Each step references the actual files, functions, and schema in the codebase.

---

### Step 1: Install Lemon Squeezy SDK

**File:** `package.json`

```bash
npm install @lemonsqueezy/lemonsqueezy.js
```

This adds the official Lemon Squeezy Node.js SDK for creating checkouts and verifying webhooks.

**Add environment variables to `.env` and `.env.example`:**

```bash
# Payment — Lemon Squeezy (Merchant of Record)
LEMONSQUEEZY_API_KEY=your_api_key_here
LEMONSQUEEZY_STORE_ID=your_store_id_here
LEMONSQUEEZY_WEBHOOK_SECRET=your_webhook_signing_secret_here
```

---

### Step 2: Update Database Schema

**File:** `shared/schema.ts`

Add payment tracking columns to the `userProfiles` table. These fields link the local user to Lemon Squeezy's subscription system and track billing periods.

```ts
// Add to the existing userProfiles pgTable definition:

export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).unique().notNull(),
  subscriptionStatus: text("subscription_status").default('trial').notNull(),
  trialStartDate: timestamp("trial_start_date").defaultNow().notNull(),
  referralCode: text("referral_code").notNull().unique(),
  referredBy: varchar("referred_by"),
  freeMonthsEarned: integer("free_months_earned").default(0).notNull(),

  // --- NEW: Payment gateway fields ---
  paymentProvider: text("payment_provider"),             // 'lemonsqueezy' | 'stripe' | null
  providerCustomerId: text("provider_customer_id"),      // Lemon Squeezy customer ID or Stripe customer ID
  providerSubscriptionId: text("provider_subscription_id"), // External subscription ID
  providerVariantId: text("provider_variant_id"),        // Product variant (locale-specific plan)
  currentPeriodStart: timestamp("current_period_start"), // Billing period start
  currentPeriodEnd: timestamp("current_period_end"),     // Billing period end — enforce access based on this
  cancelAtPeriodEnd: integer("cancel_at_period_end").default(0).notNull(), // 1 = user requested cancellation
  lastPaymentDate: timestamp("last_payment_date"),       // Last successful charge
  billingInterval: text("billing_interval").default("monthly"), // 'monthly' | 'yearly'
});
```

After editing, push the schema:

```bash
npm run db:push
```

---

### Step 3: Update the Storage Layer

**File:** `server/storage.ts`

#### 3a. Update the `IStorage` interface

Add new methods for payment-related operations:

```ts
export interface IStorage {
  // ... existing methods ...

  // Payment
  updateSubscriptionFromWebhook(userId: string, data: {
    status: string;
    paymentProvider: string;
    providerCustomerId: string;
    providerSubscriptionId: string;
    providerVariantId?: string;
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
    cancelAtPeriodEnd?: boolean;
    lastPaymentDate?: Date;
    billingInterval?: string;
  }): Promise<UserProfile>;
  getUserProfileByProviderCustomerId(customerId: string): Promise<UserProfile | undefined>;
  getUserProfileByProviderSubscriptionId(subscriptionId: string): Promise<UserProfile | undefined>;
}
```

#### 3b. Implement in `MemoryStorage`

```ts
async updateSubscriptionFromWebhook(userId: string, data: {
  status: string;
  paymentProvider: string;
  providerCustomerId: string;
  providerSubscriptionId: string;
  providerVariantId?: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  lastPaymentDate?: Date;
  billingInterval?: string;
}): Promise<UserProfile> {
  const profile = this.profiles.get(userId);
  if (!profile) throw new Error("Profile not found");
  profile.subscriptionStatus = data.status;
  profile.paymentProvider = data.paymentProvider;
  profile.providerCustomerId = data.providerCustomerId;
  profile.providerSubscriptionId = data.providerSubscriptionId;
  profile.providerVariantId = data.providerVariantId || null;
  profile.currentPeriodStart = data.currentPeriodStart || null;
  profile.currentPeriodEnd = data.currentPeriodEnd || null;
  profile.cancelAtPeriodEnd = data.cancelAtPeriodEnd ? 1 : 0;
  profile.lastPaymentDate = data.lastPaymentDate || null;
  profile.billingInterval = data.billingInterval || "monthly";
  return profile;
}

async getUserProfileByProviderCustomerId(customerId: string): Promise<UserProfile | undefined> {
  return Array.from(this.profiles.values()).find(
    (p) => p.providerCustomerId === customerId
  );
}

async getUserProfileByProviderSubscriptionId(subscriptionId: string): Promise<UserProfile | undefined> {
  return Array.from(this.profiles.values()).find(
    (p) => p.providerSubscriptionId === subscriptionId
  );
}
```

#### 3c. Implement in `DatabaseStorage`

```ts
async updateSubscriptionFromWebhook(userId: string, data: {
  status: string;
  paymentProvider: string;
  providerCustomerId: string;
  providerSubscriptionId: string;
  providerVariantId?: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  lastPaymentDate?: Date;
  billingInterval?: string;
}): Promise<UserProfile> {
  const [profile] = await db.update(userProfiles)
    .set({
      subscriptionStatus: data.status,
      paymentProvider: data.paymentProvider,
      providerCustomerId: data.providerCustomerId,
      providerSubscriptionId: data.providerSubscriptionId,
      providerVariantId: data.providerVariantId || null,
      currentPeriodStart: data.currentPeriodStart || null,
      currentPeriodEnd: data.currentPeriodEnd || null,
      cancelAtPeriodEnd: data.cancelAtPeriodEnd ? 1 : 0,
      lastPaymentDate: data.lastPaymentDate || null,
      billingInterval: data.billingInterval || "monthly",
    })
    .where(eq(userProfiles.userId, userId))
    .returning();
  if (!profile) throw new Error("Profile not found");
  return profile;
}

async getUserProfileByProviderCustomerId(customerId: string): Promise<UserProfile | undefined> {
  const [profile] = await db.select().from(userProfiles)
    .where(eq(userProfiles.providerCustomerId, customerId));
  return profile;
}

async getUserProfileByProviderSubscriptionId(subscriptionId: string): Promise<UserProfile | undefined> {
  const [profile] = await db.select().from(userProfiles)
    .where(eq(userProfiles.providerSubscriptionId, subscriptionId));
  return profile;
}
```

---

### Step 4: Create the Lemon Squeezy Payment Module

**New file:** `server/payment/lemonsqueezy.ts`

This module encapsulates all Lemon Squeezy API interactions.

```ts
import crypto from "crypto";

const LS_API_BASE = "https://api.lemonsqueezy.com/v1";

function getHeaders() {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  if (!apiKey) throw new Error("LEMONSQUEEZY_API_KEY not set");
  return {
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
    Authorization: `Bearer ${apiKey}`,
  };
}

// Variant IDs — one per locale, created in the Lemon Squeezy dashboard.
// Map locale codes to Lemon Squeezy variant IDs.
// You fill these in after creating products in the LS dashboard.
const VARIANT_MAP: Record<string, string> = {
  IN: "VARIANT_ID_FOR_INDIA",
  SG: "VARIANT_ID_FOR_SINGAPORE",
  HK: "VARIANT_ID_FOR_HONGKONG",
  JP: "VARIANT_ID_FOR_JAPAN",
  CN: "VARIANT_ID_FOR_CHINA",
  US: "VARIANT_ID_FOR_USA",
  GB: "VARIANT_ID_FOR_UK",
  KR: "VARIANT_ID_FOR_KOREA",
  AE: "VARIANT_ID_FOR_UAE",
  AU: "VARIANT_ID_FOR_AUSTRALIA",
  DE: "VARIANT_ID_FOR_GERMANY",
  BR: "VARIANT_ID_FOR_BRAZIL",
};

export function getVariantId(localeCode: string): string {
  return VARIANT_MAP[localeCode] || VARIANT_MAP["US"];
}

export interface CheckoutOptions {
  variantId: string;
  userEmail: string;
  userId: string;
  userName?: string;
  successUrl: string;
  cancelUrl: string;
}

export async function createCheckout(options: CheckoutOptions): Promise<string> {
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  if (!storeId) throw new Error("LEMONSQUEEZY_STORE_ID not set");

  const payload = {
    data: {
      type: "checkouts",
      attributes: {
        checkout_options: {
          embed: true,
          media: false,
          button_color: "#E8751A",
        },
        checkout_data: {
          email: options.userEmail,
          name: options.userName || undefined,
          custom: {
            user_id: options.userId,
          },
        },
        product_options: {
          redirect_url: options.successUrl,
          receipt_button_text: "Return to BharatSolve",
          receipt_link_url: options.successUrl,
        },
        expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
      },
      relationships: {
        store: { data: { type: "stores", id: storeId } },
        variant: { data: { type: "variants", id: options.variantId } },
      },
    },
  };

  const res = await fetch(`${LS_API_BASE}/checkouts`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Lemon Squeezy checkout creation failed: ${error}`);
  }

  const json = await res.json();
  return json.data.attributes.url; // The checkout URL
}

export async function getSubscription(subscriptionId: string): Promise<any> {
  const res = await fetch(`${LS_API_BASE}/subscriptions/${subscriptionId}`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch subscription");
  return (await res.json()).data;
}

export async function cancelSubscription(subscriptionId: string): Promise<void> {
  const res = await fetch(`${LS_API_BASE}/subscriptions/${subscriptionId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Failed to cancel subscription");
}

export async function resumeSubscription(subscriptionId: string): Promise<void> {
  const payload = {
    data: {
      type: "subscriptions",
      id: subscriptionId,
      attributes: { cancelled: false },
    },
  };
  const res = await fetch(`${LS_API_BASE}/subscriptions/${subscriptionId}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to resume subscription");
}

export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string
): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) throw new Error("LEMONSQUEEZY_WEBHOOK_SECRET not set");

  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(rawBody).digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(digest),
    Buffer.from(signatureHeader)
  );
}
```

---

### Step 5: Create Payment Routes

**New file:** `server/payment/routes.ts`

This registers all payment-related API endpoints: checkout creation, webhook handling, and subscription management.

```ts
import type { Express, Request, Response } from "express";
import { storage } from "../storage";
import {
  createCheckout,
  getVariantId,
  cancelSubscription,
  resumeSubscription,
  verifyWebhookSignature,
  getSubscription,
} from "./lemonsqueezy";

export function registerPaymentRoutes(
  app: Express,
  isAuthenticated: (req: any, res: any, next: any) => void
) {

  // --- POST /api/checkout — Create a checkout session ---
  app.post("/api/checkout", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const { localeCode } = req.body;
      const profile = await storage.getUserProfile(userId);
      if (!profile) return res.status(404).json({ message: "Profile not found" });
      if (profile.subscriptionStatus === "active") {
        return res.status(400).json({ message: "Already subscribed" });
      }

      const variantId = getVariantId(localeCode || "US");
      const baseUrl = process.env.BASE_URL || "https://bharatsolve.ai";
      const checkoutUrl = await createCheckout({
        variantId,
        userEmail: req.user.claims.email || "",
        userId,
        userName: req.user.claims.name || undefined,
        successUrl: `${baseUrl}/?checkout=success`,
        cancelUrl: `${baseUrl}/?checkout=cancelled`,
      });

      res.status(200).json({ checkoutUrl });
    } catch (err: any) {
      console.error("[payment] Checkout creation failed:", err.message);
      res.status(500).json({ message: "Failed to create checkout" });
    }
  });

  // --- POST /api/webhooks/lemonsqueezy — Webhook handler (NO auth middleware) ---
  // Lemon Squeezy sends raw JSON; we verify via HMAC signature.
  app.post("/api/webhooks/lemonsqueezy", async (req: Request, res: Response) => {
    try {
      const signature = req.headers["x-signature"] as string;
      if (!signature) return res.status(400).json({ message: "Missing signature" });

      const rawBody = JSON.stringify(req.body);
      const isValid = verifyWebhookSignature(rawBody, signature);
      if (!isValid) return res.status(401).json({ message: "Invalid signature" });

      const event = req.body;
      const eventName = event.meta?.event_name;
      const customData = event.meta?.custom_data;
      const userId = customData?.user_id;
      const attrs = event.data?.attributes;

      if (!userId || !attrs) {
        return res.status(200).json({ message: "Ignored — no user_id or attributes" });
      }

      console.log(`[webhook] Received ${eventName} for user ${userId}`);

      switch (eventName) {
        case "subscription_created":
        case "subscription_updated": {
          const lsStatus = attrs.status; // 'active', 'past_due', 'paused', 'cancelled', 'expired'
          let appStatus = "active";
          if (lsStatus === "past_due") appStatus = "active"; // Grace period
          else if (lsStatus === "cancelled" || lsStatus === "expired") appStatus = "expired";
          else if (lsStatus === "paused") appStatus = "expired";

          await storage.updateSubscriptionFromWebhook(userId, {
            status: appStatus,
            paymentProvider: "lemonsqueezy",
            providerCustomerId: String(attrs.customer_id),
            providerSubscriptionId: String(event.data.id),
            providerVariantId: String(attrs.variant_id),
            currentPeriodStart: attrs.current_period_start
              ? new Date(attrs.current_period_start)
              : undefined,
            currentPeriodEnd: attrs.current_period_end
              ? new Date(attrs.current_period_end)
              : undefined,
            cancelAtPeriodEnd: attrs.cancelled ?? false,
            lastPaymentDate: new Date(),
            billingInterval: attrs.variant_name?.includes("Annual") ? "yearly" : "monthly",
          });
          break;
        }

        case "subscription_cancelled": {
          await storage.updateSubscriptionFromWebhook(userId, {
            status: "active", // Still active until period end
            paymentProvider: "lemonsqueezy",
            providerCustomerId: String(attrs.customer_id),
            providerSubscriptionId: String(event.data.id),
            cancelAtPeriodEnd: true,
          });
          break;
        }

        case "subscription_expired": {
          await storage.updateSubscriptionFromWebhook(userId, {
            status: "expired",
            paymentProvider: "lemonsqueezy",
            providerCustomerId: String(attrs.customer_id),
            providerSubscriptionId: String(event.data.id),
            cancelAtPeriodEnd: false,
          });
          break;
        }

        case "subscription_payment_success": {
          const sub = await getSubscription(String(attrs.subscription_id));
          const subAttrs = sub?.attributes;
          if (subAttrs) {
            await storage.updateSubscriptionFromWebhook(userId, {
              status: "active",
              paymentProvider: "lemonsqueezy",
              providerCustomerId: String(attrs.customer_id),
              providerSubscriptionId: String(attrs.subscription_id),
              currentPeriodStart: subAttrs.current_period_start
                ? new Date(subAttrs.current_period_start)
                : undefined,
              currentPeriodEnd: subAttrs.current_period_end
                ? new Date(subAttrs.current_period_end)
                : undefined,
              lastPaymentDate: new Date(),
            });
          }
          break;
        }

        case "subscription_payment_failed": {
          console.warn(`[webhook] Payment failed for user ${userId}`);
          // Don't immediately expire — Lemon Squeezy retries.
          // After all retries fail, LS sends subscription_expired.
          break;
        }

        default:
          console.log(`[webhook] Unhandled event: ${eventName}`);
      }

      res.status(200).json({ message: "ok" });
    } catch (err: any) {
      console.error("[webhook] Error processing webhook:", err.message);
      res.status(500).json({ message: "Webhook processing failed" });
    }
  });

  // --- GET /api/subscription — Get subscription status ---
  app.get("/api/subscription", isAuthenticated, async (req: any, res: Response) => {
    const userId = req.user.claims.sub;
    const profile = await storage.getUserProfile(userId);
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const trialStart = new Date(profile.trialStartDate);
    const trialEnd = new Date(trialStart);
    trialEnd.setDate(trialEnd.getDate() + 30);
    const now = new Date();
    const trialDaysLeft = Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 3600 * 24)));

    res.status(200).json({
      status: profile.subscriptionStatus,
      trialDaysLeft,
      trialExpired: profile.subscriptionStatus === "trial" && trialDaysLeft === 0,
      currentPeriodEnd: profile.currentPeriodEnd,
      cancelAtPeriodEnd: profile.cancelAtPeriodEnd === 1,
      billingInterval: profile.billingInterval,
      freeMonthsEarned: profile.freeMonthsEarned,
      hasPaymentProvider: !!profile.paymentProvider,
    });
  });

  // --- POST /api/subscription/cancel — Cancel subscription ---
  app.post("/api/subscription/cancel", isAuthenticated, async (req: any, res: Response) => {
    const userId = req.user.claims.sub;
    const profile = await storage.getUserProfile(userId);
    if (!profile?.providerSubscriptionId) {
      return res.status(400).json({ message: "No active subscription to cancel" });
    }
    try {
      await cancelSubscription(profile.providerSubscriptionId);
      res.status(200).json({ message: "Subscription will cancel at end of billing period" });
    } catch (err: any) {
      res.status(500).json({ message: "Failed to cancel subscription" });
    }
  });

  // --- POST /api/subscription/resume — Resume cancelled subscription ---
  app.post("/api/subscription/resume", isAuthenticated, async (req: any, res: Response) => {
    const userId = req.user.claims.sub;
    const profile = await storage.getUserProfile(userId);
    if (!profile?.providerSubscriptionId || profile.cancelAtPeriodEnd !== 1) {
      return res.status(400).json({ message: "No cancelled subscription to resume" });
    }
    try {
      await resumeSubscription(profile.providerSubscriptionId);
      await storage.updateSubscriptionFromWebhook(userId, {
        status: "active",
        paymentProvider: profile.paymentProvider!,
        providerCustomerId: profile.providerCustomerId!,
        providerSubscriptionId: profile.providerSubscriptionId,
        cancelAtPeriodEnd: false,
      });
      res.status(200).json({ message: "Subscription resumed" });
    } catch (err: any) {
      res.status(500).json({ message: "Failed to resume subscription" });
    }
  });
}
```

---

### Step 6: Create Subscription Enforcement Middleware

**New file:** `server/middleware/subscription.ts`

This middleware blocks AI endpoints for users whose trial has expired and who haven't subscribed.

```ts
import type { Request, Response, NextFunction } from "express";
import { storage } from "../storage";

export async function requireActiveSubscription(
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) {
  if (!req.user?.claims?.sub) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = req.user.claims.sub;
  const profile = await storage.getUserProfile(userId);

  if (!profile) {
    return res.status(403).json({ message: "No profile found. Please set up your account." });
  }

  // Active paid subscription — always allow
  if (profile.subscriptionStatus === "active") {
    // If there's a billing period end, check it hasn't passed
    if (profile.currentPeriodEnd) {
      const periodEnd = new Date(profile.currentPeriodEnd);
      if (periodEnd < new Date()) {
        return res.status(403).json({
          message: "Your subscription has expired. Please renew.",
          code: "SUBSCRIPTION_EXPIRED",
        });
      }
    }
    return next();
  }

  // Trial period — check if still within 30 days
  if (profile.subscriptionStatus === "trial") {
    const trialStart = new Date(profile.trialStartDate);
    const daysSinceTrialStart =
      (Date.now() - trialStart.getTime()) / (1000 * 3600 * 24);

    // Allow if still within trial (30 days + any free months earned)
    const totalFreeDays = 30 + profile.freeMonthsEarned * 30;
    if (daysSinceTrialStart <= totalFreeDays) {
      return next();
    }

    return res.status(403).json({
      message: "Your free trial has ended. Subscribe to continue.",
      code: "TRIAL_EXPIRED",
    });
  }

  // Expired or unknown status
  return res.status(403).json({
    message: "Please subscribe to access this feature.",
    code: "SUBSCRIPTION_REQUIRED",
  });
}
```

---

### Step 7: Wire Payment Routes & Middleware into Main Server

**File:** `server/routes.ts`

Make these changes:

#### 7a. Add imports at the top

```ts
import { registerPaymentRoutes } from "./payment/routes";
import { requireActiveSubscription } from "./middleware/subscription";
```

#### 7b. Register payment routes (after auth setup)

Inside `registerRoutes()`, after `registerImageRoutes(app, isAuthenticated);`:

```ts
registerPaymentRoutes(app, isAuthenticated);
```

#### 7c. Replace the existing subscribe endpoint

Replace the current dummy subscribe handler:

```ts
// REMOVE THIS:
app.post(api.userProfiles.subscribe.path, isAuthenticated, async (req: any, res) => {
  const userId = req.user.claims.sub;
  const profile = await storage.updateSubscription(userId, 'active');
  res.status(200).json(profile);
});

// The real checkout is now POST /api/checkout (in payment/routes.ts)
// The subscribe endpoint is kept for backward compatibility but now returns an error:
app.post(api.userProfiles.subscribe.path, isAuthenticated, async (_req: any, res) => {
  res.status(400).json({ message: "Use POST /api/checkout instead" });
});
```

#### 7d. Add subscription enforcement to AI endpoints

Replace the existing inline trial check in the `problems.create` handler. Change the `app.post(api.problems.create.path, ...)` handler to include the middleware:

```ts
app.post(api.problems.create.path, isAuthenticated, requireActiveSubscription, async (req: any, res) => {
  // Remove the manual trial check (lines 426–435 in current file)
  // The middleware now handles all subscription enforcement
  const userId = req.user.claims.sub;
  try {
    const input = api.problems.create.input.parse(req.body);
    const problem = await storage.createProblem(userId, input);
    // ... rest stays the same
```

Also add the middleware to the batch endpoint and discussion endpoint:

```ts
app.post("/api/problems/batch", isAuthenticated, requireActiveSubscription, async (req: any, res) => {
  // Remove the inline trial check
  // ... rest stays the same
```

```ts
app.post(api.problems.sendMessage.path, isAuthenticated, requireActiveSubscription, upload.array("files", 5), async (req: any, res) => {
  // ... rest stays the same
```

---

### Step 8: Update the API Contract

**File:** `shared/routes.ts`

Add the new payment and subscription routes to the typed API contract:

```ts
export const api = {
  // ... existing routes ...

  payment: {
    createCheckout: {
      method: 'POST' as const,
      path: '/api/checkout' as const,
      input: z.object({
        localeCode: z.string().optional(),
      }),
      responses: {
        200: z.object({ checkoutUrl: z.string() }),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    getSubscription: {
      method: 'GET' as const,
      path: '/api/subscription' as const,
      responses: {
        200: z.object({
          status: z.string(),
          trialDaysLeft: z.number(),
          trialExpired: z.boolean(),
          currentPeriodEnd: z.string().nullable(),
          cancelAtPeriodEnd: z.boolean(),
          billingInterval: z.string().nullable(),
          freeMonthsEarned: z.number(),
          hasPaymentProvider: z.boolean(),
        }),
        401: errorSchemas.unauthorized,
      },
    },
    cancelSubscription: {
      method: 'POST' as const,
      path: '/api/subscription/cancel' as const,
      responses: {
        200: z.object({ message: z.string() }),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    resumeSubscription: {
      method: 'POST' as const,
      path: '/api/subscription/resume' as const,
      responses: {
        200: z.object({ message: z.string() }),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
  },
};
```

---

### Step 9: Update Client-Side Hooks

**File:** `client/src/hooks/use-profile.ts`

Replace the `useSubscribe` hook with a checkout hook that redirects to Lemon Squeezy:

```ts
export function useCheckout() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (localeCode: string) => {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ localeCode }),
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Checkout failed");
      }
      const data = await res.json();
      return data.checkoutUrl as string;
    },
    onSuccess: (checkoutUrl) => {
      // Redirect to Lemon Squeezy hosted checkout
      window.open(checkoutUrl, "_blank");
    },
    onError: (error: Error) => {
      toast({
        title: "Checkout Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useSubscriptionStatus() {
  return useQuery({
    queryKey: ["/api/subscription"],
    queryFn: async () => {
      const res = await fetch("/api/subscription", { credentials: "include" });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch subscription");
      return res.json();
    },
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/subscription/cancel", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Cancellation failed");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subscription"] });
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription will remain active until the end of the billing period.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Cancellation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useResumeSubscription() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/subscription/resume", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Resume failed");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subscription"] });
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      toast({
        title: "Subscription Resumed",
        description: "Welcome back! Your subscription is active again.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Resume Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
```

> **Note:** Keep the old `useSubscribe` export for now if other components reference it, but mark it deprecated.

---

### Step 10: Update SubscriptionCard Component

**File:** `client/src/components/SubscriptionCard.tsx`

Replace the subscribe button with the real checkout flow:

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown, Clock, XCircle } from "lucide-react";
import { useProfile, useCheckout, useSubscriptionStatus, useCancelSubscription, useResumeSubscription } from "@/hooks/use-profile";
import { useLocale } from "@/contexts/locale-context";

export function SubscriptionCard() {
  const { data: profile } = useProfile();
  const { data: subStatus } = useSubscriptionStatus();
  const { mutate: checkout, isPending: isCheckoutPending } = useCheckout();
  const { mutate: cancelSub, isPending: isCancelling } = useCancelSubscription();
  const { mutate: resumeSub, isPending: isResuming } = useResumeSubscription();
  const { config } = useLocale();

  if (!profile) return null;

  const isActive = profile.subscriptionStatus === "active";
  const isTrial = profile.subscriptionStatus === "trial";
  const trialDaysLeft = subStatus?.trialDaysLeft ?? 0;
  const trialExpired = subStatus?.trialExpired ?? false;
  const cancelAtPeriodEnd = subStatus?.cancelAtPeriodEnd ?? false;

  // Active paid subscription
  if (isActive && !cancelAtPeriodEnd) {
    return (
      <Card className="border-primary/20 bg-primary/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Crown className="w-32 h-32" />
        </div>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                Premium Active
                <Badge variant="default" className="bg-primary text-primary-foreground">PRO</Badge>
              </CardTitle>
              <CardDescription className="mt-2">
                You have full access to all AI features.
                {subStatus?.currentPeriodEnd && (
                  <span className="block mt-1">
                    Next billing: {new Date(subStatus.currentPeriodEnd).toLocaleDateString()}
                  </span>
                )}
              </CardDescription>
            </div>
            <Crown className="text-primary w-8 h-8" />
          </div>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            size="sm"
            onClick={() => cancelSub()}
            disabled={isCancelling}
            className="text-muted-foreground"
          >
            {isCancelling ? "Cancelling..." : "Cancel Subscription"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Cancelled but still active until period end
  if (isActive && cancelAtPeriodEnd) {
    return (
      <Card className="border-orange-300/30 bg-orange-50/50 dark:bg-orange-950/20 relative overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <XCircle className="text-orange-500 w-6 h-6" />
            Subscription Ending
          </CardTitle>
          <CardDescription>
            Active until {subStatus?.currentPeriodEnd
              ? new Date(subStatus.currentPeriodEnd).toLocaleDateString()
              : "end of billing period"}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => resumeSub()}
            disabled={isResuming}
            className="w-full"
          >
            {isResuming ? "Resuming..." : "Resume Subscription"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Trial or expired — show upgrade CTA
  return (
    <Card className="relative overflow-hidden border-2 border-primary/10 shadow-xl shadow-primary/5 hover:border-primary/30 transition-all">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Zap className="text-yellow-500 fill-yellow-500 w-6 h-6" />
            {trialExpired ? "Trial Expired" : "Upgrade to Pro"}
          </CardTitle>
          {isTrial && trialDaysLeft > 0 && (
            <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100">
              <Clock className="w-3 h-3 mr-1" />
              {trialDaysLeft} days left in trial
            </Badge>
          )}
        </div>
        <CardDescription>
          {trialExpired
            ? "Your free trial has ended. Subscribe to continue solving problems."
            : "Get unlimited AI solutions and faster processing times."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ul className="space-y-2">
          {["Unlimited AI Solutions", "Culturally Nuanced Advice", "Family & Career Wisdom", "Priority Support"].map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm">
              <div className="bg-primary/10 rounded-full p-1">
                <Check className="w-3 h-3 text-primary" />
              </div>
              {feature}
            </li>
          ))}
        </ul>

        <Button
          onClick={() => checkout(config.code)}
          disabled={isCheckoutPending}
          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20"
        >
          {isCheckoutPending ? "Opening checkout..." : `Subscribe for ${config.formattedPrice}/mo`}
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          30-day free trial. Cancel anytime. Secure payment via Lemon Squeezy.
        </p>
      </CardContent>
    </Card>
  );
}
```

---

### Step 11: Handle Checkout Success on Client

**File:** `client/src/pages/Dashboard.tsx` (or wherever the post-checkout redirect lands)

After successful checkout, the user is redirected to `/?checkout=success`. Add a check on mount:

```tsx
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

// Inside Dashboard component:
const queryClient = useQueryClient();
const { toast } = useToast();

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("checkout") === "success") {
    toast({
      title: "Welcome to Premium!",
      description: "Your subscription is being activated. It may take a few seconds.",
    });
    queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
    queryClient.invalidateQueries({ queryKey: ["/api/subscription"] });
    window.history.replaceState({}, "", "/");
  }
}, []);
```

---

### Step 12: Activate Google Tag Manager & GA4

**File:** `client/index.html`

#### 12a. Uncomment the GTM snippets

Find the two commented GTM blocks and uncomment them. Replace `GTM-XXXXXXX` with your real Container ID.

In `<head>`:

```html
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-YOUR_ID');</script>
```

In `<body>` (right after opening tag):

```html
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-YOUR_ID"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
```

#### 12b. Configure GA4 conversion events

In GTM, create these tags using Custom Event triggers:

| Tag Name | Trigger (Custom Event) | GA4 Event Name |
|---|---|---|
| GA4 — Sign Up | `sign_up` | `sign_up` |
| GA4 — Start Trial | `start_trial` | `start_trial` |
| GA4 — Submit Problem | `submit_problem` | `submit_problem` |
| GA4 — Subscription Purchase | `subscription_purchase` | `purchase` |
| GA4 — Referral Shared | `referral_shared` | `referral_shared` |
| GA4 — Social Share | `social_share` | `share` |

#### 12c. Push dataLayer events from your components

Add a utility for pushing GTM events:

**New file:** `client/src/lib/analytics.ts`

```ts
declare global {
  interface Window {
    dataLayer?: Record<string, any>[];
  }
}

export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({ event: eventName, ...params });
  }
}
```

Then fire events from key user actions:

```ts
// After successful login/signup:
trackEvent("sign_up", { method: "oidc" });

// After first problem created:
trackEvent("submit_problem", { category: problem.category, language: problem.language });

// After successful checkout (in Dashboard useEffect):
trackEvent("subscription_purchase", { value: config.price, currency: config.currency });

// In ReferralCard after copy:
trackEvent("referral_shared", { method: "clipboard" });

// In SocialShare after sharing:
trackEvent("social_share", { platform: "whatsapp" }); // or facebook, twitter, etc.
```

---

### Step 13: Submit Sitemap to Search Engines

These are manual, one-time steps.

#### 13a. Google Search Console

1. Go to https://search.google.com/search-console
2. Click "Add Property" → Enter your domain (e.g., `https://bharatsolve.ai`)
3. Verify ownership (DNS TXT record or HTML file upload)
4. Go to "Sitemaps" in the left sidebar
5. Enter `https://bharatsolve.ai/sitemap.xml` and click "Submit"

#### 13b. Bing Webmaster Tools

1. Go to https://www.bing.com/webmasters
2. Add your site and verify
3. Go to "Sitemaps" → "Submit Sitemap"
4. Enter `https://bharatsolve.ai/sitemap.xml`

---

### Step 14: Validate Structured Data

1. Go to https://search.google.com/test/rich-results
2. Enter your production URL
3. Verify all 3 JSON-LD schemas pass:
   - Organization schema
   - WebApplication schema
   - FAQPage schema
4. Fix any warnings (e.g., missing `aggregateRating` was already removed in task 6.10)

---

### Step 15: Test Social Sharing Previews

Use these tools to verify OG tags render correctly:

| Platform | Testing Tool |
|---|---|
| Facebook/WhatsApp | https://developers.facebook.com/tools/debug/ |
| LinkedIn | https://www.linkedin.com/post-inspector/ |
| Twitter/X | https://cards-dev.twitter.com/validator |

Enter your production URL and verify the preview image, title, and description render correctly.

---

### Step 16: Phase 2 — Add Stripe (When Revenue > HK$5,000/mo)

When you're ready to add Stripe for lower fees and Asian payment methods:

#### 16a. Install Stripe SDK

```bash
npm install stripe
```

#### 16b. Register HK Sole Proprietor

1. Go to https://www.gov.hk/en/residents/taxes/etax/services/breg_application.htm
2. File Form 1(a) online
3. Pay HK$2,200
4. Receive Business Registration Certificate within 1 working day

#### 16c. Open Stripe HK Account

1. Go to https://dashboard.stripe.com/register
2. Select "Hong Kong"
3. Provide HKID + Business Registration Certificate number
4. Add your HK bank account for payouts
5. Wait 2–3 days for approval

#### 16d. Create a Payment Provider Abstraction

**New file:** `server/payment/provider.ts`

```ts
import { createCheckout as lsCheckout, getVariantId as lsVariant } from "./lemonsqueezy";
// import { createStripeCheckout } from "./stripe"; // Add when implementing

export type PaymentProvider = "lemonsqueezy" | "stripe";

const ASIAN_LOCALES = new Set(["HK", "SG", "JP", "CN", "KR"]);

export function selectProvider(localeCode: string): PaymentProvider {
  // Route Asian users to Stripe (for Alipay/WeChat Pay), others to Lemon Squeezy
  if (ASIAN_LOCALES.has(localeCode) && process.env.STRIPE_SECRET_KEY) {
    return "stripe";
  }
  return "lemonsqueezy";
}

export async function createProviderCheckout(
  provider: PaymentProvider,
  options: {
    localeCode: string;
    userEmail: string;
    userId: string;
    userName?: string;
    successUrl: string;
    cancelUrl: string;
  }
): Promise<string> {
  if (provider === "lemonsqueezy") {
    const variantId = lsVariant(options.localeCode);
    return lsCheckout({ variantId, ...options });
  }
  // if (provider === "stripe") {
  //   return createStripeCheckout(options);
  // }
  throw new Error(`Unknown provider: ${provider}`);
}
```

Update `server/payment/routes.ts` to use the abstraction instead of calling Lemon Squeezy directly.

---

### Step 17: Create Subscription Management Page (Task 4.03)

**New file:** `client/src/pages/SubscriptionManagement.tsx`

This is a dedicated page where users manage billing:

```tsx
import { useSubscriptionStatus, useCancelSubscription, useResumeSubscription, useCheckout } from "@/hooks/use-profile";
import { useLocale } from "@/contexts/locale-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SubscriptionManagement() {
  const { data: sub, isLoading } = useSubscriptionStatus();
  const { mutate: cancelSub, isPending: isCancelling } = useCancelSubscription();
  const { mutate: resumeSub, isPending: isResuming } = useResumeSubscription();
  const { mutate: checkout, isPending: isCheckoutPending } = useCheckout();
  const { config } = useLocale();

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (!sub) return <div className="p-8">Please log in to manage your subscription.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Subscription & Billing</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Current Plan
            <Badge>{sub.status === "active" ? "Active" : sub.status === "trial" ? "Trial" : "Expired"}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sub.status === "trial" && (
            <p>{sub.trialExpired
              ? "Your trial has expired."
              : `${sub.trialDaysLeft} days remaining in your free trial.`}
            </p>
          )}

          {sub.status === "active" && sub.currentPeriodEnd && (
            <p>Next billing date: <strong>{new Date(sub.currentPeriodEnd).toLocaleDateString()}</strong></p>
          )}

          {sub.cancelAtPeriodEnd && (
            <div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-md">
              <p>Your subscription will end on {sub.currentPeriodEnd
                ? new Date(sub.currentPeriodEnd).toLocaleDateString()
                : "the end of this billing period"}.
              </p>
              <Button onClick={() => resumeSub()} disabled={isResuming} className="mt-2">
                {isResuming ? "Resuming..." : "Resume Subscription"}
              </Button>
            </div>
          )}

          {sub.freeMonthsEarned > 0 && (
            <p>Referral bonus: <strong>{sub.freeMonthsEarned} free month(s)</strong> earned</p>
          )}

          {(sub.status === "trial" || sub.status === "expired") && (
            <Button onClick={() => checkout(config.code)} disabled={isCheckoutPending} className="w-full">
              {isCheckoutPending ? "Opening checkout..." : `Subscribe — ${config.formattedPrice}/mo`}
            </Button>
          )}

          {sub.status === "active" && !sub.cancelAtPeriodEnd && (
            <Button variant="outline" onClick={() => cancelSub()} disabled={isCancelling}>
              {isCancelling ? "Cancelling..." : "Cancel Subscription"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

Add this page to your router in `client/src/App.tsx`:

```tsx
<Route path="/subscription" component={SubscriptionManagement} />
```

---

### Implementation Summary — Files Changed/Created

| File | Action | Purpose |
|---|---|---|
| `package.json` | Modified | Add `@lemonsqueezy/lemonsqueezy.js` dependency |
| `.env` / `.env.example` | Modified | Add `LEMONSQUEEZY_API_KEY`, `LEMONSQUEEZY_STORE_ID`, `LEMONSQUEEZY_WEBHOOK_SECRET` |
| `shared/schema.ts` | Modified | Add 8 payment columns to `userProfiles` table |
| `shared/routes.ts` | Modified | Add `payment` section with checkout, subscription, cancel, resume routes |
| `server/storage.ts` | Modified | Add `updateSubscriptionFromWebhook`, `getUserProfileByProviderCustomerId`, `getUserProfileByProviderSubscriptionId` to both storage classes |
| `server/payment/lemonsqueezy.ts` | **Created** | Lemon Squeezy SDK wrapper (checkout, cancel, resume, webhook verification) |
| `server/payment/routes.ts` | **Created** | Payment API endpoints (checkout, webhook, subscription management) |
| `server/middleware/subscription.ts` | **Created** | Subscription enforcement middleware |
| `server/routes.ts` | Modified | Wire payment routes, replace dummy subscribe handler, add middleware to AI endpoints |
| `client/src/hooks/use-profile.ts` | Modified | Add `useCheckout`, `useSubscriptionStatus`, `useCancelSubscription`, `useResumeSubscription` |
| `client/src/components/SubscriptionCard.tsx` | Modified | Real checkout flow with cancel/resume support |
| `client/src/lib/analytics.ts` | **Created** | GTM dataLayer event tracking utility |
| `client/src/pages/SubscriptionManagement.tsx` | **Created** | Dedicated subscription management page |
| `client/src/pages/Dashboard.tsx` | Modified | Handle post-checkout redirect |
| `client/src/App.tsx` | Modified | Add `/subscription` route |
| `client/index.html` | Modified | Uncomment GTM snippets, add real Container ID |

---

### Testing Checklist

#### Phase 1: Payment Integration

- [ ] Lemon Squeezy test mode: Create test products with `test_` prefix
- [ ] Click "Subscribe" → LS checkout overlay opens with correct locale pricing
- [ ] Complete test payment → webhook fires → `user_profiles.subscription_status` becomes `'active'`
- [ ] AI endpoints work for active subscribers
- [ ] AI endpoints return 403 for expired trials
- [ ] Cancel subscription → `cancelAtPeriodEnd` set to 1 → still active until period end
- [ ] Resume cancelled subscription → `cancelAtPeriodEnd` set to 0
- [ ] Webhook signature verification rejects tampered payloads
- [ ] Failed payment → Lemon Squeezy retries → subscription stays active during retry window
- [ ] Subscription expiry → status becomes `'expired'` → AI endpoints blocked

#### Phase 2: Analytics

- [ ] GTM container loads (check browser dev tools → Network tab → `gtm.js`)
- [ ] GA4 pageview events fire on navigation
- [ ] `sign_up` event fires after login
- [ ] `submit_problem` event fires after problem creation
- [ ] `subscription_purchase` event fires after successful checkout
- [ ] `referral_shared` event fires after code copy
- [ ] `social_share` event fires after social sharing

#### Phase 3: SEO

- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Google Search Console shows sitemap submitted successfully
- [ ] Google Rich Results Test passes for all 3 JSON-LD schemas
- [ ] Facebook Sharing Debugger shows correct OG image, title, description
- [ ] WhatsApp preview shows correctly when sharing the URL
- [ ] LinkedIn Post Inspector shows correct preview

---

## File Reference

| Document | Purpose |
|---|---|
| [`docs/payment-options-hk.md`](./payment-options-hk.md) | Detailed payment gateway comparison and HK-specific setup |
| [`docs/digital-marketing.md`](./digital-marketing.md) | SEO, analytics, social sharing implementation guide |
| [`docs/tasklist_v2.md`](./tasklist_v2.md) | Full task list with completion status |
| [`docs/project-overview.md`](./project-overview.md) | Technical architecture and feature inventory |
| [`docs/privacy-policy.md`](./privacy-policy.md) | Privacy policy (trust signal for conversions) |
