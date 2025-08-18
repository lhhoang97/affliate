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
  if (!isSupabaseConfigured) return mockProducts;
  const { data, error } = await supabase.from('products').select('*');
  if (error || !data) return mockProducts;
  return data.map(mapDbProduct);
}

export async function fetchCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured) return mockCategories;
  const { data, error } = await supabase.from('categories').select('*');
  if (error || !data) return mockCategories;
  return data.map(mapDbCategory);
}

export async function createProduct(input: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
  if (!isSupabaseConfigured) {
    const now = new Date().toISOString();
    return { id: String(Date.now()), createdAt: now, updatedAt: now, ...input } as Product;
  }
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
  };
  const { data, error } = await supabase.from('products').insert(payload).select('*').single();
  if (error || !data) throw error || new Error('Failed to create product');
  return mapDbProduct(data);
}

export async function updateProduct(id: string, input: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Product> {
  if (!isSupabaseConfigured) {
    const now = new Date().toISOString();
    return { id, createdAt: now, updatedAt: now, ...(input as any) } as Product;
  }
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

  const { data, error } = await supabase.from('products').update(payload).eq('id', id).select('*').single();
  if (error || !data) throw error || new Error('Failed to update product');
  return mapDbProduct(data);
}

export async function deleteProduct(id: string): Promise<void> {
  if (!isSupabaseConfigured) return; // No-op for mock
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}
