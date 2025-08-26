# 🚀 Hướng Dẫn Chuyển Đổi Từ Mock Data Sang Supabase

## 📋 Tổng Quan

Hướng dẫn này sẽ giúp bạn chuyển đổi từ mock data sang Supabase database thực để lưu trữ dữ liệu sản phẩm, danh mục và người dùng.

## 🔧 Bước 1: Tạo Supabase Project

### 1.1 Đăng ký Supabase
1. Truy cập [supabase.com](https://supabase.com)
2. Đăng ký tài khoản hoặc đăng nhập
3. Click "New Project"

### 1.2 Tạo Project
1. **Organization:** Chọn organization của bạn
2. **Name:** Đặt tên project (ví dụ: `affiliate-store`)
3. **Database Password:** Tạo password mạnh
4. **Region:** Chọn region gần nhất
5. Click "Create new project"

## 🔑 Bước 2: Lấy Thông Tin Kết Nối

### 2.1 Lấy URL và API Key
1. Vào **Settings** → **API**
2. Copy **Project URL** và **anon public** key
3. Lưu lại để sử dụng trong file `.env`

### 2.2 Tạo File .env
Tạo file `.env` trong thư mục gốc của project:

```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here

# Enable Supabase (set to true to use Supabase instead of mock data)
REACT_APP_USE_SUPABASE=true
```

## 🗄️ Bước 3: Tạo Database Schema

### 3.1 Tạo Bảng Products
Chạy SQL sau trong Supabase SQL Editor:

```sql
-- Create products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  image TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  category VARCHAR(100) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  retailer VARCHAR(100),
  in_stock BOOLEAN DEFAULT true,
  features JSONB DEFAULT '[]',
  specifications JSONB DEFAULT '{}',
  images JSONB DEFAULT '[]',
  tags JSONB DEFAULT '[]',
  external_url TEXT,
  affiliate_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public read access" ON products
  FOR SELECT USING (true);

-- Create policy for authenticated users to insert/update/delete
CREATE POLICY "Authenticated users can manage products" ON products
  FOR ALL USING (auth.role() = 'authenticated');
```

### 3.2 Tạo Bảng Categories
```sql
-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  image TEXT,
  slug VARCHAR(100) UNIQUE,
  product_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public read access" ON categories
  FOR SELECT USING (true);

-- Create policy for authenticated users to manage
CREATE POLICY "Authenticated users can manage categories" ON categories
  FOR ALL USING (auth.role() = 'authenticated');
```

### 3.3 Tạo Bảng Profiles (Users)
```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  avatar TEXT,
  is_verified BOOLEAN DEFAULT false,
  role VARCHAR(20) DEFAULT 'user',
  phone VARCHAR(20),
  address TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Create policy for users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create policy for authenticated users to insert
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

## 📊 Bước 4: Migrate Dữ Liệu Từ Mock

### 4.1 Chạy Script Migration
Sau khi setup xong, chạy script migration để chuyển dữ liệu từ mock sang Supabase:

```bash
# Chạy script migration
node migrate-to-supabase.js
```

### 4.2 Hoặc Import Thủ Công
1. Vào **Table Editor** trong Supabase
2. Chọn bảng **products**
3. Click **Import** và upload file JSON với dữ liệu mock

## 🔄 Bước 5: Cập Nhật Code

### 5.1 Cập Nhật productService
Code đã được cập nhật để sử dụng Supabase khi có cấu hình.

### 5.2 Kiểm Tra Kết Nối
1. Restart development server
2. Kiểm tra console để đảm bảo kết nối thành công
3. Test các chức năng CRUD

## 🚀 Bước 6: Test Tính Năng

### 6.1 Test Products
1. Vào **Admin Panel** → **Products**
2. Thử tạo sản phẩm mới
3. Kiểm tra dữ liệu trong Supabase Table Editor

### 6.2 Test Categories
1. Vào **Admin Panel** → **Categories**
2. Tạo danh mục mới
3. Kiểm tra hiển thị trên website

### 6.3 Test Price Updates
1. Vào **Admin Panel** → **Price Updates**
2. Test tính năng cập nhật giá tự động

## 🔒 Bước 7: Bảo Mật

### 7.1 Row Level Security
- Tất cả bảng đã được bảo vệ với RLS
- Chỉ admin mới có thể quản lý sản phẩm
- Người dùng chỉ có thể xem dữ liệu công khai

### 7.2 API Keys
- Sử dụng `anon` key cho frontend
- Không bao giờ expose `service_role` key

## 📝 Troubleshooting

### Lỗi Kết Nối
```bash
# Kiểm tra biến môi trường
echo $REACT_APP_SUPABASE_URL
echo $REACT_APP_SUPABASE_ANON_KEY
```

### Lỗi RLS
- Kiểm tra policies trong Supabase
- Đảm bảo user đã được authenticate

### Lỗi Migration
- Kiểm tra schema trong Supabase
- Đảm bảo tất cả bảng đã được tạo

## 🎯 Kết Quả

Sau khi hoàn thành:
- ✅ Dữ liệu được lưu trong Supabase thay vì localStorage
- ✅ Có thể quản lý dữ liệu qua Supabase Dashboard
- ✅ Backup và restore tự động
- ✅ Scalable và production-ready
- ✅ Real-time updates (nếu cần)

---

**🎉 Chúc mừng! Website của bạn đã sẵn sàng với Supabase!**
