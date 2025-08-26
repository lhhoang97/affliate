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

// Sample products data (same as in HomePage)
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Noise Cancelling Headphones',
    description: 'Premium wireless headphones with active noise cancellation technology',
    price: 199.99,
    originalPrice: 299.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop',
    rating: 4.8,
    reviewCount: 1247,
    category: 'Electronics',
    brand: 'AudioTech',
    retailer: 'Amazon',
    inStock: true,
    features: ['Noise Cancellation', 'Wireless', 'Long Battery Life'],
    specifications: { 'Battery Life': '30 hours', 'Connectivity': 'Bluetooth 5.0' },
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=400&fit=crop'
    ],
    tags: ['Audio', 'Wireless', 'Headphones'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Smart Wireless Earbuds Pro',
    description: 'Advanced wireless earbuds with smart features',
    price: 149.99,
    originalPrice: 249.99,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=200&fit=crop',
    rating: 4.6,
    reviewCount: 892,
    category: 'Electronics',
    brand: 'TechAudio',
    retailer: 'Amazon',
    inStock: true,
    features: ['Noise Cancellation', 'Wireless', 'Long Battery Life'],
    specifications: { 'Battery Life': '8 hours', 'Connectivity': 'Bluetooth 5.0' },
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=200&fit=crop'],
    tags: ['Audio', 'Wireless', 'Earbuds'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '3',
    name: 'Smart Fitness Watch with Heart Rate Monitor',
    description: 'Advanced fitness tracking with heart rate monitoring',
    price: 79.99,
    originalPrice: 199.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=200&fit=crop',
    rating: 4.7,
    reviewCount: 156,
    category: 'Electronics',
    brand: 'FitTech',
    retailer: 'Best Buy',
    inStock: true,
    features: ['Heart Rate Monitor', 'GPS', 'Water Resistant'],
    specifications: { 'Battery Life': '7 days', 'Water Resistance': '5ATM' },
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=200&fit=crop'],
    tags: ['Fitness', 'Smartwatch', 'Health'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '4',
    name: 'Portable Bluetooth Speaker Waterproof',
    description: 'Waterproof portable speaker with amazing sound quality',
    price: 34.99,
    originalPrice: 79.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=200&fit=crop',
    rating: 4.2,
    reviewCount: 67,
    category: 'Electronics',
    brand: 'SoundWave',
    retailer: 'Walmart',
    inStock: true,
    features: ['Waterproof', 'Portable', 'Long Battery'],
    specifications: { 'Battery Life': '12 hours', 'Water Resistance': 'IPX7' },
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=200&fit=crop'],
    tags: ['Audio', 'Portable', 'Waterproof'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '5',
    name: 'Gaming Mechanical Keyboard RGB Backlit',
    description: 'Professional gaming keyboard with RGB lighting',
    price: 89.99,
    originalPrice: 149.99,
    image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=200&fit=crop',
    rating: 4.6,
    reviewCount: 234,
    category: 'Electronics',
    brand: 'GameTech',
    retailer: 'Newegg',
    inStock: true,
    features: ['RGB Lighting', 'Mechanical Switches', 'Programmable Keys'],
    specifications: { 'Switch Type': 'Cherry MX Red', 'Backlight': 'RGB' },
    images: ['https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=200&fit=crop'],
    tags: ['Gaming', 'Keyboard', 'RGB'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '6',
    name: '4K Ultra HD Smart TV 55 inch',
    description: 'Stunning 4K resolution with smart features',
    price: 399.99,
    originalPrice: 699.99,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=400&fit=crop',
    rating: 4.8,
    reviewCount: 445,
    category: 'Electronics',
    brand: 'ViewTech',
    retailer: 'Target',
    inStock: true,
    features: ['4K Resolution', 'Smart TV', 'HDR'],
    specifications: { 'Screen Size': '55 inch', 'Resolution': '4K UHD' },
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=400&fit=crop'
    ],
    tags: ['TV', '4K', 'Smart TV'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '7',
    name: 'Wireless Charging Pad Fast Charger',
    description: 'Fast wireless charging pad for all devices',
    price: 19.99,
    originalPrice: 49.99,
    image: 'https://images.unsplash.com/photo-1609592806596-b43bada2f2d2?w=400&h=200&fit=crop',
    rating: 4.1,
    reviewCount: 78,
    category: 'Electronics',
    brand: 'ChargeTech',
    retailer: 'Amazon',
    inStock: true,
    features: ['Fast Charging', 'Universal Compatibility', 'LED Indicator'],
    specifications: { 'Output Power': '15W', 'Compatibility': 'Qi Standard' },
    images: ['https://images.unsplash.com/photo-1609592806596-b43bada2f2d2?w=400&h=200&fit=crop'],
    tags: ['Charging', 'Wireless', 'Fast Charging'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '8',
    name: 'Canon EOS Rebel T7 DSLR Camera Kit',
    description: 'Complete DSLR camera kit with EF-S 18-55mm lens for professional photography',
    price: 899.99,
    originalPrice: 1299.99,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=400&fit=crop',
    rating: 4.9,
    reviewCount: 567,
    category: 'Electronics',
    brand: 'Canon',
    retailer: 'B&H Photo',
    inStock: true,
    features: ['24MP APS-C Sensor', '4K Video Recording', 'Dual Lens Kit', 'Built-in Wi-Fi', '9-point AF System'],
    specifications: { 'Sensor': '24MP APS-C', 'Video': '4K 30fps', 'Lens': 'EF-S 18-55mm f/3.5-5.6 IS II' },
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=400&fit=crop'
    ],
    tags: ['Camera', 'DSLR', 'Professional', 'Canon'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '9',
    name: 'Smart Home Security Camera System',
    description: 'Complete home security system with smart features',
    price: 199.99,
    originalPrice: 399.99,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop',
    rating: 4.5,
    reviewCount: 234,
    category: 'Electronics',
    brand: 'SecureHome',
    retailer: 'Home Depot',
    inStock: true,
    features: ['Night Vision', 'Motion Detection', 'Cloud Storage'],
    specifications: { 'Resolution': '1080p', 'Storage': 'Cloud + Local' },
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop'],
    tags: ['Security', 'Smart Home', 'Camera'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '10',
    name: 'Gaming Laptop High Performance',
    description: 'High-performance gaming laptop with RTX graphics',
    price: 1299.99,
    originalPrice: 1799.99,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=200&fit=crop',
    rating: 4.7,
    reviewCount: 189,
    category: 'Electronics',
    brand: 'GameLap',
    retailer: 'Micro Center',
    inStock: true,
    features: ['RTX Graphics', 'High Refresh Rate', 'RGB Keyboard'],
    specifications: { 'GPU': 'RTX 4060', 'RAM': '16GB DDR5' },
    images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=200&fit=crop'],
    tags: ['Gaming', 'Laptop', 'RTX'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '11',
    name: 'Smart Refrigerator with Touch Screen',
    description: 'Modern smart refrigerator with touch screen interface',
    price: 1299.99,
    originalPrice: 1899.99,
    image: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=400&h=200&fit=crop',
    rating: 4.4,
    reviewCount: 123,
    category: 'Home & Garden',
    brand: 'SmartFridge',
    retailer: 'Lowe\'s',
    inStock: true,
    features: ['Touch Screen', 'WiFi Connected', 'Energy Efficient'],
    specifications: { 'Capacity': '25 cu ft', 'Energy Rating': 'A++' },
    images: ['https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=400&h=200&fit=crop'],
    tags: ['Kitchen', 'Smart Home', 'Refrigerator'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '12',
    name: 'Robot Vacuum Cleaner with Mapping',
    description: 'Smart robot vacuum with advanced mapping technology',
    price: 299.99,
    originalPrice: 499.99,
    image: 'https://images.unsplash.com/photo-1589003077984-894e1322bea6?w=400&h=200&fit=crop',
    rating: 4.6,
    reviewCount: 456,
    category: 'Home & Garden',
    brand: 'CleanBot',
    retailer: 'Amazon',
    inStock: true,
    features: ['Smart Mapping', 'App Control', 'Auto Recharge'],
    specifications: { 'Battery Life': '120 min', 'Suction Power': '2000Pa' },
    images: ['https://images.unsplash.com/photo-1589003077984-894e1322bea6?w=400&h=200&fit=crop'],
    tags: ['Cleaning', 'Robot', 'Smart Home'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '13',
    name: 'Smart Coffee Maker with Grinder',
    description: 'Automatic coffee maker with built-in grinder',
    price: 149.99,
    originalPrice: 249.99,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=200&fit=crop',
    rating: 4.3,
    reviewCount: 89,
    category: 'Home & Garden',
    brand: 'BrewMaster',
    retailer: 'Williams Sonoma',
    inStock: true,
    features: ['Built-in Grinder', 'Programmable', 'Thermal Carafe'],
    specifications: { 'Capacity': '12 cups', 'Grinder': 'Built-in' },
    images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=200&fit=crop'],
    tags: ['Coffee', 'Kitchen', 'Smart'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '14',
    name: 'Smart LED Light Bulbs Pack',
    description: 'WiFi-enabled smart LED bulbs with voice control',
    price: 39.99,
    originalPrice: 79.99,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=200&fit=crop',
    rating: 4.2,
    reviewCount: 234,
    category: 'Home & Garden',
    brand: 'LightSmart',
    retailer: 'Home Depot',
    inStock: true,
    features: ['WiFi Connected', 'Voice Control', 'Color Changing'],
    specifications: { 'Brightness': '800 lumens', 'Color': '16 million' },
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=200&fit=crop'],
    tags: ['Lighting', 'Smart Home', 'LED'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '15',
    name: 'Smart Thermostat with Learning',
    description: 'AI-powered smart thermostat that learns your preferences',
    price: 199.99,
    originalPrice: 299.99,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop',
    rating: 4.7,
    reviewCount: 345,
    category: 'Home & Garden',
    brand: 'ClimateSmart',
    retailer: 'Amazon',
    inStock: true,
    features: ['AI Learning', 'Geofencing', 'Energy Reports'],
    specifications: { 'Compatibility': 'HVAC Systems', 'Connectivity': 'WiFi' },
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop'],
    tags: ['Thermostat', 'Smart Home', 'Energy Saving'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '16',
    name: 'Professional Stand Mixer',
    description: 'Heavy-duty stand mixer for professional baking',
    price: 299.99,
    originalPrice: 449.99,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=200&fit=crop',
    rating: 4.8,
    reviewCount: 567,
    category: 'Home & Garden',
    brand: 'KitchenPro',
    retailer: 'KitchenAid',
    inStock: true,
    features: ['Heavy Duty', '10 Speeds', 'Tilt Head'],
    specifications: { 'Power': '325W', 'Capacity': '5 quarts' },
    images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=200&fit=crop'],
    tags: ['Kitchen', 'Baking', 'Professional'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '17',
    name: 'Smart Door Lock with Keypad',
    description: 'Smart door lock with keypad and app control',
    price: 179.99,
    originalPrice: 299.99,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop',
    rating: 4.5,
    reviewCount: 234,
    category: 'Home & Garden',
    brand: 'LockSmart',
    retailer: 'Home Depot',
    inStock: true,
    features: ['Keypad Entry', 'App Control', 'Auto Lock'],
    specifications: { 'Battery Life': '1 year', 'Connectivity': 'Bluetooth' },
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop'],
    tags: ['Security', 'Smart Home', 'Door Lock'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '18',
    name: 'Smart Garden Irrigation System',
    description: 'Automated garden watering system with weather integration',
    price: 89.99,
    originalPrice: 149.99,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop',
    rating: 4.3,
    reviewCount: 123,
    category: 'Home & Garden',
    brand: 'GardenSmart',
    retailer: 'Lowe\'s',
    inStock: true,
    features: ['Weather Integration', 'App Control', 'Water Saving'],
    specifications: { 'Zones': '6 zones', 'Coverage': 'Up to 1 acre' },
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop'],
    tags: ['Garden', 'Irrigation', 'Smart Home'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '19',
    name: 'Smart Air Purifier with HEPA Filter',
    description: 'Advanced air purifier with HEPA filtration and app control',
    price: 249.99,
    originalPrice: 399.99,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop',
    rating: 4.6,
    reviewCount: 345,
    category: 'Home & Garden',
    brand: 'AirSmart',
    retailer: 'Amazon',
    inStock: true,
    features: ['HEPA Filter', 'App Control', 'Air Quality Monitor'],
    specifications: { 'Coverage': '1000 sq ft', 'Filter Life': '12 months' },
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop'],
    tags: ['Air Purifier', 'HEPA', 'Smart Home'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '20',
    name: 'Smart Wine Refrigerator',
    description: 'Temperature-controlled wine refrigerator with smart features',
    price: 399.99,
    originalPrice: 599.99,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop',
    rating: 4.4,
    reviewCount: 89,
    category: 'Home & Garden',
    brand: 'WineSmart',
    retailer: 'Wine.com',
    inStock: true,
    features: ['Temperature Control', 'Humidity Control', 'UV Protection'],
    specifications: { 'Capacity': '24 bottles', 'Temperature Range': '40-65°F' },
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop'],
    tags: ['Wine', 'Refrigerator', 'Smart Home'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  }
];

// Get product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  console.log('getProductById called for ID:', id);
  try {
    // Try to fetch from database first
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (error) {
      console.error('Database error, using sample data:', error);
      // Fallback to sample data if database fails
      const product = sampleProducts.find(p => p.id === id);
      return product || null;
    }
    
    if (data) {
      console.log('getProductById - Found product from database:', data);
      return mapDbProduct(data);
    } else {
      console.log('getProductById - Product not found in database, checking sample data');
      const product = sampleProducts.find(p => p.id === id);
      return product || null;
    }
  } catch (err) {
    console.error('getProductById - Error fetching from database:', err);
    console.log('getProductById - Using sample data as fallback');
    const product = sampleProducts.find(p => p.id === id);
    return product || null;
  }
};

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  console.log('getAllProducts called - trying to fetch from database...');
  try {
    // Try to fetch from database first
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      console.error('Database error, using sample data:', error);
      // Fallback to sample data if database fails
      return sampleProducts;
    }
    
    if (data && data.length > 0) {
      console.log('getAllProducts - Found', data.length, 'products from database');
      return data.map(mapDbProduct);
    } else {
      console.log('getAllProducts - No products in database, using sample data');
      return sampleProducts;
    }
  } catch (err) {
    console.error('getAllProducts - Error fetching from database:', err);
    console.log('getAllProducts - Using sample data as fallback');
    return sampleProducts;
  }
};

// Get products by category
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 150));
  
  return sampleProducts.filter(p => p.category === category);
};

// Search products
export const searchProducts = async (query: string): Promise<Product[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const lowercaseQuery = query.toLowerCase();
  return sampleProducts.filter(p => 
    p.name.toLowerCase().includes(lowercaseQuery) ||
    p.description.toLowerCase().includes(lowercaseQuery) ||
    p.brand.toLowerCase().includes(lowercaseQuery) ||
    p.category.toLowerCase().includes(lowercaseQuery)
  );
};
