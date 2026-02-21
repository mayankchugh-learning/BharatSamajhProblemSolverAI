# BharatSolve AI - Project Overview

## Project Purpose

**BharatSolve AI** is a full-stack web application that helps Indian users solve real-life challenges (family, career, social) using AI-powered advice. It is branded with an Indian cultural theme -- saffron/green/blue color palette inspired by the Indian flag, Indian greetings ("Namaste"), and culturally-aware AI responses that understand Indian family dynamics and social context.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + TypeScript, Vite, Wouter (routing), TanStack Query (server state), shadcn/ui + Radix UI + Tailwind CSS, Framer Motion (animations), Lucide icons |
| **Backend** | Node.js 20 + Express 5, TypeScript (via `tsx`) |
| **Database** | In-memory (default for dev) or PostgreSQL with Drizzle ORM + drizzle-zod (production) |
| **AI** | OpenAI SDK (configurable model), Ollama (local), or mock AI (no key needed) |
| **Auth** | Dev auto-login (local) or OpenID Connect via Passport.js (production) |
| **Sessions** | memorystore (local) or connect-pg-simple / PostgreSQL (production) |
| **Build** | Vite (client) + esbuild (server) |

---

## Project Structure

```
BharatSamajhProblemSolverAI/
├── client/                     # Frontend SPA
│   ├── index.html              # Entry HTML (SEO meta, OG tags, JSON-LD, GTM)
│   ├── public/
│   │   ├── favicon.png         # App icon
│   │   ├── robots.txt          # Search engine crawler directives
│   │   └── manifest.json       # PWA manifest for installability
│   ├── src/
│   │   ├── App.tsx             # Root with routing
│   │   ├── pages/              # Landing, Dashboard, ProblemDetail, 404
│   │   ├── components/         # ProblemCard, CreateProblemDialog,
│   │   │                         SubscriptionCard, ReferralCard, Advertisement,
│   │   │                         SocialShare (social sharing buttons)
│   │   │   └── ui/             # ~40 shadcn/ui components
│   │   ├── hooks/              # useAuth, useProfile, useProblems,
│   │   │                         useDocumentHead (dynamic SEO), etc.
│   │   └── lib/                # queryClient, auth-utils, cn()
│   └── replit_integrations/    # Audio recording/playback hooks
├── server/                     # Backend API
│   ├── index.ts                # Express + HTTP server setup
│   ├── routes.ts               # Main API routes + AI solution generation + sitemap.xml
│   ├── static.ts               # Production static file serving + social crawler meta injection
│   ├── storage.ts              # Storage layer (MemoryStorage or DatabaseStorage via IStorage)
│   ├── db.ts                   # PostgreSQL connection (optional, null when no DATABASE_URL)
│   ├── vite.ts                 # Vite dev server middleware
│   ├── middleware/
│   │   └── security.ts         # Cybersecurity middleware (helmet, rate limiting, CORS, etc.)
│   └── replit_integrations/    # Modular integrations
│       ├── auth/               # Auth (dev auto-login or OIDC) + session management
│       ├── chat/               # Conversational AI with streaming
│       ├── audio/              # Voice AI (STT, TTS)
│       ├── image/              # Image generation
│       └── batch/              # Rate-limited batch processing
├── shared/                     # Shared between frontend + backend
│   ├── schema.ts               # Drizzle tables + Zod schemas (problems, userProfiles)
│   ├── routes.ts               # Typed API contract (paths, methods, schemas)
│   └── models/                 # auth.ts (users, sessions), chat.ts (conversations, messages)
├── script/build.ts             # Build script
├── docs/                       # Documentation
│   ├── project-overview.md     # This file
│   ├── setup-guide.md          # Local development setup instructions
│   └── digital-marketing.md    # SEO, OG tags, analytics, social sharing guide
├── .env                        # Environment variables (git-ignored)
└── [config files]              # package.json, tsconfig, vite, drizzle, tailwind, etc.
```

---

## Key Features

### 1. AI Problem Solving

Users submit problems with a title and description. The backend generates solutions using one of three AI backends (selected automatically based on environment):

| Priority | Condition | Backend |
|---|---|---|
| 1 | `OPENAI_API_KEY` set | OpenAI API (or any OpenAI-compatible API like Ollama) |
| 2 | No API key | Mock AI -- generates a nicely formatted, culturally-themed test response instantly |

The AI system prompt is culturally tuned for Indian values, family dynamics, and social context. The model is configurable via the `OPENAI_MODEL` env var (defaults to `gpt-4o-mini`).

### 2. Dual Storage Mode

| Mode | When | How |
|---|---|---|
| **In-memory** | `DATABASE_URL` not set | All data lives in server memory; resets on restart. Perfect for development. |
| **PostgreSQL** | `DATABASE_URL` set | Full persistent database via Drizzle ORM. For production. |

Both modes implement the same `IStorage` interface, so switching is seamless.

### 3. Subscription System

30-day free trial, then ₹499/month subscription. The `user_profiles` table/map tracks subscription status (`trial`, `active`, `expired`).

### 4. Referral Program

Each user gets a unique referral code. Both referrer and referee earn free months when a code is redeemed.

### 5. Authentication

| Mode | When | How |
|---|---|---|
| **Dev auto-login** | No `REPL_ID` set | Clicking "Log In" auto-authenticates as a dev user. No external auth needed. |
| **OpenID Connect** | `REPL_ID` set | Full OIDC flow via Passport.js with token refresh. |

Sessions use `memorystore` (no DB) or `connect-pg-simple` (with PostgreSQL).

### 6. Pre-built Integration Modules

Located in `server/replit_integrations/`. Not all actively wired into main routes:

- **Chat**: Full conversational AI with streaming SSE
- **Audio**: Speech-to-text, text-to-speech, and voice chat
- **Image**: AI image generation
- **Batch**: Rate-limited concurrent processing

### 7. Digital Marketing & SEO

Comprehensive digital marketing infrastructure. See [`docs/digital-marketing.md`](./digital-marketing.md) for full details.

- SEO meta tags, Open Graph tags, Twitter Cards
- Structured data (JSON-LD): Organization, WebApplication, FAQPage schemas
- Dynamic per-page SEO via `useDocumentHead` hook
- robots.txt, dynamic sitemap.xml, PWA manifest
- Google Tag Manager (pre-installed, ready to activate)
- Social sharing: WhatsApp, Twitter/X, Facebook, LinkedIn, Telegram
- Server-side meta injection for social crawlers

### 8. Cybersecurity

Server-side security layer in `server/middleware/security.ts`:

- Helmet (CSP, HSTS, X-Frame-Options, etc.)
- Rate limiting (global, login, AI endpoints)
- CORS policy (open in dev, restricted in prod)
- HTTP Parameter Pollution protection
- Content-Type validation
- Suspicious payload blocking (XSS, SQL injection, path traversal)
- Input sanitization, session hardening, request size limits
- Production error masking

---

## Database Schema

| Table | Purpose |
|---|---|
| `users` | User accounts (id, email, name, profile image) |
| `sessions` | Session storage (PostgreSQL mode only) |
| `problems` | User-submitted problems with AI solutions (title, description, solution, status) |
| `user_profiles` | Subscription tracking, referral codes, trial dates, free months earned |
| `conversations` / `messages` | Chat history for AI conversation integration |

In memory mode, the same data structures are maintained in-memory Maps and arrays.

---

## API Routes

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/login` | Initiate login (auto-login in dev, OIDC in prod) |
| `GET` | `/api/callback` | OIDC callback (redirects to `/` in dev) |
| `GET` | `/api/logout` | Logout |
| `GET` | `/api/auth/user` | Get current user |
| `GET` | `/api/problems` | List user's problems |
| `POST` | `/api/problems` | Create problem (with AI solution) |
| `GET` | `/api/problems/:id` | Get single problem |
| `GET` | `/api/profile` | Get subscription/referral profile |
| `POST` | `/api/profile/referral` | Apply referral code |
| `POST` | `/api/profile/subscribe` | Activate subscription |
| `GET` | `/sitemap.xml` | Dynamic XML sitemap for search engines |

---

## Environment Variables

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `DATABASE_URL` | No | _(empty = in-memory)_ | PostgreSQL connection string. Leave empty for in-memory storage. |
| `SESSION_SECRET` | Prod only | `dev-secret` in dev | Express session encryption |
| `OPENAI_API_KEY` | No | _(empty = mock AI)_ | OpenAI API key (or `ollama` for local Ollama) |
| `OPENAI_MODEL` | No | `gpt-4o-mini` | LLM model name |
| `AI_INTEGRATIONS_OPENAI_BASE_URL` | No | _(OpenAI default)_ | Custom API base URL (e.g. `http://localhost:11434/v1` for Ollama) |
| `REPL_ID` | No | _(empty = dev auth)_ | Replit project ID for OIDC auth |
| `BASE_URL` | No | `https://bharatsolve.ai` | Production domain URL for SEO/sitemap |
| `ALLOWED_ORIGIN` | No | _(all origins in dev)_ | Allowed CORS origin in production |
| `PORT` | No | `3000` | Server port |
| `NODE_ENV` | No | `development` | `development` or `production` |

---

## Architectural Decisions

1. **Monorepo with shared types** -- The `shared/` directory provides type-safe contracts between frontend and backend using Drizzle schemas + Zod.
2. **Single-port architecture** -- Both API and frontend served on one port (Vite middleware in dev, static files in prod).
3. **Storage abstraction** -- An `IStorage` interface allows seamless switching between in-memory and PostgreSQL storage.
4. **Progressive complexity** -- Runs with zero external dependencies (no DB, no API keys, no auth provider). Add PostgreSQL, OpenAI, and OIDC as needed.
5. **Modular integrations** -- Chat, audio, image, and batch modules are self-contained and can be independently enabled.
6. **Defense-in-depth security** -- Multiple overlapping security layers (headers, rate limiting, input validation, sanitization, payload scanning).

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with Vite HMR (loads `.env` automatically) |
| `npm run build` | Build client (Vite) + server (esbuild) to `dist/` |
| `npm start` | Run production build |
| `npm run check` | TypeScript type checking |
| `npm run db:push` | Push Drizzle schema to PostgreSQL |
