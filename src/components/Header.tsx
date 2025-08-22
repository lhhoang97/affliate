import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Drawer,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Divider
} from '@mui/material';
import {
  ShoppingCart,
  Menu as MenuIcon,
  AccountCircle,
  Login,
  PersonAdd
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import SearchBar from './SearchBar';
import Logo from './Logo';

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
  const [accountMenuAnchor, setAccountMenuAnchor] = useState<null | HTMLElement>(null);

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

  const handleAccountMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAccountMenuAnchor(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAccountMenuAnchor(null);
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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Logo variant="mobile" />
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
            Products
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
            Deals
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
            About Us
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
            Contact
          </Typography>
        </Box>
      </Box>

      {/* Account Section */}
      {isAuthenticated ? (
        <Box sx={{ 
          p: 2, 
          borderTop: '1px solid #e9ecef',
          backgroundColor: '#f8f9fa'
        }}>
          <Typography
            component={RouterLink}
            to="/profile"
            onClick={() => setMobileOpen(false)}
            sx={{
              color: '#333',
              textDecoration: 'none',
              py: 1.5,
              px: 3,
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              '&:hover': {
                backgroundColor: '#f8f9fa'
              }
            }}
          >
            <AccountCircle sx={{ fontSize: 20 }} />
            Hồ sơ
          </Typography>
          <Typography
            component={RouterLink}
            to="/orders"
            onClick={() => setMobileOpen(false)}
            sx={{
              color: '#333',
              textDecoration: 'none',
              py: 1.5,
              px: 3,
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              '&:hover': {
                backgroundColor: '#f8f9fa'
              }
            }}
          >
            📦 Đơn hàng
          </Typography>
          {user?.role === 'admin' && (
            <Typography
              component={RouterLink}
              to="/admin"
              onClick={() => setMobileOpen(false)}
              sx={{
                color: '#dc3545',
                textDecoration: 'none',
                py: 1.5,
                px: 3,
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#f8f9fa'
                }
              }}
            >
              🔧 Admin Panel
            </Typography>
          )}
          <Typography
            onClick={() => { 
              logout(); 
              setMobileOpen(false); 
              navigate('/');
            }}
            sx={{
              color: '#dc3545',
              textDecoration: 'none',
              py: 1.5,
              px: 3,
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#f8f9fa'
              }
            }}
          >
            🚪 Đăng xuất
          </Typography>
        </Box>
      ) : (
        <Box sx={{ 
          p: 2, 
          borderTop: '1px solid #e9ecef',
          backgroundColor: '#f8f9fa'
        }}>
          <Typography
            component={RouterLink}
            to="/login"
            onClick={() => setMobileOpen(false)}
            sx={{
              color: '#007bff',
              textDecoration: 'none',
              py: 1.5,
              px: 3,
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              '&:hover': {
                backgroundColor: '#e3f2fd'
              }
            }}
          >
            <Login sx={{ fontSize: 20 }} />
            Đăng nhập
          </Typography>
          <Typography
            component={RouterLink}
            to="/register"
            onClick={() => setMobileOpen(false)}
            sx={{
              color: '#007bff',
              textDecoration: 'none',
              py: 1.5,
              px: 3,
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              '&:hover': {
                backgroundColor: '#e3f2fd'
              }
            }}
          >
            <PersonAdd sx={{ fontSize: 20 }} />
            Đăng ký
          </Typography>
        </Box>
      )}

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
          ©2025 ShopWithUs
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
              <Logo variant="header" onClick={() => navigate('/')} />
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
              placeholder="Search..."
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
              <IconButton
                onClick={handleAccountMenuOpen}
                sx={{
                  color: '#333',
                  ml: 1,
                  '&:hover': {
                    backgroundColor: '#f8f9fa'
                  }
                }}
              >
                <AccountCircle />
              </IconButton>
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

      {/* Account Menu for non-authenticated users */}
      <Menu
        anchorEl={accountMenuAnchor}
        open={Boolean(accountMenuAnchor)}
        onClose={handleAccountMenuClose}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            minWidth: 200
          }
        }}
      >
        <MenuItem 
          onClick={() => { 
            navigate('/login'); 
            handleAccountMenuClose(); 
          }}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            py: 1.5
          }}
        >
          <Login sx={{ fontSize: 20 }} />
          Đăng nhập
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => { 
            navigate('/register'); 
            handleAccountMenuClose(); 
          }}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            py: 1.5
          }}
        >
          <PersonAdd sx={{ fontSize: 20 }} />
          Đăng ký
        </MenuItem>
      </Menu>
    </>
  );
};

export default Header;
