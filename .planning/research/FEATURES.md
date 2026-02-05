# Feature Research

**Domain:** WhatsApp Team Inbox & Sales Pipeline SaaS
**Researched:** 2026-02-05
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Shared Inbox Access** | Multiple agents need simultaneous access to conversations from single WhatsApp Business number | LOW | Core functionality - all competitors have this. Multi-device access is now standard (desktop + mobile). |
| **Conversation Assignment** | Teams need to assign chats to specific agents to prevent duplicate responses and ensure accountability | MEDIUM | Manual assignment is table stakes. Auto-assignment (round-robin, skill-based) is becoming expected. |
| **Full Conversation History** | Agents taking over conversations need complete context from previous interactions | LOW | Critical for handoffs. Everyone on team can view full history even if customer spoke to different agent. |
| **Internal Notes** | Team members need to share context without customer seeing it | LOW | Essential for collaboration. Agents use notes for follow-ups, context sharing between departments. |
| **Contact Labels/Tags** | Organizing conversations by status, priority, or category (New Lead, Follow-up, Payment Pending, etc.) | LOW | WhatsApp Business allows 20+ labels. Users expect to filter and search by tags. Multiple labels per contact is standard. |
| **Message Templates** | Pre-written responses for common questions to ensure consistency and speed | LOW | WhatsApp API allows unlimited templates (unlike Business App's 50 limit). Quick replies with shortcuts are baseline. |
| **Basic Analytics** | First response time, average reply time, conversation volume, agent performance | MEDIUM | Users expect visibility into response metrics. 6-15 seconds is benchmark for initial response. 80% of consumers expect sub-10 minute responses. |
| **WhatsApp 24-Hour Window Compliance** | Respecting WhatsApp's service window rules (free messages within 24h of customer reply) | MEDIUM | Platform must track conversation status (Open, Pending, Expired) automatically. Critical for policy compliance. |
| **Multi-User Access Controls** | Role-based permissions (admin, agent, manager) to control who can access what | MEDIUM | Security baseline. Admins need to manage team members, assign roles, control data access. |
| **Real-Time Notifications** | Push notifications for new messages, assignments, mentions | LOW | Desktop and mobile notifications expected. Agents need alerts when chat assigned to them. Customizable notification rules to avoid alert fatigue. |
| **Search & Filter** | Finding specific conversations by contact name, content, date, label, or assignment | LOW | Basic search is minimum. Filter by labels, assignment status, date range is standard. |
| **Message Status Indicators** | Knowing if message was sent, delivered, read (WhatsApp check marks) | LOW | Native WhatsApp functionality that must be preserved in team inbox UI. |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valuable.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Zero-Context-Loss Handoffs** | When leads move between pipeline stages, new agent sees full context + previous stage notes without asking customer to repeat | HIGH | YOUR CORE VALUE. Combines conversation history + pipeline stage metadata + internal notes in unified view. Competitors focus on handoffs within same stage, not across pipeline stages. |
| **Pipeline-Stage-Aware Assignment** | Automatically route conversations based on deal stage (prospect → qualifier → closer) with context preservation | HIGH | Most competitors treat pipeline as separate from inbox. Integrating stage-based routing with inbox assignment is differentiator. |
| **Conversation-to-Deal Linking** | Each WhatsApp conversation directly linked to pipeline deal card with bidirectional updates | MEDIUM | Interakt has pipelines, but focus is on manual stage updates. Auto-syncing conversation milestones to deal progress is unique. |
| **Stage Transition Triggers** | Pipeline stage changes trigger WhatsApp messages or internal alerts (e.g., "Deal moved to Negotiation → notify closer") | MEDIUM | Bridges pipeline management with communication. Respond.io has workflows but not stage-specific triggers. |
| **Smart Routing by Lead Quality** | Hot leads instantly assigned to best available closer vs cold leads to qualifiers | MEDIUM | Gallabox mentions this but implementation details sparse. Sophisticated routing logic based on lead scoring/attributes. |
| **Team Performance by Stage** | Analytics showing which agents excel at which pipeline stages (e.g., Agent A closes 40% in Negotiation stage) | MEDIUM | Standard analytics show overall agent performance. Stage-specific performance metrics help optimize assignments. |
| **Custom Pipeline Stages** | Users define their own stages beyond generic "Lead → Qualified → Proposal → Closed" | LOW | Flexibility for different sales processes. Drag-drop Kanban customization. |
| **Conversation Escalation Workflows** | Complex issues escalated to managers with full context, priority flagging, and SLA tracking | MEDIUM | Beyond simple reassignment. Includes urgency tagging, manager override, and SLA breach alerts. |
| **Rich Contact Profiles** | View customer's full journey: past conversations, deal history, custom fields, enrichment data (Apollo, Hunter integration) | MEDIUM | NetHunt and others have CRM data, but consolidating everything in sidebar during active chat is UX differentiator. |
| **@Mentions & Collaboration** | Tag specific teammates in internal notes with notifications, like Slack within conversations | LOW | Becoming common but not universal. Real-time collaboration feature. |
| **Unified Search Across Inbox + Pipeline** | Single search bar finds conversations, contacts, deals, and notes simultaneously | MEDIUM | Most products separate inbox search from pipeline search. Unified search improves speed. |
| **Stage-Specific Message Templates** | Different quick replies available based on current pipeline stage (Negotiation templates vs Onboarding templates) | LOW | Context-aware templates reduce agent cognitive load and improve consistency. |
| **Automatic Contact Enrichment** | When customer shares phone/email, system auto-enriches profile with social, company data | HIGH | Requires third-party integrations (Clearbit, Apollo, Hunter). NetHunt CRM does this but not WhatsApp-native. |
| **SLA Rules by Priority/Stage** | Different response time targets for VIP customers or deals in closing stage vs new leads | MEDIUM | Configurable SLA targets with breach notifications. Improve for high-value deals. |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **Multi-Channel Unified Inbox** | "Customers contact us on WhatsApp, Instagram, Email, SMS" | Scope creep for v1. Adds complexity without validating core value prop (WhatsApp context preservation). Most teams primarily use WhatsApp. | Focus on WhatsApp excellence first. Multi-channel can be v2+ after validating single-channel PMF. |
| **Full CRM Integration** | "We need to sync with Salesforce/HubSpot/Pipedrive" | Deep CRM integrations are complex, require maintenance, and distract from core differentiator. Users already have CRMs - they need WhatsApp pipeline tool, not another CRM. | Build standalone pipeline optimized for WhatsApp. Export/import capabilities for CRM sync later. API webhooks for power users. |
| **AI Chatbots / Auto-Replies** | "Let AI handle initial responses automatically" | Meta banned general-purpose AI chatbots on WhatsApp in Jan 2026. Only task-specific bots allowed. Also, sales conversations need human touch - automation kills conversion. | Focus on human agent efficiency (templates, context). Simple FAQ bots can be v2 if compliant. |
| **Broadcast Campaigns with Complex Segmentation** | "We want to send targeted promotions to thousands" | Broadcast messaging is increasingly regulated by WhatsApp. Quality rating penalties for spam. This is marketing automation, not sales pipeline management. | Support basic broadcast lists for existing customers. Point to specialized marketing tools (Interakt) for campaigns. |
| **Mobile App (Native iOS/Android)** | "Agents want to work from phone" | Mobile app development 2x+ engineering effort. PWA or mobile-responsive web gives 80% of benefit. Desktop is primary sales agent workspace. | Responsive web design works on mobile browsers. PWA for offline access. Native apps only if data shows mobile-first usage. |
| **Video/Voice Calling** | "WhatsApp has calls, we should support them" | Calls aren't logged/searchable like messages. Context preservation (your differentiator) doesn't work with voice. Regulatory/recording issues. | Focus on text-based conversations where context is preserved. Voice notes are text-transcribable (future). |
| **Advanced Workflow Automation** | "We want complex if/then automation like Zapier" | Respond.io has extensive workflows but users find them overwhelming. For v1, focus on simple pipeline automation. Complex automation distracts from core use case. | Stage-based triggers and simple auto-assignment rules. Complex workflows can be v2 after validating simpler automation. |
| **Unlimited WhatsApp Business Numbers** | "Each team member wants their own number" | WhatsApp Business API is portfolio-limited (250-100K messages/day shared across numbers). Managing multiple numbers fragments conversations. Expensive. | Single shared number with agent assignment is standard model. Multiple numbers only for enterprise tier with clear use cases (departments/regions). |
| **Gamification / Leaderboards** | "Motivate agents with points and badges" | Gamification can create toxic competition, gaming metrics over quality. Sales teams need results, not badges. Adds UI complexity. | Show performance metrics transparently. Let managers define incentives. Focus on useful analytics, not game mechanics. |
| **Built-in Payments / E-commerce Cart** | "Let customers buy directly in WhatsApp" | WhatsApp Flows supports payments but integration is complex. For B2B sales (your focus), deals close outside WhatsApp (contracts, wire transfers). Payment processing adds regulatory burden. | Link to external checkout/invoice systems. Focus on conversation → decision, not transaction processing. |

## Feature Dependencies

```
[Shared Inbox Access]
    └──requires──> [WhatsApp Business API Access]
                       └──requires──> [Meta Business Verification]

[Conversation Assignment]
    └──enables──> [Smart Routing by Lead Quality]
    └──enables──> [Team Performance Analytics]

[Pipeline-Stage-Aware Assignment]
    └──requires──> [Conversation-to-Deal Linking]
    └──requires──> [Custom Pipeline Stages]
    └──enables──> [Stage Transition Triggers]

[Full Conversation History]
    └──enables──> [Zero-Context-Loss Handoffs]
    └──enhances──> [Rich Contact Profiles]

[Internal Notes]
    └──enables──> [@Mentions & Collaboration]
    └──enables──> [Zero-Context-Loss Handoffs]

[Message Templates]
    └──enhances──> [Stage-Specific Message Templates]

[Basic Analytics]
    └──enables──> [Team Performance by Stage]
    └──requires──> [Conversation Assignment]

[Contact Labels/Tags]
    └──enables──> [Search & Filter]
    └──enables──> [Smart Routing by Lead Quality]

[Stage Transition Triggers] ──conflicts with──> [Advanced Workflow Automation]
  (Choose simple stage-based triggers OR complex workflows, not both in v1)
```

### Dependency Notes

- **WhatsApp Business API Access requires Meta Business Verification:** Cannot build product without official API access. Must complete business verification to unlock 100K daily message limit (up from 250).

- **Pipeline-Stage-Aware Assignment requires Conversation-to-Deal Linking:** Cannot route by stage if conversations aren't linked to deals. This is architectural foundation.

- **Zero-Context-Loss Handoffs requires Full Conversation History + Internal Notes + Pipeline Stages:** Core differentiator depends on three features working together. Not achievable with inbox-only or pipeline-only features.

- **Smart Routing requires Contact Labels/Tags and Assignment Rules:** Routing logic needs metadata (lead quality, source, deal size) stored as labels/custom fields.

- **Team Performance by Stage requires both Analytics infrastructure and Pipeline Stage tracking:** Cannot calculate stage-specific metrics without capturing which agent handled which stage.

- **Stage Transition Triggers conflicts with Advanced Workflow Automation:** If you build complex if/then automation builder (like Respond.io Workflows), simple stage-based triggers become redundant. Choose one approach for v1 to avoid confusing users.

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed to validate the core value proposition: **Zero context loss during lead handoffs between sales stages.**

- [x] **Shared Inbox Access** — Multiple agents access single WhatsApp Business number via web dashboard
- [x] **Conversation Assignment** — Manual assignment + basic round-robin auto-assignment
- [x] **Full Conversation History** — Every agent sees complete conversation thread regardless of who handled it previously
- [x] **Internal Notes** — Agents add notes visible only to team, not customer
- [x] **Custom Pipeline Stages** — Users define their own stages (e.g., Prospect → Qualified → Demo → Proposal → Closed)
- [x] **Conversation-to-Deal Linking** — Each conversation linked to deal card in pipeline
- [x] **Pipeline-Stage-Aware Handoffs** — When deal moves to new stage, assigned agent changes automatically + previous notes carry over
- [x] **Contact Labels/Tags** — Organize conversations with custom labels
- [x] **Message Templates (Basic)** — Save and reuse common responses with keyboard shortcuts
- [x] **Basic Analytics Dashboard** — First response time, avg reply time, conversations by agent, conversations by stage
- [x] **Search & Filter** — Find conversations by contact name, label, assignment, date
- [x] **24-Hour Window Tracking** — Visual indicator of conversation status (Open/Pending/Expired per WhatsApp policy)
- [x] **Real-Time Notifications** — Browser/desktop notifications for new messages and assignments
- [x] **Role-Based Access** — Admin (team management) vs Agent (handle conversations) roles

**Why these 14 features:**
- First 4 = Table stakes for team inbox
- Next 4 = Core pipeline integration (your differentiator)
- Last 6 = Essential usability features to make product functional

**What makes this MVP different from competitors:**
- Respond.io: Has omnichannel inbox + complex workflows, but no native pipeline stages. Strong automation but weak sales pipeline.
- Wati: Has team inbox + basic automation, but no pipeline visualization. Good for support teams, not sales.
- Interakt: Has sales pipeline + WhatsApp, but weak on context preservation during handoffs. Pipeline feels separate from inbox.
- **Your MVP:** Pipeline stages ARE the inbox organization structure. Context preservation is built into stage transitions, not an afterthought.

### Add After Validation (v1.x)

Features to add once core is working and users validate the context-preservation value prop.

- [ ] **Stage Transition Triggers** — Auto-send WhatsApp message when deal moves to specific stage (e.g., "Deal closed → send onboarding template")
- [ ] **@Mentions in Notes** — Tag teammates in internal notes with notifications
- [ ] **Smart Routing by Lead Quality** — Hot leads auto-assigned to closers, cold leads to qualifiers based on rules
- [ ] **Rich Contact Profiles** — Sidebar showing contact's deal history, past conversations, custom fields
- [ ] **Stage-Specific Templates** — Different template libraries per pipeline stage
- [ ] **Team Performance by Stage** — Analytics showing which agents excel at which stages
- [ ] **SLA Rules** — Define target response times, get alerts on breaches
- [ ] **Conversation Escalation** — Flag urgent issues to managers with priority tagging
- [ ] **Export/Import** — CSV export of contacts, deals, conversations for backup/analysis
- [ ] **Webhook API** — Send conversation events to external systems for power users wanting CRM sync

**Triggers for adding these:**
- Stage Transition Triggers: After users manually move 100+ deals between stages (validates stage usage)
- @Mentions: After team size hits 5+ agents (validates collaboration need)
- Smart Routing: After users create custom routing rules manually 10+ times (validates routing patterns)
- SLA Rules: After users ask about response time compliance (validates metric importance)

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] **Multi-Channel Inbox** — Add Instagram, Messenger, SMS alongside WhatsApp
- [ ] **CRM Integration** — Native sync with Salesforce, HubSpot, Pipedrive
- [ ] **Mobile Apps** — Native iOS/Android apps (start with PWA)
- [ ] **Advanced Workflow Automation** — Visual workflow builder with if/then logic
- [ ] **Broadcast Campaigns** — Bulk messaging with segmentation
- [ ] **AI Chatbots** — Task-specific bots for FAQ handling (must be WhatsApp-compliant)
- [ ] **Contact Enrichment** — Auto-populate contact data from third-party sources (Clearbit, Apollo)
- [ ] **Voice Note Transcription** — Convert WhatsApp voice messages to text for searchability
- [ ] **Multi-Number Support** — Manage multiple WhatsApp Business numbers in one dashboard
- [ ] **Custom Reporting** — Build custom dashboards, export analytics
- [ ] **API for Developers** — Full REST API for custom integrations

**Why defer:**
- These add complexity without validating core hypothesis (context preservation in sales handoffs)
- Multi-channel requires 3x engineering for integrations
- CRM integrations require per-integration maintenance
- Workflow automation requires dedicated visual builder UI (months of work)
- AI features require WhatsApp policy compliance + ongoing model maintenance

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Shared Inbox Access | HIGH | LOW | P1 (MVP) |
| Full Conversation History | HIGH | LOW | P1 (MVP) |
| Conversation-to-Deal Linking | HIGH | MEDIUM | P1 (MVP) |
| Pipeline-Stage-Aware Handoffs | HIGH | MEDIUM | P1 (MVP) |
| Custom Pipeline Stages | HIGH | MEDIUM | P1 (MVP) |
| Conversation Assignment | HIGH | MEDIUM | P1 (MVP) |
| Internal Notes | HIGH | LOW | P1 (MVP) |
| Basic Analytics | MEDIUM | MEDIUM | P1 (MVP) |
| Contact Labels/Tags | HIGH | LOW | P1 (MVP) |
| Message Templates | HIGH | LOW | P1 (MVP) |
| Search & Filter | MEDIUM | LOW | P1 (MVP) |
| 24-Hour Window Tracking | HIGH | MEDIUM | P1 (MVP) |
| Real-Time Notifications | MEDIUM | LOW | P1 (MVP) |
| Role-Based Access | MEDIUM | MEDIUM | P1 (MVP) |
| Stage Transition Triggers | HIGH | MEDIUM | P2 (v1.x) |
| @Mentions in Notes | MEDIUM | LOW | P2 (v1.x) |
| Smart Routing by Lead Quality | HIGH | HIGH | P2 (v1.x) |
| Rich Contact Profiles | MEDIUM | MEDIUM | P2 (v1.x) |
| Stage-Specific Templates | MEDIUM | LOW | P2 (v1.x) |
| Team Performance by Stage | HIGH | MEDIUM | P2 (v1.x) |
| SLA Rules | MEDIUM | MEDIUM | P2 (v1.x) |
| Conversation Escalation | MEDIUM | MEDIUM | P2 (v1.x) |
| Multi-Channel Inbox | MEDIUM | HIGH | P3 (v2+) |
| CRM Integration | MEDIUM | HIGH | P3 (v2+) |
| Advanced Workflow Automation | LOW | HIGH | P3 (v2+) |
| Broadcast Campaigns | LOW | MEDIUM | P3 (v2+) |
| AI Chatbots | LOW | HIGH | P3 (v2+) |
| Contact Enrichment | MEDIUM | HIGH | P3 (v2+) |
| Mobile Native Apps | LOW | HIGH | P3 (v2+) |

**Priority key:**
- **P1**: Must have for launch — validates core value proposition
- **P2**: Should have when validated — improves core experience after PMF signals
- **P3**: Nice to have, future consideration — expands scope after achieving PMF

## Competitor Feature Analysis

| Feature Category | Respond.io | Wati | Interakt | Your Approach |
|-----------------|------------|------|----------|---------------|
| **Shared Inbox** | ✓ Omnichannel (WhatsApp, IG, Email, Chat) | ✓ WhatsApp-focused, team collaboration | ✓ WhatsApp + Instagram | ✓ WhatsApp-only (v1), deep integration not breadth |
| **Conversation Assignment** | ✓ Round-robin, manual, auto-assign | ✓ Manual + auto-assign, agent collision prevention | ✓ Auto-assign with custom rules | ✓ Round-robin + manual (v1), smart routing later |
| **Internal Notes** | ✓ Notes + mentions | ✓ Notes for context sharing | ✓ Internal comments | ✓ Notes + stage-specific context preservation |
| **Pipeline Visualization** | ✗ No native pipeline (requires Workflows workaround) | ✗ No pipeline, support-focused | ✓ Kanban board with stages, drag-drop | ✓ Kanban pipeline with conversation linking |
| **Pipeline-Inbox Integration** | ✗ Separate inbox and workflows | ✗ N/A | ⚠ Pipeline separate from inbox UI | ✓ **Pipeline stages ARE inbox organization** |
| **Context Preservation** | ⚠ History visible, but no pipeline stage context | ⚠ History visible, but no handoff structure | ⚠ Pipeline tracks stage, but weak conversation history | ✓ **Stage transitions include full context + notes** |
| **Message Templates** | ✓ Unlimited templates | ✓ Templates + quick replies | ✓ Ready-to-use templates | ✓ Basic templates (v1), stage-specific (v1.x) |
| **Analytics** | ✓✓ Advanced (conversation, agent, channel metrics) | ✓ Response time, tickets resolved | ✓ Real-time analytics, ROI tracking | ✓ Basic (v1), stage-specific performance (v1.x) |
| **Smart Routing** | ✓✓ Advanced (skill-based, language, department) | ✓ Basic routing rules | ⚠ Lead assignment rules, but not dynamic | ⚠ Basic (v1), lead-quality-based (v1.x) |
| **Contact Management** | ✓ Custom fields, tags, segments | ✓ Labels, contact details | ✓ Custom fields, filtering | ✓ Labels/tags (v1), enrichment (v2+) |
| **Workflow Automation** | ✓✓ Visual workflow builder (complex) | ⚠ Basic automation, chatbot builder | ⚠ Lead assignment automation | ⚠ Stage triggers (v1.x), avoid complexity |
| **CRM Integration** | ✓✓ Native integrations (Salesforce, HubSpot, etc.) | ⚠ Limited integrations | ⚠ Shopify integration | ✗ Export/webhooks only (v1), native (v2+) |
| **Broadcast Messaging** | ✓ Broadcast with segmentation | ✓ Unlimited broadcasts (DoubleTick strength) | ✓✓ Broadcast focus, campaign management | ✗ Out of scope (v1), basic lists later |
| **Mobile Access** | ✓ Web + mobile apps | ✓ Mobile app (Android/iOS) | ⚠ Web-based, mobile-responsive | ✓ Responsive web (v1), PWA consideration |
| **Multi-User Pricing** | $$$$ ($79/user/month typical) | $$ ($39-$99/month, unlimited users tiers) | $$ ($49/month unlimited users) | TBD — likely per-seat or usage-based |

**Key Insights:**
- **Respond.io**: Most feature-complete but expensive and complex. Workflow automation is powerful but overwhelming for sales teams wanting simple pipeline. **No native pipeline stages** is their weakness.
- **Wati**: Best for SMBs and support teams. Strong collaboration features, but **no pipeline visualization** makes it unsuitable for sales processes.
- **Interakt**: Has pipeline + WhatsApp, closest competitor. But **pipeline feels separate from inbox** — you have to manually update stages while managing conversations in separate tab. **Weak context preservation during stage transitions.**
- **Your Differentiation**: Pipeline stages structure the inbox. Conversations are always in pipeline context. Stage transitions preserve full context automatically. Simple by design, not trying to do everything.

## Functional Area Breakdown

### 1. Messaging Core
**Table Stakes:**
- Send/receive WhatsApp messages via Business API
- Message status indicators (sent, delivered, read)
- Support text, images, documents, voice notes
- 24-hour conversation window compliance
- Message templates for outbound messages outside 24h window

**Differentiators:**
- Stage-specific template suggestions based on current deal stage

**Complexity:** LOW (WhatsApp API handles heavy lifting)

---

### 2. Inbox Management
**Table Stakes:**
- Shared inbox with all conversations visible to team
- Conversation list with contact name, last message, timestamp
- Unread message indicators
- Search conversations by contact name, content, date
- Filter by labels, assignment, status

**Differentiators:**
- Inbox organized by pipeline stage (e.g., "Prospect" tab, "Negotiation" tab)
- Unified search across conversations, deals, and notes

**Complexity:** MEDIUM (UI state management, search indexing)

---

### 3. Assignment & Routing
**Table Stakes:**
- Manual conversation assignment to specific agent
- Round-robin auto-assignment for new conversations
- View "My Conversations" vs "All Conversations"
- Reassign conversations to different agents

**Differentiators:**
- Pipeline-stage-aware assignment (new stage = new agent automatically)
- Smart routing by lead quality/source/size

**Complexity:** MEDIUM (assignment logic, notifications)

---

### 4. Pipeline Management
**Table Stakes:**
- Custom pipeline stages (user-defined)
- Kanban board visualization
- Drag-drop to move deals between stages
- Deal cards showing contact name, stage, assigned agent

**Differentiators:**
- **Conversation-to-deal linking** (each WhatsApp conversation IS a deal)
- **Stage-aware handoffs** (moving deal changes assignment + preserves context)
- Stage transition triggers (auto-actions when deal moves)

**Complexity:** HIGH (core differentiator, requires tight inbox-pipeline integration)

---

### 5. Collaboration
**Table Stakes:**
- Internal notes on conversations (not visible to customer)
- View which agent is currently handling conversation
- Conversation history visible to all team members

**Differentiators:**
- @Mentions in notes with notifications
- Stage-specific notes that carry over during handoffs
- Escalation workflows with priority tagging

**Complexity:** LOW-MEDIUM (notes are simple, mentions add complexity)

---

### 6. Contact Management
**Table Stakes:**
- Contact profiles with name, phone, email
- Custom labels/tags for organization
- Multiple labels per contact
- Filter and search by labels

**Differentiators:**
- Rich contact profiles with deal history and past conversations
- Automatic contact enrichment from third-party sources
- Custom fields for lead scoring attributes

**Complexity:** LOW-MEDIUM (basic contact DB is simple, enrichment is complex)

---

### 7. Analytics & Reporting
**Table Stakes:**
- First response time (FRT)
- Average reply time
- Conversation volume (total, by agent)
- Agent performance (messages sent, conversations handled)

**Differentiators:**
- **Team performance by pipeline stage** (which agents excel at closing vs qualifying)
- Conversion rates by stage
- Stage duration metrics (how long deals stay in each stage)

**Complexity:** MEDIUM (event tracking, aggregation, visualization)

---

### 8. Team & Access Management
**Table Stakes:**
- Add/remove team members
- Role-based access (Admin, Agent)
- View team member status (online/offline)

**Differentiators:**
- Manager role with escalation override
- Agent availability scheduling for routing

**Complexity:** LOW (standard auth/permissions)

---

### 9. Notifications & Alerts
**Table Stakes:**
- Real-time notifications for new messages
- Notifications for conversation assignment
- Desktop/browser push notifications

**Differentiators:**
- SLA breach alerts (response time exceeded)
- Stage transition notifications to relevant agents
- Customizable notification rules (mute specific labels, etc.)

**Complexity:** LOW (push notification service)

---

### 10. Compliance & Policies
**Table Stakes:**
- WhatsApp 24-hour service window enforcement
- Message template approval flow (Meta requires pre-approved templates)
- Respect user opt-out (can't message contacts who block/report)
- Display conversation status (Open, Pending, Expired)

**Differentiators:**
- Quality rating dashboard (track business number health per WhatsApp metrics)
- Auto-pause messaging if quality rating drops to "Low"

**Complexity:** MEDIUM (WhatsApp policy compliance is non-negotiable)

---

## Sources

### Primary Research Sources

**WhatsApp Team Inbox Features:**
- [Respond.io WhatsApp Team Inbox Guide](https://respond.io/blog/whatsapp-team-inbox)
- [Wati WhatsApp Team Inbox Features](https://www.wati.io/blog/whatsapp-team-inbox/)
- [Rasayel WhatsApp Team Inbox Best Practices](https://learn.rasayel.io/en/blog/whatsapp-team-inbox/)
- [Gallabox WhatsApp Team Inbox](https://gallabox.com/blog/whatsapp-team-inbox)
- [Trengo WhatsApp Team Inbox Setup Guide](https://trengo.com/blog/whatsapp-team-inbox)

**Sales Pipeline & CRM Features:**
- [Interakt Sales CRM Pipeline Features](https://www.interakt.shop/resource-center/pipelines-in-sales-crm/)
- [WhatsApp CRM Guide 2026 (NetHunt)](https://nethunt.com/blog/whatsapp-crm/)
- [Kanban for Sales Pipeline Management](https://chakrahq.com/article/kanban-ultimate-for-sales-pipeline-management/)

**Assignment & Routing:**
- [WhatsApp Business API Setup Guide 2026](https://www.socialintents.com/blog/how-to-set-up-whatsapp-business-api/)
- [WhatsApp Team Inbox Providers Comparison](https://controlhippo.com/blog/whatsapp/whatsapp-team-inbox-providers/)

**Analytics & Performance:**
- [WhatsApp Performance Tracking Metrics](https://learn.rasayel.io/en/blog/whatsapp-performance-tracking/)
- [WhatsApp Business Metrics Guide](https://respond.io/blog/whatsapp-business-metrics)
- [WhatsApp SLA Rules](https://www.chatarchitect.com/news/set-sla-rules-for-whatsapp-based-helpdesks)
- [WhatsApp Analytics Dashboards](https://timelines.ai/whatsapp-analytics-dashboards-key-metrics/)

**Context Handoffs & Collaboration:**
- [WhatsApp Shared Inbox Best Practices (Zixflow)](https://zixflow.com/blog/whatsapp-shared-inbox/)
- [WhatsApp Team Communication (Helpwise)](https://helpwise.io/features/whatsapp-team-inbox)
- [WhatsApp 2026 Group Features with Tags](https://techcrunch.com/2026/01/07/whatsapp-rolls-out-new-group-chat-features-member-tags/)

**Templates & Quick Replies:**
- [WhatsApp Quick Reply Templates 2026](https://chatarmin.com/en/blog/whatsapp-quick-reply-activate)
- [50+ WhatsApp Auto-Reply Templates](https://learn.rasayel.io/en/blog/whatsapp-quick-reply/)
- [Wati Quick Replies Setup](https://support.wati.io/en/articles/11463486-setting-up-quick-replies-and-chatbot-with-a-template-message)

**Broadcast & Segmentation:**
- [WhatsApp Broadcast Marketing Guide 2026](https://www.enchantagency.com/blog/whatsapp-broadcast-marketing-a-guide-for-2026)
- [WhatsApp Marketing Complete Guide 2026](https://www.activecampaign.com/blog/whatsapp-guide)

**Compliance & Policies:**
- [WhatsApp Business Messaging Policy](https://business.whatsapp.com/policy)
- [WhatsApp Messaging Limits 2026](https://sanuker.com/whatsapp-api-2026_updates-pacing-limits-usernames/)
- [WhatsApp Bulk Messaging Restrictions](https://www.fonada.com/blog/bulk-whatsapp-messages-guide-2026/)
- [Understanding Chat Statuses (Wati)](https://support.wati.io/en/articles/11463004-understanding-chat-statuses-in-team-inbox)

**Competitor Comparisons:**
- [10 Best WhatsApp API Providers 2026](https://respond.io/blog/best-whatsapp-api-providers)
- [6 Best WhatsApp CRMs 2026](https://respond.io/blog/best-whatsapp-crm)
- [Interakt Review 2026](https://respond.io/blog/interakt-review)
- [Respond.io Features 2026 (Chatimize)](https://chatimize.com/reviews/respond-io/)

**Problems & Common Mistakes:**
- [Risks of WhatsApp for Team Messaging](https://www.joinblink.com/intelligence/the-risks-of-using-whatsapp-for-team-messaging)
- [WhatsApp for Work: Hidden Costs](https://www.spikenow.com/blog/team-collaboration/whatsapp-for-work/)

**Contact Management:**
- [WhatsApp Labels Guide 2026](https://zixflow.com/blog/whatsapp-labels/)
- [WhatsApp Lead Management Best Practices](https://respond.io/blog/whatsapp-lead-management)

**Mobile & Desktop Access:**
- [WhatsApp For Teams Guide](https://www.dragapp.com/blog/whatsapp-for-teams/)
- [Wati Team Inbox Mobile App](https://play.google.com/store/apps/details?id=com.clareai.wati&hl=en)

---

*Feature research for: WhatsApp Team Inbox & Sales Pipeline Management*
*Researched: 2026-02-05*
*Confidence: HIGH — based on 40+ sources including competitor analysis, official documentation, and industry best practices*
