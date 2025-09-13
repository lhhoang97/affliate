import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Product } from '../types';
import { getAllProducts, updateProduct, createProduct, deleteProduct } from '../services/productService';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
  refreshHomepageProducts: () => Promise<void>;
  updateProductById: (id: string, updates: Partial<Product>) => Promise<void>;
  createNewProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteProductById: (id: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  // Force show fallback products immediately
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Samsung Galaxy S21',
      price: 799,
      originalPrice: 899,
      description: 'Premium Android smartphone with 5G capability.',
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400',
      images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400'],
      category: 'Smartphones',
      brand: 'Samsung',
      rating: 4.6,
      reviewCount: 1892,
      inStock: true,
      affiliateLink: '',
      externalUrl: '',
      tags: ['smartphone', 'samsung', 'android', '5g'],
      features: ['5G capability', 'Triple camera', 'Wireless charging'],
      specifications: { 'Screen Size': '6.2 inches', 'Storage': '128GB' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'iPhone 15 Pro',
      price: 999.99,
      originalPrice: 1099.99,
      description: 'Latest iPhone with titanium design and A17 Pro chip.',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
      images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400'],
      category: 'Smartphones',
      brand: 'Apple',
      rating: 4.8,
      reviewCount: 2156,
      inStock: true,
      affiliateLink: '',
      externalUrl: '',
      tags: ['iphone', 'apple', 'titanium', 'a17'],
      features: ['Titanium design', 'A17 Pro chip', 'USB-C'],
      specifications: { 'Screen Size': '6.1 inches', 'Storage': '128GB' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);
  const [loading, setLoading] = useState(false); // Start with false
  const [error, setError] = useState<string | null>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const loadProducts = useCallback(async (showLoading: boolean = true, useHomepageOptimization: boolean = true) => {
    console.log('ProductContext - loadProducts called with:', { showLoading, useHomepageOptimization, isLoadingProducts });
    
    // Prevent multiple simultaneous calls
    if (isLoadingProducts) {
      console.log('ProductContext - Already loading products, skipping...');
      return;
    }
    
    setIsLoadingProducts(true);
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);
      
      console.log('ProductContext - Calling getAllProducts...');
      const allProducts = await getAllProducts();
      console.log('ProductContext - getAllProducts returned:', allProducts.length, 'products');
      
      if (allProducts.length > 0) {
        console.log('ProductContext - Setting products from database:', allProducts.length);
        setProducts(allProducts);
      } else {
        console.log('ProductContext - No products from database, using fallback');
        // Fallback data for testing
        const fallbackProducts = [
          {
            id: '1',
            name: 'Samsung Galaxy S21',
            price: 799,
            originalPrice: 899,
            description: 'Premium Android smartphone with 5G capability.',
            image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400',
            images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400'],
            category: 'Smartphones',
            brand: 'Samsung',
            rating: 4.6,
            reviewCount: 1892,
            inStock: true,
            affiliateLink: '',
            externalUrl: '',
            tags: ['smartphone', 'samsung', 'android', '5g'],
            features: ['5G capability', 'Triple camera', 'Wireless charging'],
            specifications: { 'Screen Size': '6.2 inches', 'Storage': '128GB' },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '2',
            name: 'iPhone 15 Pro',
            price: 999.99,
            originalPrice: 1099.99,
            description: 'Latest iPhone with titanium design and A17 Pro chip.',
            image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
            images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400'],
            category: 'Smartphones',
            brand: 'Apple',
            rating: 4.8,
            reviewCount: 2156,
            inStock: true,
            affiliateLink: '',
            externalUrl: '',
            tags: ['iphone', 'apple', 'titanium', 'a17'],
            features: ['Titanium design', 'A17 Pro chip', 'USB-C'],
            specifications: { 'Screen Size': '6.1 inches', 'Storage': '128GB' },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
        setProducts(fallbackProducts);
        console.log('ProductContext - Fallback products set:', fallbackProducts.length);
      }
    } catch (err) {
      console.error('ProductContext - Error loading products:', err);
      setError('Failed to load products from database');
      setProducts([]);
    } finally {
      setIsLoadingProducts(false);
      if (showLoading) {
        console.log('ProductContext - Setting loading to false');
        setLoading(false);
      }
    }
  }, []); // Empty dependency array to prevent infinite loop

  const refreshProducts = async () => {
    console.log('ProductContext - Refreshing all products...');
    await loadProducts(true, false); // Show loading for manual refresh, load all products
  };

  const refreshHomepageProducts = async () => {
    console.log('ProductContext - Refreshing homepage products...');
    await loadProducts(true, true); // Show loading for manual refresh, use homepage optimization
  };

  const updateProductById = async (id: string, updates: Partial<Product>) => {
    try {
      console.log('ProductContext - Updating product:', id, updates);
      const updatedProduct = await updateProduct(id, updates);
      console.log('ProductContext - Updated product:', updatedProduct);
      
      // Force refresh all products to ensure sync
      console.log('ProductContext - Force refreshing all products after update...');
      await loadProducts(false); // Don't show loading for update refresh
    } catch (err) {
      console.error('ProductContext - Error updating product:', err);
      setError('Failed to update product in database');
      throw err;
    }
  };

  const createNewProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log('Creating product:', product);
      const newProduct = await createProduct(product);
      console.log('Created product:', newProduct);
      setProducts(prev => [...prev, newProduct]);
    } catch (err) {
      console.error('Error creating product:', err);
      setError('Failed to create product in database');
      throw err;
    }
  };

  const deleteProductById = async (id: string) => {
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
      throw err;
    }
  };

  useEffect(() => {
    console.log('ProductContext - useEffect: Starting initial load...');
    loadProducts(true, true);
    
    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log('ProductContext - Timeout reached, forcing loading to false');
      setLoading(false);
      setIsLoadingProducts(false);
    }, 3000); // 3 second timeout - faster response
    
    return () => clearTimeout(timeoutId);
  }, []); // Empty dependency array to run only once on mount

  // Auto-refresh disabled to prevent infinite loops
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     console.log('ProductContext - Auto-refreshing homepage products...');
  //     loadProducts(false, true);
  //   }, 300000);
  //   return () => clearInterval(interval);
  // }, [loadProducts]);

  const value: ProductContextType = {
    products,
    loading,
    error,
    refreshProducts,
    refreshHomepageProducts,
    updateProductById,
    createNewProduct,
    deleteProductById,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
