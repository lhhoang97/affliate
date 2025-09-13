-- Create affiliate products table
CREATE TABLE IF NOT EXISTS affiliate_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  original_price DECIMAL(10,2),
  image_url TEXT,
  retailer VARCHAR(50) NOT NULL, -- 'amazon', 'ebay', 'walmart', etc.
  asin VARCHAR(20), -- Amazon ASIN
  sku VARCHAR(100), -- Product SKU
  affiliate_link TEXT NOT NULL, -- Generated affiliate link
  external_url TEXT, -- Original product URL
  commission_rate DECIMAL(5,2) DEFAULT 0.00, -- Commission percentage
  category VARCHAR(100),
  brand VARCHAR(100),
  rating DECIMAL(3,2) DEFAULT 0.00,
  review_count INTEGER DEFAULT 0,
  in_stock BOOLEAN DEFAULT true,
  availability_status VARCHAR(50) DEFAULT 'available', -- 'available', 'out_of_stock', 'discontinued'
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_affiliate_products_retailer ON affiliate_products(retailer);
CREATE INDEX IF NOT EXISTS idx_affiliate_products_category ON affiliate_products(category);
CREATE INDEX IF NOT EXISTS idx_affiliate_products_brand ON affiliate_products(brand);
CREATE INDEX IF NOT EXISTS idx_affiliate_products_asin ON affiliate_products(asin);
CREATE INDEX IF NOT EXISTS idx_affiliate_products_in_stock ON affiliate_products(in_stock);

-- Create affiliate retailers table for configuration
CREATE TABLE IF NOT EXISTS affiliate_retailers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE, -- 'amazon', 'ebay', etc.
  display_name VARCHAR(100) NOT NULL, -- 'Amazon', 'eBay', etc.
  base_url TEXT NOT NULL, -- 'https://amazon.com'
  affiliate_tag VARCHAR(100), -- Your affiliate tag
  commission_rate DECIMAL(5,2) DEFAULT 0.00,
  cookie_duration INTEGER DEFAULT 24, -- Hours
  is_active BOOLEAN DEFAULT true,
  icon_url TEXT, -- Retailer icon
  color_code VARCHAR(7), -- Hex color for UI
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default retailers
INSERT INTO affiliate_retailers (name, display_name, base_url, affiliate_tag, commission_rate, cookie_duration, color_code) VALUES
('amazon', 'Amazon', 'https://amazon.com', 'yourstore-20', 4.00, 24, '#FF9900'),
('ebay', 'eBay', 'https://ebay.com', 'yourstore-20', 3.00, 168, '#E53238'),
('walmart', 'Walmart', 'https://walmart.com', 'yourstore-20', 2.50, 24, '#004C91'),
('target', 'Target', 'https://target.com', 'yourstore-20', 2.00, 24, '#CC0000'),
('bestbuy', 'Best Buy', 'https://bestbuy.com', 'yourstore-20', 1.50, 24, '#0046BE')
ON CONFLICT (name) DO NOTHING;

-- Create affiliate clicks tracking table
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES affiliate_products(id) ON DELETE CASCADE,
  retailer VARCHAR(50) NOT NULL,
  user_ip INET,
  user_agent TEXT,
  referrer TEXT,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  converted BOOLEAN DEFAULT false,
  conversion_value DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for analytics
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_product_id ON affiliate_clicks(product_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_retailer ON affiliate_clicks(retailer);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_clicked_at ON affiliate_clicks(clicked_at);

-- Enable RLS (Row Level Security)
ALTER TABLE affiliate_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_retailers ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow public read access to affiliate_products" ON affiliate_products
  FOR SELECT USING (true);

CREATE POLICY "Allow admin full access to affiliate_products" ON affiliate_products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Allow public read access to affiliate_retailers" ON affiliate_retailers
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow admin full access to affiliate_retailers" ON affiliate_retailers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Allow public insert to affiliate_clicks" ON affiliate_clicks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin read access to affiliate_clicks" ON affiliate_clicks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_affiliate_products_updated_at 
  BEFORE UPDATE ON affiliate_products 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_affiliate_retailers_updated_at 
  BEFORE UPDATE ON affiliate_retailers 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
