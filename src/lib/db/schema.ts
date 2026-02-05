import { pgTable, text, timestamp, boolean, pgEnum, index } from "drizzle-orm/pg-core";

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

// TypeScript types
export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserRole = typeof userRoleEnum.enumValues[number];
