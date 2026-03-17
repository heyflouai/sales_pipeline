/**
 * POST /api/whatsapp/send-template
 * Send a WhatsApp template message (for expired 24h windows).
 */

import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/rbac";
import { db, setTenantContext } from "@/lib/db";
import { adminDb } from "@/lib/db/admin";
import { conversations, contacts, messages, organizations, whatsappTemplates } from "@/lib/db/schema";

const sendTemplateSchema = z.object({
  conversationId: z.string().min(1),
  templateName: z.string().min(1),
  language: z.string().default("en_US"),
  components: z.array(z.any()).default([]),
});

export async function POST(request: NextRequest) {
  let orgId: string;
  let userId: string;
  try {
    const user = await getCurrentUser();
    orgId = user.orgId;
    userId = user.userId;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: z.infer<typeof sendTemplateSchema>;
  try {
    body = sendTemplateSchema.parse(await request.json());
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request", details: err.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    await setTenantContext(orgId);

    // Get conversation + contact
    const [conv] = await db
      .select({
        id: conversations.id,
        contactId: conversations.contactId,
      })
      .from(conversations)
      .where(and(eq(conversations.id, body.conversationId), eq(conversations.organizationId, orgId)))
      .limit(1);

    if (!conv) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    const [contact] = await db
      .select({ phoneNumber: contacts.phoneNumber })
      .from(contacts)
      .where(eq(contacts.id, conv.contactId))
      .limit(1);

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    // Get org WhatsApp config
    const [org] = await adminDb
      .select({ whatsappPhoneNumberId: organizations.whatsappPhoneNumberId })
      .from(organizations)
      .where(eq(organizations.id, orgId))
      .limit(1);

    const phoneNumberId = org?.whatsappPhoneNumberId || process.env.WHATSAPP_PHONE_NUMBER_ID;
    const apiToken = process.env.WHATSAPP_API_TOKEN;

    if (!phoneNumberId || !apiToken) {
      return NextResponse.json({ error: "WhatsApp not configured" }, { status: 503 });
    }

    // Send via Meta API
    const metaResponse = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: contact.phoneNumber.replace("+", ""),
          type: "template",
          template: {
            name: body.templateName,
            language: { code: body.language },
            components: body.components,
          },
        }),
      }
    );

    const metaData = await metaResponse.json() as { messages?: Array<{ id: string }> };

    if (!metaResponse.ok) {
      console.error("[send-template] Meta API error:", metaData);
      return NextResponse.json({ error: "Failed to send template" }, { status: 502 });
    }

    const waMessageId = metaData.messages?.[0]?.id;

    // Store in DB
    const [msg] = await db
      .insert(messages)
      .values({
        id: nanoid(),
        conversationId: body.conversationId,
        organizationId: orgId,
        direction: "outbound",
        waMessageId,
        content: `[Template: ${body.templateName}]`,
        status: "sent",
        sentAt: new Date(),
      })
      .returning();

    return NextResponse.json({ success: true, messageId: msg.id });
  } catch (err) {
    console.error("[POST /api/whatsapp/send-template]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
