import { Suspense } from "react";
import { requireOrg } from "@/lib/auth/tenant-context";
import { db, setTenantContext } from "@/lib/db";
import { conversations, contacts } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { InboxView } from "@/components/inbox/InboxView";

async function getConversations(orgId: string) {
  try {
    await setTenantContext(orgId);
    const rows = await db
      .select({
        id: conversations.id,
        status: conversations.status,
        windowExpiresAt: conversations.windowExpiresAt,
        lastMessageAt: conversations.lastMessageAt,
        assignedUserId: conversations.assignedUserId,
        contactPhone: contacts.phoneNumber,
        contactName: contacts.displayName,
      })
      .from(conversations)
      .innerJoin(contacts, eq(conversations.contactId, contacts.id))
      .where(eq(conversations.organizationId, orgId))
      .orderBy(desc(conversations.lastMessageAt));

    return rows;
  } catch {
    return [];
  }
}

export default async function ConversationsPage() {
  let orgId: string;

  try {
    const ctx = await requireOrg();
    orgId = ctx.orgId;
  } catch {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
        Please select or create an organization to view conversations.
      </div>
    );
  }

  const initialConversations = await getConversations(orgId);

  // Serialize dates for client component
  const serialized = initialConversations.map((c) => ({
    ...c,
    windowExpiresAt: c.windowExpiresAt ? c.windowExpiresAt.toISOString() : null,
    lastMessageAt: c.lastMessageAt ? c.lastMessageAt.toISOString() : null,
  }));

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <Suspense fallback={<div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Loading…</div>}>
        <InboxView initialConversations={serialized} orgId={orgId} />
      </Suspense>
    </div>
  );
}
