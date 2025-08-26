import { supabase } from '../utils/supabaseClient';

export interface CouponRetailer {
  id: number;
  name: string;
  icon: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  categories?: CouponCategory[];
}

export interface CouponCategory {
  id: number;
  retailer_id: number;
  name: string;
  slug: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCouponRetailerData {
  name: string;
  icon: string;
  display_order?: number;
}

export interface UpdateCouponRetailerData {
  name?: string;
  icon?: string;
  display_order?: number;
  is_active?: boolean;
}

export interface CreateCouponCategoryData {
  retailer_id: number;
  name: string;
  slug: string;
  display_order?: number;
}

export interface UpdateCouponCategoryData {
  name?: string;
  slug?: string;
  display_order?: number;
  is_active?: boolean;
}

class CouponService {
  // Lấy tất cả retailers với categories
  async getCouponRetailers(): Promise<CouponRetailer[]> {
    try {
      const { data: retailers, error: retailersError } = await supabase
        .from('coupon_retailers')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (retailersError) throw retailersError;

      const { data: categories, error: categoriesError } = await supabase
        .from('coupon_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (categoriesError) throw categoriesError;

      // Gộp retailers với categories
      const retailersWithCategories = retailers?.map(retailer => ({
        ...retailer,
        categories: categories?.filter(cat => cat.retailer_id === retailer.id) || []
      })) || [];

      return retailersWithCategories;
    } catch (error) {
      console.error('Error fetching coupon retailers:', error);
      throw error;
    }
  }

  // Lấy tất cả retailers (cho admin)
  async getAllCouponRetailers(): Promise<CouponRetailer[]> {
    try {
      const { data, error } = await supabase
        .from('coupon_retailers')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching all coupon retailers:', error);
      throw error;
    }
  }

  // Tạo retailer mới
  async createCouponRetailer(retailerData: CreateCouponRetailerData): Promise<CouponRetailer> {
    try {
      const { data, error } = await supabase
        .from('coupon_retailers')
        .insert([retailerData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating coupon retailer:', error);
      throw error;
    }
  }

  // Cập nhật retailer
  async updateCouponRetailer(id: number, updateData: UpdateCouponRetailerData): Promise<CouponRetailer> {
    try {
      const { data, error } = await supabase
        .from('coupon_retailers')
        .update({ ...updateData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating coupon retailer:', error);
      throw error;
    }
  }

  // Xóa retailer
  async deleteCouponRetailer(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('coupon_retailers')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting coupon retailer:', error);
      throw error;
    }
  }

  // Lấy tất cả categories (cho admin)
  async getAllCouponCategories(): Promise<CouponCategory[]> {
    try {
      const { data, error } = await supabase
        .from('coupon_categories')
        .select('*')
        .order('retailer_id', { ascending: true })
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching all coupon categories:', error);
      throw error;
    }
  }

  // Tạo category mới
  async createCouponCategory(categoryData: CreateCouponCategoryData): Promise<CouponCategory> {
    try {
      const { data, error } = await supabase
        .from('coupon_categories')
        .insert([categoryData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating coupon category:', error);
      throw error;
    }
  }

  // Cập nhật category
  async updateCouponCategory(id: number, updateData: UpdateCouponCategoryData): Promise<CouponCategory> {
    try {
      const { data, error } = await supabase
        .from('coupon_categories')
        .update({ ...updateData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating coupon category:', error);
      throw error;
    }
  }

  // Xóa category
  async deleteCouponCategory(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('coupon_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting coupon category:', error);
      throw error;
    }
  }

  // Cập nhật thứ tự retailers
  async updateRetailersOrder(retailers: { id: number; display_order: number }[]): Promise<void> {
    try {
      for (const retailer of retailers) {
        await this.updateCouponRetailer(retailer.id, { display_order: retailer.display_order });
      }
    } catch (error) {
      console.error('Error updating retailers order:', error);
      throw error;
    }
  }

  // Cập nhật thứ tự categories
  async updateCategoriesOrder(categories: { id: number; display_order: number }[]): Promise<void> {
    try {
      for (const category of categories) {
        await this.updateCouponCategory(category.id, { display_order: category.display_order });
      }
    } catch (error) {
      console.error('Error updating categories order:', error);
      throw error;
    }
  }
}

export const couponService = new CouponService();
