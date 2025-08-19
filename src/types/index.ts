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
  inStock: boolean;
  features: string[];
  specifications: Record<string, string>;
  images: string[];
  tags: string[];
  externalUrl?: string;
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

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  slug: string;
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
export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  addedAt: string;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
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
