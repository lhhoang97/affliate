# Bundle Deals System Setup Guide

## Tổng quan
Hệ thống Bundle Deals cho phép admin quản lý các deal "Get 2", "Get 3", "Get 4", "Get 5" với phần trăm giảm giá tùy chỉnh.

## Các tính năng đã triển khai

### 1. Database Schema
- **Bảng `bundle_deals`**: Lưu trữ thông tin bundle deals
  - `product_id`: ID sản phẩm
  - `bundle_type`: Loại deal (get2, get3, get4, get5)
  - `discount_percentage`: % giảm giá (0-100)
  - `is_active`: Trạng thái hoạt động
  - `created_at`, `updated_at`: Timestamps

### 2. Admin Interface
- **Trang quản lý**: `/admin/bundle-deals`
- **Tính năng**:
  - Xem danh sách bundle deals
  - Thêm/sửa/xóa bundle deals
  - Bật/tắt deals
  - Xem trước giá sau giảm
  - Hiển thị số tiền tiết kiệm

### 3. Cart Integration
- **Tự động tính toán**: Khi thêm sản phẩm vào giỏ hàng
- **Hiển thị bundle deals**: Trong cart sidebar
- **Tính tổng tiền**: Bao gồm bundle savings

### 4. UI Components
- **Cart Sidebar**: Hiển thị bundle deals với giá gốc, giá sau giảm, số tiền tiết kiệm
- **Badge hiển thị**: Loại deal và % giảm giá
- **Responsive design**: Tối ưu cho mobile và desktop

## Cách sử dụng

### 1. Setup Database
```bash
# Chạy SQL để tạo bảng
node setup-bundle-deals.js
```

### 2. Cấu hình .env
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Truy cập Admin
1. Đăng nhập với tài khoản admin
2. Vào `/admin/bundle-deals`
3. Thêm bundle deals cho sản phẩm

### 4. Test Bundle Deals
```bash
# Chạy test script
node test-bundle-deals.js
```

## Ví dụ Bundle Deals

### Get 2 (Mua 2)
- Sản phẩm: iPhone 15 - $150
- Deal: Get 2 - 20% off
- Tính toán:
  - Giá gốc: $150 × 2 = $300
  - Giảm giá: $300 × 20% = $60
  - Giá cuối: $300 - $60 = $240
  - Tiết kiệm: $60

### Get 3 (Mua 3)
- Sản phẩm: MacBook Pro - $2000
- Deal: Get 3 - 30% off
- Tính toán:
  - Giá gốc: $2000 × 3 = $6000
  - Giảm giá: $6000 × 30% = $1800
  - Giá cuối: $6000 - $1800 = $4200
  - Tiết kiệm: $1800

## Files đã tạo/cập nhật

### Database
- `CREATE_BUNDLE_DEALS_TABLE.sql` - SQL tạo bảng
- `setup-bundle-deals.js` - Script setup database

### Frontend
- `src/pages/AdminBundleDealsPage.tsx` - Trang admin quản lý
- `src/types/bundleDeal.ts` - Type definitions
- `src/services/cartService.ts` - Logic tính bundle deals
- `src/contexts/SimpleCartContext.tsx` - Context với bundle deals
- `src/components/SimpleCartSidebar.tsx` - UI hiển thị deals

### Test
- `test-bundle-deals.js` - Script test hệ thống

## API Functions

### Cart Service
- `getBundleDeals(productIds)` - Lấy bundle deals cho sản phẩm
- `calculateBundleSavings(price, quantity, deals)` - Tính tiết kiệm
- `getCartItems()` - Lấy cart items với bundle deals
- `getCartSummary()` - Tổng tiền bao gồm bundle savings

### Admin Functions
- CRUD operations cho bundle deals
- Validation và error handling
- Real-time preview giá

## Lưu ý quan trọng

1. **Database**: Cần chạy SQL setup trước khi sử dụng
2. **Environment**: Cần cấu hình đúng Supabase credentials
3. **Permissions**: Chỉ admin mới có thể quản lý bundle deals
4. **Performance**: Bundle deals được cache để tối ưu performance

## Troubleshooting

### Lỗi thường gặp
1. **"supabaseUrl is required"**: Kiểm tra file .env
2. **"Table doesn't exist"**: Chạy setup-bundle-deals.js
3. **"Permission denied"**: Kiểm tra RLS policies

### Debug
- Kiểm tra console logs trong browser
- Sử dụng test-bundle-deals.js để debug
- Kiểm tra Supabase dashboard

## Mở rộng

### Thêm bundle types mới
1. Cập nhật `bundle_type` enum trong SQL
2. Thêm options trong admin form
3. Cập nhật UI hiển thị

### Thêm điều kiện
1. Thời gian áp dụng (start_date, end_date)
2. Số lượng tối thiểu/tối đa
3. Điều kiện sản phẩm cụ thể

### Analytics
1. Track bundle deal usage
2. A/B testing different percentages
3. Revenue impact analysis
