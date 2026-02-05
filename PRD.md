# Product Requirements Document (PRD)

## WhatsApp Team Inbox for Sales Teams

**Version:** 1.0  
**Date:** February 5, 2026  
**Product Owner:** HeyFlou  
**Target Market:** SMBs with multi-stage sales pipelines

---

## 1. Executive Summary

### 1.1 Product Vision

A centralized WhatsApp Business messaging platform that enables sales teams to collaboratively manage customer conversations through a shared inbox. The system replaces fragmented individual WhatsApp accounts with a unified workspace where multiple sales representatives can seamlessly hand off leads through different pipeline stages while maintaining complete conversation history and context.

### 1.2 Problem Statement

**Current Pain Points:**
- Sales teams use personal WhatsApp accounts, causing conversation silos
- No visibility into team-wide customer interactions
- Lead context is lost during handoffs between sales stages
- Managers cannot oversee or intervene in sales conversations
- Customer data scattered across individual phones
- No integration with existing CRM systems

### 1.3 Solution Overview

A web-based application that connects a single WhatsApp Business API account to a multi-user interface where:
- All team members access the same WhatsApp conversations
- Sales reps see only leads assigned to them (unless manager)
- Conversation history and context travels with the lead through pipeline stages
- Managers have full visibility across all conversations and stages
- Real-time synchronization with CRM systems (Odoo, etc.)

---

## 2. Product Goals & Success Metrics

### 2.1 Primary Goals

1. **Centralize Communication**: Single WhatsApp number for entire business
2. **Enable Collaboration**: Multiple users managing conversations simultaneously
3. **Preserve Context**: Complete conversation history accessible to all relevant team members
4. **Streamline Handoffs**: Frictionless lead transfers between sales stages
5. **Provide Oversight**: Manager visibility into all team activities

### 2.2 Success Metrics

**Operational Metrics:**
- Average response time to customer messages
- Number of successful lead handoffs per day
- Time saved vs. manual WhatsApp management
- CRM data sync accuracy rate

**Business Metrics:**
- Sales conversion rate improvement
- Average deal cycle time reduction
- Customer satisfaction scores
- Team productivity increase

---

## 3. User Personas

### 3.1 Primary Users

#### **Persona 1: Sales Representative (Rep 1 - Initial Contact)**
**Role:** First point of contact for new leads  
**Responsibilities:**
- Respond to new inbound WhatsApp messages
- Qualify leads through initial conversation
- Collect basic information (name, company, budget, needs)
- Determine if lead should progress to next stage
- Hand off qualified leads to assessment team

**Key Needs:**
- See only new, unassigned leads
- Quick access to conversation history
- Simple form to log qualification data
- One-click handoff to next rep
- Mobile-friendly interface for on-the-go responses

---

#### **Persona 2: Sales Representative (Rep 2 - Needs Assessment)**
**Role:** Detailed needs analysis and solution design  
**Responsibilities:**
- Receive qualified leads from Rep 1
- Review qualification data and conversation history
- Conduct detailed needs assessment
- Prepare quotes or proposals
- Hand off to payment/closing team

**Key Needs:**
- See only leads assigned to them in "qualified" stage
- Access to all previous conversation context
- View Rep 1's notes and collected data
- Form to log assessment findings
- Ability to send documents/images via WhatsApp

---

#### **Persona 3: Sales Representative (Rep 3 - Payment/Closing)**
**Role:** Final negotiation and deal closure  
**Responsibilities:**
- Receive leads ready to purchase
- Review full lead history and proposal details
- Handle payment processing
- Coordinate delivery/onboarding
- Mark deals as won or lost

**Key Needs:**
- See leads in "proposal sent" or "payment" stage
- Complete view of all previous interactions
- Access to pricing and proposal data
- Integration with payment systems
- Ability to update deal status in CRM

---

#### **Persona 4: Sales Manager**
**Role:** Team oversight and performance management  
**Responsibilities:**
- Monitor all active conversations across team
- Intervene in stuck or problematic deals
- Assign or reassign leads manually
- Track team performance metrics
- Ensure proper lead routing and follow-up

**Key Needs:**
- Bird's-eye view of all conversations
- Filter by stage, rep, status, date
- Jump into any conversation
- Override assignments
- Dashboard with key metrics

---

### 3.2 Secondary Users

#### **Business Owner/Administrator**
**Role:** System configuration and user management  
**Responsibilities:**
- Set up WhatsApp Business API connection
- Configure CRM integrations
- Manage user accounts and permissions
- Define sales pipeline stages
- Set up automation rules

---

## 4. Core Features & Requirements

### 4.1 Feature Category: WhatsApp Integration

#### Feature 4.1.1: WhatsApp Business API Connection
**Description:** Connect client's WhatsApp Business number to the platform

**Requirements:**
- Support for WhatsApp Business API (Meta Cloud API or partner APIs like 360dialog)
- One-time setup wizard for API credentials
- Webhook configuration for receiving messages
- Support for text, images, documents, and voice messages
- Media file storage and retrieval
- Message delivery status tracking (sent, delivered, read)

**User Story:**
*"As a business owner, I want to connect my WhatsApp Business number to the platform so my team can start managing customer conversations centrally."*

---

#### Feature 4.1.2: Send & Receive Messages
**Description:** Real-time messaging with customers through WhatsApp

**Requirements:**
- Display incoming customer messages in real-time
- Send text messages from web interface
- Upload and send images, PDFs, documents
- Support for message templates (for notifications outside 24-hour window)
- Display customer's profile picture and name (if available)
- Show typing indicators
- Message read receipts

**User Story:**
*"As a sales rep, I want to respond to customer WhatsApp messages from my computer so I can type faster and access other tools simultaneously."*

---

### 4.2 Feature Category: Contact & Conversation Management

#### Feature 4.2.1: Contact Database
**Description:** Centralized storage of all customer contacts

**Requirements:**
- Auto-create contact record on first message
- Store: phone number, name, company, email
- Link contact to all their messages
- View contact profile with summary information
- Search contacts by name, phone, company
- Manual contact creation option
- Import contacts from CSV

**User Story:**
*"As a manager, I want to see a list of all customers who have contacted us so I can understand our lead volume and quality."*

---

#### Feature 4.2.2: Conversation View
**Description:** Chat interface displaying full message history

**Requirements:**
- WhatsApp-like chat interface
- Chronological message display (oldest to newest)
- Clear visual distinction between inbound/outbound messages
- Timestamp for each message
- Display sender name for outbound messages (which rep sent it)
- Infinite scroll to load older messages
- Media previews (images, documents)
- Message status indicators (sent, delivered, read, failed)

**User Story:**
*"As a sales rep, I want to see the entire conversation history with a customer so I understand the context before responding."*

---

#### Feature 4.2.3: Assignment & Routing
**Description:** Lead assignment to specific sales reps

**Requirements:**
- Auto-assign new leads to Rep 1 (round-robin or rule-based)
- Manual assignment override by manager
- Filter views: "Assigned to Me", "Unassigned", "All"
- Assignment history log
- Reassignment capability
- Notification to newly assigned rep (email, in-app, optional SMS)
- Assignment rules engine (e.g., assign based on keyword, time of day, workload)

**User Story:**
*"As a sales manager, I want new leads to be automatically distributed evenly among my Rep 1 team so no one is overwhelmed."*

---

### 4.3 Feature Category: Sales Pipeline Management

#### Feature 4.3.1: Pipeline Stages
**Description:** Track leads through defined sales stages

**Requirements:**
- Pre-defined stages: New Lead → Qualified → Needs Assessment → Proposal Sent → Payment → Won/Lost
- Customizable stage names and order
- Visual stage indicator on each contact
- Stage change triggers assignment to appropriate rep role
- Stage history tracking (when moved, by whom)
- Filter conversations by stage
- Dashboard showing lead count per stage (funnel view)

**User Story:**
*"As a sales rep, I want to mark a lead as 'Qualified' so it automatically moves to the assessment team with all our conversation history."*

---

#### Feature 4.3.2: Stage-Specific Data Forms
**Description:** Structured data collection at each pipeline stage

**Requirements:**
- **Stage 1 (Qualification) Form Fields:**
  - Company Name
  - Industry/Business Type
  - Budget Range
  - Decision Maker (Yes/No)
  - Urgency/Timeline
  - Product/Service Interest
  - Open text notes

- **Stage 2 (Assessment) Form Fields:**
  - Detailed Requirements
  - Recommended Solution
  - Estimated Value/Quote Amount
  - Installation/Delivery Timeline
  - Competitor Comparison
  - Open text notes

- **Stage 3 (Payment) Form Fields:**
  - Final Quote Amount
  - Payment Method
  - Contract Signed (Yes/No)
  - Delivery/Start Date
  - Open text notes

**Additional Requirements:**
- Forms visible only to reps at that stage (and managers)
- Previous stage data displayed as read-only reference
- Required fields enforcement before stage progression
- Auto-save form data

**User Story:**
*"As Rep 1, I want to fill out a quick form with qualification details so Rep 2 has structured information instead of just reading through the entire chat."*

---

#### Feature 4.3.3: Handoff Workflow
**Description:** Transfer leads between reps with context

**Requirements:**
- "Assign to Next Stage" button visible on contact detail page
- Confirmation modal showing:
  - Next stage name
  - Next rep who will receive the lead
  - Required fields check (must complete stage form)
  - Optional handoff notes field
- Update contact's stage and assigned rep in one action
- Create handoff log entry (timestamp, from/to users, notes)
- Trigger notification to receiving rep
- Optional: Auto-send WhatsApp message to customer ("Our specialist will contact you shortly")
- Block current rep from further messaging (optional setting)

**User Story:**
*"As Rep 1, I want to hand off a qualified lead to Rep 2 with one click and add a note like 'Customer is price-sensitive' so they have extra context."*

---

### 4.4 Feature Category: Collaboration & Context

#### Feature 4.4.1: Internal Notes
**Description:** Private notes not visible to customer

**Requirements:**
- Add notes to any contact
- Notes displayed in separate panel (not mixed with WhatsApp messages)
- Timestamp and author name on each note
- Edit/delete own notes (managers can edit any)
- Notes visible to all team members with access to that contact
- Search within notes
- Pin important notes to top

**User Story:**
*"As a sales rep, I want to leave a note saying 'Customer mentioned competitor quote was $3,500' so my teammate knows the pricing context."*

---

#### Feature 4.4.2: Activity Timeline
**Description:** Chronological log of all actions on a lead

**Requirements:**
- Display all events: messages sent/received, stage changes, assignments, notes added, form updates
- Unified timeline view mixing messages and system events
- Filter timeline by event type
- Click on event to see details
- Auto-generate timeline entries for system actions

**Example Timeline:**
```
[10:00 AM] Customer sent message: "I need cameras"
[10:05 AM] Rep 1 (Maria) sent message: "Happy to help..."
[10:15 AM] Rep 1 (Maria) updated Qualification Form
[10:16 AM] Lead moved to "Qualified" stage
[10:16 AM] Assigned to Rep 2 (Carlos)
[10:20 AM] Rep 2 (Carlos) added note: "Reviewing requirements"
```

**User Story:**
*"As a manager, I want to see a timeline of everything that happened with a lead so I can understand where delays occurred."*

---

### 4.5 Feature Category: User Management & Permissions

#### Feature 4.5.1: User Roles
**Description:** Role-based access control

**Roles & Permissions:**

**Manager:**
- View all contacts and conversations
- Access all stages and forms
- Manually assign/reassign leads
- View all internal notes
- Access analytics dashboard
- Manage user accounts
- Configure system settings

**Rep 1 (Initial Contact):**
- View contacts in "New Lead" stage assigned to them
- Send/receive messages for assigned contacts
- Fill Stage 1 qualification form
- Assign to Stage 2
- View conversation history

**Rep 2 (Assessment):**
- View contacts in "Qualified" or "Assessment" stage assigned to them
- View all previous stage data (read-only)
- Send/receive messages for assigned contacts
- Fill Stage 2 assessment form
- Assign to Stage 3
- View conversation history

**Rep 3 (Closing):**
- View contacts in "Proposal Sent" or "Payment" stage assigned to them
- View all previous stage data (read-only)
- Send/receive messages for assigned contacts
- Fill Stage 3 payment form
- Mark as Won/Lost
- View conversation history

**User Story:**
*"As Rep 2, I should only see leads assigned to me at my stage, not Rep 1's new leads, so I can focus on my work."*

---

#### Feature 4.5.2: User Account Management
**Description:** Create and manage team member accounts

**Requirements:**
- Add/remove users
- Assign role to each user
- Set user as active/inactive
- Edit user details (name, email)
- Password reset functionality
- Email invitation for new users
- User activity log (last login, messages sent)

**User Story:**
*"As a business owner, I want to add a new sales rep to the system and assign them as 'Rep 1' so they can start handling new leads."*

---

### 4.6 Feature Category: CRM Integration

#### Feature 4.6.1: Real-Time CRM Sync
**Description:** Bidirectional sync with external CRM systems

**Supported CRMs (Priority Order):**
1. Odoo (primary focus)
2. HubSpot
3. Salesforce
4. Pipedrive
5. Generic REST API webhook

**Sync Capabilities:**

**From WhatsApp Inbox → CRM:**
- Create/update contact records
- Log all messages as activities/notes
- Update deal/opportunity stage
- Sync custom field data (from stage forms)
- Tag contacts
- Update deal value

**From CRM → WhatsApp Inbox:**
- Pull existing contact data
- Display CRM deal value in inbox
- Show CRM stage/status
- Display custom fields
- Trigger actions based on CRM updates (e.g., send WhatsApp when deal is marked "won" in CRM)

**Technical Requirements:**
- OAuth 2.0 authentication for CRM connections
- Webhook listeners for real-time updates from CRM
- Configurable field mapping (map inbox fields to CRM fields)
- Sync status dashboard (last sync time, errors)
- Conflict resolution rules (which system wins if data differs)
- Sync logs for debugging

**User Story:**
*"As a manager, I want all WhatsApp conversations automatically logged in Odoo so my team doesn't have to manually copy information."*

---

#### Feature 4.6.2: Odoo-Specific Integration
**Description:** Deep integration with Odoo CRM

**Features:**
- One-click Odoo connection via API key
- Map Odoo pipeline stages to inbox stages
- Sync Odoo contact fields (name, email, company, phone)
- Create Odoo opportunities from new WhatsApp leads
- Update Odoo opportunity stage when inbox stage changes
- Log WhatsApp messages as Odoo chatter notes
- Display Odoo opportunity details in inbox sidebar
- Trigger Odoo workflows from inbox actions
- Support for custom Odoo modules/fields

**User Story:**
*"As a business owner using Odoo, I want my sales team to work in the WhatsApp inbox while all data automatically appears in my Odoo CRM reports."*

---

### 4.7 Feature Category: Analytics & Reporting

#### Feature 4.7.1: Manager Dashboard
**Description:** Overview metrics and KPIs

**Metrics to Display:**
- Total conversations (today, this week, this month)
- New leads (today, this week, this month)
- Conversion rates by stage
- Average response time
- Conversations by stage (funnel chart)
- Top performing reps (by conversations handled, deals closed)
- Unresponded messages count
- Longest waiting customer
- Average time in each stage

**Visualizations:**
- Line chart: Conversations over time
- Funnel chart: Leads per stage
- Bar chart: Conversations per rep
- Gauge: Average response time

**User Story:**
*"As a manager, I want to see which reps are handling the most conversations and where leads are getting stuck in the pipeline."*

---

#### Feature 4.7.2: Conversation Reports
**Description:** Detailed reporting on conversations and outcomes

**Reports:**
- All conversations (filterable by date range, rep, stage, status)
- Export to CSV/Excel
- Won/Lost deals report
- Response time report (per rep, per stage)
- Handoff report (how long leads spend in each stage)
- Message volume report (inbound vs outbound)

**User Story:**
*"As a manager, I want to export a report of all conversations from last month to analyze our sales performance."*

---

### 4.8 Feature Category: Mobile Experience

#### Feature 4.8.1: Mobile-Responsive Web App
**Description:** Fully functional on mobile browsers

**Requirements:**
- Responsive layout adapting to phone screens
- Mobile-optimized conversation view
- Easy message input on mobile keyboard
- Swipe gestures for navigation
- Touch-friendly buttons and forms
- Push notifications via browser (web push)

**User Story:**
*"As a sales rep working remotely, I want to respond to customer WhatsApp messages from my phone's browser."*

---

#### Feature 4.8.2: Progressive Web App (PWA)
**Description:** Installable web app with offline capabilities

**Requirements:**
- Install prompt for "Add to Home Screen"
- App icon and splash screen
- Works in standalone mode (looks like native app)
- Basic offline functionality (view cached conversations)
- Background sync when connection restored
- Push notifications support

**User Story:**
*"As a sales rep, I want to install the WhatsApp inbox as an app on my phone so it feels like a native WhatsApp experience."*

---

### 4.9 Feature Category: Notifications

#### Feature 4.9.1: In-App Notifications
**Description:** Real-time alerts within the web application

**Triggers:**
- New message received on assigned contact
- Lead assigned to you
- Someone mentioned you in a note
- Stage change on contact you're watching
- Manager intervention on your conversation

**Notification Display:**
- Toast notification (bottom-right corner)
- Red badge count on navigation
- Sound alert (configurable on/off)
- Browser tab title update ("(1) New Message")

---

#### Feature 4.9.2: Email Notifications
**Description:** Email alerts for important events

**Configurable Per User:**
- New lead assigned to me
- New message on my active conversations
- Lead went too long without response (SLA breach)
- Manager assigns lead to me
- Daily digest of activity

**Email Content:**
- Event summary
- Link to conversation in web app
- Quick preview of message or context

**User Story:**
*"As a sales rep, I want to receive an email when a new lead is assigned to me so I don't miss it if I'm not logged in."*

---

#### Feature 4.9.3: SMS/Push Notifications (Optional)
**Description:** Mobile push or SMS for critical alerts

**Requirements:**
- Integrate with push service (OneSignal, Firebase)
- Send for high-priority events (new message, urgent lead)
- Respect user's notification preferences
- Deep link to specific conversation

---

### 4.10 Feature Category: Search & Filters

#### Feature 4.10.1: Global Search
**Description:** Search across all conversations and contacts

**Search Capabilities:**
- Full-text search in message content
- Search by contact name, phone, company
- Search in internal notes
- Search in stage data fields
- Highlight search terms in results
- Recent searches history

**User Story:**
*"As a manager, I want to search for 'competitor' to find all conversations where customers mentioned competitors."*

---

#### Feature 4.10.2: Advanced Filters
**Description:** Filter conversations by multiple criteria

**Filter Options:**
- Stage (New Lead, Qualified, etc.)
- Assigned To (specific rep or "Unassigned")
- Date range (created, last activity)
- Status (Active, Won, Lost, Archived)
- Tags (if tag feature implemented)
- Has unread messages
- Response time (overdue, within SLA)

**User Story:**
*"As a manager, I want to filter for all 'Qualified' leads from the last 7 days assigned to Rep 2 so I can review their pipeline."*

---

### 4.11 Feature Category: Automation (Future Phase)

#### Feature 4.11.1: Auto-Responders
**Description:** Automated WhatsApp replies based on triggers

**Use Cases:**
- After-hours auto-reply: "Thanks for contacting us! We're closed now but will respond first thing tomorrow."
- First-time contact welcome: "Hi! Thanks for reaching out. A team member will be with you shortly."
- Stage transition message: "Thank you! Our specialist will follow up with you soon."

**Requirements:**
- Configure trigger conditions (time, stage, keyword)
- Template library
- Variable insertion (customer name, company)
- Enable/disable per automation

---

#### Feature 4.11.2: Workflow Automation
**Description:** Triggered actions based on events

**Examples:**
- Auto-assign leads based on keyword in message
- Escalate to manager if no response in X hours
- Auto-move to "Lost" if customer says "not interested"
- Send follow-up reminder to rep if stage hasn't changed in X days
- Tag contacts based on message content

**Requirements:**
- Visual workflow builder (if/then logic)
- Pre-built templates for common workflows
- Test mode before activating

---

## 5. Technical Requirements

### 5.1 Architecture

**System Architecture:**
- **Frontend:** Web application (React, Vue, or similar modern framework)
- **Backend:** RESTful API server (Node.js, Python, or Go)
- **Database:** Relational database (PostgreSQL or MySQL)
- **Real-Time:** WebSocket server for live updates
- **Message Queue:** For asynchronous tasks (Redis/RabbitMQ)
- **File Storage:** Cloud storage for media files (S3, CloudFlare R2)

---

### 5.2 WhatsApp API Requirements

**API Provider Options:**
1. **Meta Cloud API** (direct from Meta)
   - Free messaging (only pay for authentication)
   - Requires Facebook Business Manager
   - More complex setup

2. **360dialog** (recommended for simplicity)
   - Managed WhatsApp Business API
   - ~$30-50/month
   - Easier setup and support

3. **Twilio WhatsApp API**
   - Pay-per-message model
   - Good for high-volume

**Capabilities Needed:**
- Send/receive text messages
- Send/receive media (images, documents, audio)
- Webhook for incoming messages
- Message templates for notifications
- Delivery receipts
- Business profile management

---

### 5.3 Database Schema (High-Level)

**Core Tables:**
- `users` - Team member accounts
- `contacts` - Customer records
- `messages` - All WhatsApp messages
- `stage_data` - Structured data from forms
- `assignments` - Lead assignment history
- `notes` - Internal notes
- `handoffs` - Stage transition log
- `crm_mappings` - CRM field mappings
- `notifications` - Notification queue

---

### 5.4 Performance Requirements

**Response Time:**
- Page load: < 2 seconds
- Message send: < 1 second
- Search results: < 1 second
- Dashboard load: < 3 seconds

**Scalability:**
- Support 50+ concurrent users
- Handle 10,000+ messages per day
- Store 1M+ messages in database
- 99.9% uptime

**Real-Time:**
- New message appears in UI within 2 seconds
- WebSocket connection auto-reconnects if dropped

---

### 5.5 Security Requirements

**Authentication:**
- Email/password login
- JWT tokens for session management
- Password strength requirements
- Account lockout after failed attempts

**Authorization:**
- Role-based access control (RBAC)
- Row-level security (users can only see assigned contacts)
- API endpoint protection

**Data Security:**
- Encrypt passwords (bcrypt/argon2)
- Encrypt sensitive data at rest (CRM tokens)
- HTTPS/TLS for all communications
- Sanitize user inputs to prevent SQL injection/XSS
- Rate limiting on API endpoints

**Compliance:**
- GDPR considerations (data deletion, export)
- Audit logs for critical actions

---

### 5.6 Browser Support

**Required:**
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

**Mobile:**
- iOS Safari (latest 2 versions)
- Chrome Mobile (latest 2 versions)

---

## 6. User Flows

### 6.1 Flow: New Lead Comes In

1. Customer sends first WhatsApp message: "I need security cameras"
2. **System:** Receives webhook from WhatsApp API
3. **System:** Creates new contact record (phone number, first message stored)
4. **System:** Auto-assigns to next available Rep 1 via round-robin
5. **System:** Sends notification to assigned Rep 1 (email + in-app)
6. **Rep 1:** Opens inbox, sees new contact in "My Leads" section
7. **Rep 1:** Clicks on contact, sees conversation
8. **Rep 1:** Types reply: "Happy to help! What type of facility?"
9. **System:** Sends message via WhatsApp API
10. **Customer:** Receives message in their WhatsApp app
11. **Rep 1:** Continues conversation, fills qualification form
12. **Rep 1:** Clicks "Assign to Needs Assessment"
13. **System:** Moves contact to "Qualified" stage, assigns to Rep 2
14. **System:** Sends notification to Rep 2
15. **Rep 2:** Opens inbox, sees new assigned lead with full conversation history

---

### 6.2 Flow: Rep 2 Handles Assessment

1. **Rep 2:** Receives notification of new assigned lead
2. **Rep 2:** Opens contact detail page
3. **Rep 2:** Reviews:
   - Full WhatsApp conversation history
   - Rep 1's qualification data (read-only)
   - Rep 1's handoff notes
4. **Rep 2:** Sends message: "Hi! I reviewed your requirements. Can I send you a detailed proposal?"
5. **Customer:** "Yes, please"
6. **Rep 2:** Fills assessment form:
   - Recommended system: "4K NVR + 6 cameras"
   - Quote: $4,500
   - Timeline: 2 weeks
7. **Rep 2:** Uploads proposal PDF via WhatsApp
8. **Rep 2:** Clicks "Assign to Payment Team"
9. **System:** Moves to "Proposal Sent" stage, assigns to Rep 3
10. **Rep 3:** Receives notification with full context

---

### 6.3 Flow: Manager Intervention

1. **Manager:** Opens dashboard, sees "Longest Waiting: 3 days" alert
2. **Manager:** Clicks on alert, sees conversation details
3. **Manager:** Reviews conversation, sees Rep 2 hasn't responded in 3 days
4. **Manager:** Adds internal note: "@Rep2 please follow up ASAP"
5. **Rep 2:** Receives notification of mention
6. **Manager:** Alternatively: Clicks "Reassign" button, assigns to different Rep 2
7. **System:** Sends notification to newly assigned rep
8. **Manager:** Optionally: Jumps into conversation directly and sends message themselves

---

### 6.4 Flow: CRM Sync (Odoo Example)

1. **New WhatsApp lead created** in inbox
2. **System:** Sends API request to Odoo: "Create Contact"
3. **Odoo:** Creates contact record, returns contact ID
4. **System:** Stores Odoo contact ID in local contact record
5. **Rep 1:** Fills qualification form
6. **System:** Sends API request to Odoo: "Create Opportunity" with qualification data
7. **Odoo:** Creates opportunity, links to contact
8. **Rep 1:** Moves lead to "Qualified"
9. **System:** Sends API request to Odoo: "Update Opportunity Stage"
10. **Odoo:** Updates stage to "Qualified"
11. **All WhatsApp messages** logged in Odoo as notes
12. **Rep 3:** Marks deal as "Won" in inbox
13. **System:** Sends API request to Odoo: "Update Opportunity to Won"
14. **Odoo:** Updates status, triggers invoice creation workflow

---

## 7. UI/UX Requirements

### 7.1 Design Principles

**Simplicity First:**
- Clean, uncluttered interface
- Minimal clicks to complete tasks
- No unnecessary features in MVP

**Familiar Patterns:**
- WhatsApp-inspired chat interface (users know how it works)
- Standard CRM-style list views
- Conventional form layouts

**Speed & Efficiency:**
- Keyboard shortcuts for power users
- Quick actions (1-click handoff, quick reply templates)
- Fast search with instant results

---

### 7.2 Layout Structure

**Main Navigation (Left Sidebar):**
```
[Logo]
─────────────
Dashboard
Conversations
  ├─ My Leads
  ├─ All Leads (manager only)
  └─ Unassigned (manager only)
Analytics (manager only)
Settings
Profile
```

**Conversation List (Middle Panel):**
```
┌────────────────────────────┐
│ [Search box]               │
│ [Filters] [Sort]           │
├────────────────────────────┤
│ 🟢 Miami Logistics LLC     │
│ New Lead | 2 min ago       │
│ "I need security cameras"  │
├────────────────────────────┤
│ 🔵 Tech Solutions Inc      │
│ Qualified | 1 hour ago     │
│ "When can you install?"    │
└────────────────────────────┘
```

**Conversation Detail (Right Panel):**
```
┌─────────────────────────────────────┐
│ [Contact Name]        [⋮ More Menu] │
│ Stage: Qualified | Assigned: Rep 2  │
├─────────────────────────────────────┤
│ ┌───────────────────────────────┐   │
│ │ CONVERSATION                  │   │
│ │ [WhatsApp-style messages]     │   │
│ │                               │   │
│ └───────────────────────────────┘   │
│ [Type message...] [Send]            │
├─────────────────────────────────────┤
│ [TABS: Info | Forms | Notes | CRM] │
│                                     │
│ ▸ Contact Information               │
│ ▸ Qualification Data (Rep 1)        │
│ ▸ Assessment Form (Rep 2)           │
│ ▸ Internal Notes                    │
│                                     │
│ [Assign to Next Stage] ────────────►│
└─────────────────────────────────────┘
```

---

### 7.3 Color Coding & Visual Cues

**Stage Colors:**
- 🟢 New Lead - Green
- 🔵 Qualified - Blue
- 🟡 Assessment - Yellow
- 🟠 Proposal Sent - Orange
- 🟣 Payment - Purple
- ✅ Won - Green check
- ❌ Lost - Red X

**Priority Indicators:**
- 🔴 Red dot - Unread message
- ⏰ Clock icon - Overdue response
- 📌 Pin icon - Pinned/important

---

### 7.4 Responsive Behavior

**Desktop (>1200px):**
- 3-column layout (navigation, list, detail)
- Full forms visible

**Tablet (768px - 1200px):**
- 2-column layout (list + detail, navigation in hamburger menu)
- Forms in scrollable panel

**Mobile (<768px):**
- Single view at a time
- Bottom navigation bar
- Swipe between conversations
- Compact forms

---

## 8. Integration Specifications

### 8.1 Odoo Integration Details

**Authentication:**
- API Key or OAuth 2.0
- Store encrypted credentials

**Endpoints Used:**
```
POST /api/res.partner (Create Contact)
PUT  /api/res.partner/{id} (Update Contact)
POST /api/crm.lead (Create Opportunity)
PUT  /api/crm.lead/{id} (Update Opportunity)
POST /api/mail.message (Log Message as Note)
GET  /api/crm.stage (Get Pipeline Stages)
```

**Field Mappings:**
| Inbox Field | Odoo Field |
|-------------|------------|
| Contact Name | partner.name |
| Phone | partner.phone |
| Company | partner.parent_id |
| Current Stage | lead.stage_id |
| Quote Amount | lead.expected_revenue |
| Notes | mail.message.body |

**Sync Frequency:**
- Real-time via webhooks (preferred)
- Fallback: Poll every 5 minutes

**Conflict Resolution:**
- Inbox wins for conversation data
- Odoo wins for contact details (if updated manually in Odoo)
- Configurable in settings

---

### 8.2 Generic CRM Webhook

**For CRMs without native integration:**

**Outbound Webhooks (Inbox → CRM):**
```json
POST https://client-crm.com/webhooks/whatsapp
{
  "event": "contact.created",
  "contact": {
    "id": "uuid",
    "phone": "+1234567890",
    "name": "John Doe",
    "stage": "new_lead"
  },
  "timestamp": "2026-02-05T10:00:00Z"
}
```

**Inbound Webhooks (CRM → Inbox):**
```json
POST https://your-inbox.com/api/webhooks/crm
{
  "event": "deal.updated",
  "deal_id": "12345",
  "contact_phone": "+1234567890",
  "stage": "closed_won",
  "value": 4500
}
```

---

## 9. Non-Functional Requirements

### 9.1 Reliability
- 99.9% uptime SLA
- Automated backups daily
- Disaster recovery plan

### 9.2 Scalability
- Horizontal scaling for API servers
- Database read replicas for reporting
- CDN for media files

### 9.3 Maintainability
- Comprehensive API documentation
- Code comments for complex logic
- Automated testing (unit, integration)

### 9.4 Usability
- Maximum 2 clicks to complete common tasks
- Onboarding tutorial for new users
- Contextual help tooltips

---

## 10. Out of Scope (V1)

**Features NOT included in initial version:**
- Multi-channel support (email, SMS, Facebook Messenger)
- Voice/video calls
- AI chatbot auto-responses
- Advanced analytics (sentiment analysis, conversion attribution)
- White-label/multi-tenant architecture
- API for third-party integrations
- Mobile native apps (iOS/Android)
- Zapier/Make.com integration
- Built-in dialer for phone calls

**Reasoning:** Focus on core WhatsApp + CRM sync functionality first. These features can be added in future iterations based on customer feedback.

---

## 11. Success Criteria

**Launch Readiness Checklist:**

**Core Functionality:**
- [ ] WhatsApp messages send/receive successfully
- [ ] Real-time message updates work across browsers
- [ ] Users can log in with proper role restrictions
- [ ] Lead assignment and handoff works end-to-end
- [ ] Stage forms save data correctly
- [ ] Manager can view all conversations
- [ ] Odoo sync creates/updates contacts and opportunities

**Performance:**
- [ ] Page loads in <2 seconds
- [ ] Messages send in <1 second
- [ ] Dashboard loads in <3 seconds
- [ ] System handles 20 concurrent users without lag

**User Acceptance:**
- [ ] 5 test users complete full workflow without major issues
- [ ] Users can complete handoff in <30 seconds
- [ ] Sales reps prefer this over personal WhatsApp (survey)

---

## 12. Timeline & Milestones

**Phase 1: Foundation (Weeks 1-2)**
- Database schema design
- WhatsApp API integration (send/receive)
- Basic authentication and user management
- Simple conversation view

**Phase 2: Core Features (Weeks 3-4)**
- Assignment and routing logic
- Stage pipeline implementation
- Stage-specific forms
- Internal notes

**Phase 3: Collaboration (Weeks 5-6)**
- Handoff workflow
- Manager dashboard
- Role-based permissions
- Real-time WebSocket updates

**Phase 4: CRM Integration (Weeks 7-8)**
- Odoo connection and sync
- Field mapping configuration
- Webhook handling
- Sync status monitoring

**Phase 5: Polish & Launch (Weeks 9-10)**
- UI/UX refinements
- Bug fixes from testing
- Performance optimization
- Documentation and training materials
- Beta testing with pilot customers

**Total Development Time: 10 weeks**

---

## 13. Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| WhatsApp API rate limits | High | Medium | Implement message queuing, upgrade to higher tier |
| CRM API changes breaking sync | High | Low | Version lock CRM APIs, monitor changelog |
| Poor adoption by sales team | High | Medium | Extensive training, show clear benefits, gather feedback |
| Database performance at scale | Medium | Medium | Optimize queries, add indexes, use caching |
| Security breach | Critical | Low | Regular security audits, pen testing, encryption |

---

## Appendices

### A. Glossary

**Terms:**
- **Contact:** A customer who has messaged the WhatsApp Business number
- **Lead:** A contact currently in the sales pipeline
- **Stage:** A step in the sales pipeline (New Lead, Qualified, etc.)
- **Handoff:** Transferring a lead from one rep to another
- **Assignment:** Designating which sales rep is responsible for a contact
- **Internal Note:** Private message not visible to customer
- **CRM Sync:** Bidirectional data exchange with external CRM system

---

### B. API Endpoints Overview

**Authentication:**
```
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
```

**Contacts:**
```
GET  /api/contacts
GET  /api/contacts/:id
POST /api/contacts
PUT  /api/contacts/:id
```

**Messages:**
```
GET  /api/contacts/:id/messages
POST /api/messages/send
GET  /api/messages/:id
```

**Assignments:**
```
POST /api/contacts/:id/assign
GET  /api/assignments/history/:contactId
```

**Stage Data:**
```
GET  /api/contacts/:id/stage-data
POST /api/contacts/:id/stage-data
PUT  /api/stage-data/:id
```

**Notes:**
```
GET  /api/contacts/:id/notes
POST /api/notes
PUT  /api/notes/:id
DELETE /api/notes/:id
```

**CRM:**
```
POST /api/crm/connect
GET  /api/crm/status
POST /api/crm/sync/:contactId
GET  /api/crm/mappings
PUT  /api/crm/mappings
```

---

### C. User Acceptance Testing Scenarios

**Test Scenario 1: End-to-End Lead Flow**
1. Admin sets up WhatsApp connection
2. Customer sends message
3. Rep 1 responds and qualifies lead
4. Rep 1 hands off to Rep 2
5. Rep 2 reviews context and continues conversation
6. Rep 2 hands off to Rep 3
7. Rep 3 closes deal
8. Manager reviews entire flow in analytics

**Expected Outcome:** Complete flow with no data loss, all reps have proper context

---

**Test Scenario 2: Manager Oversight**
1. Manager logs in
2. Views dashboard with all active conversations
3. Filters by "Overdue Response"
4. Clicks on stuck lead
5. Reviews conversation and notes
6. Adds note mentioning Rep
7. Reassigns to different rep

**Expected Outcome:** Manager can identify problems and take corrective action

---

**Test Scenario 3: CRM Sync**
1. New WhatsApp lead comes in
2. System creates contact in Odoo
3. Rep qualifies lead and fills form
4. System creates opportunity in Odoo with form data
5. Rep updates stage to "Qualified"
6. Odoo opportunity stage updates automatically
7. Manager checks Odoo, sees all data synced

**Expected Outcome:** Zero manual data entry, complete sync accuracy

---

## Document Control

**Revision History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Feb 5, 2026 | HeyFlou Team | Initial PRD |

---

# END OF PRD

