-- Create section_products table
CREATE TABLE IF NOT EXISTS section_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  section TEXT NOT NULL CHECK (section IN ('just_for_you', 'hot_deals', 'trending_deals')),
  position INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_section_products_section ON section_products(section);
CREATE INDEX IF NOT EXISTS idx_section_products_position ON section_products(position);
CREATE INDEX IF NOT EXISTS idx_section_products_active ON section_products(is_active);

-- Create unique constraint to prevent duplicate products in same section
CREATE UNIQUE INDEX IF NOT EXISTS idx_section_products_unique 
ON section_products(product_id, section) 
WHERE is_active = true;

-- Enable Row Level Security (RLS)
ALTER TABLE section_products ENABLE ROW LEVEL SECURITY;

-- Create policies for section_products
CREATE POLICY "Enable read access for all users" ON section_products
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON section_products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON section_products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON section_products
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_section_products_updated_at 
  BEFORE UPDATE ON section_products 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data
INSERT INTO section_products (product_id, section, position, is_active) VALUES
  ((SELECT id FROM products WHERE name LIKE '%iPhone%' LIMIT 1), 'just_for_you', 1, true),
  ((SELECT id FROM products WHERE name LIKE '%Samsung%' LIMIT 1), 'just_for_you', 2, true),
  ((SELECT id FROM products WHERE price < 100 LIMIT 1), 'hot_deals', 1, true),
  ((SELECT id FROM products WHERE price < 100 LIMIT 1 OFFSET 1), 'hot_deals', 2, true),
  ((SELECT id FROM products WHERE rating > 4 LIMIT 1), 'trending_deals', 1, true),
  ((SELECT id FROM products WHERE rating > 4 LIMIT 1 OFFSET 1), 'trending_deals', 2, true)
ON CONFLICT (product_id, section) DO NOTHING;
