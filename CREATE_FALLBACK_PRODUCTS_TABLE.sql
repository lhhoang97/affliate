-- Create fallback_products table for when main products table is empty
-- This ensures the website always has some products to display

CREATE TABLE IF NOT EXISTS fallback_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  description TEXT,
  image TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  category TEXT DEFAULT 'General',
  brand TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  in_stock BOOLEAN DEFAULT true,
  affiliate_link TEXT,
  external_url TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
  specifications JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE fallback_products ENABLE ROW LEVEL SECURITY;

-- Create policies for fallback_products
CREATE POLICY "Fallback products are viewable by everyone" ON fallback_products
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage fallback products" ON fallback_products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Insert fallback products data
INSERT INTO fallback_products (
  name, price, original_price, description, image, images, category, brand, 
  rating, review_count, in_stock, affiliate_link, external_url, tags, features, specifications
) VALUES 
(
  'AirFlow Jaw Strap',
  29.99,
  79.98,
  'Eliminate Sleep Apnea & Wake Up Refreshed Overnight! Using the power of jaw alignment, the AirFlow Jaw Strap gently holds your mouth closed while you sleep, effectively preventing your tongue from obstructing your airway.',
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500',
  '["https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500", "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500"]'::jsonb,
  'Health & Wellness',
  'AirFlow',
  4.8,
  1247,
  true,
  'https://amazon.com/dp/B08N5WRWNW',
  'https://amazon.com/dp/B08N5WRWNW',
  '["sleep", "apnea", "health", "wellness"]'::jsonb,
  '["Jaw alignment", "Sleep apnea relief", "Comfortable design", "Adjustable fit"]'::jsonb,
  '{"Material": "Soft fabric", "Size": "One size fits all", "Weight": "Lightweight", "Washable": "Yes"}'::jsonb
),
(
  'Smart Fitness Tracker',
  89.99,
  129.99,
  'Advanced fitness tracking with heart rate monitoring, sleep tracking, and 7-day battery life. Perfect for active lifestyles.',
  'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=500',
  '["https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=500"]'::jsonb,
  'Electronics',
  'FitTech',
  4.6,
  892,
  true,
  'https://amazon.com/dp/B08N5WRWNW',
  'https://amazon.com/dp/B08N5WRWNW',
  '["fitness", "tracker", "health", "smartwatch"]'::jsonb,
  '["Heart rate monitoring", "Sleep tracking", "7-day battery", "Water resistant"]'::jsonb,
  '{"Display": "1.4 inch AMOLED", "Battery": "7 days", "Water resistance": "5ATM", "Connectivity": "Bluetooth 5.0"}'::jsonb
),
(
  'Wireless Bluetooth Headphones',
  59.99,
  99.99,
  'High-quality wireless headphones with noise cancellation, crystal clear sound, and 30-hour battery life.',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
  '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"]'::jsonb,
  'Electronics',
  'SoundMax',
  4.7,
  2156,
  true,
  'https://amazon.com/dp/B08N5WRWNW',
  'https://amazon.com/dp/B08N5WRWNW',
  '["headphones", "wireless", "bluetooth", "audio"]'::jsonb,
  '["Noise cancellation", "30-hour battery", "Quick charge", "Comfortable fit"]'::jsonb,
  '{"Driver": "40mm dynamic", "Frequency": "20Hz-20kHz", "Battery": "30 hours", "Charging": "USB-C"}'::jsonb
),
(
  'Ergonomic Office Chair',
  199.99,
  299.99,
  'Premium ergonomic office chair with lumbar support, adjustable height, and breathable mesh back for all-day comfort.',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
  '["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500"]'::jsonb,
  'Furniture',
  'ComfortPro',
  4.5,
  634,
  true,
  'https://amazon.com/dp/B08N5WRWNW',
  'https://amazon.com/dp/B08N5WRWNW',
  '["office", "chair", "ergonomic", "comfort"]'::jsonb,
  '["Lumbar support", "Adjustable height", "Breathable mesh", "360° swivel"]'::jsonb,
  '{"Weight capacity": "300 lbs", "Height range": "17-21 inches", "Material": "Mesh and foam", "Warranty": "5 years"}'::jsonb
),
(
  'Smart Home Security Camera',
  79.99,
  119.99,
  'Wireless security camera with 1080p HD video, night vision, motion detection, and cloud storage.',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
  '["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500"]'::jsonb,
  'Electronics',
  'SecureHome',
  4.4,
  423,
  true,
  'https://amazon.com/dp/B08N5WRWNW',
  'https://amazon.com/dp/B08N5WRWNW',
  '["security", "camera", "smart home", "surveillance"]'::jsonb,
  '["1080p HD", "Night vision", "Motion detection", "Cloud storage"]'::jsonb,
  '{"Resolution": "1920x1080", "Field of view": "110°", "Storage": "Cloud + local", "Connectivity": "WiFi"}'::jsonb
),
(
  'Portable Bluetooth Speaker',
  39.99,
  59.99,
  'Compact wireless speaker with 360° sound, waterproof design, and 12-hour battery life. Perfect for outdoor adventures.',
  'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
  '["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500"]'::jsonb,
  'Electronics',
  'SoundWave',
  4.3,
  789,
  true,
  'https://amazon.com/dp/B08N5WRWNW',
  'https://amazon.com/dp/B08N5WRWNW',
  '["speaker", "bluetooth", "portable", "waterproof"]'::jsonb,
  '["360° sound", "Waterproof", "12-hour battery", "Voice assistant"]'::jsonb,
  '{"Power": "20W", "Battery": "12 hours", "Water rating": "IPX7", "Range": "30 feet"}'::jsonb
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_fallback_products_category ON fallback_products(category);
CREATE INDEX IF NOT EXISTS idx_fallback_products_brand ON fallback_products(brand);
CREATE INDEX IF NOT EXISTS idx_fallback_products_in_stock ON fallback_products(in_stock);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_fallback_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_fallback_products_updated_at
  BEFORE UPDATE ON fallback_products
  FOR EACH ROW
  EXECUTE FUNCTION update_fallback_products_updated_at();
