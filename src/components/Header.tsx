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
  Avatar
} from '@mui/material';
import {
  ShoppingCart,
  Menu as MenuIcon
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import SearchBar from './SearchBar';

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

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
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

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, py: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography
            component={RouterLink}
            to="/products"
            onClick={() => setMobileOpen(false)}
            sx={{
              color: '#333',
              textDecoration: 'none',
              py: 1.5,
              px: 3,
              fontSize: '16px',
              '&:hover': {
                backgroundColor: '#f8f9fa'
              }
            }}
          >
            Sản phẩm
          </Typography>
          <Typography
            component={RouterLink}
            to="/deals"
            onClick={() => setMobileOpen(false)}
            sx={{
              color: '#333',
              textDecoration: 'none',
              py: 1.5,
              px: 3,
              fontSize: '16px',
              '&:hover': {
                backgroundColor: '#f8f9fa'
              }
            }}
          >
            Ưu đãi
          </Typography>
          <Typography
            component={RouterLink}
            to="/about"
            onClick={() => setMobileOpen(false)}
            sx={{
              color: '#333',
              textDecoration: 'none',
              py: 1.5,
              px: 3,
              fontSize: '16px',
              '&:hover': {
                backgroundColor: '#f8f9fa'
              }
            }}
          >
            Về chúng tôi
          </Typography>
          <Typography
            component={RouterLink}
            to="/contact"
            onClick={() => setMobileOpen(false)}
            sx={{
              color: '#333',
              textDecoration: 'none',
              py: 1.5,
              px: 3,
              fontSize: '16px',
              '&:hover': {
                backgroundColor: '#f8f9fa'
              }
            }}
          >
            Liên hệ
          </Typography>
        </Box>
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
              flexShrink: 0,
              minWidth: { xs: 'auto', md: 'auto' }
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
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            maxWidth: { xs: '100%', md: 500 },
            mx: { xs: 1, md: 2 }
          }}>
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onSearch={handleSearch}
              placeholder="Tìm kiếm..."
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
