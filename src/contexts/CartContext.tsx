import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartState, CartItem, Product } from '../types';

interface CartContextType extends CartState {
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, setState] = useState<CartState>({
    items: [],
    totalItems: 0,
    totalPrice: 0,
    isLoading: false,
  });

  const addToCart = (product: Product, quantity: number = 1) => {
    setState(prev => {
      const existingItem = prev.items.find(item => item.productId === product.id);
      
      if (existingItem) {
        const updatedItems = prev.items.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        
        const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        
        return {
          ...prev,
          items: updatedItems,
          totalItems,
          totalPrice,
        };
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${Date.now()}`,
          productId: product.id,
          product,
          quantity,
          addedAt: new Date().toISOString(),
        };
        
        const updatedItems = [...prev.items, newItem];
        const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        
        return {
          ...prev,
          items: updatedItems,
          totalItems,
          totalPrice,
        };
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setState(prev => {
      const updatedItems = prev.items.filter(item => item.productId !== productId);
      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      
      return {
        ...prev,
        items: updatedItems,
        totalItems,
        totalPrice,
      };
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setState(prev => {
      const updatedItems = prev.items.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      );
      
      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      
      return {
        ...prev,
        items: updatedItems,
        totalItems,
        totalPrice,
      };
    });
  };

  const clearCart = () => {
    setState(prev => ({
      ...prev,
      items: [],
      totalItems: 0,
      totalPrice: 0,
    }));
  };

  return (
    <CartContext.Provider value={{ ...state, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
