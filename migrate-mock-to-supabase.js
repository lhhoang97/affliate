const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase credentials not found in .env file');
  console.log('Please create a .env file with:');
  console.log('REACT_APP_SUPABASE_URL=your_supabase_url');
  console.log('REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Mock data from src/utils/mockData.ts
const mockProducts = [
  {
    name: 'Apple iPhone 11 128GB',
    description: 'Latest iPhone with A13 Bionic chip and dual camera system.',
    price: 699,
    original_price: 799,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
    rating: 4.7,
    review_count: 2156,
    category: 'Electronics',
    brand: 'Apple',
    retailer: 'Amazon',
    in_stock: true,
    features: ['A13 Bionic chip', 'Dual camera system', 'Face ID', 'Water resistant'],
    specifications: {
      'Screen Size': '6.1 inches',
      'Storage': '128GB',
      'Color': 'Multiple colors',
      'Chip': 'A13 Bionic',
      'Camera': '12MP Dual camera'
    },
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400'
    ],
    tags: ['smartphone', 'apple', 'iphone', '5g']
  },
  {
    name: 'Apple iPhone 13 128GB',
    description: 'Advanced iPhone with A15 Bionic chip and pro camera system.',
    price: 799,
    original_price: 899,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
    rating: 4.8,
    review_count: 1892,
    category: 'Electronics',
    brand: 'Apple',
    retailer: 'Best Buy',
    in_stock: true,
    features: ['A15 Bionic chip', 'Pro camera system', 'Face ID', 'Cinematic mode'],
    specifications: {
      'Screen Size': '6.1 inches',
      'Storage': '128GB',
      'Color': 'Multiple colors',
      'Chip': 'A15 Bionic',
      'Camera': '12MP Dual camera'
    },
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400'
    ],
    tags: ['smartphone', 'apple', 'iphone', '5g']
  },
  {
    name: 'Samsung Galaxy S21 128GB',
    description: 'Premium Android smartphone with 5G capability.',
    price: 699,
    original_price: 799,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
    rating: 4.6,
    review_count: 1456,
    category: 'Electronics',
    brand: 'Samsung',
    retailer: 'Walmart',
    in_stock: true,
    features: ['5G capability', 'Triple camera', 'Wireless charging', 'Water resistant'],
    specifications: {
      'Screen Size': '6.2 inches',
      'Storage': '128GB',
      'Color': 'Multiple colors',
      'Chip': 'Exynos 2100',
      'Camera': '12MP Triple camera'
    },
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400'
    ],
    tags: ['smartphone', 'samsung', 'android', '5g']
  }
];

const mockCategories = [
  {
    name: 'Electronics',
    description: 'Latest electronic devices and gadgets',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
    slug: 'electronics'
  },
  {
    name: 'Fashion',
    description: 'Trendy clothing and accessories',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
    slug: 'fashion'
  },
  {
    name: 'Home & Garden',
    description: 'Everything for your home and garden',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
    slug: 'home-garden'
  }
];

async function migrateData() {
  console.log('🚀 Starting migration from mock data to Supabase...\n');

  try {
    // Test connection
    console.log('📡 Testing Supabase connection...');
    const { data: testData, error: testError } = await supabase.from('products').select('count').limit(1);
    if (testError) {
      console.error('❌ Connection failed:', testError.message);
      return;
    }
    console.log('✅ Connection successful!\n');

    // Migrate categories
    console.log('📂 Migrating categories...');
    for (const category of mockCategories) {
      const { data, error } = await supabase
        .from('categories')
        .insert(category)
        .select()
        .single();
      
      if (error) {
        console.error(`❌ Failed to insert category ${category.name}:`, error.message);
      } else {
        console.log(`✅ Inserted category: ${category.name}`);
      }
    }
    console.log('');

    // Migrate products
    console.log('📦 Migrating products...');
    for (const product of mockProducts) {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();
      
      if (error) {
        console.error(`❌ Failed to insert product ${product.name}:`, error.message);
      } else {
        console.log(`✅ Inserted product: ${product.name}`);
      }
    }
    console.log('');

    console.log('🎉 Migration completed successfully!');
    console.log(`📊 Migrated ${mockCategories.length} categories and ${mockProducts.length} products`);

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  }
}

migrateData();

