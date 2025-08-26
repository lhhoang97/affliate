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
import { useProducts } from '../contexts/ProductContext';

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

  // Use products from context
  const { products: contextProducts, loading: contextLoading } = useProducts();

  useEffect(() => {
    // Load products from context
    setProducts(contextProducts);
    setLoading(contextLoading);
  }, [contextProducts, contextLoading]);

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
    // Handle delete logic here
    setSnackbar({ open: true, message: 'Product deleted successfully', severity: 'success' });
  };

  const handleSaveProduct = () => {
    // Handle save logic here
    setSnackbar({ open: true, message: 'Product saved successfully', severity: 'success' });
    setDialogOpen(false);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingProduct(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading products...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Admin Slider Products Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddProduct}
          sx={{ backgroundColor: '#007bff', '&:hover': { backgroundColor: '#0056b3' } }}
        >
          Add Product
        </Button>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={product.image}
                        variant="rounded"
                        sx={{ width: 50, height: 50 }}
                      />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {product.brand}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={product.category} size="small" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#007bff' }}>
                      ${product.price}
                    </Typography>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                        ${product.originalPrice}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <StarIcon sx={{ color: '#ffc107', fontSize: 16 }} />
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
                        sx={{ color: '#007bff' }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteProduct(product.id)}
                        sx={{ color: '#dc3545' }}
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
      </Card>

      {/* Add/Edit Product Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
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
            />
            <TextField
              label="Brand"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              fullWidth
            />
            <TextField
              label="Price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              fullWidth
            />
            <TextField
              label="Original Price"
              type="number"
              value={formData.originalPrice}
              onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
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
            <TextField
              label="Image URL"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              fullWidth
            />
            <TextField
              label="Rating"
              type="number"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
              fullWidth
            />
            <TextField
              label="Review Count"
              type="number"
              value={formData.reviewCount}
              onChange={(e) => setFormData({ ...formData, reviewCount: Number(e.target.value) })}
              fullWidth
            />
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={3}
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
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveProduct} variant="contained">
            Save
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
