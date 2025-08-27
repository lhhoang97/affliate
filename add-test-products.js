const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

console.log('🚀 Starting Supabase Test Products Setup...');

// Check for .env file
if (!process.env.REACT_APP_SUPABASE_URL || !process.env.REACT_APP_SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase credentials!');
  console.error('📝 Please create .env file with:');
  console.error('   REACT_APP_SUPABASE_URL=your_project_url');
  console.error('   REACT_APP_SUPABASE_ANON_KEY=your_anon_key');
  console.error('📖 See SUPABASE_ENV_SETUP.md for detailed instructions');
  process.exit(1);
}

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Test products data - 10 products for pagination testing
const testProducts = [
  {
    name: "MacBook Pro M3 Max",
    description: "Latest MacBook Pro with M3 Max chip, 16-inch Retina display, 32GB RAM, 1TB SSD. Perfect for professional work and creative tasks.",
    price: 3999.99,
    original_price: 4299.99,
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400",
    rating: 4.9,
    review_count: 245,
    category: "Electronics",
    brand: "Apple",
    retailer: "Apple Store",
    in_stock: true,
    features: ["M3 Max Chip", "32GB RAM", "1TB SSD", "16-inch Display"],
    specifications: { "Screen": "16-inch", "RAM": "32GB", "Storage": "1TB" },
    images: ["https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400"],
    tags: ["laptop", "professional", "apple", "m3"],
    external_url: "https://apple.com/macbook-pro",
    affiliate_link: "https://apple.com/macbook-pro?ref=affiliate"
  },
  {
    name: "Sony WH-1000XM5 Headphones",
    description: "Industry-leading noise canceling wireless headphones with crystal clear hands-free calling and Alexa voice control.",
    price: 349.99,
    original_price: 399.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    rating: 4.8,
    review_count: 892,
    category: "Electronics",
    brand: "Sony",
    retailer: "Sony",
    in_stock: true,
    features: ["Noise Canceling", "30hr Battery", "Alexa Built-in", "Touch Controls"],
    specifications: { "Battery": "30 hours", "Weight": "250g", "Driver": "30mm" },
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"],
    tags: ["headphones", "wireless", "noise-canceling", "sony"]
  },
  {
    name: "iPhone 15 Pro Max",
    description: "The most advanced iPhone ever with titanium design, Action Button, and the most powerful camera system.",
    price: 1199.99,
    original_price: 1299.99,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
    rating: 4.7,
    review_count: 1543,
    category: "Electronics",
    brand: "Apple",
    retailer: "Apple Store",
    in_stock: true,
    features: ["A17 Pro Chip", "Titanium Design", "Action Button", "48MP Camera"],
    specifications: { "Screen": "6.7-inch", "Storage": "256GB", "Camera": "48MP" },
    images: ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400"],
    tags: ["smartphone", "apple", "pro", "titanium"]
  },
  {
    name: "Samsung Galaxy Watch 6",
    description: "Advanced smartwatch with comprehensive health monitoring, GPS tracking, and seamless connectivity.",
    price: 299.99,
    original_price: 349.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    rating: 4.6,
    review_count: 678,
    category: "Electronics",
    brand: "Samsung",
    retailer: "Samsung",
    in_stock: true,
    features: ["Health Monitoring", "GPS", "Water Resistant", "Sleep Tracking"],
    specifications: { "Display": "1.3-inch", "Battery": "40 hours", "Water": "5ATM" },
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"],
    tags: ["smartwatch", "fitness", "samsung", "health"]
  },
  {
    name: "Dell XPS 13 Laptop",
    description: "Ultra-portable laptop with InfinityEdge display, Intel Core i7, and premium build quality for professionals.",
    price: 1299.99,
    original_price: 1499.99,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
    rating: 4.5,
    review_count: 432,
    category: "Electronics",
    brand: "Dell",
    retailer: "Dell",
    in_stock: true,
    features: ["Intel Core i7", "13.3-inch Display", "16GB RAM", "512GB SSD"],
    specifications: { "Processor": "Intel Core i7", "RAM": "16GB", "Storage": "512GB" },
    images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400"],
    tags: ["laptop", "ultrabook", "dell", "portable"]
  },
  {
    name: "Canon EOS R5 Camera",
    description: "Professional mirrorless camera with 45MP sensor, 8K video recording, and advanced autofocus system.",
    price: 3899.99,
    original_price: 4199.99,
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400",
    rating: 4.9,
    review_count: 234,
    category: "Electronics",
    brand: "Canon",
    retailer: "B&H Photo",
    in_stock: true,
    features: ["45MP Sensor", "8K Video", "Dual Pixel CMOS AF", "In-Body Stabilization"],
    specifications: { "Sensor": "45MP", "Video": "8K", "ISO": "100-51200" },
    images: ["https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400"],
    tags: ["camera", "professional", "canon", "photography"]
  },
  {
    name: "iPad Air M2",
    description: "Powerful and versatile tablet with M2 chip, perfect for creativity, productivity, and entertainment.",
    price: 599.99,
    original_price: 699.99,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
    rating: 4.8,
    review_count: 987,
    category: "Electronics",
    brand: "Apple",
    retailer: "Apple Store",
    in_stock: true,
    features: ["M2 Chip", "10.9-inch Display", "Apple Pencil Support", "All-Day Battery"],
    specifications: { "Screen": "10.9-inch", "Chip": "M2", "Storage": "256GB" },
    images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400"],
    tags: ["tablet", "apple", "m2", "creative"]
  },
  {
    name: "Nintendo Switch OLED",
    description: "Enhanced gaming console with vibrant 7-inch OLED screen, improved audio, and versatile gaming modes.",
    price: 349.99,
    original_price: 379.99,
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400",
    rating: 4.7,
    review_count: 1245,
    category: "Electronics",
    brand: "Nintendo",
    retailer: "Nintendo",
    in_stock: true,
    features: ["7-inch OLED Screen", "Enhanced Audio", "64GB Storage", "Dock Included"],
    specifications: { "Screen": "7-inch OLED", "Storage": "64GB", "Battery": "4.5-9 hours" },
    images: ["https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400"],
    tags: ["gaming", "console", "nintendo", "portable"]
  },
  {
    name: "AirPods Pro (3rd Gen)",
    description: "Premium wireless earbuds with adaptive transparency, personalized spatial audio, and precision finding.",
    price: 249.99,
    original_price: 279.99,
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400",
    rating: 4.6,
    review_count: 2134,
    category: "Electronics",
    brand: "Apple",
    retailer: "Apple Store",
    in_stock: true,
    features: ["Active Noise Cancellation", "Spatial Audio", "MagSafe Charging", "IPX4 Rating"],
    specifications: { "Battery": "6 hours", "Case Battery": "30 hours", "Water": "IPX4" },
    images: ["https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400"],
    tags: ["earbuds", "wireless", "apple", "pro"]
  },
  {
    name: "LG 27\" 4K Monitor",
    description: "Ultra-sharp 4K display with HDR10 support, USB-C connectivity, and color-accurate IPS panel.",
    price: 449.99,
    original_price: 549.99,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400",
    rating: 4.4,
    review_count: 567,
    category: "Electronics",
    brand: "LG",
    retailer: "LG",
    in_stock: true,
    features: ["4K Resolution", "HDR10", "USB-C", "IPS Panel"],
    specifications: { "Resolution": "3840x2160", "Size": "27-inch", "Panel": "IPS" },
    images: ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400"],
    tags: ["monitor", "4k", "lg", "display"]
  }
];

async function addTestProducts() {
  try {
    console.log('🔍 Checking current database state...');
    
    // Check current product count
    const { count: currentCount, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Error checking product count:', countError.message);
      console.error('🔧 Make sure you have run the database setup SQL first!');
      console.error('📖 See SUPABASE_ENV_SETUP.md for instructions');
      return;
    }
    
    console.log(`📊 Current products in database: ${currentCount || 0}`);
    
    if (currentCount && currentCount >= 10) {
      console.log('✅ Database already has enough products for testing!');
      console.log('🎯 Ready to test pagination slider with existing data.');
      return;
    }
    
    console.log('➕ Adding test products...');
    
    // Insert test products
    const { data, error } = await supabase
      .from('products')
      .insert(testProducts)
      .select('id, name, price');
    
    if (error) {
      console.error('❌ Error adding products:', error.message);
      console.error('💡 Common issues:');
      console.error('   - Database tables not created yet');
      console.error('   - RLS policies blocking insert');
      console.error('   - Invalid data format');
      return;
    }
    
    console.log(`✅ Successfully added ${data.length} test products!`);
    console.log('📝 Added products:');
    data.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.name} - $${product.price}`);
    });
    
    // Check new total count
    const { count: newCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    console.log(`📊 Total products now: ${newCount}`);
    console.log('🎉 Ready to test pagination slider!');
    console.log('🌐 Start your website: npm start');
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    console.error('🔧 Please check your Supabase configuration');
  }
}

// Test connection first
async function testConnection() {
  try {
    console.log('🔌 Testing Supabase connection...');
    const { data, error } = await supabase.from('products').select('count').limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      console.error('📖 Please check SUPABASE_ENV_SETUP.md for setup instructions');
      return false;
    }
    
    console.log('✅ Supabase connection successful!');
    return true;
  } catch (err) {
    console.error('❌ Connection test failed:', err.message);
    return false;
  }
}

// Run the script
async function main() {
  const connected = await testConnection();
  if (connected) {
    await addTestProducts();
  }
}

main();
