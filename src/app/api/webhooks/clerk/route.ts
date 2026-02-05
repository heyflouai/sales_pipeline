import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { adminDb } from "@/lib/db/admin";
import { organizations, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * Map Clerk organization role to database role.
 */
function mapClerkRoleToDbRole(clerkRole: string): "admin" | "manager" | "agent" {
  if (clerkRole === "org:admin") return "admin";
  if (clerkRole === "org:manager") return "manager";
  return "agent";
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("Missing CLERK_WEBHOOK_SECRET environment variable");
    return Response.json({ error: "Server configuration error" }, { status: 500 });
  }

  // Get Svix headers
  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  // Verify all required headers are present
  if (!svixId || !svixTimestamp || !svixSignature) {
    return Response.json(
      { error: "Missing Svix headers" },
      { status: 400 }
    );
  }

  // Get the request body
  const payload = await req.text();

  // Create Svix webhook instance
  const wh = new Webhook(WEBHOOK_SECRET);

  let event: WebhookEvent;

  // Verify the webhook signature
  try {
    event = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return Response.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  // Handle webhook events
  try {
    switch (event.type) {
      case "organization.created": {
        const { id, name, slug } = event.data;
        await adminDb.insert(organizations).values({
          id,
          name,
          slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
        });
        console.log(`Organization created: ${id} (${name})`);
        break;
      }

      case "organization.updated": {
        const { id, name, slug } = event.data;
        await adminDb
          .update(organizations)
          .set({
            name,
            slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
            updatedAt: new Date(),
          })
          .where(eq(organizations.id, id));
        console.log(`Organization updated: ${id} (${name})`);
        break;
      }

      case "organizationMembership.created": {
        const { organization, public_user_data, role } = event.data;

        if (!public_user_data) {
          console.error("Missing public_user_data in organizationMembership.created");
          break;
        }

        const userId = public_user_data.user_id;
        const dbRole = mapClerkRoleToDbRole(role);

        await adminDb.insert(users).values({
          id: userId,
          organizationId: organization.id,
          email: public_user_data.identifier || "",
          firstName: public_user_data.first_name || null,
          lastName: public_user_data.last_name || null,
          imageUrl: public_user_data.image_url || null,
          role: dbRole,
          isActive: true,
        });
        console.log(`User created: ${userId} in org ${organization.id} with role ${dbRole}`);
        break;
      }

      case "organizationMembership.updated": {
        const { organization, public_user_data, role } = event.data;

        if (!public_user_data) {
          console.error("Missing public_user_data in organizationMembership.updated");
          break;
        }

        const userId = public_user_data.user_id;
        const dbRole = mapClerkRoleToDbRole(role);

        await adminDb
          .update(users)
          .set({
            role: dbRole,
            updatedAt: new Date(),
          })
          .where(eq(users.id, userId));
        console.log(`User role updated: ${userId} to ${dbRole}`);
        break;
      }

      case "organizationMembership.deleted": {
        const { public_user_data } = event.data;

        if (!public_user_data) {
          console.error("Missing public_user_data in organizationMembership.deleted");
          break;
        }

        const userId = public_user_data.user_id;

        // Soft delete
        await adminDb
          .update(users)
          .set({
            isActive: false,
            updatedAt: new Date(),
          })
          .where(eq(users.id, userId));
        console.log(`User soft deleted: ${userId}`);
        break;
      }

      case "user.updated": {
        const { id, email_addresses, first_name, last_name, image_url } = event.data;

        const primaryEmail = email_addresses?.find((e) => e.id === event.data.primary_email_address_id);

        await adminDb
          .update(users)
          .set({
            email: primaryEmail?.email_address || email_addresses?.[0]?.email_address || "",
            firstName: first_name || null,
            lastName: last_name || null,
            imageUrl: image_url || null,
            updatedAt: new Date(),
          })
          .where(eq(users.id, id));
        console.log(`User updated: ${id}`);
        break;
      }

      case "user.deleted": {
        const { id } = event.data;

        if (!id) {
          console.error("Missing user id in user.deleted event");
          break;
        }

        // Hard delete
        await adminDb.delete(users).where(eq(users.id, id));
        console.log(`User hard deleted: ${id}`);
        break;
      }

      default:
        console.log(`Unhandled webhook event type: ${event.type}`);
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return Response.json(
      { error: "Internal server error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
