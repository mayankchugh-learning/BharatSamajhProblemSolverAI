# BharatSolve AI -- Code Walkthrough

This document is a comprehensive guide to the BharatSolve AI codebase. It explains how a React application works, how the backend API is structured, how data flows between them, and how to debug issues independently.

---

## Table of Contents

1. [How a React Application Works](#1-how-a-react-application-works)
2. [Project Architecture Overview](#2-project-architecture-overview)
3. [Frontend Deep Dive](#3-frontend-deep-dive)
4. [Backend Deep Dive](#4-backend-deep-dive)
5. [Shared Code Layer](#5-shared-code-layer)
6. [Data Flow: End to End](#6-data-flow-end-to-end)
7. [Build System](#7-build-system)
8. [How to Debug Common Issues](#8-how-to-debug-common-issues)
9. [Key Patterns and Conventions](#9-key-patterns-and-conventions)
10. [Glossary](#10-glossary)

---

## 1. How a React Application Works

If you are new to React, this section covers the fundamentals.

### What is React?

React is a JavaScript library for building user interfaces. Instead of writing HTML pages that reload on every action, React creates a **Single Page Application (SPA)** -- one HTML page that dynamically updates its content using JavaScript.

### Core Concepts

#### Components

Everything in React is a **component** -- a reusable piece of UI written as a JavaScript/TypeScript function that returns JSX (HTML-like syntax):

```tsx
function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}!</h1>;
}
```

Components nest inside each other like building blocks:

```tsx
function App() {
  return (
    <div>
      <Greeting name="Mayank" />
      <Greeting name="Priya" />
    </div>
  );
}
```

#### Props

Props are inputs passed to components (like function arguments):

```tsx
// Parent passes data DOWN to child via props
<ProblemCard title="Family Issue" status="solved" />
```

#### State

State is data that changes over time within a component. When state changes, React **re-renders** (redraws) the component:

```tsx
function Counter() {
  const [count, setCount] = useState(0);   // state variable + setter
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}
```

#### Hooks

Hooks are special functions (starting with `use`) that let components use React features:

| Hook | Purpose | Example in this app |
|---|---|---|
| `useState` | Local state | Form inputs, toggle states |
| `useEffect` | Side effects (API calls on mount, subscriptions) | Updating document title |
| `useQuery` | Server data fetching (TanStack Query) | `useProblems()`, `useAuth()` |
| `useMutation` | Server data mutations | `useCreateProblem()`, `useSendMessage()` |

#### The Render Cycle

1. Component function runs, returns JSX
2. React compares new JSX with current DOM (Virtual DOM diffing)
3. Only the changed parts update in the browser
4. When state or props change, the cycle repeats

### How This App Uses React

```
Browser loads index.html
  └─> Loads main.tsx (entry point)
       └─> Renders <App /> component
            └─> QueryClientProvider (provides server-state cache)
                 └─> TooltipProvider (UI tooltips)
                      └─> Router (decides which page to show)
                           ├─> Landing (if not logged in)
                           ├─> Dashboard (if logged in, path = /)
                           └─> ProblemDetail (if logged in, path = /problems/:id)
```

---

## 2. Project Architecture Overview

### The Three Layers

```
┌─────────────────────────────────────┐
│  CLIENT (React SPA)                 │  Browser
│  client/src/                        │
│  - Pages, Components, Hooks         │
│  - Makes HTTP requests to /api/*    │
├─────────────────────────────────────┤
│  SERVER (Express API)               │  Node.js
│  server/                            │
│  - REST endpoints under /api/*      │
│  - AI integration (OpenAI)          │
│  - Auth, security middleware        │
├─────────────────────────────────────┤
│  DATABASE                           │
│  - In-memory Maps (dev)             │  Server memory
│  - PostgreSQL + Drizzle ORM (prod)  │  External DB
└─────────────────────────────────────┘
```

### Single-Port Architecture

Both the React app and the API run on the **same port** (default 3000):

- **Development**: Express serves the API at `/api/*`. Vite serves the React app and handles hot-module replacement (HMR) for instant code updates.
- **Production**: Express serves the API at `/api/*` and the pre-built static files (HTML, JS, CSS) from `dist/public/` for everything else.

### Directory Map

```
BharatSamajhProblemSolverAI/
├── client/src/                 # FRONTEND: What the user sees
│   ├── main.tsx                # Entry: mounts React into the HTML
│   ├── App.tsx                 # Root: routing + providers
│   ├── pages/                  # Full pages (one per route)
│   │   ├── Landing.tsx         # Marketing page (unauthenticated)
│   │   ├── Dashboard.tsx       # Problem list (authenticated)
│   │   ├── ProblemDetail.tsx   # Problem + AI chat (authenticated)
│   │   └── not-found.tsx       # 404 page
│   ├── components/             # Reusable UI pieces
│   │   ├── CreateProblemDialog.tsx
│   │   ├── ProblemCard.tsx
│   │   ├── SubscriptionCard.tsx
│   │   ├── ReferralCard.tsx
│   │   ├── SocialShare.tsx
│   │   ├── Advertisement.tsx
│   │   └── ui/                 # ~40 shadcn/ui primitives (Button, Card, etc.)
│   ├── hooks/                  # Custom React hooks (data fetching logic)
│   │   ├── use-auth.ts         # Login state
│   │   ├── use-problems.ts     # Problem CRUD
│   │   ├── use-discussion.ts   # Chat messages
│   │   ├── use-profile.ts      # Subscription & referral
│   │   ├── use-document-head.ts # Dynamic SEO
│   │   └── use-toast.ts        # Notifications
│   └── lib/                    # Utilities
│       ├── queryClient.ts      # HTTP client + TanStack Query config
│       ├── auth-utils.ts       # Auth error handling
│       └── utils.ts            # cn() classname helper
│
├── server/                     # BACKEND: API + business logic
│   ├── index.ts                # Express app creation, middleware, startup
│   ├── routes.ts               # All API endpoints + AI logic
│   ├── storage.ts              # Data access layer (memory or PostgreSQL)
│   ├── db.ts                   # PostgreSQL connection
│   ├── static.ts               # Production static file serving
│   ├── vite.ts                 # Development Vite middleware
│   └── middleware/
│       └── security.ts         # All security middleware
│
├── shared/                     # SHARED: Types used by both layers
│   ├── schema.ts               # Database tables + validation schemas
│   └── routes.ts               # Typed API contract (paths, input/output schemas)
│
└── script/
    └── build.ts                # Build script (Vite + esbuild)
```

---

## 3. Frontend Deep Dive

### 3.1 Entry Point: `client/src/main.tsx`

This is the first JavaScript that runs. It mounts the React app into the DOM:

```tsx
import { createRoot } from "react-dom/client";
import App from "./App";
createRoot(document.getElementById("root")!).render(<App />);
```

The `#root` div is in `client/index.html`.

### 3.2 Root Component: `client/src/App.tsx`

Sets up three things:
1. **QueryClientProvider** -- Makes TanStack Query available to all components (for data fetching/caching)
2. **TooltipProvider** -- Makes tooltips work across the app
3. **Router** -- Decides which page to show based on the URL and auth state

The routing logic:
- **Not logged in** → Show `Landing` page on `/`, `NotFound` for anything else
- **Logged in** → Show `Dashboard` on `/`, `ProblemDetail` on `/problems/:id`

### 3.3 Pages

#### `Landing.tsx` -- The Marketing Page

Shown to unauthenticated users. Contains:
- Hero section with animated gradients and a "Get Started" button (links to `/api/login`)
- Social proof (cities across India)
- Feature grid (4 features with icons)
- How-it-works (3 steps)
- Use case categories (9 life areas)
- Testimonials (3 user stories)
- Pricing cards (Free trial + Premium)
- FAQ accordion (6 questions)
- Footer with social links

**Key debugging tip**: If the landing page looks broken, check `client/src/index.css` for Tailwind CSS imports and `tailwind.config.ts` for theme configuration.

#### `Dashboard.tsx` -- The Problem List

Shown after login. Contains:
- Header with user avatar and logout button
- Grid of `ProblemCard` components (one per submitted problem)
- `CreateProblemDialog` button to submit new problems
- Sidebar with `SubscriptionCard`, `ReferralCard`, and `Advertisement`

**Data flow**: `useProblems()` hook fetches `GET /api/problems` → renders a `ProblemCard` for each item.

#### `ProblemDetail.tsx` -- Problem View + AI Chat

Displays a single problem and its AI-generated solution, plus a chat interface for follow-up questions.

**Data flow**:
1. `useProblem(id)` fetches `GET /api/problems/:id`
2. `useDiscussionMessages(id)` fetches `GET /api/problems/:id/messages`
3. User types a message → `useSendMessage(id)` calls `POST /api/problems/:id/messages`
4. Server returns both the user message and AI reply → UI updates

### 3.4 Components

#### Business Components

| Component | File | What it does |
|---|---|---|
| `CreateProblemDialog` | `CreateProblemDialog.tsx` | Modal form: title, description, language selector. Uses `react-hook-form` + `zod` validation. Calls `useCreateProblem()`. |
| `ProblemCard` | `ProblemCard.tsx` | Card displaying problem title, description preview, status badge, language, date. Clickable → navigates to `/problems/:id`. |
| `SubscriptionCard` | `SubscriptionCard.tsx` | Shows trial days remaining or "Premium Active" badge. Upgrade button. |
| `ReferralCard` | `ReferralCard.tsx` | Shows user's referral code with copy button. Input field to apply a friend's code. |
| `SocialShare` | `SocialShare.tsx` | Popover with share buttons: WhatsApp, X, Facebook, LinkedIn, Telegram, copy link. Uses Web Share API when available. |
| `Advertisement` | `Advertisement.tsx` | Placeholder ad card. |

#### shadcn/ui Components (`components/ui/`)

These are ~40 pre-built, customizable UI primitives: `Button`, `Card`, `Dialog`, `Input`, `Select`, `Tabs`, `Toast`, etc. They are based on Radix UI (accessible) and styled with Tailwind CSS.

**How to customise them**: Edit the file directly in `client/src/components/ui/`. They are not in `node_modules` -- they are copied into your project for full control.

### 3.5 Hooks (Data Fetching Layer)

Hooks are the bridge between UI components and the server API. They use **TanStack Query** for:
- Automatic caching (don't re-fetch data that's already loaded)
- Background refetching (keep data fresh)
- Loading/error states
- Optimistic updates

#### `use-auth.ts`

```
useAuth() → GET /api/auth/user
Returns: { user, isLoading, isAuthenticated, logout }
```

Every page checks `useAuth()` first. If the user is not authenticated, the app shows the Landing page.

#### `use-problems.ts`

```
useProblems()        → GET /api/problems         → Problem[]
useProblem(id)       → GET /api/problems/:id      → Problem
useCreateProblem()   → POST /api/problems          → Problem (with AI solution)
```

#### `use-discussion.ts`

```
useDiscussionMessages(problemId) → GET /api/problems/:id/messages  → Message[]
useSendMessage(problemId)        → POST /api/problems/:id/messages → { userMessage, aiMessage }
```

The `sendMessage` mutation uses `FormData` (not JSON) to support file uploads alongside text.

#### `use-profile.ts`

```
useProfile()         → GET /api/profile            → UserProfile
useSubmitReferral()  → POST /api/profile/referral   → UserProfile
useSubscribe()       → POST /api/profile/subscribe  → UserProfile
```

### 3.6 Library Utilities

#### `queryClient.ts`

Configures TanStack Query and provides the `apiRequest` helper function:

```tsx
export async function apiRequest(method: string, url: string, body?: any) {
  const res = await fetch(url, { method, headers, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(await res.text());
  return res;
}
```

All hooks use this to make API calls. It handles:
- Setting `Content-Type: application/json`
- Sending credentials (cookies for session auth)
- Throwing on non-2xx responses

#### `auth-utils.ts`

Two helpers:
- `isUnauthorizedError(error)` -- checks if an API error is a 401
- `redirectToLogin()` -- redirects to `/api/login` with a toast notification

#### `utils.ts`

```tsx
export function cn(...inputs) { return twMerge(clsx(inputs)); }
```

Merges Tailwind CSS classes intelligently (avoids class conflicts).

---

## 4. Backend Deep Dive

### 4.1 Server Bootstrap: `server/index.ts`

Execution flow when the server starts:

```
1. Create Express app and HTTP server
2. Apply security middleware (helmet, CORS, rate limiting)
3. Add JSON body parser (1MB limit)
4. Add request logger (logs all /api/* requests with timing)
5. Register all API routes (including auth)
6. Add global error handler
7. Setup Vite (dev) or static file serving (prod)
8. Listen on PORT (default 3000)
```

**The request logger** intercepts `res.json()` to capture response bodies, then logs:
```
2:36:14 AM [express] POST /api/problems 201 in 1240ms :: {"id":1,"title":"..."}
```

This is extremely useful for debugging -- check your terminal output.

### 4.2 API Routes: `server/routes.ts`

All API routes are registered in the `registerRoutes` function. The route paths come from `shared/routes.ts` for type safety.

#### Route Summary

| Method | Path | Handler | Auth Required |
|---|---|---|---|
| GET | `/api/login` | Initiate login flow | No |
| GET | `/api/callback` | OIDC callback | No |
| GET | `/api/logout` | Destroy session | Yes |
| GET | `/api/auth/user` | Current user | No (returns null) |
| GET | `/api/profile` | User profile | Yes |
| POST | `/api/profile/referral` | Apply referral code | Yes |
| POST | `/api/profile/subscribe` | Activate subscription | Yes |
| GET | `/api/problems` | List user's problems | Yes |
| POST | `/api/problems` | Create problem (triggers AI) | Yes |
| GET | `/api/problems/:id` | Get single problem | Yes |
| GET | `/api/problems/:id/messages` | List discussion messages | Yes |
| POST | `/api/problems/:id/messages` | Send message (triggers AI reply) | Yes |
| GET | `/sitemap.xml` | SEO sitemap | No |

#### How Problem Creation Works

```
1. User submits: { title, description, language }
2. Server validates input with Zod schema
3. Server sanitizes input (XSS protection)
4. Server checks subscription status (trial not expired)
5. Server creates problem in storage (status: "pending")
6. Server calls AI (OpenAI / Ollama / Mock) with culturally-tuned prompt
7. Server updates problem with AI solution (status: "solved")
8. Server returns the complete problem to client
```

#### How Discussion Works

```
1. User sends message (text + optional file attachments via FormData)
2. Server saves user message to storage
3. Server builds conversation history (system prompt + original problem + all prior messages)
4. Server calls AI with full context
5. Server saves AI reply to storage
6. Server returns both messages to client
```

#### AI Backend Selection

```typescript
const apiKey = process.env.OPENAI_API_KEY;
// If apiKey exists → use OpenAI SDK (works with Ollama too via base URL override)
// If no apiKey → use mock AI (returns pre-formatted culturally-themed response)
```

The system prompt is language-specific. For example, Hindi responses use Devanagari script, Hinglish uses Romanized Hindi mixed with English.

### 4.3 Storage Layer: `server/storage.ts`

The storage layer uses the **Strategy Pattern** -- an interface (`IStorage`) with two implementations:

```
IStorage (interface)
├── MemoryStorage   → stores data in JavaScript Maps and arrays
└── DatabaseStorage → stores data in PostgreSQL via Drizzle ORM
```

Which one is used depends on `DATABASE_URL`:

```typescript
export const storage: IStorage = isUsingDatabase
  ? new DatabaseStorage()
  : new MemoryStorage();
```

**Every route uses `storage.*` methods**, never raw SQL or direct Map access. This means you can switch between dev (memory) and prod (PostgreSQL) without changing any route code.

#### IStorage Interface

```typescript
interface IStorage {
  // User profiles (subscription, referral)
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  createUserProfile(userId: string): Promise<UserProfile>;
  updateSubscription(userId: string, status: string): Promise<UserProfile>;
  applyReferral(userId: string, code: string): Promise<UserProfile>;

  // Problems
  getProblems(userId: string): Promise<Problem[]>;
  getProblem(id: number): Promise<Problem | undefined>;
  createProblem(userId: string, problem: InsertProblem): Promise<Problem>;
  updateProblemSolution(id: number, solution: string): Promise<Problem>;

  // Discussion messages
  getDiscussionMessages(problemId: number): Promise<DiscussionMessage[]>;
  addDiscussionMessage(problemId: number, role: string, content: string, attachments?: string | null): Promise<DiscussionMessage>;
}
```

### 4.4 Security Middleware: `server/middleware/security.ts`

Applied before any route. Contains:

1. **Helmet** -- sets secure HTTP headers (CSP, HSTS, X-Frame-Options, etc.)
2. **CORS** -- allows all origins in dev, restricts to `ALLOWED_ORIGIN` in prod
3. **Rate Limiting** -- 3 tiers:
   - Global: 200 requests / 15 min
   - Login: 10 requests / 15 min
   - AI endpoints: 10 POST requests / min
4. **HPP** -- prevents HTTP parameter pollution
5. **Content-Type Validation** -- rejects non-JSON bodies on mutation endpoints
6. **Payload Scanning** -- blocks requests containing XSS, SQL injection, or path traversal patterns
7. **Input Sanitization** -- `sanitizeString()` and `sanitizeObject()` strip dangerous characters

### 4.5 Authentication: `server/replit_integrations/auth/`

Two modes:

| Mode | Trigger | How it works |
|---|---|---|
| Dev | No `REPL_ID` env | `GET /api/login` immediately creates a session for user "dev-user" and redirects to `/` |
| Prod | `REPL_ID` set | Full OpenID Connect flow via Passport.js: redirect to identity provider → callback → session |

Sessions are stored in `memorystore` (dev) or PostgreSQL via `connect-pg-simple` (prod).

---

## 5. Shared Code Layer

### `shared/schema.ts` -- Database Schema + Validation

Defines three things simultaneously:
1. **Database tables** (via Drizzle ORM `pgTable`)
2. **Validation schemas** (via `drizzle-zod` → Zod)
3. **TypeScript types** (inferred from both)

```
pgTable("problems", { ... })  →  Drizzle table definition (for queries)
createInsertSchema(problems)   →  Zod schema (for input validation)
typeof problems.$inferSelect   →  TypeScript type (for type safety)
```

This means the database schema, API validation, and TypeScript types are **always in sync**. Change the table definition, and the types and validation update automatically.

### `shared/routes.ts` -- Typed API Contract

Defines every API route with its method, path, input schema, and response schemas:

```typescript
export const api = {
  problems: {
    create: {
      method: 'POST',
      path: '/api/problems',
      input: insertProblemSchema,      // Zod schema for request body
      responses: {
        201: problemSchema,            // Success response type
        400: errorSchemas.validation,  // Validation error
        401: errorSchemas.unauthorized,
      },
    },
    // ...
  },
};
```

Both the frontend hooks and backend routes import from this file, ensuring they agree on API shapes.

---

## 6. Data Flow: End to End

### Example: Creating a Problem

```
USER ACTION: Fills form and clicks "Submit"

FRONTEND:
  1. CreateProblemDialog.tsx → form.handleSubmit() triggers
  2. useCreateProblem() mutation fires
  3. apiRequest("POST", "/api/problems", { title, description, language })
  4. HTTP POST to http://localhost:3000/api/problems

NETWORK:
  → Request hits Express server on port 3000

BACKEND:
  5. Security middleware checks rate limit, validates content-type
  6. isAuthenticated middleware checks session cookie
  7. Route handler in routes.ts receives request
  8. Zod validates request body against insertProblemSchema
  9. sanitizeString() cleans title and description
  10. storage.createProblem() saves to memory/PostgreSQL
  11. getAISolution() calls OpenAI (or returns mock)
  12. storage.updateProblemSolution() saves the AI response
  13. res.status(201).json(updatedProblem)

NETWORK:
  ← JSON response travels back to browser

FRONTEND:
  14. TanStack Query receives response
  15. Cache for "/api/problems" is invalidated (triggers refetch of problem list)
  16. useMutation.onSuccess shows toast notification
  17. React re-renders Dashboard with the new problem card
```

### Example: Loading the Dashboard

```
USER ACTION: Navigates to / (already logged in)

FRONTEND:
  1. App.tsx renders Router
  2. Router calls useAuth() → GET /api/auth/user
  3. User exists → renders Dashboard
  4. Dashboard calls useProblems() → GET /api/problems
  5. Dashboard calls useProfile() → GET /api/profile

  All three requests fire in parallel (TanStack Query).
  Each shows a loading spinner until data arrives.

  6. Data arrives → React renders ProblemCards, SubscriptionCard, etc.
```

---

## 7. Build System

### Development (`npm run dev`)

```
tsx server/index.ts
  └─> Express starts
       ├─> API routes on /api/*
       └─> Vite dev server middleware
            ├─> Serves React app with HMR (instant updates)
            ├─> Processes TypeScript on the fly
            └─> Resolves path aliases (@/, @shared/)
```

**Hot Module Replacement (HMR)**: When you edit a `.tsx` file, only that component re-renders in the browser -- no full page reload. Changes appear in ~100ms.

### Production Build (`npm run build`)

```
script/build.ts
  ├─> viteBuild()
  │    └─> Compiles React app → dist/public/ (HTML, JS, CSS, assets)
  │         - Tree-shakes unused code
  │         - Minifies JavaScript and CSS
  │         - Generates content-hashed filenames for caching
  │
  └─> esbuild()
       └─> Bundles server code → dist/index.cjs
            - CommonJS format (Node.js)
            - Minified
            - Key dependencies bundled (reduces cold start)
            - Other dependencies remain external (from node_modules)
```

### Production Run (`npm start`)

```
node dist/index.cjs
  └─> Express starts
       ├─> API routes on /api/*
       └─> serveStatic() from dist/public/
            ├─> Serves index.html for all non-API routes (SPA routing)
            └─> Injects meta tags for social crawlers (Facebook, Twitter, etc.)
```

---

## 8. How to Debug Common Issues

### Frontend Issues

#### "The page is blank"
1. Open browser DevTools (F12) → Console tab → look for red errors
2. Common causes:
   - Missing import in `App.tsx`
   - Syntax error in a component
   - Failed API call blocking render (check Network tab)

#### "Data is not loading"
1. DevTools → Network tab → filter by `api`
2. Check if the API call is being made
3. Check the response status and body
4. In the terminal where `npm run dev` runs, check the request log
5. Common causes:
   - Not authenticated (401 response)
   - Wrong API path
   - Server not running

#### "Styles look wrong"
1. Check if Tailwind classes are spelled correctly
2. Verify `tailwind.config.ts` includes the file's path in `content`
3. Check for CSS specificity conflicts in `index.css`
4. Try clearing browser cache (Cmd+Shift+R)

#### "Component not updating"
1. Verify state is being set correctly (`useState` setter is async)
2. Check if TanStack Query cache needs invalidation
3. Add `console.log` in the component to see re-render frequency
4. Verify the correct query key is being invalidated

### Backend Issues

#### "API returns 500"
1. Check terminal output -- the error handler logs the full error
2. Common causes:
   - Database connection failed (if using PostgreSQL)
   - OpenAI API error (invalid key, quota exceeded)
   - Missing environment variable

#### "API returns 401"
1. Session expired or cookie not sent
2. Check if `isAuthenticated` middleware is on the route
3. In dev mode, visit `/api/login` to re-authenticate

#### "AI response is empty or generic"
1. Check `OPENAI_API_KEY` in `.env`
2. If using Ollama, verify it's running: `curl http://localhost:11434/api/tags`
3. Check the model name in `OPENAI_MODEL`
4. No key = mock AI (expected behavior in dev)

### Docker Issues

#### "Container won't start"
```bash
docker compose logs app     # Check app logs
docker compose logs db      # Check database logs
```

#### "Database connection refused"
The `app` service depends on `db` being healthy. If `db` fails its healthcheck, `app` won't start. Check PostgreSQL logs.

---

## 9. Key Patterns and Conventions

### Path Aliases

| Alias | Resolves To | Use From |
|---|---|---|
| `@/` | `client/src/` | Frontend code |
| `@shared/` | `shared/` | Both frontend and backend |
| `@assets/` | `attached_assets/` | Vite only |

Example: `import { Button } from "@/components/ui/button"` → `client/src/components/ui/button.tsx`

### File Naming Conventions

| Convention | Example | Used For |
|---|---|---|
| PascalCase | `Dashboard.tsx`, `ProblemCard.tsx` | React components |
| kebab-case | `use-auth.ts`, `query-client.ts` | Hooks, utilities |
| camelCase | `queryClient.ts`, `authUtils.ts` | Library files |

### State Management Strategy

This app does **not** use Redux or Zustand. Instead:

- **Server state** (data from API) → TanStack Query (with automatic caching)
- **Form state** → react-hook-form
- **UI state** (modals, toggles) → local `useState` in each component
- **Auth state** → TanStack Query (cached user object)

This is simpler and sufficient for this app's complexity level.

### Error Handling Pattern

```
Frontend:
  - TanStack Query retries failed requests automatically
  - 401 errors trigger redirect to login
  - Errors show as toast notifications

Backend:
  - Zod validation errors → 400 with field-specific message
  - Auth errors → 401
  - Business logic errors → 400/403 with descriptive message
  - Unexpected errors → 500 (masked in production)
```

---

## 10. Glossary

| Term | Meaning |
|---|---|
| **SPA** | Single Page Application -- one HTML page, dynamic content via JavaScript |
| **JSX/TSX** | JavaScript/TypeScript XML -- HTML-like syntax in React components |
| **Component** | A reusable UI function that returns JSX |
| **Hook** | A function starting with `use` that adds React features to components |
| **Props** | Data passed from parent to child component |
| **State** | Data within a component that triggers re-renders when changed |
| **HMR** | Hot Module Replacement -- instant code updates without full page reload |
| **TanStack Query** | Library for fetching, caching, and synchronizing server data |
| **Drizzle ORM** | TypeScript-first database toolkit (like a type-safe SQL builder) |
| **Zod** | TypeScript-first schema validation library |
| **Tailwind CSS** | Utility-first CSS framework (write styles as class names) |
| **shadcn/ui** | Collection of reusable UI components built on Radix + Tailwind |
| **Radix UI** | Accessible, unstyled UI primitives (used by shadcn/ui) |
| **Express** | Node.js web framework for building APIs |
| **Vite** | Fast frontend build tool with HMR |
| **esbuild** | Extremely fast JavaScript bundler (used for server build) |
| **Middleware** | Functions that run before route handlers (auth, security, logging) |
| **ORM** | Object-Relational Mapping -- interact with databases using code instead of SQL |
| **SSE** | Server-Sent Events -- server pushes data to client over HTTP |
| **CORS** | Cross-Origin Resource Sharing -- controls which domains can call your API |
| **CSP** | Content Security Policy -- controls which resources a page can load |
