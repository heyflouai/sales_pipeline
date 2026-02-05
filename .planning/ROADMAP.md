# Roadmap: WhatsApp Team Inbox for Sales Teams

## Overview

This roadmap delivers a WhatsApp Business API-based team inbox with integrated sales pipeline management in 4 phases. Starting with multi-tenant security foundations, we build real-time messaging infrastructure, then layer on the core differentiator (zero-context-loss pipeline handoffs), and finish with analytics and production readiness. Each phase delivers verifiable user value while maintaining the serverless-first architecture required for SaaS deployment.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3, 4): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation & Multi-Tenant Security** - Auth, roles, database with RLS
- [ ] **Phase 2: WhatsApp Core & Real-Time Messaging** - Send/receive messages, templates, 24h window tracking
- [ ] **Phase 3: Pipeline & Context Preservation** - Sales stages, handoffs, contact CRM, internal notes
- [ ] **Phase 4: Analytics & Production Readiness** - Manager dashboards, polish, GDPR compliance

## Phase Details

### Phase 1: Foundation & Multi-Tenant Security
**Goal**: Users can securely authenticate and access their organization's data with complete tenant isolation
**Depends on**: Nothing (first phase)
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, TENANT-01, TENANT-02, TENANT-03, TENANT-04, TENANT-05, TENANT-06, ROLE-01, ROLE-02, ROLE-03, ROLE-04
**Success Criteria** (what must be TRUE):
  1. User can sign up with email/password and verify their email address
  2. User can log in and session persists across browser refresh
  3. User can reset forgotten password via email link
  4. Admin can create organization and invite team members with role assignment
  5. Database enforces Row-Level Security preventing cross-tenant data access
**Plans**: 2 plans

Plans:
- [ ] 01-01-PLAN.md — Scaffold Next.js 15 project, define Drizzle schema, generate migrations with RLS policies
- [ ] 01-02-PLAN.md — Integrate Clerk auth, webhook sync, RBAC utilities, and protected dashboard shell

### Phase 2: WhatsApp Core & Real-Time Messaging
**Goal**: Users can send and receive WhatsApp messages with real-time updates while respecting the 24-hour conversation window
**Depends on**: Phase 1
**Requirements**: WHATSAPP-01, WHATSAPP-02, WHATSAPP-03, WHATSAPP-04, WHATSAPP-05, WHATSAPP-06, WHATSAPP-07, WHATSAPP-08, WHATSAPP-09, WHATSAPP-10, WHATSAPP-11, TEMPLATE-01, TEMPLATE-02, TEMPLATE-03, TEMPLATE-04, TEMPLATE-05, CONTACT-01, CONTACT-02, INBOX-08, INBOX-09
**Success Criteria** (what must be TRUE):
  1. User can send and receive text messages and media files via WhatsApp
  2. User sees message status (sent, delivered, read) for all messages
  3. User sees countdown timer showing remaining time in 24-hour window
  4. When 24h window expires, user sees "Session expired - use template" and can select approved template to reopen window
  5. User receives real-time notification when new message arrives on assigned conversation
  6. Admin can create, submit, and track approval status of message templates
  7. System auto-creates contact when first WhatsApp message received from new number
**Plans**: TBD

Plans:
- [ ] 02-01: TBD
- [ ] 02-02: TBD
- [ ] 02-03: TBD

### Phase 3: Pipeline & Context Preservation
**Goal**: Sales leads move through customizable pipeline stages with zero context loss - every handoff preserves full conversation history, custom fields, and internal notes
**Depends on**: Phase 2
**Requirements**: PIPELINE-01, PIPELINE-02, PIPELINE-03, PIPELINE-04, PIPELINE-05, PIPELINE-06, PIPELINE-07, PIPELINE-08, PIPELINE-09, PIPELINE-10, PIPELINE-11, CRM-01, CRM-02, CRM-03, CRM-04, CRM-05, CRM-06, CRM-07, CRM-08, CONTEXT-01, CONTEXT-02, CONTEXT-03, CONTEXT-04, CONTEXT-05, CONTEXT-06, CONTEXT-07, CONTEXT-08, CONTEXT-09, CONTACT-03, CONTACT-04, CONTACT-05, CONTACT-06, CONTACT-07, CONTACT-08, INBOX-01, INBOX-02, INBOX-03, INBOX-04, INBOX-05, INBOX-06, INBOX-07, INBOX-10, ROLE-05, ROLE-06, ROLE-07, ROLE-08, ROLE-09, ROLE-10
**Success Criteria** (what must be TRUE):
  1. Admin can create and customize pipeline stages with stage-specific data forms
  2. User can view pipeline as Kanban board and drag-drop deals between stages
  3. When deal moves to new stage, system auto-assigns to appropriate rep and preserves all conversation history, custom fields, and internal notes
  4. Rep can view only conversations assigned to them, while Manager can view all conversations regardless of assignment
  5. User can add internal notes to conversations that are visible to team but not customers
  6. User can search and filter conversations by contact name, phone, labels, assignment, and date range
  7. Activity timeline shows complete chronological history of messages, stage changes, assignments, and notes
  8. Contact profile displays custom fields, lead details, and labels defined by admin
**Plans**: TBD

Plans:
- [ ] 03-01: TBD
- [ ] 03-02: TBD
- [ ] 03-03: TBD

### Phase 4: Analytics & Production Readiness
**Goal**: Managers have visibility into team performance and the product is production-ready with GDPR compliance
**Depends on**: Phase 3
**Requirements**: ANALYTICS-01, ANALYTICS-02, ANALYTICS-03, ANALYTICS-04, ANALYTICS-05, ANALYTICS-06, ANALYTICS-07
**Success Criteria** (what must be TRUE):
  1. Manager can view dashboard showing total conversations, average response time, and conversations by pipeline stage
  2. Manager can see conversations handled per rep with filtering by date range and rep
  3. Dashboard shows new conversation trends (today, this week, this month)
  4. System handles errors gracefully with user-friendly messages
  5. Application is mobile-responsive and performs well under load
**Plans**: TBD

Plans:
- [ ] 04-01: TBD
- [ ] 04-02: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Multi-Tenant Security | 0/2 | Planning complete | - |
| 2. WhatsApp Core & Real-Time Messaging | 0/3 | Not started | - |
| 3. Pipeline & Context Preservation | 0/3 | Not started | - |
| 4. Analytics & Production Readiness | 0/2 | Not started | - |

---
*Roadmap created: 2026-02-05*
*Phase 1 planned: 2026-02-05*
*Total phases: 4*
*Total plans: 10 (estimated)*
