import React, { useMemo, memo } from 'react';
import { 
  Box, 
  Container, 
  Typography,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProductCarousel from '../components/ProductCarousel';
import SSRWrapper from '../components/SSRWrapper';
import { useProducts } from '../contexts/ProductContext';
import { Product } from '../types';
import { getDealConfig } from '../services/dealConfigService';
import usePerformanceOptimization from '../hooks/usePerformanceOptimization';

const HomePage: React.FC = memo(() => {
  const { products, loading, error } = useProducts();
  const navigate = useNavigate();
  const dealConfig = useMemo(() => getDealConfig(), []);
  
  // Initialize performance optimizations
  usePerformanceOptimization({
    enableImageOptimization: true,
    enableLazyLoading: true,
    enablePrefetching: true,
    enableServiceWorker: true
  });
  
  // Debug logging
  console.log('HomePage - Products:', products.length, 'Loading:', loading, 'Error:', error || 'None');

  // Create sections from actual products with memoization to prevent unnecessary re-renders
  const justForYouDeals = useMemo(() => {
    if (products.length === 0) return [];
    // Random selection for personalized experience - use first 12 products for consistency
    return products.slice(0, 12);
  }, [products]);
  
  const hotDeals = useMemo(() => {
    if (products.length === 0) return [];
    
    // Optimized: Calculate discount percentages once
    const productsWithDiscounts = products.map(p => ({
      ...p,
      discountPercent: p.originalPrice ? ((p.originalPrice - p.price) / p.originalPrice) * 100 : 0
    }));
    
    // Start with products that have discounts or are affordable
    let deals = productsWithDiscounts.filter(p => {
      const hasDiscount = p.originalPrice && p.originalPrice > p.price;
      const isAffordable = p.price < dealConfig.hotDeals.maxPrice;
      const hasGoodDiscount = p.discountPercent >= dealConfig.hotDeals.minDiscountPercent;
      return (hasDiscount && hasGoodDiscount) || isAffordable;
    });
    
    // If not enough deals, add more products sorted by price (cheapest first)
    if (deals.length < 12) {
      const remaining = productsWithDiscounts
        .filter(p => !deals.includes(p))
        .sort((a, b) => a.price - b.price)
        .slice(0, 12 - deals.length);
      deals = [...deals, ...remaining];
    }
    
    // Sort final list by discount percentage first, then by price
    return deals
      .sort((a, b) => {
        if (a.discountPercent !== b.discountPercent) return b.discountPercent - a.discountPercent;
        return a.price - b.price;
      })
      .slice(0, 12);
  }, [products, dealConfig]);
  
  const trendingDeals = useMemo(() => {
    if (products.length === 0) return [];
    
    // Optimized: Sort products by rating and review count once
    const sortedProducts = [...products].sort((a, b) => {
      if (a.rating !== b.rating) return b.rating - a.rating;
      return b.reviewCount - a.reviewCount;
    });
    
    // Start with high-rated products
    let trending = sortedProducts.filter(p => 
      p.rating >= dealConfig.trendingDeals.minRating && 
      p.reviewCount >= dealConfig.trendingDeals.minReviews
    );
    
    // If not enough trending products, add products with good ratings
    if (trending.length < 12) {
      const additional = sortedProducts
        .filter(p => !trending.includes(p) && p.rating >= 3.5)
        .slice(0, 12 - trending.length);
      trending = [...trending, ...additional];
    }
    
    // If still not enough, fill with remaining products
    if (trending.length < 12) {
      const remaining = sortedProducts
        .filter(p => !trending.includes(p))
        .slice(0, 12 - trending.length);
      trending = [...trending, ...remaining];
    }
    
    return trending.slice(0, 12);
  }, [products, dealConfig]);


  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f8fafc'
      }}>
        <Box sx={{ 
          width: 40, 
          height: 40, 
          border: '3px solid #e5e7eb',
          borderTop: '3px solid #1a73e8',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          mb: 2
        }} />
        <Typography variant="h6" sx={{ color: '#6b7280' }}>
          Loading amazing products...
        </Typography>
        <Typography variant="body2" sx={{ color: '#9ca3af', mt: 1 }}>
          Just a moment while we fetch the best deals for you
        </Typography>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </Box>
    );
  }

  // Show error if there's an error and no products
  if (error && products.length === 0) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f8fafc'
      }}>
        <Typography variant="h6" sx={{ color: '#ef4444', mb: 2 }}>
          Error loading products
        </Typography>
        <Typography variant="body2" sx={{ color: '#6b7280', mb: 3 }}>
          {error}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          sx={{ backgroundColor: '#1a73e8' }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  // Show fallback if no products are available
  if (!loading && products.length === 0 && !error) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f8fafc'
      }}>
        <Typography variant="h6" sx={{ color: '#6b7280', mb: 2 }}>
          Setting up your store...
        </Typography>
        <Typography variant="body2" sx={{ color: '#9ca3af', mb: 3 }}>
          We're preparing amazing deals for you. Check back in a moment!
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          sx={{ backgroundColor: '#1a73e8' }}
        >
          Refresh
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        
        {/* Just For You Section */}
        {justForYouDeals.length > 0 && (
          <ProductCarousel
            products={justForYouDeals}
            title={dealConfig.justForYou.title}
            subtitle={dealConfig.justForYou.subtitle}
            onProductClick={handleProductClick}
          />
        )}

        {/* Hot Deals Section */}
        {hotDeals.length > 0 && (
          <ProductCarousel
            products={hotDeals}
            title={dealConfig.hotDeals.title}
            subtitle={dealConfig.hotDeals.subtitle}
            onProductClick={handleProductClick}
          />
        )}

        {/* Trending Deals Section */}
        {trendingDeals.length > 0 && (
          <ProductCarousel
            products={trendingDeals}
            title={dealConfig.trendingDeals.title}
            subtitle={dealConfig.trendingDeals.subtitle}
            onProductClick={handleProductClick}
          />
        )}

        {/* Fallback when no products */}
        {products.length === 0 && (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8,
            backgroundColor: 'white',
            borderRadius: 3,
            border: '1px solid #e5e7eb',
            mt: 4
          }}>
            <Typography 
              variant="h3" 
              component="h2" 
              sx={{ 
                fontWeight: 700, 
                color: '#1a1a1a',
                mb: 2
              }}
            >
              🔄 Setting up your store...
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#6b7280',
                mb: 4
              }}
            >
              We're preparing amazing deals for you. Check back in a moment!
            </Typography>
          </Box>
        )}

      </Container>
    </Box>
  );
});

HomePage.displayName = 'HomePage';

export default HomePage;