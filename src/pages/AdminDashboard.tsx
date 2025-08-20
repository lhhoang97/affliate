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
  Divider
} from '@mui/material';
import {
  Inventory,
  Category,
  People,
  ShoppingCart,
  Star,
  Add
} from '@mui/icons-material';
import { fetchProducts, fetchCategories } from '../services/productService';
import { Product, Category as CategoryType } from '../types';

const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [prods, cats] = await Promise.all([fetchProducts(), fetchCategories()]);
        if (!mounted) return;
        setProducts(prods);
        setCategories(cats);
      } catch (e) {
        // Handle error
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const stats = {
    totalProducts: products.length,
    totalCategories: categories.length,
    totalUsers: 1250, // Mock data
    totalOrders: 89, // Mock data
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
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
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
              </Box>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <Inventory />
              </Avatar>
            </Box>
          </CardContent>
        </Card>

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
              </Box>
              <Avatar sx={{ bgcolor: 'secondary.main' }}>
                <Category />
              </Avatar>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  Users
                </Typography>
                <Typography variant="h4" component="div">
                  {stats.totalUsers}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'success.main' }}>
                <People />
              </Avatar>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  Orders
                </Typography>
                <Typography variant="h4" component="div">
                  {stats.totalOrders}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'warning.main' }}>
                <ShoppingCart />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Box>

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
      </Box>
    </Box>
  );
};

export default AdminDashboard;
