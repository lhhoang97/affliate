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
  
  // FALLBACK PRODUCTS - Hiển thị ngay lập tức
  const fallbackProducts: Product[] = [
    {
      id: 'fallback-1',
      name: 'Samsung Galaxy S21',
      description: 'Flagship smartphone with amazing camera and performance',
      price: 699.99,
      originalPrice: 799.99,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
      category: 'Smartphones',
      brand: 'Samsung',
      rating: 4.5,
      reviewCount: 128,
      inStock: true,
      features: ['5G', '128GB Storage', 'Triple Camera'],
      specifications: {
        'Display': '6.2" Dynamic AMOLED',
        'Processor': 'Exynos 2100',
        'RAM': '8GB',
        'Storage': '128GB',
        'Camera': '64MP + 12MP + 12MP',
        'Battery': '4000mAh'
      },
      images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'],
      tags: ['smartphone', 'samsung', '5g', 'camera'],
      retailer: 'Amazon',
      externalUrl: 'https://amazon.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'fallback-2',
      name: 'iPhone 13',
      description: 'Latest iPhone with A15 Bionic chip and improved cameras',
      price: 799.99,
      originalPrice: 899.99,
      image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400',
      category: 'Smartphones',
      brand: 'Apple',
      rating: 4.7,
      reviewCount: 256,
      inStock: true,
      features: ['5G', '128GB Storage', 'Dual Camera'],
      specifications: {
        'Display': '6.1" Super Retina XDR',
        'Processor': 'A15 Bionic',
        'RAM': '4GB',
        'Storage': '128GB',
        'Camera': '12MP + 12MP',
        'Battery': '3240mAh'
      },
      images: ['https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400'],
      tags: ['smartphone', 'apple', 'iphone', '5g'],
      retailer: 'Apple Store',
      externalUrl: 'https://apple.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'fallback-3',
      name: 'MacBook Air M2',
      description: 'Ultra-thin laptop with M2 chip for incredible performance',
      price: 1199.99,
      originalPrice: 1299.99,
      image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400',
      category: 'Laptops',
      brand: 'Apple',
      rating: 4.8,
      reviewCount: 89,
      inStock: true,
      features: ['M2 Chip', '8GB RAM', '256GB SSD'],
      specifications: {
        'Display': '13.6" Liquid Retina',
        'Processor': 'Apple M2',
        'RAM': '8GB',
        'Storage': '256GB SSD',
        'Graphics': '8-core GPU',
        'Battery': 'Up to 18 hours'
      },
      images: ['https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400'],
      tags: ['laptop', 'apple', 'macbook', 'm2'],
      retailer: 'Apple Store',
      externalUrl: 'https://apple.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'fallback-4',
      name: 'Sony WH-1000XM4',
      description: 'Industry-leading noise canceling wireless headphones',
      price: 279.99,
      originalPrice: 349.99,
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400',
      category: 'Audio',
      brand: 'Sony',
      rating: 4.6,
      reviewCount: 342,
      inStock: true,
      features: ['Noise Canceling', '30h Battery', 'Quick Charge'],
      specifications: {
        'Driver': '40mm',
        'Frequency': '4Hz-40kHz',
        'Battery': '30 hours',
        'Charging': 'Quick Charge 10min = 5h',
        'Connectivity': 'Bluetooth 5.0',
        'Weight': '254g'
      },
      images: ['https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400'],
      tags: ['headphones', 'sony', 'noise-canceling', 'wireless'],
      retailer: 'Best Buy',
      externalUrl: 'https://bestbuy.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'fallback-5',
      name: 'Nintendo Switch OLED',
      description: 'Gaming console with vibrant OLED display',
      price: 349.99,
      originalPrice: 399.99,
      image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400',
      category: 'Gaming',
      brand: 'Nintendo',
      rating: 4.4,
      reviewCount: 178,
      inStock: true,
      features: ['OLED Display', '64GB Storage', 'Joy-Con Controllers'],
      specifications: {
        'Display': '7" OLED',
        'Storage': '64GB',
        'Battery': '4.5-9 hours',
        'Connectivity': 'Wi-Fi, Bluetooth',
        'Resolution': '1280x720',
        'Weight': '420g'
      },
      images: ['https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400'],
      tags: ['gaming', 'nintendo', 'switch', 'console'],
      retailer: 'GameStop',
      externalUrl: 'https://gamestop.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'fallback-6',
      name: 'iPad Air 5th Gen',
      description: 'Powerful tablet with M1 chip and all-day battery',
      price: 599.99,
      originalPrice: 649.99,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
      category: 'Tablets',
      brand: 'Apple',
      rating: 4.5,
      reviewCount: 203,
      inStock: true,
      features: ['M1 Chip', '10.9" Display', 'Touch ID'],
      specifications: {
        'Display': '10.9" Liquid Retina',
        'Processor': 'Apple M1',
        'RAM': '8GB',
        'Storage': '64GB',
        'Camera': '12MP',
        'Battery': 'Up to 10 hours'
      },
      images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400'],
      tags: ['tablet', 'apple', 'ipad', 'm1'],
      retailer: 'Apple Store',
      externalUrl: 'https://apple.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  try {
    console.log('Executing Supabase query...');
    
    // Try to fix Supabase client configuration
    console.log('Supabase client config check:');
    console.log('- URL:', process.env.REACT_APP_SUPABASE_URL);
    console.log('- Key length:', process.env.REACT_APP_SUPABASE_ANON_KEY?.length);
    
    // Use direct fetch as Supabase client keeps timing out
    console.log('Using direct fetch API (Supabase client has issues)...');
    
    const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
    const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
    
    const response = await fetch(`${supabaseUrl}/rest/v1/products?select=*`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    const error = null; // No error if we got here
    
    console.log('Supabase query result:', { data: data?.length || 0, error });
    
    if (error) {
      console.error('Supabase error:', error);
      console.log('Using fallback products instead');
      return fallbackProducts;
    }

    if (data && data.length > 0) {
      console.log('getAllProducts - Found', data.length, 'products from database');
      const mappedProducts = data.map(mapDbProduct);
      return mappedProducts;
    } else {
      console.log('getAllProducts - No products in database, using fallback');
      return fallbackProducts;
    }
  } catch (err) {
    console.error('getAllProducts - Error fetching from database:', err);
    console.log('Using fallback products instead');
    return fallbackProducts;
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
