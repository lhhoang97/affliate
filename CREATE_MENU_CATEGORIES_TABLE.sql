-- Tạo bảng menu_categories
CREATE TABLE IF NOT EXISTS menu_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng menu_subcategories
CREATE TABLE IF NOT EXISTS menu_subcategories (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES menu_categories(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Thêm dữ liệu mẫu cho menu_categories
INSERT INTO menu_categories (name, icon, display_order, is_active) VALUES
('Electronics', '📱', 1, true),
('Home & Kitchen', '🏠', 2, true),
('Fashion', '👕', 3, true);

-- Thêm dữ liệu mẫu cho menu_subcategories
INSERT INTO menu_subcategories (category_id, name, slug, display_order, is_active) VALUES
(1, 'Phones', 'smartphones', 1, true),
(1, 'Laptops', 'computers-laptops', 2, true),
(1, 'Gaming', 'gaming', 3, true),
(2, 'Appliances', 'home-appliances', 1, true),
(2, 'Furniture', 'furniture', 2, true),
(3, 'Men''s Clothing', 'mens-clothing', 1, true),
(3, 'Women''s Clothing', 'womens-clothing', 2, true);

-- Tạo index để tối ưu performance
CREATE INDEX idx_menu_categories_order ON menu_categories(display_order, is_active);
CREATE INDEX idx_menu_subcategories_category ON menu_subcategories(category_id, display_order, is_active);
