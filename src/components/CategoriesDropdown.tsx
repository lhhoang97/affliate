import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Chip,
  Divider
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  Category,
  TrendingUp,
  NewReleases,
  KeyboardArrowDown
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { categories, featuredCategories, newCategories } from '../data/categories';

interface CategoriesDropdownProps {
  variant?: 'horizontal' | 'vertical' | 'grid';
  showFeatured?: boolean;
  showNew?: boolean;
  maxItems?: number;
  title?: string;
}

const CategoriesDropdown: React.FC<CategoriesDropdownProps> = ({
  variant = 'grid',
  showFeatured = true,
  showNew = true,
  maxItems = 12,
  title = "Browse Categories"
}) => {
  const navigate = useNavigate();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const handleCategoryToggle = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleCategoryClick = (categorySlug: string) => {
    navigate(`/category/${categorySlug}`);
  };

  const renderCategoryItem = (category: any, isSubcategory = false) => {
    const isExpanded = expandedCategories.includes(category.id);
    const hasSubcategories = category.subcategories && category.subcategories.length > 0;

    return (
      <Box key={category.id}>
        <ListItemButton
          onClick={() => {
            if (hasSubcategories) {
              handleCategoryToggle(category.id);
            } else {
              handleCategoryClick(category.slug);
            }
          }}
          sx={{
            py: 1.5,
            px: 3,
            fontSize: '16px',
            transition: 'all 0.2s ease-in-out',
            backgroundColor: isSubcategory ? '#f8f9fa' : 'transparent',
            borderRadius: 1,
            '&:hover': {
              backgroundColor: '#e3f2fd',
              transform: 'translateX(8px)',
              paddingLeft: '2rem'
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            {category.icon ? (
              <span style={{ fontSize: '1.2rem' }}>{category.icon}</span>
            ) : (
              <Category sx={{ fontSize: 20 }} />
            )}
          </ListItemIcon>
          <ListItemText 
            primary={category.name}
            primaryTypographyProps={{
              fontSize: isSubcategory ? '14px' : '16px',
              fontWeight: isSubcategory ? 400 : 500
            }}
          />
          {hasSubcategories && (
            isExpanded ? <ExpandLess /> : <ExpandMore />
          )}
        </ListItemButton>
        
        {hasSubcategories && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {category.subcategories.map((subcategory: any) => (
                <ListItemButton
                  key={subcategory.id}
                  onClick={() => handleCategoryClick(subcategory.slug)}
                  sx={{
                    py: 1,
                    px: 4,
                    fontSize: '14px',
                    transition: 'all 0.2s ease-in-out',
                    backgroundColor: '#f8f9fa',
                    borderRadius: 1,
                    mx: 1,
                    '&:hover': {
                      backgroundColor: '#e3f2fd',
                      transform: 'translateX(8px)',
                      paddingLeft: '2.5rem'
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    {subcategory.icon ? (
                      <span style={{ fontSize: '1rem' }}>{subcategory.icon}</span>
                    ) : (
                      <Category sx={{ fontSize: 16 }} />
                    )}
                  </ListItemIcon>
                  <ListItemText 
                    primary={subcategory.name}
                    primaryTypographyProps={{
                      fontSize: '14px',
                      fontWeight: 400
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  const renderGridCategories = () => {
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {/* Main Categories */}
        <Card sx={{ 
          backgroundColor: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: 2,
          overflow: 'hidden'
        }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ 
              p: 3, 
              backgroundColor: '#1976d2',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Category sx={{ fontSize: 24 }} />
                {title}
              </Typography>
              <KeyboardArrowDown sx={{ fontSize: 20 }} />
            </Box>
            
            <List sx={{ p: 0, maxHeight: 400, overflowY: 'auto' }}>
              {categories.slice(0, maxItems).map(category => renderCategoryItem(category))}
            </List>
          </CardContent>
        </Card>

        {/* Featured & New Categories */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {showFeatured && featuredCategories.length > 0 && (
            <Card sx={{ 
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderRadius: 2,
              overflow: 'hidden'
            }}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ 
                  p: 3, 
                  backgroundColor: '#2e7d32',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <TrendingUp sx={{ fontSize: 24 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Featured Categories
                  </Typography>
                </Box>
                
                <List sx={{ p: 0, maxHeight: 200, overflowY: 'auto' }}>
                  {featuredCategories.slice(0, 4).map(category => renderCategoryItem(category))}
                </List>
              </CardContent>
            </Card>
          )}

          {showNew && newCategories.length > 0 && (
            <Card sx={{ 
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderRadius: 2,
              overflow: 'hidden'
            }}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ 
                  p: 3, 
                  backgroundColor: '#ed6c02',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <NewReleases sx={{ fontSize: 24 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    New Categories
                  </Typography>
                </Box>
                
                <List sx={{ p: 0, maxHeight: 200, overflowY: 'auto' }}>
                  {newCategories.slice(0, 4).map(category => renderCategoryItem(category))}
                </List>
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>
    );
  };

  const renderHorizontalCategories = () => {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 1, 
        alignItems: 'center',
        py: 2
      }}>
        {categories.slice(0, maxItems).map(category => (
          <Chip
            key={category.id}
            label={category.name}
            icon={category.icon ? <span>{category.icon}</span> : <Category />}
            onClick={() => handleCategoryClick(category.slug)}
            sx={{
              cursor: 'pointer',
              backgroundColor: 'white',
              color: '#333',
              border: '1px solid #e5e7eb',
              '&:hover': {
                backgroundColor: '#f3f4f6',
                transform: 'translateY(-1px)'
              },
              transition: 'all 0.2s ease-in-out',
              fontWeight: 500
            }}
          />
        ))}
      </Box>
    );
  };

  const renderVerticalCategories = () => {
    return (
      <Card sx={{ 
        backgroundColor: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderRadius: 2,
        overflow: 'hidden'
      }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ 
            p: 3, 
            backgroundColor: '#1976d2',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <Category sx={{ fontSize: 24 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
          </Box>
          
          <List sx={{ p: 0, maxHeight: 400, overflowY: 'auto' }}>
            {categories.slice(0, maxItems).map(category => renderCategoryItem(category))}
            
            {showFeatured && featuredCategories.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ px: 2, mb: 2 }}>
                  <Typography sx={{ 
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#1976d2',
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <TrendingUp sx={{ fontSize: 18 }} />
                    Featured Categories
                  </Typography>
                </Box>
                {featuredCategories.slice(0, 3).map(category => renderCategoryItem(category))}
              </>
            )}

            {showNew && newCategories.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ px: 2, mb: 2 }}>
                  <Typography sx={{ 
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#2e7d32',
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <NewReleases sx={{ fontSize: 18 }} />
                    New Categories
                  </Typography>
                </Box>
                {newCategories.slice(0, 3).map(category => renderCategoryItem(category))}
              </>
            )}
          </List>
        </CardContent>
      </Card>
    );
  };

  if (variant === 'horizontal') {
    return renderHorizontalCategories();
  }

  if (variant === 'vertical') {
    return renderVerticalCategories();
  }

  return renderGridCategories();
};

export default CategoriesDropdown;
