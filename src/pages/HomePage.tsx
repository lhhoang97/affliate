import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, 
  Container, 
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SimpleSlider from '../components/SimpleSlider';
import { useProducts } from '../contexts/ProductContext';
import { Product } from '../types';

const HomePage: React.FC = () => {
  const { products, loading } = useProducts();
  const navigate = useNavigate();

  // Debug log to check products from database
  console.log('HomePage - Products from database:', products);
  console.log('HomePage - Products count:', products.length);

  // Create sections from actual products with memoization to prevent unnecessary re-renders
  const justForYouDeals = useMemo(() => 
    products.filter(p => p.category === 'Electronics').slice(0, 8), 
    [products]
  );
  const hotDeals = useMemo(() => 
    products.filter(p => p.price < 100).slice(0, 8), 
    [products]
  );
  const trendingDeals = useMemo(() => 
    products.filter(p => p.rating > 4.5).slice(0, 8), 
    [products]
  );

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
          <SimpleSlider
            products={justForYouDeals}
            title="Just For You"
            onProductClick={handleProductClick}
          />
        )}

        {/* Hot Deals Section */}
        {hotDeals.length > 0 && (
          <SimpleSlider
            products={hotDeals}
            title="Hot Deals"
            onProductClick={handleProductClick}
          />
        )}

        {/* Trending Deals Section */}
        {trendingDeals.length > 0 && (
          <SimpleSlider
            products={trendingDeals}
            title="Trending Deals"
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
            border: '1px solid #e5e7eb'
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
              No Products Available
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#6b7280',
                mb: 4
              }}
            >
              Check back later for amazing deals!
            </Typography>
          </Box>
        )}

      </Container>
    </Box>
  );
};

export default HomePage;