# NIGHT OPS — WhatsApp Team Inbox (sales_pipeline)

## 🎯 Mission
Build the WhatsApp Team Inbox MVP (v1) — a centralized dashboard for sales teams to manage WhatsApp conversations through a shared pipeline. Target: working MVP by morning.

## 📍 Current State (as of 2026-03-17)
- **Phase 1 (Foundation):** Plan 01-01 ✅ done — Next.js scaffold + DB schema
- **Phase 1:** Plan 01-02 🔄 IN PROGRESS — Clerk auth integration (next task)
- **Phase 2:** WhatsApp Core & Real-Time Messaging (not started)
- **Phase 3:** Pipeline & Context Preservation (not started)
- **Phase 4:** Analytics & Production Readiness (not started)

**Repo:** /root/projects/sales_pipeline
**GitHub:** https://github.com/heyflouai/sales_pipeline
**Stack:** Next.js 14, TypeScript, Drizzle ORM, Supabase, Clerk Auth, Tailwind CSS

## 🔄 TEAM WORKFLOW (Every Task — No Exceptions)

**Step 1 — ARCH plans:**
- Read `.planning/STATE.md` to find current position
- Read the relevant PLAN.md for the next task
- Create a detailed implementation spec: what files, what changes, what to test
- Write the plan to `.planning/current-task.md`

**Step 2 — DEV TEAM implements (Rex = Frontend, Neo = Backend):**
- Read `.planning/current-task.md`
- Implement the full task — write production-quality code
- Run `npm run build` or `npx tsc --noEmit` to verify no errors
- Fix ALL TypeScript/lint errors before proceeding

**Step 3 — BUG reviews:**
- Read all modified files
- Run `npx tsc --noEmit` and `npm run build`
- Identify any runtime bugs, edge cases, missing error handling
- Fix issues found or document them in `.planning/bug-report.md`

**Step 4 — SHIELD hardens:**
- Review all new code for security issues
- Check: SQL injection, XSS, unprotected routes, exposed secrets, missing auth checks
- Verify RLS policies are applied where needed
- Fix any security issues found
- Document findings in `.planning/shield-report.md`

**Step 5 — JARVIS supervises + commits:**
- Review everything: plan, implementation, bug report, shield report
- Ensure build passes: `npm run build`
- Stage all changes: `git add -A`
- Commit with descriptive message: `git commit -m "feat: [what was built] — Phase X Plan Y"`
- Push: `git push origin main`
- Update `.planning/STATE.md` with new progress
- Clean up: delete `.planning/current-task.md`, `.planning/bug-report.md`, `.planning/shield-report.md`

## 📋 TASK QUEUE (in order)

### Task 1 — Complete Phase 1, Plan 01-02: Clerk Auth Integration
Reference: `.planning/phases/01-foundation-multi-tenant-security/01-02-PLAN.md`
- Clerk middleware + protected routes
- Sign-in/sign-up pages
- Clerk webhook handler → sync to Supabase
- RBAC utilities (requireRole, hasRole, isAdmin)
- Dashboard shell with sidebar + OrgSwitcher

### Task 2 — Phase 2: WhatsApp Core (Meta Cloud API)
- Webhook receiver for incoming WhatsApp messages
- Send text messages API route
- Message storage in Supabase
- Real-time updates via Supabase Realtime
- 24-hour conversation window tracking
- Contact auto-creation on first message

### Task 3 — Phase 2 continued: Message UI
- WhatsApp-style chat interface
- Conversation list (left panel)
- Message thread view (right panel)
- Send message form
- Real-time message updates (WebSocket/Supabase)
- Message status indicators (sent/delivered/read)

### Task 4 — Phase 3: Pipeline & Stages
- Pipeline stage model + Kanban board UI
- Stage-specific forms (qualification, assessment, payment)
- Lead assignment and routing logic
- Handoff workflow (move to next stage)
- RBAC: reps see only their assigned conversations
- Manager sees all conversations

### Task 5 — Phase 3 continued: Context Preservation
- Internal notes (team-visible, customer-hidden)
- Activity timeline (messages + stage changes + assignments)
- Contact profile with custom fields
- Search and filters

### Task 6 — Phase 4: Analytics & Polish
- Manager dashboard (conversion funnel, response times, rep performance)
- Export to CSV
- Notification system (in-app + email via Resend)
- Production readiness checks

## ⚙️ ENVIRONMENT NOTES
- **Supabase:** Already configured in .env.example — use HeyFlou's existing Supabase instance
- **Clerk:** Will need real API keys — if not in .env.local, use placeholder values and document what's needed
- **WhatsApp API:** Use Meta Cloud API — document webhook URL needed for production
- **GitHub PAT:** Available in `/root/.openclaw/workspace/scripts/config.sh` as GITHUB_PAT

## 🚨 RULES
1. Always run `npm run build` before committing — zero errors required
2. Never commit secrets or .env files
3. Each commit = one completed task only
4. Update STATE.md after every commit
5. If a task is blocked (missing API keys, etc.) — document the blocker, implement everything else that CAN be done, and move to next task
6. Notify Yoav on completion: `openclaw system event --text "Night ops: [what was completed]" --mode now`
