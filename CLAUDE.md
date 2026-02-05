# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**WhatsApp Team Inbox for Sales Teams** - A centralized WhatsApp Business messaging platform enabling sales teams to collaboratively manage customer conversations through a shared inbox. The system replaces fragmented individual WhatsApp accounts with a unified workspace where multiple sales representatives can seamlessly hand off leads through different pipeline stages.

**Target Market:** SMBs with multi-stage sales pipelines
**Product Owner:** HeyFlou

## Architecture

### System Components

- **Frontend:** Modern web application (React/Vue recommended) with responsive design and PWA capabilities
- **Backend:** RESTful API server (Node.js/Python/Go)
- **Database:** Relational database (PostgreSQL or MySQL)
- **Real-Time:** WebSocket server for live message updates
- **Message Queue:** Asynchronous task processing (Redis/RabbitMQ)
- **File Storage:** Cloud storage for media files (S3/CloudFlare R2)

### WhatsApp Integration

Use WhatsApp Business API via one of these providers:
- **360dialog** (recommended for simplicity, ~$30-50/month)
- **Meta Cloud API** (direct from Meta, free messaging)
- **Twilio WhatsApp API** (pay-per-message)

Must support: text messages, media files (images/docs/audio), webhooks, message templates, delivery receipts.

## Core Domain Concepts

### Sales Pipeline Stages

1. **New Lead** → Auto-assigned to Rep 1 (initial contact)
2. **Qualified** → Handed off to Rep 2 (needs assessment)
3. **Needs Assessment** → Rep 2 conducts detailed analysis
4. **Proposal Sent** → Handed off to Rep 3 (payment/closing)
5. **Payment** → Rep 3 handles final negotiation
6. **Won/Lost** → Final deal status

### Key Entities

- **Contact:** Customer who messaged the WhatsApp Business number
- **Lead:** Contact currently in the sales pipeline with assigned rep
- **Assignment:** Designates which sales rep is responsible for a contact
- **Handoff:** Transfer of lead from one rep to another with context preservation
- **Stage Data:** Structured form data collected at each pipeline stage
- **Internal Notes:** Private team notes not visible to customers

### User Roles & Permissions

**Manager:**
- View all contacts and conversations
- Override assignments and reassign leads
- Access full analytics dashboard
- Manage users and system configuration

**Rep 1 (Initial Contact):**
- See only "New Lead" stage assigned to them
- Fill qualification form
- Hand off to Rep 2 (Needs Assessment)

**Rep 2 (Needs Assessment):**
- See only "Qualified"/"Assessment" stage assigned to them
- View previous stage data (read-only)
- Fill assessment form
- Hand off to Rep 3

**Rep 3 (Payment/Closing):**
- See only "Proposal Sent"/"Payment" stage assigned to them
- View all previous stage data (read-only)
- Fill payment form
- Mark deals as Won/Lost

**Row-level security:** Users can only see leads assigned to them (except managers).

## Database Schema

### Core Tables

- `users` - Team member accounts with roles
- `contacts` - Customer records (phone, name, company, email)
- `messages` - All WhatsApp messages with delivery status
- `stage_data` - Structured data from stage-specific forms
- `assignments` - Lead assignment history (who, when)
- `notes` - Internal team notes
- `handoffs` - Stage transition log with context
- `crm_mappings` - CRM field mappings
- `notifications` - Notification queue

## CRM Integration

### Primary Integration: Odoo

**Sync Requirements:**
- Real-time bidirectional sync (webhooks preferred, fallback: 5min polling)
- Create/update contacts in Odoo when WhatsApp leads come in
- Create opportunities from qualified leads
- Log all WhatsApp messages as Odoo chatter notes
- Update Odoo stage when inbox stage changes
- Sync custom field data from stage forms

**Field Mappings:**
- Contact Name → partner.name
- Phone → partner.phone
- Company → partner.parent_id
- Current Stage → lead.stage_id
- Quote Amount → lead.expected_revenue
- Notes → mail.message.body

**Conflict Resolution:**
- Inbox wins for conversation data
- Odoo wins for contact details (configurable)

### Generic CRM Webhook

Support outbound webhooks for non-integrated CRMs:
- Events: contact.created, contact.updated, stage.changed, message.sent
- Inbound webhook endpoint for CRM updates

## Critical Workflows

### New Lead Workflow

1. Customer sends WhatsApp message
2. System receives webhook from WhatsApp API
3. Auto-create contact record if new
4. Auto-assign to Rep 1 (round-robin or rule-based)
5. Send notification to assigned rep
6. Rep 1 responds and qualifies lead
7. Rep 1 fills qualification form (required fields)
8. Rep 1 clicks "Assign to Next Stage"
9. System moves to "Qualified", assigns to Rep 2
10. Conversation history and context travel with lead

### Handoff Requirements

- Must complete stage-specific form before handoff
- Optional handoff notes for context
- Create audit trail (who, when, notes)
- Trigger notification to receiving rep
- Optional auto-message to customer
- Preserve complete conversation history

### Manager Intervention

- View all conversations across team
- Filter by stage, rep, status, overdue response
- Jump into any conversation
- Override assignments
- Add notes with @mentions
- Track performance metrics

## Real-Time Requirements

- New messages appear in UI within 2 seconds
- WebSocket auto-reconnect if connection drops
- Real-time updates for: messages, assignments, stage changes, notes

## Performance Targets

- Page load: < 2 seconds
- Message send: < 1 second
- Search results: < 1 second
- Dashboard load: < 3 seconds
- Support 50+ concurrent users
- Handle 10,000+ messages/day
- Store 1M+ messages
- 99.9% uptime

## Security Requirements

**Authentication:**
- JWT tokens for session management
- Password strength enforcement
- Account lockout after failed attempts

**Authorization:**
- Role-based access control (RBAC)
- Row-level security (users only see assigned contacts)
- API endpoint protection

**Data Security:**
- Encrypt passwords (bcrypt/argon2)
- Encrypt CRM tokens at rest
- HTTPS/TLS for all communications
- Input sanitization (prevent SQL injection/XSS)
- Rate limiting on API endpoints

## Development Phases

**Phase 1 - Foundation (Weeks 1-2):**
- Database schema
- WhatsApp API integration (send/receive)
- Basic auth and user management
- Simple conversation view

**Phase 2 - Core Features (Weeks 3-4):**
- Assignment and routing logic
- Stage pipeline implementation
- Stage-specific forms
- Internal notes

**Phase 3 - Collaboration (Weeks 5-6):**
- Handoff workflow
- Manager dashboard
- Role-based permissions
- Real-time WebSocket updates

**Phase 4 - CRM Integration (Weeks 7-8):**
- Odoo connection and sync
- Field mapping configuration
- Webhook handling

**Phase 5 - Polish & Launch (Weeks 9-10):**
- UI/UX refinements
- Performance optimization
- Bug fixes and testing

## Out of Scope (V1)

- Multi-channel support (email, SMS, Facebook)
- Voice/video calls
- AI chatbot auto-responses
- Advanced analytics (sentiment analysis)
- White-label/multi-tenant
- Native mobile apps
- Zapier integration

## Key Design Principles

**Simplicity First:**
- Clean, uncluttered interface
- Minimal clicks to complete tasks
- WhatsApp-inspired chat interface (familiar pattern)

**Context Preservation:**
- Complete conversation history travels with lead
- Previous stage data visible (read-only)
- Activity timeline shows all events

**Collaboration:**
- Multiple users access same WhatsApp number
- Internal notes for team communication
- Manager oversight across all conversations

## Important Notes

- **Security:** Never expose customer conversations to unauthorized users. Strict row-level security is critical.
- **Context Loss Prevention:** All handoffs must preserve complete conversation history and stage data.
- **CRM Sync Accuracy:** Bidirectional sync must be reliable. Log all sync events for debugging.
- **Real-Time Updates:** WebSocket failures should auto-reconnect. Consider polling fallback.
- **WhatsApp 24-Hour Window:** Use message templates for notifications outside the 24-hour customer-initiated conversation window.
- **Media Handling:** Store WhatsApp media files permanently (customer may send quotes, invoices, site photos).
