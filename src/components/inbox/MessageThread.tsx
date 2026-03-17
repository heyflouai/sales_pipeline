"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { subscribeToMessages, subscribeToMessageUpdates } from "@/lib/realtime/client";
import type { Message } from "@/lib/db/schema";

type Props = {
  conversationId: string;
  orgId: string;
};

type ConversationMeta = {
  status: string;
  windowExpiresAt: string | null;
};

function MessageStatusIcon({ status }: { status: string }) {
  if (status === "read") {
    return <span className="text-blue-400 text-xs ml-1">✓✓</span>;
  }
  if (status === "delivered") {
    return <span className="text-gray-400 text-xs ml-1">✓✓</span>;
  }
  if (status === "sent") {
    return <span className="text-gray-400 text-xs ml-1">✓</span>;
  }
  if (status === "failed") {
    return <span className="text-red-400 text-xs ml-1">!</span>;
  }
  return null;
}

function WindowBar({ status, windowExpiresAt }: { status: string; windowExpiresAt: string | null }) {
  if (status === "expired" || status === "closed") {
    return (
      <div className="px-4 py-2 bg-red-50 border-b border-red-100 text-center text-sm text-red-600 font-medium">
        Window expired — use a template to restart the conversation
      </div>
    );
  }
  if (windowExpiresAt) {
    const expires = new Date(windowExpiresAt);
    const now = new Date();
    const hoursLeft = Math.max(0, (expires.getTime() - now.getTime()) / 3600000);
    const color = hoursLeft < 3 ? "bg-yellow-50 border-yellow-100 text-yellow-700" : "bg-green-50 border-green-100 text-green-700";
    return (
      <div className={`px-4 py-1.5 border-b text-center text-xs font-medium ${color}`}>
        {hoursLeft.toFixed(1)} hours remaining in conversation window
      </div>
    );
  }
  return null;
}

export function MessageThread({ conversationId, orgId }: Props) {
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [conv, setConv] = useState<ConversationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`);
      if (!res.ok) throw new Error("Failed to load messages");
      const data = await res.json() as { messages: Message[]; conversation: ConversationMeta };
      setMsgs(data.messages);
      setConv(data.conversation);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    setLoading(true);
    setMsgs([]);
    setConv(null);
    fetchMessages();
  }, [fetchMessages]);

  // Realtime: new messages
  useEffect(() => {
    const unsub = subscribeToMessages(conversationId, (msg) => {
      setMsgs((prev) => {
        if (prev.find((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });
    return unsub;
  }, [conversationId]);

  // Realtime: status updates
  useEffect(() => {
    const unsub = subscribeToMessageUpdates(conversationId, (updated) => {
      setMsgs((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    });
    return unsub;
  }, [conversationId]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        Loading messages…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-500 text-sm">{error}</div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {conv && <WindowBar status={conv.status} windowExpiresAt={conv.windowExpiresAt} />}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#e5ddd5]">
        {msgs.length === 0 && (
          <p className="text-center text-gray-500 text-sm mt-8">No messages yet.</p>
        )}
        {msgs.map((msg) => {
          const isOutbound = msg.direction === "outbound";
          return (
            <div
              key={msg.id}
              className={`flex ${isOutbound ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] px-3 py-2 rounded-lg shadow-sm text-sm ${
                  isOutbound
                    ? "bg-[#dcf8c6] text-gray-800 rounded-tr-none"
                    : "bg-white text-gray-800 rounded-tl-none"
                }`}
              >
                {/* Media */}
                {msg.mediaType === "image" && msg.mediaUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={msg.mediaUrl} alt="media" className="rounded mb-1 max-w-full" />
                )}
                {msg.mediaType === "document" && msg.mediaUrl && (
                  <a
                    href={msg.mediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-xs block mb-1"
                  >
                    📄 {msg.mediaFilename || "Document"}
                  </a>
                )}
                {msg.mediaType === "audio" && msg.mediaUrl && (
                  <audio controls src={msg.mediaUrl} className="w-full mb-1" />
                )}

                {/* Text */}
                {msg.content && <p className="whitespace-pre-wrap break-words">{msg.content}</p>}

                {/* Time + status */}
                <div className="flex items-center justify-end gap-1 mt-0.5">
                  <span className="text-[10px] text-gray-400">
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                      : ""}
                  </span>
                  {isOutbound && <MessageStatusIcon status={msg.status} />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
