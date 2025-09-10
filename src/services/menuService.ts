import { supabase } from '../utils/supabaseClient';

export interface MenuCategory {
  id: number;
  name: string;
  icon: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  subcategories?: MenuSubcategory[];
}

export interface MenuSubcategory {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateMenuCategoryData {
  name: string;
  icon: string;
  display_order?: number;
}

export interface UpdateMenuCategoryData {
  name?: string;
  icon?: string;
  display_order?: number;
  is_active?: boolean;
}

export interface CreateMenuSubcategoryData {
  category_id: number;
  name: string;
  slug: string;
  display_order?: number;
}

export interface UpdateMenuSubcategoryData {
  name?: string;
  slug?: string;
  display_order?: number;
  is_active?: boolean;
}

class MenuService {
  // Lấy tất cả categories với subcategories
  async getMenuCategories(): Promise<MenuCategory[]> {
    try {
      const { data: categories, error: categoriesError } = await supabase
        .from('menu_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (categoriesError) throw categoriesError;

      const { data: subcategories, error: subcategoriesError } = await supabase
        .from('menu_subcategories')
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
      console.error('Error fetching menu categories:', error);
      throw error;
    }
  }

  // Lấy tất cả categories (cho admin)
  async getAllMenuCategories(): Promise<MenuCategory[]> {
    try {
      const { data, error } = await supabase
        .from('menu_categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching all menu categories:', error);
      throw error;
    }
  }

  // Tạo category mới
  async createMenuCategory(categoryData: CreateMenuCategoryData): Promise<MenuCategory> {
    try {
      const { data, error } = await supabase
        .from('menu_categories')
        .insert([categoryData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating menu category:', error);
      throw error;
    }
  }

  // Cập nhật category
  async updateMenuCategory(id: number, updateData: UpdateMenuCategoryData): Promise<MenuCategory> {
    try {
      const { data, error } = await supabase
        .from('menu_categories')
        .update({ ...updateData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating menu category:', error);
      throw error;
    }
  }

  // Xóa category
  async deleteMenuCategory(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('menu_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting menu category:', error);
      throw error;
    }
  }

  // Lấy tất cả subcategories (cho admin)
  async getAllMenuSubcategories(): Promise<MenuSubcategory[]> {
    try {
      const { data, error } = await supabase
        .from('menu_subcategories')
        .select('*')
        .order('category_id', { ascending: true })
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching all menu subcategories:', error);
      throw error;
    }
  }

  // Tạo subcategory mới
  async createMenuSubcategory(subcategoryData: CreateMenuSubcategoryData): Promise<MenuSubcategory> {
    try {
      const { data, error } = await supabase
        .from('menu_subcategories')
        .insert([subcategoryData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating menu subcategory:', error);
      throw error;
    }
  }

  // Cập nhật subcategory
  async updateMenuSubcategory(id: number, updateData: UpdateMenuSubcategoryData): Promise<MenuSubcategory> {
    try {
      const { data, error } = await supabase
        .from('menu_subcategories')
        .update({ ...updateData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating menu subcategory:', error);
      throw error;
    }
  }

  // Xóa subcategory
  async deleteMenuSubcategory(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('menu_subcategories')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting menu subcategory:', error);
      throw error;
    }
  }

  // Cập nhật thứ tự categories
  async updateCategoriesOrder(categories: { id: number; display_order: number }[]): Promise<void> {
    try {
      for (const category of categories) {
        await this.updateMenuCategory(category.id, { display_order: category.display_order });
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
        await this.updateMenuSubcategory(subcategory.id, { display_order: subcategory.display_order });
      }
    } catch (error) {
      console.error('Error updating subcategories order:', error);
      throw error;
    }
  }
}

export const menuService = new MenuService();
