require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function mapDbProduct(row) {
  let retailer = row.retailer;
  if (!retailer || retailer === null || retailer === undefined) {
    const brandToRetailer = {
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

async function debugProducts() {
  console.log('🔍 Debugging products...');
  
  try {
    // Test 1: Raw query
    console.log('\n📦 Test 1: Raw products query...');
    const { data: rawData, error: rawError } = await supabase.from('products').select('*');
    
    if (rawError) {
      console.error('❌ Raw query error:', rawError);
      return;
    }
    
    console.log('✅ Raw data found:', rawData?.length || 0, 'products');
    
    if (rawData && rawData.length > 0) {
      console.log('📝 Sample raw product:');
      console.log(JSON.stringify(rawData[0], null, 2));
    }
    
    // Test 2: Mapped products
    console.log('\n🔄 Test 2: Mapped products...');
    const mappedProducts = rawData ? rawData.map(mapDbProduct) : [];
    console.log('✅ Mapped products:', mappedProducts.length);
    
    if (mappedProducts.length > 0) {
      console.log('📝 Sample mapped product:');
      console.log(JSON.stringify(mappedProducts[0], null, 2));
    }
    
    // Test 3: Homepage query
    console.log('\n🏠 Test 3: Homepage products query...');
    const { data: homepageData, error: homepageError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(36);
    
    if (homepageError) {
      console.error('❌ Homepage query error:', homepageError);
      return;
    }
    
    console.log('✅ Homepage data found:', homepageData?.length || 0, 'products');
    
    if (homepageData && homepageData.length > 0) {
      const homepageProducts = homepageData.map(mapDbProduct);
      console.log('✅ Homepage mapped products:', homepageProducts.length);
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

debugProducts();
