# 🔐 Hoang Admin User Setup Guide

## 📋 Thông tin tài khoản
- **Email**: `hoang@shopwithus.com`
- **Password**: `hoang123@`
- **Role**: `admin`

## 🚀 Cách setup tài khoản admin

### Phương pháp 1: Sử dụng SQL Script (Khuyến nghị)

**Bước 1: Lấy User ID**
1. Vào [Supabase Dashboard](https://supabase.com/dashboard)
2. Chọn project: `rlgjpejeulxvfatwvniq`
3. Vào **Authentication** → **Users**
4. Tìm user với email: `hoang@shopwithus.com`
5. Click vào user để xem chi tiết
6. Copy **User ID** (dạng: `12345678-1234-1234-1234-123456789abc`)

**Bước 2: Chạy SQL Script**
1. Vào **SQL Editor** trong Supabase Dashboard
2. Tạo query mới
3. Copy script từ file `CREATE_HOANG_ADMIN.sql`
4. Thay `YOUR_USER_ID_HERE` bằng User ID thực tế
5. Click **"Run"**

**Bước 3: Verify**
```sql
SELECT * FROM profiles WHERE email = 'hoang@shopwithus.com';
```

### Phương pháp 2: Sử dụng Node.js Script

**Bước 1: Chạy script**
```bash
node create-hoang-admin.js
```

**Bước 2: Kiểm tra kết quả**
- Script sẽ tự động tạo user trong Supabase Auth
- Tự động thêm profile vào database
- Hiển thị thông tin user đã tạo

## 🌐 Test Login

**Sau khi setup xong:**

1. **Vào web application** (không phải localhost)
2. **Navigate to login page**
3. **Nhập credentials:**
   - Email: `hoang@shopwithus.com`
   - Password: `hoang123@`
4. **Click "Login"**

## 🔧 Troubleshooting

### Nếu gặp lỗi "User not found"
- Kiểm tra xem user có tồn tại trong Supabase Auth không
- Nếu chưa có, tạo user thủ công trong Authentication > Users

### Nếu gặp lỗi "Access denied"
- Kiểm tra xem profile có role = 'admin' không
- Chạy query: `SELECT * FROM profiles WHERE email = 'hoang@shopwithus.com';`

### Nếu gặp lỗi "Invalid credentials"
- Kiểm tra lại email và password
- Đảm bảo user đã được confirm trong Supabase Auth

## ✅ Checklist

- [ ] User tồn tại trong Supabase Auth
- [ ] Profile được tạo trong database với role = 'admin'
- [ ] Có thể login từ web application
- [ ] Có thể access admin panel
- [ ] Tất cả admin features hoạt động

## 🛡️ Security Notes

- **Đổi password** sau lần login đầu tiên
- **Không chia sẻ** credentials với người khác
- **Logout** khi không sử dụng
- **Review access** định kỳ

---

**🎉 Chúc mừng!** Bạn đã có tài khoản admin hoạt động cho web application!
