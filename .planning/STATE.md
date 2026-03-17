# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-05)

**Core value:** Sales leads successfully move through pipeline stages with zero context loss - every handoff preserves the full conversation history, structured data, and team notes so the receiving rep has everything they need to continue the conversation naturally.

**Current focus:** Phase 2 - WhatsApp Core & Real-Time Messaging

## Current Position

Phase: 2 of 4 (WhatsApp Core & Real-Time Messaging)
Plan: 1 of 3 in current phase (02-01-PLAN.md COMPLETE ✅)
Status: Phase 2 Plan 1 COMPLETE ✅
Last activity: 2026-03-17 - Completed 02-01-PLAN.md (WhatsApp webhook, send API, message storage, Realtime, 24h window, contact auto-creation)

Progress: [████......] 40%

## Performance Metrics

**Velocity:**
- Total plans completed: 2
- Average duration: ~28 minutes
- Total execution time: ~0.9 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01 | 2 | ~56min | ~28min |

**Recent Trend:**
- Last 5 plans: 01-01 (12min), 01-02 (45min)
- Trend: Phase 1 complete

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Defer CRM integrations to v2 - Focus on proving core value (context-preserving handoffs) before complex integrations
- Meta Cloud API over 360dialog - Free messaging tier reduces customer acquisition cost, complexity acceptable for SaaS
- Desktop-first interface - Sales reps work from computers, mobile is secondary use case
- Configurable stages/roles/forms - Different businesses have different sales processes, flexibility is competitive advantage
- Serverless-compatible architecture - Reduces infrastructure costs and complexity for SaaS deployment

**From 01-01:**

| ID | Decision | Impact |
|----|----------|--------|
| SCHEMA-01 | Use text primary keys for Clerk IDs | Simpler integration, slightly larger indexes |
| RLS-01 | Use session variables for tenant context | Must call setTenantContext before queries |
| DB-01 | Supabase with transaction pooling (prepare: false) | Enables serverless deployment |

### Pending Todos

**Phase 2 Plan 1 Complete — Phase 2 Plans 02-02 and 02-03 next**

**Before running in production (human setup required):**
- Create Clerk application at https://dashboard.clerk.com
  - Enable Organizations feature
  - Create custom roles: `org:manager` and `org:agent`
  - Create webhook endpoint → your-domain/api/webhooks/clerk
  - Subscribe to: user.*, organization.*, organizationMembership.*
  - Add keys to `.env.local`: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY, CLERK_WEBHOOK_SECRET
- Create Supabase project at https://supabase.com/dashboard
  - Add DATABASE_URL and DIRECT_DATABASE_URL to `.env.local`
  - Run `npm run db:migrate`
  - Verify RLS policies active in Supabase dashboard

**Phase 2 status:** Plan 1 complete — core WhatsApp infrastructure built.

**Completed in Phase 2 Plan 1 (02-01):**
- WhatsApp Meta Cloud API webhook (GET verify + POST receive)
- Send message API route (POST /api/whatsapp/send)
- DB schema: contacts, conversations, messages tables + RLS + migration
- 24h conversation window tracking (windowExpiresAt, windowStatus)
- Contact auto-creation on first inbound message
- Supabase Realtime client helpers (messages + conversations subscriptions)
- Message status tracking (sent/delivered/read/failed)

**Phase 2 remaining tasks (plans 02-02, 02-03):**
- Message templates (TEMPLATE-01 through TEMPLATE-05)
- Inbox UI with real-time message display
- Media message support (images, documents)

### Blockers/Concerns

**Before Phase 1:**
- Meta Business Verification should start immediately (takes 2-4 weeks, blocks production messaging)
- WhatsApp template approval should begin early (24-48 hours per template)

**Phase 1 considerations:**
- Drizzle ORM is new (v0.45) - may need raw SQL fallback for complex queries
- Supabase connection pooling limits (60 free tier, 200 paid) - monitor concurrent connections

**Phase 2 considerations:**
- Cold start impact on real-time UX - measure P95 response time, add provisioned concurrency if needed
- WhatsApp media URL expiration - download within 1 hour of webhook receipt

**Phase 2 Plan 1 — additional setup required (human):**
- Register webhook URL at Meta Business → WhatsApp → Configuration: `https://your-domain/api/webhooks/whatsapp`
- Set WHATSAPP_VERIFY_TOKEN (any secret string you choose)
- Get WHATSAPP_API_TOKEN from Meta Business → System Users
- Get WHATSAPP_APP_SECRET from Meta App Dashboard → Settings → Basic
- Run `npm run db:migrate` to apply 0002_whatsapp_core.sql
- Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY for Realtime

## Session Continuity

Last session: 2026-03-17
Stopped at: Completed 02-01-PLAN.md (WhatsApp Core — webhook, send, storage, Realtime)
Resume file: None

---
**From 01-02:**

| ID | Decision | Impact |
|----|----------|--------|
| AUTH-01 | Edge middleware cannot call PostgreSQL | Use x-organization-id header; server code calls setTenantContext |
| AUTH-02 | adminDb uses DIRECT_DATABASE_URL | Webhook ops bypass pooler and RLS |
| AUTH-03 | Svix for webhook verification | Official Clerk recommendation |
| AUTH-04 | Soft delete on org membership removal | Preserves conversation history |

**From 02-01:**

| ID | Decision | Impact |
|----|----------|--------|
| WA-01 | adminDb in webhook handler — no RLS | Webhooks process all orgs, no user session available |
| WA-02 | WHATSAPP_APP_SECRET for webhook signature verification | Meta signs payloads with app secret, not access token |
| WA-03 | Unique constraint on wa_message_id | Idempotency — webhook replays won't create duplicate messages |
| WA-04 | windowExpiresAt = +24h from each inbound message | Resets window on every customer reply (Meta spec) |
| WA-05 | Supabase Realtime via @supabase/supabase-js anon key | Safe for client-side; RLS filters data per org on Supabase side |

*Last updated: 2026-03-17*
