import React, { useState, useEffect, useRef } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Product } from '../types';

interface SimpleSliderProps {
  products: Product[];
  title: string;
  onProductClick: (product: Product) => void;
}

const SimpleSlider: React.FC<SimpleSliderProps> = ({ products, title, onProductClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const itemsPerView = 4;

  const nextSlide = () => {
    const maxIndex = Math.max(0, products.length - itemsPerView);
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const canGoNext = currentIndex < Math.max(0, products.length - itemsPerView);
  const canGoPrev = currentIndex > 0;

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && products.length > itemsPerView) {
      autoPlayIntervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          const maxIndex = Math.max(0, products.length - itemsPerView);
          return prev >= maxIndex ? 0 : prev + 1;
        });
      }, 4000); // Change slide every 4 seconds
    } else {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
        autoPlayIntervalRef.current = null;
      }
    }

    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    };
  }, [isAutoPlaying, products.length, itemsPerView]);

  const handleMouseEnter = () => {
    if (products.length > itemsPerView) {
      setIsAutoPlaying(true);
    }
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(false);
  };

  return (
    <Box sx={{ mb: 4 }}>
      {/* Title with Animation */}
      <Typography 
        variant="h5" 
        sx={{ 
          mb: 2, 
          fontWeight: 600,
          color: '#1f2937',
          position: 'relative',
          cursor: 'pointer',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-8px',
            left: 0,
            width: '60px',
            height: '3px',
            background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
            borderRadius: '2px',
            transition: 'width 0.3s ease'
          },
          '&:hover::after': {
            width: '100px'
          }
        }}
      >
        {title}
      </Typography>

      {/* Slider Container */}
      <Box 
        sx={{ position: 'relative' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Navigation Arrows with Animation */}
        {canGoPrev && (
          <IconButton
            onClick={prevSlide}
            sx={{
              position: 'absolute',
              left: '-20px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '40px',
              height: '40px',
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              color: '#6b7280',
              zIndex: 10,
              transition: 'all 0.3s ease',
              '&:hover': {
                background: '#3b82f6',
                color: '#ffffff',
                transform: 'translateY(-50%) scale(1.1)',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
              }
            }}
          >
            <ChevronLeft />
          </IconButton>
        )}

        {canGoNext && (
          <IconButton
            onClick={nextSlide}
            sx={{
              position: 'absolute',
              right: '-20px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '40px',
              height: '40px',
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              color: '#6b7280',
              zIndex: 10,
              transition: 'all 0.3s ease',
              '&:hover': {
                background: '#3b82f6',
                color: '#ffffff',
                transform: 'translateY(-50%) scale(1.1)',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
              }
            }}
          >
            <ChevronRight />
          </IconButton>
        )}

        {/* Products Grid with Animation */}
        <Box sx={{
          display: 'flex',
          gap: 2,
          overflow: 'hidden',
          transition: 'transform 0.3s ease-in-out',
          transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
        }}>
          {products.map((product) => (
            <Box
              key={product.id}
              onClick={() => onProductClick(product)}
              sx={{
                flex: '0 0 calc(25% - 12px)',
                cursor: 'pointer',
                background: '#ffffff',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                transform: 'scale(1)',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                  borderColor: '#3b82f6'
                }
              }}
            >
              {/* Product Image with Zoom Animation */}
              <Box sx={{
                height: '200px',
                overflow: 'hidden',
                background: '#f9fafb'
              }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />
              </Box>

              {/* Product Info */}
              <Box sx={{ p: 2 }}>
                {/* Product Name */}
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: '#1f2937',
                    mb: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: '0.9rem',
                    lineHeight: 1.3
                  }}
                >
                  {product.name}
                </Typography>

                {/* Pricing Information */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: '#059669',
                      fontSize: '1.1rem'
                    }}
                  >
                    ${product.price}
                  </Typography>
                  
                  {product.originalPrice && product.originalPrice > product.price && (
                    <Typography
                      variant="body2"
                      sx={{
                        textDecoration: 'line-through',
                        color: '#dc2626',
                        fontSize: '0.8rem',
                        fontWeight: 500
                      }}
                    >
                      ${product.originalPrice}
                    </Typography>
                  )}
                </Box>

                {/* Retailer */}
                {product.retailer && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#6b7280',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      mb: 1,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    {product.retailer}
                  </Typography>
                )}

                {/* Rating */}
                <Typography
                  variant="body2"
                  sx={{
                    color: '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    fontSize: '0.8rem'
                  }}
                >
                  ⭐ {product.rating} ({product.reviewCount} reviews)
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Indicator Dots */}
        {products.length > itemsPerView && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 1, 
            mt: 2 
          }}>
            {Array.from({ length: Math.ceil(products.length / itemsPerView) }).map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: currentIndex === index ? '#3b82f6' : '#d1d5db',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: currentIndex === index ? '#3b82f6' : '#9ca3af',
                    transform: 'scale(1.2)'
                  }
                }}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SimpleSlider;
