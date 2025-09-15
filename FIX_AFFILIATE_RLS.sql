-- Fix RLS Policies for affiliate_products table
-- This will allow public read access and authenticated user insert/update

-- Enable RLS if not already enabled
ALTER TABLE affiliate_products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access" ON affiliate_products;
DROP POLICY IF EXISTS "Allow authenticated insert" ON affiliate_products;
DROP POLICY IF EXISTS "Allow authenticated update" ON affiliate_products;
DROP POLICY IF EXISTS "Allow authenticated delete" ON affiliate_products;

-- Create policy for public read access (anyone can view affiliate products)
CREATE POLICY "Allow public read access" ON affiliate_products
  FOR SELECT USING (true);

-- Create policy for authenticated users to insert
CREATE POLICY "Allow authenticated insert" ON affiliate_products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy for authenticated users to update
CREATE POLICY "Allow authenticated update" ON affiliate_products
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policy for authenticated users to delete
CREATE POLICY "Allow authenticated delete" ON affiliate_products
  FOR DELETE USING (auth.role() = 'authenticated');

-- Also fix affiliate_clicks table
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert clicks" ON affiliate_clicks;
DROP POLICY IF EXISTS "Allow authenticated read clicks" ON affiliate_clicks;

CREATE POLICY "Allow public insert clicks" ON affiliate_clicks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated read clicks" ON affiliate_clicks
  FOR SELECT USING (auth.role() = 'authenticated');

-- Fix affiliate_retailers table
ALTER TABLE affiliate_retailers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read retailers" ON affiliate_retailers;
DROP POLICY IF EXISTS "Allow authenticated manage retailers" ON affiliate_retailers;

CREATE POLICY "Allow public read retailers" ON affiliate_retailers
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated manage retailers" ON affiliate_retailers
  FOR ALL USING (auth.role() = 'authenticated');
