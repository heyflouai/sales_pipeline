# WhatsApp Team Inbox for Sales Teams

## What This Is

A SaaS platform that enables sales teams to collaboratively manage customer WhatsApp conversations through a shared inbox. The system allows multiple sales representatives to seamlessly hand off leads through customizable pipeline stages while preserving complete conversation history and context. Built as a multi-tenant product for SMBs with multi-stage sales processes.

## Core Value

Sales leads successfully move through pipeline stages with zero context loss - every handoff preserves the full conversation history, structured data, and team notes so the receiving rep has everything they need to continue the conversation naturally.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Multi-tenant architecture with data isolation
- [ ] WhatsApp Business API integration (Meta Cloud API)
- [ ] Shared team inbox with real-time message sync
- [ ] User authentication and role-based access control
- [ ] Customizable pipeline stages and roles
- [ ] Stage-specific data capture with form builder
- [ ] Context-preserving lead handoffs between stages
- [ ] Internal team notes (not visible to customers)
- [ ] Assignment and routing logic
- [ ] Manager oversight across all conversations
- [ ] Real-time notifications for assignments and messages
- [ ] Search and filtering across conversations
- [ ] Activity timeline showing all lead interactions

### Out of Scope

- CRM integrations (Odoo, HubSpot, etc.) — deferred to v2, focus on core value first
- Multi-channel support (email, SMS, Facebook) — WhatsApp-only for v1
- Voice/video calls — messaging only
- AI chatbot auto-responses — human-only responses in v1
- Mobile native apps — desktop-first web application
- Progressive Web App features — standard responsive web for v1
- Advanced analytics and reporting — basic metrics only
- Automation workflows — manual processes only in v1
- White-label customization — single brand for v1

## Context

**Product Positioning:**
- Building as SaaS product, not internal tool
- Target customers are SMBs with 3-10 person sales teams
- Competing with personal WhatsApp usage (scattered, no handoffs) and generic team inbox tools (no sales pipeline integration)

**Technical Environment:**
- Must work on serverless infrastructure (Vercel, AWS Lambda compatibility preferred)
- Desktop browser as primary interface, mobile-responsive secondary
- Real-time updates required but must work in serverless context (SSE, polling, or managed WebSocket services)

**Success Criteria:**
- "Done" when end-to-end flow works: customer messages, lead gets assigned, moves through stages with handoffs, rep responds with full context
- Beta-quality acceptable - core features work, can gather customer feedback, some rough edges OK

## Constraints

- **WhatsApp API**: Meta Cloud API (direct from Meta) — free messaging tier, requires Facebook Business Manager setup
- **Infrastructure**: Serverless-friendly architecture — must work on platforms like Vercel, Netlify, AWS Lambda
- **Multi-tenancy**: True multi-tenant with shared deployment — all customers on one instance, data isolated by tenant ID
- **Timeline**: Aspirational 10-week goal — quality matters more than deadline, ship when core value is proven
- **Customization**: Pipeline stages, roles, and forms must be customer-configurable — no fixed 3-stage model

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Defer CRM integrations to v2 | Focus on proving core value (context-preserving handoffs) before complex integrations | — Pending |
| Meta Cloud API over 360dialog | Free messaging tier reduces customer acquisition cost, complexity acceptable for SaaS | — Pending |
| Desktop-first interface | Sales reps work from computers, mobile is secondary use case | — Pending |
| Configurable stages/roles/forms | Different businesses have different sales processes, flexibility is competitive advantage | — Pending |
| Serverless-compatible architecture | Reduces infrastructure costs and complexity for SaaS deployment | — Pending |

---
*Last updated: 2026-02-05 after initialization*
