-- Tạo bảng deal_categories
CREATE TABLE IF NOT EXISTS deal_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng deal_subcategories
CREATE TABLE IF NOT EXISTS deal_subcategories (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES deal_categories(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Thêm dữ liệu mẫu cho deal_categories
INSERT INTO deal_categories (name, icon, display_order, is_active) VALUES
('Flash Deals', '⚡', 1, true),
('Featured Deals', '⭐', 2, true),
('Seasonal Deals', '🎉', 3, true);

-- Thêm dữ liệu mẫu cho deal_subcategories
INSERT INTO deal_subcategories (category_id, name, slug, display_order, is_active) VALUES
(1, 'Limited Time Offers', 'limited-time-offers', 1, true),
(1, 'Daily Deals', 'daily-deals', 2, true),
(1, 'Weekend Specials', 'weekend-specials', 3, true),
(2, 'Best Sellers', 'best-sellers', 1, true),
(2, 'Trending Now', 'trending-now', 2, true),
(2, 'Editor''s Picks', 'editors-picks', 3, true),
(3, 'Black Friday', 'black-friday', 1, true),
(3, 'Cyber Monday', 'cyber-monday', 2, true),
(3, 'Holiday Sales', 'holiday-sales', 3, true);

-- Tạo index để tối ưu performance
CREATE INDEX idx_deal_categories_order ON deal_categories(display_order, is_active);
CREATE INDEX idx_deal_subcategories_category ON deal_subcategories(category_id, display_order, is_active);
