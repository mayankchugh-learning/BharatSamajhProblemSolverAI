# BharatSolve AI - Development Setup Guide

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Node.js | v20+ | Tested with v20.20.0. Install via `brew install node@20` on macOS. |
| npm | v10+ | Ships with Node.js |
| PostgreSQL | 14+ | **Optional** -- only needed for persistent storage. App runs fully in-memory without it. |

---

## Quick Start (Zero External Dependencies)

The app runs out of the box with **no database, no API keys, and no auth provider**:

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Open **http://localhost:3000** in your browser. Click **"Get Started"** to auto-login as a dev user.

---

## Environment Variables

The `.env` file in the project root is loaded automatically by the dev script. Here is the default configuration:

```env
# ── BharatSolve AI — Local Development ──

# Leave DATABASE_URL empty to use in-memory storage.
# Set it to a PostgreSQL connection string to use PostgreSQL.
# DATABASE_URL=postgresql://user:password@localhost:5432/bharatsolve

# Session encryption secret (any random string)
SESSION_SECRET=local-dev-secret-change-me

# OpenAI API key (optional — mock AI is used when not set)
# Get yours at https://platform.openai.com/api-keys
# OPENAI_API_KEY=sk-...

# OpenAI model to use (default: gpt-4o-mini)
# OPENAI_MODEL=gpt-4o-mini

# Or use Ollama locally (free, open-source):
# 1. Install Ollama: https://ollama.com
# 2. Run: ollama pull llama3.2
# 3. Uncomment below:
# OPENAI_API_KEY=ollama
# AI_INTEGRATIONS_OPENAI_BASE_URL=http://localhost:11434/v1
# OPENAI_MODEL=llama3.2

# Server port (5000 is taken by macOS AirPlay Receiver)
PORT=3000
```

> The `dev` script loads `.env` automatically via `tsx --env-file=.env`.

---

## How the Modes Work

### Storage

| `DATABASE_URL` | Storage Mode | Behavior |
|---|---|---|
| Not set / empty | **In-memory** | Data lives in server memory. Resets on restart. |
| Set to PostgreSQL URL | **PostgreSQL** | Persistent storage via Drizzle ORM. Run `npm run db:push` first. |

### Authentication

| `REPL_ID` | Auth Mode | Behavior |
|---|---|---|
| Not set / empty | **Dev auto-login** | Clicking "Log In" instantly authenticates as a dev user. |
| Set | **OpenID Connect** | Full OIDC flow via Replit Auth (Passport.js). |

### AI

| `OPENAI_API_KEY` | AI Mode | Behavior |
|---|---|---|
| Not set / empty | **Mock AI** | Returns a pre-formatted test response with Indian cultural theme. |
| Set to valid key | **OpenAI** | Calls OpenAI API with the model specified in `OPENAI_MODEL`. |
| Set to `ollama` | **Ollama** | Calls local Ollama server. Set `AI_INTEGRATIONS_OPENAI_BASE_URL=http://localhost:11434/v1`. |

---

## Database Setup (Optional)

Only needed if you want persistent storage:

1. Install PostgreSQL (e.g. `brew install postgresql@16` on macOS).
2. Start the service: `brew services start postgresql@16`
3. Create a database: `createdb bharatsolve`
4. Set the connection string in `.env`:
   ```
   DATABASE_URL=postgresql://localhost:5432/bharatsolve
   ```
5. Push the schema:
   ```bash
   npm run db:push
   ```

---

## Running the Dev Server

```bash
npm run dev
```

This starts the Express server with Vite HMR on the configured port (default `3000`). Both the API and the React client are served from a single port.

Console output will show:
```
[auth] Running in DEV mode — auto-login via /api/login
2:36:14 AM [express] serving on port 3000
```

---

## Building for Production

```bash
npm run build    # Compiles client (Vite) + server (esbuild) to dist/
npm start        # Runs the production build
```

For production, ensure these are set:
- `DATABASE_URL` -- PostgreSQL connection string
- `SESSION_SECRET` -- a strong random secret
- `OPENAI_API_KEY` -- valid OpenAI key
- `NODE_ENV=production`

---

## Type Checking

```bash
npm run check    # Runs tsc with noEmit
```

---

## Using Ollama (Free Local LLM)

1. Install Ollama from https://ollama.com
2. Pull a model:
   ```bash
   ollama pull llama3.2
   ```
3. Update `.env`:
   ```env
   OPENAI_API_KEY=ollama
   AI_INTEGRATIONS_OPENAI_BASE_URL=http://localhost:11434/v1
   OPENAI_MODEL=llama3.2
   ```
4. Restart the dev server.

---

## Troubleshooting

### `EADDRINUSE: address already in use 0.0.0.0:<port>`

Another process is occupying the port. On macOS, port 5000 is used by AirPlay Receiver. Either:

- Use port 3000 (default in `.env`), or
- Find and kill the process:
  ```bash
  lsof -ti:<PORT>
  kill -9 <PID>
  ```

### Node.js not found after installation

If you installed via `brew install node@20`, add it to your PATH:

```bash
export PATH="/usr/local/opt/node@20/bin:$PATH"
```

This is added to `~/.profile`, `~/.bash_profile`, and `~/.zshrc` automatically during setup. Restart your terminal if needed.

### Database Connection Failures

- Verify PostgreSQL is running: `pg_isready`
- Check `DATABASE_URL` format: `postgresql://user:password@host:5432/dbname`
- Ensure the target database exists: `createdb bharatsolve`

### OpenAI API Errors

- Confirm `OPENAI_API_KEY` is set and valid.
- If using a custom base URL, confirm `AI_INTEGRATIONS_OPENAI_BASE_URL` is correct.
- Check the model name in `OPENAI_MODEL` is available on your API plan.

---

## Security Middleware

The server applies the following out of the box (see `server/middleware/security.ts`):

| Feature | Detail |
|---|---|
| Helmet | CSP, HSTS (prod), X-Content-Type-Options, etc. |
| CORS | Open in dev; restricted to `ALLOWED_ORIGIN` in prod |
| Rate Limiting | 200 req/15 min global; 10 req/15 min on login; 10 POST/min on problems |
| HPP | HTTP parameter pollution protection |
| Payload Filtering | Blocks XSS, SQL injection, and path traversal patterns |
| Content-Type Validation | Rejects non-JSON/form bodies on mutation API endpoints |

---

## Project Path Aliases

Configured in `tsconfig.json` and `vite.config.ts`:

| Alias | Resolves To |
|---|---|
| `@/*` | `client/src/*` |
| `@shared/*` | `shared/*` |
| `@assets/*` | `attached_assets/*` (Vite only) |

---

## Scripts Reference

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with Vite HMR (loads `.env`) |
| `npm run build` | Build client (Vite) + server (esbuild) to `dist/` |
| `npm start` | Run production build |
| `npm run check` | TypeScript type checking |
| `npm run db:push` | Push Drizzle schema to PostgreSQL |
