/**
 * GET /api/conversations
 * Fetch all conversations for the current org, with contact info.
 */

import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth/rbac";
import { db, setTenantContext } from "@/lib/db";
import { conversations, contacts } from "@/lib/db/schema";

export async function GET() {
  let orgId: string;
  try {
    const user = await getCurrentUser();
    orgId = user.orgId;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await setTenantContext(orgId);

    const rows = await db
      .select({
        id: conversations.id,
        status: conversations.status,
        windowExpiresAt: conversations.windowExpiresAt,
        lastMessageAt: conversations.lastMessageAt,
        assignedUserId: conversations.assignedUserId,
        createdAt: conversations.createdAt,
        contactId: contacts.id,
        contactPhone: contacts.phoneNumber,
        contactName: contacts.displayName,
      })
      .from(conversations)
      .innerJoin(contacts, eq(conversations.contactId, contacts.id))
      .where(eq(conversations.organizationId, orgId))
      .orderBy(desc(conversations.lastMessageAt));

    return NextResponse.json({ conversations: rows });
  } catch (err) {
    console.error("[GET /api/conversations]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
