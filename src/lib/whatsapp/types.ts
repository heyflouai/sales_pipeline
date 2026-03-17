/**
 * TypeScript types for Meta Cloud API webhook payloads.
 * Reference: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples
 */

export interface WhatsAppWebhookPayload {
  object: string; // "whatsapp_business_account"
  entry: WhatsAppEntry[];
}

export interface WhatsAppEntry {
  id: string; // WABA ID
  changes: WhatsAppChange[];
}

export interface WhatsAppChange {
  value: WhatsAppChangeValue;
  field: string; // "messages"
}

export interface WhatsAppChangeValue {
  messaging_product: string; // "whatsapp"
  metadata: WhatsAppMetadata;
  contacts?: WhatsAppContact[];
  messages?: WhatsAppMessage[];
  statuses?: WhatsAppStatus[];
}

export interface WhatsAppMetadata {
  display_phone_number: string;
  phone_number_id: string; // The org's phoneNumberId
}

export interface WhatsAppContact {
  profile: {
    name: string;
  };
  wa_id: string; // phone number without + prefix
}

export interface WhatsAppMediaObject {
  id: string; // Media ID from Meta
  mime_type?: string;
  sha256?: string;
  caption?: string;
  filename?: string;
}

export interface WhatsAppMessage {
  from: string; // phone number without + prefix
  id: string; // wamid.xxx
  timestamp: string; // Unix timestamp string
  type: "text" | "image" | "document" | "audio" | "video" | "location" | "contacts" | "interactive" | "button" | "order" | "system" | "unknown";
  text?: {
    body: string;
  };
  image?: WhatsAppMediaObject;
  document?: WhatsAppMediaObject;
  audio?: WhatsAppMediaObject;
  video?: WhatsAppMediaObject;
}

export interface WhatsAppMediaUrlResponse {
  url: string;
  mime_type: string;
  sha256: string;
  file_size: number;
  id: string;
}

export interface WhatsAppTemplateComponent {
  type: "header" | "body" | "button";
  sub_type?: string;
  index?: number;
  parameters?: Array<{
    type: "text" | "image" | "document" | "video" | "payload";
    text?: string;
    image?: { link: string };
    document?: { link: string; filename?: string };
    video?: { link: string };
    payload?: string;
  }>;
}

export interface WhatsAppStatus {
  id: string; // wamid.xxx
  status: "sent" | "delivered" | "read" | "failed";
  timestamp: string;
  recipient_id: string;
  errors?: Array<{
    code: number;
    title: string;
    message: string;
    error_data?: {
      details: string;
    };
  }>;
}

/**
 * Meta Cloud API send message request body
 */
export interface SendMessageRequest {
  messaging_product: "whatsapp";
  recipient_type?: "individual";
  to: string; // E.164 without + prefix for Meta API (but we store with +)
  type: "text";
  text: {
    preview_url?: boolean;
    body: string;
  };
}

/**
 * Meta Cloud API send message response
 */
export interface SendMessageResponse {
  messaging_product: string;
  contacts: Array<{
    input: string;
    wa_id: string;
  }>;
  messages: Array<{
    id: string; // wamid.xxx
  }>;
}
