/**
 * Meta Cloud API client helper for sending WhatsApp messages.
 */

import type { SendMessageRequest, SendMessageResponse } from "./types";

const META_API_VERSION = "v21.0";
const META_API_BASE = "https://graph.facebook.com";

/**
 * Send a text message via Meta Cloud API.
 *
 * @param phoneNumberId - The org's WhatsApp phone number ID (from Meta Business)
 * @param to - Recipient phone number (E.164 format, e.g. +1234567890)
 * @param text - Message text content
 * @param apiToken - Meta system user access token (WHATSAPP_API_TOKEN)
 * @returns The wamid (Meta message ID) for the sent message
 */
export async function sendWhatsAppTextMessage(
  phoneNumberId: string,
  to: string,
  text: string,
  apiToken: string
): Promise<string> {
  // Meta API expects phone without leading +
  const toNormalized = to.startsWith("+") ? to.slice(1) : to;

  const body: SendMessageRequest = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: toNormalized,
    type: "text",
    text: {
      preview_url: false,
      body: text,
    },
  };

  const url = `${META_API_BASE}/${META_API_VERSION}/${phoneNumberId}/messages`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Meta Cloud API error ${response.status}: ${errorText}`
    );
  }

  const data: SendMessageResponse = await response.json();
  const wamid = data.messages?.[0]?.id;

  if (!wamid) {
    throw new Error("Meta Cloud API returned no message ID");
  }

  return wamid;
}

/**
 * Verify a Meta webhook signature (X-Hub-Signature-256).
 * Uses HMAC-SHA256 of the raw request body with the app secret.
 *
 * @param rawBody - Raw request body as Buffer or string
 * @param signature - Value of X-Hub-Signature-256 header (sha256=<hex>)
 * @param secret - WHATSAPP_API_TOKEN or app secret used to sign
 */
export async function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string
): Promise<boolean> {
  if (!signature.startsWith("sha256=")) {
    return false;
  }

  const expectedHex = signature.slice("sha256=".length);

  // Use Web Crypto API (available in Next.js edge/node runtimes)
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(rawBody)
  );

  const computedHex = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Constant-time comparison
  if (computedHex.length !== expectedHex.length) return false;

  let diff = 0;
  for (let i = 0; i < computedHex.length; i++) {
    diff |= computedHex.charCodeAt(i) ^ expectedHex.charCodeAt(i);
  }

  return diff === 0;
}
