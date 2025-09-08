import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import { getAllProducts, getHomepageProducts, updateProduct, createProduct, deleteProduct } from '../services/productService';

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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async (showLoading: boolean = true, useHomepageOptimization: boolean = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);
      
      if (useHomepageOptimization) {
        console.log('ProductContext - Loading optimized homepage products...');
        const homepageProducts = await getHomepageProducts();
        console.log('ProductContext - Loaded homepage products count:', homepageProducts.length);
        setProducts(homepageProducts);
      } else {
        console.log('ProductContext - Loading all products from database...');
        const allProducts = await getAllProducts();
        console.log('ProductContext - Loaded products count:', allProducts.length);
        console.log('ProductContext - Sample products:', allProducts.slice(0, 3).map(p => ({ id: p.id, name: p.name, category: p.category })));
        
        // Debug: Check for smartphone products
        const smartphoneProducts = allProducts.filter(p => p.category === 'Smartphones');
        console.log('ProductContext - Smartphone products found:', smartphoneProducts.length);
        smartphoneProducts.forEach(p => {
          console.log('ProductContext - Smartphone:', p.name, p.category);
        });
        
        setProducts(allProducts);
      }
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products from database');
      // Don't use fallback data - let user know there's an issue
      setProducts([]);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

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
      setError('Failed to update product in database, updating local state only');
      // Fallback: update local state only
      setProducts(prev => {
        const newProducts = prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p);
        console.log('ProductContext - Fallback update, new products state:', newProducts);
        return newProducts;
      });
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
      setError('Failed to create product in database, adding to local state only');
      // Fallback: add to local state only
      const newProduct: Product = {
        ...product,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setProducts(prev => [...prev, newProduct]);
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
    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log('ProductContext - Timeout reached, forcing loading to false');
      setLoading(false);
    }, 15000); // 15 second timeout - increased to allow for slower connections

    loadProducts(true, true).finally(() => {
      clearTimeout(timeoutId);
    });
  }, []);

  // Auto-refresh homepage products every 5 minutes to keep in sync (optimized frequency)
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('ProductContext - Auto-refreshing homepage products...');
      loadProducts(false, true); // Don't show loading for auto-refresh, use homepage optimization
    }, 300000); // Refresh every 5 minutes instead of 30 seconds

    return () => clearInterval(interval);
  }, []);

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
