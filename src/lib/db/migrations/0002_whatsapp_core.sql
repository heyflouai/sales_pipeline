-- Phase 2: WhatsApp Core tables
-- contacts, conversations, messages with RLS policies

CREATE TYPE "public"."conversation_status" AS ENUM('active', 'expired', 'closed');--> statement-breakpoint
CREATE TYPE "public"."message_direction" AS ENUM('inbound', 'outbound');--> statement-breakpoint
CREATE TYPE "public"."message_status" AS ENUM('sent', 'delivered', 'read', 'failed');--> statement-breakpoint

CREATE TABLE "contacts" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"phone_number" text NOT NULL,
	"display_name" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "contacts_org_phone_unique" UNIQUE("organization_id","phone_number")
);--> statement-breakpoint

CREATE TABLE "conversations" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"contact_id" text NOT NULL,
	"assigned_user_id" text,
	"status" "conversation_status" DEFAULT 'active' NOT NULL,
	"window_expires_at" timestamp,
	"last_message_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint

CREATE TABLE "messages" (
	"id" text PRIMARY KEY NOT NULL,
	"conversation_id" text NOT NULL,
	"organization_id" text NOT NULL,
	"direction" "message_direction" NOT NULL,
	"wa_message_id" text,
	"content" text,
	"status" "message_status" DEFAULT 'sent' NOT NULL,
	"sent_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "messages_wa_message_id_unique" UNIQUE("wa_message_id")
);--> statement-breakpoint

-- Foreign keys
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_assigned_user_id_users_id_fk" FOREIGN KEY ("assigned_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint

-- Indexes
CREATE INDEX "contacts_org_id_idx" ON "contacts" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "contacts_phone_idx" ON "contacts" USING btree ("phone_number");--> statement-breakpoint
CREATE INDEX "conversations_org_id_idx" ON "conversations" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "conversations_contact_id_idx" ON "conversations" USING btree ("contact_id");--> statement-breakpoint
CREATE INDEX "conversations_assigned_user_idx" ON "conversations" USING btree ("assigned_user_id");--> statement-breakpoint
CREATE INDEX "messages_conversation_id_idx" ON "messages" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "messages_org_id_idx" ON "messages" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "messages_wa_message_id_idx" ON "messages" USING btree ("wa_message_id");--> statement-breakpoint

-- Enable RLS on new tables
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;--> statement-breakpoint

-- RLS policies: tenant isolation via organization_id
CREATE POLICY contacts_tenant_isolation ON contacts
  FOR ALL
  USING (organization_id = current_setting('app.current_organization_id', true)::text);--> statement-breakpoint

CREATE POLICY conversations_tenant_isolation ON conversations
  FOR ALL
  USING (organization_id = current_setting('app.current_organization_id', true)::text);--> statement-breakpoint

CREATE POLICY messages_tenant_isolation ON messages
  FOR ALL
  USING (organization_id = current_setting('app.current_organization_id', true)::text);--> statement-breakpoint

-- INSERT policies
CREATE POLICY contacts_insert_policy ON contacts
  FOR INSERT
  WITH CHECK (organization_id = current_setting('app.current_organization_id', true)::text);--> statement-breakpoint

CREATE POLICY conversations_insert_policy ON conversations
  FOR INSERT
  WITH CHECK (organization_id = current_setting('app.current_organization_id', true)::text);--> statement-breakpoint

CREATE POLICY messages_insert_policy ON messages
  FOR INSERT
  WITH CHECK (organization_id = current_setting('app.current_organization_id', true)::text);
