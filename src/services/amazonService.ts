import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL!,
  process.env.REACT_APP_SUPABASE_ANON_KEY!
);

export interface AmazonProduct {
  asin: string;
  title: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  description: string;
  brand: string;
  category: string;
  rating: number;
  reviewCount: number;
  availability: string;
  features: string[];
  specifications: Record<string, string>;
}

export interface AmazonSearchResult {
  products: AmazonProduct[];
  totalResults: number;
  page: number;
}

class AmazonService {
  private accessKey: string;
  private secretKey: string;
  private associateTag: string;
  private endpoint: string = 'webservices.amazon.com';
  private region: string = 'us-east-1';

  constructor() {
    this.accessKey = process.env.REACT_APP_AMAZON_ACCESS_KEY || '';
    this.secretKey = process.env.REACT_APP_AMAZON_SECRET_KEY || '';
    this.associateTag = process.env.REACT_APP_AMAZON_ASSOCIATE_TAG || '';
  }

  // Search products by keywords
  async searchProducts(keywords: string, page: number = 1): Promise<AmazonSearchResult> {
    try {
      // For now, return mock data since we need to implement AWS signature
      // In production, this would make actual API calls to Amazon PA-API 5.0
      
      const mockProducts: AmazonProduct[] = [
        {
          asin: 'B08N5WRWNW',
          title: 'Samsung Galaxy S21 5G',
          price: 799.99,
          originalPrice: 899.99,
          imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400',
          description: 'Premium Android smartphone with 5G capability',
          brand: 'Samsung',
          category: 'Electronics > Cell Phones & Accessories',
          rating: 4.6,
          reviewCount: 1892,
          availability: 'In Stock',
          features: ['5G capability', 'Triple camera', 'Wireless charging'],
          specifications: {
            'Screen Size': '6.2 inches',
            'Storage': '128GB',
            'Color': 'Phantom Gray'
          }
        },
        {
          asin: 'B08N5WRWNW',
          title: 'iPhone 15 Pro',
          price: 999.99,
          originalPrice: 1099.99,
          imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
          description: 'Latest iPhone with titanium design and A17 Pro chip',
          brand: 'Apple',
          category: 'Electronics > Cell Phones & Accessories',
          rating: 4.8,
          reviewCount: 2156,
          availability: 'In Stock',
          features: ['Titanium design', 'A17 Pro chip', 'USB-C'],
          specifications: {
            'Screen Size': '6.1 inches',
            'Storage': '128GB',
            'Color': 'Natural Titanium'
          }
        }
      ];

      return {
        products: mockProducts,
        totalResults: mockProducts.length,
        page
      };
    } catch (error) {
      console.error('Error searching Amazon products:', error);
      return {
        products: [],
        totalResults: 0,
        page
      };
    }
  }

  // Get product details by ASIN
  async getProductByAsin(asin: string): Promise<AmazonProduct | null> {
    try {
      // Mock implementation - in production would call Amazon API
      const mockProduct: AmazonProduct = {
        asin,
        title: 'Sample Product',
        price: 99.99,
        imageUrl: 'https://via.placeholder.com/400',
        description: 'Sample product description',
        brand: 'Sample Brand',
        category: 'Electronics',
        rating: 4.5,
        reviewCount: 100,
        availability: 'In Stock',
        features: ['Feature 1', 'Feature 2'],
        specifications: {
          'Spec 1': 'Value 1',
          'Spec 2': 'Value 2'
        }
      };

      return mockProduct;
    } catch (error) {
      console.error('Error getting Amazon product:', error);
      return null;
    }
  }

  // Import product to affiliate_products table
  async importProductToAffiliate(amazonProduct: AmazonProduct): Promise<boolean> {
    try {
      // Get Amazon retailer ID
      const { data: amazonRetailer } = await supabase
        .from('affiliate_retailers')
        .select('id')
        .eq('name', 'amazon')
        .single();

      const affiliateProduct = {
        title: amazonProduct.title,
        description: amazonProduct.description,
        price: amazonProduct.price,
        original_price: amazonProduct.originalPrice || amazonProduct.price,
        image_url: amazonProduct.imageUrl,
        affiliate_url: this.generateAffiliateLink(amazonProduct.asin),
        retailer_id: amazonRetailer?.id || null,
        category: amazonProduct.category,
        brand: amazonProduct.brand,
        availability: amazonProduct.availability,
        rating: amazonProduct.rating,
        review_count: amazonProduct.reviewCount,
        // Amazon-specific columns
        asin: amazonProduct.asin,
        amazon_price: amazonProduct.price,
        amazon_rating: amazonProduct.rating,
        amazon_reviews: amazonProduct.reviewCount,
        amazon_availability: amazonProduct.availability,
        amazon_image_url: amazonProduct.imageUrl,
        amazon_title: amazonProduct.title,
        amazon_brand: amazonProduct.brand,
        amazon_category: amazonProduct.category,
        amazon_feature_bullets: amazonProduct.features,
        amazon_prime_eligible: true,
        amazon_best_seller: false,
        amazon_choice: false,
        amazon_lightning_deal: false,
        amazon_last_updated: new Date().toISOString()
      };

      const { error } = await supabase
        .from('affiliate_products')
        .insert([affiliateProduct]);

      if (error) {
        console.error('Error importing product:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error importing product to affiliate:', error);
      return false;
    }
  }

  // Generate affiliate link
  private generateAffiliateLink(asin: string): string {
    return `https://amazon.com/dp/${asin}?tag=${this.associateTag}&linkCode=ur2&camp=2025&creative=9325`;
  }

  // Bulk import products
  async bulkImportProducts(keywords: string, maxProducts: number = 10): Promise<number> {
    try {
      const searchResult = await this.searchProducts(keywords);
      let importedCount = 0;

      for (const product of searchResult.products.slice(0, maxProducts)) {
        const success = await this.importProductToAffiliate(product);
        if (success) {
          importedCount++;
        }
      }

      return importedCount;
    } catch (error) {
      console.error('Error bulk importing products:', error);
      return 0;
    }
  }
}

export const amazonService = new AmazonService();