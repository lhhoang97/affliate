const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rlgjpejeulxvfatwvniq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsZ2pwZWpldWx4dmZhdHd2bmlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDk0ODAsImV4cCI6MjA3MTI4NTQ4MH0.2d3RgtqDg-3PSuK85smraSgo7Zt2WYymQzRa8bgNltg';

const supabase = createClient(supabaseUrl, supabaseKey);

const sampleProducts = [
  {
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with A17 Pro chip and titanium design',
    price: 999.99,
    original_price: 1099.99,
    image: 'https://images.unsplash.com/photo-1592899677977-9c8c8b8b8b8b?w=400',
    category: 'Electronics',
    brand: 'Apple',
    rating: 4.8,
    review_count: 1250,
    in_stock: true,
    features: ['A17 Pro chip', 'Titanium design', '48MP camera', 'USB-C'],
    tags: ['smartphone', 'apple', 'premium'],
    affiliate_link: 'https://amazon.com/iphone-15-pro',
    external_url: 'https://amazon.com/iphone-15-pro'
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Premium Android smartphone with S Pen',
    price: 1199.99,
    original_price: 1299.99,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
    category: 'Electronics',
    brand: 'Samsung',
    rating: 4.7,
    review_count: 890,
    in_stock: true,
    features: ['S Pen', '200MP camera', 'S24 Ultra chip', '5G'],
    tags: ['smartphone', 'samsung', 'android'],
    affiliate_link: 'https://amazon.com/galaxy-s24-ultra',
    external_url: 'https://amazon.com/galaxy-s24-ultra'
  },
  {
    name: 'MacBook Pro 16" M3',
    description: 'Powerful laptop for professionals',
    price: 2499.99,
    original_price: 2699.99,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400',
    category: 'Computers',
    brand: 'Apple',
    rating: 4.9,
    review_count: 456,
    in_stock: true,
    features: ['M3 chip', '16-inch display', '32GB RAM', '1TB SSD'],
    tags: ['laptop', 'apple', 'professional'],
    affiliate_link: 'https://amazon.com/macbook-pro-16',
    external_url: 'https://amazon.com/macbook-pro-16'
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise canceling headphones',
    price: 399.99,
    original_price: 449.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    category: 'Audio',
    brand: 'Sony',
    rating: 4.6,
    review_count: 2340,
    in_stock: true,
    features: ['Noise canceling', '30-hour battery', 'Quick charge', 'Bluetooth 5.2'],
    tags: ['headphones', 'wireless', 'noise-canceling'],
    affiliate_link: 'https://amazon.com/sony-wh1000xm5',
    external_url: 'https://amazon.com/sony-wh1000xm5'
  },
  {
    name: 'Nintendo Switch OLED',
    description: 'Gaming console with vibrant OLED display',
    price: 349.99,
    original_price: 399.99,
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400',
    category: 'Gaming',
    brand: 'Nintendo',
    rating: 4.5,
    review_count: 1890,
    in_stock: true,
    features: ['OLED display', '64GB storage', 'Joy-Con controllers', 'Dock included'],
    tags: ['gaming', 'console', 'portable'],
    affiliate_link: 'https://amazon.com/nintendo-switch-oled',
    external_url: 'https://amazon.com/nintendo-switch-oled'
  },
  {
    name: 'Dyson V15 Detect Vacuum',
    description: 'Cordless vacuum with laser dust detection',
    price: 749.99,
    original_price: 799.99,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    category: 'Home',
    brand: 'Dyson',
    rating: 4.4,
    review_count: 567,
    in_stock: true,
    features: ['Laser dust detection', '60-minute runtime', 'HEPA filtration', 'Cordless'],
    tags: ['vacuum', 'cordless', 'home'],
    affiliate_link: 'https://amazon.com/dyson-v15-detect',
    external_url: 'https://amazon.com/dyson-v15-detect'
  }
];

async function addSampleProducts() {
  try {
    console.log('Adding sample products to Supabase...');
    
    const { data, error } = await supabase
      .from('products')
      .insert(sampleProducts);
    
    if (error) {
      console.error('Error adding products:', error);
      return;
    }
    
    console.log('✅ Successfully added', sampleProducts.length, 'sample products!');
    console.log('Products added:', data);
    
  } catch (err) {
    console.error('Error:', err);
  }
}

addSampleProducts();
