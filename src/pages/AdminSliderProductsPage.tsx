import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Avatar,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Star as StarIcon,
  LocalOffer as OfferIcon,
  TrendingUp as TrendingIcon
} from '@mui/icons-material';
import { Product } from '../types';

interface AdminSliderProductsPageProps {
  // Add any props if needed
}

const AdminSliderProductsPage: React.FC<AdminSliderProductsPageProps> = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    image: '',
    rating: 0,
    reviewCount: 0,
    category: '',
    brand: '',
    retailer: '',
    inStock: true
  });

  // Sample products data
  const sampleProducts: Product[] = [
    {
      id: '1',
      name: '10KG ANYCUBIC 1.75mm PLA 3D Printer Filament Bundles',
      description: 'High-quality 3D printer filament for professional printing',
      price: 65,
      originalPrice: 246,
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=200&fit=crop',
      rating: 4.5,
      reviewCount: 128,
      category: 'Electronics',
      brand: 'ANYCUBIC',
      retailer: 'AliExpress',
      inStock: true,
      features: ['High Quality', 'Multiple Colors', '1.75mm Diameter'],
      specifications: { 'Material': 'PLA', 'Diameter': '1.75mm', 'Weight': '10KG' },
      images: ['https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=200&fit=crop'],
      tags: ['3D Printing', 'Filament', 'PLA'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Wireless Bluetooth Earbuds with Noise Cancellation',
      description: 'Premium wireless earbuds with active noise cancellation',
      price: 29.99,
      originalPrice: 89.99,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=200&fit=crop',
      rating: 4.3,
      reviewCount: 89,
      category: 'Electronics',
      brand: 'TechAudio',
      retailer: 'Amazon',
      inStock: true,
      features: ['Noise Cancellation', 'Wireless', 'Long Battery Life'],
      specifications: { 'Battery Life': '8 hours', 'Connectivity': 'Bluetooth 5.0' },
      images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=200&fit=crop'],
      tags: ['Audio', 'Wireless', 'Earbuds'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '3',
      name: 'Smart Fitness Watch with Heart Rate Monitor',
      description: 'Advanced fitness tracking with heart rate monitoring',
      price: 79.99,
      originalPrice: 199.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=200&fit=crop',
      rating: 4.7,
      reviewCount: 156,
      category: 'Electronics',
      brand: 'FitTech',
      retailer: 'Best Buy',
      inStock: true,
      features: ['Heart Rate Monitor', 'GPS', 'Water Resistant'],
      specifications: { 'Battery Life': '7 days', 'Water Resistance': '5ATM' },
      images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=200&fit=crop'],
      tags: ['Fitness', 'Smartwatch', 'Health'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '4',
      name: 'Portable Bluetooth Speaker Waterproof',
      description: 'Waterproof portable speaker with amazing sound quality',
      price: 34.99,
      originalPrice: 79.99,
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=200&fit=crop',
      rating: 4.2,
      reviewCount: 67,
      category: 'Electronics',
      brand: 'SoundWave',
      retailer: 'Walmart',
      inStock: true,
      features: ['Waterproof', 'Portable', 'Long Battery'],
      specifications: { 'Battery Life': '12 hours', 'Water Resistance': 'IPX7' },
      images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=200&fit=crop'],
      tags: ['Audio', 'Portable', 'Waterproof'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '5',
      name: 'Gaming Mechanical Keyboard RGB Backlit',
      description: 'Professional gaming keyboard with RGB lighting',
      price: 89.99,
      originalPrice: 149.99,
      image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=200&fit=crop',
      rating: 4.6,
      reviewCount: 234,
      category: 'Electronics',
      brand: 'GameTech',
      retailer: 'Newegg',
      inStock: true,
      features: ['RGB Lighting', 'Mechanical Switches', 'Programmable Keys'],
      specifications: { 'Switch Type': 'Cherry MX Red', 'Backlight': 'RGB' },
      images: ['https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=200&fit=crop'],
      tags: ['Gaming', 'Keyboard', 'RGB'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    }
  ];

  useEffect(() => {
    // Load sample products
    setProducts(sampleProducts);
    setLoading(false);
  }, []);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      originalPrice: 0,
      image: '',
      rating: 0,
      reviewCount: 0,
      category: '',
      brand: '',
      retailer: '',
      inStock: true
    });
    setDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      image: product.image,
      rating: product.rating,
      reviewCount: product.reviewCount,
      category: product.category,
      brand: product.brand,
      retailer: product.retailer || '',
      inStock: product.inStock
    });
    setDialogOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
    setSnackbar({ open: true, message: 'Product deleted successfully', severity: 'success' });
  };

  const handleSaveProduct = () => {
    if (editingProduct) {
      // Update existing product
      const updatedProducts = products.map(p => 
        p.id === editingProduct.id 
          ? { ...p, ...formData, updatedAt: new Date().toISOString() }
          : p
      );
      setProducts(updatedProducts);
      setSnackbar({ open: true, message: 'Product updated successfully', severity: 'success' });
    } else {
      // Add new product
      const newProduct: Product = {
        id: Date.now().toString(),
        ...formData,
        features: [],
        specifications: {},
        images: [formData.image],
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setProducts([...products, newProduct]);
      setSnackbar({ open: true, message: 'Product added successfully', severity: 'success' });
    }
    setDialogOpen(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Slider Products Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddProduct}
          sx={{
            backgroundColor: '#059669',
            '&:hover': { backgroundColor: '#047857' }
          }}
        >
          Add Product
        </Button>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
        gap: 3, 
        mb: 4 
      }}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#3b82f6', mr: 2 }}>
                <StarIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {products.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Products
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#dc2626', mr: 2 }}>
                <OfferIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {products.filter(p => p.originalPrice && p.originalPrice > p.price).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  On Sale
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#059669', mr: 2 }}>
                <TrendingIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {products.filter(p => p.rating >= 4.5).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  High Rated
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#f59e0b', mr: 2 }}>
                <ViewIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {products.filter(p => p.inStock).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  In Stock
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Products Table */}
      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Retailer</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          src={product.image}
                          sx={{ width: 48, height: 48, mr: 2 }}
                        />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {product.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {product.brand}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#059669' }}>
                          ${product.price}
                        </Typography>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <Typography variant="caption" sx={{ textDecoration: 'line-through', color: '#dc2626' }}>
                            ${product.originalPrice}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={product.category} size="small" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {product.retailer}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <StarIcon sx={{ color: '#fbbf24', fontSize: '1rem' }} />
                        <Typography variant="body2">
                          {product.rating} ({product.reviewCount})
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={product.inStock ? 'In Stock' : 'Out of Stock'}
                        color={product.inStock ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleEditProduct(product)}
                          sx={{ color: '#3b82f6' }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteProduct(product.id)}
                          sx={{ color: '#dc2626' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
            <TextField
              label="Product Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Brand"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              fullWidth
            />
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="Image URL"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              fullWidth
            />
            <TextField
              label="Current Price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              fullWidth
              required
            />
            <TextField
              label="Original Price"
              type="number"
              value={formData.originalPrice}
              onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })}
              fullWidth
            />
            <TextField
              label="Rating"
              type="number"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
              fullWidth
              inputProps={{ min: 0, max: 5, step: 0.1 }}
            />
            <TextField
              label="Review Count"
              type="number"
              value={formData.reviewCount}
              onChange={(e) => setFormData({ ...formData, reviewCount: parseInt(e.target.value) || 0 })}
              fullWidth
            />
            <TextField
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              fullWidth
            />
            <TextField
              label="Retailer"
              value={formData.retailer}
              onChange={(e) => setFormData({ ...formData, retailer: e.target.value })}
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.inStock}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                />
              }
              label="In Stock"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveProduct} variant="contained">
            {editingProduct ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminSliderProductsPage;
