// Force dynamic rendering
export const dynamic = "force-dynamic";

export default function ConversationsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Conversations</h1>
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-gray-600">
          No conversations yet. Connect your WhatsApp number to get started.
        </p>
      </div>
    </div>
  );
}
