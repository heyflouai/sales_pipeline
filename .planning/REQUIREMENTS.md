# Requirements: WhatsApp Team Inbox for Sales Teams

**Defined:** 2026-02-05
**Core Value:** Sales leads successfully move through pipeline stages with zero context loss - every handoff preserves full conversation history, structured data, and team notes.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Authentication

- [ ] **AUTH-01**: User can sign up with email and password
- [ ] **AUTH-02**: User can log in with email and password
- [ ] **AUTH-03**: User session persists across browser refresh
- [ ] **AUTH-04**: User can verify email address after signup
- [ ] **AUTH-05**: User can reset password via email link

### WhatsApp Messaging

- [ ] **WHATSAPP-01**: User can send text messages to customers via WhatsApp
- [ ] **WHATSAPP-02**: User can receive customer WhatsApp messages in real-time
- [ ] **WHATSAPP-03**: User can send media files (images, PDFs, documents) via WhatsApp
- [ ] **WHATSAPP-04**: User can receive media files from customers
- [ ] **WHATSAPP-05**: User can see message status (sent, delivered, read)
- [ ] **WHATSAPP-06**: System tracks 24-hour conversation window status
- [ ] **WHATSAPP-07**: User sees countdown timer for active session ("Reply within 3h 24m")
- [ ] **WHATSAPP-08**: User sees "Session expired - use template" when 24h window closed
- [ ] **WHATSAPP-09**: User can view all message history even after 24-hour window expires
- [ ] **WHATSAPP-10**: User can select and send pre-approved message template when session expired
- [ ] **WHATSAPP-11**: System opens new 24-hour window when customer replies to template

### Message Templates

- [ ] **TEMPLATE-01**: Admin can create message templates
- [ ] **TEMPLATE-02**: Admin can submit templates to Meta for approval
- [ ] **TEMPLATE-03**: User can select from approved templates when sending after 24h
- [ ] **TEMPLATE-04**: System shows template approval status (pending, approved, rejected)
- [ ] **TEMPLATE-05**: Templates support variables ({{name}}, {{company}}, etc.)

### Team Inbox & Access Control

- [ ] **INBOX-01**: Manager can view ALL conversations regardless of assignment
- [ ] **INBOX-02**: Manager can see all pipeline stages for all conversations
- [ ] **INBOX-03**: Manager can see which rep is assigned to each conversation
- [ ] **INBOX-04**: Rep can view conversations currently assigned to them
- [ ] **INBOX-05**: Rep can view history of conversations previously assigned to them
- [ ] **INBOX-06**: Previous rep needs approval from current rep to reclaim conversation
- [ ] **INBOX-07**: Manager can reassign conversation to any rep without approval
- [ ] **INBOX-08**: User receives real-time notification when assigned a conversation
- [ ] **INBOX-09**: User receives real-time notification when new message arrives on assigned conversation
- [ ] **INBOX-10**: System enforces row-level security (reps cannot access unassigned conversations)

### Sales Pipeline

- [ ] **PIPELINE-01**: Admin can create customizable pipeline stages (names, order)
- [ ] **PIPELINE-02**: Admin can edit or delete pipeline stages
- [ ] **PIPELINE-03**: Each WhatsApp conversation is linked to a deal card in pipeline
- [ ] **PIPELINE-04**: User can view pipeline as Kanban board with deal cards
- [ ] **PIPELINE-05**: User can drag-drop deal between stages
- [ ] **PIPELINE-06**: Moving deal to new stage triggers assignment change to appropriate rep
- [ ] **PIPELINE-07**: Stage change preserves full conversation history and context
- [ ] **PIPELINE-08**: Pipeline stage persists even when conversation becomes dormant (24h+ no reply)
- [ ] **PIPELINE-09**: User can define stage-specific data forms (different fields per stage)
- [ ] **PIPELINE-10**: User must complete required fields before moving to next stage
- [ ] **PIPELINE-11**: Previous stage data visible as read-only when viewing later stages

### Internal CRM

- [ ] **CRM-01**: Admin can define custom fields for contacts (field name, type, required/optional)
- [ ] **CRM-02**: System supports field types: text, number, dropdown, date, boolean
- [ ] **CRM-03**: User can add/edit custom field values on contact profile
- [ ] **CRM-04**: User can view all custom fields in contact sidebar
- [ ] **CRM-05**: Contact profile shows: name, phone, company, custom fields
- [ ] **CRM-06**: User can track lead details: status, products interested in, deal value
- [ ] **CRM-07**: Custom fields can be stage-specific (only visible at certain pipeline stages)
- [ ] **CRM-08**: System validates custom field data types (number fields only accept numbers, etc.)

### Context Preservation

- [ ] **CONTEXT-01**: User can view complete conversation history for any contact
- [ ] **CONTEXT-02**: Message history shows all messages regardless of who sent them
- [ ] **CONTEXT-03**: User can add internal notes to conversations (not visible to customer)
- [ ] **CONTEXT-04**: Internal notes display author name and timestamp
- [ ] **CONTEXT-05**: All team members with access can view internal notes
- [ ] **CONTEXT-06**: Activity timeline shows: messages, stage changes, assignments, notes
- [ ] **CONTEXT-07**: Activity timeline is chronologically sorted
- [ ] **CONTEXT-08**: System tracks conversation status: active, dormant, expired
- [ ] **CONTEXT-09**: User can filter timeline by event type (messages only, notes only, etc.)

### Contact Management

- [ ] **CONTACT-01**: System auto-creates contact when first WhatsApp message received
- [ ] **CONTACT-02**: User can manually create contacts
- [ ] **CONTACT-03**: User can search conversations by contact name, phone, company
- [ ] **CONTACT-04**: User can filter conversations by label, assignment, date range
- [ ] **CONTACT-05**: User can add multiple labels/tags to contacts
- [ ] **CONTACT-06**: User can create custom labels
- [ ] **CONTACT-07**: User can filter inbox by one or more labels
- [ ] **CONTACT-08**: Contact profile shows custom fields defined by admin

### User Roles & Permissions

- [ ] **ROLE-01**: System supports Admin/Manager role
- [ ] **ROLE-02**: System supports Agent/Rep role
- [ ] **ROLE-03**: Admin can create, edit, delete user accounts
- [ ] **ROLE-04**: Admin can assign roles to users
- [ ] **ROLE-05**: Manager can view all conversations across all stages
- [ ] **ROLE-06**: Manager can reassign conversations between reps
- [ ] **ROLE-07**: Rep can view only conversations assigned to them
- [ ] **ROLE-08**: Rep can request approval to reclaim previously assigned conversation
- [ ] **ROLE-09**: System logs all assignment changes (who, when, from/to)
- [ ] **ROLE-10**: Previous rep receives notification when reassignment happens

### Analytics

- [ ] **ANALYTICS-01**: Manager can view dashboard with total conversation count
- [ ] **ANALYTICS-02**: Dashboard shows average response time
- [ ] **ANALYTICS-03**: Dashboard shows conversations by pipeline stage (funnel chart)
- [ ] **ANALYTICS-04**: Dashboard shows conversations handled per rep
- [ ] **ANALYTICS-05**: Dashboard shows new conversations (today, this week, this month)
- [ ] **ANALYTICS-06**: Manager can filter analytics by date range
- [ ] **ANALYTICS-07**: Manager can filter analytics by rep

### Multi-Tenant Architecture

- [ ] **TENANT-01**: Each customer organization has isolated data (tenant_id on all tables)
- [ ] **TENANT-02**: Database enforces tenant isolation via Row-Level Security policies
- [ ] **TENANT-03**: Users can only access data for their organization
- [ ] **TENANT-04**: Admin can invite users to their organization
- [ ] **TENANT-05**: User belongs to exactly one organization
- [ ] **TENANT-06**: WhatsApp Business number is unique per organization

## v1.x Requirements

Deferred to post-launch, tracked but not in current roadmap.

### CRM Export & Integration

- **EXPORT-01**: User can export contacts to CSV
- **EXPORT-02**: User can export conversations to CSV
- **EXPORT-03**: System can transfer data to Odoo (one-way)
- **EXPORT-04**: System can transfer data to Salesforce (one-way)
- **EXPORT-05**: Admin can configure field mapping for CRM export
- **EXPORT-06**: User can trigger manual export to connected CRM

### Advanced Features

- **ADVANCED-01**: Auto-assignment round-robin for new conversations
- **ADVANCED-02**: @Mentions in internal notes with notifications
- **ADVANCED-03**: Conversation escalation to manager with priority flag
- **ADVANCED-04**: SLA rules with breach notifications
- **ADVANCED-05**: Smart routing by lead quality/source

## Out of Scope

Explicitly excluded from v1. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Real-time bidirectional CRM sync | Too complex for v1, one-way export in v1.x is sufficient |
| Multi-channel (email, SMS, Facebook, Instagram) | WhatsApp-only focus validates core value proposition first |
| Voice/video calling | Calls aren't logged/searchable, conflicts with context preservation |
| AI chatbots / auto-responses | Meta restricts general-purpose bots, sales needs human touch |
| Mobile native apps (iOS/Android) | Desktop-first approach, responsive web sufficient for v1 |
| Progressive Web App features | Standard responsive web for v1, PWA in v2 if needed |
| Advanced workflow automation | Keep simple stage-based triggers only, avoid complexity |
| Broadcast campaigns | Marketing automation out of scope, focus on 1:1 sales conversations |
| Contact enrichment (Apollo, Clearbit) | Manual data entry sufficient for v1 |
| Email notifications | In-app notifications only for v1, email in v1.x |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Pending |
| AUTH-02 | Phase 1 | Pending |
| AUTH-03 | Phase 1 | Pending |
| AUTH-04 | Phase 1 | Pending |
| AUTH-05 | Phase 1 | Pending |
| TENANT-01 | Phase 1 | Pending |
| TENANT-02 | Phase 1 | Pending |
| TENANT-03 | Phase 1 | Pending |
| TENANT-04 | Phase 1 | Pending |
| TENANT-05 | Phase 1 | Pending |
| TENANT-06 | Phase 1 | Pending |
| ROLE-01 | Phase 1 | Pending |
| ROLE-02 | Phase 1 | Pending |
| ROLE-03 | Phase 1 | Pending |
| ROLE-04 | Phase 1 | Pending |
| WHATSAPP-01 | Phase 2 | Pending |
| WHATSAPP-02 | Phase 2 | Pending |
| WHATSAPP-03 | Phase 2 | Pending |
| WHATSAPP-04 | Phase 2 | Pending |
| WHATSAPP-05 | Phase 2 | Pending |
| WHATSAPP-06 | Phase 2 | Pending |
| WHATSAPP-07 | Phase 2 | Pending |
| WHATSAPP-08 | Phase 2 | Pending |
| WHATSAPP-09 | Phase 2 | Pending |
| WHATSAPP-10 | Phase 2 | Pending |
| WHATSAPP-11 | Phase 2 | Pending |
| TEMPLATE-01 | Phase 2 | Pending |
| TEMPLATE-02 | Phase 2 | Pending |
| TEMPLATE-03 | Phase 2 | Pending |
| TEMPLATE-04 | Phase 2 | Pending |
| TEMPLATE-05 | Phase 2 | Pending |
| CONTACT-01 | Phase 2 | Pending |
| CONTACT-02 | Phase 2 | Pending |
| INBOX-08 | Phase 2 | Pending |
| INBOX-09 | Phase 2 | Pending |
| PIPELINE-01 | Phase 3 | Pending |
| PIPELINE-02 | Phase 3 | Pending |
| PIPELINE-03 | Phase 3 | Pending |
| PIPELINE-04 | Phase 3 | Pending |
| PIPELINE-05 | Phase 3 | Pending |
| PIPELINE-06 | Phase 3 | Pending |
| PIPELINE-07 | Phase 3 | Pending |
| PIPELINE-08 | Phase 3 | Pending |
| PIPELINE-09 | Phase 3 | Pending |
| PIPELINE-10 | Phase 3 | Pending |
| PIPELINE-11 | Phase 3 | Pending |
| CRM-01 | Phase 3 | Pending |
| CRM-02 | Phase 3 | Pending |
| CRM-03 | Phase 3 | Pending |
| CRM-04 | Phase 3 | Pending |
| CRM-05 | Phase 3 | Pending |
| CRM-06 | Phase 3 | Pending |
| CRM-07 | Phase 3 | Pending |
| CRM-08 | Phase 3 | Pending |
| CONTEXT-01 | Phase 3 | Pending |
| CONTEXT-02 | Phase 3 | Pending |
| CONTEXT-03 | Phase 3 | Pending |
| CONTEXT-04 | Phase 3 | Pending |
| CONTEXT-05 | Phase 3 | Pending |
| CONTEXT-06 | Phase 3 | Pending |
| CONTEXT-07 | Phase 3 | Pending |
| CONTEXT-08 | Phase 3 | Pending |
| CONTEXT-09 | Phase 3 | Pending |
| CONTACT-03 | Phase 3 | Pending |
| CONTACT-04 | Phase 3 | Pending |
| CONTACT-05 | Phase 3 | Pending |
| CONTACT-06 | Phase 3 | Pending |
| CONTACT-07 | Phase 3 | Pending |
| CONTACT-08 | Phase 3 | Pending |
| INBOX-01 | Phase 3 | Pending |
| INBOX-02 | Phase 3 | Pending |
| INBOX-03 | Phase 3 | Pending |
| INBOX-04 | Phase 3 | Pending |
| INBOX-05 | Phase 3 | Pending |
| INBOX-06 | Phase 3 | Pending |
| INBOX-07 | Phase 3 | Pending |
| INBOX-10 | Phase 3 | Pending |
| ROLE-05 | Phase 3 | Pending |
| ROLE-06 | Phase 3 | Pending |
| ROLE-07 | Phase 3 | Pending |
| ROLE-08 | Phase 3 | Pending |
| ROLE-09 | Phase 3 | Pending |
| ROLE-10 | Phase 3 | Pending |
| ANALYTICS-01 | Phase 4 | Pending |
| ANALYTICS-02 | Phase 4 | Pending |
| ANALYTICS-03 | Phase 4 | Pending |
| ANALYTICS-04 | Phase 4 | Pending |
| ANALYTICS-05 | Phase 4 | Pending |
| ANALYTICS-06 | Phase 4 | Pending |
| ANALYTICS-07 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 73 total
- Mapped to phases: 73 (100%)
- Unmapped: 0

**Phase breakdown:**
- Phase 1 (Foundation & Multi-Tenant Security): 15 requirements
- Phase 2 (WhatsApp Core & Real-Time Messaging): 20 requirements
- Phase 3 (Pipeline & Context Preservation): 31 requirements
- Phase 4 (Analytics & Production Readiness): 7 requirements

---
*Requirements defined: 2026-02-05*
*Last updated: 2026-02-05 after roadmap creation*
