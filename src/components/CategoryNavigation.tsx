import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import {
  AcUnit,
  Print,
  Speaker,
  Watch,
  Tablet,
  Phone,
  Headphones,
  Laptop,
  Tv,
  Kitchen
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  letter: string;
}

const categories: Category[] = [
  { id: 'headphones', name: 'Headphones', icon: <Headphones />, letter: 'H' },
  { id: 'laptop', name: 'Laptop', icon: <Laptop />, letter: 'L' },
  { id: 'tablet', name: 'Tablet', icon: <Tablet />, letter: 'T' },
  { id: 'phone', name: 'Phone', icon: <Phone />, letter: 'P' },
  { id: 'tv', name: 'TV', icon: <Tv />, letter: 'T' },
  { id: 'refrigerator', name: 'Refrigerator', icon: <Kitchen />, letter: 'R' },
  { id: 'air-conditioner', name: 'Air Conditioner', icon: <AcUnit />, letter: 'A' },
];

interface CategoryNavigationProps {
  selectedCategory?: string;
  onCategorySelect?: (categoryId: string) => void;
}

const CategoryNavigation: React.FC<CategoryNavigationProps> = ({
  selectedCategory,
  onCategorySelect
}) => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId: string) => {
    if (onCategorySelect) {
      onCategorySelect(categoryId);
    } else {
      navigate(`/products?category=${categoryId}`);
    }
  };

  return (
    <Box sx={{ 
      py: 3, 
      borderBottom: '1px solid #e9ecef',
      backgroundColor: 'white',
      px: 2
    }}>
      {/* Title Section */}
      <Box sx={{ 
        textAlign: 'center', 
        mb: 3,
        borderBottom: '2px solid #007bff',
        pb: 2,
        mx: 'auto',
        maxWidth: 'fit-content'
      }}>
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: '24px', sm: '28px', md: '32px' },
            fontWeight: 'bold',
            color: '#333',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
        >
          Electronics
        </Typography>
      </Box>

      {/* Categories Grid */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(4, 1fr)', sm: 'repeat(4, 1fr)', md: 'repeat(7, 1fr)' },
        gap: { xs: 2, sm: 3, md: 4 },
        maxWidth: '1200px',
        mx: 'auto'
      }}>
        {categories.map((category) => (
          <Box
            key={category.id}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease-in-out',
              p: 1,
              borderRadius: '12px',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                backgroundColor: '#f8f9fa'
              }
            }}
            onClick={() => handleCategoryClick(category.id)}
          >
            {/* Circular Icon */}
            <Box
              sx={{
                width: { xs: 45, sm: 50, md: 55 },
                height: { xs: 45, sm: 50, md: 55 },
                borderRadius: '50%',
                backgroundColor: selectedCategory === category.id ? '#007bff' : '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1.5,
                border: selectedCategory === category.id ? '3px solid #007bff' : '2px solid #e9ecef',
                transition: 'all 0.3s ease-in-out',
                boxShadow: selectedCategory === category.id ? '0 4px 15px rgba(0,123,255,0.3)' : '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              {selectedCategory === category.id ? (
                // Show icon when selected
                <Box sx={{ 
                  color: 'white',
                  fontSize: { xs: '20px', sm: '22px', md: '24px' }
                }}>
                  {category.icon}
                </Box>
              ) : (
                // Show letter when not selected
                <Typography
                  sx={{
                    fontSize: { xs: '16px', sm: '18px', md: '20px' },
                    fontWeight: 'bold',
                    color: '#333',
                    textTransform: 'uppercase'
                  }}
                >
                  {category.letter}
                </Typography>
              )}
            </Box>
            
            {/* Category Name */}
            <Typography
              sx={{
                fontSize: { xs: '11px', sm: '12px', md: '13px' },
                color: selectedCategory === category.id ? '#007bff' : '#666',
                fontWeight: selectedCategory === category.id ? 'bold' : 'normal',
                textAlign: 'center',
                maxWidth: 70,
                lineHeight: 1.3,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              {category.name}
            </Typography>
          </Box>
        ))}
      </Box>


    </Box>
  );
};

export default CategoryNavigation;
