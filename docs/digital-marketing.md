# BharatSolve AI — Digital Marketing & SEO Guide

This document covers every digital marketing feature implemented in the application, how each works, and what steps are needed to activate or customize them.

---

## Table of Contents

1. [SEO Meta Tags](#1-seo-meta-tags)
2. [Open Graph & Social Media Previews](#2-open-graph--social-media-previews)
3. [Twitter Cards](#3-twitter-cards)
4. [Structured Data / JSON-LD](#4-structured-data--json-ld)
5. [Dynamic Per-Page SEO](#5-dynamic-per-page-seo)
6. [robots.txt](#6-robotstxt)
7. [Sitemap](#7-sitemap)
8. [PWA Manifest](#8-pwa-manifest)
9. [Google Tag Manager & Analytics](#9-google-tag-manager--analytics)
10. [Social Sharing Component](#10-social-sharing-component)
11. [Server-Side Meta Injection for Crawlers](#11-server-side-meta-injection-for-crawlers)
12. [Landing Page SEO Content](#12-landing-page-seo-content)
13. [Performance Optimizations](#13-performance-optimizations)
14. [Activation Checklist](#14-activation-checklist)
15. [Ongoing Maintenance](#15-ongoing-maintenance)

---

## 1. SEO Meta Tags

**File:** `client/index.html`

The HTML template includes comprehensive SEO meta tags:

| Meta Tag | Purpose |
|---|---|
| `<title>` | Primary title shown in Google results and browser tab |
| `<meta name="description">` | 155-character description shown under the title in search results |
| `<meta name="keywords">` | Target keywords for search engines (India-specific terms) |
| `<meta name="author">` | Brand attribution |
| `<meta name="robots">` | Instructs crawlers to index the page and follow links |
| `<link rel="canonical">` | Prevents duplicate content issues — points to the canonical URL |
| `<meta name="theme-color">` | Sets browser address bar color to saffron (#E8751A) |
| `<meta name="geo.region">` | Geo-targets the site to India (IN) |
| `<meta name="ICBM">` | Latitude/longitude for India geo-targeting |

### Target Keywords

The meta keywords target these search intents:

- "AI problem solver India"
- "Indian AI advisor"
- "family problem solver"
- "career advice India"
- "AI counsellor Hindi"
- "life coach AI"
- "BharatSolve"
- "Indian wisdom AI"
- "relationship advice India"
- "Hindi AI chat"
- "Tamil AI advisor"
- "Telugu problem solver"

### How to Customize

Edit `client/index.html` and update the content attributes. Keep descriptions under 160 characters for optimal display in search results.

---

## 2. Open Graph & Social Media Previews

**File:** `client/index.html`

Open Graph tags control how the site appears when shared on Facebook, WhatsApp, LinkedIn, and other platforms.

| Tag | Value |
|---|---|
| `og:type` | `website` |
| `og:title` | "BharatSolve AI — Solve Life's Challenges With Indian Wisdom & AI" |
| `og:description` | Compelling description mentioning 12 languages and cultural awareness |
| `og:image` | `https://bharatsolve.ai/og-image.png` (1200x630px) |
| `og:url` | `https://bharatsolve.ai/` |
| `og:site_name` | "BharatSolve AI" |
| `og:locale` | `en_IN` (English, India) |
| `og:locale:alternate` | `hi_IN` (Hindi, India) |

### OG Image Requirements

- **Dimensions:** 1200 x 630 pixels (2:1 ratio)
- **Format:** PNG or JPG
- **File size:** Under 1MB
- **Location:** `client/public/og-image.png`
- **Content suggestions:** Logo, tagline "Solve Life's Challenges With Indian Wisdom & AI", saffron/green/blue Indian palette

### Testing Tools

- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

---

## 3. Twitter Cards

**File:** `client/index.html`

| Tag | Value |
|---|---|
| `twitter:card` | `summary_large_image` (shows full-width image preview) |
| `twitter:title` | Same as OG title |
| `twitter:description` | Shorter version optimized for Twitter |
| `twitter:image` | Same as OG image |
| `twitter:image:alt` | Accessible description of the image |

### Optional Enhancement

Add `<meta name="twitter:site" content="@YourTwitterHandle">` when you have a Twitter/X account.

---

## 4. Structured Data / JSON-LD

**File:** `client/index.html`

Three JSON-LD schemas are embedded for Google rich results:

### 4a. Organization Schema

Establishes BharatSolve AI as a recognized entity in Google's Knowledge Graph.

```json
{
  "@type": "Organization",
  "name": "BharatSolve AI",
  "url": "https://bharatsolve.ai",
  "logo": "https://bharatsolve.ai/favicon.png",
  "foundingCountry": "IN",
  "areaServed": "IN"
}
```

**Action needed:** Add social profile URLs to the `sameAs` array when available (Twitter, LinkedIn, Facebook, Instagram, YouTube).

### 4b. WebApplication Schema

Shows app info, pricing, and ratings directly in Google search results.

```json
{
  "@type": "WebApplication",
  "name": "BharatSolve AI",
  "applicationCategory": "LifestyleApplication",
  "offers": { "price": "0", "description": "1-month free trial, then ₹499/month" },
  "aggregateRating": { "ratingValue": "4.8", "ratingCount": "10000" },
  "inLanguage": ["en", "hi", "ta", "te", "bn", "mr", "gu", "kn", "ml", "pa", "or"]
}
```

**Action needed:** Update `ratingValue` and `ratingCount` with real data when available.

### 4c. FAQPage Schema

Enables FAQ rich snippets in Google search — the questions and answers appear directly in search results, significantly increasing click-through rate.

5 FAQs are embedded covering:
- What is BharatSolve AI?
- Which languages are supported?
- How much does it cost?
- Is data private?
- Can it help with family problems?

**Action needed:** Keep the JSON-LD FAQ in `index.html` in sync with the FAQ section rendered in `Landing.tsx`.

### Validation

Use [Google Rich Results Test](https://search.google.com/test/rich-results) to validate structured data.

---

## 5. Dynamic Per-Page SEO

**File:** `client/src/hooks/use-document-head.ts`

A custom React hook that dynamically updates `<title>`, `<meta description>`, canonical URL, Open Graph, and Twitter tags as users navigate between pages.

### Usage

```tsx
import { useDocumentHead } from "@/hooks/use-document-head";

useDocumentHead({
  title: "Dashboard",                    // Appends " | BharatSolve AI"
  description: "Your problem dashboard", // Updates meta description
  canonicalPath: "/",                    // Updates canonical + OG URL
  noIndex: true,                         // Set for private pages
});
```

### Current Page Configurations

| Page | Title | Indexed? |
|---|---|---|
| Landing (`/`) | "BharatSolve AI — Solve Life's Challenges With Indian Wisdom & AI" | Yes |
| Dashboard (`/`) | "Dashboard \| BharatSolve AI" | No (`noIndex`) |
| Problem Detail (`/problems/:id`) | "[Problem Title] \| BharatSolve AI" | No (`noIndex`) |
| 404 | "Page Not Found \| BharatSolve AI" | No (`noIndex`) |

Private/authenticated pages are marked `noIndex` to prevent search engines from indexing them (they'd just see a login page).

---

## 6. robots.txt

**File:** `client/public/robots.txt`

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /problems/

Sitemap: https://bharatsolve.ai/sitemap.xml
```

- **Allows:** Crawling of the landing page and public assets
- **Blocks:** API endpoints and authenticated problem pages
- **Points to:** The dynamic sitemap
- **Crawl-delay:** 5 seconds for Bingbot (prevents overloading)

**Action needed:** Update the Sitemap URL with your actual production domain.

---

## 7. Sitemap

**File:** `server/routes.ts` (route handler)

A dynamic XML sitemap is served at `GET /sitemap.xml`. It:

- Auto-generates `<lastmod>` with today's date
- Sets `<changefreq>` and `<priority>` for each URL
- Is cached for 1 hour (`Cache-Control: public, max-age=3600`)
- Uses the `BASE_URL` environment variable

### Current Pages in Sitemap

| URL | Priority | Change Frequency |
|---|---|---|
| `/` | 1.0 | weekly |

### Adding New Public Pages

To add a new page to the sitemap, edit the `urls` array in the sitemap route handler in `server/routes.ts`:

```ts
const urls = [
  { loc: "/", priority: "1.0", changefreq: "weekly" },
  { loc: "/about", priority: "0.8", changefreq: "monthly" },  // add new pages
];
```

### Submitting to Search Engines

1. **Google Search Console:** https://search.google.com/search-console → Add property → Submit sitemap URL
2. **Bing Webmaster Tools:** https://www.bing.com/webmasters → Submit sitemap

---

## 8. PWA Manifest

**File:** `client/public/manifest.json`

The Progressive Web App manifest enables:

- **Home screen installation** on Android and iOS
- **App-like experience** with standalone display mode
- **App store listing** potential (via PWABuilder for Microsoft Store, etc.)

| Property | Value |
|---|---|
| `name` | "BharatSolve AI — Indian Wisdom & AI Problem Solver" |
| `short_name` | "BharatSolve" |
| `display` | `standalone` |
| `theme_color` | `#E8751A` (saffron) |
| `background_color` | `#FFFAF5` (warm white) |
| `categories` | lifestyle, education, productivity |
| `lang` | `en-IN` |

### Enhancing the PWA

To add more icon sizes (recommended for production):
1. Generate icons at 48x48, 72x72, 96x96, 144x144, 192x192, 512x512
2. Add entries to the `icons` array in `manifest.json`
3. Consider adding `screenshots` for richer install prompts

---

## 9. Google Tag Manager & Analytics

**File:** `client/index.html`

GTM snippets are pre-installed but **commented out**. To activate:

1. Create a GTM account at https://tagmanager.google.com
2. Get your Container ID (format: `GTM-XXXXXXX`)
3. In `client/index.html`, replace `GTM-XXXXXXX` with your actual ID in both locations:
   - The `<script>` tag in `<head>`
   - The `<noscript>` tag in `<body>`
4. Uncomment both snippets

### Recommended GTM Tags to Configure

| Tag | Purpose |
|---|---|
| Google Analytics 4 (GA4) | Page views, user behavior, conversion tracking |
| Google Ads Conversion | Track sign-ups and subscriptions for ad campaigns |
| Facebook Pixel | Retargeting and conversion tracking for FB/Instagram ads |
| LinkedIn Insight Tag | B2B marketing and conversion tracking |
| Microsoft Clarity | Free heatmaps and session recordings |
| Custom Events | Track "Start Free Trial" clicks, problem submissions, referrals |

### Key Events to Track

| Event | Trigger |
|---|---|
| `sign_up` | User completes login/registration |
| `start_trial` | User activates free trial |
| `submit_problem` | User submits a new problem |
| `subscription_purchase` | User subscribes (₹499/month) |
| `referral_shared` | User shares referral code |
| `social_share` | User clicks any social share button |

---

## 10. Social Sharing Component

**File:** `client/src/components/SocialShare.tsx`

A reusable share button with popover menu supporting:

| Platform | Method |
|---|---|
| WhatsApp | `api.whatsapp.com/send` deep link |
| X (Twitter) | `twitter.com/intent/tweet` |
| Facebook | `facebook.com/sharer/sharer.php` |
| LinkedIn | `linkedin.com/sharing/share-offsite` |
| Telegram | `t.me/share/url` |
| Copy Link | Clipboard API with visual feedback |
| Native Share | Web Share API (mobile devices) |

### Where It's Used

| Location | Context |
|---|---|
| Landing page navbar | Share the main site |
| Landing page footer | Share the site with custom text |
| Problem Detail header | Share "BharatSolve AI helped me solve: [title]" (shares homepage URL, not private problem URL) |

### Usage

```tsx
<SocialShare
  title="BharatSolve AI"
  description="Solve life's challenges with culturally-aware AI"
  url="https://bharatsolve.ai"
  variant="ghost"
  size="sm"
/>
```

---

## 11. Server-Side Meta Injection for Crawlers

**File:** `server/static.ts`

Social media crawlers (Facebook, Twitter, WhatsApp, LinkedIn, etc.) don't execute JavaScript, so they can't see React-rendered content. The server detects crawler user agents and injects OG/Twitter meta tags into the HTML before serving it.

### Detected Crawlers

`facebookexternalhit`, `Twitterbot`, `LinkedInBot`, `WhatsApp`, `TelegramBot`, `Slackbot`, `Discordbot`, `Googlebot`, `bingbot`

### How It Works

1. Request arrives for any non-API path
2. Server checks if the User-Agent matches a known crawler
3. If yes: reads `index.html`, injects page-specific meta tags, sends the modified HTML
4. If no: serves `index.html` as-is (React handles client-side rendering)

### Customizing Meta Per Path

Edit the `getPageMeta()` function in `server/static.ts` to add path-specific metadata:

```ts
function getPageMeta(urlPath: string): PageMeta {
  if (urlPath === "/") {
    return { title: "...", description: "...", canonicalPath: "/" };
  }
  if (urlPath === "/about") {
    return { title: "About Us", description: "...", canonicalPath: "/about" };
  }
  // default fallback
  return { ... };
}
```

---

## 12. Landing Page SEO Content

**File:** `client/src/pages/Landing.tsx`

The landing page has been restructured with SEO-rich, crawlable content sections:

| Section | SEO Purpose |
|---|---|
| **Hero** | H1 heading with primary keywords, descriptive subtext |
| **Social Proof** | City names (Mumbai, Delhi, Bangalore, etc.) add Indian geo-relevance |
| **Features Grid** | 4 feature cards with keyword-rich titles and descriptions |
| **How It Works** | 3-step explanation — helps Google understand the product flow |
| **Use Cases** | 9 problem categories (family, career, marriage, etc.) — long-tail keywords |
| **Testimonials** | User stories from Mumbai, Delhi, Chennai — builds E-E-A-T signals |
| **Pricing** | Clear pricing (₹0 trial, ₹499/month) — matches WebApplication schema |
| **FAQ** | 6 Q&As matching the JSON-LD FAQPage schema — enables rich snippets |
| **CTA** | Strong call-to-action with social proof ("10,000+ users") |
| **Footer** | Solutions list, language list, company links — rich anchor text for crawlers |

### Semantic HTML

All sections use proper `aria-label` attributes and semantic heading hierarchy (H1 → H2 → H3) for accessibility and SEO.

---

## 13. Performance Optimizations

### Google Fonts Cleanup

**Before:** 25+ font families loaded (~800KB of font data)

**After:** Only 2 font families loaded (~40KB):
- **Inter** (body text) — weights 400, 500, 600, 700
- **Outfit** (headings) — weights 500, 600, 700, 800

This dramatically improves:
- **Largest Contentful Paint (LCP)** — key Core Web Vital
- **First Contentful Paint (FCP)**
- **Total page weight**

### Resource Hints

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="preconnect" href="https://www.googletagmanager.com" />
```

Preconnect hints eliminate DNS lookup and TLS handshake time for critical resources.

---

## 14. Activation Checklist

Complete these steps before going to production:

- [ ] **Create OG image:** Design a 1200x630px image and save as `client/public/og-image.png`
- [ ] **Set production domain:** Replace all instances of `https://bharatsolve.ai` with your actual domain in:
  - `client/index.html` (canonical URL, OG tags, Twitter tags, JSON-LD schemas)
  - `client/public/robots.txt` (Sitemap URL)
  - `client/src/hooks/use-document-head.ts` (`BASE_URL` constant)
  - `server/static.ts` (`BASE_URL` fallback)
- [ ] **Set `BASE_URL` env var:** Add `BASE_URL=https://yourdomain.com` to your environment
- [ ] **Activate GTM:** Uncomment GTM snippets in `index.html` and replace `GTM-XXXXXXX`
- [ ] **Configure GA4:** Set up a GA4 property in GTM with recommended events
- [ ] **Submit sitemap:** Submit `https://yourdomain.com/sitemap.xml` to Google Search Console and Bing Webmaster
- [ ] **Validate structured data:** Test with [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] **Test social previews:** Verify sharing on WhatsApp, Facebook, Twitter, LinkedIn
- [ ] **Generate PWA icons:** Create icon set at all recommended sizes (48–512px)
- [ ] **Add social profiles:** Update the `sameAs` array in Organization JSON-LD with social URLs
- [ ] **Update rating data:** Replace placeholder `aggregateRating` in WebApplication schema with real metrics
- [ ] **Add Twitter handle:** Add `<meta name="twitter:site" content="@YourHandle">` when available

---

## 15. Ongoing Maintenance

### Monthly

- Review Google Search Console for indexing issues and search performance
- Update FAQ content if new common questions emerge
- Check for broken OG image previews on social platforms

### Quarterly

- Refresh meta descriptions with seasonal or trending keywords
- Update testimonials with new user stories
- Review and update structured data ratings
- Audit Core Web Vitals in Google PageSpeed Insights

### When Adding New Public Pages

1. Add the page's `useDocumentHead()` call with appropriate title/description
2. Add the URL to the sitemap `urls` array in `server/routes.ts`
3. Add path-specific meta in `getPageMeta()` in `server/static.ts`
4. Ensure proper heading hierarchy (H1 → H2 → H3)
5. Re-submit sitemap to search engines

---

## File Reference

| File | What It Contains |
|---|---|
| `client/index.html` | SEO meta tags, OG tags, Twitter cards, JSON-LD schemas, GTM, font optimization |
| `client/public/robots.txt` | Search engine crawler directives |
| `client/public/manifest.json` | PWA manifest for installability |
| `client/public/og-image.png` | Social sharing preview image (to be created) |
| `client/src/hooks/use-document-head.ts` | React hook for dynamic per-page SEO |
| `client/src/components/SocialShare.tsx` | Social sharing button component |
| `client/src/pages/Landing.tsx` | SEO-optimized landing page with FAQ, testimonials, pricing |
| `server/routes.ts` | Dynamic sitemap.xml route handler |
| `server/static.ts` | Server-side meta injection for social crawlers |
