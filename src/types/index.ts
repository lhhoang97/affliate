export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  brand: string;
  retailer?: string;
  inStock: boolean;
  features: string[];
  specifications: Record<string, string>;
  images: string[];
  tags: string[];
  externalUrl?: string;
  affiliateLink?: string;
  source?: 'manual' | 'amazon' | 'ebay' | 'aliexpress';
  asin?: string;
  // Video fields
  videoUrl?: string;
  videoFile?: string;
  videoType?: 'youtube' | 'vimeo' | 'direct' | 'upload';
  // Deal Details content
  dealTitle?: string;
  dealDescription?: string;
  dealCategories?: string[];
  productDetails?: string;
  keyFeatures?: string[];
  communityNotes?: string;
  aboutPoster?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  helpful: number;
  notHelpful: number;
  verified: boolean;
  createdAt: string;
  images?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  slug: string;
  icon?: string;
  letter?: string;
  subcategories?: Subcategory[];
}

export interface FilterOptions {
  priceRange: [number, number];
  categories: string[];
  brands: string[];
  ratings: number[];
  inStock: boolean;
}

export interface SearchParams {
  query: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sortBy?: 'price' | 'rating' | 'name' | 'newest';
  sortOrder?: 'asc' | 'desc';
}

// Authentication types
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isVerified: boolean;
  role?: 'admin' | 'user';
  phone?: string;
  address?: string;
  bio?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Cart types
export interface BundleOption {
  type: 'single' | 'double' | 'triple';
  quantity: number;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  discountText: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  user_id: string;
  quantity: number;
  bundleOption?: BundleOption;
  created_at: string;
  updated_at: string;
  // Joined product data
  product?: Product;
  // Bundle deal calculations
  bundleSavings?: {
    originalPrice: number;
    discountAmount: number;
    finalPrice: number;
    savings: number;
    appliedDeal?: any;
  };
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

export interface CartSummary {
  totalItems: number;
  totalPrice: number;
  itemCount: number;
  totalSavings?: number;
}

// Order types
export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  total_amount: number;
  shipping_amount: number;
  tax_amount: number;
  discount_amount: number;
  payment_method?: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  shipping_address: any;
  billing_address?: any;
  tracking_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Joined order items data
  order_items?: OrderItem[];
  user?: any; // User profile data
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
  // Joined data
  product?: Product;
}

// Form validation types
export interface FormErrors {
  [key: string]: string;
}

export interface ValidationRules {
  [key: string]: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => string | null;
  };
}
