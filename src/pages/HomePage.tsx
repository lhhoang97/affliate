import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [orderedCategories, setOrderedCategories] = useState<any[]>([]);

  const categories = [
    {
      id: 'electronics',
      name: 'Electronics',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=200&fit=crop',
      subcategories: ['Smartphones', 'Laptops & Computers', 'Tablets & iPads', 'TVs & Monitors', 'Headphones & Audio', 'Cameras & Photography', 'Gaming Consoles']
    },
    {
      id: 'fashion',
      name: 'Fashion',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop',
      subcategories: ['Men\'s Clothing', 'Women\'s Clothing', 'Kids & Baby', 'Shoes & Sneakers', 'Bags & Handbags', 'Jewelry & Watches']
    },
    {
      id: 'home-garden',
      name: 'Home & Garden',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
      subcategories: ['Furniture & Decor', 'Kitchen & Dining', 'Bedding & Bath', 'Garden & Outdoor', 'Lighting & Lamps']
    },
    {
      id: 'sports',
      name: 'Sports',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
      subcategories: ['Fitness & Exercise', 'Team Sports', 'Outdoor Recreation', 'Swimming & Water Sports', 'Cycling & Bikes']
    },
    {
      id: 'beauty',
      name: 'Beauty',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=200&fit=crop',
      subcategories: ['Skincare & Beauty', 'Makeup & Cosmetics', 'Hair Care & Styling', 'Personal Care', 'Fragrances & Perfumes']
    },
    {
      id: 'toys-games',
      name: 'Toys & Games',
      image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=300&h=200&fit=crop',
      subcategories: ['Action Figures & Collectibles', 'Board Games & Puzzles', 'Educational Toys', 'Building Sets & LEGO', 'Video Games']
    },
    {
      id: 'automotive',
      name: 'Automotive',
      image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=300&h=200&fit=crop',
      subcategories: ['Car Parts & Accessories', 'Car Care & Maintenance', 'Motorcycle & Powersports', 'Truck & SUV', 'Car Electronics']
    },
    {
      id: 'office-supplies',
      name: 'Office Supplies',
      image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=300&h=200&fit=crop',
      subcategories: ['Paper & Notebooks', 'Pens & Writing', 'Desk Accessories', 'Filing & Storage', 'Office Furniture']
    },
    {
      id: 'pet-supplies',
      name: 'Pet Supplies',
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=200&fit=crop',
      subcategories: ['Dog Supplies', 'Cat Supplies', 'Pet Food & Treats', 'Pet Toys & Games', 'Pet Health & Care']
    },
    {
      id: 'health-wellness',
      name: 'Health & Wellness',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
      subcategories: ['Vitamins & Supplements', 'Fitness & Wellness', 'Medical & Health', 'Personal Care', 'Wellness Products']
    }
  ];

  useEffect(() => {
    // Load category order from localStorage
    const savedOrder = localStorage.getItem('categoryOrder');
    if (savedOrder) {
      const orderArray = JSON.parse(savedOrder);
      const ordered = orderArray
        .map((categoryId: string) => categories.find(c => c.id === categoryId))
        .filter(Boolean);
      setOrderedCategories(ordered);
    } else {
      setOrderedCategories(categories);
    }
  }, []);

  return (
    <Box sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
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
          {orderedCategories.map((category, index) => (
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
                    <Box sx={{ mt: 1 }}>
                      {category.subcategories.slice(0, 5).map((sub: string, idx: number) => (
                        <Typography 
                          key={idx}
                          variant="body2" 
                          sx={{ 
                            color: '#666',
                            fontSize: '12px',
                            mb: 0.5,
                            cursor: 'pointer',
                            '&:hover': {
                              color: '#007bff'
                            }
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/products?category=${sub}`);
                          }}
                        >
                          {sub}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

        {/* Show less button */}
        <Box sx={{ textAlign: 'right', mt: 3 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#666',
              cursor: 'pointer',
              '&:hover': {
                color: '#007bff'
              }
            }}
          >
            Show less
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;