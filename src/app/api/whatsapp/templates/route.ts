/**
 * GET  /api/whatsapp/templates — list org templates
 * POST /api/whatsapp/templates — create a template
 */

import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/rbac";
import { db, setTenantContext } from "@/lib/db";
import { whatsappTemplates } from "@/lib/db/schema";

const createTemplateSchema = z.object({
  name: z.string().min(1),
  language: z.string().default("en_US"),
  category: z.string().default("UTILITY"),
  components: z.array(z.any()).default([]),
});

export async function GET() {
  let orgId: string;
  try {
    const user = await getCurrentUser();
    orgId = user.orgId;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await setTenantContext(orgId);
    const templates = await db
      .select()
      .from(whatsappTemplates)
      .where(eq(whatsappTemplates.orgId, orgId));

    return NextResponse.json({ templates });
  } catch (err) {
    console.error("[GET /api/whatsapp/templates]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  let orgId: string;
  try {
    const user = await getCurrentUser();
    orgId = user.orgId;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: z.infer<typeof createTemplateSchema>;
  try {
    body = createTemplateSchema.parse(await request.json());
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request", details: err.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    await setTenantContext(orgId);
    const [template] = await db
      .insert(whatsappTemplates)
      .values({
        id: nanoid(),
        orgId,
        name: body.name,
        language: body.language,
        category: body.category,
        components: body.components,
        status: "pending",
      })
      .returning();

    return NextResponse.json({ template }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/whatsapp/templates]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
