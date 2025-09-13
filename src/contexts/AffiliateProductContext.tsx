import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { affiliateService, AffiliateProduct, AffiliateRetailer } from '../services/affiliateService';

interface AffiliateProductContextType {
  products: AffiliateProduct[];
  retailers: AffiliateRetailer[];
  loading: boolean;
  error: string | null;
  loadProducts: () => Promise<void>;
  loadRetailers: () => Promise<void>;
  getProductById: (id: string) => AffiliateProduct | null;
  getRetailerByName: (name: string) => AffiliateRetailer | null;
  trackClick: (productId: string, retailer: string) => Promise<void>;
}

const AffiliateProductContext = createContext<AffiliateProductContextType | undefined>(undefined);

interface AffiliateProductProviderProps {
  children: ReactNode;
}

export const AffiliateProductProvider: React.FC<AffiliateProductProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<AffiliateProduct[]>([]);
  const [retailers, setRetailers] = useState<AffiliateRetailer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await affiliateService.getAffiliateProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
      console.error('Error loading affiliate products:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadRetailers = async () => {
    try {
      setError(null);
      const data = await affiliateService.getAffiliateRetailers();
      setRetailers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load retailers');
      console.error('Error loading retailers:', err);
    }
  };

  const getProductById = (id: string): AffiliateProduct | null => {
    return products.find(product => product.id === id) || null;
  };

  const getRetailerByName = (name: string): AffiliateRetailer | null => {
    return retailers.find(retailer => retailer.name === name) || null;
  };

  const trackClick = async (productId: string, retailer: string) => {
    try {
      await affiliateService.trackAffiliateClick(productId, retailer, {
        user_ip: 'unknown', // Will be filled by backend
        user_agent: navigator.userAgent,
        referrer: document.referrer
      });
    } catch (err) {
      console.error('Error tracking click:', err);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadProducts();
    loadRetailers();
  }, []);

  const value: AffiliateProductContextType = {
    products,
    retailers,
    loading,
    error,
    loadProducts,
    loadRetailers,
    getProductById,
    getRetailerByName,
    trackClick
  };

  return (
    <AffiliateProductContext.Provider value={value}>
      {children}
    </AffiliateProductContext.Provider>
  );
};

export const useAffiliateProducts = (): AffiliateProductContextType => {
  const context = useContext(AffiliateProductContext);
  if (context === undefined) {
    throw new Error('useAffiliateProducts must be used within an AffiliateProductProvider');
  }
  return context;
};
