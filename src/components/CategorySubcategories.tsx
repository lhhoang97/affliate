import React from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface CategorySubcategoriesProps {
  categoryName: string;
  subcategories: string[];
  color?: string;
}

const CategorySubcategories: React.FC<CategorySubcategoriesProps> = ({
  categoryName,
  subcategories,
  color = '#007bff'
}) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ mb: 4 }}>
      {/* Category Title */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 'bold',
            color: '#333',
            mb: 1
          }}
        >
          {categoryName.toUpperCase()}
        </Typography>
        <Box 
          sx={{ 
            width: 60, 
            height: 3, 
            backgroundColor: color,
            mx: 'auto',
            borderRadius: 2
          }} 
        />
      </Box>

      {/* Subcategories Grid */}
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: '100%',
        overflowX: 'auto'
      }}>
        {subcategories.map((subcategory, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              minWidth: 60,
              '&:hover': {
                transform: 'translateY(-2px)'
              }
            }}
            onClick={() => navigate(`/products?category=${subcategory}`)}
          >
            {/* Circle with letter */}
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1,
              border: '1px solid #e0e0e0',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: 'bold',
                  color: '#333',
                  fontSize: '16px'
                }}
              >
                {subcategory.charAt(0)}
              </Typography>
            </Box>
            {/* Subcategory name */}
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#666',
                fontSize: '12px',
                textAlign: 'center',
                lineHeight: 1.2,
                fontWeight: 500
              }}
            >
              {subcategory}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CategorySubcategories;
