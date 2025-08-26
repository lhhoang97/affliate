-- Tạo bảng coupon_retailers
CREATE TABLE IF NOT EXISTS coupon_retailers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng coupon_categories
CREATE TABLE IF NOT EXISTS coupon_categories (
    id SERIAL PRIMARY KEY,
    retailer_id INTEGER REFERENCES coupon_retailers(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Thêm dữ liệu mẫu cho coupon_retailers
INSERT INTO coupon_retailers (name, icon, display_order, is_active) VALUES
('Amazon', '🛒', 1, true),
('eBay', '🛍️', 2, true),
('Best Buy', '🏪', 3, true);

-- Thêm dữ liệu mẫu cho coupon_categories
INSERT INTO coupon_categories (retailer_id, name, slug, display_order, is_active) VALUES
(1, 'Electronics Coupons', 'amazon-electronics', 1, true),
(1, 'Fashion Coupons', 'amazon-fashion', 2, true),
(1, 'Home & Garden Coupons', 'amazon-home-garden', 3, true),
(2, 'Tech Deals', 'ebay-tech', 1, true),
(2, 'Fashion Deals', 'ebay-fashion', 2, true),
(2, 'Home Deals', 'ebay-home', 3, true),
(3, 'Electronics Deals', 'bestbuy-electronics', 1, true),
(3, 'Gaming Deals', 'bestbuy-gaming', 2, true),
(3, 'Appliance Deals', 'bestbuy-appliances', 3, true);

-- Tạo index để tối ưu performance
CREATE INDEX idx_coupon_retailers_order ON coupon_retailers(display_order, is_active);
CREATE INDEX idx_coupon_categories_retailer ON coupon_categories(retailer_id, display_order, is_active);
