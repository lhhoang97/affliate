import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type BusinessMode = 'affiliate' | 'ecommerce' | 'hybrid';

interface BusinessModeContextType {
  mode: BusinessMode;
  setMode: (mode: BusinessMode) => void;
  isAffiliateMode: boolean;
  isEcommerceMode: boolean;
  isHybridMode: boolean;
  toggleMode: () => void;
}

const BusinessModeContext = createContext<BusinessModeContextType | undefined>(undefined);

interface BusinessModeProviderProps {
  children: ReactNode;
}

export const BusinessModeProvider: React.FC<BusinessModeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<BusinessMode>('affiliate'); // Default to affiliate

  // Load mode from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('businessMode') as BusinessMode;
    if (savedMode && ['affiliate', 'ecommerce', 'hybrid'].includes(savedMode)) {
      setMode(savedMode);
    }
  }, []);

  // Save mode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('businessMode', mode);
  }, [mode]);

  const isAffiliateMode = mode === 'affiliate';
  const isEcommerceMode = mode === 'ecommerce';
  const isHybridMode = mode === 'hybrid';

  const toggleMode = () => {
    setMode(prev => {
      switch (prev) {
        case 'affiliate':
          return 'ecommerce';
        case 'ecommerce':
          return 'hybrid';
        case 'hybrid':
          return 'affiliate';
        default:
          return 'affiliate';
      }
    });
  };

  const value: BusinessModeContextType = {
    mode,
    setMode,
    isAffiliateMode,
    isEcommerceMode,
    isHybridMode,
    toggleMode
  };

  return (
    <BusinessModeContext.Provider value={value}>
      {children}
    </BusinessModeContext.Provider>
  );
};

export const useBusinessMode = () => {
  const context = useContext(BusinessModeContext);
  if (context === undefined) {
    throw new Error('useBusinessMode must be used within a BusinessModeProvider');
  }
  return context;
};

