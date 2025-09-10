import { supabase } from '../utils/supabaseClient';
import { Product } from '../types';

// Map database product to Product type
const mapDbProduct = (dbProduct: any): Product => {
  return {
    id: dbProduct.id,
    name: dbProduct.name || 'Unknown Product',
    price: parseFloat(dbProduct.price) || 0,
    originalPrice: dbProduct.original_price ? parseFloat(dbProduct.original_price) : undefined,
    description: dbProduct.description || '',
    image: dbProduct.image || '',
    images: dbProduct.images || [],
    category: dbProduct.category || 'General',
    brand: dbProduct.brand || '',
    rating: parseFloat(dbProduct.rating) || 0,
    reviewCount: parseInt(dbProduct.review_count) || 0,
    inStock: dbProduct.in_stock !== false,
    affiliateLink: dbProduct.affiliate_link || '',
    externalUrl: dbProduct.external_url || '',
    tags: dbProduct.tags || [],
    features: dbProduct.features || [],
    specifications: dbProduct.specifications || {},
    createdAt: dbProduct.created_at || new Date().toISOString(),
    updatedAt: dbProduct.updated_at || new Date().toISOString()
  };
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product> => {
  console.log('getProductById called for ID:', id);
  try {
    // First try to get product from main products table
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    
    if (error) {
      console.error('Error fetching product from main table:', error);
      // Try fallback table
      console.log('Trying fallback table for product ID:', id);
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('fallback_products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (fallbackError) {
        console.error('Error fetching from fallback table:', fallbackError);
        // Return a basic product object so user can still add to cart
        return {
          id: id,
          name: `Product ${id}`,
          price: 0,
          description: 'Product information will be updated',
          image: '',
          images: [],
          category: 'General',
          brand: '',
          rating: 0,
          reviewCount: 0,
          inStock: true,
          affiliateLink: '',
          externalUrl: '',
          tags: [],
          features: [],
          specifications: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
      
      if (fallbackData) {
        console.log('getProductById - Found product in fallback table:', fallbackData);
        return mapDbProduct(fallbackData);
      }
      
      // Return a basic product object so user can still add to cart
        return {
          id: id,
          name: `Product ${id}`,
          price: 0,
          description: 'Product information will be updated',
          image: '',
          images: [],
          category: 'General',
          brand: '',
          rating: 0,
          reviewCount: 0,
          inStock: true,
          affiliateLink: '',
          externalUrl: '',
          tags: [],
          features: [],
          specifications: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
    }
    
    if (data) {
      console.log('getProductById - Found product from main table:', data);
      return mapDbProduct(data);
    } else {
      console.log('getProductById - Product not found in main table, trying fallback...');
      
      // Try fallback table
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('fallback_products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (fallbackError) {
        console.error('Error fetching from fallback table:', fallbackError);
        // Return a basic product object so user can still add to cart
        return {
          id: id,
          name: `Product ${id}`,
          price: 0,
          description: 'Product information will be updated',
          image: '',
          images: [],
          category: 'General',
          brand: '',
          rating: 0,
          reviewCount: 0,
          inStock: true,
          affiliateLink: '',
          externalUrl: '',
          tags: [],
          features: [],
          specifications: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
      
      if (fallbackData) {
        console.log('getProductById - Found product in fallback table:', fallbackData);
        return mapDbProduct(fallbackData);
      }
      
      // Return a basic product object so user can still add to cart
        return {
          id: id,
          name: `Product ${id}`,
          price: 0,
          description: 'Product information will be updated',
          image: '',
          images: [],
          category: 'General',
          brand: '',
          rating: 0,
          reviewCount: 0,
          inStock: true,
          affiliateLink: '',
          externalUrl: '',
          tags: [],
          features: [],
          specifications: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
    }
  } catch (err) {
    console.error('getProductById - Error fetching from database:', err);
    // Return a basic product object so user can still add to cart
        return {
          id: id,
          name: `Product ${id}`,
          price: 0,
          description: 'Product information will be updated',
          image: '',
          images: [],
          category: 'General',
          brand: '',
          rating: 0,
          reviewCount: 0,
          inStock: true,
          affiliateLink: '',
          externalUrl: '',
          tags: [],
          features: [],
          specifications: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
  }
};

// Get all products (for admin and full product pages)
export const getAllProducts = async (): Promise<Product[]> => {
  console.log('getAllProducts called - fetching from Supabase database...');
  
  try {
    // First try to get products from main products table
    const { data, error } = await supabase.from('products').select('*');
    
    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to fetch products: ${error.message}`);
    }

    if (data && data.length > 0) {
      console.log('getAllProducts - Found products in main table:', data.length);
      const mappedProducts = data.map(mapDbProduct);
      return mappedProducts;
    } else {
      console.log('getAllProducts - No products in main table, trying fallback table...');
      
      // Fallback to fallback_products table
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('fallback_products')
        .select('*');
      
      if (fallbackError) {
        console.error('Fallback table error:', fallbackError);
        throw new Error(`Failed to fetch fallback products: ${fallbackError.message}`);
      }

      if (fallbackData && fallbackData.length > 0) {
        console.log('getAllProducts - Found fallback products:', fallbackData.length);
        const mappedFallbackProducts = fallbackData.map(mapDbProduct);
        return mappedFallbackProducts;
      } else {
        console.log('getAllProducts - No fallback products found either');
        return [];
      }
    }
  } catch (err) {
    console.error('getAllProducts - Error fetching from database:', err);
    throw err;
  }
};

// Get products by category
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  console.log('getProductsByCategory called for category:', category);
  
  try {
    // First try main products table
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category);
    
    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to fetch products by category: ${error.message}`);
    }

    if (data && data.length > 0) {
      console.log('getProductsByCategory - Found products in main table:', data.length);
      return data.map(mapDbProduct);
    } else {
      console.log('getProductsByCategory - No products in main table, trying fallback...');
      
      // Try fallback table
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('fallback_products')
        .select('*')
        .eq('category', category);
      
      if (fallbackError) {
        console.error('Fallback table error:', fallbackError);
        throw new Error(`Failed to fetch fallback products by category: ${fallbackError.message}`);
      }

      if (fallbackData && fallbackData.length > 0) {
        console.log('getProductsByCategory - Found fallback products:', fallbackData.length);
        return fallbackData.map(mapDbProduct);
      } else {
        console.log('getProductsByCategory - No products found for category:', category);
        return [];
      }
    }
  } catch (err) {
    console.error('getProductsByCategory - Error fetching from database:', err);
    throw err;
  }
};

// Search products
export const searchProducts = async (query: string): Promise<Product[]> => {
  console.log('searchProducts called with query:', query);
  
  try {
    // First try main products table
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%, description.ilike.%${query}%, brand.ilike.%${query}%`);
    
    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to search products: ${error.message}`);
    }

    if (data && data.length > 0) {
      console.log('searchProducts - Found products in main table:', data.length);
      return data.map(mapDbProduct);
    } else {
      console.log('searchProducts - No products in main table, trying fallback...');
      
      // Try fallback table
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('fallback_products')
        .select('*')
        .or(`name.ilike.%${query}%, description.ilike.%${query}%, brand.ilike.%${query}%`);
      
      if (fallbackError) {
        console.error('Fallback table error:', fallbackError);
        throw new Error(`Failed to search fallback products: ${fallbackError.message}`);
      }

      if (fallbackData && fallbackData.length > 0) {
        console.log('searchProducts - Found fallback products:', fallbackData.length);
        return fallbackData.map(mapDbProduct);
      } else {
        console.log('searchProducts - No products found for query:', query);
        return [];
      }
    }
  } catch (err) {
    console.error('searchProducts - Error searching products:', err);
    throw err;
  }
};

// Create product (admin only)
export const createProduct = async (productData: Partial<Product>): Promise<Product> => {
  console.log('createProduct called with data:', productData);
  
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: productData.name,
        price: productData.price,
        original_price: productData.originalPrice,
        description: productData.description,
        image: productData.image,
        images: productData.images,
        category: productData.category,
        brand: productData.brand,
        rating: productData.rating,
        review_count: productData.reviewCount,
        in_stock: productData.inStock,
        affiliate_link: productData.affiliateLink,
        external_url: productData.externalUrl,
        tags: productData.tags
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to create product: ${error.message}`);
    }

    console.log('createProduct - Product created successfully:', data);
    return mapDbProduct(data);
  } catch (err) {
    console.error('createProduct - Error creating product:', err);
    throw err;
  }
};

// Update product (admin only)
export const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product> => {
  console.log('updateProduct called for ID:', id, 'with data:', productData);
  
  try {
    const { data, error } = await supabase
      .from('products')
      .update({
        name: productData.name,
        price: productData.price,
        original_price: productData.originalPrice,
        description: productData.description,
        image: productData.image,
        images: productData.images,
        category: productData.category,
        brand: productData.brand,
        rating: productData.rating,
        review_count: productData.reviewCount,
        in_stock: productData.inStock,
        affiliate_link: productData.affiliateLink,
        external_url: productData.externalUrl,
        tags: productData.tags,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to update product: ${error.message}`);
    }

    console.log('updateProduct - Product updated successfully:', data);
    return mapDbProduct(data);
  } catch (err) {
    console.error('updateProduct - Error updating product:', err);
    throw err;
  }
};

// Delete product (admin only)
export const deleteProduct = async (id: string): Promise<void> => {
  console.log('deleteProduct called for ID:', id);
  
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to delete product: ${error.message}`);
    }

    console.log('deleteProduct - Product deleted successfully');
  } catch (err) {
    console.error('deleteProduct - Error deleting product:', err);
    throw err;
  }
};

// Fallback Products Management (admin only)
export const getFallbackProducts = async (): Promise<Product[]> => {
  console.log('getFallbackProducts called');
  
  try {
    const { data, error } = await supabase
      .from('fallback_products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to fetch fallback products: ${error.message}`);
    }

    console.log('getFallbackProducts - Found fallback products:', data?.length || 0);
    return data ? data.map(mapDbProduct) : [];
  } catch (err) {
    console.error('getFallbackProducts - Error fetching fallback products:', err);
    throw err;
  }
};

export const createFallbackProduct = async (productData: Partial<Product>): Promise<Product> => {
  console.log('createFallbackProduct called with data:', productData);
  
  try {
    const { data, error } = await supabase
      .from('fallback_products')
      .insert([{
        name: productData.name,
        price: productData.price,
        original_price: productData.originalPrice,
        description: productData.description,
        image: productData.image,
        images: productData.images,
        category: productData.category,
        brand: productData.brand,
        rating: productData.rating,
        review_count: productData.reviewCount,
        in_stock: productData.inStock,
        affiliate_link: productData.affiliateLink,
        external_url: productData.externalUrl,
        tags: productData.tags,
        features: productData.features,
        specifications: productData.specifications
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to create fallback product: ${error.message}`);
    }

    console.log('createFallbackProduct - Fallback product created successfully:', data);
    return mapDbProduct(data);
  } catch (err) {
    console.error('createFallbackProduct - Error creating fallback product:', err);
    throw err;
  }
};

export const updateFallbackProduct = async (id: string, productData: Partial<Product>): Promise<Product> => {
  console.log('updateFallbackProduct called for ID:', id, 'with data:', productData);
  
  try {
    const { data, error } = await supabase
      .from('fallback_products')
      .update({
        name: productData.name,
        price: productData.price,
        original_price: productData.originalPrice,
        description: productData.description,
        image: productData.image,
        images: productData.images,
        category: productData.category,
        brand: productData.brand,
        rating: productData.rating,
        review_count: productData.reviewCount,
        in_stock: productData.inStock,
        affiliate_link: productData.affiliateLink,
        external_url: productData.externalUrl,
        tags: productData.tags,
        features: productData.features,
        specifications: productData.specifications,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to update fallback product: ${error.message}`);
    }

    console.log('updateFallbackProduct - Fallback product updated successfully:', data);
    return mapDbProduct(data);
  } catch (err) {
    console.error('updateFallbackProduct - Error updating fallback product:', err);
    throw err;
  }
};

export const deleteFallbackProduct = async (id: string): Promise<void> => {
  console.log('deleteFallbackProduct called for ID:', id);
  
  try {
    const { error } = await supabase
      .from('fallback_products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Failed to delete fallback product: ${error.message}`);
    }

    console.log('deleteFallbackProduct - Fallback product deleted successfully');
  } catch (err) {
    console.error('deleteFallbackProduct - Error deleting fallback product:', err);
    throw err;
  }
};

// Category functions for admin
export const fetchCategories = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchCategories:', error);
    throw error;
  }
};

export const createCategory = async (categoryData: any): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      throw new Error(`Failed to create category: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in createCategory:', error);
    throw error;
  }
};

export const updateCategory = async (id: string, categoryData: any): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update(categoryData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating category:', error);
      throw new Error(`Failed to update category: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in updateCategory:', error);
    throw error;
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting category:', error);
      throw new Error(`Failed to delete category: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in deleteCategory:', error);
    throw error;
  }
};

// Alias for getAllProducts for admin dashboard
export const fetchProducts = getAllProducts;