# BharatSolve AI — Complete Application Cost, Deployment & Maintenance Guide

> **Purpose:** Comprehensive analysis of deployment costs, operational expenses, maintenance requirements, and scaling considerations for BharatSolve AI across all deployment tiers.

**Last Updated:** February 2026

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Application Architecture Overview](#2-application-architecture-overview)
3. [Cost Components](#3-cost-components)
4. [Deployment Cost Scenarios](#4-deployment-cost-scenarios)
5. [External Service Costs](#5-external-service-costs)
6. [AI (OpenAI) Cost Model](#6-ai-openai-cost-model)
7. [Maintenance & Operations](#7-maintenance--operations)
8. [Scaling Cost Projections](#8-scaling-cost-projections)
9. [Cost Optimization Strategies](#9-cost-optimization-strategies)
10. [Total Cost of Ownership (TCO) Summary](#10-total-cost-of-ownership-tco-summary)

---

## 1. Executive Summary

| Deployment Tier | Monthly Cost (Est.) | Best For |
|---|---|---|
| **Free Tier (Zero Cost)** | $0 | MVP, demos, early validation |
| **Minimal Production** | $15–35 | First 100–500 users |
| **Small Production (AWS)** | $55–85 | 500–2,000 users |
| **Medium Production (AWS)** | $180–250 | 2,000–10,000 users |
| **Scaled Production** | $500+ | 10,000+ users |

**Key Insight:** BharatSolve AI can run at **$0/month** using free-tier hosting + in-memory storage + mock AI. Production with real AI and PostgreSQL starts at **~$15/month** (hosting) + **variable AI costs** (~$15–100/month depending on usage).

---

## 2. Application Architecture Overview

### 2.1 Tech Stack Summary

| Layer | Technology | Cost Implications |
|---|---|---|
| **Frontend** | React 18 + Vite + Tailwind | No direct cost; static assets served by host |
| **Backend** | Node.js 20 + Express 5 | Compute from hosting provider |
| **Database** | PostgreSQL (Drizzle ORM) or in-memory | Free tiers or managed DB pricing |
| **AI** | OpenAI (gpt-4o-mini) / Ollama / Mock | Per-token (OpenAI) or $0 |
| **Auth** | Replit OIDC or standalone (to be implemented) | Varies by provider |
| **Email** | Resend | 100/day free, then paid |
| **Web Search** | Brave / Serper (optional) | 2,000–2,500 queries/mo free |

### 2.2 External Dependencies

| Service | Required? | Free Tier | Fallback |
|---|---|---|---|
| PostgreSQL | Production only | Neon, Supabase, Fly Postgres | In-memory |
| OpenAI API | Real AI | None | Mock AI |
| Resend | Emails | 100/day | Disabled |
| Brave/Serper | Web-enriched AI | 2,000–2,500/mo | Skip web search |
| Lemon Squeezy / Stripe | Payments | No free tier | Manual subscription |
| Auth provider | Prod auth | Replit OIDC (Replit only) | Dev auto-login |

---

## 3. Cost Components

### 3.1 Infrastructure (Compute + Database)

| Component | Free Tier | Paid Tier | Notes |
|---|---|---|---|
| **App Hosting** | Render, Railway, Fly.io, Koyeb, HF Spaces | AWS ECS, Render Pro, Railway | Free tiers have cold starts or limits |
| **Database** | Neon, Supabase, Fly Postgres (0.5–10 GB) | RDS, Render PostgreSQL | Free DBs: 90 days (Render) or forever (Neon) |
| **Domain** | Often included | ~$12/year (.ai) | bharatsolve.ai |
| **SSL/TLS** | Included on all platforms | Included | Let's Encrypt or platform-managed |

### 3.2 Third-Party Services

| Service | Free Tier | Paid Tier | Usage Notes |
|---|---|---|---|
| **OpenAI API** | $5 credit (new accounts) | Pay-per-token | gpt-4o-mini: $0.15/1M input, $0.60/1M output |
| **Resend** | 100 emails/day, 3,000/mo | $20/mo (50k) | Welcome, receipts, password reset |
| **Brave Search** | 2,000 queries/month | Paid plans | Optional; enriches AI context |
| **Serper** | 2,500 queries/month | Paid plans | Alternative to Brave |
| **Lemon Squeezy** | 5% + $0.50/txn | Growth: 3.5% + $0.30 | Merchant of Record |
| **Stripe** | N/A | 3.4% + HK$2.35 | Phase 2; requires HK business |

### 3.3 Monitoring & Ops

| Service | Free Tier | Paid Tier | Purpose |
|---|---|---|---|
| **Sentry** | 5,000 errors/mo | $29/mo (Team) | Error tracking, performance |
| **UptimeRobot** | 50 monitors, 5-min interval | $7/mo | Uptime monitoring |
| **CloudWatch** | 5 GB logs (AWS) | Per GB | Logs (included with ECS) |

---

## 4. Deployment Cost Scenarios

### 4.1 Scenario A: Free Tier (MVP / Demo)

| Item | Cost | Notes |
|---|---|---|
| **Hosting** | $0 | Render free / Koyeb nano / Fly.io free |
| **Database** | $0 | Neon (forever free) or in-memory |
| **OpenAI** | $0 | Mock AI (no key) |
| **Email** | $0 | Disabled or within 100/day |
| **Domain** | $0 | Use platform subdomain |
| **Monitoring** | $0 | UptimeRobot free, Sentry free |
| **Total** | **$0/month** | Data resets on restart if in-memory |

**Limitations:** Cold starts, no persistence (if in-memory), mock AI only.

---

### 4.2 Scenario B: Minimal Production (First Users)

| Item | Cost | Notes |
|---|---|---|
| **Hosting** | $0–7 | Railway ($5 credits) or Fly.io free |
| **Database** | $0 | Neon / Supabase / Fly Postgres |
| **OpenAI** | $15–50 | ~500–2,000 problems/month |
| **Email** | $0 | Within Resend free tier |
| **Domain** | ~$1/mo | bharatsolve.ai (~$12/year) |
| **Monitoring** | $0 | UptimeRobot, Sentry free |
| **Total** | **~$15–60/month** | Real AI, persistent DB |

---

### 4.3 Scenario C: Small Production (AWS)

Uses `infrastructure/` Terraform. See [infrastructure/README.md](../infrastructure/README.md).

| Resource | Config | Monthly Cost |
|---|---|---|
| ECS Fargate | 2 tasks × 0.25 vCPU, 512 MB | ~$15 |
| RDS PostgreSQL | db.t3.micro, 20 GB, Single-AZ | ~$15 |
| ALB | 1 load balancer | ~$18 |
| NAT Gateway | 1 | ~$32 |
| ECR | 1 repository | ~$1 |
| Secrets Manager | 1 secret | ~$1 |
| **Infrastructure Subtotal** | | **~$82** |
| OpenAI | ~5,000 problems | ~$50 |
| Resend | <3,000 emails | $0 |
| Domain | bharatsolve.ai | ~$1 |
| **Total** | | **~$133/month** |

---

### 4.4 Scenario D: Medium Production (1,500+ Paid Users)

| Resource | Config | Monthly Cost |
|---|---|---|
| ECS Fargate | 2–4 tasks × 0.5 vCPU | ~$60 |
| RDS PostgreSQL | db.t3.small, Multi-AZ | ~$50 |
| ALB + NAT | 2 AZs | ~$70 |
| ECR, Secrets, Logs | — | ~$5 |
| **Infrastructure Subtotal** | | **~$185** |
| OpenAI | ~20,000 problems | ~$150 |
| Resend | ~10,000 emails | ~$20 |
| Sentry | Team plan | $29 |
| **Total** | | **~$384/month** |

---

### 4.5 Hosting Platform Comparison

| Platform | Free Tier | Paid Starting | Best For |
|---|---|---|---|
| **Render** | 750 hrs/mo, sleeps | $7/mo | Easiest start, cold starts |
| **Railway** | $5 credits/mo | $5+ usage | Best DX, no sleep |
| **Fly.io** | 3 VMs × 256 MB | Pay-as-you-go | India (Mumbai), always-on |
| **Koyeb** | 1 nano always-on | Paid plans | No credit card, always-on |
| **Hugging Face** | 16 GB RAM (sleeps) | $9/mo | AI demos |
| **AWS ECS** | None | ~$55+ | Full control, scaling |

---

## 5. External Service Costs

### 5.1 OpenAI API (gpt-4o-mini)

**Pricing (2025):**

| Type | Cost per 1M tokens |
|---|---|
| Input | $0.15 |
| Output | $0.60 |

**Per-problem estimate:**
- System prompt: ~800 tokens
- User input (title + description): ~150 tokens
- Web search context (if enabled): ~400 tokens
- Output (solution): ~600 tokens  
- **Total per problem:** ~1,950 tokens ≈ **$0.0005–0.001** (~$0.0008 avg)

| Problems/Month | Est. OpenAI Cost |
|---|---|
| 500 | ~$0.40 |
| 2,000 | ~$1.60 |
| 10,000 | ~$8 |
| 50,000 | ~$40 |
| 200,000 | ~$160 |

**Discussion replies:** Similar token usage; estimate ~$0.0005 per message.

### 5.2 Resend Email

| Plan | Limit | Cost |
|---|---|---|
| Free | 100/day, 3,000/mo | $0 |
| Pro | 50,000/mo | $20 |
| Scale | 100,000/mo | $80 |

**Typical usage:** Welcome (1), trial reminder (1–2), subscription confirmation (1), receipts (1/mo). ~5–10 emails per user lifecycle → 3,000 free covers ~300–600 users.

### 5.3 Web Search APIs

| Provider | Free Tier | Paid |
|---|---|---|
| Brave Search | 2,000 queries/mo | Paid plans |
| Serper | 2,500 queries/mo | $50/mo (30k) |

Useful for enriching AI with real-time context; optional. One search per problem → 2,000–2,500 free problems/month with web context.

### 5.4 Payment Processing

| Provider | Fee | On ₹499 (~$6) | Net to You |
|---|---|---|---|
| **Lemon Squeezy** | 5% + $0.50 | ~$0.80 | ~$5.15 (86%) |
| **Stripe HK** | 3.4% + HK$2.35 | ~$0.55 | ~$5.45 (91%) |

At 100 paid users: LS fees ~$80/mo, Stripe ~$55/mo. Savings with Stripe: ~$25/mo at 100 users, ~$710/mo at 1,000 users.

---

## 6. AI (OpenAI) Cost Model

### 6.1 Cost Drivers

1. **Problem creation** — One completion per problem
2. **Discussion follow-ups** — One completion per message
3. **Chat module** (if enabled) — Streaming completions
4. **Voice AI** (if enabled) — STT + TTS + chat
5. **Image generation** (if enabled) — DALL·E API

### 6.2 Optimization Strategies

| Strategy | Savings |
|---|---|
| Use **gpt-4o-mini** (not gpt-4o) | ~10× cheaper |
| **Cache** system prompts (OpenAI Cache API) | 50% on input |
| **Batch API** for non-urgent jobs | 50% discount |
| **Ollama** for dev/staging | $0 |
| **Mock AI** for demos | $0 |
| Limit **web search** to paid users | Reduces optional calls |

### 6.3 Usage Scenarios

| Scenario | Problems/Mo | Discussion Msgs | Est. OpenAI Cost |
|---|---|---|---|
| **Bootstrap** | 500 | 200 | ~$0.60 |
| **Early traction** | 2,000 | 1,000 | ~$2.50 |
| **Growth** | 10,000 | 5,000 | ~$12 |
| **Scale** | 50,000 | 25,000 | ~$60 |

---

## 7. Maintenance & Operations

### 7.1 Regular Maintenance Tasks

| Task | Frequency | Est. Time | Notes |
|---|---|---|---|
| **Dependency updates** | Monthly | 2–4 hrs | `npm audit`, security patches |
| **Node.js upgrades** | Annually | 2–4 hrs | LTS versions |
| **DB backups** | Daily (automated) | 0 | RDS/Neon backups |
| **Schema migrations** | As needed | 1–2 hrs | `drizzle-kit push` |
| **SSL renewal** | Automated | 0 | Platform-managed |
| **Secret rotation** | Quarterly | 1 hr | SESSION_SECRET, API keys |
| **Log review** | Weekly | 1 hr | Errors, performance |
| **Cost review** | Monthly | 1 hr | AWS/hosting bills |

### 7.2 Monitoring Checklist

| Check | Tool | Alert Threshold |
|---|---|---|
| Uptime | UptimeRobot | 2 consecutive failures |
| Errors | Sentry | >100 errors/hr |
| Response time | Sentry / CloudWatch | p95 > 3s |
| DB connections | RDS / Neon dashboard | >80% of limit |
| OpenAI usage | OpenAI dashboard | Approaching budget |
| Disk space | Host / RDS | >80% full |

### 7.3 Incident Response

| Severity | Response Time | Actions |
|---|---|---|
| **P0 (outage)** | &lt;15 min | Check health, restart, rollback |
| **P1 (degraded)** | &lt;1 hr | Scale up, investigate logs |
| **P2 (minor)** | &lt;24 hr | Create ticket, plan fix |
| **P3 (cosmetic)** | Next sprint | Backlog |

### 7.4 Backup Strategy

| Component | Method | Retention |
|---|---|---|
| **Database** | RDS automated / Neon point-in-time | 7–30 days |
| **Secrets** | AWS Secrets Manager / env backup | Encrypted |
| **Code** | Git (GitHub) | Forever |
| **Uploads** | S3 / volume snapshot | 7 days |

### 7.5 Security Maintenance

| Task | Frequency |
|---|---|
| `npm audit fix` | Monthly |
| Rotate API keys | Quarterly |
| Review OIDC/auth config | After auth changes |
| CORS / rate limit review | Quarterly |
| Penetration testing | Annual (recommended) |

---

## 8. Scaling Cost Projections

### 8.1 User-Based Cost Model

Assumptions: 10% trial-to-paid, 3 problems/month per active user, 2 discussion messages per problem.

| Users | Paid | Problems/Mo | Infra | OpenAI | Email | Payments | Total |
|---|---|---|---|---|---|---|---|
| 500 | 50 | 1,500 | $0–80 | $1.50 | $0 | $0 | $1.50–82 |
| 2,000 | 200 | 6,000 | $80 | $5 | $0 | $0 | ~$85 |
| 10,000 | 1,000 | 30,000 | $180 | $25 | $20 | $0 | ~$225 |
| 50,000 | 5,000 | 150,000 | $400 | $120 | $80 | $0 | ~$600 |

*Payments row: platform fees only; revenue is separate.*

### 8.2 Revenue vs Cost Break-Even

| MRR | Est. Paid Users | Est. Monthly Cost | Gross Margin (after payment fees) |
|---|---|---|---|
| $500 | ~70 | ~$90 | ~80% |
| $1,500 | ~200 | ~$120 | ~90% |
| $5,000 | ~700 | ~$250 | ~93% |
| $12,000 | ~1,500 | ~$400 | ~95% |

At scale, **AI and infrastructure are &lt;5% of revenue**; payment processing is the largest variable cost (~5–9%).

---

## 9. Cost Optimization Strategies

### 9.1 Immediate (Free)

| Action | Savings |
|---|---|
| Use **Neon** instead of paid PostgreSQL | $7–15/mo |
| Stay on **free hosting** until traffic justifies paid | $7–80/mo |
| Use **mock AI** for demos | $0 AI cost |
| **UptimeRobot** free tier | $0 |
| **Sentry** free tier (5k errors) | $0 |
| **Resend** free tier (3k emails) | $0 |
| Disable **web search** or use free Brave/Serper | $0 |

### 9.2 Short-Term (First 6 Months)

| Action | Savings |
|---|---|
| **Fly.io** Mumbai region (low latency, free tier) | vs paid hosting |
| **Lemon Squeezy** for payments (no entity) | vs Stripe setup cost |
| **gpt-4o-mini** only (no gpt-4o) | 10× vs gpt-4o |
| Single **NAT Gateway** on AWS | ~$32/mo |
| **Fargate Spot** for non-critical envs | 60–70% compute savings |

### 9.3 Medium-Term (Scale)

| Action | Savings |
|---|---|
| **Stripe** over Lemon Squeezy at 1,000+ users | ~$700/mo |
| **OpenAI Batch API** for non-urgent jobs | 50% AI cost |
| **RDS Reserved Instances** (1-year) | 30–40% DB cost |
| **CloudFront** in front of ALB | Lower ALB + better latency |
| **Multi-AZ** only when needed | Saves ~$30/mo initially |

---

## 10. Total Cost of Ownership (TCO) Summary

### 10.1 Year 1 Projection (Conservative)

| Month | Stage | Infra | AI | Email | Payments | Monitoring | Total |
|---|---|---|---|---|---|---|---|
| 1–2 | Bootstrap | $0 | $5 | $0 | $0 | $0 | **$5** |
| 3–4 | Early users | $20 | $15 | $0 | $0 | $0 | **$35** |
| 5–6 | Small prod | $80 | $40 | $0 | $0 | $0 | **$120** |
| 7–9 | Growth | $120 | $80 | $20 | $0 | $29 | **$249** |
| 10–12 | Scale | $180 | $120 | $80 | $0 | $29 | **$409** |

**Year 1 Total:** ~$2,400 (excluding one-time: domain, HK business registration if Stripe).

### 10.2 One-Time Costs

| Item | Cost |
|---|---|
| Domain (bharatsolve.ai) | ~$12/year |
| HK Sole Proprietor (Stripe Phase 2) | HK$2,200 (~$280) |
| Initial setup (optional) | 0 (use free tiers) |

### 10.3 Decision Matrix

| Goal | Recommended Stack | Est. Monthly |
|---|---|---|
| **Validate idea, zero budget** | Render + Neon + Mock AI | $0 |
| **First 100 users, real AI** | Fly.io + Neon + OpenAI | $15–40 |
| **Production, Indian users** | Fly.io Mumbai + Fly Postgres | $0–20 |
| **Full control, scaling** | AWS ECS + RDS | $80–180 |
| **Enterprise readiness** | AWS Multi-AZ + Stripe + Sentry | $250+ |

---

## Appendix A: Environment Variables Cost Impact

| Variable | If Set | Cost Impact |
|---|---|---|
| `DATABASE_URL` | Yes | DB hosting (Neon free / RDS $15+) |
| `OPENAI_API_KEY` | Yes | Per-token (variable) |
| `RESEND_API_KEY` | Yes | Free to $20+ |
| `BRAVE_SEARCH_API_KEY` | Yes | Free 2k/mo |
| `SERPER_API_KEY` | Yes | Free 2.5k/mo |
| `LEMONSQUEEZY_*` | Yes | 5% + $0.50 per txn |

---

## Appendix B: Related Documentation

- [free-hosting-deployment.md](./free-hosting-deployment.md) — **Cheapest path ($0)** and step-by-step deployment on Render, Railway, Fly.io, Koyeb
- [monetization-strategy.md](./monetization-strategy.md) — Revenue model, payment integration, pricing
- [payment-options-hk.md](./payment-options-hk.md) — Lemon Squeezy vs Stripe for HK
- [infrastructure/README.md](../infrastructure/README.md) — AWS Terraform setup and costs
- [project-overview.md](./project-overview.md) — Tech stack, architecture

---

*Document generated from codebase analysis. Pricing and limits may change; verify with providers.*
