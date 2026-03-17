/**
 * POST /api/whatsapp/send
 *
 * Send a WhatsApp text message via Meta Cloud API.
 * Requires: Clerk auth + organization context.
 */

import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/rbac";
import { db, setTenantContext } from "@/lib/db";
import { adminDb } from "@/lib/db/admin";
import {
  organizations,
  conversations,
  contacts,
  messages,
} from "@/lib/db/schema";
import { sendWhatsAppTextMessage } from "@/lib/whatsapp/client";

const sendMessageSchema = z.object({
  conversationId: z.string().min(1, "conversationId is required"),
  content: z.string().min(1, "content is required").max(4096, "content too long"),
});

export async function POST(request: NextRequest) {
  // 1. Auth check
  let userId: string;
  let orgId: string;

  try {
    const user = await getCurrentUser();
    userId = user.userId;
    orgId = user.orgId;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unauthorized";
    return NextResponse.json({ error: msg }, { status: 401 });
  }

  // 2. Parse + validate body
  let body: z.infer<typeof sendMessageSchema>;
  try {
    const raw = await request.json();
    body = sendMessageSchema.parse(raw);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: err.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { conversationId, content } = body;

  try {
    // Set tenant context for RLS
    await setTenantContext(orgId);

    // 3. Fetch conversation + contact + org credentials
    const [conversation] = await db
      .select({
        id: conversations.id,
        organizationId: conversations.organizationId,
        contactId: conversations.contactId,
        windowExpiresAt: conversations.windowExpiresAt,
        status: conversations.status,
      })
      .from(conversations)
      .where(
        and(
          eq(conversations.id, conversationId),
          eq(conversations.organizationId, orgId)
        )
      )
      .limit(1);

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // 4. Check 24-hour window
    const isWindowActive =
      conversation.windowExpiresAt !== null &&
      new Date(conversation.windowExpiresAt) > new Date();

    if (!isWindowActive) {
      return NextResponse.json(
        {
          error: "24-hour conversation window has expired. Use a message template to restart.",
          windowStatus: "expired",
        },
        { status: 422 }
      );
    }

    // 5. Fetch contact phone number
    const [contact] = await db
      .select({ phoneNumber: contacts.phoneNumber })
      .from(contacts)
      .where(eq(contacts.id, conversation.contactId))
      .limit(1);

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    // 6. Fetch org WhatsApp credentials (use adminDb to bypass potential RLS issues)
    const [org] = await adminDb
      .select({
        whatsappPhoneNumberId: organizations.whatsappPhoneNumberId,
      })
      .from(organizations)
      .where(eq(organizations.id, orgId))
      .limit(1);

    if (!org?.whatsappPhoneNumberId) {
      return NextResponse.json(
        { error: "WhatsApp not configured for this organization" },
        { status: 422 }
      );
    }

    const apiToken = process.env.WHATSAPP_API_TOKEN;
    if (!apiToken || apiToken.includes("your-meta")) {
      return NextResponse.json(
        { error: "WHATSAPP_API_TOKEN not configured" },
        { status: 500 }
      );
    }

    // 7. Send via Meta Cloud API
    const wamid = await sendWhatsAppTextMessage(
      org.whatsappPhoneNumberId,
      contact.phoneNumber,
      content,
      apiToken
    );

    // 8. Store outbound message
    const messageId = nanoid();
    const now = new Date();

    const [message] = await db
      .insert(messages)
      .values({
        id: messageId,
        conversationId,
        organizationId: orgId,
        direction: "outbound",
        waMessageId: wamid,
        content,
        status: "sent",
        sentAt: now,
        createdAt: now,
      })
      .returning();

    // 9. Update conversation lastMessageAt
    await db
      .update(conversations)
      .set({ lastMessageAt: now, updatedAt: now })
      .where(eq(conversations.id, conversationId));

    return NextResponse.json(
      {
        message,
        windowStatus: "active",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[WhatsApp Send] Error:", err);
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
