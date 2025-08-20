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
  Laptop
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  letter: string;
}

const categories: Category[] = [
  { id: 'air-conditioner', name: 'Máy Lạnh', icon: <AcUnit />, letter: 'M' },
  { id: 'printer', name: 'Máy In', icon: <Print />, letter: 'M' },
  { id: 'speaker', name: 'Loa', icon: <Speaker />, letter: 'L' },
  { id: 'watch', name: 'Đồng Hồ', icon: <Watch />, letter: 'Đ' },
  { id: 'tablet', name: 'Tablet', icon: <Tablet />, letter: 'T' },
  { id: 'phone', name: 'Điện Thoại', icon: <Phone />, letter: 'Đ' },
  { id: 'headphones', name: 'Tai nghe', icon: <Headphones />, letter: 'T' },
  { id: 'laptop', name: 'Laptop', icon: <Laptop />, letter: 'L' },
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
      py: 2, 
      borderBottom: '1px solid #e9ecef',
      backgroundColor: 'white'
    }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: { xs: 2, sm: 3, md: 4 },
        flexWrap: 'wrap'
      }}>
        {categories.map((category) => (
          <Box
            key={category.id}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
            onClick={() => handleCategoryClick(category.id)}
          >
            {/* Circular Icon */}
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                backgroundColor: selectedCategory === category.id ? '#007bff' : '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1,
                border: selectedCategory === category.id ? '2px solid #007bff' : '2px solid #e9ecef',
                transition: 'all 0.2s ease-in-out'
              }}
            >
              {selectedCategory === category.id ? (
                // Show icon when selected
                <Box sx={{ color: 'white' }}>
                  {category.icon}
                </Box>
              ) : (
                // Show letter when not selected
                <Typography
                  sx={{
                    fontSize: '18px',
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
                fontSize: '12px',
                color: selectedCategory === category.id ? '#007bff' : '#666',
                fontWeight: selectedCategory === category.id ? 'bold' : 'normal',
                textAlign: 'center',
                maxWidth: 60,
                lineHeight: 1.2
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
