import { Product, Review, Category } from '../types';

export const mockProducts: Product[] = [
  // iPhone Products
  {
    id: 'iphone-11',
    name: 'Apple iPhone 11 128GB',
    description: 'Latest iPhone with A13 Bionic chip and dual camera system.',
    price: 699,
    originalPrice: 799,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
    rating: 4.7,
    reviewCount: 2156,
    category: 'Electronics',
    brand: 'Apple',
    inStock: true,
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
    tags: ['smartphone', 'apple', 'iphone', '5g'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'iphone-13',
    name: 'Apple iPhone 13 128GB',
    description: 'Advanced iPhone with A15 Bionic chip and pro camera system.',
    price: 799,
    originalPrice: 899,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
    rating: 4.8,
    reviewCount: 1892,
    category: 'Electronics',
    brand: 'Apple',
    inStock: true,
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
    tags: ['smartphone', 'apple', 'iphone', '5g'],
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z'
  },
  {
    id: 'iphone-12-64',
    name: 'Apple iPhone 12 64GB',
    description: 'Premium iPhone with A14 Bionic chip and MagSafe technology.',
    price: 599,
    originalPrice: 699,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
    rating: 4.6,
    reviewCount: 1654,
    category: 'Electronics',
    brand: 'Apple',
    inStock: true,
    features: ['A14 Bionic chip', 'MagSafe', 'Face ID', '5G capable'],
    specifications: {
      'Screen Size': '6.1 inches',
      'Storage': '64GB',
      'Color': 'Multiple colors',
      'Chip': 'A14 Bionic',
      'Camera': '12MP Dual camera'
    },
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400'
    ],
    tags: ['smartphone', 'apple', 'iphone', '5g'],
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z'
  },
  {
    id: 'iphone-12-128',
    name: 'Apple iPhone 12 128GB',
    description: 'Premium iPhone with A14 Bionic chip and MagSafe technology.',
    price: 649,
    originalPrice: 749,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
    rating: 4.6,
    reviewCount: 1654,
    category: 'Electronics',
    brand: 'Apple',
    inStock: true,
    features: ['A14 Bionic chip', 'MagSafe', 'Face ID', '5G capable'],
    specifications: {
      'Screen Size': '6.1 inches',
      'Storage': '128GB',
      'Color': 'Multiple colors',
      'Chip': 'A14 Bionic',
      'Camera': '12MP Dual camera'
    },
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400'
    ],
    tags: ['smartphone', 'apple', 'iphone', '5g'],
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z'
  },
  // Nike Products
  {
    id: 'nike-air-max',
    name: 'Giày Nike Air Max 270',
    description: 'Comfortable running shoes with Air Max technology.',
    price: 1200000,
    originalPrice: 1450000,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    rating: 4.5,
    reviewCount: 892,
    category: 'Fashion',
    brand: 'Nike',
    inStock: true,
    features: ['Air Max technology', 'Breathable mesh', 'Comfortable fit', 'Durable sole'],
    specifications: {
      'Type': 'Running Shoes',
      'Material': 'Mesh and synthetic',
      'Sole': 'Rubber',
      'Closure': 'Lace-up',
      'Weight': 'Lightweight'
    },
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'
    ],
    tags: ['shoes', 'nike', 'running', 'sports'],
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-18T10:00:00Z'
  },
  // Additional iPhone Products to match reference
  {
    id: 'iphone-14',
    name: 'Apple iPhone 14 128GB',
    description: 'Latest iPhone with A15 Bionic chip and advanced camera system.',
    price: 899,
    originalPrice: 999,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
    rating: 4.8,
    reviewCount: 1456,
    category: 'Electronics',
    brand: 'Apple',
    inStock: true,
    features: ['A15 Bionic chip', 'Advanced camera system', 'Face ID', 'Emergency SOS'],
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
    tags: ['smartphone', 'apple', 'iphone', '5g'],
    createdAt: '2024-01-19T10:00:00Z',
    updatedAt: '2024-01-19T10:00:00Z'
  },
  {
    id: 'iphone-15',
    name: 'Apple iPhone 15 128GB',
    description: 'Revolutionary iPhone with A16 Bionic chip and USB-C.',
    price: 999,
    originalPrice: 1099,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
    rating: 4.9,
    reviewCount: 2034,
    category: 'Electronics',
    brand: 'Apple',
    inStock: true,
    features: ['A16 Bionic chip', 'USB-C connector', 'Face ID', 'Dynamic Island'],
    specifications: {
      'Screen Size': '6.1 inches',
      'Storage': '128GB',
      'Color': 'Multiple colors',
      'Chip': 'A16 Bionic',
      'Camera': '48MP Main camera'
    },
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400'
    ],
    tags: ['smartphone', 'apple', 'iphone', '5g'],
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z'
  },
  {
    id: 'iphone-15-pro',
    name: 'Apple iPhone 15 Pro 128GB',
    description: 'Professional iPhone with A17 Pro chip and titanium design.',
    price: 1199,
    originalPrice: 1299,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
    rating: 4.9,
    reviewCount: 1789,
    category: 'Electronics',
    brand: 'Apple',
    inStock: true,
    features: ['A17 Pro chip', 'Titanium design', 'Pro camera system', 'Action button'],
    specifications: {
      'Screen Size': '6.1 inches',
      'Storage': '128GB',
      'Color': 'Multiple colors',
      'Chip': 'A17 Pro',
      'Camera': '48MP Pro camera'
    },
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400'
    ],
    tags: ['smartphone', 'apple', 'iphone', '5g'],
    createdAt: '2024-01-21T10:00:00Z',
    updatedAt: '2024-01-21T10:00:00Z'
  },
  {
    id: 'iphone-15-pro-max',
    name: 'Apple iPhone 15 Pro Max 256GB',
    description: 'The most advanced iPhone with A17 Pro chip and pro camera system.',
    price: 1399,
    originalPrice: 1499,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
    rating: 4.9,
    reviewCount: 2341,
    category: 'Electronics',
    brand: 'Apple',
    inStock: true,
    features: ['A17 Pro chip', 'Titanium design', 'Pro camera system', '5x Telephoto'],
    specifications: {
      'Screen Size': '6.7 inches',
      'Storage': '256GB',
      'Color': 'Multiple colors',
      'Chip': 'A17 Pro',
      'Camera': '48MP Pro camera'
    },
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400'
    ],
    tags: ['smartphone', 'apple', 'iphone', '5g'],
    createdAt: '2024-01-22T10:00:00Z',
    updatedAt: '2024-01-22T10:00:00Z'
  },
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    description: 'The most advanced iPhone ever with A17 Pro chip, titanium design, and pro camera system.',
    price: 1199,
    originalPrice: 1299,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
    rating: 4.8,
    reviewCount: 1247,
    category: 'Electronics',
    brand: 'Apple',
    inStock: true,
    features: [
      'A17 Pro chip',
      'Titanium design',
      'Pro camera system',
      'USB-C connector',
      'Action button'
    ],
    specifications: {
      'Screen Size': '6.7 inches',
      'Storage': '256GB',
      'Color': 'Natural Titanium',
      'Chip': 'A17 Pro',
      'Camera': '48MP Main + 12MP Ultra Wide + 12MP Telephoto'
    },
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400'
    ],
    tags: ['smartphone', 'apple', 'iphone', '5g'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Revolutionary AI features with S Pen, pro-grade camera, and titanium frame.',
    price: 1299,
    originalPrice: 1399,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400',
    rating: 4.7,
    reviewCount: 892,
    category: 'Electronics',
    brand: 'Samsung',
    inStock: true,
    features: [
      'Galaxy AI',
      'S Pen included',
      '200MP camera',
      'Titanium frame',
      '5000mAh battery'
    ],
    specifications: {
      'Screen Size': '6.8 inches',
      'Storage': '512GB',
      'Color': 'Titanium Gray',
      'Chip': 'Snapdragon 8 Gen 3',
      'Camera': '200MP Main + 12MP Ultra Wide + 50MP Telephoto + 10MP Telephoto'
    },
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400',
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400',
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400'
    ],
    tags: ['smartphone', 'samsung', 'galaxy', '5g'],
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z'
  },
  {
    id: '3',
    name: 'MacBook Pro 16" M3 Max',
    description: 'The most powerful MacBook Pro ever with M3 Max chip and Liquid Retina XDR display.',
    price: 3499,
    originalPrice: 3699,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    rating: 4.9,
    reviewCount: 567,
    category: 'Electronics',
    brand: 'Apple',
    inStock: true,
    features: [
      'M3 Max chip',
      '16-inch Liquid Retina XDR display',
      'Up to 128GB unified memory',
      'Up to 8TB SSD',
      'Pro camera system'
    ],
    specifications: {
      'Processor': 'M3 Max',
      'Memory': '32GB unified memory',
      'Storage': '1TB SSD',
      'Display': '16-inch Liquid Retina XDR',
      'Battery': 'Up to 22 hours'
    },
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'
    ],
    tags: ['laptop', 'apple', 'macbook', 'm3'],
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z'
  },
  {
    id: '4',
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading noise canceling wireless headphones with exceptional sound quality.',
    price: 399,
    originalPrice: 449,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    rating: 4.6,
    reviewCount: 2341,
    category: 'Electronics',
    brand: 'Sony',
    inStock: true,
    features: [
      'Industry-leading noise canceling',
      '30-hour battery life',
      'Quick Charge',
      'Touch controls',
      'Multipoint connection'
    ],
    specifications: {
      'Driver Unit': '30mm',
      'Frequency Response': '4Hz-40,000Hz',
      'Battery Life': 'Up to 30 hours',
      'Weight': '250g',
      'Connectivity': 'Bluetooth 5.2'
    },
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'
    ],
    tags: ['headphones', 'sony', 'wireless', 'noise-canceling'],
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-05T10:00:00Z'
  },
  {
    id: '5',
    name: 'Nike Air Max 270',
    description: 'Maximum comfort with the tallest Air unit yet for all-day wear.',
    price: 150,
    originalPrice: 180,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    rating: 4.4,
    reviewCount: 1892,
    category: 'Fashion',
    brand: 'Nike',
    inStock: true,
    features: [
      'Tallest Air unit yet',
      'Breathable mesh upper',
      'Foam midsole',
      'Rubber outsole',
      'All-day comfort'
    ],
    specifications: {
      'Weight': '320g',
      'Drop': '10mm',
      'Upper': 'Mesh',
      'Midsole': 'Foam + Air',
      'Outsole': 'Rubber'
    },
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'
    ],
    tags: ['shoes', 'nike', 'running', 'comfort'],
    createdAt: '2024-01-12T10:00:00Z',
    updatedAt: '2024-01-12T10:00:00Z'
  },
  {
    id: '6',
    name: 'Apple Watch Series 9',
    description: 'The most advanced Apple Watch ever with new features and faster performance.',
    price: 399,
    originalPrice: 449,
    image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca359?w=400',
    rating: 4.7,
    reviewCount: 892,
    category: 'Electronics',
    brand: 'Apple',
    inStock: true,
    features: [
      'Always-On Retina display',
      'Heart rate monitoring',
      'GPS tracking',
      'Water resistant',
      'Fast charging'
    ],
    specifications: {
      'Display': 'Always-On Retina',
      'Battery Life': 'Up to 18 hours',
      'Water Resistance': '50m',
      'Size': '45mm',
      'Connectivity': 'GPS + Cellular'
    },
    images: [
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca359?w=400',
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca359?w=400',
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca359?w=400'
    ],
    tags: ['smartwatch', 'apple', 'fitness', 'health'],
    createdAt: '2024-01-08T10:00:00Z',
    updatedAt: '2024-01-08T10:00:00Z'
  },
  {
    id: '7',
    name: 'Canon EOS R5',
    description: 'Professional mirrorless camera with 45MP sensor and 8K video recording.',
    price: 3899,
    originalPrice: 4299,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
    rating: 4.9,
    reviewCount: 234,
    category: 'Electronics',
    brand: 'Canon',
    inStock: true,
    features: [
      '45MP Full-Frame CMOS Sensor',
      '8K RAW Video Recording',
      'Dual Card Slots',
      '5-axis IBIS',
      'Weather-sealed body'
    ],
    specifications: {
      'Sensor': '45MP Full-Frame CMOS',
      'Video': '8K RAW up to 30fps',
      'Autofocus': 'Dual Pixel CMOS AF II',
      'Stabilization': '5-axis IBIS',
      'Connectivity': 'Wi-Fi + Bluetooth'
    },
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400'
    ],
    tags: ['camera', 'canon', 'mirrorless', 'professional'],
    createdAt: '2024-01-03T10:00:00Z',
    updatedAt: '2024-01-03T10:00:00Z'
  },
  {
    id: '8',
    name: 'Dyson V15 Detect',
    description: 'Cord-free vacuum with laser dust detection and powerful suction.',
    price: 699,
    originalPrice: 799,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    rating: 4.6,
    reviewCount: 567,
    category: 'Home & Garden',
    brand: 'Dyson',
    inStock: true,
    features: [
      'Laser dust detection',
      '60-minute runtime',
      'HEPA filtration',
      'LCD screen',
      'Cord-free operation'
    ],
    specifications: {
      'Runtime': 'Up to 60 minutes',
      'Suction': '240 AW',
      'Filtration': 'HEPA',
      'Weight': '2.6kg',
      'Charging Time': '4.5 hours'
    },
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
    ],
    tags: ['vacuum', 'dyson', 'cordless', 'cleaning'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  // Ví dụ sản phẩm mới - Bạn có thể thêm sản phẩm mới ở đây
  {
    id: '9',
    name: 'Sony PlayStation 5',
    description: 'Next-generation gaming console with lightning-fast loading and stunning graphics.',
    price: 499,
    originalPrice: 599,
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400',
    rating: 4.9,
    reviewCount: 2341,
    category: 'Electronics',
    brand: 'Sony',
    inStock: true,
    features: [
      '4K gaming',
      'Ray tracing',
      '3D audio',
      'Ultra-high speed SSD',
      'Backward compatibility'
    ],
    specifications: {
      'CPU': 'AMD Zen 2',
      'GPU': 'AMD RDNA 2',
      'Storage': '825GB SSD',
      'Memory': '16GB GDDR6',
      'Resolution': 'Up to 8K'
    },
    images: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400',
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400',
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400'
    ],
    tags: ['gaming', 'console', 'playstation', '4k'],
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-01-25T10:00:00Z'
  }
];

export const mockReviews: Review[] = [
  {
    id: '1',
    productId: '1',
    userId: 'user1',
    userName: 'John Doe',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50',
    rating: 5,
    title: 'Amazing phone!',
    content: 'This is the best iPhone I\'ve ever owned. The camera quality is incredible and the performance is outstanding.',
    helpful: 45,
    notHelpful: 2,
    verified: true,
    createdAt: '2024-01-25T10:00:00Z'
  },
  {
    id: '2',
    productId: '1',
    userId: 'user2',
    userName: 'Jane Smith',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50',
    rating: 4,
    title: 'Great but expensive',
    content: 'The phone is excellent but quite expensive. The battery life is good and the camera is amazing.',
    helpful: 23,
    notHelpful: 5,
    verified: true,
    createdAt: '2024-01-24T10:00:00Z'
  }
];

export const mockCategories: Category[] = [];
