# 🚀 Hướng Dẫn Nhanh: Chuyển Đổi Sang Supabase

## ⚡ Bước 1: Tạo Supabase Project

1. **Đăng ký/Đăng nhập:** [supabase.com](https://supabase.com)
2. **Tạo Project mới:**
   - Name: `affiliate-store`
   - Password: `your_strong_password`
   - Region: Singapore/Tokyo (gần VN)
3. **Đợi 2-3 phút** để setup hoàn tất

## 🔑 Bước 2: Lấy API Keys

1. Vào **Settings** → **API**
2. Copy:
   - **Project URL:** `https://xxx.supabase.co`
   - **anon public key:** `eyJhbGciOiJIUzI1NiIs...`

## ⚙️ Bước 3: Cấu Hình Environment

Tạo file `.env` trong thư mục gốc:

```env
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
```

## 🗄️ Bước 4: Tạo Database Schema

1. Vào **SQL Editor** trong Supabase
2. Copy toàn bộ nội dung từ file `SUPABASE_SETUP.sql`
3. Click **"Run"**
4. Đợi thông báo thành công

## 🧪 Bước 5: Test Kết Nối

```bash
npm run supabase:test
```

## 📊 Bước 6: Migrate Dữ Liệu

```bash
npm run supabase:migrate
```

## 🚀 Bước 7: Restart & Test

```bash
npm start
```

Truy cập: http://localhost:3000

## ✅ Kết Quả

- ✅ Dữ liệu được lưu trong Supabase
- ✅ Không còn sử dụng mock data
- ✅ Có thể quản lý qua Supabase Dashboard
- ✅ Backup tự động
- ✅ Production-ready

## 🔧 Troubleshooting

### Lỗi "relation does not exist"
- Chạy lại SQL script trong Supabase

### Lỗi kết nối
- Kiểm tra URL và API key trong `.env`

### Lỗi RLS
- Đảm bảo đã chạy đầy đủ SQL script

---

**🎉 Chúc mừng! Website đã chuyển sang Supabase thành công!**


