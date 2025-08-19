-- Supabase Database Setup
-- Run this SQL in your Supabase SQL Editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret-here';

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar TEXT,
  phone TEXT,
  address TEXT,
  bio TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  image TEXT,
  slug TEXT UNIQUE NOT NULL,
  product_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  image TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  category TEXT NOT NULL,
  brand TEXT,
  in_stock BOOLEAN DEFAULT true,
  features JSONB DEFAULT '[]',
  specifications JSONB DEFAULT '{}',
  images JSONB DEFAULT '[]',
  tags JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  helpful INTEGER DEFAULT 0,
  not_helpful INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  images JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total DECIMAL(10,2) NOT NULL,
  items JSONB NOT NULL,
  shipping_address JSONB,
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for categories (public read, admin write)
CREATE POLICY "Anyone can view categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert categories" ON categories
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update categories" ON categories
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete categories" ON categories
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for products (public read, admin write)
CREATE POLICY "Anyone can view products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert products" ON products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update products" ON products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete products" ON products
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for reviews
CREATE POLICY "Anyone can view reviews" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON reviews
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for orders
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" ON orders
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for wishlist
CREATE POLICY "Users can view their own wishlist" ON wishlist
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wishlist items" ON wishlist
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wishlist items" ON wishlist
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO categories (name, description, image, slug) VALUES
('Electronics', 'Latest electronic devices and gadgets', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', 'electronics'),
('Clothing', 'Fashion and apparel for all ages', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400', 'clothing'),
('Home & Garden', 'Everything for your home and garden', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', 'home-garden'),
('Sports & Outdoors', 'Sports equipment and outdoor gear', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', 'sports-outdoors'),
('Books', 'Books for all interests and ages', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', 'books'),
('Beauty', 'Beauty and personal care products', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', 'beauty'),
('Toys & Games', 'Toys and games for children and adults', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'toys-games'),
('Automotive', 'Automotive parts and accessories', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400', 'automotive')
ON CONFLICT (name) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, description, price, original_price, image, rating, review_count, category, brand, in_stock, features, specifications, images, tags) VALUES
('iPhone 15 Pro', 'Latest iPhone with advanced camera system and A17 Pro chip', 999.99, 1099.99, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400', 4.8, 1250, 'Electronics', 'Apple', true, '["5G", "Pro Camera", "A17 Pro Chip", "Titanium Design"]', '{"Storage": "128GB", "Color": "Natural Titanium", "Screen": "6.1 inch"}', '["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400"]', '["smartphone", "apple", "5g", "camera"]'),
('Samsung Galaxy S24', 'Premium Android smartphone with AI features', 899.99, 999.99, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', 4.7, 890, 'Electronics', 'Samsung', true, '["5G", "AI Features", "S Pen", "Advanced Camera"]', '{"Storage": "256GB", "Color": "Phantom Black", "Screen": "6.2 inch"}', '["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400"]', '["smartphone", "samsung", "5g", "ai"]'),
('Sony WH-1000XM5', 'Industry-leading noise canceling headphones', 349.99, 399.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 4.9, 567, 'Electronics', 'Sony', true, '["Noise Canceling", "30h Battery", "Quick Charge", "Touch Controls"]', '{"Connectivity": "Bluetooth 5.2", "Battery": "30 hours", "Weight": "250g"}', '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"]', '["headphones", "sony", "noise-canceling", "wireless"]'),
('MacBook Pro M3', 'Powerful laptop with M3 chip for professionals', 1999.99, 2199.99, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', 4.8, 432, 'Electronics', 'Apple', true, '["M3 Chip", "Retina Display", "Touch Bar", "Thunderbolt 4"]', '{"Storage": "512GB SSD", "Memory": "16GB", "Display": "14 inch"}', '["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400"]', '["laptop", "macbook", "apple", "m3"]'),
('Sony PlayStation 5', 'Next-generation gaming console', 499.99, 549.99, 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400', 4.9, 1234, 'Electronics', 'Sony', true, '["4K Gaming", "Ray Tracing", "SSD Storage", "DualSense Controller"]', '{"Storage": "825GB SSD", "Resolution": "4K", "HDR": "Yes"}', '["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400"]', '["gaming", "playstation", "sony", "4k"]')
ON CONFLICT (id) DO NOTHING;

-- Create admin user (you'll need to create this user in Supabase Auth first)
-- Then run this to set their role:
-- UPDATE profiles SET role = 'admin' WHERE email = 'admin@example.com';
