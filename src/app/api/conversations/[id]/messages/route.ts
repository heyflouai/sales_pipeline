/**
 * GET /api/conversations/[id]/messages
 * Fetch all messages for a conversation (must belong to current org).
 */

import { NextRequest, NextResponse } from "next/server";
import { eq, and, asc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth/rbac";
import { db, setTenantContext } from "@/lib/db";
import { conversations, messages } from "@/lib/db/schema";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let orgId: string;
  try {
    const user = await getCurrentUser();
    orgId = user.orgId;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: conversationId } = await params;

  try {
    await setTenantContext(orgId);

    // Verify the conversation belongs to this org
    const [conv] = await db
      .select({ id: conversations.id, status: conversations.status, windowExpiresAt: conversations.windowExpiresAt })
      .from(conversations)
      .where(and(eq(conversations.id, conversationId), eq(conversations.organizationId, orgId)))
      .limit(1);

    if (!conv) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    const msgs = await db
      .select()
      .from(messages)
      .where(and(eq(messages.conversationId, conversationId), eq(messages.organizationId, orgId)))
      .orderBy(asc(messages.createdAt));

    return NextResponse.json({
      messages: msgs,
      conversation: conv,
    });
  } catch (err) {
    console.error("[GET /api/conversations/[id]/messages]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
