# Category Synchronization Guide

## Tổng quan
Script này sẽ đồng bộ tất cả 17 danh mục từ local data vào Supabase database, bao gồm:
- Electronics, Computers & Laptops, Smartphones, Gaming
- Home Appliances, Fashion & Clothing, Beauty & Personal Care
- Health & Fitness, Books & Media, Toys & Hobbies
- Sports & Outdoors, Automotive, Baby & Kids
- Pet Supplies, Office Supplies, Tools & Hardware, Furniture

## Bước 1: Chuẩn bị Environment
1. Đảm bảo file `.env` có chứa Supabase credentials:
```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Bước 2: Cập nhật Database Schema
1. Mở Supabase Dashboard
2. Vào SQL Editor
3. Copy và paste nội dung từ file `UPDATE_CATEGORIES_SCHEMA.sql`
4. Chạy script để cập nhật bảng categories

## Bước 3: Chạy đồng bộ Categories
```bash
# Cách 1: Sử dụng script wrapper (khuyến nghị)
node run-category-sync.js

# Cách 2: Chạy trực tiếp
node sync-categories.js
```

## Bước 4: Kiểm tra kết quả
1. Vào Supabase Dashboard > Table Editor > categories
2. Kiểm tra xem có 17 categories được tạo không
3. Restart React app
4. Vào trang Categories để xem danh mục mới

## Cấu trúc dữ liệu được đồng bộ
Mỗi category sẽ có:
- `id`: Unique identifier
- `name`: Tên danh mục
- `description`: Mô tả
- `image`: URL hình ảnh
- `slug`: URL-friendly name
- `icon`: Emoji icon
- `letter`: Chữ cái đầu
- `subcategories`: JSON array các danh mục con
- `product_count`: Số lượng sản phẩm (tự động cập nhật)

## Troubleshooting

### Lỗi "Missing Supabase environment variables"
- Kiểm tra file `.env` có đúng format không
- Đảm bảo REACT_APP_SUPABASE_URL và REACT_APP_SUPABASE_ANON_KEY được set

### Lỗi "Error fetching existing categories"
- Kiểm tra kết nối internet
- Kiểm tra Supabase URL và Key có đúng không
- Đảm bảo bảng categories đã được tạo trong database

### Lỗi "Error inserting categories"
- Kiểm tra quyền RLS (Row Level Security) trong Supabase
- Đảm bảo bảng categories có đủ columns cần thiết

## Sau khi đồng bộ thành công
1. **Frontend sẽ tự động sử dụng database categories** thay vì local data
2. **Admin panel** sẽ hiển thị categories từ database
3. **Product counts** sẽ được cập nhật tự động dựa trên sản phẩm thực tế
4. **Categories page** sẽ load nhanh hơn với dữ liệu từ database

## Backup và Restore
- Script sẽ tự động backup categories cũ trước khi insert
- Nếu cần restore, có thể chạy lại script
- Dữ liệu local vẫn được giữ làm fallback

## Cập nhật Categories
Để thêm/sửa/xóa categories:
1. Sử dụng Admin Panel trong React app
2. Hoặc edit trực tiếp trong Supabase Dashboard
3. Hoặc cập nhật file `src/data/categories.ts` và chạy lại sync script
