# Hướng dẫn thêm sản phẩm mới vào website

## Cách 1: Sử dụng trang Admin (Khuyến nghị)

### Bước 1: Truy cập trang Admin
1. Mở website: `http://localhost:8080`
2. Click vào "Admin" trong navigation bar
3. Hoặc truy cập trực tiếp: `http://localhost:8080/admin`

### Bước 2: Thêm sản phẩm mới
1. Click nút "Thêm mới" (màu xanh)
2. Điền thông tin sản phẩm:
   - **Tên sản phẩm** (bắt buộc)
   - **Thương hiệu** (bắt buộc)
   - **Mô tả** (bắt buộc)
   - **Giá** (bắt buộc)
   - **Giá gốc** (tùy chọn - để hiển thị giảm giá)
   - **Danh mục** (bắt buộc)
   - **URL hình ảnh chính** (bắt buộc)
   - **Đánh giá** (0-5 sao)
   - **Số review**
   - **Trạng thái** (có sẵn/hết hàng)
   - **Tính năng** (có thể thêm nhiều)

### Bước 3: Lưu sản phẩm
1. Click "Thêm mới" để lưu
2. Sản phẩm sẽ xuất hiện trong danh sách
3. Có thể chỉnh sửa hoặc xóa sau này

## Cách 2: Thêm trực tiếp vào code

### Bước 1: Mở file `src/utils/mockData.ts`

### Bước 2: Thêm sản phẩm mới vào mảng `mockProducts`

```typescript
{
  id: '10', // ID duy nhất
  name: 'Tên sản phẩm',
  description: 'Mô tả chi tiết sản phẩm',
  price: 299, // Giá hiện tại
  originalPrice: 399, // Giá gốc (tùy chọn)
  image: 'https://images.unsplash.com/photo-xxx?w=400', // URL hình ảnh chính
  rating: 4.5, // Đánh giá (0-5)
  reviewCount: 123, // Số lượng review
  category: 'Electronics', // Danh mục (phải khớp với categories có sẵn)
  brand: 'Thương hiệu',
  inStock: true, // Có sẵn hàng
  features: [
    'Tính năng 1',
    'Tính năng 2',
    'Tính năng 3'
  ],
  specifications: {
    'Thông số 1': 'Giá trị 1',
    'Thông số 2': 'Giá trị 2'
  },
  images: [
    'https://images.unsplash.com/photo-xxx?w=400',
    'https://images.unsplash.com/photo-xxx?w=400',
    'https://images.unsplash.com/photo-xxx?w=400'
  ],
  tags: ['tag1', 'tag2', 'tag3'],
  createdAt: '2024-01-25T10:00:00Z',
  updatedAt: '2024-01-25T10:00:00Z'
}
```

### Bước 3: Lưu file và restart server
```bash
npm start
```

## Danh mục có sẵn

Bạn có thể sử dụng các danh mục sau:
- **Electronics**: Điện tử
- **Fashion**: Thời trang
- **Home & Garden**: Nhà cửa
- **Sports**: Thể thao
- **Books**: Sách
- **Beauty**: Làm đẹp
- **Toys & Games**: Đồ chơi
- **Automotive**: Ô tô

## Nguồn hình ảnh

Bạn có thể sử dụng:
1. **Unsplash**: `https://images.unsplash.com/photo-xxx?w=400`
2. **Pexels**: `https://images.pexels.com/photos/xxx/400`
3. **Local images**: Lưu trong thư mục `public/images/`

## Ví dụ sản phẩm hoàn chỉnh

```typescript
{
  id: '11',
  name: 'Nike Air Jordan 1',
  description: 'Classic basketball sneakers with premium leather construction and iconic design.',
  price: 170,
  originalPrice: 200,
  image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
  rating: 4.8,
  reviewCount: 892,
  category: 'Fashion',
  brand: 'Nike',
  inStock: true,
  features: [
    'Premium leather upper',
    'Air-Sole unit',
    'Rubber outsole',
    'Classic design',
    'Comfortable fit'
  ],
  specifications: {
    'Material': 'Leather',
    'Sole': 'Rubber',
    'Closure': 'Lace-up',
    'Style': 'Basketball',
    'Weight': '400g'
  },
  images: [
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400'
  ],
  tags: ['sneakers', 'basketball', 'nike', 'jordan'],
  createdAt: '2024-01-25T10:00:00Z',
  updatedAt: '2024-01-25T10:00:00Z'
}
```

## Lưu ý quan trọng

1. **ID phải duy nhất**: Không được trùng với sản phẩm khác
2. **Category phải chính xác**: Phải khớp với danh mục có sẵn
3. **Hình ảnh**: Sử dụng URL hợp lệ và có thể truy cập
4. **Giá**: Sử dụng số nguyên (không có dấu phẩy)
5. **Rating**: Từ 0 đến 5 (có thể có số thập phân)

## Troubleshooting

### Sản phẩm không hiển thị
- Kiểm tra category có đúng không
- Kiểm tra syntax JSON
- Restart development server

### Hình ảnh không load
- Kiểm tra URL hình ảnh có hợp lệ không
- Thử mở URL trong trình duyệt
- Sử dụng hình ảnh từ Unsplash hoặc Pexels

### Lỗi TypeScript
- Kiểm tra tất cả các trường bắt buộc
- Đảm bảo kiểu dữ liệu đúng
- Kiểm tra dấu phẩy và ngoặc

## Tính năng nâng cao

### Thêm sản phẩm với nhiều hình ảnh
```typescript
images: [
  'https://images.unsplash.com/photo-xxx?w=400', // Hình chính
  'https://images.unsplash.com/photo-yyy?w=400', // Hình phụ 1
  'https://images.unsplash.com/photo-zzz?w=400'  // Hình phụ 2
]
```

### Thêm sản phẩm giảm giá
```typescript
price: 150,        // Giá hiện tại
originalPrice: 200 // Giá gốc (sẽ hiển thị giảm giá)
```

### Thêm sản phẩm hết hàng
```typescript
inStock: false // Sẽ hiển thị "Hết hàng"
```

## Commit và Push

Sau khi thêm sản phẩm, đừng quên commit và push lên GitHub:

```bash
git add .
git commit -m "Add new product: [Tên sản phẩm]"
git push origin main
```
