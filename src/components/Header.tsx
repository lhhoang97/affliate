import React, { useState, useEffect } from 'react';
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
  Divider,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  ShoppingCart,
  Menu as MenuIcon,
  AccountCircle,
  Login,
  PersonAdd,
  ExpandLess,
  ExpandMore,
  Category,
  TrendingUp,
  NewReleases,
  Inventory,
  LocalOffer,
  Whatshot
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../contexts/ProductContext';
import SearchBarSimple from './SearchBarSimple';
import Logo from './Logo';
import CategoryNavigation from './CategoryNavigation';
import { categories, featuredCategories, newCategories } from '../data/categories';
import { menuService, MenuCategory } from '../services/menuService';
import { couponService, CouponRetailer } from '../services/couponService';
import { dealService, DealCategory } from '../services/dealService';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { items } = useCart();
  const { products } = useProducts();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Debug user role
  console.log('Header - Current user:', user);
  console.log('Header - User role:', user?.role);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [accountMenuAnchor, setAccountMenuAnchor] = useState<null | HTMLElement>(null);
  const [productsExpanded, setProductsExpanded] = useState(false);
  const [couponsExpanded, setCouponsExpanded] = useState(false);
  const [dealsExpanded, setDealsExpanded] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [expandedRetailers, setExpandedRetailers] = useState<Record<string, boolean>>({});
  const [expandedDealCategories, setExpandedDealCategories] = useState<Record<string, boolean>>({});
  
  // Menu categories from database
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  
  // Coupon retailers from database
  const [couponRetailers, setCouponRetailers] = useState<CouponRetailer[]>([]);
  const [loadingCoupons, setLoadingCoupons] = useState(true);
  
  // Deal categories from database
  const [dealCategories, setDealCategories] = useState<DealCategory[]>([]);
  const [loadingDeals, setLoadingDeals] = useState(true);

  // Load menu categories from database
  useEffect(() => {
    const loadMenuCategories = async () => {
      try {
        setLoadingMenu(true);
        const categories = await menuService.getMenuCategories();
        setMenuCategories(categories);
      } catch (error) {
        console.error('Error loading menu categories:', error);
        // Fallback to hardcoded categories if database fails
        setMenuCategories([]);
      } finally {
        setLoadingMenu(false);
      }
    };

    loadMenuCategories();
  }, []);

  // Load coupon retailers from database
  useEffect(() => {
    const loadCouponRetailers = async () => {
      try {
        setLoadingCoupons(true);
        const retailers = await couponService.getCouponRetailers();
        setCouponRetailers(retailers);
      } catch (error) {
        console.error('Error loading coupon retailers:', error);
        setCouponRetailers([]);
      } finally {
        setLoadingCoupons(false);
      }
    };

    loadCouponRetailers();
  }, []);

  // Load deal categories from database
  useEffect(() => {
    const loadDealCategories = async () => {
      try {
        setLoadingDeals(true);
        const categories = await dealService.getDealCategories();
        setDealCategories(categories);
      } catch (error) {
        console.error('Error loading deal categories:', error);
        setDealCategories([]);
      } finally {
        setLoadingDeals(false);
      }
    };

    loadDealCategories();
  }, []);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleDrawerToggle = () => {
    console.log('🍔 Drawer toggle function called, current state:', mobileOpen);
    console.log('🍔 Setting mobileOpen to:', !mobileOpen);
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

  const handleCategoryClick = (categorySlug: string) => {
    navigate(`/category/${categorySlug}`);
    setMobileOpen(false);
  };

  const handleSubcategoryClick = (subcategorySlug: string) => {
    navigate(`/category/${subcategorySlug}`);
    setMobileOpen(false);
  };

  const handleCouponCategoryClick = (categorySlug: string) => {
    navigate(`/coupons/${categorySlug}`);
    setMobileOpen(false);
  };

  const handleDealCategoryClick = (categorySlug: string) => {
    navigate(`/deals/${categorySlug}`);
    setMobileOpen(false);
  };

  const toggleCategoryExpansion = (categoryId: number) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const toggleRetailerExpansion = (retailerId: number) => {
    setExpandedRetailers(prev => ({
      ...prev,
      [retailerId]: !prev[retailerId]
    }));
  };

  const toggleDealCategoryExpansion = (categoryId: number) => {
    setExpandedDealCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const cartItemCount = items.reduce((total: number, item: any) => total + item.quantity, 0);

  const drawer = (
    <Box sx={{ 
      width: 280, 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: 'white',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 3, 
        borderBottom: '1px solid #e9ecef',
        backgroundColor: '#f8f9fa',
        flexShrink: 0
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Logo variant="mobile" />
        </Box>
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ 
        flex: 1, 
        py: 2,
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#c1c1c1',
          borderRadius: '2px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#a8a8a8',
        },
      }}>
        <List sx={{ p: 0 }}>
          {/* Products Section with Dropdown */}
          <ListItemButton
            onClick={() => setProductsExpanded(!productsExpanded)}
            sx={{
              py: 1.5,
              px: 3,
              fontSize: '16px',
              fontWeight: 600,
              backgroundColor: productsExpanded ? '#e3f2fd' : 'transparent',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: '#f8f9fa',
                transform: 'translateX(8px)',
                paddingLeft: '2rem'
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Inventory sx={{ fontSize: 20, color: '#1976d2' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Products"
              primaryTypographyProps={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#1976d2'
              }}
            />
            {productsExpanded ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          {/* Products Dropdown */}
          <Collapse in={productsExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {loadingMenu ? (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Loading categories...
                  </Typography>
                </Box>
              ) : menuCategories.length > 0 ? (
                menuCategories.map((category) => (
                  <Box key={category.id}>
                    {/* Main Category */}
                    <ListItemButton
                      onClick={() => toggleCategoryExpansion(category.id)}
                      sx={{
                        py: 1,
                        px: 4,
                        fontSize: '14px',
                        fontWeight: 500,
                        backgroundColor: expandedCategories[category.id] ? '#f5f5f5' : '#f8f9fa',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: '#e3f2fd',
                          transform: 'translateX(8px)',
                          paddingLeft: '2.5rem'
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <span style={{ fontSize: '1.2rem' }}>{category.icon}</span>
                      </ListItemIcon>
                      <ListItemText 
                        primary={category.name}
                        primaryTypographyProps={{
                          fontSize: '14px',
                          fontWeight: 500,
                          color: '#333'
                        }}
                      />
                      {expandedCategories[category.id] ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>

                    {/* Subcategories */}
                    <Collapse in={expandedCategories[category.id]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {category.subcategories?.map((subcategory) => (
                          <ListItemButton
                            key={subcategory.id}
                            onClick={() => handleSubcategoryClick(subcategory.slug)}
                            sx={{
                              py: 0.8,
                              px: 6,
                              fontSize: '13px',
                              transition: 'all 0.2s ease-in-out',
                              backgroundColor: '#ffffff',
                              borderLeft: '2px solid #e0e0e0',
                              '&:hover': {
                                backgroundColor: '#f0f8ff',
                                transform: 'translateX(8px)',
                                paddingLeft: '3rem',
                                borderLeft: '2px solid #1976d2'
                              }
                            }}
                          >
                            <ListItemText 
                              primary={subcategory.name}
                              primaryTypographyProps={{
                                fontSize: '13px',
                                fontWeight: 400,
                                color: '#666'
                              }}
                            />
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                  </Box>
                ))
              ) : (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No categories available
                  </Typography>
                </Box>
              )}
            </List>
          </Collapse>

          {/* Coupons Section with Dropdown */}
          <ListItemButton
            onClick={() => setCouponsExpanded(!couponsExpanded)}
            sx={{
              py: 1.5,
              px: 3,
              fontSize: '16px',
              fontWeight: 600,
              backgroundColor: couponsExpanded ? '#fce4ec' : 'transparent',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: '#f8f9fa',
                transform: 'translateX(8px)',
                paddingLeft: '2rem'
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <LocalOffer sx={{ fontSize: 20, color: '#e91e63' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Coupons"
              primaryTypographyProps={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#e91e63'
              }}
            />
            {couponsExpanded ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          {/* Coupons Dropdown */}
          <Collapse in={couponsExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {loadingCoupons ? (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Loading coupons...
                  </Typography>
                </Box>
              ) : couponRetailers.length > 0 ? (
                couponRetailers.map((retailer) => (
                  <Box key={retailer.id}>
                    {/* Main Retailer */}
                    <ListItemButton
                      onClick={() => toggleRetailerExpansion(retailer.id)}
                      sx={{
                        py: 1,
                        px: 4,
                        fontSize: '14px',
                        fontWeight: 500,
                        backgroundColor: expandedRetailers[retailer.id] ? '#f5f5f5' : '#f8f9fa',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: '#fce4ec',
                          transform: 'translateX(8px)',
                          paddingLeft: '2.5rem'
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <span style={{ fontSize: '1.2rem' }}>{retailer.icon}</span>
                      </ListItemIcon>
                      <ListItemText 
                        primary={retailer.name}
                        primaryTypographyProps={{
                          fontSize: '14px',
                          fontWeight: 500,
                          color: '#333'
                        }}
                      />
                      {expandedRetailers[retailer.id] ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>

                    {/* Coupon Categories */}
                    <Collapse in={expandedRetailers[retailer.id]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {retailer.categories?.map((category) => (
                          <ListItemButton
                            key={category.id}
                            onClick={() => handleCouponCategoryClick(category.slug)}
                            sx={{
                              py: 0.8,
                              px: 6,
                              fontSize: '13px',
                              transition: 'all 0.2s ease-in-out',
                              backgroundColor: '#ffffff',
                              borderLeft: '2px solid #e0e0e0',
                              '&:hover': {
                                backgroundColor: '#fce4ec',
                                transform: 'translateX(8px)',
                                paddingLeft: '3rem',
                                borderLeft: '2px solid #e91e63'
                              }
                            }}
                          >
                            <ListItemText 
                              primary={category.name}
                              primaryTypographyProps={{
                                fontSize: '13px',
                                fontWeight: 400,
                                color: '#666'
                              }}
                            />
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                  </Box>
                ))
              ) : (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No coupons available
                  </Typography>
                </Box>
              )}
            </List>
          </Collapse>

          {/* Deals Section with Dropdown */}
          <ListItemButton
            onClick={() => setDealsExpanded(!dealsExpanded)}
            sx={{
              py: 1.5,
              px: 3,
              fontSize: '16px',
              fontWeight: 600,
              backgroundColor: dealsExpanded ? '#fff3e0' : 'transparent',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: '#f8f9fa',
                transform: 'translateX(8px)',
                paddingLeft: '2rem'
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Whatshot sx={{ fontSize: 20, color: '#ff9800' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Deals"
              primaryTypographyProps={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#ff9800'
              }}
            />
            {dealsExpanded ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          {/* Deals Dropdown */}
          <Collapse in={dealsExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {loadingDeals ? (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Loading deals...
                  </Typography>
                </Box>
              ) : dealCategories.length > 0 ? (
                dealCategories.map((category) => (
                  <Box key={category.id}>
                    {/* Main Deal Category */}
                    <ListItemButton
                      onClick={() => toggleDealCategoryExpansion(category.id)}
                      sx={{
                        py: 1,
                        px: 4,
                        fontSize: '14px',
                        fontWeight: 500,
                        backgroundColor: expandedDealCategories[category.id] ? '#f5f5f5' : '#f8f9fa',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: '#fff3e0',
                          transform: 'translateX(8px)',
                          paddingLeft: '2.5rem'
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <span style={{ fontSize: '1.2rem' }}>{category.icon}</span>
                      </ListItemIcon>
                      <ListItemText 
                        primary={category.name}
                        primaryTypographyProps={{
                          fontSize: '14px',
                          fontWeight: 500,
                          color: '#333'
                        }}
                      />
                      {expandedDealCategories[category.id] ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>

                    {/* Deal Subcategories */}
                    <Collapse in={expandedDealCategories[category.id]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {category.subcategories?.map((subcategory) => (
                          <ListItemButton
                            key={subcategory.id}
                            onClick={() => handleDealCategoryClick(subcategory.slug)}
                            sx={{
                              py: 0.8,
                              px: 6,
                              fontSize: '13px',
                              transition: 'all 0.2s ease-in-out',
                              backgroundColor: '#ffffff',
                              borderLeft: '2px solid #e0e0e0',
                              '&:hover': {
                                backgroundColor: '#fff3e0',
                                transform: 'translateX(8px)',
                                paddingLeft: '3rem',
                                borderLeft: '2px solid #ff9800'
                              }
                            }}
                          >
                            <ListItemText 
                              primary={subcategory.name}
                              primaryTypographyProps={{
                                fontSize: '13px',
                                fontWeight: 400,
                                color: '#666'
                              }}
                            />
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                  </Box>
                ))
              ) : (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No deals available
                  </Typography>
                </Box>
              )}
            </List>
          </Collapse>

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
              display: 'block',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: '#f8f9fa',
                transform: 'translateX(8px)',
                paddingLeft: '2rem'
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
              display: 'block',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: '#f8f9fa',
                transform: 'translateX(8px)',
                paddingLeft: '2rem'
              }
            }}
          >
            Contact
          </Typography>
        </List>
      </Box>

      {/* Account Section */}
      {isAuthenticated ? (
        <Box sx={{ 
          p: 2, 
          borderTop: '1px solid #e9ecef',
          backgroundColor: '#f8f9fa',
          flexShrink: 0
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
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: '#f8f9fa',
                transform: 'translateX(8px)',
                paddingLeft: '2rem'
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
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: '#f8f9fa',
                transform: 'translateX(8px)',
                paddingLeft: '2rem'
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
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: '#f8f9fa',
                  transform: 'translateX(8px)',
                  paddingLeft: '2rem'
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
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: '#f8f9fa',
                transform: 'translateX(8px)',
                paddingLeft: '2rem'
              }
            }}
          >
            🚪 Logout
          </Typography>
        </Box>
      ) : (
        <Box sx={{ 
          p: 2, 
          borderTop: '1px solid #e9ecef',
          backgroundColor: '#f8f9fa',
          flexShrink: 0
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
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: '#e3f2fd',
                transform: 'translateX(8px)',
                paddingLeft: '2rem'
              }
            }}
          >
            <Login sx={{ fontSize: 20 }} />
            Login
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
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: '#e3f2fd',
                transform: 'translateX(8px)',
                paddingLeft: '2rem'
              }
            }}
          >
            <PersonAdd sx={{ fontSize: 20 }} />
            Register
          </Typography>
        </Box>
      )}

      {/* Footer */}
      <Box sx={{ 
        p: 2, 
        borderTop: '1px solid #e9ecef',
        backgroundColor: '#f8f9fa',
        flexShrink: 0
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
        <Toolbar sx={{ 
          justifyContent: 'space-between', 
          px: { xs: 1, md: 3 },
          flexWrap: { xs: 'nowrap', md: 'nowrap' },
          gap: { xs: 1, md: 0 }
        }}>
          {/* Left side: Hamburger menu and Logo */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 1, md: 2 },
            flexShrink: 0,
            order: { xs: 1, md: 1 }
          }}>
            <IconButton
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🍔 Hamburger menu clicked!');
                handleDrawerToggle();
              }}
              sx={{ 
                color: '#333',
                transition: 'all 0.2s ease-in-out',
                zIndex: 1300,
                position: 'relative',
                '&:hover': {
                  backgroundColor: '#f8f9fa',
                  transform: 'scale(1.1)'
                },
                '&:active': {
                  backgroundColor: '#e3f2fd',
                  transform: 'scale(0.95)'
                }
              }}
            >
              <MenuIcon sx={{ fontSize: 24 }} />
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
          
          {/* Center: Search bar - Larger like Slickdeals */}
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            flex: { xs: 1, md: 2 }, // More flex on desktop
            maxWidth: { xs: '100%', md: '700px' }, // Wider max width
            mx: { xs: 1, md: 3 }, // More margin for prominence
            order: { xs: 2, md: 2 }
          }}>
            <SearchBarSimple
              value={searchTerm}
              onChange={setSearchTerm}
              onSearch={handleSearch}
              placeholder="Search products, deals..."
              products={products}
            />
          </Box>
          
          {/* Right side: Cart and User */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            flexShrink: 0,
            order: { xs: 3, md: 3 }
          }}>
            {/* Cart Icon */}
            <IconButton
              component={RouterLink}
              to="/cart"
              sx={{
                color: '#333',
                ml: 1,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: '#f8f9fa',
                  transform: 'scale(1.1)'
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
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: '#f8f9fa',
                    transform: 'scale(1.1)'
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
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: '#f8f9fa',
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <AccountCircle />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer with Slide Animation */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => {
          console.log('🍔 Drawer onClose triggered');
          handleDrawerToggle();
        }}
        ModalProps={{
          keepMounted: true
        }}
        sx={{
          display: { xs: 'block', sm: 'block' }, // Always show on all screen sizes for testing
          '& .MuiDrawer-paper': {
            width: 280,
            backgroundColor: 'white',
            zIndex: 1200,
            color: '#333',
            transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
            border: 'none',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              opacity: mobileOpen ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
              pointerEvents: 'none',
              zIndex: -1
            }
          },
          '& .MuiBackdrop-root': {
            backgroundColor: 'transparent'
          }
        }}
      >
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%',
          backgroundColor: '#ffffff'
        }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1976d2' }}>
            🍔 Debug Menu (Working!)
          </Typography>
          {drawer}
        </Box>
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
          Login
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
          Register
        </MenuItem>
      </Menu>
    </>
  );
};

export default Header;
