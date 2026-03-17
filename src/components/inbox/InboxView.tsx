"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { ConversationList } from "./ConversationList";
import { MessageThread } from "./MessageThread";
import { MessageInput } from "./MessageInput";

type ConversationItem = {
  id: string;
  status: string;
  windowExpiresAt: string | null;
  lastMessageAt: string | null;
  contactPhone: string;
  contactName: string | null;
};

type Props = {
  initialConversations: ConversationItem[];
  orgId: string;
};

export function InboxView({ initialConversations, orgId }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("id");
  const [conversations] = useState<ConversationItem[]>(initialConversations);

  const selectedConv = conversations.find((c) => c.id === selectedId) ?? null;

  const handleSelect = useCallback(
    (id: string) => {
      router.push(`/conversations?id=${id}`, { scroll: false });
    },
    [router]
  );

  const handleMessageSent = useCallback(() => {
    // Optionally refresh conversation list here
  }, []);

  return (
    <div className="flex h-full">
      {/* Left panel — conversation list */}
      <div className="w-80 shrink-0 border-r border-gray-200 flex flex-col bg-white overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Conversations</h2>
        </div>
        <ConversationList
          conversations={conversations}
          selectedId={selectedId}
          onSelect={handleSelect}
        />
      </div>

      {/* Right panel — message thread */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {selectedConv ? (
          <>
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-sm shrink-0">
                {(selectedConv.contactName || selectedConv.contactPhone).charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {selectedConv.contactName || selectedConv.contactPhone}
                </p>
                <p className="text-xs text-gray-400">{selectedConv.contactPhone}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-hidden flex flex-col">
              <MessageThread conversationId={selectedConv.id} orgId={orgId} />
            </div>

            {/* Input */}
            <MessageInput
              conversationId={selectedConv.id}
              windowStatus={selectedConv.status}
              onMessageSent={handleMessageSent}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 p-8">
            <div className="text-5xl mb-4">💬</div>
            <p className="text-base font-medium text-gray-500">Select a conversation</p>
            <p className="text-sm mt-1">
              {conversations.length === 0
                ? "No conversations yet. Connect your WhatsApp number to get started."
                : "Choose a conversation from the left to start messaging."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
