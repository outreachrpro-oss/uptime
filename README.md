# AROLAGB Uptime

Professional website uptime monitoring SaaS platform for **AROLAGB LIMITED** (Company No. 16763224).

**Product:** AROLAGB Uptime  
**Tagline:** Monitor Smarter. Stay Online.  
**Domain:** https://arolagblimited.store

> **Client confirmation required:** The Companies House SIC code is currently retail (47910). Confirm that AROLAGB LIMITED is the intended legal operator of this software before production launch. The Companies House record may also flag an overdue confirmation statement — review before launch.

---

## Stack

| Layer | Technology |
|--------|------------|
| Frontend | Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Next.js Route Handlers, Zod validation |
| Database | MongoDB Atlas + Mongoose |
| Auth | Custom JWT sessions (jose) + bcrypt |
| Monitoring | Dedicated Node.js worker, Redis, BullMQ |
| Payments | Stripe Checkout + Billing Portal + webhooks |
| Email | Resend (or SMTP when configured) |

---

## Quick start

### 1. Install

```bash
npm install --legacy-peer-deps
cp .env.example .env.local
```

### 2. Configure `.env.local`

Minimum for local development:

```env
MONGODB_URI=mongodb+srv://...
AUTH_SECRET=<openssl rand -base64 32>
ENCRYPTION_KEY=<openssl rand -hex 32>
REDIS_URL=redis://localhost:6379
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Start Redis

```bash
docker compose up redis -d
# or use a hosted Redis instance
```

### 4. Run web + worker

```bash
# Terminal 1 — Next.js
npm run dev

# Terminal 2 — monitoring worker (required for real checks)
npm run worker
```

Or:

```bash
npm run dev:all
```

Open http://localhost:3000

---

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────┐
│  Next.js (Vercel)│────▶│  MongoDB Atlas   │◀────│ BullMQ Worker│
│  Marketing + API │     │  Monitors/Checks │     │ (always-on)  │
└─────────────────┘     └──────────────────┘     └──────┬──────┘
                                                         │
                                                   ┌─────▼─────┐
                                                   │   Redis   │
                                                   └───────────┘
```

**Critical:** Monitoring does **not** run inside the browser or only on Vercel serverless. Deploy the `worker/` process on Railway, Render, Fly.io, or Docker so checks continue 24/7.

---

## Environment variables

See [`.env.example`](./.env.example) for the full list.

| Variable | Required | Purpose |
|----------|----------|---------|
| `MONGODB_URI` | Yes | MongoDB Atlas connection |
| `AUTH_SECRET` | Yes | Session signing (≥32 chars) |
| `ENCRYPTION_KEY` | Yes | AES-256-GCM for alert secrets (64 hex chars) |
| `REDIS_URL` | Yes (worker) | BullMQ / Redis |
| `NEXT_PUBLIC_APP_URL` | Yes | Canonical URL |
| `RESEND_API_KEY` | For email | Transactional email |
| `STRIPE_*` | For billing | Checkout, portal, webhooks |
| `TWILIO_*` | Optional | SMS alerts |

### Email DNS (production)

Configure for `arolagblimited.store`:

- Domain ownership verification with Resend (or your ESP)
- SPF, DKIM, DMARC records
- Mailboxes: `support@`, `info@`, `billing@`, `contact@`, `noreply@`

Do not assume these mailboxes exist until the domain DNS and ESP are configured.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Next.js development server |
| `npm run worker` | Start monitoring worker |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript check |
| `npm test` | Unit tests (Vitest) |
| `npm run test:e2e` | Playwright E2E (requires running app) |
| `npm run lint` | ESLint |

---

## Features implemented

- Marketing site (home, features, pricing, how it works, FAQ, about, contact)
- Legal pages (terms, privacy, cookies, refund, cancellation) — **subject to legal review**
- Multi-tenant orgs with RBAC
- Auth: register, login, logout, password reset, email verification tokens
- Monitor CRUD (HTTP/HTTPS/TCP/SSL/DNS/keyword) with plan limits
- Real background monitoring worker with SSRF protection
- Incident detection with failure/recovery thresholds
- Alerts: email, Slack, Discord, signed webhooks (SMS when Twilio configured)
- Public status pages at `/status/[slug]`
- Stripe Checkout, Customer Portal, verified webhooks
- Platform admin at `/admin`
- Cookie consent (analytics off until accepted)
- SEO: sitemap, robots, Open Graph metadata

---

## Deployment

### Web (Vercel)

1. Connect the repo to Vercel
2. Set all `NEXT_PUBLIC_*` and server env vars
3. Domain: `arolagblimited.store`
4. Stripe webhook endpoint: `https://arolagblimited.store/api/billing/webhook`

### Worker (Railway / Render / Fly / Docker)

```bash
docker compose up worker -d
# or: npm run worker  on an always-on host with REDIS_URL + MONGODB_URI
```

### Stripe webhook

```bash
stripe listen --forward-to localhost:3000/api/billing/webhook
```

---

## Security notes

- User-submitted URLs are validated against SSRF (private IPs, metadata endpoints, blocked ports)
- Redirect targets are revalidated
- Passwords hashed with bcrypt (12 rounds)
- API keys and webhook secrets stored encrypted / hashed — never plaintext
- Platform admin role cannot be self-assigned at registration
- Tenant isolation enforced on all org-scoped queries

---

## Testing

```bash
npm test
npm run typecheck
npm run build
```

Do not claim production readiness until MongoDB, Redis, worker, Stripe, and email are configured and verified in a staging environment.

---

## Company details (verified)

**AROLAGB LIMITED**  
Company Number: 16763224  
Registered Office: 31 Crowndale Road, London, England, NW1 1TN  
Companies House: https://find-and-update.company-information.service.gov.uk/company/16763224

Legal page content is a UK-oriented SaaS draft and must be reviewed by the client’s solicitor before publication.
