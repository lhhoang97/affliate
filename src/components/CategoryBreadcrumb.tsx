import React from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Home,
  Category,
  Clear,
  ArrowBack
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface CategoryBreadcrumbProps {
  categoryName: string;
  productCount: number;
  onClear: () => void;
}

const CategoryBreadcrumb: React.FC<CategoryBreadcrumbProps> = ({
  categoryName,
  productCount,
  onClear
}) => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleCategoriesClick = () => {
    navigate('/categories');
  };

  return (
    <Box sx={{ mb: 3, p: 2, bgcolor: 'primary.light', borderRadius: 2, color: 'white' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            color="inherit" 
            onClick={handleHomeClick}
            size="small"
          >
            <ArrowBack />
          </IconButton>
          
          <Breadcrumbs 
            separator="›" 
            sx={{ 
              color: 'white',
              '& .MuiBreadcrumbs-separator': { color: 'white' }
            }}
          >
            <Link
              color="inherit"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleHomeClick();
              }}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5,
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              <Home fontSize="small" />
              Trang chủ
            </Link>
            <Link
              color="inherit"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleCategoriesClick();
              }}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5,
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              <Category fontSize="small" />
              Danh mục
            </Link>
            <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {categoryName}
            </Typography>
          </Breadcrumbs>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            label={`${productCount} sản phẩm`}
            size="small"
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)', 
              color: 'white',
              fontWeight: 'bold'
            }}
          />
          <Tooltip title="Xóa bộ lọc danh mục">
            <IconButton 
              color="inherit" 
              onClick={onClear}
              size="small"
            >
              <Clear />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

export default CategoryBreadcrumb;
