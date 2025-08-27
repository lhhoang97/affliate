export interface DealConfig {
  hotDeals: {
    maxPrice: number;
    minDiscountPercent: number;
    title: string;
    subtitle: string;
  };
  trendingDeals: {
    minRating: number;
    minReviews: number;
    title: string;
    subtitle: string;
  };
  justForYou: {
    title: string;
    subtitle: string;
  };
}

// Default configuration - can be overridden by admin
export const defaultDealConfig: DealConfig = {
  hotDeals: {
    maxPrice: 200,
    minDiscountPercent: 5,
    title: "Hot Deals",
    subtitle: "💥 Products under $200 or with great discounts"
  },
  trendingDeals: {
    minRating: 4.0,
    minReviews: 5,
    title: "Trending Deals", 
    subtitle: "⭐ Highly rated products by our community"
  },
  justForYou: {
    title: "Just For You",
    subtitle: "🎯 Personalized recommendations based on your interests"
  }
};

// In a real app, this would come from database/API
let currentConfig = { ...defaultDealConfig };

export const getDealConfig = (): DealConfig => {
  return currentConfig;
};

export const updateDealConfig = (newConfig: Partial<DealConfig>): void => {
  currentConfig = { ...currentConfig, ...newConfig };
  // In real app, this would save to database
  localStorage.setItem('dealConfig', JSON.stringify(currentConfig));
};

export const loadDealConfig = (): DealConfig => {
  try {
    const saved = localStorage.getItem('dealConfig');
    if (saved) {
      currentConfig = { ...defaultDealConfig, ...JSON.parse(saved) };
    }
  } catch (error) {
    console.error('Error loading deal config:', error);
  }
  return currentConfig;
};

// Initialize config on load
loadDealConfig();
