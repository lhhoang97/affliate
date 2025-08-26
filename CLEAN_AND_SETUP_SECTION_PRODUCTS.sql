-- Clean and Setup Section Products Table
-- Chạy từng phần một trong Supabase SQL Editor

-- PHẦN 1: Xóa dữ liệu cũ (nếu có)
DELETE FROM section_products;

-- PHẦN 2: Kiểm tra bảng có tồn tại không
CREATE TABLE IF NOT EXISTS section_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  section TEXT NOT NULL CHECK (section IN ('just_for_you', 'hot_deals', 'trending_deals')),
  position INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PHẦN 3: Tạo indexes
CREATE INDEX IF NOT EXISTS idx_section_products_section ON section_products(section);
CREATE INDEX IF NOT EXISTS idx_section_products_position ON section_products(position);
CREATE INDEX IF NOT EXISTS idx_section_products_active ON section_products(is_active);

-- PHẦN 4: Tạo unique constraint
DROP INDEX IF EXISTS idx_section_products_unique;
CREATE UNIQUE INDEX idx_section_products_unique 
ON section_products(product_id, section) 
WHERE is_active = true;

-- PHẦN 5: Enable RLS
ALTER TABLE section_products ENABLE ROW LEVEL SECURITY;

-- PHẦN 6: Tạo policies
DROP POLICY IF EXISTS "Enable read access for all users" ON section_products;
CREATE POLICY "Enable read access for all users" ON section_products
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON section_products;
CREATE POLICY "Enable insert for authenticated users only" ON section_products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable update for authenticated users only" ON section_products;
CREATE POLICY "Enable update for authenticated users only" ON section_products
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON section_products;
CREATE POLICY "Enable delete for authenticated users only" ON section_products
  FOR DELETE USING (auth.role() = 'authenticated');

-- PHẦN 7: Tạo function và trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_section_products_updated_at ON section_products;
CREATE TRIGGER update_section_products_updated_at 
  BEFORE UPDATE ON section_products 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- PHẦN 8: Thêm dữ liệu mới (sau khi đã xóa cũ)
-- Just For You
INSERT INTO section_products (product_id, section, position, is_active) 
SELECT 
  p.id,
  'just_for_you',
  ROW_NUMBER() OVER (ORDER BY p.name),
  true
FROM products p 
WHERE p.category = 'Electronics' 
LIMIT 4;

-- Hot Deals
INSERT INTO section_products (product_id, section, position, is_active) 
SELECT 
  p.id,
  'hot_deals',
  ROW_NUMBER() OVER (ORDER BY p.price),
  true
FROM products p 
WHERE p.price < 500 
LIMIT 4;

-- Trending Deals
INSERT INTO section_products (product_id, section, position, is_active) 
SELECT 
  p.id,
  'trending_deals',
  ROW_NUMBER() OVER (ORDER BY p.rating DESC),
  true
FROM products p 
WHERE p.rating > 4 
LIMIT 4;

-- PHẦN 9: Kiểm tra kết quả
SELECT 
  sp.section,
  sp.position,
  p.name,
  p.price,
  p.rating
FROM section_products sp
JOIN products p ON sp.product_id = p.id
WHERE sp.is_active = true
ORDER BY sp.section, sp.position;
