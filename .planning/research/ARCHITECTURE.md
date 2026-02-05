# Architecture Research

**Domain:** WhatsApp Business API SaaS with Real-Time Team Inbox
**Researched:** February 5, 2026
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          FRONTEND LAYER                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Web App    │  │  WebSocket   │  │    Media     │  │   Service    │   │
│  │  (React/Vue) │  │   Client     │  │   Upload     │  │    Worker    │   │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   │
│         │                  │                  │                  │           │
├─────────┴──────────────────┴──────────────────┴──────────────────┴───────────┤
│                          API GATEWAY LAYER                                   │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  REST API (Express/FastAPI)  │  WebSocket API  │  Webhook Receiver    │ │
│  │  - CRUD Operations           │  - Real-time    │  - WhatsApp webhooks │ │
│  │  - Authentication            │  - Pub/Sub      │  - CRM webhooks      │ │
│  │  - Authorization (RLS)       │  - Connection   │  - Fast ack (200)    │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│                       MESSAGE PROCESSING LAYER                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Message    │  │   Webhook    │  │   CRM Sync   │  │  Notification│   │
│  │   Queue      │  │   Processor  │  │   Worker     │  │   Worker     │   │
│  │  (Redis/SQS) │  │   (Lambda)   │  │   (Lambda)   │  │   (Lambda)   │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
├─────────────────────────────────────────────────────────────────────────────┤
│                        INTEGRATION LAYER                                     │
│  ┌────────────────────────────┐  ┌─────────────────────────────────────┐   │
│  │  WhatsApp Business API     │  │      CRM Integration                │   │
│  │  - Meta Cloud API          │  │  - Odoo API                         │   │
│  │  - 360dialog (alternative) │  │  - Generic webhook connector        │   │
│  └────────────────────────────┘  └─────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────────────┤
│                           DATA LAYER                                         │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐               │
│  │   PostgreSQL   │  │  Redis Cache   │  │  Object Store  │               │
│  │   - Multi-     │  │  - Sessions    │  │  (S3/R2)       │               │
│  │     tenant RLS │  │  - WebSocket   │  │  - Media files │               │
│  │   - Contacts   │  │    connections │  │  - Documents   │               │
│  │   - Messages   │  │  - Rate limits │  │                │               │
│  └────────────────┘  └────────────────┘  └────────────────┘               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **Frontend App** | User interface, conversation display, forms | React/Vue SPA with WebSocket client |
| **REST API** | CRUD operations, auth, tenant context injection | Express.js/FastAPI with JWT auth |
| **WebSocket API** | Real-time message broadcasting, connection management | API Gateway WebSocket + Lambda |
| **Webhook Receiver** | Fast ack (200) + queue incoming webhooks | Lightweight endpoint → message queue |
| **Message Queue** | Buffer webhook payloads for async processing | Redis Queues (Bull/BullMQ) or AWS SQS |
| **Webhook Processor** | Idempotent message processing, DB writes | Lambda function with DLQ |
| **CRM Sync Worker** | Bidirectional CRM data sync | Background job with retry logic |
| **PostgreSQL** | Primary data store with RLS for multi-tenancy | PostgreSQL 14+ with Row-Level Security |
| **Redis Cache** | WebSocket connection mapping, session store | Redis 7+ with pub/sub |
| **Object Storage** | WhatsApp media files (images, PDFs, voice) | S3/Cloudflare R2 with CDN |

## Recommended Project Structure

```
/
├── frontend/                    # React/Vue web application
│   ├── src/
│   │   ├── components/          # UI components (ConversationList, ChatView)
│   │   ├── pages/               # Route pages (Dashboard, Inbox, Settings)
│   │   ├── hooks/               # Custom hooks (useWebSocket, useAuth)
│   │   ├── services/            # API clients (api.ts, websocket.ts)
│   │   ├── store/               # State management (Zustand/Redux)
│   │   └── utils/               # Helpers
│   └── public/
│
├── backend/                     # Node.js/Python API server
│   ├── src/
│   │   ├── api/                 # REST API routes
│   │   │   ├── auth/            # Login, logout, refresh token
│   │   │   ├── contacts/        # Contact CRUD
│   │   │   ├── messages/        # Message send/receive
│   │   │   └── webhooks/        # Webhook receivers
│   │   ├── services/            # Business logic
│   │   │   ├── whatsapp.service.ts    # WhatsApp API wrapper
│   │   │   ├── crm.service.ts         # CRM integration logic
│   │   │   ├── assignment.service.ts  # Lead routing logic
│   │   │   └── notification.service.ts
│   │   ├── workers/             # Background job processors
│   │   │   ├── webhook-processor.ts   # Process WhatsApp webhooks
│   │   │   ├── crm-sync.ts            # Sync with CRM
│   │   │   └── notification.ts        # Send email/push
│   │   ├── middleware/          # Express middleware
│   │   │   ├── auth.middleware.ts     # JWT validation
│   │   │   ├── rls.middleware.ts      # Set tenant context
│   │   │   └── rate-limit.middleware.ts
│   │   ├── database/            # Database layer
│   │   │   ├── migrations/      # SQL migration files
│   │   │   ├── models/          # ORM models (if using)
│   │   │   └── seeds/           # Test data
│   │   └── websocket/           # WebSocket server
│   │       ├── connection-manager.ts  # Track connections
│   │       └── message-broadcaster.ts
│   └── tests/
│
├── functions/                   # Serverless functions (if using Lambda)
│   ├── webhook-handler/         # WhatsApp webhook processor
│   ├── websocket-connect/       # $connect route
│   ├── websocket-disconnect/    # $disconnect route
│   └── websocket-message/       # Custom routes
│
├── database/                    # Database schema & migrations
│   ├── schema.sql               # Initial schema
│   ├── migrations/              # Version-controlled migrations
│   └── rls-policies.sql         # Row-level security policies
│
├── infrastructure/              # IaC (Terraform/CDK)
│   ├── main.tf                  # Infrastructure definitions
│   └── variables.tf
│
└── docker-compose.yml           # Local development environment
```

### Structure Rationale

- **frontend/**: Separation of concerns - UI layer completely decoupled from backend
- **backend/api/**: RESTful endpoints grouped by resource (contacts, messages, etc.)
- **backend/workers/**: Background processors isolated from API for independent scaling
- **backend/middleware/rls.middleware.ts**: Critical for multi-tenancy - sets `app.tenant_id` session variable
- **functions/**: Serverless-compatible structure for webhook processing (stateless, event-driven)
- **database/rls-policies.sql**: Database-level security policies ensure tenant isolation even if app code fails

## Architectural Patterns

### Pattern 1: Queue-First Webhook Processing

**What:** Webhook endpoint immediately returns 200 OK and queues payload for async processing

**When to use:** All external webhooks (WhatsApp, CRM) to prevent timeouts and enable retries

**Trade-offs:**
- ✅ Fast response prevents webhook provider timeouts
- ✅ Decouples ingestion from processing
- ✅ Enables retries with exponential backoff
- ❌ Adds infrastructure complexity (message queue)
- ❌ Eventual consistency (not immediate)

**Example:**
```typescript
// Webhook receiver (API endpoint)
app.post('/webhooks/whatsapp', async (req, res) => {
  // 1. Immediately acknowledge receipt
  res.status(200).send('OK');

  // 2. Queue for processing (don't await)
  await messageQueue.add('process-webhook', {
    webhookId: req.body.id,  // For idempotency
    payload: req.body,
    timestamp: Date.now()
  }, {
    attempts: 5,              // Retry up to 5 times
    backoff: {
      type: 'exponential',
      delay: 2000             // Start with 2s, double each retry
    }
  });
});

// Webhook processor (background worker)
messageQueue.process('process-webhook', async (job) => {
  const { webhookId, payload } = job.data;

  // 3. Idempotency check
  const exists = await db.query(
    'SELECT 1 FROM processed_webhooks WHERE id = $1',
    [webhookId]
  );
  if (exists.rows.length > 0) {
    return; // Already processed, skip
  }

  // 4. Process message
  await saveMessageToDatabase(payload);
  await broadcastToWebSocket(payload);
  await triggerCRMSync(payload);

  // 5. Mark as processed
  await db.query(
    'INSERT INTO processed_webhooks (id, processed_at) VALUES ($1, NOW())',
    [webhookId]
  );
});
```

**Sources:**
- [Stop Doing Business Logic in Webhook Endpoints](https://dev.to/elvissautet/stop-doing-business-logic-in-webhook-endpoints-i-dont-care-what-your-lead-engineer-says-8o0)
- [Webhooks at Scale: Best Practices](https://hookdeck.com/blog/webhooks-at-scale)
- [Building a Scalable Webhook Architecture for WhatsApp](https://www.chatarchitect.com/news/building-a-scalable-webhook-architecture-for-custom-whatsapp-solutions)

### Pattern 2: PostgreSQL Row-Level Security (RLS) for Multi-Tenancy

**What:** Database-enforced tenant isolation using session variables and RLS policies

**When to use:** Multi-tenant SaaS with shared database (pool model) requiring strong isolation

**Trade-offs:**
- ✅ Database-level security prevents cross-tenant leaks
- ✅ Transparent to application code (no WHERE tenant_id in every query)
- ✅ Prevents SQL injection from bypassing tenant filters
- ❌ Requires setting session variable on every connection
- ❌ Incompatible with connection poolers like PgBouncer (transaction mode)
- ❌ Performance overhead (policy evaluation on each query)

**Example:**
```sql
-- Enable RLS on contacts table
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see contacts from their tenant
CREATE POLICY tenant_isolation_policy ON contacts
  USING (tenant_id = current_setting('app.tenant_id')::INTEGER);

-- Policy applies to SELECT, INSERT, UPDATE, DELETE automatically
```

```typescript
// Middleware to set tenant context (Express.js)
app.use(async (req, res, next) => {
  const user = req.user; // From JWT
  const tenantId = user.tenant_id;

  // Set session variable for this request's database connection
  await db.query('SET app.tenant_id = $1', [tenantId]);

  next();
});

// Now all queries are automatically filtered by tenant
app.get('/api/contacts', async (req, res) => {
  // RLS policy automatically adds: WHERE tenant_id = <current_tenant>
  const contacts = await db.query('SELECT * FROM contacts');
  res.json(contacts.rows);
});
```

**Critical Implementation Notes:**
- **Connection pooling:** RLS session variables persist for the connection lifetime. Use dedicated connection pool per request or reset variables after each request
- **Superuser bypass:** RLS policies don't apply to superuser accounts - ensure app uses limited role
- **Testing:** Easy to miss in development - always test with multiple tenants

**Sources:**
- [Multi-tenant data isolation with PostgreSQL RLS](https://aws.amazon.com/blogs/database/multi-tenant-data-isolation-with-postgresql-row-level-security/)
- [How to Implement PostgreSQL RLS for Multi-Tenant SaaS](https://www.techbuddies.io/2026/01/01/how-to-implement-postgresql-row-level-security-for-multi-tenant-saas/)
- [Implementing Fine-Grained Postgres Permissions](https://www.permit.io/blog/implementing-fine-grained-postgres-permissions-for-multi-tenant-applications)

### Pattern 3: Serverless WebSocket with Connection Table

**What:** API Gateway WebSocket routes to Lambda functions, DynamoDB tracks connection IDs

**When to use:** Real-time messaging in serverless environment (no long-running servers)

**Trade-offs:**
- ✅ Automatic scaling (no connection limit planning)
- ✅ No server management (fully managed by AWS)
- ✅ Pay only for active connections
- ❌ Cold start latency (mitigate with provisioned concurrency)
- ❌ Lambda scaling limits (3000 concurrent by default)
- ❌ Must track connections externally (DynamoDB/Redis)

**Example:**
```typescript
// $connect route (Lambda function)
export async function connectHandler(event: APIGatewayWebSocketEvent) {
  const connectionId = event.requestContext.connectionId;
  const userId = event.queryStringParameters?.userId;

  // Store connection mapping
  await db.query(`
    INSERT INTO websocket_connections (connection_id, user_id, connected_at)
    VALUES ($1, $2, NOW())
  `, [connectionId, userId]);

  return { statusCode: 200 };
}

// $disconnect route
export async function disconnectHandler(event: APIGatewayWebSocketEvent) {
  const connectionId = event.requestContext.connectionId;

  await db.query(
    'DELETE FROM websocket_connections WHERE connection_id = $1',
    [connectionId]
  );

  return { statusCode: 200 };
}

// Broadcasting messages to connected clients
async function broadcastMessage(tenantId: number, message: any) {
  // Get all connections for this tenant
  const connections = await db.query(`
    SELECT wc.connection_id
    FROM websocket_connections wc
    JOIN users u ON wc.user_id = u.id
    WHERE u.tenant_id = $1
  `, [tenantId]);

  // Send to each connection
  const apiGateway = new ApiGatewayManagementApi({
    endpoint: process.env.WEBSOCKET_ENDPOINT
  });

  await Promise.all(
    connections.rows.map(conn =>
      apiGateway.postToConnection({
        ConnectionId: conn.connection_id,
        Data: JSON.stringify(message)
      }).promise().catch(err => {
        // Connection is stale, delete it
        if (err.statusCode === 410) {
          db.query('DELETE FROM websocket_connections WHERE connection_id = $1',
            [conn.connection_id]);
        }
      })
    )
  );
}
```

**Sources:**
- [Tutorial: WebSocket chat with API Gateway and Lambda](https://docs.aws.amazon.com/apigateway/latest/developerguide/websocket-api-chat-app.html)
- [How to Configure WebSocket with AWS API Gateway](https://oneuptime.com/blog/post/2026-01-24-websocket-aws-api-gateway/view)
- [Building serverless WebSocket APIs](https://aws.amazon.com/blogs/compute/building-serverless-multi-region-websocket-apis/)

### Pattern 4: Event-Driven Architecture with Pub/Sub

**What:** Message broadcast pattern where events are published to a central broker and subscribers receive updates

**When to use:** Real-time updates to multiple clients, cross-service communication

**Trade-offs:**
- ✅ Decoupled components (services don't know about each other)
- ✅ Easy to add new subscribers (just listen to events)
- ✅ Natural fit for real-time features
- ❌ Debugging harder (no direct call chain)
- ❌ Message ordering not guaranteed
- ❌ Potential for event storms

**Example:**
```typescript
// Publisher (when new message arrives)
class WhatsAppService {
  async handleIncomingMessage(message) {
    // Save to database
    const savedMessage = await db.messages.create(message);

    // Publish event
    await eventBus.publish('message.received', {
      tenantId: message.tenantId,
      contactId: message.contactId,
      messageId: savedMessage.id,
      text: message.text
    });
  }
}

// Subscriber 1: WebSocket broadcaster
eventBus.subscribe('message.received', async (event) => {
  await websocket.broadcast(event.tenantId, {
    type: 'NEW_MESSAGE',
    payload: event
  });
});

// Subscriber 2: CRM sync
eventBus.subscribe('message.received', async (event) => {
  await crmService.logMessageInCRM(event);
});

// Subscriber 3: Notification sender
eventBus.subscribe('message.received', async (event) => {
  const assignedUser = await getAssignedUser(event.contactId);
  await notificationService.sendEmail(assignedUser, event);
});
```

## Data Flow

### Request Flow: User Sends Message

```
[User types message in UI]
    ↓
[Frontend: POST /api/messages/send]
    ↓
[API Gateway: Auth middleware validates JWT]
    ↓
[RLS Middleware: SET app.tenant_id = {user.tenant_id}]
    ↓
[Message Service: Validate, store in DB]
    ↓
[WhatsApp API: Send message via Meta Cloud API]
    ↓
    ├─→ [WebSocket: Broadcast to connected clients]
    ├─→ [Event Bus: Publish 'message.sent' event]
    └─→ [CRM Worker: Queue CRM sync job]
    ↓
[Response: 200 OK with message ID]
```

### Webhook Flow: WhatsApp Message Received

```
[Customer sends WhatsApp message]
    ↓
[Meta Cloud API: POST /webhooks/whatsapp]
    ↓
[Webhook Receiver: Immediate 200 OK response]
    ↓
[Message Queue: Enqueue webhook payload]
    ↓
[Webhook Processor (async):]
    ├─→ [Idempotency check: Already processed?]
    ├─→ [Create/update contact record]
    ├─→ [Save message to database]
    ├─→ [Assignment logic: Auto-assign to Rep 1]
    ├─→ [Mark webhook as processed]
    └─→ [Publish 'message.received' event]
    ↓
[Event Subscribers:]
    ├─→ [WebSocket: Broadcast to assigned rep]
    ├─→ [Notification: Send email to assigned rep]
    └─→ [CRM: Create/update contact in Odoo]
```

### CRM Sync Flow: Bidirectional

```
INBOX → CRM:
[Stage changed to "Qualified"]
    ↓
[Stage Service: Update contact stage in DB]
    ↓
[CRM Sync Worker: Queue CRM update]
    ↓
[Odoo API: PUT /api/crm.lead/{id}]
    ↓
[Update opportunity stage to "Qualified"]

CRM → INBOX:
[Odoo: Deal marked "Won" by manager]
    ↓
[Odoo Webhook: POST /webhooks/crm]
    ↓
[Webhook Receiver: 200 OK + queue]
    ↓
[CRM Webhook Processor: Update contact status]
    ↓
[Publish 'stage.changed' event]
    ↓
[WebSocket: Notify team members]
```

### Key Data Flows

1. **User Authentication Flow:**
   - User submits credentials → API validates → JWT issued → Frontend stores token → All requests include token → Middleware extracts user → RLS context set

2. **Lead Assignment Flow:**
   - New contact created → Assignment service checks rules → Round-robin/rule-based logic → Update contact.assigned_to → Publish assignment event → Notify assigned user

3. **Real-Time Message Flow:**
   - Message saved to DB → Publish event → WebSocket server queries active connections for tenant → Broadcast to relevant connections → UI updates instantly

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| **0-100 users** | Monolith is fine: Single server (API + WebSocket), PostgreSQL, Redis, Basic infrastructure |
| **100-1k users** | Separate concerns: API servers (2+), Dedicated WebSocket server, Message queue (Redis/SQS), Read replicas for reports, CDN for media files |
| **1k-10k users** | Horizontal scaling: API server auto-scaling group, WebSocket server cluster (sticky sessions), Database connection pooling, Caching layer (Redis), Multi-region deployment prep |
| **10k+ users** | Full distributed: Multi-region active-active, Database sharding by tenant, Dedicated CRM sync workers, Separate databases for analytics, Managed services (AWS/GCP equivalents) |

### Scaling Priorities

1. **First bottleneck: Database connections**
   - **Symptoms:** "Too many connections" errors, slow query times
   - **Fix:** Connection pooling (PgBouncer), read replicas for reports, caching frequent queries

2. **Second bottleneck: WebSocket connection limits**
   - **Symptoms:** New connections rejected, high memory usage on WebSocket server
   - **Fix:** Horizontal scaling of WebSocket servers, connection state in Redis (not memory), API Gateway WebSocket (managed)

3. **Third bottleneck: Webhook processing lag**
   - **Symptoms:** Delayed message delivery, queue backlog growing
   - **Fix:** Scale worker count, optimize processing logic, partition queue by tenant

## Anti-Patterns

### Anti-Pattern 1: Business Logic in Webhook Endpoint

**What people do:** Process entire webhook (save to DB, sync CRM, send notifications) synchronously in webhook endpoint

**Why it's wrong:**
- WhatsApp expects response within 5 seconds or retries
- CRM API can be slow/timeout → webhook fails
- Single failure blocks entire flow
- No retry mechanism for individual steps

**Do this instead:** Queue-first pattern (see Pattern 1 above)

**Source:** [Stop Doing Business Logic in Webhook Endpoints](https://dev.to/elvissautet/stop-doing-business-logic-in-webhook-endpoints-i-dont-care-what-your-lead-engineer-says-8o0)

### Anti-Pattern 2: Missing Idempotency in Webhook Processing

**What people do:** Process webhook without checking if already handled

**Why it's wrong:**
- WhatsApp retries failed webhooks → duplicate messages
- Network issues cause duplicate deliveries
- Users see same message multiple times
- CRM gets duplicate records

**Do this instead:**
```typescript
// Store webhook ID before processing
const webhookId = req.body.id; // WhatsApp includes unique ID

// Check if already processed
const exists = await redis.get(`webhook:${webhookId}`);
if (exists) return; // Already processed

// Process webhook
await processMessage(req.body);

// Mark as processed (TTL 7 days)
await redis.setex(`webhook:${webhookId}`, 604800, 'processed');
```

**Source:** [Webhook Best Practices Guide](https://inventivehq.com/blog/webhook-best-practices-guide)

### Anti-Pattern 3: Forgetting to Set Tenant Context on Every Request

**What people do:** Set RLS session variable once at connection start, reuse connection from pool

**Why it's wrong:**
- Connection pooling reuses connections → previous tenant's context bleeds
- User from Tenant A could see Tenant B's data
- Critical security vulnerability
- Silent data leak (no errors)

**Do this instead:**
```typescript
// Middleware on EVERY request
app.use(async (req, res, next) => {
  const tenantId = req.user.tenant_id;

  // ALWAYS set before any DB query in this request
  await req.dbClient.query('SET app.tenant_id = $1', [tenantId]);

  // Optional: Reset at end to prevent leaks
  res.on('finish', () => {
    req.dbClient.query('RESET app.tenant_id');
  });

  next();
});
```

**Source:** [Multi-tenant data isolation with PostgreSQL RLS](https://aws.amazon.com/blogs/database/multi-tenant-data-isolation-with-postgresql-row-level-security/)

### Anti-Pattern 4: Synchronous CRM Sync Blocking User Actions

**What people do:** Wait for CRM API response before returning success to user

**Why it's wrong:**
- CRM API slow → user waits 5-10 seconds
- CRM API down → feature broken
- User can't continue work
- Poor UX

**Do this instead:**
```typescript
// Save to local DB first (fast)
const contact = await db.contacts.create(data);

// Queue CRM sync (async, don't await)
crmSyncQueue.add('sync-contact', { contactId: contact.id });

// Return immediately
res.json({ success: true, contact });

// CRM sync happens in background
// If fails, retry automatically
```

### Anti-Pattern 5: Storing Media Files in Database

**What people do:** Save WhatsApp images/PDFs as BLOB in PostgreSQL

**Why it's wrong:**
- Database bloat (expensive storage)
- Slow queries (large rows)
- Memory issues (loading BLOBs)
- No CDN caching
- Backup size explodes

**Do this instead:**
- Store media in object storage (S3/R2)
- Save only URL in database
- Use CDN for fast delivery
- Set up automatic expiration for old media

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| **WhatsApp Business API** | Webhook (incoming) + REST API (outgoing) | Use Meta Cloud API (free) or 360dialog ($30/mo). Webhook must respond <5s. Store media URLs, download to S3. |
| **Odoo CRM** | REST API with OAuth 2.0 | Map fields: contact.name → partner.name, stage → crm.lead.stage_id. Log messages in Odoo chatter. |
| **Meta Cloud API** | REST API with Bearer token | Generate long-lived access token in Meta Business dashboard. Token expires after 60 days. |
| **Email Service** | SMTP or API (SendGrid/Postmark) | For notifications. Template-based emails with deep links to conversations. |
| **Push Notifications** | Firebase Cloud Messaging or OneSignal | Web push for browser notifications. Optional for v1. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| **Frontend ↔ REST API** | HTTP/HTTPS with JWT auth | Stateless. Every request includes bearer token. |
| **Frontend ↔ WebSocket** | WebSocket connection | Long-lived connection. Send JWT in connection params. |
| **API ↔ Workers** | Message queue (Redis/SQS) | Async, event-driven. Workers poll queue. |
| **Workers ↔ Database** | Direct connection with RLS | Workers set tenant context from job payload. |
| **API ↔ WhatsApp** | REST API (outgoing), Webhook (incoming) | Outgoing: POST to send messages. Incoming: WhatsApp POSTs to our webhook. |

## Multi-Tenancy Isolation Strategy

### Chosen Approach: Pool Model with PostgreSQL RLS

**Why Pool Model:**
- ✅ Simpler deployment (single database)
- ✅ Lower infrastructure cost
- ✅ Easier to maintain
- ✅ Good for SMB SaaS with 100-1000 tenants
- ❌ Shared resources (one tenant can't scale independently)

**Implementation:**

1. **Database Schema:**
```sql
-- Every multi-tenant table has tenant_id
CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL REFERENCES tenants(id),
  phone VARCHAR(20) NOT NULL,
  name VARCHAR(100),
  -- other fields
  CONSTRAINT unique_phone_per_tenant UNIQUE (tenant_id, phone)
);

-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Policy: Only see your tenant's data
CREATE POLICY tenant_isolation ON contacts
  USING (tenant_id = current_setting('app.tenant_id')::INTEGER);
```

2. **Tenant Context Injection (Critical):**
```typescript
// Extract tenant from authenticated user
const tenantId = req.user.tenant_id;

// Set session variable BEFORE any queries
await db.query('SET app.tenant_id = $1', [tenantId]);

// Now all queries are automatically filtered
// SELECT * FROM contacts → WHERE tenant_id = 123 (automatic)
```

3. **Connection Pooling Strategy:**
   - **Option A:** Dedicated pool per tenant (doesn't scale beyond 50 tenants)
   - **Option B:** Shared pool + reset session variable after each request (recommended)
   - **Option C:** No pooling + set session variable on connect (slow, not recommended)

**Security Layers:**

| Layer | Mechanism | What It Prevents |
|-------|-----------|------------------|
| **Application** | Middleware checks user.tenant_id | Accidental cross-tenant access in code |
| **Database** | RLS policies | SQL injection bypassing tenant filter |
| **API** | JWT validation + role checks | Unauthorized access |
| **Object Storage** | Pre-signed URLs per tenant | Direct file access without auth |

**Testing Multi-Tenancy:**

```typescript
// Test: User from Tenant A can't see Tenant B's data
test('tenant isolation', async () => {
  const userA = { id: 1, tenant_id: 100 };
  const userB = { id: 2, tenant_id: 200 };

  // Create contact for Tenant A
  await loginAs(userA);
  const contact = await api.post('/contacts', { name: 'Secret Contact' });

  // Try to access from Tenant B
  await loginAs(userB);
  const response = await api.get(`/contacts/${contact.id}`);

  expect(response.status).toBe(404); // Should not exist for Tenant B
});
```

## Serverless Architecture Patterns

### Serverless vs Traditional: Decision Matrix

| Component | Traditional (Always-On Server) | Serverless (Lambda + API Gateway) | Recommendation |
|-----------|-------------------------------|-----------------------------------|----------------|
| **REST API** | Express.js on EC2/Fargate | API Gateway + Lambda | **Serverless** - Lower cost for variable traffic |
| **WebSocket** | Socket.io on EC2 | API Gateway WebSocket + Lambda | **Hybrid** - Use managed WebSocket but consider persistent server for high traffic |
| **Webhook Processing** | Background worker on server | SQS + Lambda | **Serverless** - Perfect fit for async jobs |
| **CRM Sync** | Scheduled cron job | EventBridge + Lambda | **Serverless** - Event-driven, scales per job |
| **Database** | Self-hosted PostgreSQL | RDS/Aurora Serverless | **Managed (RDS)** - Aurora Serverless v2 for variable load |
| **File Storage** | EFS/EBS | S3/Cloudflare R2 | **Serverless (S3/R2)** - No capacity planning |

### Serverless Best Practices for This Project

1. **Cold Start Mitigation:**
   - Use provisioned concurrency for $connect WebSocket route (most latency-sensitive)
   - Keep Lambda functions small (<50MB) for faster cold starts
   - Share dependencies via Lambda layers

2. **Connection Management:**
   - Store WebSocket connection IDs in Redis (fast lookup)
   - Periodically clean stale connections (Lambda scheduled every 5 min)
   - Use API Gateway's 10-minute idle timeout for auto-cleanup

3. **Database Connection Pooling:**
   - **Problem:** Lambda creates new connection per invocation → exhausts DB connections
   - **Solution:** Use RDS Proxy (connection pooling as a service) or external connection pooler like Supabase

4. **State Management:**
   - Lambda is stateless → store everything in database or Redis
   - Don't rely on Lambda container reuse
   - Use environment variables for config (not hardcoded)

5. **Cost Optimization:**
   - Batch operations (process 10 webhooks per Lambda invocation instead of 1)
   - Use SQS batching (ReceiveMessageWaitTime = 20s) to reduce invocations
   - Set reasonable memory (1024MB usually optimal for Node.js)

### Example Serverless Architecture (AWS)

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLOUDFRONT (CDN)                          │
│  - Serve static frontend (S3)                                    │
│  - Cache media files                                             │
└─────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│                    API GATEWAY (REST + WebSocket)                │
│  - REST API routes → Lambda functions                            │
│  - WebSocket routes: $connect, $disconnect, $default            │
│  - JWT authorizer (Lambda)                                       │
└─────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│                         LAMBDA FUNCTIONS                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ REST API     │  │ WebSocket    │  │ Webhook      │          │
│  │ (CRUD)       │  │ Broadcaster  │  │ Processor    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ RDS Proxy    │  │ ElastiCache  │  │ SQS Queues   │          │
│  │ (Pooling)    │  │ (Redis)      │  │ (Messages)   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│  ┌──────────────────────────┐  ┌──────────────────────────┐     │
│  │ RDS PostgreSQL           │  │ S3 (Media Storage)       │     │
│  │ - Multi-tenant with RLS  │  │ - Images, PDFs, voice    │     │
│  └──────────────────────────┘  └──────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
```

## Build Order & Dependencies

### Recommended Build Sequence

**Phase 1: Foundation (Week 1-2)**
- ✅ PostgreSQL database setup + migrations
- ✅ Multi-tenant schema with RLS policies
- ✅ Basic REST API (auth, tenant context middleware)
- ✅ User authentication (login, JWT)
- ✅ Simple frontend shell (login page, dashboard layout)

**Dependencies:** None (greenfield)
**Why First:** Database schema drives everything else. Get RLS working early before complex features.

---

**Phase 2: WhatsApp Integration (Week 2-3)**
- ✅ WhatsApp Business API setup (Meta developer account)
- ✅ Webhook receiver endpoint (fast ack + queue)
- ✅ Message queue setup (Redis/SQS)
- ✅ Webhook processor (save messages to DB)
- ✅ Send message API (POST /messages/send)
- ✅ Basic conversation view in frontend

**Dependencies:** Phase 1 (database, auth)
**Why Second:** Core value proposition. Need to prove WhatsApp integration works before building complex features.

---

**Phase 3: Real-Time Updates (Week 3-4)**
- ✅ WebSocket server setup
- ✅ Connection management (track user connections)
- ✅ Message broadcasting (new message → all connected clients)
- ✅ Frontend WebSocket client
- ✅ Real-time UI updates

**Dependencies:** Phase 2 (messages must exist to broadcast)
**Why Third:** Users expect instant updates in messaging app. Build early to avoid rearchitecting later.

---

**Phase 4: Contact & Assignment Logic (Week 4-5)**
- ✅ Contact CRUD (create, read, update)
- ✅ Auto-assignment logic (round-robin)
- ✅ Assignment API (manual assign/reassign)
- ✅ "My Leads" view (filter by assigned user)
- ✅ Role-based access (Rep sees only their leads)

**Dependencies:** Phase 1-3 (messages, auth, real-time)
**Why Fourth:** Assignment requires messages to exist. Real-time notifications make assignment UX smooth.

---

**Phase 5: Pipeline & Forms (Week 5-6)**
- ✅ Stage model (New Lead, Qualified, etc.)
- ✅ Stage-specific data forms
- ✅ Stage change API
- ✅ Handoff workflow (assign to next stage)
- ✅ Form validation

**Dependencies:** Phase 4 (contacts, assignment)
**Why Fifth:** Pipeline is core differentiator but requires contacts + assignment to make sense.

---

**Phase 6: Collaboration Features (Week 6-7)**
- ✅ Internal notes (create, read)
- ✅ Activity timeline (mix messages + system events)
- ✅ Manager dashboard (overview metrics)
- ✅ Advanced filters (stage, assigned to, date)

**Dependencies:** Phase 5 (stages must exist for timeline events)
**Why Sixth:** Builds on stable foundation. Manager features require rich data to be useful.

---

**Phase 7: CRM Integration (Week 7-8)**
- ✅ Odoo API client
- ✅ OAuth 2.0 connection flow
- ✅ Field mapping configuration
- ✅ Bidirectional sync (inbox ↔ CRM)
- ✅ Sync status dashboard

**Dependencies:** Phase 1-6 (all core features)
**Why Seventh:** CRM sync is complex. Build after core product is solid. Easier to map fields when you know data model.

---

**Phase 8: Notifications (Week 8-9)**
- ✅ Email notification service
- ✅ Notification triggers (new assignment, new message)
- ✅ User notification preferences
- ✅ In-app notification center
- ✅ Browser push (optional)

**Dependencies:** Phase 4 (assignment), Phase 5 (stage changes)
**Why Eighth:** Notifications require events to trigger on. Build after event-generating features exist.

---

**Phase 9: Polish & Optimization (Week 9-10)**
- ✅ Performance optimization (query tuning, caching)
- ✅ Error handling (user-friendly error messages)
- ✅ Loading states, empty states
- ✅ Mobile responsive refinements
- ✅ Onboarding tutorial
- ✅ Analytics (track usage)

**Dependencies:** All previous phases
**Why Last:** Can't optimize what doesn't exist. Polish after features are complete.

---

### Critical Path Items

**Blockers (must be done before anything else):**
1. PostgreSQL + RLS setup (blocks all features)
2. Authentication (blocks all protected endpoints)
3. WhatsApp webhook receiver (blocks message flow)

**Parallelizable (can be done simultaneously):**
- Frontend UI components (while backend APIs are being built)
- Email notification templates (while notification service is built)
- CRM API research (while core features are implemented)

**De-risking Strategy:**
- **Week 1:** Validate WhatsApp API integration (send/receive one message)
- **Week 2:** Validate RLS works correctly (test cross-tenant isolation)
- **Week 3:** Validate real-time WebSocket (broadcast to multiple clients)
- **Week 7:** Validate Odoo API (create one contact successfully)

## Sources

### Architecture Patterns
- [WhatsApp API Integration Guide 2026](https://www.unipile.com/whatsapp-api-a-complete-guide-to-integration/)
- [Serverless WebSocket Real-Time Messaging](https://www.infoq.com/articles/serverless-websockets-realtime-messaging/)
- [Building a Scalable Webhook Architecture for WhatsApp](https://www.chatarchitect.com/news/building-a-scalable-webhook-architecture-for-custom-whatsapp-solutions)
- [Serverless Multi-Tier Architectures (AWS)](https://docs.aws.amazon.com/whitepapers/latest/serverless-multi-tier-architectures-api-gateway-lambda/sample-architecture-patterns.html)

### Multi-Tenancy & Security
- [Multi-tenant data isolation with PostgreSQL RLS](https://aws.amazon.com/blogs/database/multi-tenant-data-isolation-with-postgresql-row-level-security/)
- [How to Implement PostgreSQL RLS for Multi-Tenant SaaS](https://www.techbuddies.io/2026/01/01/how-to-implement-postgresql-row-level-security-for-multi-tenant-saas/)
- [Implementing Fine-Grained Postgres Permissions](https://www.permit.io/blog/implementing-fine-grained-postgres-permissions-for-multi-tenant-applications)

### Webhook Processing
- [Stop Doing Business Logic in Webhook Endpoints](https://dev.to/elvissautel/stop-doing-business-logic-in-webhook-endpoints-i-dont-care-what-your-lead-engineer-says-8o0)
- [Webhooks at Scale: Best Practices](https://hookdeck.com/blog/webhooks-at-scale)
- [Webhook Best Practices Guide](https://inventivehq.com/blog/webhook-best-practices-guide)
- [How I Built a Reliable Webhook Queue](https://dev.to/ysalitrynskyi/how-i-built-a-reliable-webhook-queue-in-rust-retries-idempotency-dlq-schedules-workflows-2o7n)

### Real-Time & WebSocket
- [Tutorial: WebSocket chat with API Gateway and Lambda](https://docs.aws.amazon.com/apigateway/latest/developerguide/websocket-api-chat-app.html)
- [How to Configure WebSocket with AWS API Gateway](https://oneuptime.com/blog/post/2026-01-24-websocket-aws-api-gateway/view)
- [Building serverless multi-Region WebSocket APIs](https://aws.amazon.com/blogs/compute/building-serverless-multi-region-websocket-apis/)

### SaaS Development
- [SaaS MVP Development Guide 2026](https://dbbsoftware.com/insights/how-to-build-an-mvp-for-saas)
- [SaaS Application Development Complete Guide](https://www.weweb.io/blog/saas-application-development-complete-guide)

---

*Architecture research for: WhatsApp Team Inbox SaaS with Sales Pipeline*
*Researched: February 5, 2026*
*Confidence: HIGH (verified with official docs, current sources, implementation examples)*
