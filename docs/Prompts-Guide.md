# Prompts Guide -- Generating Similar AI-Powered Web Applications

This document contains the prompts you can use with AI coding assistants (Cursor, GitHub Copilot, ChatGPT, Claude, etc.) to generate applications similar to BharatSolve AI from scratch.

Use these prompts sequentially or adapt them for your specific use case.

---

## Table of Contents

1. [Project Scaffolding](#1-project-scaffolding)
2. [Database & Schema](#2-database--schema)
3. [Backend API](#3-backend-api)
4. [Frontend UI](#4-frontend-ui)
5. [AI Integration](#5-ai-integration)
6. [Authentication](#6-authentication)
7. [Security](#7-security)
8. [Docker & Deployment](#8-docker--deployment)
9. [Infrastructure (Terraform)](#9-infrastructure-terraform)
10. [SEO & Marketing](#10-seo--marketing)
11. [Full Application Prompt (All-in-One)](#11-full-application-prompt-all-in-one)
12. [Tips for Effective Prompting](#12-tips-for-effective-prompting)

---

## 1. Project Scaffolding

### Prompt: Create the monorepo structure

```
Create a full-stack TypeScript monorepo with the following structure:

- `client/` -- React 18 SPA with Vite, Tailwind CSS, and shadcn/ui
- `server/` -- Express 5 API with TypeScript
- `shared/` -- Shared types and schemas between frontend and backend
- `script/` -- Build scripts

Requirements:
- Single-port architecture (API and frontend served from the same Express server)
- Vite dev server as Express middleware in development
- Static file serving in production
- Path aliases: @/ for client/src, @shared/ for shared/
- TypeScript strict mode throughout
- Build script that uses Vite for client and esbuild for server

Include package.json with scripts: dev, build, start, check
Include tsconfig.json, vite.config.ts, tailwind.config.ts, postcss.config.js
```

### Prompt: Initialize shadcn/ui

```
Set up shadcn/ui in the client/ directory with:
- New York style
- Tailwind CSS variables for theming
- Neutral base color
- Install these components: button, card, dialog, input, select, textarea, toast, tabs, tooltip, popover, badge, separator, scroll-area, form, label, avatar, dropdown-menu, accordion
- Configure component aliases in components.json
```

---

## 2. Database & Schema

### Prompt: Drizzle ORM with dual storage

```
Create a storage layer in shared/schema.ts and server/storage.ts with:

1. Drizzle ORM schema (PostgreSQL) for these tables:
   - users (id, email, first_name, last_name, profile_image)
   - sessions (sid, sess, expire)
   - problems (id, user_id FK, title, description, language, solution, status, created_at)
   - user_profiles (id, user_id FK unique, subscription_status, trial_start_date, referral_code unique, referred_by, free_months_earned)
   - discussion_messages (id, problem_id FK cascade, role, content, attachments, created_at)

2. Zod validation schemas generated from Drizzle tables using drizzle-zod

3. An IStorage interface with methods for CRUD on all entities

4. Two implementations:
   - MemoryStorage (using Maps and arrays, for development)
   - DatabaseStorage (using Drizzle queries, for production)

5. Automatic selection based on DATABASE_URL environment variable

The pattern should use the Strategy design pattern so routes never need to know which storage backend is active.
```

### Prompt: Typed API contract

```
Create a typed API contract in shared/routes.ts that defines all API routes with:
- HTTP method
- Path (with :param placeholders)
- Input schema (Zod)
- Response schemas per status code (200, 400, 401, etc.)
- Error schema types (validation, notFound, unauthorized, forbidden)
- A buildUrl helper function for parameter interpolation

Both the frontend hooks and backend routes should import from this file.
```

---

## 3. Backend API

### Prompt: Express API with routes

```
Create an Express 5 backend (server/) with:

1. server/index.ts:
   - Create Express app and HTTP server
   - Apply security middleware, JSON body parser (1MB limit)
   - Request logger that captures response body and timing for /api/* routes
   - Global error handler (masks errors in production)
   - Vite middleware in dev, static serving in prod
   - Listen on PORT environment variable

2. server/routes.ts:
   - All routes from the API contract (import paths from shared/routes.ts)
   - isAuthenticated middleware on protected routes
   - Input validation using Zod schemas
   - Input sanitization for user-provided strings
   - File upload handling via multer (5 files, 10MB each, image + document MIME types)
   - Static serving for uploaded files

3. server/storage.ts:
   - IStorage interface implementation (see database prompt)

4. server/middleware/security.ts:
   - Helmet with CSP
   - CORS (open in dev, restricted in prod via ALLOWED_ORIGIN)
   - Rate limiting: global (200/15min), login (10/15min), AI endpoints (10/min)
   - HPP protection
   - Content-type validation
   - XSS/SQL injection pattern blocking
   - sanitizeString and sanitizeObject utility functions
```

---

## 4. Frontend UI

### Prompt: Landing page

```
Create a marketing landing page (client/src/pages/Landing.tsx) for an AI-powered problem solver app with Indian cultural theme. Include:

1. Navbar with logo and "Get Started" CTA
2. Animated hero section with gradient background and tagline
3. Social proof section (mention Indian cities)
4. Feature grid (4 features with Lucide icons)
5. How-it-works section (3 numbered steps)
6. Use case categories grid (9 life areas: family, career, relationships, finance, health, legal, community, student, elder care)
7. Testimonials section (3 cards with Indian names)
8. Pricing cards (Free Trial + Premium with INR pricing)
9. FAQ accordion (6 common questions)
10. CTA section
11. Footer with social links

Use Tailwind CSS with saffron/green/blue theme inspired by the Indian flag.
Use Framer Motion for entrance animations.
Use shadcn/ui components (Button, Card, Accordion, Badge).
```

### Prompt: Dashboard page

```
Create an authenticated dashboard page (client/src/pages/Dashboard.tsx) with:

1. Header: user avatar, name, logout button
2. Main area: grid of ProblemCard components showing user's problems
3. Floating action button to create a new problem (opens CreateProblemDialog)
4. Sidebar:
   - SubscriptionCard (shows trial days or premium status)
   - ReferralCard (show/copy referral code, input to apply friend's code)
   - Advertisement card

Use responsive grid: 2 columns on desktop, 1 on mobile.
Sidebar collapses below the main content on mobile.
```

### Prompt: Problem detail with AI chat

```
Create a problem detail page (client/src/pages/ProblemDetail.tsx) with:

1. Header: back button, problem title, status badge, language label, social share button
2. Original problem section (title + description)
3. AI solution section (rendered markdown)
4. Discussion section:
   - Chat-style message bubbles (user right, AI left)
   - File/image attachments display
   - "AI is thinking" loading indicator
   - Auto-scroll to latest message
5. Message input:
   - Text input
   - Attachment buttons (camera for mobile, file picker)
   - Send button
   - Show selected files as chips before sending

The message input should use FormData for multipart upload.
```

### Prompt: React hooks for data fetching

```
Create custom React hooks using TanStack React Query for:

1. use-auth.ts: GET /api/auth/user → { user, isLoading, isAuthenticated, logout }
2. use-problems.ts:
   - useProblems() → GET /api/problems → Problem[]
   - useProblem(id) → GET /api/problems/:id → Problem
   - useCreateProblem() → POST /api/problems (mutation with cache invalidation)
3. use-discussion.ts:
   - useDiscussionMessages(problemId) → GET /api/problems/:id/messages → Message[]
   - useSendMessage(problemId) → POST /api/problems/:id/messages (FormData mutation)
4. use-profile.ts:
   - useProfile() → GET /api/profile → UserProfile
   - useSubmitReferral() → POST /api/profile/referral
   - useSubscribe() → POST /api/profile/subscribe

Also create lib/queryClient.ts with:
- apiRequest helper function for fetch with error handling
- Default query function with credentials included
- 401 error detection and redirect to login
```

---

## 5. AI Integration

### Prompt: OpenAI integration with cultural tuning

```
Add AI integration to server/routes.ts:

1. Initialize OpenAI SDK with fallback:
   - If OPENAI_API_KEY exists → use OpenAI (supports custom BASE_URL for Ollama)
   - If no key → use mock AI that returns pre-formatted themed responses

2. Create a culturally-tuned system prompt:
   - "You are an empathetic Indian expert problem solver"
   - Understands cultural nuances, family dynamics, social context
   - Provides actionable, emotionally resonant solutions
   - Respects Indian values while being modern and practical

3. Support multi-language responses:
   - Language-specific system prompts
   - Hinglish: Romanized Hindi mixed with English
   - Other languages: respond entirely in native script
   - Support: English, Hindi, Hinglish, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia

4. Discussion context: when generating follow-up replies, include the original problem, solution, and all prior messages in the conversation history.

5. Mock AI responses for dev mode (no API key needed):
   - Formatted with markdown headers, bullet points, Indian proverbs
   - Available in English, Hindi, Hinglish, Tamil
```

---

## 6. Authentication

### Prompt: Dual-mode authentication

```
Create an authentication system in server/replit_integrations/auth/ with:

1. Development mode (no REPL_ID):
   - GET /api/login auto-creates a session for a "dev-user" and redirects to /
   - No external auth provider needed
   - Perfect for local development

2. Production mode (REPL_ID set):
   - OpenID Connect via Passport.js
   - GET /api/login redirects to identity provider
   - GET /api/callback handles the OIDC response
   - Token refresh handling

3. Session management:
   - express-session with HTTP-only cookies
   - memorystore (dev) or connect-pg-simple (prod)
   - Configurable SESSION_SECRET

4. Middleware:
   - isAuthenticated: returns 401 if no session
   - User object available on req.user with claims (sub, email, first_name, profile_image)
```

---

## 7. Security

### Prompt: Comprehensive security middleware

```
Create server/middleware/security.ts with production-grade security:

1. Helmet: CSP with script-src and style-src nonces, HSTS in production, X-Frame-Options DENY
2. CORS: allow all origins in development, restrict to ALLOWED_ORIGIN in production
3. Rate limiting with three tiers:
   - Global: 200 requests per 15 minutes
   - Login endpoints: 10 requests per 15 minutes
   - AI/mutation endpoints: 10 requests per minute
4. HTTP parameter pollution protection
5. Content-Type validation on mutation endpoints (reject non-JSON/form bodies)
6. Request body scanning for:
   - XSS patterns (<script, javascript:, onerror=, etc.)
   - SQL injection patterns (UNION SELECT, DROP TABLE, etc.)
   - Path traversal patterns (../, /etc/passwd, etc.)
7. sanitizeString() function that strips HTML tags and dangerous characters
8. sanitizeObject() that recursively sanitizes all string values in an object
9. Request size limits (1MB for JSON bodies)
10. Production error masking (generic 500 messages)
```

---

## 8. Docker & Deployment

### Prompt: Multi-stage Dockerfile

```
Create a multi-stage Dockerfile for a Node.js 20 application:

Stage 1 (deps): Install npm dependencies with npm ci
Stage 2 (builder): Copy source, run build
Stage 3 (runner): Alpine-based production image with:
  - Non-root user
  - Only dist/, node_modules/, and package.json copied
  - Uploads directory with correct permissions
  - Health check using wget
  - PORT 3000 exposed
  - CMD: node dist/index.cjs

Also create a .dockerignore excluding node_modules, dist, .git, .env, docs, etc.
```

### Prompt: Docker Compose with PostgreSQL

```
Create docker-compose.yml with:

1. PostgreSQL 16 service:
   - Named volume for data persistence
   - Health check with pg_isready
   - Configurable password via environment variable

2. Application service:
   - Builds from Dockerfile
   - Depends on healthy db
   - Environment variables for DATABASE_URL (pointing to db service), SESSION_SECRET, OPENAI_API_KEY, etc.
   - Named volume for uploads
   - Port mapping

3. Migration service (optional profile):
   - Runs drizzle-kit push once
   - Depends on healthy db
   - Exits after completion
```

---

## 9. Infrastructure (Terraform)

### Prompt: AWS ECS Fargate infrastructure

```
Create Terraform scripts (infrastructure/) for deploying to AWS:

1. VPC with 2 availability zones:
   - 2 public subnets (for ALB)
   - 2 private subnets (for ECS + RDS)
   - Internet gateway, NAT gateway (single for cost savings)
   - Route tables

2. ECS Fargate:
   - ECR repository with lifecycle policy
   - ECS cluster with Container Insights
   - Task definition with environment variables from Secrets Manager
   - Service with deployment circuit breaker and rollback
   - Autoscaling: CPU target 70%, memory target 80%, min 2, max 10 tasks

3. Application Load Balancer:
   - HTTPS listener (port 443) with TLS 1.3
   - HTTP listener (port 80) redirecting to HTTPS
   - Target group with health check on /api/auth/user
   - Deregistration delay 30s

4. RDS PostgreSQL 16:
   - db.t3.micro (minimum for resilience)
   - 20GB storage with auto-scaling to 40GB
   - Encrypted storage
   - 7-day backup retention
   - Final snapshot on deletion
   - Deletion protection enabled

5. Security groups:
   - ALB: allow 80/443 from internet
   - ECS: allow container port from ALB only
   - RDS: allow 5432 from ECS only

6. Secrets Manager for DATABASE_URL, SESSION_SECRET, OPENAI_API_KEY

7. Variables file with sensible defaults for cost-effective resilience

Use ap-south-1 (Mumbai) as the default region.
Include terraform.tfvars.example and environment-specific .tfvars files.
```

---

## 10. SEO & Marketing

### Prompt: SEO infrastructure

```
Add comprehensive SEO to the React SPA:

1. client/index.html:
   - Meta tags: title, description, keywords (Indian context)
   - Open Graph tags (og:title, og:description, og:image, og:url)
   - Twitter Card tags (twitter:card, twitter:site, twitter:image)
   - JSON-LD structured data: Organization, WebApplication, FAQPage schemas
   - Google Tag Manager snippet (container ID as a comment to fill in)
   - Canonical URL

2. client/public/:
   - robots.txt allowing all crawlers, linking to sitemap
   - manifest.json for PWA installability (with Indian-themed colors)

3. client/src/hooks/use-document-head.ts:
   - Hook that dynamically updates: title, meta description, canonical, OG tags, Twitter tags, noindex flag
   - Call from each page with page-specific SEO data

4. server/routes.ts:
   - GET /sitemap.xml returning dynamic XML sitemap

5. server/static.ts:
   - Detect social media crawlers by User-Agent
   - Inject appropriate meta tags into HTML for crawlers
   - This ensures link previews work even though the app is an SPA
```

---

## 11. Full Application Prompt (All-in-One)

Use this single prompt if you want to generate the entire application at once:

```
Build a full-stack AI-powered life problem solver web application for Indian users.

TECH STACK:
- Frontend: React 18, TypeScript, Vite 7, Wouter (routing), TanStack React Query, shadcn/ui + Radix UI + Tailwind CSS, Framer Motion
- Backend: Node.js 20, Express 5, TypeScript
- Database: In-memory (dev) or PostgreSQL with Drizzle ORM (prod)
- AI: OpenAI SDK (configurable), Ollama support, mock AI fallback
- Auth: Dev auto-login (local) or OpenID Connect (prod)
- Build: Vite (client) + esbuild (server)

ARCHITECTURE:
- Monorepo: client/, server/, shared/
- Single-port: API and frontend on one Express server
- Storage abstraction: IStorage interface with Memory and Database implementations
- Typed API contract in shared/routes.ts

FEATURES:
1. AI problem solving: users submit problems (title, description, language). AI generates culturally-aware solutions understanding Indian values, family dynamics, social context. Support 12 Indian languages.
2. Follow-up discussion: chat interface with full conversation context, file attachments (images + documents, 5 files, 10MB each).
3. Subscription: 30-day free trial, then Rs. 499/month premium.
4. Referral program: 8-char codes, both parties earn 1 free month.
5. Authentication: dev auto-login (no setup) or OIDC (production).
6. Security: Helmet, CORS, rate limiting, XSS/SQLi blocking, input sanitization.
7. SEO: meta tags, OG, Twitter Cards, JSON-LD, dynamic sitemap, PWA manifest, crawler meta injection.
8. Social sharing: WhatsApp, X, Facebook, LinkedIn, Telegram, copy link, Web Share API.

PAGES:
- Landing: marketing page with hero, features, how-it-works, use cases, testimonials, pricing, FAQ
- Dashboard: problem list grid, create dialog, subscription card, referral card
- ProblemDetail: problem view, AI solution, chat-style discussion with attachments

THEME:
- Indian flag inspired: saffron, green, blue
- Cultural greetings ("Namaste")
- Indian proverbs in AI responses

DEPLOYMENT:
- Dockerfile (multi-stage, non-root user, health check)
- docker-compose.yml (app + PostgreSQL + migration)
- Terraform for AWS (ECS Fargate, ALB, RDS, autoscaling)

Include all config files: package.json, tsconfig.json, vite.config.ts, tailwind.config.ts, drizzle.config.ts, .dockerignore, .gitignore
```

---

## 12. Tips for Effective Prompting

### Be Specific About Tech Choices

Instead of "add a database", say "add PostgreSQL with Drizzle ORM, using pgTable definitions with serial primary keys, and create both MemoryStorage and DatabaseStorage implementations of an IStorage interface."

### Specify the File Paths

Always tell the AI where to create files: "Create `server/middleware/security.ts`" is better than "add security middleware."

### Include Error Handling

Explicitly ask for error handling: "Include Zod validation errors returning 400, authentication errors returning 401, and generic 500 errors masked in production."

### Ask for Both Dev and Prod Modes

"Make it work with zero configuration in development (no database, no API keys, no auth provider) but support PostgreSQL, OpenAI, and OIDC in production via environment variables."

### Reference Patterns

"Use the Strategy pattern for storage" or "Use TanStack Query mutations with cache invalidation" gives the AI a clear design direction.

### Iterate in Layers

1. Start with project scaffolding and config
2. Add database schema and storage layer
3. Build API routes
4. Create frontend pages and components
5. Add AI integration
6. Layer on security
7. Add Docker and infrastructure

Each layer builds on the previous one. This is more reliable than generating everything at once.

### Provide Examples of Desired Output

When asking for UI, describe the visual layout: "Two-column grid on desktop with problem cards on the left (taking 2/3 width) and a sidebar on the right (1/3 width) containing subscription and referral cards."

### Ask for Culturalization

For India-focused apps: "Include Indian language support (Hindi, Tamil, Telugu, Bengali, etc.), use INR for pricing, reference Indian cultural context, and design the system prompt to understand joint family dynamics, arranged marriage, and Indian social hierarchy."
