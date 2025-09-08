const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const testProducts = [
  {
    title: "iPhone 15 Pro Max 256GB",
    description: "Latest iPhone with titanium design and A17 Pro chip",
    price: 1199.99,
    original_price: 1299.99,
    discount_percent: 8,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
    category: "Electronics",
    brand: "Apple",
    rating: 4.8,
    review_count: 1250,
    availability: "In Stock",
    retailer: "Apple Store",
    product_url: "https://apple.com/iphone-15-pro",
    created_at: new Date().toISOString()
  },
  {
    title: "Samsung Galaxy S24 Ultra",
    description: "Premium Android smartphone with S Pen and AI features",
    price: 1099.99,
    original_price: 1199.99,
    discount_percent: 8,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
    category: "Electronics",
    brand: "Samsung",
    rating: 4.7,
    review_count: 980,
    availability: "In Stock",
    retailer: "Samsung Store",
    product_url: "https://samsung.com/galaxy-s24-ultra",
    created_at: new Date().toISOString()
  },
  {
    title: "MacBook Pro 14-inch M3",
    description: "Powerful laptop with M3 chip for professionals",
    price: 1999.99,
    original_price: 2199.99,
    discount_percent: 9,
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400",
    category: "Electronics",
    brand: "Apple",
    rating: 4.9,
    review_count: 756,
    availability: "In Stock",
    retailer: "Apple Store",
    product_url: "https://apple.com/macbook-pro-14",
    created_at: new Date().toISOString()
  },
  {
    title: "Sony WH-1000XM5 Headphones",
    description: "Industry-leading noise canceling wireless headphones",
    price: 349.99,
    original_price: 399.99,
    discount_percent: 13,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    category: "Electronics",
    brand: "Sony",
    rating: 4.6,
    review_count: 2100,
    availability: "In Stock",
    retailer: "Sony Store",
    product_url: "https://sony.com/wh-1000xm5",
    created_at: new Date().toISOString()
  },
  {
    title: "Nike Air Max 270",
    description: "Comfortable running shoes with Max Air cushioning",
    price: 129.99,
    original_price: 150.00,
    discount_percent: 13,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    category: "Fashion",
    brand: "Nike",
    rating: 4.4,
    review_count: 3200,
    availability: "In Stock",
    retailer: "Nike Store",
    product_url: "https://nike.com/air-max-270",
    created_at: new Date().toISOString()
  }
];

async function addTestProducts() {
  try {
    console.log('🔄 Adding test products...');
    
    const { data, error } = await supabase
      .from('products')
      .insert(testProducts)
      .select();

    if (error) {
      console.log('❌ Error adding products:', error.message);
      return;
    }

    console.log('✅ Successfully added', data.length, 'test products');
    console.log('Products added:');
    data.forEach((product, index) => {
      console.log(`${index + 1}. ${product.title} - $${product.price}`);
    });

  } catch (err) {
    console.log('❌ Unexpected error:', err.message);
  }
}

addTestProducts();