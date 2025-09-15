-- Fix RLS policies to allow public insert for testing
-- This will allow anyone to insert affiliate products

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access" ON affiliate_products;
DROP POLICY IF EXISTS "Allow authenticated insert" ON affiliate_products;
DROP POLICY IF EXISTS "Allow authenticated update" ON affiliate_products;
DROP POLICY IF EXISTS "Allow authenticated delete" ON affiliate_products;

-- Create new policies that allow public insert
CREATE POLICY "Allow public read access" ON affiliate_products
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON affiliate_products
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update" ON affiliate_products
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete" ON affiliate_products
  FOR DELETE USING (true);

-- Also fix affiliate_clicks policies
DROP POLICY IF EXISTS "Allow public insert clicks" ON affiliate_clicks;
DROP POLICY IF EXISTS "Allow authenticated read clicks" ON affiliate_clicks;

CREATE POLICY "Allow public insert clicks" ON affiliate_clicks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read clicks" ON affiliate_clicks
  FOR SELECT USING (true);
