# 🚀 Quick Bundle Deals Setup

## Bước 1: Cấu hình .env
Cập nhật file `.env` với thông tin Supabase của bạn:

```env
VITE_SUPABASE_URL=https://rlgjpejeulxvfatwvniq.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

## Bước 2: Test kết nối
```bash
node test-supabase-connection.js
```

## Bước 3: Setup Bundle Deals
```bash
node simple-bundle-setup.js
```

## Bước 4: Chạy website
```bash
npm start
```

## Bước 5: Truy cập Admin
1. Đăng nhập với tài khoản admin
2. Vào `/admin/bundle-deals`
3. Quản lý bundle deals

## 🎯 Tính năng đã sẵn sàng:

### Admin Interface
- ✅ Tạo/sửa/xóa bundle deals
- ✅ Chọn sản phẩm và loại deal (Get 2, Get 3, Get 4, Get 5)
- ✅ Điều chỉnh % giảm giá
- ✅ Bật/tắt deals
- ✅ Xem trước giá sau giảm

### Cart Integration
- ✅ Tự động tính bundle deals khi thêm sản phẩm
- ✅ Hiển thị giá gốc, giá sau giảm, số tiền tiết kiệm
- ✅ Badge hiển thị loại deal và % giảm giá
- ✅ Responsive design

### Database
- ✅ Bảng `bundle_deals` với đầy đủ fields
- ✅ RLS policies cho bảo mật
- ✅ Indexes để tối ưu performance

## 🔧 Troubleshooting

### Lỗi "supabaseUrl is required"
- Kiểm tra file `.env` có đúng format không
- Restart terminal sau khi cập nhật .env

### Lỗi "Table doesn't exist"
- Chạy `node simple-bundle-setup.js`
- Kiểm tra Supabase dashboard

### Lỗi "Permission denied"
- Kiểm tra RLS policies
- Đảm bảo user có role admin

## 📱 Test Bundle Deals

1. **Thêm sản phẩm vào giỏ hàng**
2. **Thay đổi số lượng** để trigger bundle deals
3. **Xem cart sidebar** để thấy bundle savings
4. **Kiểm tra admin panel** để quản lý deals

## 🎉 Hoàn thành!

Hệ thống Bundle Deals đã sẵn sàng sử dụng! Bạn có thể:
- Quản lý bundle deals qua admin panel
- Khách hàng sẽ thấy bundle deals trong giỏ hàng
- Tự động tính toán giá và tiết kiệm

