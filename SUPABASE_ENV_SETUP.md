# 🔧 SUPABASE ENVIRONMENT SETUP

## 📋 Bước 1: Tạo file .env

Tạo file `.env` trong thư mục root với nội dung:

```bash
# Supabase Configuration
REACT_APP_SUPABASE_URL=your_supabase_project_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## 🌐 Bước 2: Lấy thông tin Supabase

### Nếu chưa có Supabase project:
1. Truy cập [supabase.com](https://supabase.com)
2. Sign up / Login
3. Click "New Project"
4. Chọn Organization và điền thông tin project
5. Đợi project được tạo (1-2 phút)

### Lấy credentials:
1. Vào **Settings** > **API**
2. Copy:
   - **Project URL** → `REACT_APP_SUPABASE_URL`
   - **anon public key** → `REACT_APP_SUPABASE_ANON_KEY`

## 📊 Bước 3: Thiết lập Database

Chạy SQL trong **SQL Editor**:

```sql
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

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read access" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON categories FOR SELECT USING (true);
```

## ✅ Bước 4: Test kết nối

Sau khi setup, restart dev server:
```bash
npm start
```

Nếu thành công, bạn sẽ thấy:
```
✅ Supabase client created successfully
```

## 🚀 Bước 5: Thêm test data

Chạy script để thêm 10 sản phẩm test:
```bash
node add-test-products.js
```
