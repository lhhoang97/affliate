import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartSidebarContextType {
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartSidebarContext = createContext<CartSidebarContextType | undefined>(undefined);

interface CartSidebarProviderProps {
  children: ReactNode;
}

export const CartSidebarProvider: React.FC<CartSidebarProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openCart = () => {
    setIsOpen(true);
  };

  const closeCart = () => {
    setIsOpen(false);
  };

  const toggleCart = () => {
    setIsOpen(prev => !prev);
  };

  const value: CartSidebarContextType = {
    isOpen,
    openCart,
    closeCart,
    toggleCart
  };

  return (
    <CartSidebarContext.Provider value={value}>
      {children}
    </CartSidebarContext.Provider>
  );
};

export const useCartSidebar = () => {
  const context = useContext(CartSidebarContext);
  if (context === undefined) {
    throw new Error('useCartSidebar must be used within a CartSidebarProvider');
  }
  return context;
};

