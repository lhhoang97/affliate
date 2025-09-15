# 🛒 HƯỚNG DẪN IMPORT AMAZON API VÀO WEB

## 📋 **BƯỚC 1: KIỂM TRA AMAZON API CREDENTIALS**

### **1.1 Kiểm tra .env file:**
```bash
# Mở file .env và kiểm tra:
REACT_APP_AMAZON_ACCESS_KEY=AKPAM77J6G1757734127
REACT_APP_AMAZON_SECRET_KEY=qD/kSEWDZFPWlT0dUZLE4EBWnKI5fi4iKNvljjYH
REACT_APP_AMAZON_ASSOCIATE_TAG=yourstore-20
```

### **1.2 Test kết nối Amazon API:**
```bash
node test-amazon-connection.js
```

## 📋 **BƯỚC 2: TRUY CẬP ADMIN AMAZON PAGE**

### **2.1 Đăng nhập Admin:**
1. Mở browser: `http://localhost:3000/admin`
2. Đăng nhập với tài khoản admin
3. Vào menu "Amazon Products"

### **2.2 Giao diện Admin Amazon:**
- **Search Products**: Tìm kiếm sản phẩm Amazon
- **Import Products**: Import sản phẩm vào database
- **Manage Products**: Quản lý sản phẩm đã import

## 📋 **BƯỚC 3: IMPORT SẢN PHẨM AMAZON**

### **3.1 Tìm kiếm sản phẩm:**
1. Nhập từ khóa tìm kiếm (ví dụ: "iPhone 15")
2. Chọn category (Electronics, Books, etc.)
3. Click "Search Products"
4. Xem danh sách sản phẩm Amazon

### **3.2 Import sản phẩm:**
1. Chọn sản phẩm muốn import
2. Click "Import Selected Products"
3. Sản phẩm sẽ được thêm vào `affiliate_products` table
4. Tự động tạo affiliate link với Associate Tag

### **3.3 Bulk Import:**
1. Chọn nhiều sản phẩm cùng lúc
2. Click "Bulk Import"
3. Tất cả sản phẩm sẽ được import hàng loạt

## 📋 **BƯỚC 4: QUẢN LÝ SẢN PHẨM ĐÃ IMPORT**

### **4.1 Xem danh sách sản phẩm:**
- **Product Name**: Tên sản phẩm Amazon
- **Price**: Giá hiện tại
- **Rating**: Đánh giá sao
- **Reviews**: Số lượng review
- **Affiliate Link**: Link affiliate tự động
- **Last Updated**: Lần cập nhật cuối

### **4.2 Cập nhật sản phẩm:**
1. Click "Refresh Price" để cập nhật giá
2. Click "Update Product" để chỉnh sửa
3. Click "Delete" để xóa sản phẩm

## 📋 **BƯỚC 5: HIỂN THỊ SẢN PHẨM TRÊN WEBSITE**

### **5.1 Sản phẩm tự động hiển thị:**
- **Homepage**: Sản phẩm Amazon xuất hiện trong carousel
- **Products Page**: Có thể filter theo category
- **Product Detail**: Hiển thị thông tin chi tiết Amazon

### **5.2 Affiliate Links:**
- Tự động tạo link với Associate Tag
- Track clicks và conversions
- Tính commission tự động

## 📋 **BƯỚC 6: TEST TÍNH NĂNG**

### **6.1 Test Import:**
```bash
# Test import sản phẩm
node test-amazon-import.js
```

### **6.2 Test Affiliate Links:**
1. Click vào sản phẩm Amazon trên website
2. Kiểm tra link có chứa Associate Tag
3. Test click tracking

## 📋 **BƯỚC 7: MONITORING VÀ ANALYTICS**

### **7.1 Xem thống kê:**
- **Total Products**: Tổng số sản phẩm đã import
- **Total Clicks**: Tổng số clicks
- **Total Conversions**: Tổng số conversions
- **Total Revenue**: Tổng doanh thu

### **7.2 Admin Dashboard:**
- Vào `/admin/dashboard` để xem tổng quan
- Xem biểu đồ thống kê
- Export báo cáo

## 🚀 **QUICK START - IMPORT NGAY:**

### **Cách 1: Import qua Admin Panel (Khuyến nghị)**
1. Mở `http://localhost:3000/admin/amazon`
2. Search "iPhone 15"
3. Chọn sản phẩm
4. Click "Import Selected Products"
5. Xong! Sản phẩm đã có trên website

### **Cách 2: Import bằng Script**
```bash
# Import sản phẩm tự động
node quick-import-amazon.js
```

## ⚠️ **LƯU Ý QUAN TRỌNG:**

1. **Rate Limits**: Amazon API có giới hạn request
2. **Associate Tag**: Phải đúng tag của bạn
3. **Product Updates**: Giá sản phẩm thay đổi thường xuyên
4. **Compliance**: Tuân thủ quy định Amazon

## 🎯 **KẾT QUẢ MONG ĐỢI:**

- ✅ Sản phẩm Amazon hiển thị trên website
- ✅ Affiliate links tự động tạo
- ✅ Click tracking hoạt động
- ✅ Commission được tính
- ✅ Admin quản lý dễ dàng

**Bắt đầu import ngay bây giờ! 🚀**
