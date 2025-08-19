import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  InputBase
} from '@mui/material';
import {
  ShoppingCart,
  Menu as MenuIcon,
  Search
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Debug user role
  console.log('Header - Current user:', user);
  console.log('Header - User role:', user?.role);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleDrawerToggle = () => {
    console.log('Drawer toggle clicked, current state:', mobileOpen);
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate('/');
  };

  const cartItemCount = items.reduce((total: number, item: any) => total + item.quantity, 0);

  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const categories = [
    {
      id: 'electronics',
      name: 'Electronics',
      icon: '📱',
      subcategories: ['Phones', 'Laptops', 'Tablets', 'TVs', 'Headphones', 'Speakers', 'Cameras']
    },
    {
      id: 'home',
      name: 'Home & Garden',
      icon: '🏠',
      subcategories: ['Home Appliances', 'Furniture', 'Decor', 'Kitchen Tools', 'Bathroom Items']
    },
    {
      id: 'fashion',
      name: 'Fashion',
      icon: '👕',
      subcategories: ['Men\'s Clothing', 'Women\'s Clothing', 'Shoes', 'Bags', 'Accessories', 'Watches']
    },
    {
      id: 'beauty',
      name: 'Beauty',
      icon: '💄',
      subcategories: ['Cosmetics', 'Skincare', 'Haircare', 'Perfume', 'Beauty Tools']
    },
    {
      id: 'sports',
      name: 'Sports',
      icon: '⚽',
      subcategories: ['Sports Clothing', 'Sports Shoes', 'Exercise Equipment', 'Bicycles', 'Football']
    },
    {
      id: 'baby',
      name: 'Baby & Kids',
      icon: '👶',
      subcategories: ['Baby Items', 'Baby Formula', 'Diapers', 'Toys', 'Strollers', 'Cribs']
    },
    {
      id: 'automotive',
      name: 'Automotive',
      icon: '🚗',
      subcategories: ['Auto Parts', 'Motor Oil', 'Insurance', 'Car Toys', 'Car Accessories']
    },
    {
      id: 'books',
      name: 'Books & Office',
      icon: '📚',
      subcategories: ['Textbooks', 'Literature', 'Office Supplies', 'School Supplies']
    }
  ];

  const handleCategoryClick = (categoryId: string) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryId);
    }
  };

  const drawer = (
    <Box sx={{ width: 280, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ 
        p: 3, 
        borderBottom: '1px solid #e9ecef',
        backgroundColor: '#f8f9fa'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ 
            position: 'relative',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 16,
              height: 16,
              backgroundColor: '#ff4444',
              borderRadius: '50% 50% 0 50%',
              transform: 'rotate(-45deg)'
            }} />
            <Box sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 12,
              height: 12,
              backgroundColor: '#ffaa00',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '8px',
              color: '#333'
            }}>
              ☀
            </Box>
          </Box>
          <Typography sx={{ 
            color: '#007bff', 
            fontWeight: 'bold', 
            fontSize: '18px',
            textTransform: 'lowercase'
          }}>
            giatotday
          </Typography>
        </Box>
      </Box>

      {/* Categories */}
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {categories.map((category) => (
          <Box key={category.id}>
            <Box
              onClick={() => handleCategoryClick(category.id)}
              sx={{
                p: 2.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                borderBottom: '1px solid #f0f0f0',
                '&:hover': {
                  backgroundColor: '#f8f9fa'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontSize: '20px' }}>
                  {category.icon}
                </Typography>
                <Typography sx={{ 
                  fontSize: '16px',
                  fontWeight: 500,
                  color: '#333'
                }}>
                  {category.name}
                </Typography>
              </Box>
              <Typography sx={{ 
                fontSize: '16px',
                color: '#666',
                transform: expandedCategory === category.id ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }}>
                ›
              </Typography>
            </Box>
            
            {/* Subcategories */}
            {expandedCategory === category.id && (
              <Box sx={{ backgroundColor: '#f8f9fa' }}>
                {category.subcategories.map((subcategory, index) => (
                  <Box
                    key={index}
                    onClick={() => {
                      navigate(`/products?category=${encodeURIComponent(subcategory)}`);
                      setMobileOpen(false);
                      setExpandedCategory(null);
                    }}
                    sx={{
                      py: 1.5,
                      px: 4,
                      cursor: 'pointer',
                      borderBottom: '1px solid #e9ecef',
                      '&:hover': {
                        backgroundColor: '#e9ecef'
                      }
                    }}
                  >
                    <Typography sx={{ 
                      fontSize: '14px',
                      color: '#666'
                    }}>
                      {subcategory}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        ))}
      </Box>

      {/* Footer */}
      <Box sx={{ 
        p: 2, 
        borderTop: '1px solid #e9ecef',
        backgroundColor: '#f8f9fa'
      }}>
        <Typography sx={{ 
          fontSize: '12px',
          color: '#666',
          textAlign: 'center'
        }}>
          ©2025 GiaTotDay
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: 'white', color: '#333', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', minHeight: 64 }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, md: 3 } }}>
          {/* Left side: Hamburger menu and Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              onClick={handleDrawerToggle}
              sx={{ color: '#333' }}
            >
              <MenuIcon />
            </IconButton>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              flexShrink: 0
            }}>
              <Box sx={{ 
                position: 'relative',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 16,
                  height: 16,
                  backgroundColor: '#ff4444',
                  borderRadius: '50% 50% 0 50%',
                  transform: 'rotate(-45deg)'
                }} />
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 12,
                  height: 12,
                  backgroundColor: '#ffaa00',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '8px',
                  color: '#333'
                }}>
                  ☀
                </Box>
              </Box>
              <Typography
                component={RouterLink}
                to="/"
                sx={{
                  textDecoration: 'none',
                  color: '#007bff',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  textTransform: 'lowercase'
                }}
              >
                giatotday
              </Typography>
            </Box>
          </Box>
          
          {/* Center: Search bar */}
          <Box 
            component="form" 
            onSubmit={handleSearch}
            sx={{ 
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              backgroundColor: '#f1f3f4',
              borderRadius: '24px',
              px: 2,
              py: 1,
              flex: 1,
              maxWidth: 500,
              mx: 2
            }}
          >
            <IconButton sx={{ p: 0.5, color: '#666' }}>
              <Search />
            </IconButton>
            <InputBase
              placeholder="What are you looking for?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ 
                ml: 1, 
                flex: 1,
                fontSize: '16px',
                color: '#333'
              }}
            />
          </Box>
          
          {/* Right side: Cart and User */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Cart Icon */}
            <IconButton
              component={RouterLink}
              to="/cart"
              sx={{
                color: '#333',
                ml: 1,
                '&:hover': {
                  backgroundColor: '#f8f9fa'
                }
              }}
            >
              <Badge badgeContent={cartItemCount} color="primary">
                <ShoppingCart />
              </Badge>
            </IconButton>

            {/* Account Menu */}
            {isAuthenticated ? (
              <IconButton
                onClick={handleProfileMenuOpen}
                sx={{
                  color: '#333',
                  ml: 1,
                  '&:hover': {
                    backgroundColor: '#f8f9fa'
                  }
                }}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#007bff' }}>
                  {user?.name?.charAt(0) || 'U'}
                </Avatar>
              </IconButton>
            ) : (
              <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, ml: 2 }}>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  sx={{
                    borderColor: '#007bff',
                    color: '#007bff',
                    '&:hover': {
                      borderColor: '#0056b3',
                      backgroundColor: '#f8f9fa'
                    }
                  }}
                >
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  sx={{
                    backgroundColor: '#007bff',
                    '&:hover': {
                      backgroundColor: '#0056b3'
                    }
                  }}
                >
                  Register
                </Button>
              </Box>
                          )}

            {/* Mobile Search Button */}
            <IconButton
              color="inherit"
              aria-label="search"
              onClick={() => navigate('/search')}
              sx={{ display: { md: 'none' } }}
            >
              <Search />
            </IconButton>
            </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            backgroundColor: 'white',
            color: '#333'
          }
        }}
      >
        {drawer}
      </Drawer>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          }
        }}
      >
        <MenuItem onClick={() => { navigate('/profile'); handleProfileMenuClose(); }}>
          Profile
        </MenuItem>
        <MenuItem onClick={() => { navigate('/orders'); handleProfileMenuClose(); }}>
          Orders
        </MenuItem>
        <MenuItem onClick={() => { navigate('/profile?tab=wishlist'); handleProfileMenuClose(); }}>
          Wishlist
        </MenuItem>
        {user?.role === 'admin' && (
          <MenuItem onClick={() => { navigate('/admin'); handleProfileMenuClose(); }} sx={{ color: '#dc3545', fontWeight: 600 }}>
            🔧 Admin Panel
          </MenuItem>
        )}
        <MenuItem onClick={handleLogout}>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default Header;
