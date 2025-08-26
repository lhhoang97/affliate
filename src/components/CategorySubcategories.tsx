import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton
} from '@mui/material';
import {
  ArrowForward,
  TrendingUp,
  NewReleases,
  Star
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { categorySubcategories } from '../data/categories';

interface CategorySubcategoriesProps {
  categoryId: string;
  variant?: 'chips' | 'cards' | 'list';
  maxItems?: number;
  showIcons?: boolean;
}

const CategorySubcategories: React.FC<CategorySubcategoriesProps> = ({
  categoryId,
  variant = 'chips',
  maxItems = 8,
  showIcons = true
}) => {
  const navigate = useNavigate();
  const subcategories = categorySubcategories[categoryId] || [];

  const handleSubcategoryClick = (subcategory: string) => {
    // Navigate to search page with subcategory filter
    navigate(`/search?category=${encodeURIComponent(subcategory)}`);
  };

  if (subcategories.length === 0) {
    return null;
  }

  const displaySubcategories = subcategories.slice(0, maxItems);

  if (variant === 'chips') {
    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1f2937' }}>
          Popular Subcategories
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {displaySubcategories.map((subcategory, index) => (
            <Chip
              key={index}
              label={subcategory}
              variant="outlined"
              onClick={() => handleSubcategoryClick(subcategory)}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.2s ease-in-out',
                fontWeight: 500
              }}
            />
          ))}
        </Box>
      </Box>
    );
  }

  if (variant === 'cards') {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1f2937' }}>
          Explore Subcategories
        </Typography>
        <Grid container spacing={2}>
          {displaySubcategories.map((subcategory, index) => (
            <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                  }
                }}
                onClick={() => handleSubcategoryClick(subcategory)}
              >
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  {showIcons && (
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="h4" sx={{ color: 'primary.main' }}>
                        {getSubcategoryIcon(subcategory)}
                      </Typography>
                    </Box>
                  )}
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: '#1f2937',
                      mb: 1
                    }}
                  >
                    {subcategory}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Explore {subcategory.toLowerCase()} products
                  </Typography>
                  <IconButton
                    size="small"
                    sx={{
                      color: 'primary.main',
                      '&:hover': {
                        transform: 'translateX(2px)'
                      },
                      transition: 'transform 0.2s ease-in-out'
                    }}
                  >
                    <ArrowForward fontSize="small" />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  // List variant
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1f2937' }}>
        Subcategories
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {displaySubcategories.map((subcategory, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              borderRadius: 1,
              backgroundColor: '#f8fafc',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white',
                transform: 'translateX(4px)'
              }
            }}
            onClick={() => handleSubcategoryClick(subcategory)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {showIcons && (
                <Typography variant="h6" sx={{ color: 'inherit' }}>
                  {getSubcategoryIcon(subcategory)}
                </Typography>
              )}
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {subcategory}
              </Typography>
            </Box>
            <ArrowForward fontSize="small" />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// Helper function to get icon for subcategory
const getSubcategoryIcon = (subcategory: string): string => {
  const iconMap: { [key: string]: string } = {
    // Electronics
    'Smartphones': '📱',
    'Tablets': '📱',
    'Smartwatches': '⌚',
    'Headphones': '🎧',
    'Speakers': '🔊',
    'Cameras': '📷',
    'TVs & Home Theater': '📺',
    'Audio Equipment': '🎵',
    
    // Computers
    'Laptops': '💻',
    'Desktop Computers': '🖥️',
    'Monitors': '🖥️',
    'Keyboards': '⌨️',
    'Mice': '🖱️',
    'Storage': '💾',
    'Networking': '🌐',
    
    // Smartphones
    'iPhone': '📱',
    'Samsung': '📱',
    'Google Pixel': '📱',
    'OnePlus': '📱',
    'Xiaomi': '📱',
    'Phone Cases': '📱',
    'Screen Protectors': '📱',
    'Chargers': '🔌',
    
    // Gaming
    'Gaming Consoles': '🎮',
    'PC Gaming': '🎮',
    'Gaming Accessories': '🎮',
    'Video Games': '🎮',
    'Gaming Chairs': '🪑',
    'Gaming Headsets': '🎧',
    'Gaming Mice': '🖱️',
    'Gaming Keyboards': '⌨️',
    
    // Home Appliances
    'Kitchen Appliances': '🍳',
    'Refrigerators': '❄️',
    'Washing Machines': '🧺',
    'Dishwashers': '🍽️',
    'Microwaves': '📡',
    'Coffee Makers': '☕',
    'Smart Home': '🏠',
    'Air Purifiers': '💨',
    
    // Fashion
    'Men\'s Clothing': '👔',
    'Women\'s Clothing': '👗',
    'Kids\' Clothing': '👶',
    'Shoes': '👟',
    'Bags & Purses': '👜',
    'Jewelry': '💍',
    'Watches': '⌚',
    'Accessories': '🕶️'
  };

  return iconMap[subcategory] || '📦';
};

export default CategorySubcategories;
