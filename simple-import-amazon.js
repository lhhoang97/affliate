const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Simple import configuration
const PRODUCTS_TO_IMPORT = [
  {
    name: 'iPhone 15 Pro Max - 256GB',
    price: 1199.00,
    original_price: 1299.00,
    image: 'https://via.placeholder.com/400x300/FF9900/FFFFFF?text=iPhone+15+Pro+Max',
    description: 'Latest iPhone with titanium design, A17 Pro chip, and advanced camera system.',
    category: 'Electronics',
    brand: 'Apple',
    rating: 4.8,
    review_count: 1250,
    external_url: 'https://www.amazon.com/iPhone-15-Pro-Max-256GB/dp/B0CHX1W1XY?tag=shopwithuso02-20',
    affiliate_link: 'https://www.amazon.com/iPhone-15-Pro-Max-256GB/dp/B0CHX1W1XY?tag=shopwithuso02-20',
    retailer: 'Amazon',
    features: ['Titanium Design', 'A17 Pro Chip', '48MP Camera', '5G Ready', 'Face ID'],
    specifications: {
      'Storage': '256GB',
      'Color': 'Natural Titanium',
      'Display': '6.7-inch Super Retina XDR',
      'Camera': '48MP Main Camera'
    },
    images: ['https://via.placeholder.com/400x300/FF9900/FFFFFF?text=iPhone+15+Pro+Max'],
    tags: ['iPhone', 'Apple', 'Smartphone', '5G', 'Premium']
  },
  {
    name: 'Samsung Galaxy S24 Ultra - 512GB',
    price: 1299.99,
    original_price: 1399.99,
    image: 'https://via.placeholder.com/400x300/FF9900/FFFFFF?text=Galaxy+S24+Ultra',
    description: 'Samsung\'s flagship smartphone with S Pen, 200MP camera, and AI features.',
    category: 'Electronics',
    brand: 'Samsung',
    rating: 4.7,
    review_count: 890,
    external_url: 'https://www.amazon.com/Samsung-Galaxy-S24-Ultra-512GB/dp/B0CRJ1Q1XY?tag=shopwithuso02-20',
    affiliate_link: 'https://www.amazon.com/Samsung-Galaxy-S24-Ultra-512GB/dp/B0CRJ1Q1XY?tag=shopwithuso02-20',
    retailer: 'Amazon',
    features: ['S Pen Included', '200MP Camera', 'AI Features', '5G Ready', 'Samsung Pay'],
    specifications: {
      'Storage': '512GB',
      'Color': 'Titanium Black',
      'Display': '6.8-inch Dynamic AMOLED 2X',
      'Camera': '200MP Main Camera'
    },
    images: ['https://via.placeholder.com/400x300/FF9900/FFFFFF?text=Galaxy+S24+Ultra'],
    tags: ['Samsung', 'Galaxy', 'S Pen', 'Android', 'Premium']
  },
  {
    name: 'MacBook Pro 16-inch M3 Max',
    price: 3999.00,
    original_price: 4299.00,
    image: 'https://via.placeholder.com/400x300/FF9900/FFFFFF?text=MacBook+Pro+16',
    description: 'Powerful MacBook Pro with M3 Max chip, perfect for professionals and creators.',
    category: 'Computers',
    brand: 'Apple',
    rating: 4.9,
    review_count: 456,
    external_url: 'https://www.amazon.com/MacBook-Pro-16-inch-M3-Max/dp/B0CHX1W1XZ?tag=shopwithuso02-20',
    affiliate_link: 'https://www.amazon.com/MacBook-Pro-16-inch-M3-Max/dp/B0CHX1W1XZ?tag=shopwithuso02-20',
    retailer: 'Amazon',
    features: ['M3 Max Chip', '16-inch Display', 'Up to 22 hours battery', 'Liquid Retina XDR', 'Touch ID'],
    specifications: {
      'Processor': 'M3 Max',
      'Memory': '32GB Unified Memory',
      'Storage': '1TB SSD',
      'Display': '16.2-inch Liquid Retina XDR'
    },
    images: ['https://via.placeholder.com/400x300/FF9900/FFFFFF?text=MacBook+Pro+16'],
    tags: ['MacBook', 'Apple', 'Laptop', 'M3 Max', 'Professional']
  },
  {
    name: 'iPad Pro 12.9-inch M2',
    price: 1099.00,
    original_price: 1199.00,
    image: 'https://via.placeholder.com/400x300/FF9900/FFFFFF?text=iPad+Pro+12.9',
    description: 'Powerful iPad Pro with M2 chip, perfect for creative professionals.',
    category: 'Electronics',
    brand: 'Apple',
    rating: 4.6,
    review_count: 678,
    external_url: 'https://www.amazon.com/iPad-Pro-12-9-inch-M2/dp/B0CHX1W1XA?tag=shopwithuso02-20',
    affiliate_link: 'https://www.amazon.com/iPad-Pro-12-9-inch-M2/dp/B0CHX1W1XA?tag=shopwithuso02-20',
    retailer: 'Amazon',
    features: ['M2 Chip', '12.9-inch Display', 'Apple Pencil Support', 'Face ID', '5G Ready'],
    specifications: {
      'Processor': 'M2',
      'Display': '12.9-inch Liquid Retina XDR',
      'Storage': '128GB',
      'Connectivity': 'Wi-Fi + Cellular'
    },
    images: ['https://via.placeholder.com/400x300/FF9900/FFFFFF?text=iPad+Pro+12.9'],
    tags: ['iPad', 'Apple', 'Tablet', 'M2', 'Creative']
  },
  {
    name: 'AirPods Pro 2nd Generation',
    price: 249.00,
    original_price: 279.00,
    image: 'https://via.placeholder.com/400x300/FF9900/FFFFFF?text=AirPods+Pro+2',
    description: 'Premium wireless earbuds with active noise cancellation and spatial audio.',
    category: 'Electronics',
    brand: 'Apple',
    rating: 4.5,
    review_count: 2340,
    external_url: 'https://www.amazon.com/AirPods-Pro-2nd-Generation/dp/B0CHX1W1XB?tag=shopwithuso02-20',
    affiliate_link: 'https://www.amazon.com/AirPods-Pro-2nd-Generation/dp/B0CHX1W1XB?tag=shopwithuso02-20',
    retailer: 'Amazon',
    features: ['Active Noise Cancellation', 'Spatial Audio', 'Adaptive Transparency', 'H2 Chip', 'MagSafe Case'],
    specifications: {
      'Chip': 'H2',
      'Battery Life': 'Up to 6 hours',
      'Case': 'MagSafe Charging Case',
      'Connectivity': 'Bluetooth 5.3'
    },
    images: ['https://via.placeholder.com/400x300/FF9900/FFFFFF?text=AirPods+Pro+2'],
    tags: ['AirPods', 'Apple', 'Earbuds', 'Noise Cancellation', 'Wireless']
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    price: 399.99,
    original_price: 449.99,
    image: 'https://via.placeholder.com/400x300/FF9900/FFFFFF?text=Sony+WH-1000XM5',
    description: 'Industry-leading noise canceling headphones with exceptional sound quality.',
    category: 'Electronics',
    brand: 'Sony',
    rating: 4.8,
    review_count: 1890,
    external_url: 'https://www.amazon.com/Sony-WH-1000XM5-Headphones-Canceling/dp/B0CHX1W1XC?tag=shopwithuso02-20',
    affiliate_link: 'https://www.amazon.com/Sony-WH-1000XM5-Headphones-Canceling/dp/B0CHX1W1XC?tag=shopwithuso02-20',
    retailer: 'Amazon',
    features: ['Industry-Leading Noise Canceling', '30-hour Battery', 'Quick Charge', 'Multipoint Connection', 'Speak-to-Chat'],
    specifications: {
      'Battery Life': 'Up to 30 hours',
      'Quick Charge': '3 minutes = 3 hours',
      'Connectivity': 'Bluetooth 5.2',
      'Weight': '250g'
    },
    images: ['https://via.placeholder.com/400x300/FF9900/FFFFFF?text=Sony+WH-1000XM5'],
    tags: ['Sony', 'Headphones', 'Noise Canceling', 'Wireless', 'Premium']
  },
  {
    name: 'Nintendo Switch OLED Model',
    price: 349.99,
    original_price: 399.99,
    image: 'https://via.placeholder.com/400x300/FF9900/FFFFFF?text=Nintendo+Switch+OLED',
    description: 'Nintendo Switch with vibrant 7-inch OLED screen and enhanced audio.',
    category: 'VideoGames',
    brand: 'Nintendo',
    rating: 4.7,
    review_count: 3450,
    external_url: 'https://www.amazon.com/Nintendo-Switch-OLED-Model/dp/B0CHX1W1XD?tag=shopwithuso02-20',
    affiliate_link: 'https://www.amazon.com/Nintendo-Switch-OLED-Model/dp/B0CHX1W1XD?tag=shopwithuso02-20',
    retailer: 'Amazon',
    features: ['7-inch OLED Screen', 'Enhanced Audio', '64GB Internal Storage', 'Wide Adjustable Stand', 'Dock with Wired LAN Port'],
    specifications: {
      'Display': '7-inch OLED',
      'Storage': '64GB',
      'Battery Life': '4.5-9 hours',
      'Connectivity': 'Wi-Fi, Bluetooth'
    },
    images: ['https://via.placeholder.com/400x300/FF9900/FFFFFF?text=Nintendo+Switch+OLED'],
    tags: ['Nintendo', 'Switch', 'Gaming', 'OLED', 'Portable']
  },
  {
    name: 'PlayStation 5 Console',
    price: 499.99,
    original_price: 549.99,
    image: 'https://via.placeholder.com/400x300/FF9900/FFFFFF?text=PlayStation+5',
    description: 'Next-generation gaming console with ultra-high speed SSD and ray tracing.',
    category: 'VideoGames',
    brand: 'Sony',
    rating: 4.9,
    review_count: 5670,
    external_url: 'https://www.amazon.com/PlayStation-5-Console/dp/B0CHX1W1XE?tag=shopwithuso02-20',
    affiliate_link: 'https://www.amazon.com/PlayStation-5-Console/dp/B0CHX1W1XE?tag=shopwithuso02-20',
    retailer: 'Amazon',
    features: ['Ultra-High Speed SSD', 'Ray Tracing', '4K Gaming', '3D Audio', 'DualSense Controller'],
    specifications: {
      'Storage': '825GB SSD',
      'Resolution': 'Up to 4K',
      'Frame Rate': 'Up to 120fps',
      'Controller': 'DualSense Wireless Controller'
    },
    images: ['https://via.placeholder.com/400x300/FF9900/FFFFFF?text=PlayStation+5'],
    tags: ['PlayStation', 'Sony', 'Gaming', 'Console', '4K']
  },
  {
    name: 'Apple Watch Series 9 GPS',
    price: 399.00,
    original_price: 429.00,
    image: 'https://via.placeholder.com/400x300/FF9900/FFFFFF?text=Apple+Watch+Series+9',
    description: 'Most advanced Apple Watch with S9 chip and health monitoring features.',
    category: 'Electronics',
    brand: 'Apple',
    rating: 4.6,
    review_count: 2890,
    external_url: 'https://www.amazon.com/Apple-Watch-Series-9-GPS/dp/B0CHX1W1XF?tag=shopwithuso02-20',
    affiliate_link: 'https://www.amazon.com/Apple-Watch-Series-9-GPS/dp/B0CHX1W1XF?tag=shopwithuso02-20',
    retailer: 'Amazon',
    features: ['S9 Chip', 'Health Monitoring', 'Always-On Display', 'Water Resistant', 'GPS'],
    specifications: {
      'Chip': 'S9',
      'Display': 'Always-On Retina',
      'Water Resistance': '50 meters',
      'Battery Life': 'Up to 18 hours'
    },
    images: ['https://via.placeholder.com/400x300/FF9900/FFFFFF?text=Apple+Watch+Series+9'],
    tags: ['Apple Watch', 'Apple', 'Smartwatch', 'Health', 'Fitness']
  },
  {
    name: 'Dell XPS 13 Laptop',
    price: 1299.99,
    original_price: 1499.99,
    image: 'https://via.placeholder.com/400x300/FF9900/FFFFFF?text=Dell+XPS+13',
    description: 'Premium ultrabook with stunning display and powerful performance.',
    category: 'Computers',
    brand: 'Dell',
    rating: 4.4,
    review_count: 1230,
    external_url: 'https://www.amazon.com/Dell-XPS-13-Laptop/dp/B0CHX1W1XG?tag=shopwithuso02-20',
    affiliate_link: 'https://www.amazon.com/Dell-XPS-13-Laptop/dp/B0CHX1W1XG?tag=shopwithuso02-20',
    retailer: 'Amazon',
    features: ['13.4-inch Display', 'Intel Core i7', '16GB RAM', '512GB SSD', 'Windows 11'],
    specifications: {
      'Processor': 'Intel Core i7-1360P',
      'Memory': '16GB LPDDR5',
      'Storage': '512GB SSD',
      'Display': '13.4-inch FHD+'
    },
    images: ['https://via.placeholder.com/400x300/FF9900/FFFFFF?text=Dell+XPS+13'],
    tags: ['Dell', 'XPS', 'Laptop', 'Ultrabook', 'Windows']
  }
];

async function importProducts() {
  console.log('🚀 Starting Amazon products import...');
  console.log(`📋 Will import ${PRODUCTS_TO_IMPORT.length} products`);
  
  let totalImported = 0;
  let totalErrors = 0;
  
  for (let i = 0; i < PRODUCTS_TO_IMPORT.length; i++) {
    const product = PRODUCTS_TO_IMPORT[i];
    console.log(`\n📦 [${i + 1}/${PRODUCTS_TO_IMPORT.length}] Importing: ${product.name}`);
    
    try {
      // Insert into Supabase
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select();

      if (error) {
        console.error(`❌ Error importing ${product.name}:`, error.message);
        totalErrors++;
      } else {
        console.log(`✅ Successfully imported: ${product.name}`);
        totalImported++;
      }
      
      // Small delay between imports
      await new Promise(resolve => setTimeout(resolve, 200));
      
    } catch (error) {
      console.error(`❌ Failed to import ${product.name}:`, error.message);
      totalErrors++;
    }
  }
  
  console.log('\n🎉 Import completed!');
  console.log(`✅ Total imported: ${totalImported} products`);
  console.log(`❌ Total errors: ${totalErrors}`);
  console.log(`📊 Success rate: ${((totalImported / PRODUCTS_TO_IMPORT.length) * 100).toFixed(1)}%`);
  console.log('\n🌐 Check your website at: http://localhost:3000');
  console.log('🔧 Admin panel: http://localhost:3000/admin');
  console.log('🛒 Amazon products: http://localhost:3000/admin/amazon');
}

// Run import
importProducts().catch(console.error);

