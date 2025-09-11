-- Tạo bảng bundle_deals để quản lý các deal mua 2 get 1, mua 3 get 1, etc.
CREATE TABLE IF NOT EXISTS bundle_deals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    bundle_type VARCHAR(10) NOT NULL CHECK (bundle_type IN ('get2', 'get3', 'get4', 'get5')),
    discount_percentage DECIMAL(5,2) NOT NULL CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id, bundle_type)
);

-- Tạo index để tối ưu query
CREATE INDEX IF NOT EXISTS idx_bundle_deals_product_id ON bundle_deals(product_id);
CREATE INDEX IF NOT EXISTS idx_bundle_deals_active ON bundle_deals(is_active) WHERE is_active = true;

-- Tạo trigger để tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION update_bundle_deals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bundle_deals_updated_at
    BEFORE UPDATE ON bundle_deals
    FOR EACH ROW
    EXECUTE FUNCTION update_bundle_deals_updated_at();

-- Thêm RLS policies
ALTER TABLE bundle_deals ENABLE ROW LEVEL SECURITY;

-- Policy cho admin (có thể xem và chỉnh sửa tất cả)
CREATE POLICY "Admin can manage all bundle deals" ON bundle_deals
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Policy cho user (chỉ xem bundle deals đang active)
CREATE POLICY "Users can view active bundle deals" ON bundle_deals
    FOR SELECT USING (is_active = true);

-- Thêm một số bundle deals mẫu
INSERT INTO bundle_deals (product_id, bundle_type, discount_percentage, is_active)
SELECT 
    p.id,
    'get2',
    20.00,
    true
FROM products p 
WHERE p.name ILIKE '%iphone%' OR p.name ILIKE '%samsung%'
LIMIT 5;

INSERT INTO bundle_deals (product_id, bundle_type, discount_percentage, is_active)
SELECT 
    p.id,
    'get3',
    30.00,
    true
FROM products p 
WHERE p.name ILIKE '%laptop%' OR p.name ILIKE '%macbook%'
LIMIT 3;
