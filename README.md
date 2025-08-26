# 🛍️ Affiliate Store - React + Supabase

Một website affiliate marketing hiện đại với giao diện SlickDeals-inspired, được xây dựng bằng React và Supabase.

## ✨ Tính Năng Chính

- 🎨 **Giao diện SlickDeals-inspired** với Material-UI
- 🏪 **Hiển thị nơi bán sản phẩm** (Retailer info)
- 🔄 **Cập nhật giá tự động** từ affiliate links
- 📱 **Responsive design** cho mobile và desktop
- 🔐 **Authentication** với Supabase Auth
- 🗄️ **Database** với Supabase PostgreSQL
- ⚡ **Real-time updates** (nếu cần)

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone <repository-url>
cd affiliate
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Supabase (Recommended)
```bash
# Làm theo hướng dẫn trong QUICK_SUPABASE_SETUP.md
npm run supabase:setup
```

### 4. Start Development Server
```bash
npm start
```

Truy cập: http://localhost:3000

## 📋 Available Scripts

### Development
- `npm start` - Chạy development server
- `npm test` - Chạy tests
- `npm run build` - Build cho production

### Supabase
- `npm run supabase:test` - Test kết nối Supabase
- `npm run supabase:migrate` - Migrate dữ liệu từ mock sang Supabase
- `npm run supabase:setup` - Hướng dẫn setup Supabase

### Deployment
- `npm run deploy` - Deploy lên GitHub Pages

## 🗄️ Database Schema

### Tables
- **products** - Thông tin sản phẩm
- **categories** - Danh mục sản phẩm
- **profiles** - Thông tin người dùng
- **reviews** - Đánh giá sản phẩm
- **orders** - Đơn hàng
- **order_items** - Chi tiết đơn hàng
- **wishlist** - Danh sách yêu thích

### Features
- ✅ Row Level Security (RLS)
- ✅ Auto-update timestamps
- ✅ Performance indexes
- ✅ Data validation

## 🎨 UI Components

### Pages
- **HomePage** - Trang chủ với hero section và categories
- **ProductsPage** - Danh sách sản phẩm với filtering
- **ProductDetailPage** - Chi tiết sản phẩm
- **AdminPanel** - Quản lý sản phẩm, categories, price updates

### Components
- **Header** - Navigation với search
- **ProductCard** - Card sản phẩm với retailer info
- **CategoryNavigation** - Menu danh mục
- **PriceUpdateService** - Cập nhật giá tự động

## 🔧 Configuration

### Environment Variables
Tạo file `.env`:
```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_anon_key
```

### Supabase Setup
1. Tạo project tại [supabase.com](https://supabase.com)
2. Chạy SQL script từ `SUPABASE_SETUP.sql`
3. Cấu hình environment variables
4. Test kết nối: `npm run supabase:test`
5. Migrate dữ liệu: `npm run supabase:migrate`

## 📊 Data Management

### Mock Data (Fallback)
- Sử dụng khi chưa cấu hình Supabase
- Lưu trong `src/utils/mockData.ts`
- Tự động fallback nếu Supabase lỗi

### Supabase (Production)
- Database thực với PostgreSQL
- Real-time capabilities
- Backup tự động
- Scalable và production-ready

## 🎯 Features

### Product Management
- ✅ CRUD operations
- ✅ Image upload
- ✅ Category management
- ✅ Price tracking
- ✅ Retailer information

### Price Updates
- ✅ Automatic price scraping
- ✅ Scheduled updates
- ✅ Manual updates
- ✅ Support for multiple sites (Shopee, Tiki, Lazada, Amazon)

### User Experience
- ✅ SlickDeals-inspired design
- ✅ Responsive layout
- ✅ Search and filtering
- ✅ Shopping cart
- ✅ Wishlist

## 🔒 Security

- Row Level Security (RLS) trên tất cả bảng
- Public read access cho products/categories
- Authenticated users có thể quản lý dữ liệu
- API keys được bảo vệ

## 🚀 Deployment

### Netlify
1. Connect repository
2. Build command: `npm run build`
3. Publish directory: `build`

### Vercel
1. Import repository
2. Framework preset: Create React App
3. Deploy

## 📝 Documentation

- [SUPABASE_SETUP_GUIDE.md](./SUPABASE_SETUP_GUIDE.md) - Hướng dẫn chi tiết setup Supabase
- [QUICK_SUPABASE_SETUP.md](./QUICK_SUPABASE_SETUP.md) - Hướng dẫn nhanh
- [RETAILER_FEATURE_GUIDE.md](./RETAILER_FEATURE_GUIDE.md) - Tính năng hiển thị nơi bán
- [PRICE_UPDATE_GUIDE.md](./PRICE_UPDATE_GUIDE.md) - Tính năng cập nhật giá

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - see LICENSE file for details

---

**🎉 Chúc mừng! Website affiliate store đã sẵn sàng!**
