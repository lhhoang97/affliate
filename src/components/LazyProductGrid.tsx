import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, CircularProgress } from '@mui/material';
import ProductCard from './ProductCard';
import { Product } from '../types';

interface LazyProductGridProps {
  products: Product[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  itemsPerPage?: number;
}

const LazyProductGrid: React.FC<LazyProductGridProps> = ({
  products,
  loading = false,
  onLoadMore,
  hasMore = false,
  itemsPerPage = 12
}) => {
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Update visible products when products or page changes
  useEffect(() => {
    const endIndex = currentPage * itemsPerPage;
    const newVisibleProducts = products.slice(0, endIndex);
    setVisibleProducts(newVisibleProducts);
  }, [products, currentPage, itemsPerPage]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!hasMore || !onLoadMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, onLoadMore]);

  const handleLoadMore = useCallback(() => {
    if (loading || !hasMore) return;
    
    setCurrentPage(prev => prev + 1);
    if (onLoadMore) {
      onLoadMore();
    }
  }, [loading, hasMore, onLoadMore]);

  if (loading && visibleProducts.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Product Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
            xl: 'repeat(5, 1fr)'
          },
          gap: 2,
          p: 2
        }}
      >
        {visibleProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            variant="compact"
          />
        ))}
      </Box>

      {/* Load More Trigger */}
      {hasMore && visibleProducts.length < products.length && (
        <Box
          ref={loadMoreRef}
          display="flex"
          justifyContent="center"
          alignItems="center"
          py={4}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            <Box
              component="button"
              onClick={handleLoadMore}
              sx={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: '#1976d2',
                fontSize: '0.9rem',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Load More Products
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default LazyProductGrid;
