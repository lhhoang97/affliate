import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { Box, Typography, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Product } from '../types';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface ProductCarouselProps {
  products: Product[];
  title: string;
  subtitle?: string;
  onProductClick: (product: Product) => void;
}

// Custom Arrow Components
const NextArrow = ({ onClick }: { onClick?: () => void }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: 'absolute',
      right: { xs: '-10px', sm: '-25px' }, // Gần hơn nữa cho mobile
      top: '50%',
      transform: 'translateY(-50%)',
      width: { xs: '32px', sm: '45px' },
      height: { xs: '32px', sm: '45px' },
      background: '#ffffff',
      border: '2px solid #e5e7eb',
      color: '#6b7280',
      zIndex: 10,
      transition: 'all 0.3s ease',
      boxShadow: { xs: '0 2px 8px rgba(0,0,0,0.1)', sm: 'none' },
      '&:hover': {
        background: '#3b82f6',
        color: '#ffffff',
        transform: 'translateY(-50%) scale(1.1)',
        boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
        borderColor: '#3b82f6'
      }
    }}
  >
    <ChevronRight fontSize={window.innerWidth < 600 ? "small" : "large"} />
  </IconButton>
);

const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: 'absolute',
      left: { xs: '-10px', sm: '-25px' }, // Gần hơn nữa cho mobile
      top: '50%',
      transform: 'translateY(-50%)',
      width: { xs: '32px', sm: '45px' },
      height: { xs: '32px', sm: '45px' },
      background: '#ffffff',
      border: '2px solid #e5e7eb',
      color: '#6b7280',
      zIndex: 10,
      transition: 'all 0.3s ease',
      boxShadow: { xs: '0 2px 8px rgba(0,0,0,0.1)', sm: 'none' },
      '&:hover': {
        background: '#3b82f6',
        color: '#ffffff',
        transform: 'translateY(-50%) scale(1.1)',
        boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
        borderColor: '#3b82f6'
      }
    }}
  >
    <ChevronLeft fontSize={window.innerWidth < 600 ? "small" : "large"} />
  </IconButton>
);

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products, title, subtitle, onProductClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  // State to force re-render on window resize
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Determine slides based on actual window width to match real device behavior
  const getSlidesToShow = () => {
    if (windowWidth < 600) return 2; // Real mobile - show 2 products
    if (windowWidth < 900) return 2; // Tablet
    if (windowWidth < 1200) return 3; // Small desktop
    return 4; // Large desktop
  };
  
  const slidesToShow = getSlidesToShow();
  
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: slidesToShow,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          arrows: true, // Enable arrows on mobile
          dots: false
        }
      }
    ]
  };

  return (
    <Box sx={{ mb: { xs: 4, sm: 5 }, px: { xs: 1.5, sm: 2 } }}>
      {/* Title & Subtitle */}
      <Box sx={{ mb: { xs: 2.5, sm: 3 } }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 700,
            color: '#1f2937',
            position: 'relative',
            textAlign: 'left',
            mb: subtitle ? 1 : 0,
            fontSize: { xs: '1.3rem', sm: '1.5rem' }, // Responsive font size
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '-8px',
              left: 0,
              width: { xs: '50px', sm: '60px' },
              height: '4px',
              background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
              borderRadius: '2px',
              transition: 'width 0.3s ease'
            }
          }}
        >
          {title}
        </Typography>
        
        {subtitle && (
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#6b7280',
              fontSize: { xs: '0.9rem', sm: '0.95rem' },
              fontWeight: 500,
              mt: 0.5
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>

      {/* Carousel Container */}
      <Box 
        sx={{ 
          position: 'relative',
          mx: 3, // Add margin for arrows
          '& .slick-dots li button:before': {
            display: 'none'
          },
          '& .slick-dots li.slick-active div': {
            backgroundColor: '#3b82f6 !important',
            transform: 'scale(1.3)'
          }
        }}
      >
        <Slider {...settings}>
          {products.map((product) => (
            <Box key={product.id} sx={{ px: 1 }}>
              <Box
                onClick={() => onProductClick(product)}
                sx={{
                  cursor: 'pointer',
                  background: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  height: '380px',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                    borderColor: '#3b82f6'
                  }
                }}
              >
                {/* Product Image */}
                <Box sx={{
                  height: '200px',
                  overflow: 'hidden',
                  background: '#f9fafb',
                  position: 'relative'
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
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                  
                  {/* Discount Badge */}
                  {product.originalPrice && product.originalPrice > product.price && (
                    <Box sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                      color: 'white',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 2,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                    }}>
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </Box>
                  )}
                </Box>

                {/* Product Info */}
                <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Product Name */}
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color: '#1f2937',
                      mb: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      lineHeight: 1.4,
                      height: '2.8em'
                    }}
                  >
                    {product.name}
                  </Typography>

                  {/* Pricing */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: '#059669',
                        fontSize: '1.25rem'
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
                          fontSize: '0.9rem',
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
                      mb: 1,
                      p: 0.75,
                      backgroundColor: '#f0f9ff',
                      borderRadius: 1.5,
                      border: '1px solid #bae6fd'
                    }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#3b82f6',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                      >
                        🏪 {product.retailer}
                      </Typography>
                    </Box>
                  )}

                  {/* Rating - pushed to bottom */}
                  <Box sx={{ mt: 'auto' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#6b7280',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        fontSize: '0.85rem'
                      }}
                    >
                      ⭐ {product.rating} ({product.reviewCount} reviews)
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default ProductCarousel;
