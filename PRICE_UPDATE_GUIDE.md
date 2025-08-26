# 🚀 Hướng dẫn Cập nhật Giá Tự động từ Affiliate Links

## 📋 **Tổng quan**

Hệ thống tự động cập nhật giá cho phép bạn:
- ✅ Tự động lấy giá mới từ trang affiliate gốc
- ✅ Cập nhật giá theo lịch trình (1h, 3h, 6h, 12h, 24h)
- ✅ Hỗ trợ nhiều website: Shopee, Tiki, Lazada, Amazon
- ✅ Cập nhật thủ công từng sản phẩm hoặc tất cả
- ✅ Theo dõi lịch sử cập nhật và kết quả

## 🎯 **Cách sử dụng**

### **Bước 1: Truy cập trang Price Updates**
1. Đăng nhập vào Admin Panel
2. Click menu **"Price Updates"** trong sidebar
3. Hoặc truy cập trực tiếp: `/admin/price-updates`

### **Bước 2: Cài đặt Cập nhật Tự động**

#### 2.1 Bật/Tắt cập nhật tự động
- Toggle switch **"Bật cập nhật giá tự động"**
- Chọn **"Chu kỳ cập nhật"** (1h, 3h, 6h, 12h, 24h)
- Hệ thống sẽ tự động chạy theo lịch trình

#### 2.2 Theo dõi lịch trình
- **Lần cập nhật cuối:** Thời gian chạy gần nhất
- **Lần cập nhật tiếp theo:** Thời gian chạy tiếp theo

### **Bước 3: Cập nhật Thủ công**

#### 3.1 Cập nhật tất cả sản phẩm
- Click nút **"Cập nhật tất cả"**
- Hệ thống sẽ cập nhật tất cả sản phẩm có external URL
- Xem kết quả trong phần "Kết quả Cập nhật"

#### 3.2 Cập nhật từng sản phẩm
- Trong bảng sản phẩm, click nút **"Cập nhật"** (icon Update)
- Chỉ hiển thị cho sản phẩm có external URL được hỗ trợ

### **Bước 4: Cập nhật từ trang Products**
- Vào **"Product Management"**
- Tìm sản phẩm có external URL
- Click nút **"Update"** (icon mũi tên) trong cột Actions

## 🌐 **Website được hỗ trợ**

### ✅ **Đã hỗ trợ:**
- **shopee.vn** - Shopee Vietnam
- **tiki.vn** - Tiki Vietnam  
- **lazada.vn** - Lazada Vietnam
- **amazon.com** - Amazon US

### ❌ **Chưa hỗ trợ:**
- Các website khác (cần thêm cấu hình)

## 📊 **Theo dõi Kết quả**

### **Thông tin hiển thị:**
- ✅ **Thành công:** Số sản phẩm cập nhật thành công
- ❌ **Thất bại:** Số sản phẩm lỗi và lý do
- 📈 **Thay đổi giá:** Giá cũ → Giá mới
- ⏰ **Thời gian:** Lần cập nhật cuối và tiếp theo

### **Trạng thái sản phẩm:**
- 🟢 **Hỗ trợ:** Có thể cập nhật tự động
- 🟡 **Không hỗ trợ:** Website chưa được cấu hình
- 🔴 **Không có URL:** Sản phẩm không có external URL

## ⚙️ **Cấu hình nâng cao**

### **Thêm website mới:**
1. Mở file `src/services/priceUpdateService.ts`
2. Thêm cấu hình vào `SUPPORTED_SITES`:
```typescript
'example.com': {
  priceSelector: '.price-selector',
  nameSelector: '.name-selector', 
  imageSelector: '.image-selector',
  inStockSelector: '.stock-selector'
}
```

### **Tùy chỉnh lịch trình:**
- Thay đổi chu kỳ cập nhật trong admin panel
- Hoặc chỉnh sửa trực tiếp trong localStorage

## 🔧 **Xử lý lỗi thường gặp**

### **Lỗi "Website chưa được hỗ trợ"**
- Kiểm tra domain trong external URL
- Liên hệ admin để thêm hỗ trợ website mới

### **Lỗi "Không thể truy cập trang web"**
- Kiểm tra kết nối internet
- Website có thể đang bảo trì
- Thử lại sau vài phút

### **Lỗi "Không tìm thấy thông tin giá"**
- Website đã thay đổi cấu trúc HTML
- Cần cập nhật selector trong code

### **Lỗi CORS**
- Hệ thống sử dụng proxy để tránh lỗi CORS
- Nếu vẫn lỗi, thử lại sau

## 📈 **Tối ưu hiệu suất**

### **Khuyến nghị:**
- ⏰ **Chu kỳ cập nhật:** 6-12 giờ (tránh spam)
- 🔄 **Cập nhật thủ công:** Khi cần giá mới ngay lập tức
- 📊 **Theo dõi:** Kiểm tra kết quả định kỳ

### **Lưu ý:**
- Hệ thống có delay 1 giây giữa các request
- Tránh cập nhật quá thường xuyên để không bị block
- Một số website có thể giới hạn request

## 🎯 **Ví dụ sử dụng**

### **Scenario 1: Cập nhật giá Shopee**
1. Thêm sản phẩm với external URL Shopee
2. Bật cập nhật tự động (6h/lần)
3. Hệ thống tự động cập nhật giá khi có thay đổi

### **Scenario 2: Cập nhật giá Tiki thủ công**
1. Vào trang Price Updates
2. Tìm sản phẩm Tiki trong danh sách
3. Click "Cập nhật" để lấy giá mới ngay lập tức

### **Scenario 3: Theo dõi nhiều website**
1. Có sản phẩm từ Shopee, Tiki, Lazada
2. Bật cập nhật tự động (12h/lần)
3. Hệ thống cập nhật tất cả cùng lúc

## 🔒 **Bảo mật**

- ✅ Chỉ admin mới có quyền truy cập
- ✅ Không lưu trữ thông tin nhạy cảm
- ✅ Sử dụng proxy an toàn
- ✅ Rate limiting để tránh spam

## 📞 **Hỗ trợ**

Nếu gặp vấn đề:
1. Kiểm tra console browser để xem lỗi
2. Thử cập nhật thủ công trước
3. Liên hệ admin để được hỗ trợ

---

**🎉 Chúc bạn sử dụng tính năng cập nhật giá hiệu quả!**

