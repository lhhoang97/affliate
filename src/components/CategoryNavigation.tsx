import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
  Badge
} from '@mui/material';
import {
  Menu,
  ExpandLess,
  ExpandMore,
  Category,
  TrendingUp,
  NewReleases,
  Star
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { categories, featuredCategories, newCategories } from '../data/categories';

interface CategoryNavigationProps {
  variant?: 'horizontal' | 'vertical' | 'drawer';
  showFeatured?: boolean;
  showNew?: boolean;
  maxItems?: number;
}

const CategoryNavigation: React.FC<CategoryNavigationProps> = ({
  variant = 'horizontal',
  showFeatured = true,
  showNew = true,
  maxItems = 8
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const handleCategoryClick = (categorySlug: string) => {
    navigate(`/category/${categorySlug}`);
    setDrawerOpen(false);
  };

  const handleCategoryToggle = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const isActiveCategory = (categorySlug: string) => {
    return location.pathname === `/category/${categorySlug}`;
  };

  const renderCategoryItem = (category: any, index: number) => {
    const isActive = isActiveCategory(category.slug);
    const isExpanded = expandedCategories.includes(category.id);

    if (variant === 'horizontal') {
      return (
        <Chip
          key={category.id}
          label={category.name}
          icon={category.icon ? <span>{category.icon}</span> : <Category />}
          onClick={() => handleCategoryClick(category.slug)}
          sx={{
            cursor: 'pointer',
            backgroundColor: isActive ? 'primary.main' : 'transparent',
            color: isActive ? 'white' : 'inherit',
            border: isActive ? 'none' : '1px solid #e5e7eb',
            '&:hover': {
              backgroundColor: isActive ? 'primary.dark' : '#f3f4f6',
              transform: 'translateY(-1px)'
            },
            transition: 'all 0.2s ease-in-out',
            fontWeight: isActive ? 600 : 500
          }}
        />
      );
    }

    return (
      <ListItem key={category.id} disablePadding>
        <ListItemButton
          onClick={() => handleCategoryClick(category.slug)}
          selected={isActive}
          sx={{
            borderRadius: 1,
            mx: 1,
            mb: 0.5,
            '&.Mui-selected': {
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark'
              }
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            {category.icon ? (
              <span style={{ fontSize: '1.2rem' }}>{category.icon}</span>
            ) : (
              <Category />
            )}
          </ListItemIcon>
          <ListItemText 
            primary={category.name}
            primaryTypographyProps={{
              fontWeight: isActive ? 600 : 500
            }}
          />
          {category.productCount > 0 && (
            <Badge 
              badgeContent={category.productCount} 
              color="secondary"
              sx={{ mr: 1 }}
            />
          )}
        </ListItemButton>
      </ListItem>
    );
  };

  const renderFeaturedSection = () => {
    if (!showFeatured || featuredCategories.length === 0) return null;

    return (
      <>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 600, px: 2, mb: 1, color: 'primary.main' }}>
          <TrendingUp sx={{ mr: 1, fontSize: '1rem' }} />
          Featured Categories
        </Typography>
        {featuredCategories.slice(0, maxItems).map(renderCategoryItem)}
      </>
    );
  };

  const renderNewSection = () => {
    if (!showNew || newCategories.length === 0) return null;

    return (
      <>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 600, px: 2, mb: 1, color: 'success.main' }}>
          <NewReleases sx={{ mr: 1, fontSize: '1rem' }} />
          New Categories
        </Typography>
        {newCategories.slice(0, maxItems).map(renderCategoryItem)}
      </>
    );
  };

  if (variant === 'horizontal') {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 1, 
        alignItems: 'center',
        py: 2
      }}>
        {categories.slice(0, maxItems).map(renderCategoryItem)}
        
        {showFeatured && featuredCategories.length > 0 && (
          <>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
              Featured:
            </Typography>
            {featuredCategories.slice(0, 3).map(renderCategoryItem)}
          </>
        )}
      </Box>
    );
  }

  if (variant === 'drawer') {
    return (
      <>
        <IconButton
          onClick={() => setDrawerOpen(true)}
          sx={{ color: 'inherit' }}
        >
          <Menu />
        </IconButton>
        
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{
            sx: {
              width: 280,
              backgroundColor: '#f8fafc'
            }
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Categories
            </Typography>
            
            <List sx={{ p: 0 }}>
              {categories.slice(0, maxItems).map(renderCategoryItem)}
              {renderFeaturedSection()}
              {renderNewSection()}
            </List>
          </Box>
        </Drawer>
      </>
    );
  }

  // Vertical variant
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Categories
      </Typography>
      
      <List sx={{ p: 0 }}>
        {categories.slice(0, maxItems).map(renderCategoryItem)}
        {renderFeaturedSection()}
        {renderNewSection()}
      </List>
    </Box>
  );
};

export default CategoryNavigation;
