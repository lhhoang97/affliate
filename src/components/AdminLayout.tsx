import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Inventory,
  Category,
  People,
  Settings,
  Logout,
  Notifications,
  AccountCircle,
  Update,
  ViewList,
  Slideshow,
  ListAlt,
  LocalOffer,
  Whatshot,
  Tune,
  Psychology,
  ShoppingCart
} from '@mui/icons-material';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 240;

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenu = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    handleClose();
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/admin' },
    { text: 'Product Management', icon: <Inventory />, path: '/admin/products' },
    { text: 'Category Management', icon: <Category />, path: '/admin/categories' },
    { text: 'Menu Management', icon: <ListAlt />, path: '/admin/menu-management' },
    { text: 'Coupon Management', icon: <LocalOffer />, path: '/admin/coupon-management' },
    { text: 'Deal Management', icon: <Whatshot />, path: '/admin/deal-management' },
    { text: 'Deal Configuration', icon: <Tune />, path: '/admin/deal-config' },
    { text: 'AI Assistant', icon: <Psychology />, path: '/admin/ai-assistant' },
    { text: 'Amazon Products', icon: <ShoppingCart />, path: '/admin/amazon' },
    { text: 'Price Updates', icon: <Update />, path: '/admin/price-updates' },
    { text: 'Section Management', icon: <ViewList />, path: '/admin/section-management' },
    { text: 'Section Products', icon: <Slideshow />, path: '/admin/section-products' },
    { text: 'Slider Products', icon: <Slideshow />, path: '/admin/slider-products' },
    { text: 'User Management', icon: <People />, path: '/admin/users' },
    { text: 'Settings', icon: <Settings />, path: '/admin/settings' },
  ];

  const drawer = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: 'white'
    }}>
      <Box sx={{ 
        p: 2, 
        textAlign: 'center', 
        borderBottom: 1, 
        borderColor: 'divider', 
        flexShrink: 0,
        backgroundColor: '#f8f9fa'
      }}>
        <Typography variant="h6" color="primary" fontWeight="bold">
          Admin Panel
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Quản lý hệ thống
        </Typography>
      </Box>
      <Box sx={{ 
        flexGrow: 1, 
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#c1c1c1',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#a8a8a8',
        },
      }}>
        <List sx={{ p: 0 }}>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false); // Close mobile drawer after navigation
              }}
              sx={{
                cursor: 'pointer',
                py: 1.5,
                px: 2,
                '&:hover': {
                  backgroundColor: 'primary.light',
                  '& .MuiListItemIcon-root': {
                    color: 'primary.main',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: 'text.secondary', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '14px',
                  fontWeight: 500
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ flexShrink: 0, backgroundColor: '#f8f9fa' }}>
        <Divider />
        <List sx={{ p: 0 }}>
          <ListItem 
            onClick={handleLogout} 
            sx={{ 
              cursor: 'pointer',
              py: 1.5,
              px: 2,
              '&:hover': {
                backgroundColor: 'error.light',
                '& .MuiListItemIcon-root': {
                  color: 'error.main',
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Logout />
            </ListItemIcon>
            <ListItemText 
              primary="Logout"
              primaryTypographyProps={{
                fontSize: '14px',
                fontWeight: 500,
                color: 'error.main'
              }}
            />
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'white',
          color: 'text.primary',
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton 
              color="inherit"
              onClick={handleNotificationMenu}
            >
              <Badge badgeContent={4} color="error">
                <Notifications />
              </Badge>
            </IconButton>
            <IconButton
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                {user?.name?.charAt(0) || <AccountCircle />}
              </Avatar>
            </IconButton>
            {/* Notification Menu */}
            <Menu
              anchorEl={notificationAnchor}
              open={Boolean(notificationAnchor)}
              onClose={handleNotificationClose}
              PaperProps={{
                sx: {
                  width: 320,
                  maxHeight: 400
                }
              }}
            >
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6">Notifications</Typography>
              </Box>
              <MenuItem onClick={handleNotificationClose}>
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    New Product Added
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    iPhone 15 Pro Max has been added to inventory
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary">
                    2 minutes ago
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem onClick={handleNotificationClose}>
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    Price Update
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    MacBook Pro M3 price has been updated
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary">
                    1 hour ago
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem onClick={handleNotificationClose}>
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    New User Registration
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    John Doe has registered as a new user
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary">
                    3 hours ago
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem onClick={handleNotificationClose}>
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    System Update
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    System maintenance completed successfully
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary">
                    1 day ago
                  </Typography>
                </Box>
              </MenuItem>
              <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
                <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                  View All Notifications
                </Typography>
              </Box>
            </Menu>

            {/* Profile Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>Settings</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              height: '100vh',
              overflow: 'hidden',
              backgroundColor: 'white'
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
