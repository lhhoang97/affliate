import { supabase } from '../utils/supabaseClient';
import { Product, Category } from '../types';

function mapDbProduct(row: any): Product {
  // Generate retailer based on brand if not provided
  let retailer = row.retailer;
  if (!retailer || retailer === null || retailer === undefined) {
    // Map brand to common retailers
    const brandToRetailer: { [key: string]: string } = {
      'Apple': 'Apple Store',
      'Samsung': 'Samsung',
      'Sony': 'Sony',
      'LG': 'LG',
      'AudioTech': 'Amazon',
      'TechAudio': 'Amazon',
      'FitTech': 'Best Buy',
      'SoundWave': 'Walmart',
      'GameTech': 'Newegg',
      'PhotoPro': 'B&H Photo',
      'ChargeTech': 'Amazon',
      'WineSmart': 'Wine.com'
    };
    retailer = brandToRetailer[row.brand] || 'Amazon';
  }

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
    retailer: retailer,
    inStock: Boolean(row.in_stock),
    features: row.features ?? [],
    specifications: row.specifications ?? {},
    images: row.images ?? (row.image ? [row.image] : []),
    tags: row.tags ?? [],
    externalUrl: row.external_url ?? undefined,
    affiliateLink: row.affiliate_link ?? undefined,
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
    icon: row.icon ?? '',
    letter: row.letter ?? '',
    subcategories: row.subcategories ?? []
  };
}

export async function fetchProducts(): Promise<Product[]> {
  console.log('fetchProducts called...');
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    return data ? data.map(mapDbProduct) : [];
  } catch (err) {
    console.error('Error fetching products:', err);
    return [];
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
    return data ? data.map(mapDbCategory) : [];
  } catch (err) {
    console.error('Error fetching categories:', err);
    return [];
  }
}

export async function createCategory(input: Omit<Category, 'id' | 'productCount'>): Promise<Category> {
  try {
    const payload: any = {
      name: input.name,
      description: input.description ?? null,
      image: input.image ?? null,
      slug: input.slug ?? input.name.toLowerCase().replace(/\s+/g, '-'),
      icon: input.icon ?? null,
      letter: input.letter ?? null,
      subcategories: input.subcategories ?? []
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
  try {
    const payload: any = {};
    if (input.name !== undefined) payload.name = input.name;
    if (input.description !== undefined) payload.description = input.description;
    if (input.image !== undefined) payload.image = input.image;
    if (input.slug !== undefined) payload.slug = input.slug;
    if (input.icon !== undefined) payload.icon = input.icon;
    if (input.letter !== undefined) payload.letter = input.letter;
    if (input.subcategories !== undefined) payload.subcategories = input.subcategories;
    const { data, error } = await supabase.from('categories').update(payload).eq('id', id).select('*').single();
    if (error) throw error;
    return mapDbCategory(data);
  } catch (err) {
    console.error('Error updating category:', err);
    throw err;
  }
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
  } catch (err) {
    console.error('Error deleting category:', err);
    throw err;
  }
}

export async function createProduct(input: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
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
      retailer: input.retailer ?? null,
      in_stock: input.inStock,
      features: input.features,
      specifications: input.specifications,
      images: input.images,
      tags: input.tags,
      external_url: input.externalUrl ?? null,
      affiliate_link: input.affiliateLink ?? null,
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
    if (input.retailer !== undefined) payload.retailer = input.retailer;
    if (input.inStock !== undefined) payload.in_stock = input.inStock;
    if (input.features !== undefined) payload.features = input.features;
    if (input.specifications !== undefined) payload.specifications = input.specifications;
    if (input.images !== undefined) payload.images = input.images;
    if (input.tags !== undefined) payload.tags = input.tags;
    if (input.externalUrl !== undefined) payload.external_url = input.externalUrl;
    if (input.affiliateLink !== undefined) payload.affiliate_link = input.affiliateLink;

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
  try {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
  } catch (err) {
    console.error('Error deleting product:', err);
    throw err;
  }
}



// Get product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  console.log('getProductById called for ID:', id);
  try {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (error) {
      console.error('Error fetching product from database:', error);
      return null;
    }
    
    if (data) {
      console.log('getProductById - Found product from database:', data);
      return mapDbProduct(data);
    } else {
      console.log('getProductById - Product not found in database');
      return null;
    }
  } catch (err) {
    console.error('getProductById - Error fetching from database:', err);
    return null;
  }
};

// Get all products (for admin and full product pages)
export const getAllProducts = async (): Promise<Product[]> => {
  console.log('getAllProducts called - trying to fetch from database...');
  console.log('Supabase client:', supabase ? 'Available' : 'Not available');
  try {
    console.log('Executing Supabase query...');
    const { data, error } = await supabase.from('products').select('*');
    console.log('Supabase query result:', { data: data?.length || 0, error });
    console.log('Full error object:', error);
    console.log('Full data object:', data);
    
    // Additional debugging
    console.log('Data type:', typeof data);
    console.log('Is array:', Array.isArray(data));
    console.log('Data length:', data?.length);
    console.log('First item:', data?.[0]);
    
    // Check if this is a React environment issue
    console.log('Environment check:');
    console.log('- process.env.NODE_ENV:', process.env.NODE_ENV);
    console.log('- window object:', typeof window !== 'undefined' ? 'Available' : 'Not available');
    console.log('- document object:', typeof document !== 'undefined' ? 'Available' : 'Not available');
    
    // Force a delay to see if it's a timing issue
    console.log('Adding 1 second delay...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Delay completed');
    
    if (error) {
      console.error('Error fetching products from database:', error);
      return [];
    }
    
    if (data && data.length > 0) {
      console.log('getAllProducts - Found', data.length, 'products from database');
      console.log('Sample raw product:', data[0]);
      const mappedProducts = data.map(mapDbProduct);
      console.log('Sample mapped product:', mappedProducts[0]);
      return mappedProducts;
    } else {
      console.log('getAllProducts - No products in database');
      return [];
    }
  } catch (err) {
    console.error('getAllProducts - Error fetching from database:', err);
    return [];
  }
};

// Get optimized products for homepage (only 36 products)
export const getHomepageProducts = async (): Promise<Product[]> => {
  console.log('getHomepageProducts called - fetching optimized set for homepage...');
  try {
    // Smart selection: mix of newest products and featured products
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(36);
    
    if (error) {
      console.error('Error fetching homepage products:', error);
      return [];
    }
    
    if (data && data.length > 0) {
      console.log('getHomepageProducts - Found', data.length, 'products for homepage');
      return data.map(mapDbProduct);
    } else {
      console.log('getHomepageProducts - No products found');
      return [];
    }
  } catch (err) {
    console.error('getHomepageProducts - Error fetching from database:', err);
    return [];
  }
};

// Get products by category
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase.from('products').select('*').eq('category', category);
    if (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
    return data ? data.map(mapDbProduct) : [];
  } catch (err) {
    console.error('Error fetching products by category:', err);
    return [];
  }
};

// Search products
export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const lowercaseQuery = query.toLowerCase();
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      console.error('Error searching products:', error);
      return [];
    }
    
    if (!data) return [];
    
    return data.filter(p => 
      p.name.toLowerCase().includes(lowercaseQuery) ||
      p.description.toLowerCase().includes(lowercaseQuery) ||
      p.brand.toLowerCase().includes(lowercaseQuery) ||
      p.category.toLowerCase().includes(lowercaseQuery)
    ).map(mapDbProduct);
  } catch (err) {
    console.error('Error searching products:', err);
    return [];
  }
};
