# Payment Gateway Options — Hong Kong Individual (No Business Entity)

> **Your Situation:** Living in Hong Kong, no business name, no business account.
> **Your App:** Multi-country SaaS with subscriptions (IN ₹499, SG S$15, HK HK$99, JP ¥1,500, US $10, GB £8, etc.)
> **Current State:** Subscribe button just flips a DB flag — zero payment verification.

---

## TL;DR — Recommendation

| Priority | Option | Why |
|---|---|---|
| **1st (Start here)** | **Lemon Squeezy** | Zero business entity needed. They handle all taxes globally. Free tier. Best for solo devs launching fast. |
| **2nd (Scale-up)** | **Stripe HK** | Best APIs & subscription tools. Requires HK sole proprietor registration (HK$2,200/year, 1-day approval). |
| **3rd (Alternative)** | **Paddle** | Similar to Lemon Squeezy but more established. Better for larger scale. |

---

## Option 1: Lemon Squeezy (Recommended to Start)

**Why it's perfect for you:**
- **No business entity required** — they are the "Merchant of Record" (MoR)
- **They handle ALL global tax** — GST (India), GST (Singapore), no sales tax (HK), consumption tax (Japan), VAT (UK/DE), etc.
- **You just receive payouts** — to your personal HK bank account or PayPal
- **Built-in subscription billing** — exactly what you need

### Pricing

| Plan | Fee per Transaction | Monthly Cost |
|---|---|---|
| Free | 5% + $0.50 | $0 |
| Growth | 3.5% + $0.30 | ~$32/mo |

### What "Merchant of Record" means for you

```
Traditional (Stripe/PayPal):
  Customer → pays YOU → YOU file taxes in 12 countries → nightmare

Merchant of Record (Lemon Squeezy):
  Customer → pays LEMON SQUEEZY → they handle all taxes → they pay YOU
```

You never deal with:
- Indian GST registration
- Singapore GST
- Japan consumption tax
- EU VAT
- US sales tax across 50 states
- UK VAT

### Supported Payment Methods
- Credit/debit cards (Visa, Mastercard, Amex)
- PayPal
- Apple Pay / Google Pay
- Bank debits (SEPA for EU)

### Multi-Currency Support
- Automatic currency conversion for your 12 locale pricing
- Customers see prices in their local currency
- You receive payouts in your preferred currency (HKD/USD)

### Integration Effort
- JavaScript SDK + webhook-based
- ~2-3 days to integrate
- Subscription management built-in (create plans, handle upgrades/downgrades/cancellations)
- Customer portal for self-service billing management

### Limitations
- Higher fees (5% on free tier) compared to Stripe (3.4%)
- Less customizable checkout compared to Stripe Elements
- Fewer payment methods than Stripe in Asian markets (no Alipay/WeChat Pay)

### Sign Up
- https://lemonsqueezy.com
- Personal email + bank account details for payouts
- No business documents needed

---

## Option 2: Stripe Hong Kong (Best for Scale)

**Why it's great:**
- **Best developer APIs** in the industry
- **Native subscription billing** (Stripe Billing)
- **135+ currencies** — perfect for your 12-locale setup
- **Asian payment methods** — Alipay, WeChat Pay (important for HK/CN users)
- **3.4% + HK$2.35** per transaction (lower than Lemon Squeezy)

### Requirements (Hong Kong)

**You need a sole proprietor registration.** Here's what that involves:

| Step | Details | Cost | Time |
|---|---|---|---|
| 1. Register as Sole Proprietor | File Form 1(a) with Inland Revenue Department (IRD) | HK$2,200/year | 1 business day (online) |
| 2. Get Business Registration Certificate | Issued by IRD | Included above | Same day |
| 3. Open Stripe HK account | Use HKID + BRC | Free | ~2-3 days |

**Total upfront cost: HK$2,200 (~US$282)**

### Sole Proprietor Registration Steps

1. Go to [GovHK e-Services](https://www.gov.hk/en/residents/taxes/etax/services/breg_application.htm)
2. File Form 1(a) — Application for Business Registration
3. Provide: HKID, business address (your home address works), business nature ("Information Technology Services")
4. Pay HK$2,200 online
5. Receive Business Registration Certificate (BRC) within 1 working day

**Tax implications:**
- Two-tiered profits tax: 7.5% on first HK$2M, then 15%
- Only on profits, not revenue
- File annually
- No separation between personal and business — unlimited liability

### Stripe HK Pricing

| Type | Fee |
|---|---|
| Cards (Visa/MC/Amex) | 3.4% + HK$2.35 |
| Alipay | 2.2% + HK$1.50 |
| WeChat Pay | 2.2% + HK$1.50 |
| Apple Pay / Google Pay | 3.4% + HK$2.35 |
| Stripe Billing (subscriptions) | +0.5% |

### What YOU handle (unlike Lemon Squeezy)
- Tax compliance in each country (you can use Stripe Tax add-on for +0.5%)
- Stripe Tax automates calculation + filing in 50+ countries
- Business registration in HK
- Annual tax filing in HK

### Integration Effort
- Stripe.js + Stripe Elements (beautiful, customizable checkout)
- Stripe Billing for subscriptions
- Webhooks for subscription lifecycle events
- ~3-5 days to integrate
- Best documentation of any payment provider

---

## Option 3: Paddle (Alternative MoR)

**Similar to Lemon Squeezy but:**
- More established (used by bigger SaaS companies)
- Better dunning (failed payment recovery)
- Better fraud protection
- **5% + $0.50** per transaction (same as LS free tier)
- Custom pricing for products under $10 (your GB £8 plan qualifies — contact them)
- Requires approval process (may take a few days)

### Considerations
- Developer-first APIs
- 30 currencies, 200+ markets
- Built-in subscription management
- Revenue recovery (smart retries for failed payments)
- Customer portal included
- https://paddle.com

---

## Option 4: PayPal (Simplest but Limited)

**Pros:**
- Sign up with personal HK PayPal account
- Zero business registration needed
- Users worldwide recognize and trust PayPal
- Subscription billing available

**Cons:**
- 3.4% + fixed fee per transaction (HK$2.35 for HK)
- Higher fees for international payments (4.4% + fixed)
- Poor developer experience compared to Stripe
- Account freezes/holds are common for new accounts
- Limited payment methods (just PayPal + cards)
- No Alipay/WeChat Pay
- Tax compliance is 100% on you

**Best for:** Adding as a secondary payment option alongside Stripe or Lemon Squeezy.

---

## Comparison Matrix

| Feature | Lemon Squeezy | Stripe HK | Paddle | PayPal |
|---|---|---|---|---|
| **Business entity needed** | No | Yes (sole prop) | No | No |
| **Setup cost** | $0 | ~HK$2,200 | $0 | $0 |
| **Transaction fee** | 5% + $0.50 | 3.4% + HK$2.35 | 5% + $0.50 | 3.4-4.4% + fixed |
| **Tax handling** | They do it all | You do it (or +0.5% for Stripe Tax) | They do it all | You do it all |
| **Subscription billing** | Built-in | Built-in (Stripe Billing) | Built-in | Basic |
| **Multi-currency** | Yes | Yes (135+) | Yes (30) | Yes |
| **Alipay/WeChat Pay** | No | Yes | No | No |
| **API quality** | Good | Excellent | Good | Fair |
| **Payout to HK bank** | Yes | Yes | Yes | Yes |
| **Checkout customization** | Overlay/hosted | Fully embedded | Overlay/hosted | Redirect |
| **Customer self-service portal** | Yes | Yes (Customer Portal) | Yes | Limited |
| **Time to go live** | 1-2 days | 3-5 days | 2-4 days | 1 day |

---

## Revenue Impact Analysis

Based on your pricing (using HK locale as example: HK$99/mo):

| Provider | Fee per HK$99 txn | You receive | Annual (100 users) |
|---|---|---|---|
| Lemon Squeezy (free) | HK$8.85 (5%+$0.50) | HK$90.15 | HK$108,180 |
| Stripe HK | HK$5.72 (3.4%+HK$2.35) | HK$93.28 | HK$111,936 |
| Paddle | HK$8.85 (5%+$0.50) | HK$90.15 | HK$108,180 |
| PayPal | HK$5.72 (3.4%+HK$2.35) | HK$93.28 | HK$111,936 |

**At 100 users, the difference between Lemon Squeezy and Stripe is ~HK$3,756/year** — roughly the cost of HK sole prop registration (HK$2,200). At scale, Stripe becomes more cost-effective.

---

## Recommended Path

### Phase 1 — Launch (Now)
**Use Lemon Squeezy** to get payments working immediately:
1. Create Lemon Squeezy account (personal email, personal bank)
2. Create subscription products for each locale/currency
3. Integrate checkout into your app
4. Go live and start collecting payments

### Phase 2 — Scale (When revenue > HK$5,000/mo)
**Add Stripe HK** for lower fees and Asian payment methods:
1. Register as HK sole proprietor (HK$2,200, 1 day)
2. Open Stripe HK account
3. Add Stripe as primary payment processor
4. Keep Lemon Squeezy as fallback / for non-Asian markets
5. Add Alipay + WeChat Pay via Stripe (important for HK/CN/SG users)

### Phase 3 — Company (When revenue is stable)
**Register a Hong Kong Limited Company** for:
- Limited liability protection
- Better tax planning
- Professional appearance
- More payment gateway options
- Ability to open business bank account

---

## Implementation Notes

### What needs to change in your codebase

1. **`server/routes.ts`** — The subscribe endpoint currently just flips a DB flag:
   ```
   app.post(api.userProfiles.subscribe.path, ...) → just calls storage.updateSubscription(userId, 'active')
   ```
   Needs to: create checkout session → verify payment webhook → then activate subscription

2. **`shared/schema.ts`** — Add payment-related fields to user_profiles table:
   - `stripeCustomerId` or `lemonSqueezyCustomerId`
   - `subscriptionId` (external provider's ID)
   - `currentPeriodEnd` (when current billing period ends)
   - `cancelAtPeriodEnd` (if user has requested cancellation)

3. **`client/src/components/SubscriptionCard.tsx`** — Replace direct subscribe() call with redirect to checkout

4. **New: Webhook endpoint** — `/api/webhooks/payment` to handle:
   - `subscription.created`
   - `subscription.updated`
   - `subscription.cancelled`
   - `payment.failed`

5. **New: Subscription management page** (task 4.03 from your tasklist)

### Environment Variables to Add

```bash
# For Lemon Squeezy
LEMONSQUEEZY_API_KEY=your_api_key
LEMONSQUEEZY_STORE_ID=your_store_id
LEMONSQUEEZY_WEBHOOK_SECRET=your_webhook_secret

# OR for Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Quick Start: Lemon Squeezy Setup

### 1. Create Account
- Go to https://lemonsqueezy.com
- Sign up with email
- Add payout method (HK bank account or PayPal)

### 2. Create Products
Create one product per locale pricing:

| Product Name | Price | Currency | Billing |
|---|---|---|---|
| BharatSolve Pro (India) | 499 | INR | Monthly |
| SolveSG Pro (Singapore) | 15 | SGD | Monthly |
| SolveHK Pro (Hong Kong) | 99 | HKD | Monthly |
| SolveJP Pro (Japan) | 1500 | JPY | Monthly |
| SolveCN Pro (China) | 49 | CNY | Monthly |
| SolveUS Pro (USA) | 10 | USD | Monthly |
| SolveUK Pro (UK) | 8 | GBP | Monthly |
| SolveKR Pro (Korea) | 13000 | KRW | Monthly |
| SolveUAE Pro (UAE) | 39 | AED | Monthly |
| SolveAU Pro (Australia) | 15 | AUD | Monthly |
| SolveDE Pro (Germany) | 9 | EUR | Monthly |
| SolveBR Pro (Brazil) | 29 | BRL | Monthly |

### 3. Get API Keys
- Dashboard → Settings → API → Create API key
- Dashboard → Settings → Webhooks → Add webhook endpoint

### 4. Integrate (see implementation section above)

---

## FAQ

**Q: Can I start accepting payments TODAY without any registration?**
A: Yes, with Lemon Squeezy or Paddle. They are the Merchant of Record, so you don't need any business registration.

**Q: Will I need to pay taxes in all 12 countries?**
A: With Lemon Squeezy/Paddle — NO. They handle all global tax obligations. With Stripe/PayPal — you're responsible (or use Stripe Tax add-on).

**Q: Can I switch from Lemon Squeezy to Stripe later?**
A: Yes, but you'll need to migrate active subscriptions. Best approach: use Lemon Squeezy for new signups → register sole prop → switch new signups to Stripe → gradually migrate existing subscribers.

**Q: What about Razorpay (mentioned in your tasklist)?**
A: Razorpay requires an Indian business entity (PAN, GST registration). Since you're in Hong Kong without an Indian business, Razorpay is NOT an option. Remove it from your tasklist recommendations.

**Q: Do I need a Hong Kong business bank account?**
A: No. Both Lemon Squeezy and Stripe HK can pay out to a personal HK bank account. Lemon Squeezy can also pay via PayPal.

**Q: What about Alipay and WeChat Pay for Chinese/HK users?**
A: Only Stripe HK supports these natively. If Alipay/WeChat Pay is critical (it is for HK/CN/SG users), prioritize getting the sole proprietor registration and using Stripe.
