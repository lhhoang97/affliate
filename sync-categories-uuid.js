const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Categories data from src/data/categories.ts - with UUID ids
const categories = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Electronics',
    description: 'Latest gadgets, smartphones, laptops, and electronic devices',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
    productCount: 0,
    slug: 'electronics'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Computers & Laptops',
    description: 'Desktop computers, laptops, tablets, and accessories',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
    productCount: 0,
    slug: 'computers-laptops'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Smartphones',
    description: 'Latest smartphones, mobile phones, and accessories',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
    productCount: 0,
    slug: 'smartphones'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'Gaming',
    description: 'Gaming consoles, games, accessories, and gaming gear',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
    productCount: 0,
    slug: 'gaming'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    name: 'Home Appliances',
    description: 'Kitchen appliances, home electronics, and smart home devices',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    productCount: 0,
    slug: 'home-appliances'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    name: 'Fashion & Clothing',
    description: 'Men\'s and women\'s clothing, shoes, accessories, and jewelry',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    productCount: 0,
    slug: 'fashion-clothing'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440007',
    name: 'Beauty & Personal Care',
    description: 'Cosmetics, skincare, haircare, and personal care products',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop',
    productCount: 0,
    slug: 'beauty-personal-care'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440008',
    name: 'Health & Fitness',
    description: 'Fitness equipment, supplements, health monitors, and wellness products',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    productCount: 0,
    slug: 'health-fitness'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440009',
    name: 'Books & Media',
    description: 'Books, e-books, movies, music, and digital media',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
    productCount: 0,
    slug: 'books-media'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440010',
    name: 'Toys & Hobbies',
    description: 'Toys, collectibles, arts & crafts, and hobby supplies',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=300&fit=crop',
    productCount: 0,
    slug: 'toys-hobbies'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440011',
    name: 'Sports & Outdoors',
    description: 'Sports equipment, outdoor gear, camping, and adventure products',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    productCount: 0,
    slug: 'sports-outdoors'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440012',
    name: 'Automotive',
    description: 'Car parts, accessories, tools, and automotive products',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop',
    productCount: 0,
    slug: 'automotive'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440013',
    name: 'Baby & Kids',
    description: 'Baby products, children\'s toys, clothing, and parenting essentials',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop',
    productCount: 0,
    slug: 'baby-kids'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440014',
    name: 'Pet Supplies',
    description: 'Pet food, toys, accessories, and care products for all pets',
    image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=300&fit=crop',
    productCount: 0,
    slug: 'pet-supplies'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440015',
    name: 'Office Supplies',
    description: 'Office furniture, stationery, business supplies, and workplace essentials',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
    productCount: 0,
    slug: 'office-supplies'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440016',
    name: 'Tools & Hardware',
    description: 'Power tools, hand tools, hardware, and DIY supplies',
    image: 'https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=300&fit=crop',
    productCount: 0,
    slug: 'tools-hardware'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440017',
    name: 'Furniture',
    description: 'Home furniture, office furniture, and decorative items',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
    productCount: 0,
    slug: 'furniture'
  }
];

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncCategoriesUUID() {
  console.log('🚀 Categories Synchronization with UUID...');
  console.log('==========================================\n');
  
  try {
    // Clear existing categories
    console.log('🗑️ Clearing existing categories...');
    const { error: deleteError } = await supabase
      .from('categories')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (deleteError) {
      console.error('❌ Error clearing categories:', deleteError);
      return;
    }
    
    console.log('✅ Existing categories cleared');
    
    // Insert new categories with UUID
    console.log('📥 Inserting categories into database...');
    const categoriesToInsert = categories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description,
      image: category.image,
      slug: category.slug,
      product_count: category.productCount
    }));
    
    const { data: insertedCategories, error: insertError } = await supabase
      .from('categories')
      .insert(categoriesToInsert)
      .select('*');
    
    if (insertError) {
      console.error('❌ Error inserting categories:', insertError);
      return;
    }
    
    console.log(`✅ Successfully synced ${insertedCategories?.length || 0} categories!`);
    
    // Display synced categories
    console.log('\n📋 Synced Categories:');
    insertedCategories?.forEach((category, index) => {
      console.log(`${index + 1}. ${category.name} (${category.slug})`);
      console.log(`   ID: ${category.id}`);
    });
    
    console.log('\n🎉 Categories synchronization completed successfully!');
    console.log('\n💡 To add advanced features (icons, letters, subcategories),');
    console.log('   run the FIX_CATEGORIES_SCHEMA.sql script in Supabase SQL Editor');
    
  } catch (error) {
    console.error('❌ Unexpected error during synchronization:', error);
  }
}

// Run the sync
syncCategoriesUUID();
