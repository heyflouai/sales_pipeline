/**
 * Supabase Realtime client for real-time message and conversation updates.
 *
 * Uses @supabase/supabase-js with anon key (safe for client-side).
 * Supabase Realtime broadcasts DB changes via websocket.
 *
 * Usage (client component):
 *   const unsub = subscribeToMessages(conversationId, (msg) => { ... })
 *   return () => unsub()
 */

import { createClient, type SupabaseClient, type RealtimeChannel } from "@supabase/supabase-js";
import type { Message, Conversation } from "@/lib/db/schema";

let _supabaseClient: SupabaseClient | null = null;

/**
 * Get or create the Supabase client for Realtime.
 * Uses the public anon key — safe for client-side.
 */
function getSupabaseClient(): SupabaseClient {
  if (_supabaseClient) return _supabaseClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set for Realtime"
    );
  }

  _supabaseClient = createClient(url, anonKey, {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });

  return _supabaseClient;
}

/**
 * Subscribe to new messages in a conversation.
 * Calls onMessage when a new message is inserted.
 *
 * @param conversationId - The conversation to watch
 * @param onMessage - Callback with the new message
 * @returns Unsubscribe function
 */
export function subscribeToMessages(
  conversationId: string,
  onMessage: (message: Message) => void
): () => void {
  const supabase = getSupabaseClient();

  const channel: RealtimeChannel = supabase
    .channel(`messages:${conversationId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        onMessage(payload.new as Message);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Subscribe to message status updates in a conversation.
 * Calls onStatusUpdate when a message status changes (delivered, read, etc.).
 *
 * @param conversationId - The conversation to watch
 * @param onStatusUpdate - Callback with updated message
 * @returns Unsubscribe function
 */
export function subscribeToMessageUpdates(
  conversationId: string,
  onStatusUpdate: (message: Message) => void
): () => void {
  const supabase = getSupabaseClient();

  const channel: RealtimeChannel = supabase
    .channel(`message-updates:${conversationId}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        onStatusUpdate(payload.new as Message);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Subscribe to conversation updates for an organization.
 * Useful for inbox list — shows new conversations and window expiry changes.
 *
 * @param organizationId - The organization to watch
 * @param onConversationChange - Callback with updated conversation
 * @returns Unsubscribe function
 */
export function subscribeToConversations(
  organizationId: string,
  onConversationChange: (conversation: Conversation) => void
): () => void {
  const supabase = getSupabaseClient();

  const channel: RealtimeChannel = supabase
    .channel(`conversations:${organizationId}`)
    .on(
      "postgres_changes",
      {
        event: "*", // INSERT and UPDATE
        schema: "public",
        table: "conversations",
        filter: `organization_id=eq.${organizationId}`,
      },
      (payload) => {
        onConversationChange(payload.new as Conversation);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
