# BharatSolve AI -- Functionality Guide

Complete documentation of every feature, user flow, and business rule in the application.

---

## Table of Contents

1. [Application Overview](#1-application-overview)
2. [Authentication & User Management](#2-authentication--user-management)
3. [AI Problem Solving](#3-ai-problem-solving)
4. [Follow-up Discussion (AI Chat)](#4-follow-up-discussion-ai-chat)
5. [Multi-Language Support](#5-multi-language-support)
6. [Subscription System](#6-subscription-system)
7. [Referral Program](#7-referral-program)
8. [File Attachments](#8-file-attachments)
9. [Social Sharing](#9-social-sharing)
10. [SEO & Digital Marketing](#10-seo--digital-marketing)
11. [Security Features](#11-security-features)
12. [API Reference](#12-api-reference)
13. [Database Schema](#13-database-schema)

---

## 1. Application Overview

**BharatSolve AI** is an AI-powered life problem solver designed for Indian users. It helps people navigate:

- Family dynamics (joint family issues, in-law conflicts, parenting)
- Career decisions (job changes, business challenges, education paths)
- Relationships (marriage, friendship, social situations)
- Financial concerns (budgeting, debt, investments)
- Health & wellness (stress, work-life balance)
- Legal & property matters (inheritance, tenant issues)
- Community & social issues (neighbourhood disputes, cultural expectations)
- Student life (exam stress, peer pressure, career confusion)
- Elder care (retirement, healthcare, loneliness)

The AI is culturally tuned to understand Indian values, social hierarchies, family structures, and cultural context. Responses reference Indian proverbs, traditions, and practical wisdom.

---

## 2. Authentication & User Management

### User Flow

```
Landing Page → "Get Started" button → Login → Dashboard
```

### Development Mode (Default)

- Triggered when `REPL_ID` is **not** set
- Clicking "Log In" or "Get Started" immediately authenticates as a development user
- No external identity provider required
- Session stored in server memory

### Production Mode

- Triggered when `REPL_ID` is set
- Uses OpenID Connect (OIDC) via Passport.js
- User is redirected to the identity provider for authentication
- On success, redirected back to the app with a session cookie
- Session stored in PostgreSQL via `connect-pg-simple`

### Session Management

- Sessions use HTTP-only, secure cookies
- Session secret configured via `SESSION_SECRET` environment variable
- Sessions expire based on server-side TTL

### Logout

- `GET /api/logout` destroys the server session and clears the cookie
- Client redirects to the landing page

---

## 3. AI Problem Solving

### User Flow

```
Dashboard → "Create New Problem" → Fill form → Submit → View AI Solution
```

### Step-by-Step

1. User clicks the "+" or "New Problem" button on the Dashboard
2. A dialog appears with:
   - **Language selector** -- dropdown with 12 Indian languages
   - **Title** -- short problem summary (required)
   - **Description** -- detailed problem explanation (required)
3. User fills the form and clicks "Submit"
4. The form validates input using Zod schemas
5. Server receives the request, sanitizes input, and checks subscription status
6. Server sends the problem to the AI backend with a culturally-tuned system prompt
7. AI generates a solution with:
   - Problem acknowledgment
   - Step-by-step action plan
   - Cultural wisdom / Indian proverbs
   - Emotional support and encouragement
8. Solution is saved and displayed to the user
9. Problem status changes from "pending" to "solved"

### AI Backends

| Priority | Backend | When Used |
|---|---|---|
| 1 | **OpenAI API** | `OPENAI_API_KEY` is set (supports any OpenAI-compatible API) |
| 2 | **Ollama** | `OPENAI_API_KEY=ollama` with custom base URL |
| 3 | **Mock AI** | No API key set (returns themed test responses) |

### System Prompt Design

The AI system prompt instructs the model to:
- Act as an empathetic Indian expert problem solver
- Understand cultural nuances, family dynamics, and social context
- Provide clear, actionable, emotionally resonant solutions
- Respect Indian values while being modern and practical
- Respond in the user's selected language using the appropriate script

### Mock AI Responses

When no API key is configured, the app returns pre-written mock responses that demonstrate the expected format. Mock responses are available in English, Hindi, Hinglish, and Tamil. Other languages fall back to English.

---

## 4. Follow-up Discussion (AI Chat)

### User Flow

```
Problem Detail Page → Type message → Send → AI replies → Continue conversation
```

### Features

- Chat-style interface with message bubbles (user on right, AI on left)
- Full conversation history maintained
- AI receives the complete context: original problem + solution + all prior messages
- File and image attachments supported (see Section 8)
- Auto-scrolling to the latest message
- "AI is thinking" loading indicator during response generation

### How Context is Maintained

Each AI reply includes:
1. System prompt (language-specific discussion prompt)
2. Original problem (title + description)
3. Initial AI solution
4. All previous messages in the conversation
5. The new user message (with attachment descriptions if any)

This means the AI always has full context and can reference earlier advice.

---

## 5. Multi-Language Support

### Supported Languages

| Code | Language | Native Label | Script |
|---|---|---|---|
| `english` | English | English | Latin |
| `hindi` | Hindi | हिन्दी | Devanagari |
| `hinglish` | Hinglish | Hinglish | Mixed Latin |
| `tamil` | Tamil | தமிழ் | Tamil |
| `telugu` | Telugu | తెలుగు | Telugu |
| `bengali` | Bengali | বাংলা | Bengali |
| `marathi` | Marathi | मराठी | Devanagari |
| `gujarati` | Gujarati | ગુજરાતી | Gujarati |
| `kannada` | Kannada | ಕನ್ನಡ | Kannada |
| `malayalam` | Malayalam | മലയാളം | Malayalam |
| `punjabi` | Punjabi | ਪੰਜਾਬੀ | Gurmukhi |
| `odia` | Odia | ଓଡ଼ିଆ | Odia |

### How Language Works

1. User selects language when creating a problem
2. The selected language is stored with the problem
3. The AI system prompt is customized per language:
   - **English**: Standard culturally-aware prompt
   - **Hinglish**: Explicitly instructed to use Romanized Hindi mixed with English
   - **Other languages**: Instructed to respond entirely in the target language's native script
4. Follow-up discussion continues in the same language

### Language Selection UI

The `CreateProblemDialog` shows a dropdown (`Select` component) with all 12 languages. Each option shows both the English name and the native label.

---

## 6. Subscription System

### Tiers

| Tier | Price | Duration | Features |
|---|---|---|---|
| **Free Trial** | Free | 30 days | Full access to all features |
| **Premium** | Rs. 499/month | Monthly | Continued full access |

### Business Rules

1. Every new user starts with a 30-day free trial
2. Trial start date is recorded when the user profile is created
3. After 30 days, the trial expires
4. Expired trial users cannot create new problems (403 error)
5. Users can extend their trial by earning free months via referrals
6. Subscribing changes status to "active"

### Subscription States

| State | Description |
|---|---|
| `trial` | Free trial period (30 days from registration) |
| `active` | Paid premium subscription |
| `expired` | Trial ended, not subscribed |

### UI Components

- **SubscriptionCard** on the Dashboard sidebar shows:
  - Trial users: "X days remaining in your free trial" with a progress bar
  - Premium users: "Premium Active" badge
  - Expired users: "Upgrade to Premium" CTA button

---

## 7. Referral Program

### How It Works

1. Every user receives a unique 8-character referral code upon registration
2. Users can share their code with friends
3. When a friend enters the code:
   - **Referrer** earns 1 free month
   - **Referee** earns 1 free month
4. Each user can only use one referral code (cannot be re-applied)
5. Users cannot refer themselves

### UI Components

- **ReferralCard** on the Dashboard sidebar shows:
  - User's referral code with a "Copy" button
  - Input field to enter a friend's referral code
  - "Apply" button to redeem

### Business Rules

- Referral code is generated using `randomUUID().substring(0, 8)`
- A user with `referredBy` already set cannot apply another code
- Both parties receive exactly 1 free month per referral
- Free months stack (e.g., referring 3 friends = 3 free months)

---

## 8. File Attachments

### Supported in Discussion Messages

Users can attach files to their follow-up messages for additional context.

### Constraints

| Constraint | Limit |
|---|---|
| Max files per message | 5 |
| Max file size | 10 MB per file |
| Supported image types | JPEG, PNG, GIF, WebP, HEIC, HEIF |
| Supported document types | PDF, TXT, CSV, DOC, DOCX, XLS, XLSX |

### How It Works

1. User clicks the attachment button (camera or file icon)
2. Selects files from their device
3. Files are uploaded via `FormData` (not JSON)
4. Server stores files in the `uploads/` directory with UUID filenames
5. File metadata (name, type, size, URL) is stored as JSON in the message's `attachments` column
6. Images are displayed inline in the chat; documents show as download links
7. The AI is informed about attached files via text descriptions: `[Attached file: report.pdf (application/pdf)]`

### File Storage

- Files are stored on disk at `{project-root}/uploads/`
- Served statically via Express: `GET /uploads/{uuid-filename}`
- In Docker, the `uploads` directory is a named volume for persistence

---

## 9. Social Sharing

### Share Channels

Users can share problem solutions via:

| Channel | How |
|---|---|
| **WhatsApp** | Opens WhatsApp with pre-filled message |
| **X (Twitter)** | Opens tweet composer |
| **Facebook** | Opens Facebook share dialog |
| **LinkedIn** | Opens LinkedIn share post |
| **Telegram** | Opens Telegram share |
| **Copy Link** | Copies shareable URL to clipboard |
| **Native Share** | Uses Web Share API (mobile) when available |

### Implementation

The `SocialShare` component generates share URLs with:
- The problem page URL
- A pre-written share message referencing BharatSolve AI
- Appropriate UTM parameters for tracking

---

## 10. SEO & Digital Marketing

### Meta Tags

Every page has comprehensive meta tags set via the `useDocumentHead` hook:
- Title, description, canonical URL
- Open Graph tags (for Facebook, LinkedIn)
- Twitter Card tags
- `noindex` flag for authenticated pages

### Structured Data (JSON-LD)

The landing page includes three JSON-LD schemas:
- **Organization** -- BharatSolve AI as a business entity
- **WebApplication** -- App metadata for search engines
- **FAQPage** -- FAQ section for rich snippets

### Sitemap

Dynamic XML sitemap at `/sitemap.xml` listing all public URLs with priority and change frequency.

### PWA

`manifest.json` makes the app installable as a Progressive Web App on mobile devices.

### Social Crawler Meta Injection

In production, the server detects social media crawlers (Facebook, Twitter, LinkedIn, etc.) by User-Agent and injects appropriate meta tags into the HTML before serving -- ensuring link previews display correctly even though the app is an SPA.

### Robots.txt

Located at `client/public/robots.txt`. Allows all crawlers, points to the sitemap.

---

## 11. Security Features

### Server-Side Protection

| Feature | Implementation | Purpose |
|---|---|---|
| Helmet | CSP headers, HSTS, X-Frame-Options | Prevents XSS, clickjacking, protocol downgrade |
| CORS | Restricted origins in production | Prevents unauthorized cross-origin requests |
| Rate Limiting | 3 tiers (global, login, AI) | Prevents abuse and DDoS |
| HPP | `hpp` middleware | Prevents HTTP parameter pollution |
| Content-Type Validation | Rejects non-JSON/form bodies | Prevents content-type attacks |
| Payload Scanning | Regex-based pattern matching | Blocks XSS, SQL injection, path traversal |
| Input Sanitization | `sanitizeString()` strips dangerous chars | Prevents stored XSS |
| Session Security | HTTP-only cookies, secure flag in prod | Prevents session hijacking |
| File Upload Validation | MIME type whitelist, size limits | Prevents malicious file uploads |
| Error Masking | Generic 500 messages in production | Prevents information leakage |

### Rate Limits

| Endpoint | Limit | Window |
|---|---|---|
| All routes | 200 requests | 15 minutes |
| Login routes | 10 requests | 15 minutes |
| Problem creation (AI) | 10 requests | 1 minute |

---

## 12. API Reference

### Authentication

#### `GET /api/login`
Initiates the login flow. In dev mode, auto-authenticates. In prod, redirects to OIDC provider.

#### `GET /api/callback`
OIDC callback handler. Redirects to `/` after successful auth.

#### `GET /api/logout`
Destroys the session and redirects to `/`.

#### `GET /api/auth/user`
Returns the current authenticated user or `null`.

**Response (200):**
```json
{
  "claims": {
    "sub": "user-id",
    "email": "user@example.com",
    "first_name": "Mayank",
    "profile_image": "https://..."
  }
}
```

### Problems

#### `GET /api/problems`
Lists all problems for the authenticated user, sorted by creation date (newest first).

**Response (200):**
```json
[
  {
    "id": 1,
    "userId": "user-id",
    "title": "Family disagreement about career choice",
    "description": "My parents want me to...",
    "language": "english",
    "solution": "## Understanding Your Concern...",
    "status": "solved",
    "createdAt": "2026-02-22T10:00:00.000Z"
  }
]
```

#### `POST /api/problems`
Creates a new problem and generates an AI solution.

**Request body:**
```json
{
  "title": "Problem title",
  "description": "Detailed description...",
  "language": "hindi"
}
```

**Response (201):** Problem object with `solution` populated and `status: "solved"`.

**Error (403):** `{ "message": "Trial expired. Please subscribe." }`

#### `GET /api/problems/:id`
Returns a single problem by ID. Returns 401 if the problem belongs to a different user.

### Discussion

#### `GET /api/problems/:id/messages`
Lists all discussion messages for a problem, sorted by creation time.

**Response (200):**
```json
[
  {
    "id": 1,
    "problemId": 1,
    "role": "user",
    "content": "Can you explain step 2 in more detail?",
    "attachments": null,
    "createdAt": "2026-02-22T10:05:00.000Z"
  },
  {
    "id": 2,
    "problemId": 1,
    "role": "assistant",
    "content": "Of course! Let me elaborate...",
    "attachments": null,
    "createdAt": "2026-02-22T10:05:03.000Z"
  }
]
```

#### `POST /api/problems/:id/messages`
Sends a message (with optional file attachments) and receives an AI reply.

**Request:** `multipart/form-data` with fields:
- `content` (string) -- message text
- `files` (File[]) -- up to 5 files, 10MB each

**Response (201):**
```json
{
  "userMessage": { "id": 3, "role": "user", "content": "..." },
  "aiMessage": { "id": 4, "role": "assistant", "content": "..." }
}
```

### User Profile

#### `GET /api/profile`
Returns the user's subscription and referral profile.

**Response (200):**
```json
{
  "id": 1,
  "userId": "user-id",
  "subscriptionStatus": "trial",
  "trialStartDate": "2026-02-22T00:00:00.000Z",
  "referralCode": "a1b2c3d4",
  "referredBy": null,
  "freeMonthsEarned": 0
}
```

#### `POST /api/profile/referral`
Applies a referral code. Awards 1 free month to both parties.

**Request body:**
```json
{ "referralCode": "x9y8z7w6" }
```

#### `POST /api/profile/subscribe`
Activates the premium subscription.

### SEO

#### `GET /sitemap.xml`
Returns a dynamic XML sitemap. Cached for 1 hour.

---

## 13. Database Schema

### `users` Table

| Column | Type | Description |
|---|---|---|
| `id` | VARCHAR (PK) | Unique user identifier |
| `email` | VARCHAR | User email |
| `first_name` | VARCHAR | First name |
| `last_name` | VARCHAR | Last name |
| `profile_image` | VARCHAR | Avatar URL |

### `sessions` Table

| Column | Type | Description |
|---|---|---|
| `sid` | VARCHAR (PK) | Session ID |
| `sess` | JSON | Session data |
| `expire` | TIMESTAMP | Expiry time |

### `problems` Table

| Column | Type | Description |
|---|---|---|
| `id` | SERIAL (PK) | Auto-increment ID |
| `user_id` | VARCHAR (FK → users) | Problem owner |
| `title` | TEXT | Problem title |
| `description` | TEXT | Full problem description |
| `language` | TEXT | Selected language (default: "english") |
| `solution` | TEXT (nullable) | AI-generated solution |
| `status` | TEXT | "pending" or "solved" |
| `created_at` | TIMESTAMP | Creation timestamp |

### `user_profiles` Table

| Column | Type | Description |
|---|---|---|
| `id` | SERIAL (PK) | Auto-increment ID |
| `user_id` | VARCHAR (FK → users, UNIQUE) | Profile owner |
| `subscription_status` | TEXT | "trial", "active", or "expired" |
| `trial_start_date` | TIMESTAMP | When the trial began |
| `referral_code` | TEXT (UNIQUE) | User's 8-char referral code |
| `referred_by` | VARCHAR (nullable) | Code of the person who referred them |
| `free_months_earned` | INTEGER | Number of free months from referrals |

### `discussion_messages` Table

| Column | Type | Description |
|---|---|---|
| `id` | SERIAL (PK) | Auto-increment ID |
| `problem_id` | INTEGER (FK → problems, CASCADE) | Parent problem |
| `role` | TEXT | "user" or "assistant" |
| `content` | TEXT | Message text |
| `attachments` | TEXT (nullable) | JSON array of attachment metadata |
| `created_at` | TIMESTAMP | Message timestamp |
