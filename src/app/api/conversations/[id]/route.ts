/**
 * GET /api/conversations/[id]
 *
 * Fetch a conversation with its messages and window status.
 * Requires: Clerk auth + organization context.
 */

import { NextRequest, NextResponse } from "next/server";
import { eq, and, asc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth/rbac";
import { db, setTenantContext } from "@/lib/db";
import { conversations, contacts, messages } from "@/lib/db/schema";

type WindowStatus = "active" | "expired";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Auth check
  let orgId: string;
  try {
    const user = await getCurrentUser();
    orgId = user.orgId;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unauthorized";
    return NextResponse.json({ error: msg }, { status: 401 });
  }

  const { id: conversationId } = await params;

  try {
    await setTenantContext(orgId);

    // 2. Fetch conversation + contact
    const [row] = await db
      .select({
        conversation: conversations,
        contact: contacts,
      })
      .from(conversations)
      .innerJoin(contacts, eq(conversations.contactId, contacts.id))
      .where(
        and(
          eq(conversations.id, conversationId),
          eq(conversations.organizationId, orgId)
        )
      )
      .limit(1);

    if (!row) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // 3. Compute window status
    const windowStatus: WindowStatus =
      row.conversation.windowExpiresAt !== null &&
      new Date(row.conversation.windowExpiresAt) > new Date()
        ? "active"
        : "expired";

    // 4. Fetch messages
    const msgs = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(asc(messages.createdAt));

    // 5. Compute countdown (seconds remaining in window)
    let windowSecondsRemaining: number | null = null;
    if (windowStatus === "active" && row.conversation.windowExpiresAt) {
      windowSecondsRemaining = Math.max(
        0,
        Math.floor(
          (new Date(row.conversation.windowExpiresAt).getTime() - Date.now()) / 1000
        )
      );
    }

    return NextResponse.json({
      conversation: {
        ...row.conversation,
        windowStatus,
        windowSecondsRemaining,
      },
      contact: row.contact,
      messages: msgs,
    });
  } catch (err) {
    console.error("[Conversations GET] Error:", err);
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
