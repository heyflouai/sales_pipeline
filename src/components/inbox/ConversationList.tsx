"use client";

import { formatDistanceToNow } from "date-fns";

type ConversationItem = {
  id: string;
  status: string;
  windowExpiresAt: string | null;
  lastMessageAt: string | null;
  contactPhone: string;
  contactName: string | null;
};

type Props = {
  conversations: ConversationItem[] | undefined;
  selectedId: string | null;
  onSelect: (id: string) => void;
};

function getWindowBadge(status: string, windowExpiresAt: string | null) {
  if (status === "expired" || status === "closed") {
    return (
      <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 font-medium">
        Expired
      </span>
    );
  }
  if (windowExpiresAt) {
    const expires = new Date(windowExpiresAt);
    const now = new Date();
    const hoursLeft = Math.max(0, (expires.getTime() - now.getTime()) / 3600000);
    if (hoursLeft < 3) {
      return (
        <span className="text-xs px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium">
          {hoursLeft.toFixed(0)}h left
        </span>
      );
    }
  }
  return null;
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
      </div>
    </div>
  );
}

export function ConversationList({ conversations, selectedId, onSelect }: Props) {
  if (!conversations) {
    return (
      <div className="flex flex-col">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-400">
        <p className="text-sm">No conversations yet.</p>
        <p className="text-xs mt-1">Messages will appear here when customers contact you.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-y-auto">
      {conversations.map((conv) => {
        const isActive = conv.id === selectedId;
        const displayName = conv.contactName || conv.contactPhone;
        const badge = getWindowBadge(conv.status, conv.windowExpiresAt);
        const timeAgo = conv.lastMessageAt
          ? formatDistanceToNow(new Date(conv.lastMessageAt), { addSuffix: false })
          : null;

        return (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`flex items-start gap-3 px-4 py-3 border-b border-gray-100 text-left hover:bg-gray-50 transition-colors ${
              isActive ? "bg-green-50 border-l-4 border-l-green-500" : ""
            }`}
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shrink-0 text-gray-600 font-semibold text-sm">
              {displayName.charAt(0).toUpperCase()}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-gray-900 truncate">{displayName}</span>
                {timeAgo && (
                  <span className="text-xs text-gray-400 shrink-0">{timeAgo}</span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                {conv.status === "active" && (
                  <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                )}
                {badge}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
