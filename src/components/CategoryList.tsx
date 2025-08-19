import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Popover,
  Paper,
  Divider
} from '@mui/material';
import {
  KeyboardArrowRight,
  LabelOutlined
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { fetchCategories } from '../services/productService';
import { Category } from '../types';

const CategoryList: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

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

  const handleCategoryHover = (event: React.MouseEvent<HTMLElement>, category: Category) => {
    setAnchorEl(event.currentTarget);
    setSelectedCategory(category);
  };

  const handleCategoryLeave = () => {
    setAnchorEl(null);
    setSelectedCategory(null);
  };

  const open = Boolean(anchorEl);

  // Mock subcategories for demonstration
  const getSubcategories = (categoryName: string) => {
    const subcategoryMap: { [key: string]: string[] } = {
      'Thiết bị điện tử': ['Tai nghe', 'Laptop', 'Tablet', 'Điện Thoại', 'Tivi', 'Tủ Lạnh', 'Máy Lạnh'],
      'Đồ Gia Dụng': ['Bếp gas', 'Máy giặt', 'Tủ lạnh', 'Máy lạnh', 'Quạt điện', 'Đèn'],
      'Thời Trang': ['Áo', 'Quần', 'Giày', 'Túi xách', 'Mũ', 'Kính mắt'],
      'Mẹ và Bé': ['Sữa bột', 'Tã bỉm', 'Đồ chơi', 'Quần áo trẻ em', 'Xe đẩy', 'Nôi'],
      'Thể thao - Sức khỏe': ['Giày thể thao', 'Quần áo thể thao', 'Dụng cụ tập', 'Thực phẩm chức năng'],
      'Xe': ['Xe máy', 'Xe đạp', 'Phụ tùng', 'Dầu nhớt', 'Bảo hiểm'],
      'Đồ Dùng Học Sinh': ['Sách vở', 'Bút viết', 'Cặp sách', 'Đồ dùng học tập'],
      'Hàng cũ': ['Điện tử cũ', 'Xe cũ', 'Đồ gia dụng cũ', 'Thời trang cũ']
    };
    return subcategoryMap[categoryName] || ['Sản phẩm 1', 'Sản phẩm 2', 'Sản phẩm 3'];
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 300 }}>
      <Typography variant="h6" sx={{ 
        fontWeight: 'bold', 
        mb: 2, 
        color: '#2c3e50',
        px: 2,
        py: 1,
        backgroundColor: '#f8f9fa',
        borderRadius: 1
      }}>
        Danh Mục Sản Phẩm
      </Typography>
      
      <Paper sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: 2 }}>
        <List sx={{ p: 0 }}>
          {categories.map((category, index) => (
            <ListItem 
              key={category.id} 
              sx={{ p: 0 }}
              onMouseEnter={(e) => handleCategoryHover(e, category)}
              onMouseLeave={handleCategoryLeave}
            >
              <ListItemButton 
                sx={{ 
                  py: 1.5, 
                  px: 2,
                  '&:hover': {
                    backgroundColor: '#e3f2fd'
                  }
                }}
                onClick={() => navigate(`/categories/${category.slug}`)}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {category.image ? (
                    <Box sx={{ 
                      width: 24, 
                      height: 24, 
                      borderRadius: 0.5, 
                      overflow: 'hidden',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }}>
                      <img src={category.image} alt={category.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                  ) : (
                    <LabelOutlined sx={{ color: '#6c757d', fontSize: 20 }} />
                  )}
                </ListItemIcon>
                <ListItemText 
                  primary={category.name}
                  primaryTypographyProps={{ 
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: '#333'
                  }}
                />
                <KeyboardArrowRight sx={{ color: '#6c757d', fontSize: 16 }} />
              </ListItemButton>
              {index < categories.length - 1 && (
                <Divider sx={{ mx: 2 }} />
              )}
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Subcategories Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleCategoryLeave}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        disableRestoreFocus
        disableScrollLock
        PaperProps={{
          sx: {
            ml: 1,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            minWidth: 250
          },
          onMouseEnter: () => {}, // Keep open when hovering popover
          onMouseLeave: handleCategoryLeave
        }}
      >
        {selectedCategory && (
          <Box>
            {/* Category Header */}
            <Box sx={{ 
              backgroundColor: '#f8f9fa', 
              p: 2, 
              borderTopLeftRadius: 8, 
              borderTopRightRadius: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              {selectedCategory.image ? (
                <Box sx={{ 
                  width: 32, 
                  height: 32, 
                  borderRadius: 0.5, 
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}>
                  <img src={selectedCategory.image} alt={selectedCategory.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
              ) : (
                <LabelOutlined sx={{ color: '#6c757d', fontSize: 20 }} />
              )}
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', fontSize: '1rem' }}>
                {selectedCategory.name}
              </Typography>
            </Box>

            {/* Subcategories List */}
            <List sx={{ p: 0 }}>
              {getSubcategories(selectedCategory.name).map((subcategory, index) => (
                <ListItem key={index} sx={{ p: 0 }}>
                  <ListItemButton 
                    sx={{ 
                      py: 1.5, 
                      px: 2,
                      backgroundColor: index === 0 ? '#e3f2fd' : 'transparent',
                      color: index === 0 ? '#1976d2' : '#333',
                      '&:hover': {
                        backgroundColor: index === 0 ? '#e3f2fd' : '#f5f5f5'
                      }
                    }}
                    onClick={() => {
                      navigate(`/products?category=${encodeURIComponent(subcategory)}`);
                      handleCategoryLeave();
                    }}
                  >
                    <ListItemText 
                      primary={subcategory} 
                      primaryTypographyProps={{ 
                        fontSize: '0.875rem',
                        fontWeight: index === 0 ? 600 : 400
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Popover>
    </Box>
  );
};

export default CategoryList;
