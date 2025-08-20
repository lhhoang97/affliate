# 🚀 Hướng dẫn Setup Supabase Database

## 📋 **Bước 1: Tạo Supabase Project**

### 1.1 Đăng ký/Đăng nhập
- Vào [supabase.com](https://supabase.com)
- Đăng nhập bằng GitHub hoặc Google

### 1.2 Tạo Project mới
- Click **"New Project"**
- Điền thông tin:
  ```
  Name: shopwithus-db
  Database Password: shopwithus123456 (hoặc password mạnh hơn)
  Region: Singapore hoặc Tokyo (gần Việt Nam)
  ```
- Click **"Create new project"**
- Đợi 2-3 phút để setup hoàn tất

## 🔑 **Bước 2: Lấy API Keys**

### 2.1 Vào Settings → API
- Trong Supabase Dashboard, click **Settings** (icon bánh răng)
- Chọn **API** từ menu bên trái

### 2.2 Copy thông tin
- **Project URL:** `https://abcdefghijklmnop.supabase.co`
- **anon public key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## ⚙️ **Bước 3: Cấu hình Environment**

### 3.1 Tạo file .env
```bash
# File .env đã được tạo sẵn, chỉ cần điền thông tin
cp env.example .env
```

### 3.2 Điền thông tin Supabase
```bash
# Mở file .env và thay thế:
REACT_APP_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
REACT_APP_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

## 🗄️ **Bước 4: Tạo Database Tables**

### 4.1 Vào SQL Editor
- Trong Supabase Dashboard, click **SQL Editor**
- Click **"New query"**

### 4.2 Chạy SQL Script
- Copy toàn bộ nội dung từ file `SUPABASE_SETUP.sql`
- Paste vào SQL Editor
- Click **"Run"**

### 4.3 Kiểm tra Tables
- Vào **Table Editor**
- Kiểm tra các tables đã được tạo:
  - ✅ profiles
  - ✅ categories  
  - ✅ products
  - ✅ reviews
  - ✅ orders
  - ✅ wishlist

## 👤 **Bước 5: Tạo Admin User**

### 5.1 Tạo User trong Auth
- Vào **Authentication → Users**
- Click **"Add user"**
- Điền thông tin:
  ```
  Email: admin@shopwithus.com
  Password: admin123456
  ```

### 5.2 Set Admin Role
- Vào **SQL Editor**
- Chạy query:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'admin@shopwithus.com';
```

## 🧪 **Bước 6: Test Database**

### 6.1 Restart Development Server
```bash
npm start
```

### 6.2 Kiểm tra kết nối
- Vào trang admin: `http://localhost:3000/admin`
- Thử thêm sản phẩm mới
- Kiểm tra trong Supabase Dashboard → Table Editor → products

## 🔧 **Troubleshooting**

### Lỗi kết nối
```bash
# Kiểm tra environment variables
echo $REACT_APP_SUPABASE_URL
echo $REACT_APP_SUPABASE_ANON_KEY
```

### Lỗi RLS (Row Level Security)
- Vào **Authentication → Policies**
- Kiểm tra các policies đã được tạo
- Nếu chưa có, chạy lại SQL script

### Lỗi CORS
- Vào **Settings → API**
- Thêm domain vào **Additional Allowed Origins:**
  ```
  http://localhost:3000
  https://your-netlify-app.netlify.app
  ```

## 📊 **Database Schema**

### Tables Structure
- **profiles:** Thông tin người dùng
- **categories:** Danh mục sản phẩm
- **products:** Sản phẩm
- **reviews:** Đánh giá sản phẩm
- **orders:** Đơn hàng
- **wishlist:** Danh sách yêu thích

### Security Features
- ✅ Row Level Security (RLS)
- ✅ Public read access cho products/categories
- ✅ Admin-only write access
- ✅ User-specific data protection

## 🎯 **Kết quả mong đợi**

Sau khi hoàn tất:
- ✅ Database hoạt động thực
- ✅ Dữ liệu được lưu vĩnh viễn
- ✅ Đồng bộ đa thiết bị
- ✅ Backup tự động
- ✅ Real-time updates
- ✅ User management

## 📞 **Hỗ trợ**

Nếu gặp vấn đề:
1. Kiểm tra console browser (F12)
2. Kiểm tra Supabase Dashboard logs
3. Đảm bảo environment variables đúng
4. Restart development server
