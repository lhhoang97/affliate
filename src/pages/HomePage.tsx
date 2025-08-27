import React, { useMemo } from 'react';
import { 
  Box, 
  Container, 
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProductCarousel from '../components/ProductCarousel';
import { useProducts } from '../contexts/ProductContext';
import { Product } from '../types';
import { getDealConfig, DealConfig } from '../services/dealConfigService';

const HomePage: React.FC = () => {
  const { products, loading } = useProducts();
  const navigate = useNavigate();
  const dealConfig = getDealConfig();

  // Create sections from actual products with memoization to prevent unnecessary re-renders
  const justForYouDeals = useMemo(() => {
    // Random selection for personalized experience
    const shuffled = [...products].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 12);
  }, [products]);
  
  const hotDeals = useMemo(() => {
    // Start with products that have discounts or are affordable
    let deals = products.filter(p => {
      const hasDiscount = p.originalPrice && p.originalPrice > p.price;
      const discountPercent = p.originalPrice ? ((p.originalPrice - p.price) / p.originalPrice) * 100 : 0;
      const isAffordable = p.price < dealConfig.hotDeals.maxPrice;
      const hasGoodDiscount = discountPercent >= dealConfig.hotDeals.minDiscountPercent;
      return (hasDiscount && hasGoodDiscount) || isAffordable;
    });
    
    // If not enough deals, add more products sorted by price (cheapest first)
    if (deals.length < 12) {
      const remaining = products
        .filter(p => !deals.includes(p))
        .sort((a, b) => a.price - b.price)
        .slice(0, 12 - deals.length);
      deals = [...deals, ...remaining];
    }
    
    // Sort final list by discount percentage first, then by price
    return deals
      .sort((a, b) => {
        const discountA = a.originalPrice ? ((a.originalPrice - a.price) / a.originalPrice) * 100 : 0;
        const discountB = b.originalPrice ? ((b.originalPrice - b.price) / b.originalPrice) * 100 : 0;
        if (discountA !== discountB) return discountB - discountA;
        return a.price - b.price;
      })
      .slice(0, 12);
  }, [products, dealConfig]);
  
  const trendingDeals = useMemo(() => {
    // Start with high-rated products
    let trending = products.filter(p => p.rating >= dealConfig.trendingDeals.minRating && p.reviewCount >= dealConfig.trendingDeals.minReviews);
    
    // If not enough trending products, add products with good ratings
    if (trending.length < 12) {
      const additional = products
        .filter(p => !trending.includes(p) && p.rating >= 3.5)
        .sort((a, b) => {
          // Sort by rating first, then by review count
          if (a.rating !== b.rating) return b.rating - a.rating;
          return b.reviewCount - a.reviewCount;
        })
        .slice(0, 12 - trending.length);
      trending = [...trending, ...additional];
    }
    
    // If still not enough, fill with remaining products sorted by rating
    if (trending.length < 12) {
      const remaining = products
        .filter(p => !trending.includes(p))
        .sort((a, b) => {
          if (a.rating !== b.rating) return b.rating - a.rating;
          return b.reviewCount - a.reviewCount;
        })
        .slice(0, 12 - trending.length);
      trending = [...trending, ...remaining];
    }
    
    // Final sort by rating and review count
    return trending
      .sort((a, b) => {
        if (a.rating !== b.rating) return b.rating - a.rating;
        return b.reviewCount - a.reviewCount;
      })
      .slice(0, 12);
  }, [products, dealConfig]);

  // Debug log to check products from database
  console.log('HomePage - Products from database:', products);
  console.log('HomePage - Products count:', products.length);
  console.log('HomePage - Loading state:', loading);
  console.log('HomePage - Just for you deals:', justForYouDeals.length);
  console.log('HomePage - Hot deals:', hotDeals.length);
  console.log('HomePage - Trending deals:', trendingDeals.length);

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f8fafc'
      }}>
        <Typography variant="h6" sx={{ color: '#6b7280' }}>
          Loading amazing products...
        </Typography>
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
};

export default HomePage;