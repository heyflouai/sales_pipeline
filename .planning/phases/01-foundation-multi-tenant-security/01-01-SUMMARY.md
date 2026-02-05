---
phase: 01-foundation-multi-tenant-security
plan: 01
subsystem: foundation
tags: [nextjs, drizzle, postgres, rls, multi-tenant, supabase]
requires: []
provides:
  - Next.js 15 project scaffold with TypeScript and Tailwind
  - Drizzle ORM schema with multi-tenant tables (organizations, users)
  - SQL migrations with RLS policies for tenant isolation
  - Database client configured for Supabase transaction pooling
affects:
  - 01-02 (authentication will use this schema)
  - All future plans (foundation for entire application)
tech-stack:
  added:
    - Next.js 15.5.12
    - Drizzle ORM 0.45.1
    - postgres.js 3.4.8
    - Clerk 6.37.3
    - Zod 4.3.6
    - nanoid 5.1.6
    - svix 1.84.1
  patterns:
    - Multi-tenant architecture with RLS
    - Serverless-compatible database pooling
    - Type-safe database queries with Drizzle
key-files:
  created:
    - package.json
    - tsconfig.json
    - next.config.ts
    - drizzle.config.ts
    - src/lib/db/schema.ts
    - src/lib/db/index.ts
    - src/lib/db/migrations/0000_lush_reptil.sql
    - src/lib/db/migrations/0001_enable_rls.sql
    - src/app/layout.tsx
    - src/app/page.tsx
    - .env.example
  modified: []
decisions:
  - id: SCHEMA-01
    what: Use text primary keys for Clerk IDs
    why: Clerk uses string IDs (org_xxx, user_xxx), storing as text is more efficient than UUID conversion
    impact: Simpler integration, slightly larger index size vs UUID
  - id: RLS-01
    what: Use session variables for tenant context
    why: Standard PostgreSQL RLS pattern, works with connection pooling
    impact: Must call setTenantContext before queries, enforced by RLS policies
  - id: DB-01
    what: Supabase with transaction pooling (prepare: false)
    why: Required for pgbouncer compatibility in serverless environments
    impact: Slightly slower queries but enables serverless deployment
metrics:
  duration: 12 minutes
  completed: 2026-02-05
---

# Phase 01 Plan 01: Next.js Project Scaffold & Database Schema Summary

**One-liner:** Next.js 15 with Drizzle ORM, multi-tenant schema (organizations, users), and RLS policies for tenant isolation using Supabase transaction pooling.

## What Was Built

### Task 1: Next.js 15 Project Scaffold
- Initialized Next.js 15.5.12 with TypeScript, Tailwind CSS, and ESLint
- Configured App Router with src/ directory structure
- Installed core dependencies: Clerk, Drizzle, postgres.js, Zod, nanoid, svix
- Created environment variable templates (.env.example, .env.local)
- Set up Turbopack for development builds
- Created minimal landing page ("WhatsApp Team Inbox")

### Task 2: Database Schema & RLS Policies
- Defined Drizzle schema with multi-tenant architecture:
  - `organizations` table (id, name, slug, whatsapp fields)
  - `users` table with foreign key to organizations (tenant isolation)
  - `user_role` enum (admin, manager, agent)
- Generated SQL migrations with proper indexes:
  - users_org_id_idx for tenant filtering
  - users_email_idx for auth lookups
- Created RLS policies for tenant isolation:
  - org_tenant_isolation: users only see their org
  - users_tenant_isolation: users only see users in their org
  - users_insert_policy: enforces org context on inserts
- Configured Drizzle client for Supabase:
  - `prepare: false` for pgbouncer compatibility
  - `max: 1` for serverless (one connection per function)
- Added helper functions:
  - `setTenantContext(organizationId)` for RLS
  - `setUserContext(userId, role)` for audit/authorization
- Added npm scripts: db:generate, db:migrate, db:studio

## Decisions Made

**SCHEMA-01: Text primary keys for Clerk IDs**
- Rationale: Clerk uses string IDs (org_xxx, user_xxx), no conversion needed
- Alternative: Convert to UUIDs (adds complexity, no benefit)
- Impact: Simpler integration, slightly larger indexes

**RLS-01: Session variables for tenant context**
- Rationale: Standard PostgreSQL RLS pattern, works with connection pooling
- Alternative: Application-level filtering (easier to bypass, security risk)
- Impact: Must call setTenantContext before queries, enforced at database level

**DB-01: Supabase with transaction pooling**
- Rationale: Required for serverless, pgbouncer needs prepare: false
- Alternative: Direct connections (doesn't work in serverless)
- Impact: Slight performance overhead, enables Vercel deployment

## Deviations from Plan

None - plan executed exactly as written.

## Key Challenges

**Challenge 1: create-next-app conflict with existing files**
- Issue: create-next-app doesn't support --force flag, rejects directory with .planning/ and docs
- Solution: Manually created all Next.js config files (package.json, tsconfig.json, etc.)
- Impact: Same result, just manual setup instead of automated

## Next Phase Readiness

**Blockers:** None

**Prerequisites for 01-02:**
- User must create Supabase project and populate .env.local with real DATABASE_URL
- User must run `npm run db:migrate` to apply migrations (0000_lush_reptil.sql + 0001_enable_rls.sql)
- User must create Clerk account and add API keys to .env.local

**Verification:**
- Run `npm run dev` and visit http://localhost:3000 to see "WhatsApp Team Inbox"
- After Supabase setup, verify RLS policies with: `SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';`
- After migration, confirm tables exist: `\dt` in psql should show organizations and users

**Technical Debt:** None

## Files Changed

**Created (12 files):**
- package.json, package-lock.json
- tsconfig.json, next.config.ts, tailwind.config.ts, postcss.config.mjs, .eslintrc.json
- drizzle.config.ts
- src/lib/db/schema.ts, src/lib/db/index.ts
- src/lib/db/migrations/0000_lush_reptil.sql, src/lib/db/migrations/0001_enable_rls.sql
- src/lib/db/migrations/meta/_journal.json, src/lib/db/migrations/meta/0000_snapshot.json
- src/app/layout.tsx, src/app/page.tsx, src/app/globals.css
- .env.example, .env.local, .gitignore

**Modified:** None (all new files)

## Commits

| Hash | Message |
|------|---------|
| fcc74f2 | chore(01-01): scaffold Next.js 15 project |
| 6e4c86f | feat(01-01): define database schema with RLS policies |

## Verification Results

- ✅ `npm run dev` starts without errors
- ✅ `npm run build` compiles successfully
- ✅ `npx tsc --noEmit` passes with zero TypeScript errors
- ✅ Migration files generated in src/lib/db/migrations/
- ✅ RLS policies defined in 0001_enable_rls.sql
- ✅ src/lib/db/schema.ts exports organizations, users, userRoleEnum, and types
- ✅ src/lib/db/index.ts exports db, setTenantContext, setUserContext
- ✅ .env.example documents all required environment variables

## What's Next

**Plan 01-02:** Clerk authentication integration
- Wrap app with ClerkProvider
- Create Clerk webhook handler for org/user sync
- Implement middleware for tenant context injection
- Create sign-in/sign-up pages

**Dependencies:** Requires Supabase project setup and Clerk account creation by user.
