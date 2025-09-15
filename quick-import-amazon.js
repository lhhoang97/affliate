const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Amazon API credentials
const amazonAccessKey = process.env.REACT_APP_AMAZON_ACCESS_KEY;
const amazonSecretKey = process.env.REACT_APP_AMAZON_SECRET_KEY;
const amazonAssociateTag = process.env.REACT_APP_AMAZON_ASSOCIATE_TAG;

console.log('🛒 Quick Import Amazon Products...');
console.log('📊 Supabase URL:', supabaseUrl ? '✅ Connected' : '❌ Missing');
console.log('🔑 Amazon Access Key:', amazonAccessKey ? '✅ Set' : '❌ Missing');
console.log('🏷️ Associate Tag:', amazonAssociateTag ? '✅ Set' : '❌ Missing');

async function quickImportAmazonProducts() {
  try {
    console.log('\n1. Checking Amazon retailer...');
    
    // Check if Amazon retailer exists
    const { data: amazonRetailer, error: retailerError } = await supabase
      .from('affiliate_retailers')
      .select('id')
      .eq('name', 'amazon')
      .single();

    if (retailerError && retailerError.code !== 'PGRST116') {
      console.error('❌ Error checking Amazon retailer:', retailerError.message);
      return;
    }

    let retailerId = amazonRetailer?.id;

    if (!retailerId) {
      console.log('📝 Creating Amazon retailer...');
      const { data: newRetailer, error: createError } = await supabase
        .from('affiliate_retailers')
        .insert([{
          name: 'amazon',
          display_name: 'Amazon',
          website_url: 'https://amazon.com',
          logo_url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
          commission_rate: 4.0,
          is_active: true
        }])
        .select('id')
        .single();

      if (createError) {
        console.error('❌ Error creating Amazon retailer:', createError.message);
        return;
      }

      retailerId = newRetailer.id;
      console.log('✅ Amazon retailer created:', retailerId);
    } else {
      console.log('✅ Amazon retailer found:', retailerId);
    }

    console.log('\n2. Importing sample Amazon products...');

    // Sample Amazon products to import
    const sampleProducts = [
      {
        title: 'Apple iPhone 15 Pro',
        description: 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system',
        price: 999.00,
        original_price: 1099.00,
        image_url: 'https://m.media-amazon.com/images/I/61cwywLZR-L._AC_SX679_.jpg',
        affiliate_url: `https://amazon.com/dp/B0CHX1W1XY?tag=${amazonAssociateTag}`,
        retailer_id: retailerId,
        category: 'Electronics',
        brand: 'Apple',
        availability: 'In Stock',
        rating: 4.5,
        review_count: 1250,
        asin: 'B0CHX1W1XY',
        amazon_price: 999.00,
        amazon_rating: 4.5,
        amazon_reviews: 1250,
        amazon_availability: 'In Stock',
        amazon_image_url: 'https://m.media-amazon.com/images/I/61cwywLZR-L._AC_SX679_.jpg',
        amazon_title: 'Apple iPhone 15 Pro',
        amazon_brand: 'Apple',
        amazon_category: 'Electronics',
        amazon_feature_bullets: [
          'A17 Pro chip with 6-core GPU',
          'Titanium design',
          '48MP Main camera',
          'Action Button',
          'USB-C connector'
        ],
        amazon_prime_eligible: true,
        amazon_best_seller: false,
        amazon_choice: true,
        amazon_lightning_deal: false,
        amazon_last_updated: new Date().toISOString()
      },
      {
        title: 'Samsung Galaxy S24 Ultra',
        description: 'Premium Android smartphone with S Pen, 200MP camera, and AI features',
        price: 1199.99,
        original_price: 1299.99,
        image_url: 'https://m.media-amazon.com/images/I/61cwywLZR-L._AC_SX679_.jpg',
        affiliate_url: `https://amazon.com/dp/B0CHX1W1XY?tag=${amazonAssociateTag}`,
        retailer_id: retailerId,
        category: 'Electronics',
        brand: 'Samsung',
        availability: 'In Stock',
        rating: 4.3,
        review_count: 890,
        asin: 'B0CHX1W1XY',
        amazon_price: 1199.99,
        amazon_rating: 4.3,
        amazon_reviews: 890,
        amazon_availability: 'In Stock',
        amazon_image_url: 'https://m.media-amazon.com/images/I/61cwywLZR-L._AC_SX679_.jpg',
        amazon_title: 'Samsung Galaxy S24 Ultra',
        amazon_brand: 'Samsung',
        amazon_category: 'Electronics',
        amazon_feature_bullets: [
          'S Pen included',
          '200MP camera',
          'AI-powered features',
          'Titanium frame',
          '120Hz display'
        ],
        amazon_prime_eligible: true,
        amazon_best_seller: true,
        amazon_choice: false,
        amazon_lightning_deal: false,
        amazon_last_updated: new Date().toISOString()
      },
      {
        title: 'MacBook Pro M3',
        description: 'Powerful laptop with M3 chip, Liquid Retina XDR display, and all-day battery',
        price: 1599.00,
        original_price: 1799.00,
        image_url: 'https://m.media-amazon.com/images/I/61cwywLZR-L._AC_SX679_.jpg',
        affiliate_url: `https://amazon.com/dp/B0CHX1W1XY?tag=${amazonAssociateTag}`,
        retailer_id: retailerId,
        category: 'Electronics',
        brand: 'Apple',
        availability: 'In Stock',
        rating: 4.7,
        review_count: 2100,
        asin: 'B0CHX1W1XY',
        amazon_price: 1599.00,
        amazon_rating: 4.7,
        amazon_reviews: 2100,
        amazon_availability: 'In Stock',
        amazon_image_url: 'https://m.media-amazon.com/images/I/61cwywLZR-L._AC_SX679_.jpg',
        amazon_title: 'MacBook Pro M3',
        amazon_brand: 'Apple',
        amazon_category: 'Electronics',
        amazon_feature_bullets: [
          'M3 chip with 8-core CPU',
          'Liquid Retina XDR display',
          'Up to 22 hours battery',
          '1080p FaceTime camera',
          'Three Thunderbolt 4 ports'
        ],
        amazon_prime_eligible: true,
        amazon_best_seller: false,
        amazon_choice: true,
        amazon_lightning_deal: false,
        amazon_last_updated: new Date().toISOString()
      }
    ];

    // Insert products
    const { data: insertedProducts, error: insertError } = await supabase
      .from('affiliate_products')
      .insert(sampleProducts)
      .select('id, title, price');

    if (insertError) {
      console.error('❌ Error inserting products:', insertError.message);
      return;
    }

    console.log('✅ Successfully imported products:');
    insertedProducts.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.title} - $${product.price}`);
    });

    console.log('\n3. Checking total Amazon products...');
    
    const { data: totalProducts, error: countError } = await supabase
      .from('affiliate_products')
      .select('id', { count: 'exact' })
      .not('asin', 'is', null);

    if (countError) {
      console.error('❌ Error counting products:', countError.message);
    } else {
      console.log(`📊 Total Amazon products in database: ${totalProducts.length}`);
    }

    console.log('\n🎉 Quick Import Completed!');
    console.log('\n📝 Next steps:');
    console.log('1. Go to http://localhost:3000/admin/amazon to manage products');
    console.log('2. Go to http://localhost:3000/ to see products on homepage');
    console.log('3. Test affiliate links by clicking on products');

  } catch (error) {
    console.error('❌ Error during quick import:', error.message);
  }
}

// Run the import
quickImportAmazonProducts();