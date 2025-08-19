import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  Button,
  CardMedia,
  CardContent,
  Chip
} from '@mui/material';
import {
  Visibility,
  Laptop,
  Monitor,
  Mouse,
  Home,
  DirectionsCar,
  ChildCare,
  Pets,
  Face
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { fetchCategories } from '../services/productService';
import { Category } from '../types';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const hoverStateRef = useRef<{ overCard: boolean; overPopover: boolean }>({ overCard: false, overPopover: false });
  const closeTimerRef = useRef<number | NodeJS.Timeout | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    loadCategories();
  }, []);



  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current as number);
      closeTimerRef.current = null;
    }
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      const { overCard, overPopover } = hoverStateRef.current;
      if (!overCard && !overPopover) {
        setAnchorEl(null);
        setSelectedCategory(null);
      }
    }, 1150);
  };

  const handleCardEnter = (event: React.MouseEvent<HTMLElement>, category: Category) => {
    clearCloseTimer();
    hoverStateRef.current.overCard = true;
    setAnchorEl(event.currentTarget);
    setSelectedCategory(category);
    const card = event.currentTarget as HTMLElement;
    const cardRect = card.getBoundingClientRect();
    const containerRect = gridRef.current?.getBoundingClientRect();
    if (containerRect) {
      setMenuPos({
        top: cardRect.bottom - containerRect.top + 24, // Increase margin to 24px below card
        left: cardRect.left - containerRect.left,
      });
    }
  };

  const handleCardLeave = () => {
    hoverStateRef.current.overCard = false;
    scheduleClose();
  };

  const handlePopoverEnter = () => {
    clearCloseTimer();
    hoverStateRef.current.overPopover = true;
  };

  const handlePopoverLeave = () => {
    hoverStateRef.current.overPopover = false;
    scheduleClose();
  };

  const open = Boolean(anchorEl);

  // Mock subcategories for demonstration
  const getSubcategories = (categoryName: string) => {
    const subcategoryMap: { [key: string]: string[] } = {
      'Electronics': ['Headphones', 'Laptops', 'Tablets', 'Phones', 'TVs', 'Refrigerators', 'Air Conditioners'],
      'Home & Garden': ['Gas Stoves', 'Washing Machines', 'Refrigerators', 'Air Conditioners', 'Fans', 'Lamps'],
      'Fashion': ['Shirts', 'Pants', 'Shoes', 'Bags', 'Hats', 'Sunglasses'],
      'Baby & Kids': ['Baby Formula', 'Diapers', 'Toys', 'Kids Clothing', 'Strollers', 'Cribs'],
      'Sports & Health': ['Sports Shoes', 'Sportswear', 'Exercise Equipment', 'Supplements'],
      'Automotive': ['Motorcycles', 'Bicycles', 'Auto Parts', 'Motor Oil', 'Insurance'],
      'Books & Education': ['Books', 'Pens', 'School Bags', 'Educational Supplies'],
      'Second Hand': ['Used Electronics', 'Used Cars', 'Used Appliances', 'Used Fashion']
    };
    return subcategoryMap[categoryName] || ['Product 1', 'Product 2', 'Product 3'];
  };

  // Mock recently viewed products
  const recentlyViewedProducts = [
    {
      id: '1',
      name: 'Power Bank 10000mAh',
      price: 299000,
      originalPrice: 399000,
      image: 'https://images.unsplash.com/photo-1609592806596-b43bada2f2d2?w=300',
      rating: 4.5,
      reviewCount: 128
    },
    {
      id: '2',
      name: 'Wireless Bluetooth Headphones',
      price: 450000,
      originalPrice: 600000,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
      rating: 4.3,
      reviewCount: 89
    },
    {
      id: '3',
      name: 'Samsung Galaxy A54 Phone',
      price: 8500000,
      originalPrice: 9500000,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300',
      rating: 4.7,
      reviewCount: 234
    },
    {
      id: '4',
      name: 'Dell Inspiron 15 Laptop',
      price: 15990000,
      originalPrice: 17990000,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300',
      rating: 4.6,
      reviewCount: 156
    },
    {
      id: '5',
      name: 'iPad Air Tablet',
      price: 18990000,
      originalPrice: 20990000,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300',
      rating: 4.8,
      reviewCount: 312
    }
  ];

  // Get category icon based on name
  const getCategoryIcon = (categoryName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Electronics': (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Laptop sx={{ fontSize: 16, color: '#007bff' }} />
          <Monitor sx={{ fontSize: 16, color: '#007bff' }} />
          <Mouse sx={{ fontSize: 16, color: '#007bff' }} />
        </Box>
      ),
      'Home & Garden': <Home sx={{ fontSize: 20, color: '#6c757d' }} />,
      'Automotive': <DirectionsCar sx={{ fontSize: 20, color: '#6c757d' }} />,
      'Baby & Kids': <ChildCare sx={{ fontSize: 20, color: '#6c757d' }} />,
      'Pet Supplies': <Pets sx={{ fontSize: 20, color: '#6c757d' }} />,
      'Beauty': <Face sx={{ fontSize: 20, color: '#6c757d' }} />,
      'Fashion': <Face sx={{ fontSize: 20, color: '#6c757d' }} />,
      'Sports': <DirectionsCar sx={{ fontSize: 20, color: '#6c757d' }} />,
      'Books': <Home sx={{ fontSize: 20, color: '#6c757d' }} />,
      'Toys & Games': <ChildCare sx={{ fontSize: 20, color: '#6c757d' }} />,
      'Health & Wellness': <Face sx={{ fontSize: 20, color: '#6c757d' }} />,
      'Office Supplies': <Home sx={{ fontSize: 20, color: '#6c757d' }} />
    };
    return iconMap[categoryName] || <Box sx={{ width: 20, height: 20, backgroundColor: '#6c757d', borderRadius: 1 }} />;
  };

  return (
    <Box sx={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      {/* Main Content */}
    <Container maxWidth="lg" sx={{ py: 4 }}>


                        {/* Category Grid - four-column horizontal cards */}
        <Box ref={gridRef} sx={{
        display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 3,
          mb: 6,
          position: 'relative',
          zIndex: 1
        }}>
          {categories.slice(0, visibleCount).map((category) => (
            <Card key={category.id} sx={{ 
              borderRadius: 2.5, 
              border: '1px solid #e9ecef',
              backgroundColor: '#fff',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
              minHeight: 96,
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                borderColor: '#dee2e6'
              }
            }} 
            onMouseEnter={(e) => handleCardEnter(e, category)}
            onMouseLeave={handleCardLeave}
            >
              <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2.5 }}>
                <Box sx={{ 
                  width: 56, 
                  height: 56, 
                  borderRadius: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e9ecef',
                  flexShrink: 0,
                  overflow: 'hidden'
                }}>
                  {category.image ? (
                    <img src={category.image} alt={category.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    getCategoryIcon(category.name)
                  )}
                </Box>
                <Typography variant="subtitle1" sx={{ 
                  fontWeight: 500, 
                  color: '#495057',
                  fontSize: '1rem'
                }}>
                  {category.name}
                </Typography>
              </Box>
            </Card>
          ))}

          {/* Category Dropdown Menu - positioned inside grid */}
          {open && selectedCategory && menuPos && (
            <Box
              onMouseEnter={handlePopoverEnter}
              onMouseLeave={handlePopoverLeave}
              sx={{
                position: 'absolute',
                top: menuPos.top,
                left: menuPos.left,
                backgroundColor: '#fff',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                border: '1px solid #e0e0e0',
                minWidth: 280,
                maxWidth: 320,
                zIndex: 1000,
                overflow: 'hidden'
              }}
            >
              {/* Category Header - Simple design like image */}
              <Box sx={{ 
                p: 2.5,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                borderBottom: '1px solid #f0f0f0'
              }}>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: 2, 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #4FC3F7 0%, #29B6F6 100%)',
                }}>
                  {selectedCategory.image ? (
                    <img src={selectedCategory.image} alt={selectedCategory.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                  ) : (
                    <Box sx={{ color: 'white', fontSize: 20 }}>
                      📱
                    </Box>
                  )}
                </Box>
                <Typography sx={{ 
                  fontWeight: 600, 
                  color: '#333',
                  fontSize: '1rem'
                }}>
                  {selectedCategory.name}
                </Typography>
              </Box>

              {/* Simple Subcategories List */}
              <Box sx={{ p: 1 }}>
                {getSubcategories(selectedCategory.name).map((subcategory, index) => (
                  <Box
                    key={index}
                    onClick={() => {
                      navigate(`/products?category=${encodeURIComponent(subcategory)}`);
                      hoverStateRef.current = { overCard: false, overPopover: false };
                      setAnchorEl(null);
                      setSelectedCategory(null);
                      setMenuPos(null);
                    }}
                    sx={{
                      py: 1.2,
                      px: 2.5,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#f8f9fa'
                      }
                    }}
                  >
                    <Typography sx={{ 
                      fontSize: '0.9rem',
                      color: '#757575',
                      fontWeight: 400
                    }}>
                      {subcategory}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>
        
        {categories.length > visibleCount && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Button 
              variant="text" 
              onClick={() => setVisibleCount(v => v + 8)}
              sx={{ 
                color: '#6c757d',
                backgroundColor: '#f8f9fa',
                borderRadius: 2,
                px: 3,
                py: 1,
                '&:hover': {
                  backgroundColor: '#e9ecef'
                }
              }}
                          >
                Show more
              </Button>
          </Box>
        )}

        {/* Recently Viewed Products Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 'bold', 
              color: '#2c3e50',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Visibility sx={{ fontSize: 20, color: '#6c757d' }} />
              Recently Viewed Products
            </Typography>
            <Button 
              variant="text" 
              sx={{ 
                color: '#6c757d',
                fontSize: '0.875rem',
                '&:hover': {
                  backgroundColor: '#f8f9fa'
                }
              }}
                          >
                Show less
              </Button>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            overflowX: 'auto',
            pb: 1,
            '&::-webkit-scrollbar': {
              height: 6
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#f1f1f1',
              borderRadius: 3
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#c1c1c1',
              borderRadius: 3,
              '&:hover': {
                backgroundColor: '#a8a8a8'
              }
            }
          }}>
            {recentlyViewedProducts.map((product) => (
              <Card key={product.id} sx={{ 
                minWidth: 200,
                borderRadius: 2, 
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }
              }} onClick={() => navigate(`/product/${product.id}`)}>
            <CardMedia
              component="img"
                  height="140"
              image={product.image}
              alt={product.name}
              sx={{ objectFit: 'cover' }}
            />
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle2" sx={{ 
                    fontWeight: 600, 
                    color: '#333',
                    mb: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                {product.name}
              </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="body2" sx={{ color: '#007bff', fontWeight: 'bold' }}>
                      {product.price.toLocaleString('vi-VN')}đ
              </Typography>
                    <Typography variant="caption" sx={{ 
                      color: '#6c757d', 
                      textDecoration: 'line-through' 
                    }}>
                      {product.originalPrice.toLocaleString('vi-VN')}đ
                </Typography>
              </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip 
                      label={`${product.rating} ⭐`} 
                      size="small" 
                      sx={{ 
                        backgroundColor: '#e3f2fd', 
                        color: '#1976d2',
                        fontSize: '0.75rem'
                      }} 
                    />
                    <Typography variant="caption" sx={{ color: '#6c757d' }}>
                      ({product.reviewCount})
                  </Typography>
                  </Box>
            </CardContent>
          </Card>
        ))}
          </Box>
      </Box>
    </Container>


    </Box>
  );
};

export default HomePage;
