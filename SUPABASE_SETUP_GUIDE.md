# Supabase Setup Guide

## 🚀 Cách setup Supabase cho dự án

### 1. Tạo Supabase Project

1. **Truy cập [supabase.com](https://supabase.com)**
2. **Đăng ký/Đăng nhập** với GitHub hoặc Google
3. **Click "New Project"**
4. **Chọn organization** (hoặc tạo mới)
5. **Đặt tên project:** `product-review-hub`
6. **Chọn database password** (lưu lại để dùng sau)
7. **Chọn region** gần bạn nhất
8. **Click "Create new project"**

### 2. Lấy Credentials

1. **Vào Settings → API**
2. **Copy các thông tin:**
   - **Project URL** (ví dụ: `https://your-project.supabase.co`)
   - **anon public key** (bắt đầu với `eyJ...`)

### 3. Cấu hình Environment Variables

1. **Mở file `.env` trong project**
2. **Thay thế các giá trị:**

```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Setup Database Schema

1. **Vào SQL Editor** trong Supabase Dashboard
2. **Copy toàn bộ nội dung** từ file `SUPABASE_SETUP.sql`
3. **Paste vào SQL Editor**
4. **Click "Run"** để tạo tables và sample data

### 5. Tạo Admin User

1. **Vào Authentication → Users**
2. **Click "Add User"**
3. **Tạo user với:**
   - Email: `admin@example.com`
   - Password: `admin123`
4. **Vào SQL Editor** và chạy:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'admin@example.com';
   ```

### 6. Test App

1. **Restart development server:**
   ```bash
   npm start
   ```
2. **Truy cập:** `http://localhost:8080`
3. **Đăng nhập với:**
   - Admin: `admin@example.com` / `admin123`
   - Hoặc tạo user mới

## 🔧 Cấu hình Row Level Security (RLS)

RLS đã được setup trong SQL script với các policies:

- **Profiles:** Users chỉ có thể xem/sửa profile của mình
- **Categories:** Public read, chỉ admin có thể write
- **Products:** Public read, chỉ admin có thể write
- **Reviews:** Public read, users có thể tạo/sửa review của mình
- **Orders:** Users chỉ có thể xem orders của mình
- **Wishlist:** Users chỉ có thể xem wishlist của mình

## 📊 Database Schema

### Tables:
- **profiles:** User profiles với role-based access
- **categories:** Product categories
- **products:** Product information
- **reviews:** Product reviews
- **orders:** User orders
- **wishlist:** User wishlist items

### Key Features:
- **UUID primary keys** cho security
- **JSONB fields** cho flexible data storage
- **Timestamps** cho tracking
- **Foreign key relationships** với cascade delete
- **Indexes** cho performance

## 🛠 Troubleshooting

### Lỗi "Cannot find module '@supabase/supabase-js'"
```bash
npm install @supabase/supabase-js
```

### Lỗi "Supabase not configured"
- Kiểm tra file `.env` có đúng credentials không
- Restart development server sau khi thay đổi `.env`

### Lỗi "Permission denied"
- Kiểm tra RLS policies
- Đảm bảo user đã đăng nhập
- Kiểm tra role của user

### Lỗi "Table doesn't exist"
- Chạy lại SQL script trong Supabase SQL Editor
- Kiểm tra tên tables có đúng không

## 🔐 Security Best Practices

1. **Never commit `.env` file** (đã có trong `.gitignore`)
2. **Use RLS policies** để bảo vệ data
3. **Validate input** ở client và server
4. **Use HTTPS** trong production
5. **Regular security audits** của Supabase

## 📈 Performance Tips

1. **Use indexes** (đã tạo sẵn)
2. **Limit query results** với pagination
3. **Use caching** cho static data
4. **Optimize images** trước khi upload
5. **Monitor query performance** trong Supabase Dashboard

## 🚀 Deploy to Production

1. **Setup production Supabase project**
2. **Update environment variables**
3. **Run database migrations**
4. **Test thoroughly**
5. **Deploy React app** (Vercel, Netlify, etc.)

## 📞 Support

- **Supabase Docs:** [supabase.com/docs](https://supabase.com/docs)
- **Discord Community:** [supabase.com/discord](https://supabase.com/discord)
- **GitHub Issues:** [github.com/supabase/supabase](https://github.com/supabase/supabase)
