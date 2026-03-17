import { pgTable, text, timestamp, boolean, pgEnum, index, unique } from "drizzle-orm/pg-core";

// User role enum
export const userRoleEnum = pgEnum("user_role", ["admin", "manager", "agent"]);

// Organizations table
export const organizations = pgTable("organizations", {
  id: text("id").primaryKey(), // Clerk organization ID (org_xxx)
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  whatsappPhoneNumberId: text("whatsapp_phone_number_id"), // Meta phone number ID
  whatsappBusinessAccountId: text("whatsapp_business_account_id"), // Meta WABA ID
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Users table
export const users = pgTable("users", {
  id: text("id").primaryKey(), // Clerk user ID (user_xxx)
  organizationId: text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  imageUrl: text("image_url"),
  role: userRoleEnum("role").notNull().default("agent"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  orgIdIdx: index("users_org_id_idx").on(table.organizationId),
  emailIdx: index("users_email_idx").on(table.email),
}));

// Contacts table — auto-created from incoming WhatsApp messages
export const contacts = pgTable("contacts", {
  id: text("id").primaryKey(), // nanoid
  organizationId: text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  phoneNumber: text("phone_number").notNull(), // E.164 format: +1234567890
  displayName: text("display_name"), // WhatsApp display name
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  orgIdIdx: index("contacts_org_id_idx").on(table.organizationId),
  phoneIdx: index("contacts_phone_idx").on(table.phoneNumber),
  orgPhoneUniq: unique("contacts_org_phone_unique").on(table.organizationId, table.phoneNumber),
}));

// Conversation status enum
export const conversationStatusEnum = pgEnum("conversation_status", ["active", "expired", "closed"]);

// Conversations table — one per contact per org (WhatsApp thread)
export const conversations = pgTable("conversations", {
  id: text("id").primaryKey(), // nanoid
  organizationId: text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  contactId: text("contact_id")
    .notNull()
    .references(() => contacts.id, { onDelete: "cascade" }),
  assignedUserId: text("assigned_user_id")
    .references(() => users.id, { onDelete: "set null" }),
  status: conversationStatusEnum("status").notNull().default("active"),
  windowExpiresAt: timestamp("window_expires_at"), // 24h from last inbound message
  lastMessageAt: timestamp("last_message_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  orgIdIdx: index("conversations_org_id_idx").on(table.organizationId),
  contactIdIdx: index("conversations_contact_id_idx").on(table.contactId),
  assignedUserIdx: index("conversations_assigned_user_idx").on(table.assignedUserId),
}));

// Message direction enum
export const messageDirectionEnum = pgEnum("message_direction", ["inbound", "outbound"]);

// Message status enum
export const messageStatusEnum = pgEnum("message_status", ["sent", "delivered", "read", "failed"]);

// Messages table — individual WhatsApp messages
export const messages = pgTable("messages", {
  id: text("id").primaryKey(), // nanoid
  conversationId: text("conversation_id")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  direction: messageDirectionEnum("direction").notNull(),
  waMessageId: text("wa_message_id"), // Meta message ID (wamid.xxx)
  content: text("content"), // message text
  status: messageStatusEnum("status").notNull().default("sent"),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  conversationIdIdx: index("messages_conversation_id_idx").on(table.conversationId),
  orgIdIdx: index("messages_org_id_idx").on(table.organizationId),
  waMessageIdIdx: index("messages_wa_message_id_idx").on(table.waMessageId),
  waMessageIdUniq: unique("messages_wa_message_id_unique").on(table.waMessageId),
}));

// TypeScript types
export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserRole = typeof userRoleEnum.enumValues[number];

export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;

export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;
export type ConversationStatus = typeof conversationStatusEnum.enumValues[number];

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
export type MessageDirection = typeof messageDirectionEnum.enumValues[number];
export type MessageStatus = typeof messageStatusEnum.enumValues[number];
