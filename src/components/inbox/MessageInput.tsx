"use client";

import { useEffect, useRef, useState } from "react";

type Template = {
  id: string;
  name: string;
  language: string;
};

type Props = {
  conversationId: string;
  windowStatus: string;
  onMessageSent: () => void;
};

export function MessageInput({ conversationId, windowStatus, onMessageSent }: Props) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isExpired = windowStatus === "expired" || windowStatus === "closed";

  // Fetch templates if window is expired
  useEffect(() => {
    if (!isExpired) return;
    fetch("/api/whatsapp/templates")
      .then((r) => r.json())
      .then((data: { templates: Template[] }) => setTemplates(data.templates || []))
      .catch(() => setTemplates([]));
  }, [isExpired]);

  const handleSendText = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, content: text.trim() }),
      });
      if (!res.ok) {
        const d = await res.json() as { error?: string };
        throw new Error(d.error || "Failed to send");
      }
      setText("");
      onMessageSent();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send");
    } finally {
      setSending(false);
    }
  };

  const handleSendTemplate = async () => {
    if (!selectedTemplate || sending) return;
    setSending(true);
    setError(null);
    const tmpl = templates.find((t) => t.id === selectedTemplate);
    if (!tmpl) { setSending(false); return; }
    try {
      const res = await fetch("/api/whatsapp/send-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          templateName: tmpl.name,
          language: tmpl.language,
          components: [],
        }),
      });
      if (!res.ok) {
        const d = await res.json() as { error?: string };
        throw new Error(d.error || "Failed to send template");
      }
      setSelectedTemplate("");
      onMessageSent();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send template");
    } finally {
      setSending(false);
    }
  };

  const handleFile = async (file: File) => {
    if (sending) return;
    setSending(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("conversationId", conversationId);
      formData.append("file", file);
      const res = await fetch("/api/whatsapp/send", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const d = await res.json() as { error?: string };
        throw new Error(d.error || "Failed to send file");
      }
      onMessageSent();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send file");
    } finally {
      setSending(false);
    }
  };

  if (isExpired) {
    return (
      <div className="border-t border-gray-200 bg-white p-3">
        <p className="text-xs text-red-500 mb-2 font-medium">
          24h window expired — send a template to restart the conversation
        </p>
        {templates.length === 0 ? (
          <p className="text-xs text-gray-400">No approved templates. Add templates in Settings.</p>
        ) : (
          <div className="flex gap-2">
            <select
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
            >
              <option value="">Select a template…</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>{t.name} ({t.language})</option>
              ))}
            </select>
            <button
              onClick={handleSendTemplate}
              disabled={!selectedTemplate || sending}
              className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {sending ? "Sending…" : "Send"}
            </button>
          </div>
        )}
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 bg-white p-3">
      <div className="flex items-end gap-2">
        {/* Attachment */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
          title="Attach file"
        >
          📎
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*,.pdf,.doc,.docx"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />

        {/* Text input */}
        <textarea
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500 max-h-32"
          placeholder="Type a message…"
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendText();
            }
          }}
          disabled={sending}
        />

        {/* Send button */}
        <button
          onClick={handleSendText}
          disabled={!text.trim() || sending}
          className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0 w-9 h-9 flex items-center justify-center"
        >
          {sending ? (
            <span className="text-xs">…</span>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          )}
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
