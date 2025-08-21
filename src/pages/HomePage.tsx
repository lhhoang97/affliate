import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [orderedCategories, setOrderedCategories] = useState<any[]>([]);
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Default categories fallback
  const defaultCategories = [
    {
      id: 'electronics',
      name: 'Electronics',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=200&fit=crop',
      subcategories: ['HEADPHONES', 'LAPTOP', 'TABLET', 'PHONE', 'TV', 'REFRIGERATOR', 'AIR CONDITIONER']
    },
    {
      id: 'fashion',
      name: 'Fashion',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop',
      subcategories: ['MEN', 'WOMEN', 'KIDS', 'SHOES', 'BAGS', 'JEWELRY', 'ACCESSORIES']
    },
    {
      id: 'home-garden',
      name: 'Home & Garden',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
      subcategories: ['FURNITURE', 'KITCHEN', 'BEDDING', 'GARDEN', 'LIGHTING', 'STORAGE']
    },
    {
      id: 'sports',
      name: 'Sports',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
      subcategories: ['FITNESS', 'TEAM SPORTS', 'OUTDOOR', 'SWIMMING', 'CYCLING', 'RUNNING']
    },
    {
      id: 'beauty',
      name: 'Beauty',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=200&fit=crop',
      subcategories: ['SKINCARE', 'MAKEUP', 'HAIR CARE', 'PERSONAL CARE', 'VITAMINS', 'FRAGRANCES']
    },
    {
      id: 'toys-games',
      name: 'Toys & Games',
      image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=300&h=200&fit=crop',
      subcategories: ['ACTION FIGURES', 'BOARD GAMES', 'EDUCATIONAL', 'LEGO', 'DOLLS', 'VIDEO GAMES']
    },
    {
      id: 'automotive',
      name: 'Automotive',
      image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=300&h=200&fit=crop',
      subcategories: ['CAR PARTS', 'CAR CARE', 'MOTORCYCLE', 'TRUCK', 'TOOLS', 'ELECTRONICS']
    },
    {
      id: 'office-supplies',
      name: 'Office Supplies',
      image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=300&h=200&fit=crop',
      subcategories: ['PAPER', 'PENS', 'DESK', 'FILING', 'FURNITURE']
    },
    {
      id: 'pet-supplies',
      name: 'Pet Supplies',
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=200&fit=crop',
      subcategories: ['DOG', 'CAT', 'FOOD', 'TOYS', 'HEALTH']
    },
    {
      id: 'health-wellness',
      name: 'Health & Wellness',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
      subcategories: ['VITAMINS', 'FITNESS', 'MEDICAL', 'CARE', 'WELLNESS']
    },
    {
      id: 'health-beauty',
      name: 'Health & Beauty',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=200&fit=crop',
      subcategories: ['SKINCARE', 'MAKEUP', 'HAIR CARE', 'PERSONAL CARE', 'VITAMINS', 'FRAGRANCES', 'SUPPLEMENTS', 'FITNESS']
    }
  ];

  // Get categories from localStorage or use default
  const getCategories = () => {
    const savedCategories = localStorage.getItem('homepageCategories');
    if (savedCategories) {
      try {
        return JSON.parse(savedCategories);
      } catch (error) {
        console.error('Error parsing saved categories:', error);
        return defaultCategories;
      }
    }
    return defaultCategories;
  };

  const categories = getCategories();

  // Function to get category color based on category name
  const getCategoryColor = (categoryName: string): string => {
    const colorMap: { [key: string]: string } = {
      'Electronics': '#2563eb', // Blue
      'Fashion': '#ec4899', // Pink
      'Home & Garden': '#059669', // Emerald
      'Sports': '#ea580c', // Orange
      'Books & Media': '#7c3aed', // Purple
      'Toys & Games': '#dc2626', // Red
      'Health & Beauty': '#f43f5e', // Rose
      'Automotive': '#92400e', // Amber
      'Office Supplies': '#475569', // Slate
      'Pet Supplies': '#16a34a', // Green
      'Health & Wellness': '#0891b2', // Cyan
      'Beauty': '#f43f5e' // Rose
    };
    return colorMap[categoryName] || '#6b7280';
  };

  // Function to get category background color
  const getCategoryBgColor = (categoryName: string): string => {
    const colorMap: { [key: string]: string } = {
      'Electronics': '#dbeafe', // Light blue
      'Fashion': '#fce7f3', // Light pink
      'Home & Garden': '#d1fae5', // Light emerald
      'Sports': '#fed7aa', // Light orange
      'Books & Media': '#e9d5ff', // Light purple
      'Toys & Games': '#fecaca', // Light red
      'Health & Beauty': '#ffe4e6', // Light rose
      'Automotive': '#fef3c7', // Light amber
      'Office Supplies': '#f1f5f9', // Light slate
      'Pet Supplies': '#dcfce7', // Light green
      'Health & Wellness': '#cffafe', // Light cyan
      'Beauty': '#ffe4e6' // Light rose
    };
    return colorMap[categoryName] || '#f3f4f6';
  };

  const loadCategories = () => {
    const currentCategories = getCategories();
    const savedOrder = localStorage.getItem('categoryOrder');
    console.log('HomePage Debug - savedOrder:', savedOrder);
    console.log('HomePage Debug - categories length:', currentCategories.length);
    
    if (savedOrder) {
      const orderArray = JSON.parse(savedOrder);
      console.log('HomePage Debug - orderArray:', orderArray);
      const ordered = orderArray
        .map((categoryId: string) => currentCategories.find((c: any) => c.id === categoryId))
        .filter(Boolean);
      console.log('HomePage Debug - ordered categories:', ordered.length, ordered.map((c: any) => c.name));
      setOrderedCategories(ordered);
    } else {
      console.log('HomePage Debug - no saved order, using default categories');
      setOrderedCategories(currentCategories);
    }
  };

  useEffect(() => {
    loadCategories();
    
    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'categoryOrder' || e.key === 'homepageCategories') {
        console.log('HomePage Debug - Storage changed, reloading categories');
        loadCategories();
      }
    };
    
    // Also listen for custom events from admin panel
    const handleCategoryOrderChange = () => {
      console.log('HomePage Debug - Category order changed event received');
      loadCategories();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('categoryOrderChanged', handleCategoryOrderChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('categoryOrderChanged', handleCategoryOrderChange);
    };
  }, []);

  // Debug logging
  console.log('HomePage Debug - Final state:', {
    orderedCategoriesLength: orderedCategories.length,
    showAllCategories,
    displayCount: showAllCategories ? orderedCategories.length : Math.min(8, orderedCategories.length),
    categories: orderedCategories.map((c: any) => c.name)
  });

  return (
    <Box sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
    <Container maxWidth="lg" sx={{ py: 4 }}>




        {/* Categories Grid */}
        <Box sx={{ 
        display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)', 
            lg: 'repeat(4, 1fr)' 
          }, 
          gap: 3 
        }}>
          {(showAllCategories ? orderedCategories : orderedCategories.slice(0, 8)).map((category, index) => (
            <Box key={category.id}>
              <Card 
                sx={{ 
                  height: '100%',
              cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  borderRadius: 2,
                  overflow: 'hidden',
              '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  }
                }}
                onClick={() => navigate(`/products?category=${category.name}`)}
              >
                <CardMedia
                  component="img"
                  height="120"
                  image={category.image}
                  alt={category.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="h6" component="h3" sx={{ 
                    fontWeight: 600,
                    mb: 1,
                    color: '#333'
                }}>
                  {category.name}
                </Typography>
                  
                  {/* Show subcategories for all categories */}
                  {category.subcategories.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      
                                    <Box sx={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.8,
                        maxWidth: '100%'
                      }}>
                        {category.subcategories.slice(0, 6).map((sub: string, idx: number) => (
                          <Box
                            key={idx}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              p: 1,
                              borderRadius: 2,
                              backgroundColor: getCategoryBgColor(category.name),
                              border: `1px solid ${getCategoryColor(category.name)}20`,
                              '&:hover': {
                                backgroundColor: `${getCategoryColor(category.name)}15`,
                                transform: 'translateX(6px)',
                                boxShadow: `0 2px 8px ${getCategoryColor(category.name)}30`
                              }
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/products?category=${sub}`);
                            }}
                          >
                            {/* Circle with letter */}
                            <Box sx={{ 
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              background: `linear-gradient(135deg, ${getCategoryColor(category.name)}, ${getCategoryColor(category.name)}dd)`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 1.5,
                              border: `2px solid ${getCategoryColor(category.name)}`,
                              boxShadow: `0 2px 6px ${getCategoryColor(category.name)}40`,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                boxShadow: `0 4px 12px ${getCategoryColor(category.name)}60`,
                                transform: 'scale(1.1)'
                              }
                            }}>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  fontWeight: 'bold',
                                  color: '#ffffff',
                                  fontSize: '16px',
                                  textShadow: '0 1px 3px rgba(0,0,0,0.3)'
                                }}
                              >
                                {sub.charAt(0)}
                              </Typography>
                            </Box>
                            {/* Subcategory name */}
                            <Typography 
                              variant="body2" 
                              sx={{
                                color: getCategoryColor(category.name),
                                fontSize: '14px',
                                fontWeight: 600,
                                flex: 1,
                                textAlign: 'left'
                              }}
                            >
                              {sub}
                            </Typography>
                          </Box>
                        ))}
                        {category.subcategories.length > 6 && (
                          <Box
                            sx={{ 
                              display: 'flex',
                              alignItems: 'center',
                              p: 1,
                              borderRadius: 2,
                              backgroundColor: '#f8f9fa',
                              border: '1px solid #e9ecef',
                              opacity: 0.8
                            }}
                          >
                            <Box sx={{
                              width: 28,
                              height: 28,
                              borderRadius: '50%',
                              backgroundColor: '#e9ecef',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 1.2,
                              border: '1.5px solid #dee2e6'
                            }}>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  fontWeight: 'bold',
                                  color: '#6c757d',
                                  fontSize: '12px'
                                }}
                              >
                                +{category.subcategories.length - 6}
                              </Typography>
                            </Box>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: '#6c757d',
                                fontSize: '13px',
                                fontWeight: 500,
                                flex: 1
                              }}
                            >
                              More subcategories
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  )}
            </CardContent>
          </Card>
            </Box>
        ))}
          </Box>

          {/* Show More/Less Button */}
          {orderedCategories.length > 8 && (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button
                variant="outlined"
                onClick={() => setShowAllCategories(!showAllCategories)}
                sx={{
                  borderColor: '#007bff',
                  color: '#007bff',
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '16px',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: '#007bff',
                    color: 'white',
                    borderColor: '#007bff'
                  }
                }}
              >
                {showAllCategories ? 'Show Less' : `Show More (${orderedCategories.length - 8} more)`}
              </Button>
            </Box>
          )}
        </Container>
    </Box>
  );
};

export default HomePage;