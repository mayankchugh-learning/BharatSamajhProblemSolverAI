# BharatSolve AI

AI-powered life problem solver for Indian users. Helps people navigate real-life challenges -- family dynamics, career decisions, relationships, social situations -- using culturally-aware AI that understands Indian values, joint family dynamics, and social norms.

Supports **12 Indian languages**: English, Hindi, Hinglish, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi, and Odia.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite 7, Wouter, TanStack Query, shadcn/ui, Tailwind CSS, Framer Motion |
| Backend | Node.js 20, Express 5, TypeScript |
| Database | In-memory (dev) or PostgreSQL + Drizzle ORM (production) |
| AI | OpenAI SDK, Ollama (local), or mock AI (zero-config dev) |
| Auth | Dev auto-login (local) or OpenID Connect via Passport.js |
| Security | Helmet, CORS, rate limiting, XSS/SQLi blocking, input sanitization |

---

## Quick Start (Local Development)

The app runs out of the box with **no database, no API keys, and no auth provider**.

### Prerequisites

- Node.js v20+ (`brew install node@20` on macOS)
- npm v10+ (ships with Node.js)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-org/BharatSamajhProblemSolverAI.git
cd BharatSamajhProblemSolverAI

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env    # or create .env manually (see Environment Variables below)

# 4. Start the development server
npm run dev
```

Open **http://localhost:3000**. Click **"Get Started"** to auto-login as a dev user.

---

## Environment Variables

Create a `.env` file in the project root:

```env
# Leave empty for in-memory storage; set for PostgreSQL persistence
# DATABASE_URL=postgresql://user:password@localhost:5432/bharatsolve

# Session encryption secret (any random string; required in production)
SESSION_SECRET=local-dev-secret-change-me

# OpenAI API key (optional -- mock AI runs without it)
# OPENAI_API_KEY=sk-...

# OpenAI model (default: gpt-4o-mini)
# OPENAI_MODEL=gpt-4o-mini

# For Ollama (free local LLM):
# OPENAI_API_KEY=ollama
# AI_INTEGRATIONS_OPENAI_BASE_URL=http://localhost:11434/v1
# OPENAI_MODEL=llama3.2

# Server port
PORT=3000

# Production settings
# BASE_URL=https://bharatsolve.ai
# ALLOWED_ORIGIN=https://bharatsolve.ai
```

### Mode Matrix

| Variable | Value | Behavior |
|---|---|---|
| `DATABASE_URL` | Empty | In-memory storage (resets on restart) |
| `DATABASE_URL` | PostgreSQL URL | Persistent database via Drizzle ORM |
| `OPENAI_API_KEY` | Empty | Mock AI responses (cultural theme) |
| `OPENAI_API_KEY` | Valid key | OpenAI API calls |
| `OPENAI_API_KEY` | `ollama` | Local Ollama server |
| `REPL_ID` | Empty | Dev auto-login |
| `REPL_ID` | Set | OpenID Connect (Passport.js) |

---

## NPM Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with Vite HMR (auto-loads `.env`) |
| `npm run build` | Build client (Vite) + server (esbuild) to `dist/` |
| `npm start` | Run the production build |
| `npm run check` | TypeScript type-checking |
| `npm run db:push` | Push Drizzle schema to PostgreSQL |

---

## Docker Deployment

### Quick Start with Docker Compose

```bash
# 1. Set environment variables
export POSTGRES_PASSWORD=your-secure-password
export SESSION_SECRET=$(openssl rand -hex 32)
export OPENAI_API_KEY=sk-your-key-here

# 2. Start everything (app + PostgreSQL)
docker compose up -d

# 3. Run database migration (first time only)
docker compose --profile migrate run --rm migrate

# 4. Verify
curl http://localhost:3000
```

### Build and Run Standalone

```bash
# Build the image
docker build -t bharatsolve-ai .

# Run (with external PostgreSQL)
docker run -d \
  --name bharatsolve \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL=postgresql://user:pass@host:5432/bharatsolve \
  -e SESSION_SECRET=your-secret \
  -e OPENAI_API_KEY=sk-your-key \
  bharatsolve-ai
```

### Docker Compose Services

| Service | Purpose | Port |
|---|---|---|
| `app` | BharatSolve AI application | 3000 |
| `db` | PostgreSQL 16 database | 5432 |
| `migrate` | One-time schema migration | -- |

---

## PostgreSQL Setup (Without Docker)

```bash
# Install
brew install postgresql@16

# Start the service
brew services start postgresql@16

# Create database
createdb bharatsolve

# Update .env
# DATABASE_URL=postgresql://localhost:5432/bharatsolve

# Push schema
npm run db:push
```

---

## Using Ollama (Free Local LLM)

```bash
# 1. Install Ollama
# macOS: brew install ollama   OR   https://ollama.com

# 2. Pull a model
ollama pull llama3.2

# 3. Update .env
# OPENAI_API_KEY=ollama
# AI_INTEGRATIONS_OPENAI_BASE_URL=http://localhost:11434/v1
# OPENAI_MODEL=llama3.2

# 4. Restart dev server
npm run dev
```

---

## Production Deployment

### Pre-flight Checklist

- [ ] PostgreSQL database provisioned and `DATABASE_URL` set
- [ ] Strong `SESSION_SECRET` generated (`openssl rand -hex 32`)
- [ ] `OPENAI_API_KEY` set to a valid key
- [ ] `NODE_ENV=production`
- [ ] `BASE_URL` set to your domain
- [ ] `ALLOWED_ORIGIN` set for CORS
- [ ] SSL/TLS termination configured (via reverse proxy or load balancer)
- [ ] Drizzle schema pushed (`npm run db:push` or via migration container)

### Deploy with Docker Compose (Recommended)

```bash
# On your server
git clone <repo-url>
cd BharatSamajhProblemSolverAI

# Create production .env
cat > .env << 'EOF'
POSTGRES_PASSWORD=<strong-password>
SESSION_SECRET=<openssl-rand-hex-32>
OPENAI_API_KEY=sk-<your-key>
OPENAI_MODEL=gpt-4o-mini
BASE_URL=https://yourdomain.com
ALLOWED_ORIGIN=https://yourdomain.com
PORT=3000
EOF

# Start
docker compose up -d
docker compose --profile migrate run --rm migrate
```

### Deploy to AWS (Terraform)

See the `infrastructure/` directory for Terraform scripts that provision:
- VPC with public/private subnets
- ECS Fargate cluster with autoscaling
- Application Load Balancer with SSL
- RDS PostgreSQL
- Secrets Manager for environment variables

See `infrastructure/README.md` for detailed instructions.

---

## Project Structure

```
BharatSamajhProblemSolverAI/
├── client/                     # React SPA (frontend)
│   ├── index.html              # Entry HTML with SEO meta
│   ├── public/                 # Static assets (favicon, manifest, robots.txt)
│   └── src/
│       ├── App.tsx             # Root component + routing
│       ├── pages/              # Landing, Dashboard, ProblemDetail, 404
│       ├── components/         # Business components + 40 shadcn/ui primitives
│       ├── hooks/              # Auth, problems, discussion, SEO hooks
│       └── lib/                # Query client, auth utilities
├── server/                     # Express API (backend)
│   ├── index.ts                # Server bootstrap
│   ├── routes.ts               # API routes + AI integration
│   ├── storage.ts              # IStorage interface (memory + PostgreSQL)
│   ├── middleware/security.ts  # Security middleware stack
│   └── replit_integrations/    # Auth, chat, audio, image, batch modules
├── shared/                     # Shared types (frontend + backend)
│   ├── schema.ts               # Drizzle tables + Zod schemas
│   └── routes.ts               # Typed API contract
├── infrastructure/             # Terraform IaC for AWS deployment
├── docs/                       # Documentation
├── Dockerfile                  # Multi-stage production build
├── docker-compose.yml          # Full-stack with PostgreSQL
└── [config files]              # package.json, tsconfig, vite, tailwind, etc.
```

---

## Documentation

| Document | Description |
|---|---|
| [Code-Walkthrough.md](./docs/Code-Walkthrough.md) | Detailed guide to the codebase -- how React works, component architecture, data flow |
| [Functionality.md](./docs/Functionality.md) | Complete feature documentation with user flows |
| [Prompts-Guide.md](./docs/Prompts-Guide.md) | AI prompts for generating similar applications |
| [project-overview.md](./docs/project-overview.md) | Architecture reference, DB schema, API routes |
| [setup-guide.md](./docs/setup-guide.md) | Local development setup instructions |
| [digital-marketing.md](./docs/digital-marketing.md) | SEO, analytics, social sharing guide |
| [infrastructure/README.md](./infrastructure/README.md) | AWS Terraform deployment guide |

---

## Troubleshooting

### Port already in use
```bash
lsof -ti:3000 | xargs kill -9
```

### Database connection failures
```bash
pg_isready                                    # Check PostgreSQL is running
createdb bharatsolve                          # Ensure database exists
npm run db:push                               # Push schema
```

### OpenAI API errors
- Verify `OPENAI_API_KEY` is valid
- Check model availability: `OPENAI_MODEL`
- For Ollama: ensure `AI_INTEGRATIONS_OPENAI_BASE_URL=http://localhost:11434/v1`

### Docker issues
```bash
docker compose logs app                       # Check application logs
docker compose logs db                        # Check database logs
docker compose down -v && docker compose up -d # Full reset (destroys data)
```

---

## License

MIT
