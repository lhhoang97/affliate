# 🎨 Homepage SlickDeals-Style Guide

## 📋 Tổng Quan

Homepage đã được cập nhật để giống giao diện SlickDeals với các section chính:
- **Just For You** - Deals được cá nhân hóa
- **Hot Deals** - Những ưu đãi nóng nhất
- **For You** - Deals được đề xuất
- **Popular Categories** - Danh mục phổ biến

## ✨ Các Section Mới

### 🔮 **Just For You Section**
- **Vị trí:** Ngay sau Hero section
- **Nội dung:** 3 sản phẩm có discount tốt nhất, được sắp xếp theo thời gian tạo
- **Đặc điểm:**
  - Badge "For You" màu tím
  - Hiển thị thông tin "Found by Cobalt_Blue_FF Yesterday 01:22 AM"
  - Discount badge màu đỏ
  - Interaction buttons (like, comment, share)
  - Hiển thị retailer info

### 🔥 **Hot Deals Section**
- **Vị trí:** Sau Just For You
- **Nội dung:** 6 sản phẩm có rating cao (≥4.5) và discount tốt
- **Đặc điểm:**
  - Badge "HOT DEAL" màu đỏ
  - Sắp xếp theo % discount giảm dần
  - Layout grid 3 cột
  - Hiển thị giá gốc và giá sale

### 🎯 **For You Section**
- **Vị trí:** Sau Hot Deals
- **Nội dung:** 4 sản phẩm có retailer info và rating tốt (≥4.0)
- **Đặc điểm:**
  - Badge "For You" màu tím
  - Layout grid 4 cột
  - Sắp xếp theo rating giảm dần
  - Compact design

### 📂 **Popular Categories Section**
- **Vị trí:** Cuối trang
- **Nội dung:** Danh mục sản phẩm với subcategories
- **Đặc điểm:**
  - Icon lửa (Whatshot)
  - Chip tags cho subcategories
  - Hover effects
  - Show more/less functionality

## 🎨 Design Elements

### **Color Scheme**
- **Primary Blue:** `#1a73e8` (Hero gradient)
- **Red:** `#dc2626` (Discount badges, Hot deals)
- **Purple:** `#8b5cf6` (For You badges)
- **Background:** `#f8f9fa` (Light gray)
- **Text:** `#1a1a1a` (Dark gray)

### **Typography**
- **Hero Title:** `h2` - 3rem (desktop), 2rem (mobile)
- **Section Headers:** `h5` - 600 weight
- **Product Titles:** `h6` - 600 weight
- **Prices:** `h6` - 700 weight, red color
- **Retailer:** `body2` - 500 weight, uppercase

### **Layout**
- **Container:** `maxWidth="lg"`
- **Grid System:** Responsive (xs: 1, sm: 2, md: 3-4, lg: 4)
- **Spacing:** `gap: 3` (24px)
- **Card Padding:** `p: 2` (16px)

## 🔧 Technical Features

### **Product Filtering Logic**
```typescript
// Hot Deals: High rating + good discount
const hotDealsList = products
  .filter(p => p.rating >= 4.5 && p.originalPrice && p.originalPrice > p.price)
  .sort((a, b) => {
    const aDiscount = ((a.originalPrice! - a.price) / a.originalPrice!) * 100;
    const bDiscount = ((b.originalPrice! - b.price) / b.originalPrice!) * 100;
    return bDiscount - aDiscount;
  })
  .slice(0, 6);

// For You: Retailer info + good rating
const forYouList = products
  .filter(p => p.retailer && p.rating >= 4.0)
  .sort((a, b) => b.rating - a.rating)
  .slice(0, 4);

// Just For You: Recent deals
const justForYouList = products
  .filter(p => p.originalPrice && p.originalPrice > p.price)
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 3);
```

### **Helper Functions**
```typescript
// Format time ago
const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

// Calculate discount percentage
const calculateDiscount = (originalPrice: number, currentPrice: number) => {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};
```

## 🎯 Interactive Elements

### **Product Cards**
- **Hover Effects:** `translateY(-2px)` + shadow
- **Click Navigation:** Navigate to product detail page
- **Badge Interactions:** Stop propagation for subcategory chips

### **Interaction Buttons**
- **Like:** ThumbUp icon + count
- **Comment:** ChatBubble icon + count  
- **Share:** Share icon
- **Add to Cart:** ShoppingCart icon (future)

### **Category Navigation**
- **Main Category:** Navigate to products page with category filter
- **Subcategory Chips:** Navigate to products page with subcategory filter
- **Hover Effects:** Color change on chip hover

## 📱 Responsive Design

### **Mobile (xs)**
- 1 column layout for all sections
- Smaller typography
- Reduced padding
- Touch-friendly buttons

### **Tablet (sm)**
- 2 columns for Hot Deals
- 2 columns for For You
- 2 columns for Categories

### **Desktop (md+)**
- 3-4 columns for all sections
- Full typography
- Hover effects
- Optimal spacing

## 🚀 Performance Optimizations

### **Image Loading**
- `objectFit: 'cover'` for consistent aspect ratios
- Lazy loading (future implementation)
- Optimized image sizes

### **State Management**
- Local state for categories and deals
- useEffect for data loading
- Event listeners for storage changes

### **Caching**
- Categories cached in localStorage
- Product data from Supabase/mock
- Efficient re-rendering

## 🎨 Customization Options

### **Colors**
```typescript
// Category colors can be customized
const getCategoryColor = (categoryName: string): string => {
  const colorMap: { [key: string]: string } = {
    'Electronics': '#2563eb',
    'Fashion': '#ec4899',
    'Home & Garden': '#059669',
    // ... more categories
  };
  return colorMap[categoryName] || '#6b7280';
};
```

### **Layout**
- Grid columns can be adjusted
- Spacing can be modified
- Card heights can be customized

### **Content**
- Number of items per section
- Filtering criteria
- Sorting algorithms

## 🔄 Future Enhancements

### **Planned Features**
- Real-time price updates
- User interaction tracking
- Personalized recommendations
- Advanced filtering
- Search functionality
- Wishlist integration

### **Performance Improvements**
- Virtual scrolling for large lists
- Image optimization
- Code splitting
- Service worker caching

---

**🎉 Homepage đã được cập nhật thành công với giao diện SlickDeals-style!**

Truy cập http://localhost:3000 để xem kết quả.


