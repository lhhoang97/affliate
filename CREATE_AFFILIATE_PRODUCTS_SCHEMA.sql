-- Create affiliate_products table with proper schema
-- This will recreate the table with all necessary columns

-- Drop table if exists (be careful in production!)
DROP TABLE IF EXISTS affiliate_products CASCADE;

-- Create affiliate_products table
CREATE TABLE affiliate_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  discount_percentage INTEGER,
  image_url TEXT,
  affiliate_url TEXT NOT NULL,
  retailer_id UUID REFERENCES affiliate_retailers(id),
  category TEXT,
  brand TEXT,
  availability TEXT DEFAULT 'In Stock',
  rating DECIMAL(3,2),
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_affiliate_products_retailer_id ON affiliate_products(retailer_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_products_category ON affiliate_products(category);
CREATE INDEX IF NOT EXISTS idx_affiliate_products_brand ON affiliate_products(brand);
CREATE INDEX IF NOT EXISTS idx_affiliate_products_created_at ON affiliate_products(created_at DESC);

-- Enable RLS
ALTER TABLE affiliate_products ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Allow public read access" ON affiliate_products;
DROP POLICY IF EXISTS "Allow authenticated insert" ON affiliate_products;
DROP POLICY IF EXISTS "Allow authenticated update" ON affiliate_products;
DROP POLICY IF EXISTS "Allow authenticated delete" ON affiliate_products;

CREATE POLICY "Allow public read access" ON affiliate_products
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert" ON affiliate_products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON affiliate_products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete" ON affiliate_products
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_affiliate_products_updated_at 
    BEFORE UPDATE ON affiliate_products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
