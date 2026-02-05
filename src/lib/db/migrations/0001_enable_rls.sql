-- Enable RLS on all multi-tenant tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Organizations: tenant can only see their own org
CREATE POLICY org_tenant_isolation ON organizations
  FOR ALL
  USING (id = current_setting('app.current_organization_id', true)::text);

-- Users: tenant can only see users in their org
CREATE POLICY users_tenant_isolation ON users
  FOR ALL
  USING (organization_id = current_setting('app.current_organization_id', true)::text);

-- Users INSERT: must match current org context
CREATE POLICY users_insert_policy ON users
  FOR INSERT
  WITH CHECK (organization_id = current_setting('app.current_organization_id', true)::text);
