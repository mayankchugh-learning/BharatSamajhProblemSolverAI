# replit.md

## Overview

BharatSolve AI is a full-stack web application that helps users solve life challenges using AI-powered advice, branded with an Indian cultural theme. Users submit problems, and the app generates AI solutions using OpenAI (via Replit AI Integrations). The app includes a subscription/trial system, a referral program, and authentication via Replit Auth (OpenID Connect).

The app is named "BharatSolve" in the UI, with a saffron/green/blue color palette inspired by Indian culture.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend

- **Framework**: React 18 with TypeScript, bundled by Vite
- **Routing**: Wouter (lightweight client-side router)
- **State Management**: TanStack React Query for server state; no separate client state library
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives, styled with Tailwind CSS
- **Forms**: react-hook-form with Zod validation via @hookform/resolvers
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Inter (body), Outfit (headings) via Google Fonts
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

The frontend has two main views:
1. **Landing page** — marketing/login page for unauthenticated users
2. **Dashboard** — authenticated view showing problems list, subscription status, referral card, and ad component

### Backend

- **Runtime**: Node.js with Express
- **Language**: TypeScript, executed via `tsx` in development
- **Build**: Custom build script using Vite (client) + esbuild (server) outputting to `dist/`
- **API Pattern**: RESTful JSON API under `/api/` prefix
- **API Contract**: Shared route definitions in `shared/routes.ts` with Zod schemas for input validation and response typing
- **AI Integration**: OpenAI SDK configured with Replit AI Integrations environment variables (`AI_INTEGRATIONS_OPENAI_API_KEY`, `AI_INTEGRATIONS_OPENAI_BASE_URL`)

### Replit Integrations (server/replit_integrations/)

Pre-built modules that provide:
- **Auth** (`auth/`): Replit Auth via OpenID Connect with Passport.js, session storage in PostgreSQL
- **Chat** (`chat/`): Conversation/message CRUD with OpenAI streaming
- **Audio** (`audio/`): Voice recording, speech-to-text, text-to-speech with OpenAI
- **Image** (`image/`): Image generation with gpt-image-1
- **Batch** (`batch/`): Rate-limited batch processing utility

These are support modules — not all are actively used in the main app routes.

### Database

- **Database**: PostgreSQL (required, via `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with `drizzle-zod` for schema-to-Zod conversion
- **Schema location**: `shared/schema.ts` (main tables) and `shared/models/` (auth and chat tables)
- **Migrations**: Drizzle Kit with `drizzle-kit push` command (`npm run db:push`)

**Key tables:**
- `users` — User accounts (required for Replit Auth)
- `sessions` — Session storage (required for Replit Auth, used by connect-pg-simple)
- `problems` — User-submitted problems with AI solutions (title, description, solution, status)
- `user_profiles` — Subscription tracking, referral codes, trial dates
- `conversations` / `messages` — Chat history (for AI chat integration)

### Authentication

- Replit Auth using OpenID Connect (OIDC)
- Sessions stored in PostgreSQL via `connect-pg-simple`
- `SESSION_SECRET` environment variable required
- Auth middleware: `isAuthenticated` guard on protected routes
- Client checks auth state via `/api/auth/user` endpoint

### Development vs Production

- **Dev**: `tsx server/index.ts` with Vite dev server middleware (HMR via `/vite-hmr`)
- **Prod**: `node dist/index.cjs` serving pre-built static files from `dist/public/`
- Vite is only loaded in development (conditional import in server/index.ts)

### Shared Code (shared/)

The `shared/` directory contains code used by both frontend and backend:
- `schema.ts` — Drizzle table definitions and Zod schemas
- `routes.ts` — API route contracts (paths, methods, input/output schemas)
- `models/auth.ts` — User and session table definitions
- `models/chat.ts` — Conversation and message table definitions

A `buildUrl` helper from `shared/routes.ts` handles URL parameter substitution.

## External Dependencies

- **PostgreSQL**: Primary database, must be provisioned with `DATABASE_URL` environment variable
- **OpenAI API** (via Replit AI Integrations): Used for problem-solving AI responses. Configured via `AI_INTEGRATIONS_OPENAI_API_KEY` and `AI_INTEGRATIONS_OPENAI_BASE_URL`
- **Replit Auth (OIDC)**: Authentication provider. Uses `ISSUER_URL` (defaults to `https://replit.com/oidc`) and `REPL_ID`
- **Session Secret**: `SESSION_SECRET` environment variable for Express session encryption
- **Google Fonts**: Inter and Outfit fonts loaded via CDN in index.html