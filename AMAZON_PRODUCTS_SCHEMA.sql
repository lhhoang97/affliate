-- Amazon Products Integration Schema Update
-- Run this in Supabase SQL Editor

-- 1. Add Amazon-specific columns to existing products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS source VARCHAR(20) DEFAULT 'manual',
ADD COLUMN IF NOT EXISTS asin VARCHAR(20),
ADD COLUMN IF NOT EXISTS retailer VARCHAR(50) DEFAULT 'Unknown',
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS last_synced TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Create index for better performance
CREATE INDEX IF NOT EXISTS idx_products_source ON products(source);
CREATE INDEX IF NOT EXISTS idx_products_asin ON products(asin) WHERE asin IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_retailer ON products(retailer);

-- 3. Create Amazon sync log table
CREATE TABLE IF NOT EXISTS amazon_sync_log (
    id SERIAL PRIMARY KEY,
    sync_type VARCHAR(50) NOT NULL, -- 'import' or 'update'
    keywords VARCHAR(200),
    category VARCHAR(100),
    products_processed INTEGER DEFAULT 0,
    products_imported INTEGER DEFAULT 0,
    products_updated INTEGER DEFAULT 0,
    errors TEXT,
    status VARCHAR(20) DEFAULT 'completed', -- 'running', 'completed', 'failed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 4. Create Amazon rate limit tracking table
CREATE TABLE IF NOT EXISTS amazon_api_usage (
    id SERIAL PRIMARY KEY,
    date DATE DEFAULT CURRENT_DATE,
    requests_count INTEGER DEFAULT 0,
    daily_limit INTEGER DEFAULT 8640,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(date)
);

-- 5. Function to track API usage
CREATE OR REPLACE FUNCTION track_amazon_api_usage()
RETURNS INTEGER AS $$
DECLARE
    current_count INTEGER;
BEGIN
    -- Insert or update today's usage
    INSERT INTO amazon_api_usage (date, requests_count)
    VALUES (CURRENT_DATE, 1)
    ON CONFLICT (date)
    DO UPDATE SET 
        requests_count = amazon_api_usage.requests_count + 1;
    
    -- Return current count
    SELECT requests_count INTO current_count
    FROM amazon_api_usage
    WHERE date = CURRENT_DATE;
    
    RETURN current_count;
END;
$$ LANGUAGE plpgsql;

-- 6. Add constraints for data integrity
ALTER TABLE products
ADD CONSTRAINT chk_rating_range CHECK (rating >= 0 AND rating <= 5),
ADD CONSTRAINT chk_review_count_positive CHECK (review_count >= 0);

-- 7. Update existing products to have source = 'manual'
UPDATE products 
SET source = 'manual' 
WHERE source IS NULL;

-- 8. Create view for Amazon products only
CREATE OR REPLACE VIEW amazon_products AS
SELECT 
    id,
    name,
    price,
    original_price,
    image_url,
    description,
    category,
    brand,
    rating,
    review_count,
    external_url,
    affiliate_link,
    retailer,
    asin,
    last_synced,
    created_at,
    updated_at
FROM products
WHERE source = 'amazon';

-- 9. Create function to get products by source
CREATE OR REPLACE FUNCTION get_products_by_source(source_filter TEXT DEFAULT NULL)
RETURNS TABLE (
    id INTEGER,
    name TEXT,
    price DECIMAL(10,2),
    original_price DECIMAL(10,2),
    image_url TEXT,
    category TEXT,
    brand TEXT,
    rating DECIMAL(2,1),
    review_count INTEGER,
    external_url TEXT,
    affiliate_link TEXT,
    retailer TEXT,
    source TEXT,
    asin TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    IF source_filter IS NULL THEN
        RETURN QUERY
        SELECT p.id, p.name, p.price, p.original_price, p.image_url, 
               p.category, p.brand, p.rating, p.review_count, 
               p.external_url, p.affiliate_link, p.retailer, p.source, p.asin, p.created_at
        FROM products p
        ORDER BY p.created_at DESC;
    ELSE
        RETURN QUERY
        SELECT p.id, p.name, p.price, p.original_price, p.image_url, 
               p.category, p.brand, p.rating, p.review_count, 
               p.external_url, p.affiliate_link, p.retailer, p.source, p.asin, p.created_at
        FROM products p
        WHERE p.source = source_filter
        ORDER BY p.created_at DESC;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 10. Create RLS policies for Amazon data (if RLS is enabled)
-- Enable RLS if not already enabled
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE amazon_sync_log ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE amazon_api_usage ENABLE ROW LEVEL SECURITY;

-- Create policies (uncomment if using RLS)
/*
CREATE POLICY "Allow public read access to products" ON products
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert products" ON products
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update products" ON products
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete products" ON products
    FOR DELETE USING (auth.role() = 'authenticated');
*/

-- 11. Add sample data verification
DO $$
BEGIN
    -- Check if products table has the new columns
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'source'
    ) THEN
        RAISE NOTICE 'Amazon products schema update completed successfully!';
        RAISE NOTICE 'New columns added: source, asin, retailer, review_count, rating, last_synced';
    ELSE
        RAISE EXCEPTION 'Schema update failed - source column not found';
    END IF;
END $$;

-- Display current table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;
