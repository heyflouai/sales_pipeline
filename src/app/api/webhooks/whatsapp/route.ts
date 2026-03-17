/**
 * WhatsApp Meta Cloud API Webhook
 *
 * GET  /api/webhooks/whatsapp — Webhook verification
 * POST /api/webhooks/whatsapp — Receive incoming messages and status updates
 */

import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { adminDb } from "@/lib/db/admin";
import {
  organizations,
  contacts,
  conversations,
  messages,
} from "@/lib/db/schema";
import { verifyWebhookSignature } from "@/lib/whatsapp/client";
import type {
  WhatsAppWebhookPayload,
  WhatsAppChangeValue,
} from "@/lib/whatsapp/types";

// ─── GET: Webhook Verification ───────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (!verifyToken) {
    console.error("[WhatsApp Webhook] WHATSAPP_VERIFY_TOKEN not configured");
    return new NextResponse("Server misconfiguration", { status: 500 });
  }

  if (mode === "subscribe" && token === verifyToken) {
    console.log("[WhatsApp Webhook] Verification successful");
    return new NextResponse(challenge, { status: 200 });
  }

  console.warn("[WhatsApp Webhook] Verification failed", { mode, token });
  return new NextResponse("Forbidden", { status: 403 });
}

// ─── POST: Receive Messages & Status Updates ──────────────────────────────────

export async function POST(request: NextRequest) {
  // Always return 200 quickly to Meta (they retry on non-200)
  // Process the payload asynchronously after responding

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return new NextResponse("OK", { status: 200 });
  }

  // Verify signature using Meta App Secret (X-Hub-Signature-256)
  // Meta signs webhook payloads with the App Secret, NOT the access token.
  const appSecret = process.env.WHATSAPP_APP_SECRET;
  const signature = request.headers.get("x-hub-signature-256");

  if (appSecret && signature) {
    const isValid = await verifyWebhookSignature(rawBody, signature, appSecret);
    if (!isValid) {
      console.warn("[WhatsApp Webhook] Invalid signature — rejecting");
      return new NextResponse("Forbidden", { status: 403 });
    }
  } else if (appSecret && !signature) {
    // App secret configured but no signature header — reject
    console.warn("[WhatsApp Webhook] Missing X-Hub-Signature-256 header");
    return new NextResponse("Forbidden", { status: 403 });
  }

  let payload: WhatsAppWebhookPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    console.error("[WhatsApp Webhook] Failed to parse payload");
    return new NextResponse("OK", { status: 200 });
  }

  // Process in background (don't await, return 200 immediately)
  processWebhookPayload(payload).catch((err) => {
    console.error("[WhatsApp Webhook] Processing error:", err);
  });

  return new NextResponse("OK", { status: 200 });
}

// ─── Processing Logic ──────────────────────────────────────────────────────────

async function processWebhookPayload(payload: WhatsAppWebhookPayload) {
  if (payload.object !== "whatsapp_business_account") return;

  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (change.field !== "messages") continue;
      await processChange(change.value);
    }
  }
}

async function processChange(value: WhatsAppChangeValue) {
  const phoneNumberId = value.metadata?.phone_number_id;
  if (!phoneNumberId) return;

  // Find the organization that owns this phone number
  const [org] = await adminDb
    .select()
    .from(organizations)
    .where(eq(organizations.whatsappPhoneNumberId, phoneNumberId))
    .limit(1);

  if (!org) {
    console.warn("[WhatsApp Webhook] No org found for phoneNumberId:", phoneNumberId);
    return;
  }

  // Handle incoming messages
  for (const msg of value.messages ?? []) {
    if (msg.type !== "text" || !msg.text?.body) {
      // Skip non-text messages for now (Phase 2 scope: text only)
      console.log("[WhatsApp Webhook] Skipping non-text message:", msg.type);
      continue;
    }

    // Enforce maximum content length (guard against malformed/malicious payloads)
    if (msg.text.body.length > 65536) {
      console.warn("[WhatsApp Webhook] Message content too long, truncating");
      msg.text.body = msg.text.body.slice(0, 65536);
    }

    const phoneNumber = `+${msg.from}`; // normalize to E.164 with +
    const displayName =
      value.contacts?.find((c) => c.wa_id === msg.from)?.profile?.name ??
      phoneNumber;

    await handleInboundMessage({
      orgId: org.id,
      phoneNumber,
      displayName,
      waMessageId: msg.id,
      content: msg.text.body,
      sentAt: new Date(parseInt(msg.timestamp, 10) * 1000),
    });
  }

  // Handle status updates
  for (const status of value.statuses ?? []) {
    await handleStatusUpdate({
      waMessageId: status.id,
      status: status.status,
    });
  }
}

interface InboundMessageParams {
  orgId: string;
  phoneNumber: string;
  displayName: string;
  waMessageId: string;
  content: string;
  sentAt: Date;
}

async function handleInboundMessage(params: InboundMessageParams) {
  const { orgId, phoneNumber, displayName, waMessageId, content, sentAt } =
    params;

  // 1. Upsert contact (auto-create on first message)
  let contact = await adminDb
    .select()
    .from(contacts)
    .where(
      and(
        eq(contacts.organizationId, orgId),
        eq(contacts.phoneNumber, phoneNumber)
      )
    )
    .limit(1)
    .then((rows) => rows[0] ?? null);

  if (!contact) {
    const newContactId = nanoid();
    const [created] = await adminDb
      .insert(contacts)
      .values({
        id: newContactId,
        organizationId: orgId,
        phoneNumber,
        displayName,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    contact = created;
    console.log("[WhatsApp Webhook] Auto-created contact:", phoneNumber);
  } else if (contact.displayName !== displayName && displayName !== phoneNumber) {
    // Update display name if changed
    await adminDb
      .update(contacts)
      .set({ displayName, updatedAt: new Date() })
      .where(eq(contacts.id, contact.id));
  }

  // 2. Upsert conversation
  let conversation = await adminDb
    .select()
    .from(conversations)
    .where(
      and(
        eq(conversations.organizationId, orgId),
        eq(conversations.contactId, contact.id)
      )
    )
    .limit(1)
    .then((rows) => rows[0] ?? null);

  const windowExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // +24h

  if (!conversation) {
    const newConvId = nanoid();
    const [created] = await adminDb
      .insert(conversations)
      .values({
        id: newConvId,
        organizationId: orgId,
        contactId: contact.id,
        status: "active",
        windowExpiresAt,
        lastMessageAt: sentAt,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    conversation = created;
    console.log("[WhatsApp Webhook] Created new conversation:", newConvId);
  } else {
    // Reset 24h window on inbound message
    await adminDb
      .update(conversations)
      .set({
        windowExpiresAt,
        lastMessageAt: sentAt,
        status: "active",
        updatedAt: new Date(),
      })
      .where(eq(conversations.id, conversation.id));
  }

  // 3. Insert message (idempotent via waMessageId unique constraint)
  try {
    await adminDb.insert(messages).values({
      id: nanoid(),
      conversationId: conversation.id,
      organizationId: orgId,
      direction: "inbound",
      waMessageId,
      content,
      status: "delivered", // inbound messages are already delivered
      sentAt,
      createdAt: new Date(),
    });
    console.log("[WhatsApp Webhook] Stored message:", waMessageId);
  } catch (err: unknown) {
    // Ignore duplicate key errors (webhook replay idempotency)
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("duplicate") || msg.includes("unique")) {
      console.log("[WhatsApp Webhook] Duplicate message ignored:", waMessageId);
    } else {
      throw err;
    }
  }
}

interface StatusUpdateParams {
  waMessageId: string;
  status: "sent" | "delivered" | "read" | "failed";
}

async function handleStatusUpdate(params: StatusUpdateParams) {
  const { waMessageId, status } = params;

  await adminDb
    .update(messages)
    .set({ status })
    .where(eq(messages.waMessageId, waMessageId));

  console.log("[WhatsApp Webhook] Updated message status:", waMessageId, "→", status);
}
