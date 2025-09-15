import { supabase } from '../utils/supabaseClient';

export interface AffiliateProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number;
  image_url: string;
  retailer: string;
  asin: string;
  sku: string;
  affiliate_link: string;
  external_url: string;
  commission_rate: number;
  category: string;
  brand: string;
  rating: number;
  review_count: number;
  in_stock: boolean;
  availability_status: string;
  last_updated: string;
  created_at: string;
  updated_at: string;
}

export interface AffiliateRetailer {
  id: string;
  name: string;
  display_name: string;
  base_url: string;
  affiliate_tag: string;
  commission_rate: number;
  cookie_duration: number;
  is_active: boolean;
  icon_url: string;
  color_code: string;
  created_at: string;
  updated_at: string;
}

export interface AffiliateClick {
  id: string;
  product_id: string;
  retailer: string;
  user_ip: string;
  user_agent: string;
  referrer: string;
  clicked_at: string;
  converted: boolean;
  conversion_value: number;
  created_at: string;
}

class AffiliateService {
  // Affiliate Products
  async getAffiliateProducts(): Promise<AffiliateProduct[]> {
    try {
      const { data, error } = await supabase
        .from('affiliate_products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching affiliate products:', error);
      return [];
    }
  }

  async getAffiliateProductById(id: string): Promise<AffiliateProduct | null> {
    try {
      const { data, error } = await supabase
        .from('affiliate_products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching affiliate product:', error);
      return null;
    }
  }

  async createAffiliateProduct(product: Omit<AffiliateProduct, 'id' | 'created_at' | 'updated_at'>): Promise<AffiliateProduct | null> {
    try {
      const { data, error } = await supabase
        .from('affiliate_products')
        .insert([product])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating affiliate product:', error);
      return null;
    }
  }

  async updateAffiliateProduct(id: string, updates: Partial<AffiliateProduct>): Promise<AffiliateProduct | null> {
    try {
      const { data, error } = await supabase
        .from('affiliate_products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating affiliate product:', error);
      return null;
    }
  }

  async deleteAffiliateProduct(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('affiliate_products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting affiliate product:', error);
      return false;
    }
  }

  // Affiliate Retailers
  async getAffiliateRetailers(): Promise<AffiliateRetailer[]> {
    try {
      const { data, error } = await supabase
        .from('affiliate_retailers')
        .select('*')
        .eq('is_active', true)
        .order('display_name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching affiliate retailers:', error);
      return [];
    }
  }

  async getAffiliateRetailerByName(name: string): Promise<AffiliateRetailer | null> {
    try {
      const { data, error } = await supabase
        .from('affiliate_retailers')
        .select('*')
        .eq('name', name)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching affiliate retailer:', error);
      return null;
    }
  }

  // Affiliate Clicks Tracking
  async trackAffiliateClick(productId: string, retailer: string, metadata?: {
    user_ip?: string;
    user_agent?: string;
    referrer?: string;
  }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('affiliate_clicks')
        .insert([{
          product_id: productId,
          retailer,
          user_ip: metadata?.user_ip,
          user_agent: metadata?.user_agent,
          referrer: metadata?.referrer
        }]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error tracking affiliate click:', error);
      return false;
    }
  }

  async getAffiliateClicks(productId?: string, retailer?: string): Promise<AffiliateClick[]> {
    try {
      let query = supabase
        .from('affiliate_clicks')
        .select('*')
        .order('clicked_at', { ascending: false });

      if (productId) {
        query = query.eq('product_id', productId);
      }

      if (retailer) {
        query = query.eq('retailer', retailer);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching affiliate clicks:', error);
      return [];
    }
  }

  // Affiliate Link Generation
  generateAffiliateLink(retailer: string, productId: string, retailerConfig?: AffiliateRetailer): string {
    if (!retailerConfig) {
      // Fallback to basic URL
      return `https://${retailer}.com`;
    }

    const { base_url, affiliate_tag } = retailerConfig;

    switch (retailer) {
      case 'amazon':
        return `${base_url}/dp/${productId}?tag=${affiliate_tag}&linkCode=ur2&camp=2025&creative=9325`;
      
      case 'ebay':
        return `${base_url}/itm/${productId}?var=${affiliate_tag}`;
      
      case 'walmart':
        return `${base_url}/ip/${productId}?affiliate_id=${affiliate_tag}`;
      
      case 'target':
        return `${base_url}/p/${productId}?affiliate_id=${affiliate_tag}`;
      
      case 'bestbuy':
        return `${base_url}/site/${productId}?affiliate_id=${affiliate_tag}`;
      
      default:
        return `${base_url}?affiliate_id=${affiliate_tag}`;
    }
  }

  // Bulk Import from Amazon API (placeholder)
  async importFromAmazonAPI(products: any[]): Promise<AffiliateProduct[]> {
    try {
      // This would integrate with Amazon Product Advertising API
      // For now, return empty array
      console.log('Amazon API import not implemented yet');
      return [];
    } catch (error) {
      console.error('Error importing from Amazon API:', error);
      return [];
    }
  }

  // Analytics
  async getAffiliateAnalytics(startDate?: string, endDate?: string): Promise<{
    totalClicks: number;
    totalConversions: number;
    conversionRate: number;
    totalRevenue: number;
    topProducts: Array<{ product_id: string; clicks: number; conversions: number }>;
    topRetailers: Array<{ retailer: string; clicks: number; conversions: number }>;
  }> {
    try {
      // This would aggregate data from affiliate_clicks table
      // For now, return mock data
      const analytics = {
        totalClicks: 0,
        totalConversions: 0,
        conversionRate: 0,
        totalRevenue: 0,
        topProducts: [],
        topRetailers: []
      };
      return analytics;
    } catch (error) {
      console.error('Error fetching affiliate analytics:', error);
      return {
        totalClicks: 0,
        totalConversions: 0,
        conversionRate: 0,
        totalRevenue: 0,
        topProducts: [],
        topRetailers: []
      };
    }
  }
}

export const affiliateService = new AffiliateService();
