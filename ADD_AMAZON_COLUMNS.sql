-- Add Amazon-specific columns to affiliate_products table
-- This will add columns for Amazon product data

-- Add Amazon-specific columns
ALTER TABLE affiliate_products 
ADD COLUMN IF NOT EXISTS asin TEXT,
ADD COLUMN IF NOT EXISTS amazon_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS amazon_rating DECIMAL(3,2),
ADD COLUMN IF NOT EXISTS amazon_reviews INTEGER,
ADD COLUMN IF NOT EXISTS amazon_availability TEXT,
ADD COLUMN IF NOT EXISTS amazon_image_url TEXT,
ADD COLUMN IF NOT EXISTS amazon_title TEXT,
ADD COLUMN IF NOT EXISTS amazon_brand TEXT,
ADD COLUMN IF NOT EXISTS amazon_category TEXT,
ADD COLUMN IF NOT EXISTS amazon_feature_bullets TEXT[],
ADD COLUMN IF NOT EXISTS amazon_dimensions TEXT,
ADD COLUMN IF NOT EXISTS amazon_weight TEXT,
ADD COLUMN IF NOT EXISTS amazon_manufacturer TEXT,
ADD COLUMN IF NOT EXISTS amazon_model TEXT,
ADD COLUMN IF NOT EXISTS amazon_color TEXT,
ADD COLUMN IF NOT EXISTS amazon_size TEXT,
ADD COLUMN IF NOT EXISTS amazon_material TEXT,
ADD COLUMN IF NOT EXISTS amazon_warranty TEXT,
ADD COLUMN IF NOT EXISTS amazon_shipping_info TEXT,
ADD COLUMN IF NOT EXISTS amazon_prime_eligible BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS amazon_best_seller BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS amazon_choice BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS amazon_lightning_deal BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS amazon_deal_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS amazon_deal_end_time TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS amazon_last_updated TIMESTAMPTZ DEFAULT NOW();

-- Create indexes for Amazon columns
CREATE INDEX IF NOT EXISTS idx_affiliate_products_asin ON affiliate_products(asin);
CREATE INDEX IF NOT EXISTS idx_affiliate_products_amazon_price ON affiliate_products(amazon_price);
CREATE INDEX IF NOT EXISTS idx_affiliate_products_amazon_rating ON affiliate_products(amazon_rating);
CREATE INDEX IF NOT EXISTS idx_affiliate_products_amazon_reviews ON affiliate_products(amazon_reviews);
CREATE INDEX IF NOT EXISTS idx_affiliate_products_amazon_prime ON affiliate_products(amazon_prime_eligible);
CREATE INDEX IF NOT EXISTS idx_affiliate_products_amazon_best_seller ON affiliate_products(amazon_best_seller);
CREATE INDEX IF NOT EXISTS idx_affiliate_products_amazon_choice ON affiliate_products(amazon_choice);
CREATE INDEX IF NOT EXISTS idx_affiliate_products_amazon_lightning_deal ON affiliate_products(amazon_lightning_deal);
CREATE INDEX IF NOT EXISTS idx_affiliate_products_amazon_last_updated ON affiliate_products(amazon_last_updated DESC);
