import { Product } from '../types';
import { updateProduct, fetchProducts } from './productService';

// Interface cho price update job
export interface PriceUpdateJob {
  id: string;
  productId: string;
  externalUrl: string;
  lastUpdate: Date;
  nextUpdate: Date;
  status: 'pending' | 'running' | 'completed' | 'failed';
  error?: string;
}

// Các website được hỗ trợ
export const SUPPORTED_SITES = {
  'shopee.vn': {
    priceSelector: '[data-sqe="link"] ._1w9jLI._1w9jLI',
    nameSelector: '.ie3A\+n.bM\+7UW.Cve6sh',
    imageSelector: '.qJTAj9._1w9jLI._1w9jLI img',
    inStockSelector: '.product-not-available'
  },
  'tiki.vn': {
    priceSelector: '.final-price',
    nameSelector: '.title h1',
    imageSelector: '.product-image img',
    inStockSelector: '.product-not-available'
  },
  'lazada.vn': {
    priceSelector: '.pdp-price_type_normal',
    nameSelector: '.pdp-mod-product-badge-title',
    imageSelector: '.gallery-preview-panel__image img',
    inStockSelector: '.pdp-mod-product-badge-title'
  },
  'amazon.com': {
    priceSelector: '.a-price-whole',
    nameSelector: '#productTitle',
    imageSelector: '#landingImage',
    inStockSelector: '#availability'
  }
};

// Hàm lấy domain từ URL
function getDomain(url: string): string {
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    return domain;
  } catch {
    return '';
  }
}

// Hàm parse giá từ text
function parsePrice(priceText: string): number {
  if (!priceText) return 0;
  
  // Loại bỏ các ký tự không phải số và dấu chấm
  const cleanPrice = priceText.replace(/[^\d.,]/g, '');
  
  // Xử lý các format khác nhau
  if (cleanPrice.includes(',')) {
    // Format: 1,234,567
    return parseFloat(cleanPrice.replace(/,/g, ''));
  } else if (cleanPrice.includes('.')) {
    // Format: 1.234.567 hoặc 1234.56
    const parts = cleanPrice.split('.');
    if (parts.length === 3) {
      // Format: 1.234.567
      return parseFloat(parts.join(''));
    } else {
      // Format: 1234.56
      return parseFloat(cleanPrice);
    }
  }
  
  return parseFloat(cleanPrice) || 0;
}

// Hàm kiểm tra sản phẩm còn hàng
function checkInStock(document: Document, siteConfig: any): boolean {
  if (!siteConfig.inStockSelector) return true;
  
  const stockElement = document.querySelector(siteConfig.inStockSelector);
  if (!stockElement) return true;
  
  const stockText = stockElement.textContent?.toLowerCase() || '';
  return !stockText.includes('hết hàng') && 
         !stockText.includes('out of stock') && 
         !stockText.includes('unavailable');
}

// Hàm scrape thông tin sản phẩm từ URL
export async function scrapeProductInfo(externalUrl: string): Promise<{
  price: number;
  originalPrice?: number;
  name?: string;
  image?: string;
  inStock: boolean;
}> {
  try {
    // Kiểm tra domain được hỗ trợ
    const domain = getDomain(externalUrl);
    const siteConfig = SUPPORTED_SITES[domain as keyof typeof SUPPORTED_SITES];
    
    if (!siteConfig) {
      throw new Error(`Website ${domain} chưa được hỗ trợ. Vui lòng liên hệ admin để thêm hỗ trợ.`);
    }

    // Sử dụng proxy CORS để tránh lỗi CORS
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(externalUrl)}`;
    
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      throw new Error('Không thể truy cập trang web');
    }
    
    const data = await response.json();
    const html = data.contents;
    
    // Parse HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Lấy giá
    const priceElement = doc.querySelector(siteConfig.priceSelector);
    if (!priceElement) {
      throw new Error('Không tìm thấy thông tin giá');
    }
    
    const priceText = priceElement.textContent?.trim() || '';
    const price = parsePrice(priceText);
    
    if (price === 0) {
      throw new Error('Không thể parse giá từ trang web');
    }
    
    // Lấy giá gốc (nếu có)
    let originalPrice: number | undefined;
    const originalPriceElement = doc.querySelector(siteConfig.priceSelector + ' del, .original-price, .list-price');
    if (originalPriceElement) {
      const originalPriceText = originalPriceElement.textContent?.trim() || '';
      originalPrice = parsePrice(originalPriceText);
    }
    
    // Lấy tên sản phẩm
    let name: string | undefined;
    const nameElement = doc.querySelector(siteConfig.nameSelector);
    if (nameElement) {
      name = nameElement.textContent?.trim();
    }
    
    // Lấy hình ảnh
    let image: string | undefined;
    const imageElement = doc.querySelector(siteConfig.imageSelector) as HTMLImageElement;
    if (imageElement && imageElement.src) {
      image = imageElement.src;
    }
    
    // Kiểm tra còn hàng
    const inStock = checkInStock(doc, siteConfig);
    
    return {
      price,
      originalPrice: originalPrice && originalPrice > price ? originalPrice : undefined,
      name,
      image,
      inStock
    };
    
  } catch (error) {
    console.error('Error scraping product info:', error);
    throw error;
  }
}

// Hàm cập nhật giá cho một sản phẩm
export async function updateProductPrice(productId: string): Promise<{
  success: boolean;
  oldPrice: number;
  newPrice: number;
  message: string;
}> {
  try {
    // Lấy thông tin sản phẩm
    const products = await fetchProducts();
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      throw new Error('Không tìm thấy sản phẩm');
    }
    
    if (!product.externalUrl) {
      throw new Error('Sản phẩm không có external URL');
    }
    
    const oldPrice = product.price;
    
    // Scrape thông tin mới
    const scrapedInfo = await scrapeProductInfo(product.externalUrl);
    
    // Cập nhật sản phẩm
    const updateData: Partial<Product> = {
      price: scrapedInfo.price,
      inStock: scrapedInfo.inStock
    };
    
    if (scrapedInfo.originalPrice) {
      updateData.originalPrice = scrapedInfo.originalPrice;
    }
    
    if (scrapedInfo.name && scrapedInfo.name !== product.name) {
      updateData.name = scrapedInfo.name;
    }
    
    if (scrapedInfo.image && scrapedInfo.image !== product.image) {
      updateData.image = scrapedInfo.image;
    }
    
    await updateProduct(productId, updateData);
    
    return {
      success: true,
      oldPrice,
      newPrice: scrapedInfo.price,
      message: `Cập nhật giá thành công: ${oldPrice.toLocaleString()} → ${scrapedInfo.price.toLocaleString()} VND`
    };
    
  } catch (error) {
    console.error('Error updating product price:', error);
    return {
      success: false,
      oldPrice: 0,
      newPrice: 0,
      message: error instanceof Error ? error.message : 'Lỗi không xác định'
    };
  }
}

// Hàm cập nhật giá cho tất cả sản phẩm có external URL
export async function updateAllProductPrices(): Promise<{
  total: number;
  success: number;
  failed: number;
  results: Array<{
    productId: string;
    productName: string;
    success: boolean;
    message: string;
  }>;
}> {
  try {
    const products = await fetchProducts();
    const productsWithExternalUrl = products.filter(p => p.externalUrl);
    
    const results = [];
    let success = 0;
    let failed = 0;
    
    for (const product of productsWithExternalUrl) {
      try {
        const result = await updateProductPrice(product.id);
        results.push({
          productId: product.id,
          productName: product.name,
          success: result.success,
          message: result.message
        });
        
        if (result.success) {
          success++;
        } else {
          failed++;
        }
        
        // Delay để tránh spam request
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        results.push({
          productId: product.id,
          productName: product.name,
          success: false,
          message: error instanceof Error ? error.message : 'Lỗi không xác định'
        });
        failed++;
      }
    }
    
    return {
      total: productsWithExternalUrl.length,
      success,
      failed,
      results
    };
    
  } catch (error) {
    console.error('Error updating all product prices:', error);
    throw error;
  }
}

// Hàm lên lịch cập nhật giá tự động
export function schedulePriceUpdates(intervalHours: number = 6): void {
  // Lưu lịch vào localStorage
  const schedule = {
    intervalHours,
    lastRun: new Date().toISOString(),
    nextRun: new Date(Date.now() + intervalHours * 60 * 60 * 1000).toISOString(),
    enabled: true
  };
  
  localStorage.setItem('priceUpdateSchedule', JSON.stringify(schedule));
  
  // Chạy ngay lập tức nếu chưa có lịch
  if (!localStorage.getItem('priceUpdateSchedule')) {
    updateAllProductPrices().catch(console.error);
  }
}

// Hàm kiểm tra và chạy cập nhật giá theo lịch
export async function checkAndRunScheduledUpdates(): Promise<void> {
  const scheduleData = localStorage.getItem('priceUpdateSchedule');
  if (!scheduleData) return;
  
  const schedule = JSON.parse(scheduleData);
  if (!schedule.enabled) return;
  
  const now = new Date();
  const nextRun = new Date(schedule.nextRun);
  
  if (now >= nextRun) {
    try {
      await updateAllProductPrices();
      
      // Cập nhật lịch cho lần tiếp theo
      schedule.lastRun = now.toISOString();
      schedule.nextRun = new Date(now.getTime() + schedule.intervalHours * 60 * 60 * 1000).toISOString();
      localStorage.setItem('priceUpdateSchedule', JSON.stringify(schedule));
      
    } catch (error) {
      console.error('Scheduled price update failed:', error);
    }
  }
}

// Khởi tạo kiểm tra lịch mỗi giờ
if (typeof window !== 'undefined') {
  setInterval(checkAndRunScheduledUpdates, 60 * 60 * 1000); // Kiểm tra mỗi giờ
}
