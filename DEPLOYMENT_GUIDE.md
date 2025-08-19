# 🚀 HƯỚNG DẪN DEPLOY WEBSITE LÊN TÊN MIỀN

## 📋 Chuẩn bị trước khi deploy

✅ **Build đã hoàn thành** - Thư mục `build` đã được tạo
✅ **Tên miền đã sẵn sàng** - Bạn có quyền truy cập DNS settings

---

## ⭐ PHƯƠNG PHÁP 1: NETLIFY (KHUYÊN DÙNG)

### 🎯 Ưu điểm:
- **Miễn phí** cho personal projects
- **Automatic HTTPS** 
- **Global CDN**
- **Easy custom domain setup**

### 📝 Cách 1: Sử dụng Netlify CLI

```bash
# 1. Cài đặt Netlify CLI
npm install -g netlify-cli

# 2. Đăng nhập Netlify
netlify login

# 3. Deploy website
netlify deploy --prod --dir=build

# 4. Theo dõi hướng dẫn để setup custom domain
```

### 📝 Cách 2: Sử dụng Netlify Dashboard (Dễ hơn)

1. **Vào [netlify.com](https://netlify.com)** → Đăng ký/Đăng nhập
2. **Drag & Drop Deploy:**
   - Kéo thả thư mục `build` vào trang chính
   - Đợi deploy hoàn thành
3. **Setup Custom Domain:**
   - **Site settings** → **Domain management** 
   - **Add custom domain** → Nhập tên miền của bạn
   - **Configure DNS** theo hướng dẫn:
     ```
     Type: CNAME
     Name: www (hoặc @)
     Value: yoursite.netlify.app
     ```

---

## ⭐ PHƯƠNG PHÁP 2: VERCEL

### 🎯 Ưu điểm:
- **Tối ưu cho React**
- **Edge Functions**
- **Automatic deployments**

### 📝 Cách deploy:

```bash
# 1. Cài đặt Vercel CLI
npm install -g vercel

# 2. Deploy
vercel --prod

# 3. Setup domain trong dashboard
```

**Hoặc qua Vercel Dashboard:**
1. **[vercel.com](https://vercel.com)** → Import project
2. **Connect GitHub** (nếu code ở GitHub)
3. **Settings** → **Domains** → Add domain

---

## ⭐ PHƯƠNG PHÁP 3: GITHUB PAGES

### 📝 Setup và Deploy:

```bash
# 1. Deploy lên GitHub Pages
npm run deploy

# 2. Trong GitHub repo settings:
# Pages → Source: Deploy from branch → gh-pages

# 3. Custom domain:
# Pages → Custom domain → Nhập domain của bạn
```

---

## ⭐ PHƯƠNG PHÁP 4: HOSTING TRUYỀN THỐNG

### 📝 Với hosting như HostGator, GoDaddy, etc:

1. **Upload files:**
   ```bash
   # Zip thư mục build
   zip -r website.zip build/*
   
   # Upload lên hosting qua cPanel File Manager
   # Hoặc FTP client
   ```

2. **Extract tại thư mục public_html:**
   - Upload `website.zip` vào `public_html`
   - Extract tất cả files từ `build` folder
   - Đảm bảo `index.html` ở root

---

## 🔧 CẤU HÌNH DNS CHO TÊN MIỀN

### Với hầu hết hosting providers:

```dns
# Nếu deploy trên subdomain (www.yourdomain.com)
Type: CNAME
Name: www
Value: yourapp.netlify.app (hoặc deployment URL)

# Nếu deploy trên root domain (yourdomain.com)
Type: A
Name: @
Value: IP address của service
```

### Netlify DNS Records:
```dns
CNAME www yoursite.netlify.app
A @ 75.2.60.5
```

---

## 📱 KIỂM TRA SAU KHI DEPLOY

### ✅ Checklist:
- [ ] Website load được trên tên miền
- [ ] HTTPS hoạt động (https://yourdomain.com)
- [ ] Mobile responsive
- [ ] All pages accessible
- [ ] Search functionality works
- [ ] Hamburger menu works
- [ ] Admin panel accessible (nếu có)

### 🔍 Debug common issues:
```bash
# Kiểm tra DNS propagation
nslookup yourdomain.com

# Test HTTPS
curl -I https://yourdomain.com
```

---

## 🎉 HOÀN THÀNH!

Sau khi deploy thành công, website của bạn sẽ có:

🌐 **Live trên tên miền**: https://yourdomain.com
📱 **Mobile-friendly** với hamburger menu
🔍 **Search functionality** đầy đủ
🛒 **E-commerce features** hoàn chỉnh
⚡ **Fast loading** với CDN
🔒 **HTTPS security** automatic

---

## 📞 SUPPORT

Nếu gặp vấn đề, kiểm tra:
1. **DNS propagation** (có thể mất 24-48h)
2. **Build errors** trong deployment logs
3. **Path configurations** trong React Router
4. **HTTPS redirects** settings

**Netlify Support**: https://docs.netlify.com
**Vercel Support**: https://vercel.com/docs
