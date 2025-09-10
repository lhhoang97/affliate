import { supabase } from '../utils/supabaseClient';

export interface DealCategory {
  id: number;
  name: string;
  icon: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  subcategories?: DealSubcategory[];
}

export interface DealSubcategory {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateDealCategoryData {
  name: string;
  icon: string;
  display_order?: number;
}

export interface UpdateDealCategoryData {
  name?: string;
  icon?: string;
  display_order?: number;
  is_active?: boolean;
}

export interface CreateDealSubcategoryData {
  category_id: number;
  name: string;
  slug: string;
  display_order?: number;
}

export interface UpdateDealSubcategoryData {
  name?: string;
  slug?: string;
  display_order?: number;
  is_active?: boolean;
}

class DealService {
  // Lấy tất cả categories với subcategories
  async getDealCategories(): Promise<DealCategory[]> {
    try {
      const { data: categories, error: categoriesError } = await supabase
        .from('deal_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (categoriesError) throw categoriesError;

      const { data: subcategories, error: subcategoriesError } = await supabase
        .from('deal_subcategories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (subcategoriesError) throw subcategoriesError;

      // Gộp categories với subcategories
      const categoriesWithSubcategories = categories?.map((category: any) => ({
        ...category,
        subcategories: subcategories?.filter((sub: any) => sub.category_id === category.id) || []
      })) || [];

      return categoriesWithSubcategories;
    } catch (error) {
      console.error('Error fetching deal categories:', error);
      throw error;
    }
  }

  // Lấy tất cả categories (cho admin)
  async getAllDealCategories(): Promise<DealCategory[]> {
    try {
      const { data, error } = await supabase
        .from('deal_categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching all deal categories:', error);
      throw error;
    }
  }

  // Tạo category mới
  async createDealCategory(categoryData: CreateDealCategoryData): Promise<DealCategory> {
    try {
      const { data, error } = await supabase
        .from('deal_categories')
        .insert([categoryData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating deal category:', error);
      throw error;
    }
  }

  // Cập nhật category
  async updateDealCategory(id: number, updateData: UpdateDealCategoryData): Promise<DealCategory> {
    try {
      const { data, error } = await supabase
        .from('deal_categories')
        .update({ ...updateData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating deal category:', error);
      throw error;
    }
  }

  // Xóa category
  async deleteDealCategory(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('deal_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting deal category:', error);
      throw error;
    }
  }

  // Lấy tất cả subcategories (cho admin)
  async getAllDealSubcategories(): Promise<DealSubcategory[]> {
    try {
      const { data, error } = await supabase
        .from('deal_subcategories')
        .select('*')
        .order('category_id', { ascending: true })
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching all deal subcategories:', error);
      throw error;
    }
  }

  // Tạo subcategory mới
  async createDealSubcategory(subcategoryData: CreateDealSubcategoryData): Promise<DealSubcategory> {
    try {
      const { data, error } = await supabase
        .from('deal_subcategories')
        .insert([subcategoryData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating deal subcategory:', error);
      throw error;
    }
  }

  // Cập nhật subcategory
  async updateDealSubcategory(id: number, updateData: UpdateDealSubcategoryData): Promise<DealSubcategory> {
    try {
      const { data, error } = await supabase
        .from('deal_subcategories')
        .update({ ...updateData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating deal subcategory:', error);
      throw error;
    }
  }

  // Xóa subcategory
  async deleteDealSubcategory(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('deal_subcategories')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting deal subcategory:', error);
      throw error;
    }
  }

  // Cập nhật thứ tự categories
  async updateCategoriesOrder(categories: { id: number; display_order: number }[]): Promise<void> {
    try {
      for (const category of categories) {
        await this.updateDealCategory(category.id, { display_order: category.display_order });
      }
    } catch (error) {
      console.error('Error updating categories order:', error);
      throw error;
    }
  }

  // Cập nhật thứ tự subcategories
  async updateSubcategoriesOrder(subcategories: { id: number; display_order: number }[]): Promise<void> {
    try {
      for (const subcategory of subcategories) {
        await this.updateDealSubcategory(subcategory.id, { display_order: subcategory.display_order });
      }
    } catch (error) {
      console.error('Error updating subcategories order:', error);
      throw error;
    }
  }
}

export const dealService = new DealService();
