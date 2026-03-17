-- Migration: WhatsApp Templates + Media Support
-- Phase 2 (02-02)

-- ─── WhatsApp Templates Table ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS whatsapp_templates (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en_US',
  category TEXT NOT NULL DEFAULT 'UTILITY', -- MARKETING, UTILITY, AUTHENTICATION
  components JSONB NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  wa_template_id TEXT, -- Meta's template ID after submission
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS whatsapp_templates_org_id_idx ON whatsapp_templates(org_id);
CREATE UNIQUE INDEX IF NOT EXISTS whatsapp_templates_org_name_lang_uniq ON whatsapp_templates(org_id, name, language);

-- ─── Add Media Columns to Messages ────────────────────────────────────────────

ALTER TABLE messages
  ADD COLUMN IF NOT EXISTS media_url TEXT,
  ADD COLUMN IF NOT EXISTS media_type TEXT CHECK (media_type IN ('image', 'document', 'audio', 'video')),
  ADD COLUMN IF NOT EXISTS media_filename TEXT;

-- ─── RLS Policies for WhatsApp Templates ──────────────────────────────────────

ALTER TABLE whatsapp_templates ENABLE ROW LEVEL SECURITY;

-- Allow select for users in the same org
CREATE POLICY "whatsapp_templates_org_select"
  ON whatsapp_templates FOR SELECT
  USING (org_id = current_setting('app.current_org_id', true));

-- Allow insert for users in the same org
CREATE POLICY "whatsapp_templates_org_insert"
  ON whatsapp_templates FOR INSERT
  WITH CHECK (org_id = current_setting('app.current_org_id', true));

-- Allow update for users in the same org
CREATE POLICY "whatsapp_templates_org_update"
  ON whatsapp_templates FOR UPDATE
  USING (org_id = current_setting('app.current_org_id', true));

-- Allow delete for users in the same org
CREATE POLICY "whatsapp_templates_org_delete"
  ON whatsapp_templates FOR DELETE
  USING (org_id = current_setting('app.current_org_id', true));
