const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Categories data from src/data/categories.ts
const categories = [
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Latest gadgets, smartphones, laptops, and electronic devices',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
    productCount: 0,
    slug: 'electronics',
    icon: '📱',
    letter: 'E',
    subcategories: [
      { id: 'smartphones', name: 'Smartphones', slug: 'smartphones', icon: '📱' },
      { id: 'tablets', name: 'Tablets', slug: 'tablets', icon: '📱' },
      { id: 'smartwatches', name: 'Smartwatches', slug: 'smartwatches', icon: '⌚' },
      { id: 'headphones', name: 'Headphones', slug: 'headphones', icon: '🎧' },
      { id: 'speakers', name: 'Speakers', slug: 'speakers', icon: '🔊' },
      { id: 'cameras', name: 'Cameras', slug: 'cameras', icon: '📷' },
      { id: 'tvs', name: 'TVs & Home Theater', slug: 'tvs-home-theater', icon: '📺' },
      { id: 'audio', name: 'Audio Equipment', slug: 'audio-equipment', icon: '🎵' }
    ]
  },
  {
    id: 'computers-laptops',
    name: 'Computers & Laptops',
    description: 'Desktop computers, laptops, tablets, and accessories',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
    productCount: 0,
    slug: 'computers-laptops',
    icon: '💻',
    letter: 'C',
    subcategories: [
      { id: 'laptops', name: 'Laptops', slug: 'laptops', icon: '💻' },
      { id: 'desktops', name: 'Desktop Computers', slug: 'desktop-computers', icon: '🖥️' },
      { id: 'tablets', name: 'Tablets', slug: 'tablets', icon: '📱' },
      { id: 'monitors', name: 'Monitors', slug: 'monitors', icon: '🖥️' },
      { id: 'keyboards', name: 'Keyboards', slug: 'keyboards', icon: '⌨️' },
      { id: 'mice', name: 'Mice', slug: 'mice', icon: '🖱️' },
      { id: 'storage', name: 'Storage', slug: 'storage', icon: '💾' },
      { id: 'networking', name: 'Networking', slug: 'networking', icon: '🌐' }
    ]
  },
  {
    id: 'smartphones',
    name: 'Smartphones',
    description: 'Latest smartphones, mobile phones, and accessories',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
    productCount: 0,
    slug: 'smartphones',
    icon: '📱',
    letter: 'S',
    subcategories: [
      { id: 'iphone', name: 'iPhone', slug: 'iphone', icon: '📱' },
      { id: 'samsung', name: 'Samsung', slug: 'samsung', icon: '📱' },
      { id: 'google-pixel', name: 'Google Pixel', slug: 'google-pixel', icon: '📱' },
      { id: 'oneplus', name: 'OnePlus', slug: 'oneplus', icon: '📱' },
      { id: 'xiaomi', name: 'Xiaomi', slug: 'xiaomi', icon: '📱' },
      { id: 'phone-cases', name: 'Phone Cases', slug: 'phone-cases', icon: '📱' },
      { id: 'screen-protectors', name: 'Screen Protectors', slug: 'screen-protectors', icon: '📱' },
      { id: 'chargers', name: 'Chargers', slug: 'chargers', icon: '🔌' }
    ]
  },
  {
    id: 'gaming',
    name: 'Gaming',
    description: 'Gaming consoles, games, accessories, and gaming gear',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
    productCount: 0,
    slug: 'gaming',
    icon: '🎮',
    letter: 'G',
    subcategories: [
      { id: 'gaming-consoles', name: 'Gaming Consoles', slug: 'gaming-consoles', icon: '🎮' },
      { id: 'pc-gaming', name: 'PC Gaming', slug: 'pc-gaming', icon: '🖥️' },
      { id: 'gaming-accessories', name: 'Gaming Accessories', slug: 'gaming-accessories', icon: '🎮' },
      { id: 'video-games', name: 'Video Games', slug: 'video-games', icon: '🎮' },
      { id: 'gaming-chairs', name: 'Gaming Chairs', slug: 'gaming-chairs', icon: '🪑' },
      { id: 'gaming-headsets', name: 'Gaming Headsets', slug: 'gaming-headsets', icon: '🎧' },
      { id: 'gaming-mice', name: 'Gaming Mice', slug: 'gaming-mice', icon: '🖱️' },
      { id: 'gaming-keyboards', name: 'Gaming Keyboards', slug: 'gaming-keyboards', icon: '⌨️' }
    ]
  },
  {
    id: 'home-appliances',
    name: 'Home Appliances',
    description: 'Kitchen appliances, home electronics, and smart home devices',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    productCount: 0,
    slug: 'home-appliances',
    icon: '🏠',
    letter: 'H',
    subcategories: [
      { id: 'kitchen-appliances', name: 'Kitchen Appliances', slug: 'kitchen-appliances', icon: '🍳' },
      { id: 'refrigerators', name: 'Refrigerators', slug: 'refrigerators', icon: '❄️' },
      { id: 'washing-machines', name: 'Washing Machines', slug: 'washing-machines', icon: '🧺' },
      { id: 'dishwashers', name: 'Dishwashers', slug: 'dishwashers', icon: '🍽️' },
      { id: 'microwaves', name: 'Microwaves', slug: 'microwaves', icon: '🍽️' },
      { id: 'coffee-makers', name: 'Coffee Makers', slug: 'coffee-makers', icon: '☕' },
      { id: 'smart-home', name: 'Smart Home', slug: 'smart-home', icon: '🏠' },
      { id: 'air-purifiers', name: 'Air Purifiers', slug: 'air-purifiers', icon: '💨' }
    ]
  },
  {
    id: 'fashion',
    name: 'Fashion & Clothing',
    description: 'Men\'s and women\'s clothing, shoes, accessories, and jewelry',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    productCount: 0,
    slug: 'fashion-clothing',
    icon: '👕',
    letter: 'F',
    subcategories: [
      { id: 'mens-clothing', name: 'Men\'s Clothing', slug: 'mens-clothing', icon: '👔' },
      { id: 'womens-clothing', name: 'Women\'s Clothing', slug: 'womens-clothing', icon: '👗' },
      { id: 'kids-clothing', name: 'Kids\' Clothing', slug: 'kids-clothing', icon: '👶' },
      { id: 'shoes', name: 'Shoes', slug: 'shoes', icon: '👟' },
      { id: 'bags-purses', name: 'Bags & Purses', slug: 'bags-purses', icon: '👜' },
      { id: 'jewelry', name: 'Jewelry', slug: 'jewelry', icon: '💍' },
      { id: 'watches', name: 'Watches', slug: 'watches', icon: '⌚' },
      { id: 'accessories', name: 'Accessories', slug: 'accessories', icon: '🕶️' }
    ]
  },
  {
    id: 'beauty-personal-care',
    name: 'Beauty & Personal Care',
    description: 'Cosmetics, skincare, haircare, and personal care products',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop',
    productCount: 0,
    slug: 'beauty-personal-care',
    icon: '💄',
    letter: 'B'
  },
  {
    id: 'health-fitness',
    name: 'Health & Fitness',
    description: 'Fitness equipment, supplements, health monitors, and wellness products',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    productCount: 0,
    slug: 'health-fitness',
    icon: '💪',
    letter: 'H'
  },
  {
    id: 'books-media',
    name: 'Books & Media',
    description: 'Books, e-books, movies, music, and digital media',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
    productCount: 0,
    slug: 'books-media',
    icon: '📚',
    letter: 'B'
  },
  {
    id: 'toys-hobbies',
    name: 'Toys & Hobbies',
    description: 'Toys, collectibles, arts & crafts, and hobby supplies',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=300&fit=crop',
    productCount: 0,
    slug: 'toys-hobbies',
    icon: '🧸',
    letter: 'T'
  },
  {
    id: 'sports-outdoors',
    name: 'Sports & Outdoors',
    description: 'Sports equipment, outdoor gear, camping, and adventure products',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    productCount: 0,
    slug: 'sports-outdoors',
    icon: '⚽',
    letter: 'S'
  },
  {
    id: 'automotive',
    name: 'Automotive',
    description: 'Car parts, accessories, tools, and automotive products',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop',
    productCount: 0,
    slug: 'automotive',
    icon: '🚗',
    letter: 'A'
  },
  {
    id: 'baby-kids',
    name: 'Baby & Kids',
    description: 'Baby products, children\'s toys, clothing, and parenting essentials',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop',
    productCount: 0,
    slug: 'baby-kids',
    icon: '👶',
    letter: 'B'
  },
  {
    id: 'pet-supplies',
    name: 'Pet Supplies',
    description: 'Pet food, toys, accessories, and care products for all pets',
    image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=300&fit=crop',
    productCount: 0,
    slug: 'pet-supplies',
    icon: '🐕',
    letter: 'P'
  },
  {
    id: 'office-supplies',
    name: 'Office Supplies',
    description: 'Office furniture, stationery, business supplies, and workplace essentials',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
    productCount: 0,
    slug: 'office-supplies',
    icon: '📎',
    letter: 'O'
  },
  {
    id: 'tools-hardware',
    name: 'Tools & Hardware',
    description: 'Power tools, hand tools, hardware, and DIY supplies',
    image: 'https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=300&fit=crop',
    productCount: 0,
    slug: 'tools-hardware',
    icon: '🔧',
    letter: 'T'
  },
  {
    id: 'furniture',
    name: 'Furniture',
    description: 'Home furniture, office furniture, and decorative items',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
    productCount: 0,
    slug: 'furniture',
    icon: '🪑',
    letter: 'F',
    subcategories: [
      { id: 'living-room', name: 'Living Room', slug: 'living-room-furniture', icon: '🛋️' },
      { id: 'bedroom', name: 'Bedroom', slug: 'bedroom-furniture', icon: '🛏️' },
      { id: 'dining-room', name: 'Dining Room', slug: 'dining-room-furniture', icon: '🍽️' },
      { id: 'office-furniture', name: 'Office Furniture', slug: 'office-furniture', icon: '🪑' },
      { id: 'outdoor-furniture', name: 'Outdoor Furniture', slug: 'outdoor-furniture', icon: '🌳' },
      { id: 'kids-furniture', name: 'Kids Furniture', slug: 'kids-furniture', icon: '👶' }
    ]
  }
];

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.error('Please check your .env file and ensure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are set.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixAndSyncCategories() {
  console.log('🔧 Fixing Categories Schema and Synchronizing...');
  console.log('================================================\n');
  
  try {
    // Step 1: Drop and recreate categories table
    console.log('🗑️ Dropping existing categories table...');
    const { error: dropError } = await supabase.rpc('exec_sql', {
      sql: 'DROP TABLE IF EXISTS categories CASCADE;'
    });
    
    if (dropError) {
      console.log('⚠️ Could not drop table via RPC, this is normal for anon key');
    }
    
    // Step 2: Create new table with proper schema
    console.log('🏗️ Creating new categories table with proper schema...');
    const createTableSQL = `
      CREATE TABLE categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        image TEXT,
        slug TEXT UNIQUE,
        product_count INTEGER DEFAULT 0,
        icon TEXT,
        letter TEXT,
        subcategories JSONB DEFAULT '[]',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: createTableSQL
    });
    
    if (createError) {
      console.log('⚠️ Could not create table via RPC, this is normal for anon key');
      console.log('💡 Please run the FIX_CATEGORIES_SCHEMA.sql script in your Supabase SQL Editor first');
      console.log('Then run this script again.');
      return;
    }
    
    // Step 3: Insert categories
    console.log('📥 Inserting categories into database...');
    const categoriesToInsert = categories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description,
      image: category.image,
      slug: category.slug,
      product_count: category.productCount,
      icon: category.icon,
      letter: category.letter,
      subcategories: category.subcategories || []
    }));
    
    const { data: insertedCategories, error: insertError } = await supabase
      .from('categories')
      .insert(categoriesToInsert)
      .select('*');
    
    if (insertError) {
      console.error('❌ Error inserting categories:', insertError);
      console.log('\n💡 Please run the FIX_CATEGORIES_SCHEMA.sql script in your Supabase SQL Editor first');
      return;
    }
    
    console.log(`✅ Successfully synced ${insertedCategories?.length || 0} categories!`);
    
    // Display synced categories
    console.log('\n📋 Synced Categories:');
    insertedCategories?.forEach((category, index) => {
      console.log(`${index + 1}. ${category.name} (${category.slug})`);
    });
    
    console.log('\n🎉 Categories schema fixed and synchronization completed successfully!');
    
  } catch (error) {
    console.error('❌ Unexpected error during synchronization:', error);
    console.log('\n💡 Please run the FIX_CATEGORIES_SCHEMA.sql script in your Supabase SQL Editor first');
  }
}

// Run the fix and sync
fixAndSyncCategories();
