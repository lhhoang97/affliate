import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';
import { Product, Category } from '../types';
import { mockProducts, mockCategories } from '../utils/mockData';

function mapDbProduct(row: any): Product {
  return {
    id: String(row.id),
    name: row.name,
    description: row.description,
    price: row.price,
    originalPrice: row.original_price ?? undefined,
    image: row.image,
    rating: row.rating ?? 0,
    reviewCount: row.review_count ?? 0,
    category: row.category,
    brand: row.brand,
    inStock: Boolean(row.in_stock),
    features: row.features ?? [],
    specifications: row.specifications ?? {},
    images: row.images ?? (row.image ? [row.image] : []),
    tags: row.tags ?? [],
    externalUrl: row.external_url ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapDbCategory(row: any): Category {
  return {
    id: String(row.id),
    name: row.name,
    description: row.description ?? '',
    image: row.image ?? '',
    productCount: row.product_count ?? 0,
    slug: row.slug ?? row.name.toLowerCase().replace(/\s+/g, '-'),
  };
}

export async function fetchProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured) {
    // Get products from localStorage
    const savedProducts = JSON.parse(localStorage.getItem('mockProducts') || '[]');
    return [...mockProducts, ...savedProducts];
  }
  
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      console.error('Error fetching products:', error);
      return mockProducts;
    }
    return data ? data.map(mapDbProduct) : mockProducts;
  } catch (err) {
    console.error('Error fetching products:', err);
    return mockProducts;
  }
}

export async function fetchCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured) return mockCategories;
  
  try {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) {
      console.error('Error fetching categories:', error);
      return mockCategories;
    }
    return data ? data.map(mapDbCategory) : mockCategories;
  } catch (err) {
    console.error('Error fetching categories:', err);
    return mockCategories;
  }
}

export async function createCategory(input: Omit<Category, 'id' | 'productCount'>): Promise<Category> {
  if (!isSupabaseConfigured) {
    const newCategory: Category = {
      id: String(Date.now()),
      name: input.name,
      description: input.description ?? '',
      image: input.image ?? '',
      slug: input.slug ?? input.name.toLowerCase().replace(/\s+/g, '-'),
      productCount: 0
    };
    mockCategories.push(newCategory);
    return newCategory;
  }

  try {
    const payload: any = {
      name: input.name,
      description: input.description ?? null,
      image: input.image ?? null,
      slug: input.slug ?? input.name.toLowerCase().replace(/\s+/g, '-')
    };
    const { data, error } = await supabase.from('categories').insert(payload).select('*').single();
    if (error) throw error;
    return mapDbCategory(data);
  } catch (err) {
    console.error('Error creating category:', err);
    throw err;
  }
}

export async function updateCategory(id: string, input: Partial<Omit<Category, 'id' | 'productCount'>>): Promise<Category> {
  if (!isSupabaseConfigured) {
    const index = mockCategories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');
    const updated: Category = {
      ...mockCategories[index],
      ...input,
      slug: input.slug ?? mockCategories[index].slug
    } as Category;
    mockCategories[index] = updated;
    return updated;
  }

  try {
    const payload: any = {};
    if (input.name !== undefined) payload.name = input.name;
    if (input.description !== undefined) payload.description = input.description;
    if (input.image !== undefined) payload.image = input.image;
    if (input.slug !== undefined) payload.slug = input.slug;
    const { data, error } = await supabase.from('categories').update(payload).eq('id', id).select('*').single();
    if (error) throw error;
    return mapDbCategory(data);
  } catch (err) {
    console.error('Error updating category:', err);
    throw err;
  }
}

export async function deleteCategory(id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    const index = mockCategories.findIndex(c => c.id === id);
    if (index !== -1) mockCategories.splice(index, 1);
    return;
  }

  try {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
  } catch (err) {
    console.error('Error deleting category:', err);
    throw err;
  }
}

export async function createProduct(input: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
  if (!isSupabaseConfigured) {
    const now = new Date().toISOString();
    const newProduct = { 
      id: String(Date.now()), 
      createdAt: now, 
      updatedAt: now, 
      ...input 
    } as Product;
    
    // Get existing products from localStorage
    const existingProducts = JSON.parse(localStorage.getItem('mockProducts') || '[]');
    const allProducts = [...existingProducts, newProduct];
    
    // Save to localStorage
    localStorage.setItem('mockProducts', JSON.stringify(allProducts));
    
    // Add to current session
    mockProducts.push(newProduct);
    return newProduct;
  }

  try {
    const payload = {
      name: input.name,
      description: input.description,
      price: input.price,
      original_price: input.originalPrice ?? null,
      image: input.image,
      rating: input.rating,
      review_count: input.reviewCount,
      category: input.category,
      brand: input.brand,
      in_stock: input.inStock,
      features: input.features,
      specifications: input.specifications,
      images: input.images,
      tags: input.tags,
      external_url: input.externalUrl ?? null,
    };
    
    const { data, error } = await supabase.from('products').insert(payload).select('*').single();
    if (error) throw error;
    if (!data) throw new Error('Failed to create product');
    
    return mapDbProduct(data);
  } catch (err) {
    console.error('Error creating product:', err);
    throw err;
  }
}

export async function updateProduct(id: string, input: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Product> {
  if (!isSupabaseConfigured) {
    const now = new Date().toISOString();
    
    // Check in mockProducts first
    let productIndex = mockProducts.findIndex(p => p.id === id);
    let productArray = mockProducts;
    
    if (productIndex === -1) {
      // Check in localStorage
      const savedProducts = JSON.parse(localStorage.getItem('mockProducts') || '[]');
      productIndex = savedProducts.findIndex((p: Product) => p.id === id);
      productArray = savedProducts;
    }
    
    if (productIndex === -1) {
      throw new Error('Product not found');
    }
    
    const updatedProduct = { 
      ...productArray[productIndex], 
      ...input, 
      updatedAt: now 
    } as Product;
    
    // Update in the appropriate array
    if (productArray === mockProducts) {
      mockProducts[productIndex] = updatedProduct;
    } else {
      productArray[productIndex] = updatedProduct;
      localStorage.setItem('mockProducts', JSON.stringify(productArray));
    }
    
    return updatedProduct;
  }

  try {
    const payload: any = {};
    if (input.name !== undefined) payload.name = input.name;
    if (input.description !== undefined) payload.description = input.description;
    if (input.price !== undefined) payload.price = input.price;
    if (input.originalPrice !== undefined) payload.original_price = input.originalPrice;
    if (input.image !== undefined) payload.image = input.image;
    if (input.rating !== undefined) payload.rating = input.rating;
    if (input.reviewCount !== undefined) payload.review_count = input.reviewCount;
    if (input.category !== undefined) payload.category = input.category;
    if (input.brand !== undefined) payload.brand = input.brand;
    if (input.inStock !== undefined) payload.in_stock = input.inStock;
    if (input.features !== undefined) payload.features = input.features;
    if (input.specifications !== undefined) payload.specifications = input.specifications;
    if (input.images !== undefined) payload.images = input.images;
    if (input.tags !== undefined) payload.tags = input.tags;
    if (input.externalUrl !== undefined) payload.external_url = input.externalUrl;

    const { data, error } = await supabase.from('products').update(payload).eq('id', id).select('*').single();
    if (error) throw error;
    if (!data) throw new Error('Product not found');
    
    return mapDbProduct(data);
  } catch (err) {
    console.error('Error updating product:', err);
    throw err;
  }
}

export async function deleteProduct(id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    // Check in mockProducts first
    let productIndex = mockProducts.findIndex(p => p.id === id);
    
    if (productIndex !== -1) {
      mockProducts.splice(productIndex, 1);
    } else {
      // Check in localStorage
      const savedProducts = JSON.parse(localStorage.getItem('mockProducts') || '[]');
      productIndex = savedProducts.findIndex((p: Product) => p.id === id);
      
      if (productIndex !== -1) {
        savedProducts.splice(productIndex, 1);
        localStorage.setItem('mockProducts', JSON.stringify(savedProducts));
      }
    }
    return;
  }

  try {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
  } catch (err) {
    console.error('Error deleting product:', err);
    throw err;
  }
}
