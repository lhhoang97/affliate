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
  
  // Responsive items per view - số sản phẩm hiển thị tại một thời điểm
  const getItemsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 600) return 2; // Mobile: 2 products per slide
      if (window.innerWidth < 960) return 3; // Tablet: 3 products per slide  
      return 4; // Desktop: 4 products per slide
    }
    return 4; // Default
  };
  
  const [itemsPerView, setItemsPerView] = useState(getItemsPerView());

  const nextSlide = () => {
    // Calculate how many slides we can move forward
    const totalSlides = Math.ceil(products.length / itemsPerView);
    const maxSlideIndex = totalSlides - 1;
    
    if (currentIndex < maxSlideIndex) {
      setIsAutoPlaying(false); // Pause auto-play when user interacts
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setIsAutoPlaying(false); // Pause auto-play when user interacts
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Fix navigation logic to work with slides instead of individual items
  const totalSlides = Math.ceil(products.length / itemsPerView);
  const canGoNext = currentIndex < totalSlides - 1;
  const canGoPrev = currentIndex > 0;

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && products.length > itemsPerView) {
      autoPlayIntervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          const totalSlides = Math.ceil(products.length / itemsPerView);
          return prev >= totalSlides - 1 ? 0 : prev + 1;
        });
      }, 4000); // Change slide every 4 seconds for better user experience
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

  // Handle window resize with debounce
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const newItemsPerView = getItemsPerView();
        setItemsPerView(newItemsPerView);
        // Reset current index if it's out of bounds
        const totalSlides = Math.ceil(products.length / newItemsPerView);
        if (currentIndex >= totalSlides) {
          setCurrentIndex(Math.max(0, totalSlides - 1));
        }
      }, 150); // Debounce resize events
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [currentIndex, products.length]);

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
          gap: { xs: 0.5, sm: 2 },
          overflow: 'hidden',
          transition: 'opacity 0.3s ease-in-out',
          opacity: 1
        }}>
          {/* Render only products for current slide */}
          {products
            .slice(currentIndex * itemsPerView, (currentIndex + 1) * itemsPerView)
            .map((product) => (
            <Box
              key={product.id}
              onClick={() => onProductClick(product)}
              sx={{
                flex: { xs: '0 0 calc(50% - 4px)', sm: '0 0 calc(33.333% - 8px)', md: '0 0 calc(25% - 12px)' },
                minWidth: 0, // Prevent flex item from growing
                cursor: 'pointer',
                background: '#ffffff',
                borderRadius: { xs: '6px', sm: '8px' },
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
                height: { xs: '140px', sm: '180px', md: '200px' },
                overflow: 'hidden',
                background: '#f9fafb'
              }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%', 
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'scale-down', // Không scale up
                    transition: 'transform 0.3s ease',
                    display: 'block',
                    margin: '0 auto' // Center image
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
              <Box sx={{ p: { xs: 1, sm: 1.5, md: 2 } }}>
                {/* Product Name */}
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: '#1f2937',
                    mb: { xs: 0.5, sm: 1 },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                    lineHeight: 1.3
                  }}
                >
                  {product.name}
                </Typography>

                {/* Pricing Information */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 }, mb: { xs: 0.5, sm: 1 } }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: '#059669',
                      fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.2rem' }
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
                        fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' },
                        fontWeight: 500
                      }}
                    >
                      ${product.originalPrice}
                    </Typography>
                  )}
                </Box>

                {/* Retailer */}
                {product.retailer && (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 0.5, 
                    mb: { xs: 0.5, sm: 1 },
                    p: { xs: 0.25, sm: 0.5 },
                    backgroundColor: '#f0f9ff',
                    borderRadius: 1,
                    border: '1px solid #bae6fd'
                  }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#3b82f6',
                        fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.8rem' },
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >
                      🏪 {product.retailer}
                    </Typography>
                  </Box>
                )}

                {/* Rating */}
                <Typography
                  variant="body2"
                  sx={{
                    color: '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }
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
            {Array.from({ length: totalSlides }).map((_, index) => (
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
                onClick={() => {
                  setIsAutoPlaying(false); // Pause auto-play when user clicks dots
                  setCurrentIndex(index);
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SimpleSlider;
