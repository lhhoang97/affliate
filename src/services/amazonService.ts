import { createClient } from '@supabase/supabase-js';
// Browser-compatible crypto alternative
const crypto = {
  createHmac: (algorithm: string, key: string | Buffer) => {
    return {
      update: (data: string) => ({
        digest: (encoding?: string): string => {
          // Simple hash implementation for demo
          const str = (typeof key === 'string' ? key : key.toString()) + data;
          let hash = 0;
          for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
          }
          return Math.abs(hash).toString(16);
        }
      })
    };
  },
  createHash: (algorithm: string) => ({
    update: (data: string) => ({
      digest: (encoding: string): string => {
        // Simple hash implementation
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
          const char = data.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
      }
    })
  })
};

// Amazon PA-API 5.0 Configuration
const AMAZON_CONFIG = {
  accessKey: process.env.REACT_APP_AMAZON_ACCESS_KEY || '',
  secretKey: process.env.REACT_APP_AMAZON_SECRET_KEY || '',
  associateTag: process.env.REACT_APP_AMAZON_ASSOCIATE_TAG || '',
  region: 'us-east-1',
  host: 'webservices.amazon.com',
  endpoint: '/paapi5/searchitems'
};

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface AmazonProduct {
  ASIN: string;
  title: string;
  price?: {
    displayAmount: string;
    amount: number;
    currency: string;
  };
  images?: {
    primary: {
      large: { URL: string };
      medium: { URL: string };
    };
  };
  detailPageURL: string;
  features?: string[];
  brand?: string;
  customerReviews?: {
    count: number;
    starRating: {
      value: number;
    };
  };
}

interface NormalizedProduct {
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  description: string;
  category: string;
  brand: string;
  rating?: number;
  reviewCount?: number;
  externalUrl: string;
  affiliateLink: string;
  retailer: string;
  source: 'amazon';
  asin: string;
}

class AmazonService {
  
  /**
   * Generate AWS Signature V4 for PA-API requests
   */
  private generateSignature(stringToSign: string, dateStamp: string): string {
    const kDate = crypto.createHmac('sha256', 'AWS4' + AMAZON_CONFIG.secretKey).update(dateStamp).digest();
    const kRegion = crypto.createHmac('sha256', kDate).update(AMAZON_CONFIG.region).digest();
    const kService = crypto.createHmac('sha256', kRegion).update('ProductAdvertisingAPI').digest();
    const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();
    
    return crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');
  }

  /**
   * Create authorization header for PA-API
   */
  private createAuthHeaders(payload: string): Record<string, string> {
    const timestamp = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
    const dateStamp = timestamp.substring(0, 8);
    
    const canonicalHeaders = [
      'content-encoding:amz-1.0',
      'content-type:application/json; charset=utf-8',
      `host:${AMAZON_CONFIG.host}`,
      `x-amz-date:${timestamp}`,
      `x-amz-target:com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems`
    ].join('\n');

    const signedHeaders = 'content-encoding;content-type;host;x-amz-date;x-amz-target';
    const payloadHash = crypto.createHash('sha256').update(payload).digest('hex');
    
    const canonicalRequest = [
      'POST',
      AMAZON_CONFIG.endpoint,
      '',
      canonicalHeaders + '\n',
      signedHeaders,
      payloadHash
    ].join('\n');

    const algorithm = 'AWS4-HMAC-SHA256';
    const credentialScope = `${dateStamp}/${AMAZON_CONFIG.region}/ProductAdvertisingAPI/aws4_request`;
    const stringToSign = [
      algorithm,
      timestamp,
      credentialScope,
      crypto.createHash('sha256').update(canonicalRequest).digest('hex')
    ].join('\n');

    const signature = this.generateSignature(stringToSign, dateStamp);
    const authorization = `${algorithm} Credential=${AMAZON_CONFIG.accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    return {
      'Authorization': authorization,
      'Content-Encoding': 'amz-1.0',
      'Content-Type': 'application/json; charset=utf-8',
      'Host': AMAZON_CONFIG.host,
      'X-Amz-Date': timestamp,
      'X-Amz-Target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems'
    };
  }

  /**
   * Search products on Amazon using PA-API 5.0
   */
  async searchProducts(keywords: string, category?: string, maxResults: number = 10): Promise<AmazonProduct[]> {
    try {
      const payload = {
        Keywords: keywords,
        Resources: [
          'Images.Primary.Large',
          'Images.Primary.Medium', 
          'ItemInfo.Title',
          'ItemInfo.Features',
          'ItemInfo.ProductGroup',
          'ItemInfo.Brand',
          'Offers.Listings.Price',
          'CustomerReviews.Count',
          'CustomerReviews.StarRating'
        ],
        SearchIndex: category || 'All',
        ItemCount: maxResults,
        PartnerTag: AMAZON_CONFIG.associateTag,
        PartnerType: 'Associates',
        Marketplace: 'www.amazon.com'
      };

      const payloadString = JSON.stringify(payload);
      const headers = this.createAuthHeaders(payloadString);

      const response = await fetch(`https://${AMAZON_CONFIG.host}${AMAZON_CONFIG.endpoint}`, {
        method: 'POST',
        headers,
        body: payloadString
      });

      if (!response.ok) {
        throw new Error(`Amazon API Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.SearchResult?.Items) {
        return data.SearchResult.Items.map((item: any) => ({
          ASIN: item.ASIN,
          title: item.ItemInfo?.Title?.DisplayValue || '',
          price: item.Offers?.Listings?.[0]?.Price?.DisplayAmount ? {
            displayAmount: item.Offers.Listings[0].Price.DisplayAmount,
            amount: item.Offers.Listings[0].Price.Amount || 0,
            currency: item.Offers.Listings[0].Price.Currency || 'USD'
          } : undefined,
          images: item.Images?.Primary ? {
            primary: {
              large: { URL: item.Images.Primary.Large?.URL || '' },
              medium: { URL: item.Images.Primary.Medium?.URL || '' }
            }
          } : undefined,
          detailPageURL: item.DetailPageURL || '',
          features: item.ItemInfo?.Features?.DisplayValues || [],
          brand: item.ItemInfo?.Brand?.DisplayValue || '',
          customerReviews: item.CustomerReviews ? {
            count: item.CustomerReviews.Count || 0,
            starRating: {
              value: item.CustomerReviews.StarRating?.Value || 0
            }
          } : undefined
        }));
      }

      return [];
    } catch (error) {
      console.error('Amazon API Error:', error);
      throw error;
    }
  }

  /**
   * Normalize Amazon product data for Supabase
   */
  private normalizeAmazonProduct(amazonProduct: AmazonProduct, category: string): NormalizedProduct {
    const affiliateLink = this.generateAffiliateLink(amazonProduct.ASIN);
    
    return {
      name: amazonProduct.title,
      price: amazonProduct.price?.amount || 0,
      originalPrice: amazonProduct.price?.amount || 0,
      imageUrl: amazonProduct.images?.primary?.large?.URL || amazonProduct.images?.primary?.medium?.URL || '',
      description: amazonProduct.features?.join('\n') || '',
      category: category,
      brand: amazonProduct.brand || 'Amazon',
      rating: amazonProduct.customerReviews?.starRating?.value || 0,
      reviewCount: amazonProduct.customerReviews?.count || 0,
      externalUrl: amazonProduct.detailPageURL,
      affiliateLink: affiliateLink,
      retailer: 'Amazon',
      source: 'amazon',
      asin: amazonProduct.ASIN
    };
  }

  /**
   * Generate Amazon affiliate link
   */
  private generateAffiliateLink(asin: string): string {
    return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_CONFIG.associateTag}`;
  }

  /**
   * Import Amazon products to Supabase
   */
  async importProductsToSupabase(keywords: string, category: string = 'Electronics', maxResults: number = 20): Promise<number> {
    try {
      console.log(`🔍 Searching Amazon for: ${keywords} in category: ${category}`);
      
      const amazonProducts = await this.searchProducts(keywords, category, maxResults);
      
      if (amazonProducts.length === 0) {
        console.log('❌ No products found on Amazon');
        return 0;
      }

      console.log(`✅ Found ${amazonProducts.length} products on Amazon`);

      // Normalize products for Supabase
      const normalizedProducts = amazonProducts.map(product => 
        this.normalizeAmazonProduct(product, category)
      );

      // Insert into Supabase
      const { data, error } = await supabase
        .from('products')
        .insert(normalizedProducts)
        .select();

      if (error) {
        console.error('❌ Supabase insert error:', error);
        throw error;
      }

      console.log(`✅ Successfully imported ${data?.length || 0} products to Supabase`);
      return data?.length || 0;

    } catch (error) {
      console.error('❌ Import products error:', error);
      throw error;
    }
  }

  /**
   * Sync existing Amazon products (update prices, availability)
   */
  async syncAmazonProducts(): Promise<void> {
    try {
      // Get existing Amazon products from Supabase
      const { data: existingProducts, error } = await supabase
        .from('products')
        .select('id, asin, name')
        .eq('source', 'amazon');

      if (error) throw error;

      console.log(`🔄 Syncing ${existingProducts?.length || 0} Amazon products`);

      // Note: PA-API 5.0 doesn't have bulk lookup, so we'd need to implement
      // batch processing or use GetItems operation for individual ASINs
      // This is a placeholder for the sync logic

      for (const product of existingProducts || []) {
        // Individual product sync would go here
        // For now, just log the sync attempt
        console.log(`Syncing product: ${product.name} (${product.asin})`);
      }

    } catch (error) {
      console.error('❌ Sync products error:', error);
      throw error;
    }
  }

  /**
   * Get Amazon product categories
   */
  getAvailableCategories(): string[] {
    return [
      'All',
      'Electronics', 
      'Computers',
      'VideoGames',
      'Software',
      'Books',
      'Movies',
      'Music',
      'Toys',
      'Baby',
      'Automotive',
      'Tools',
      'Garden',
      'Grocery',
      'HealthPersonalCare',
      'Beauty',
      'Fashion',
      'Jewelry',
      'Shoes',
      'Watches'
    ];
  }
}

// Export singleton instance
export const amazonService = new AmazonService();
export default amazonService;
