-- Fix affiliate_clicks table schema
-- This will recreate the table with proper columns

-- Drop table if exists
DROP TABLE IF EXISTS affiliate_clicks CASCADE;

-- Create affiliate_clicks table
CREATE TABLE affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES affiliate_products(id),
  retailer_id UUID REFERENCES affiliate_retailers(id),
  user_ip TEXT,
  user_agent TEXT,
  referrer TEXT,
  clicked_at TIMESTAMPTZ DEFAULT NOW(),
  converted BOOLEAN DEFAULT FALSE,
  conversion_value DECIMAL(10,2),
  conversion_date TIMESTAMPTZ
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_product_id ON affiliate_clicks(product_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_retailer_id ON affiliate_clicks(retailer_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_clicked_at ON affiliate_clicks(clicked_at DESC);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_converted ON affiliate_clicks(converted);

-- Enable RLS
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Allow public insert clicks" ON affiliate_clicks;
DROP POLICY IF EXISTS "Allow authenticated read clicks" ON affiliate_clicks;

CREATE POLICY "Allow public insert clicks" ON affiliate_clicks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated read clicks" ON affiliate_clicks
  FOR SELECT USING (auth.role() = 'authenticated');
