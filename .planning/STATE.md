# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-05)

**Core value:** Sales leads successfully move through pipeline stages with zero context loss - every handoff preserves the full conversation history, structured data, and team notes so the receiving rep has everything they need to continue the conversation naturally.

**Current focus:** Phase 1 - Foundation & Multi-Tenant Security

## Current Position

Phase: 1 of 4 (Foundation & Multi-Tenant Security)
Plan: 2 of 2 in current phase
Status: Phase 1 COMPLETE ✅
Last activity: 2026-03-17 - Completed 01-02-PLAN.md (Clerk Auth + RBAC + Dashboard Shell)

Progress: [██........] 20%

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

**Phase 1 Complete — Phase 2 Ready to Start**

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

**Phase 2 next tasks:**
- WhatsApp Meta Cloud API integration
- Webhook receiver for incoming messages
- Message storage and conversation threading
- Real-time updates (SSE or polling)

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

## Session Continuity

Last session: 2026-02-05
Stopped at: Completed 01-01-PLAN.md (Next.js scaffold + database schema)
Resume file: None

---
**From 01-02:**

| ID | Decision | Impact |
|----|----------|--------|
| AUTH-01 | Edge middleware cannot call PostgreSQL | Use x-organization-id header; server code calls setTenantContext |
| AUTH-02 | adminDb uses DIRECT_DATABASE_URL | Webhook ops bypass pooler and RLS |
| AUTH-03 | Svix for webhook verification | Official Clerk recommendation |
| AUTH-04 | Soft delete on org membership removal | Preserves conversation history |

*Last updated: 2026-03-17*
