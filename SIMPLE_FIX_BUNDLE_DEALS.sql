-- Simple fix for Bundle Deals RLS policies
-- This will fix the RLS policies without complex functions

-- Enable RLS if not already enabled
ALTER TABLE bundle_deals ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read bundle_deals" ON bundle_deals;
DROP POLICY IF EXISTS "Allow authenticated insert bundle_deals" ON bundle_deals;
DROP POLICY IF EXISTS "Allow authenticated update bundle_deals" ON bundle_deals;
DROP POLICY IF EXISTS "Allow authenticated delete bundle_deals" ON bundle_deals;

-- Create new policies that allow authenticated users to manage bundle deals
CREATE POLICY "Allow public read bundle_deals" ON bundle_deals
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert bundle_deals" ON bundle_deals
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update bundle_deals" ON bundle_deals
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete bundle_deals" ON bundle_deals
    FOR DELETE USING (auth.role() = 'authenticated');
