import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Grid,
  Stack
} from '@mui/material';
import {
  Inventory,
  Category,
  People,
  ShoppingCart,
  Star,
  Add,
  TrendingUp,
  Receipt,
  Favorite,
  CheckCircle,
  Warning
} from '@mui/icons-material';
import { fetchProducts, fetchCategories } from '../services/productService';
import { getAllProfiles, getUserStats } from '../services/profileService';
import { getOrderStats } from '../services/orderService';
import { getWishlistStats } from '../services/wishlistService';
import { Product, Category as CategoryType } from '../types';
import EmailTestPanel from '../components/EmailTestPanel';
import { useBusinessMode } from '../contexts/BusinessModeContext';

const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [orderStats, setOrderStats] = useState<any>(null);
  const [wishlistStats, setWishlistStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { mode, setMode, isAffiliateMode, isEcommerceMode, isHybridMode } = useBusinessMode();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [prods, cats, userStatsData, orderStatsData, wishlistStatsData] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
          getUserStats(),
          getOrderStats(),
          getWishlistStats()
        ]);
        if (!mounted) return;
        setProducts(prods);
        setCategories(cats);
        setUserStats(userStatsData);
        setOrderStats(orderStatsData);
        setWishlistStats(wishlistStatsData);
      } catch (e) {
        console.error('Error loading admin dashboard data:', e);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const stats = {
    totalProducts: products.length,
    totalCategories: categories.length,
    totalUsers: userStats?.totalUsers || 0,
    activeUsers: userStats?.activeUsers || 0,
    adminUsers: userStats?.adminUsers || 0,
    newUsersThisMonth: userStats?.newUsersThisMonth || 0,
    totalOrders: orderStats?.totalOrders || 0,
    pendingOrders: orderStats?.pendingOrders || 0,
    completedOrders: orderStats?.completedOrders || 0,
    totalRevenue: orderStats?.totalRevenue || 0,
    averageOrderValue: orderStats?.averageOrderValue || 0,
    totalWishlistItems: wishlistStats?.totalItems || 0,
    averageRating: products.length > 0 
      ? (products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(1)
      : '0.0',
    outOfStock: products.filter(p => !p.inStock).length,
  };

  const recentProducts = products
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const topRatedProducts = products
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  if (isLoading) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Tổng quan hệ thống và thống kê
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Products & Categories */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Products
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.totalProducts}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {stats.outOfStock} out of stock
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <Inventory />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Categories
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.totalCategories}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Active categories
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <Category />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Users */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Users
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.totalUsers}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Chip 
                      icon={<CheckCircle />} 
                      label={`${stats.activeUsers} active`} 
                      color="success" 
                      size="small" 
                    />
                    <Chip 
                      icon={<Warning />} 
                      label={`${stats.adminUsers} admin`} 
                      color="warning" 
                      size="small" 
                    />
                  </Stack>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <People />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Orders */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Orders
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.totalOrders}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    ${stats.totalRevenue.toFixed(2)} revenue
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <ShoppingCart />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Additional Stats Row */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Wishlist Items
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.totalWishlistItems}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    User favorites
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'error.main' }}>
                  <Favorite />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Avg Order Value
                  </Typography>
                  <Typography variant="h4" component="div">
                    ${stats.averageOrderValue.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Per order
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <TrendingUp />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    New Users
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.newUsersThisMonth}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    This month
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <People />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Avg Rating
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.averageRating}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Product rating
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <Star />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => window.location.href = '/admin/products'}
              >
                Add Product
              </Button>
              <Button
                variant="outlined"
                startIcon={<Category />}
                onClick={() => window.location.href = '/admin/categories'}
              >
                Manage Categories
              </Button>
              <Button
                variant="outlined"
                startIcon={<People />}
                onClick={() => window.location.href = '/admin/users'}
              >
                Manage Users
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Business Mode Toggle */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Business Mode
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Chip
                label={mode.charAt(0).toUpperCase() + mode.slice(1)}
                color={
                  mode === 'affiliate' ? 'success' : 
                  mode === 'ecommerce' ? 'primary' : 
                  'warning'
                }
                size="medium"
                sx={{ fontWeight: 'bold' }}
              />
              <Typography variant="body2" color="text.secondary">
                {mode === 'affiliate' && 'Redirect to retailers'}
                {mode === 'ecommerce' && 'Direct checkout'}
                {mode === 'hybrid' && 'Customer choice'}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant={mode === 'affiliate' ? 'contained' : 'outlined'}
                color="success"
                size="small"
                onClick={() => setMode('affiliate')}
                sx={{ minWidth: 100 }}
              >
                Affiliate
              </Button>
              <Button
                variant={mode === 'ecommerce' ? 'contained' : 'outlined'}
                color="primary"
                size="small"
                onClick={() => setMode('ecommerce')}
                sx={{ minWidth: 100 }}
              >
                E-commerce
              </Button>
              <Button
                variant={mode === 'hybrid' ? 'contained' : 'outlined'}
                color="warning"
                size="small"
                onClick={() => setMode('hybrid')}
                sx={{ minWidth: 100 }}
              >
                Hybrid
              </Button>
            </Box>
            
            <Button
              variant="text"
              size="small"
              onClick={() => window.location.href = '/admin/business-mode'}
              sx={{ mt: 1 }}
            >
              Advanced Settings →
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quick Statistics
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Average Rating:</Typography>
                <Chip 
                  icon={<Star />} 
                  label={`${stats.averageRating} ⭐`} 
                  color="primary" 
                  size="small" 
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Out of Stock:</Typography>
                <Chip 
                  label={stats.outOfStock} 
                  color="error" 
                  size="small" 
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>In Stock Rate:</Typography>
                <Chip 
                  label={`${((stats.totalProducts - stats.outOfStock) / stats.totalProducts * 100).toFixed(1)}%`} 
                  color="success" 
                  size="small" 
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Recent Products */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Latest Products
            </Typography>
            <List>
              {recentProducts.map((product, index) => (
                <React.Fragment key={product.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar src={product.image} alt={product.name} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={product.name}
                      secondary={`${product.brand} • $${product.price}`}
                    />
                    <Chip 
                      label={`⭐ ${product.rating}`} 
                      size="small" 
                      color="primary" 
                    />
                  </ListItem>
                  {index < recentProducts.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            <CardActions>
              <Button size="small" onClick={() => window.location.href = '/admin/products'}>
                View All
              </Button>
            </CardActions>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Top Rated Products
            </Typography>
            <List>
              {topRatedProducts.map((product, index) => (
                <React.Fragment key={product.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar src={product.image} alt={product.name} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={product.name}
                      secondary={`${product.brand} • ${product.reviewCount} reviews`}
                    />
                    <Chip 
                      label={`⭐ ${product.rating}`} 
                      size="small" 
                      color="warning" 
                    />
                  </ListItem>
                  {index < topRatedProducts.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            <CardActions>
              <Button size="small" onClick={() => window.location.href = '/admin/products'}>
                Xem tất cả
              </Button>
            </CardActions>
          </CardContent>
        </Card>

        {/* Email Test Panel */}
        <Box sx={{ mt: 4 }}>
          <EmailTestPanel />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
