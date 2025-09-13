import { Category } from '../types';

export const categories: Category[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Latest gadgets, smartphones, laptops, and electronic devices',
    image: 'https://picsum.photos/400/300?random=1',
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
    image: 'https://picsum.photos/400/300?random=2',
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
    image: 'https://picsum.photos/400/300?random=3',
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
    image: 'https://picsum.photos/400/300?random=4',
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
    image: 'https://picsum.photos/400/300?random=5',
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
    image: 'https://picsum.photos/400/300?random=6',
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
    image: 'https://picsum.photos/400/300?random=7',
    productCount: 0,
    slug: 'beauty-personal-care',
    icon: '💄',
    letter: 'B'
  },
  {
    id: 'health-fitness',
    name: 'Health & Fitness',
    description: 'Fitness equipment, supplements, health monitors, and wellness products',
    image: 'https://picsum.photos/400/300?random=8',
    productCount: 0,
    slug: 'health-fitness',
    icon: '💪',
    letter: 'H'
  },
  {
    id: 'books-media',
    name: 'Books & Media',
    description: 'Books, e-books, movies, music, and digital media',
    image: 'https://picsum.photos/400/300?random=9',
    productCount: 0,
    slug: 'books-media',
    icon: '📚',
    letter: 'B'
  },
  {
    id: 'toys-hobbies',
    name: 'Toys & Hobbies',
    description: 'Toys, collectibles, arts & crafts, and hobby supplies',
    image: 'https://picsum.photos/400/300?random=10',
    productCount: 0,
    slug: 'toys-hobbies',
    icon: '🧸',
    letter: 'T'
  },
  {
    id: 'sports-outdoors',
    name: 'Sports & Outdoors',
    description: 'Sports equipment, outdoor gear, camping, and adventure products',
    image: 'https://picsum.photos/400/300?random=8',
    productCount: 0,
    slug: 'sports-outdoors',
    icon: '⚽',
    letter: 'S'
  },
  {
    id: 'automotive',
    name: 'Automotive',
    description: 'Car parts, accessories, tools, and automotive products',
    image: 'https://picsum.photos/400/300?random=11',
    productCount: 0,
    slug: 'automotive',
    icon: '🚗',
    letter: 'A'
  },
  {
    id: 'baby-kids',
    name: 'Baby & Kids',
    description: 'Baby products, children\'s toys, clothing, and parenting essentials',
    image: 'https://picsum.photos/400/300?random=12',
    productCount: 0,
    slug: 'baby-kids',
    icon: '👶',
    letter: 'B'
  },
  {
    id: 'pet-supplies',
    name: 'Pet Supplies',
    description: 'Pet food, toys, accessories, and care products for all pets',
    image: 'https://picsum.photos/400/300?random=13',
    productCount: 0,
    slug: 'pet-supplies',
    icon: '🐕',
    letter: 'P'
  },
  {
    id: 'office-supplies',
    name: 'Office Supplies',
    description: 'Office furniture, stationery, business supplies, and workplace essentials',
    image: 'https://picsum.photos/400/300?random=14',
    productCount: 0,
    slug: 'office-supplies',
    icon: '📎',
    letter: 'O'
  },
  {
    id: 'tools-hardware',
    name: 'Tools & Hardware',
    description: 'Power tools, hand tools, hardware, and DIY supplies',
    image: 'https://picsum.photos/400/300?random=15',
    productCount: 0,
    slug: 'tools-hardware',
    icon: '🔧',
    letter: 'T'
  },
  {
    id: 'furniture',
    name: 'Furniture',
    description: 'Home furniture, office furniture, and decorative items',
    image: 'https://picsum.photos/400/300?random=16',
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

// Featured categories (trending/popular)
export const featuredCategories: Category[] = [
  categories[0], // Electronics
  categories[1], // Computers & Laptops
  categories[2], // Smartphones
  categories[3], // Gaming
  categories[4], // Home Appliances
  categories[5], // Fashion & Clothing
  categories[16], // Furniture
];

// New categories (recently added)
export const newCategories: Category[] = [
  categories[10], // Sports & Outdoors
  categories[11], // Automotive
  categories[12], // Baby & Kids
  categories[13], // Pet Supplies
  categories[14], // Office Supplies
  categories[15], // Tools & Hardware
];

// Category subcategories mapping
export const categorySubcategories: Record<string, string[]> = {
  'electronics': [
    'Smartphones',
    'Tablets',
    'Smartwatches',
    'Headphones',
    'Speakers',
    'Cameras',
    'TVs & Home Theater',
    'Audio Equipment'
  ],
  'computers-laptops': [
    'Laptops',
    'Desktop Computers',
    'Tablets',
    'Monitors',
    'Keyboards',
    'Mice',
    'Storage',
    'Networking'
  ],
  'smartphones': [
    'iPhone',
    'Samsung',
    'Google Pixel',
    'OnePlus',
    'Xiaomi',
    'Phone Cases',
    'Screen Protectors',
    'Chargers'
  ],
  'gaming': [
    'Gaming Consoles',
    'PC Gaming',
    'Gaming Accessories',
    'Video Games',
    'Gaming Chairs',
    'Gaming Headsets',
    'Gaming Mice',
    'Gaming Keyboards'
  ],
  'home-appliances': [
    'Kitchen Appliances',
    'Refrigerators',
    'Washing Machines',
    'Dishwashers',
    'Microwaves',
    'Coffee Makers',
    'Smart Home',
    'Air Purifiers'
  ],
  'fashion': [
    'Men\'s Clothing',
    'Women\'s Clothing',
    'Kids\' Clothing',
    'Shoes',
    'Bags & Purses',
    'Jewelry',
    'Watches',
    'Accessories'
  ]
};

// Helper function to get category by slug
export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find(category => category.slug === slug);
};

// Helper function to get category by id
export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(category => category.id === id);
};

// Helper function to update product count for categories
export const updateCategoryProductCounts = (products: any[], categoriesToUpdate: Category[] = categories): Category[] => {
  const productCounts: Record<string, number> = {};
  
  // Count products per category
  products.forEach(product => {
    const categoryId = product.category?.toLowerCase().replace(/\s+/g, '-') || 'other';
    productCounts[categoryId] = (productCounts[categoryId] || 0) + 1;
  });
  
  // Update categories with product counts
  return categoriesToUpdate.map(category => ({
    ...category,
    productCount: productCounts[category.id] || 0
  }));
};
