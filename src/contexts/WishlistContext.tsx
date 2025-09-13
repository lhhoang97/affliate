import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
  WishlistItem, 
  getWishlist, 
  addToWishlist, 
  removeFromWishlist, 
  getWishlistCount,
  isInWishlist,
  getWishlistStats
} from '../services/wishlistService';
import { useAuth } from './AuthContext';

interface WishlistSummary {
  totalItems: number;
  totalValue: number;
  averagePrice: number;
  categories: { [key: string]: number };
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  wishlistSummary: WishlistSummary | null;
  wishlistItemCount: number;
  isLoading: boolean;
  error: string | null;
  addItem: (productId: string) => Promise<void>;
  removeItem: (wishlistItemId: string) => Promise<void>;
  clearAll: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
  isInWishlist: (productId: string) => Promise<boolean>;
  // Alias properties for backward compatibility
  items: WishlistItem[];
  totalItems: number;
  totalValue: number;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (wishlistItemId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [wishlistSummary, setWishlistSummary] = useState<WishlistSummary | null>(null);
  const [wishlistItemCount, setWishlistItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const isAuthenticated = auth?.isAuthenticated || false;

  // Load wishlist data
  const loadWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlistItems([]);
      setWishlistSummary(null);
      setWishlistItemCount(0);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const [items, stats, count] = await Promise.all([
        getWishlist(),
        getWishlistStats(),
        getWishlistCount()
      ]);

      setWishlistItems(items);
      setWishlistSummary(stats);
      setWishlistItemCount(count);
    } catch (err) {
      console.error('Error loading wishlist:', err);
      setError(err instanceof Error ? err.message : 'Failed to load wishlist');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Add item to wishlist
  const addItem = async (productId: string) => {
    if (!isAuthenticated) {
      setError('Please login to add items to wishlist');
      return;
    }

    try {
      setError(null);
      await addToWishlist(productId);
      await loadWishlist(); // Refresh wishlist
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      setError(err instanceof Error ? err.message : 'Failed to add to wishlist');
    }
  };

  // Remove item from wishlist
  const removeItem = async (wishlistItemId: string) => {
    if (!isAuthenticated) {
      setError('Please login to remove items from wishlist');
      return;
    }

    try {
      setError(null);
      await removeFromWishlist(wishlistItemId);
      await loadWishlist(); // Refresh wishlist
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove from wishlist');
    }
  };

  // Clear all wishlist items
  const clearAll = async () => {
    if (!isAuthenticated) {
      setError('Please login to clear wishlist');
      return;
    }

    try {
      setError(null);
      // Remove all items one by one
      for (const item of wishlistItems) {
        await removeFromWishlist(item.id);
      }
      await loadWishlist(); // Refresh wishlist
    } catch (err) {
      console.error('Error clearing wishlist:', err);
      setError(err instanceof Error ? err.message : 'Failed to clear wishlist');
    }
  };

  // Refresh wishlist
  const refreshWishlist = async () => {
    await loadWishlist();
  };

  // Check if product is in wishlist
  const checkInWishlist = async (productId: string): Promise<boolean> => {
    if (!isAuthenticated) return false;
    
    try {
      return await isInWishlist(productId);
    } catch (err) {
      console.error('Error checking wishlist status:', err);
      return false;
    }
  };

  // Load wishlist when authentication state changes
  useEffect(() => {
    loadWishlist();
  }, [isAuthenticated, loadWishlist]);

  const value: WishlistContextType = {
    wishlistItems,
    wishlistSummary,
    wishlistItemCount,
    isLoading,
    error,
    addItem,
    removeItem,
    clearAll,
    refreshWishlist,
    isInWishlist: checkInWishlist,
    // Alias properties for backward compatibility
    items: wishlistItems,
    totalItems: wishlistItemCount,
    totalValue: wishlistSummary?.totalValue || 0,
    addToWishlist: addItem,
    removeFromWishlist: removeItem,
    clearWishlist: clearAll
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
