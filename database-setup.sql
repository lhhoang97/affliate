-- SUPABASE DATABASE SETUP FOR AFFILIATE WEBSITE
-- Copy và paste file này vào Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  image TEXT,
  rating NUMERIC DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  category TEXT NOT NULL,
  brand TEXT NOT NULL,
  retailer TEXT,
  in_stock BOOLEAN DEFAULT true,
  features JSONB DEFAULT '[]',
  specifications JSONB DEFAULT '{}',
  images JSONB DEFAULT '[]',
  tags JSONB DEFAULT '[]',
  external_url TEXT,
  affiliate_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image TEXT,
  slug TEXT UNIQUE,
  product_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles table for users
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  avatar TEXT,
  is_verified BOOLEAN DEFAULT false,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  phone VARCHAR(20),
  address TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Allow public read access on products" ON products 
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on categories" ON categories 
  FOR SELECT USING (true);

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Insert some basic categories
INSERT INTO categories (name, description, slug) VALUES 
  ('Electronics', 'Electronic devices and gadgets', 'electronics'),
  ('Computers', 'Laptops, desktops, and computer accessories', 'computers'),
  ('Smartphones', 'Mobile phones and accessories', 'smartphones'),
  ('Audio', 'Headphones, speakers, and audio equipment', 'audio'),
  ('Gaming', 'Gaming consoles, games, and accessories', 'gaming')
ON CONFLICT (slug) DO NOTHING;
