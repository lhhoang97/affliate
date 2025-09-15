-- Fix Bundle Deals RLS policies to allow creating new deals
-- This will fix the "new row violates row-level security policy" error

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

-- Also fix bundle_options table if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'bundle_options') THEN
        ALTER TABLE bundle_options ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Allow public read bundle_options" ON bundle_options;
        DROP POLICY IF EXISTS "Allow authenticated insert bundle_options" ON bundle_options;
        DROP POLICY IF EXISTS "Allow authenticated update bundle_options" ON bundle_options;
        DROP POLICY IF EXISTS "Allow authenticated delete bundle_options" ON bundle_options;
        
        CREATE POLICY "Allow public read bundle_options" ON bundle_options
            FOR SELECT USING (true);
            
        CREATE POLICY "Allow authenticated insert bundle_options" ON bundle_options
            FOR INSERT WITH CHECK (auth.role() = 'authenticated');
            
        CREATE POLICY "Allow authenticated update bundle_options" ON bundle_options
            FOR UPDATE USING (auth.role() = 'authenticated');
            
        CREATE POLICY "Allow authenticated delete bundle_options" ON bundle_options
            FOR DELETE USING (auth.role() = 'authenticated');
    END IF;
END $$;
