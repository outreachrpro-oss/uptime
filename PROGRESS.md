# AROLAGB Uptime — Implementation Progress

Last updated during initial build session.

## Client flags (pre-launch)

- [ ] Confirm AROLAGB LIMITED is the legal operator of this uptime product (SIC 47910 is retail)
- [ ] Review overdue confirmation statement on Companies House
- [ ] Legal review of terms / privacy / cookies / refund / cancellation
- [ ] Approve illustrative GBP pricing (£0 / £12 / £39)

## Phase checklist

| Phase | Status | Notes |
|-------|--------|-------|
| 1. Project setup | Done | Next.js 16, TypeScript, Tailwind 4 |
| 2. Design system | Done | Colors, UI kit, marketing components |
| 3. Public website | Done | Home, features, pricing, how-it-works, FAQ, about, contact |
| 4. Database | Done | Mongoose models + indexes |
| 5. Authentication | Done | Register/login/reset/sessions/RBAC |
| 6. Dashboard | Done | Overview, monitors CRUD UI, incidents, billing, settings |
| 7. Monitoring engine | Done | `worker/` + BullMQ + Redis + SSRF |
| 8. Incidents | Done | Thresholds, dedupe active incidents |
| 9. Notifications | Done | Email/Slack/Discord/webhooks (needs provider keys) |
| 10. Status pages | Done | `/status/[slug]` + API |
| 11. Reports | Partial | Dashboard reports page; CSV/PDF export needs polish |
| 12. Stripe | Done | Checkout, portal, webhooks (needs Stripe keys) |
| 13. Admin panel | Done | `/admin` + stats API |
| 14. Legal + SEO | Done | Legal drafts + sitemap/robots/OG |
| 15. Testing | Partial | Unit tests for SSRF/password/plans; E2E stubs pending |
| 16. Deployment | Done | Docker, compose, README |

## Requires external configuration

1. MongoDB Atlas `MONGODB_URI`
2. Redis `REDIS_URL` + always-on worker host
3. `AUTH_SECRET` + `ENCRYPTION_KEY`
4. Resend `RESEND_API_KEY` + DNS (SPF/DKIM/DMARC)
5. Stripe keys + price IDs + webhook secret
6. Domain DNS for `arolagblimited.store`
7. Optional Twilio for SMS

## Do not claim until verified

- Production readiness
- Live payment success without Stripe keys
- Email delivery without Resend/SMTP
- Continuous monitoring without the worker process
