import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  Grid,
  Divider
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Link as LinkIcon,
  Store as StoreIcon,
  TrendingUp
} from '@mui/icons-material';
import { useBusinessMode } from '../contexts/BusinessModeContext';

interface AffiliateProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number;
  image_url: string;
  retailer: string;
  asin: string;
  sku: string;
  affiliate_link: string;
  external_url: string;
  commission_rate: number;
  category: string;
  brand: string;
  rating: number;
  review_count: number;
  in_stock: boolean;
  availability_status: string;
  created_at: string;
  updated_at: string;
}

interface AffiliateRetailer {
  id: string;
  name: string;
  display_name: string;
  base_url: string;
  affiliate_tag: string;
  commission_rate: number;
  cookie_duration: number;
  is_active: boolean;
  icon_url: string;
  color_code: string;
}

const AdminAffiliateProductsPage: React.FC = () => {
  const { isAffiliateMode } = useBusinessMode();
  const [products, setProducts] = useState<AffiliateProduct[]>([]);
  const [retailers, setRetailers] = useState<AffiliateRetailer[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AffiliateProduct | null>(null);
  const [formData, setFormData] = useState<Partial<AffiliateProduct>>({
    name: '',
    description: '',
    price: 0,
    original_price: 0,
    image_url: '',
    retailer: 'amazon',
    asin: '',
    sku: '',
    affiliate_link: '',
    external_url: '',
    commission_rate: 0,
    category: '',
    brand: '',
    rating: 0,
    review_count: 0,
    in_stock: true,
    availability_status: 'available'
  });

  // Load retailers
  useEffect(() => {
    loadRetailers();
  }, []);

  // Load products
  useEffect(() => {
    loadProducts();
  }, []);

  const loadRetailers = async () => {
    try {
      // Mock data for now - will be replaced with actual API call
      const mockRetailers: AffiliateRetailer[] = [
        {
          id: '1',
          name: 'amazon',
          display_name: 'Amazon',
          base_url: 'https://amazon.com',
          affiliate_tag: 'yourstore-20',
          commission_rate: 4.00,
          cookie_duration: 24,
          is_active: true,
          icon_url: '',
          color_code: '#FF9900'
        },
        {
          id: '2',
          name: 'ebay',
          display_name: 'eBay',
          base_url: 'https://ebay.com',
          affiliate_tag: 'yourstore-20',
          commission_rate: 3.00,
          cookie_duration: 168,
          is_active: true,
          icon_url: '',
          color_code: '#E53238'
        }
      ];
      setRetailers(mockRetailers);
    } catch (error) {
      console.error('Error loading retailers:', error);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      // Mock data for now - will be replaced with actual API call
      const mockProducts: AffiliateProduct[] = [
        {
          id: '1',
          name: 'iPhone 15 Pro',
          description: 'Latest iPhone with advanced features',
          price: 999,
          original_price: 1099,
          image_url: 'https://picsum.photos/400/400?random=1',
          retailer: 'amazon',
          asin: 'B0CHX1W1XY',
          sku: 'IPHONE15PRO-256',
          affiliate_link: 'https://amazon.com/dp/B0CHX1W1XY?tag=yourstore-20',
          external_url: 'https://amazon.com/dp/B0CHX1W1XY',
          commission_rate: 4.00,
          category: 'Electronics',
          brand: 'Apple',
          rating: 4.8,
          review_count: 1250,
          in_stock: true,
          availability_status: 'available',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'Samsung Galaxy S24',
          description: 'Premium Android smartphone',
          price: 899,
          original_price: 999,
          image_url: 'https://picsum.photos/400/400?random=2',
          retailer: 'ebay',
          asin: '',
          sku: 'SAMSUNG-S24-256',
          affiliate_link: 'https://ebay.com/itm/123456789?var=yourstore-20',
          external_url: 'https://ebay.com/itm/123456789',
          commission_rate: 3.00,
          category: 'Electronics',
          brand: 'Samsung',
          rating: 4.6,
          review_count: 890,
          in_stock: true,
          availability_status: 'available',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ];
      setProducts(mockProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      original_price: 0,
      image_url: '',
      retailer: 'amazon',
      asin: '',
      sku: '',
      affiliate_link: '',
      external_url: '',
      commission_rate: 0,
      category: '',
      brand: '',
      rating: 0,
      review_count: 0,
      in_stock: true,
      availability_status: 'available'
    });
    setOpenDialog(true);
  };

  const handleEditProduct = (product: AffiliateProduct) => {
    setEditingProduct(product);
    setFormData(product);
    setOpenDialog(true);
  };

  const handleSaveProduct = async () => {
    try {
      // Mock save - will be replaced with actual API call
      console.log('Saving product:', formData);
      
      if (editingProduct) {
        // Update existing product
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...formData } : p));
      } else {
        // Add new product
        const { id, ...formDataWithoutId } = formData as AffiliateProduct;
        const newProduct: AffiliateProduct = {
          id: Date.now().toString(),
          ...formDataWithoutId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setProducts(prev => [...prev, newProduct]);
      }
      
      setOpenDialog(false);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // Mock delete - will be replaced with actual API call
        setProducts(prev => prev.filter(p => p.id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const generateAffiliateLink = (retailer: string, asin: string, sku: string) => {
    const retailerConfig = retailers.find(r => r.name === retailer);
    if (!retailerConfig) return '';

    if (retailer === 'amazon' && asin) {
      return `${retailerConfig.base_url}/dp/${asin}?tag=${retailerConfig.affiliate_tag}&linkCode=ur2&camp=2025&creative=9325`;
    } else if (retailer === 'ebay' && sku) {
      return `${retailerConfig.base_url}/itm/${sku}?var=${retailerConfig.affiliate_tag}`;
    }
    
    return retailerConfig.base_url;
  };

  const getRetailerColor = (retailer: string) => {
    const retailerConfig = retailers.find(r => r.name === retailer);
    return retailerConfig?.color_code || '#666666';
  };

  const getRetailerDisplayName = (retailer: string) => {
    const retailerConfig = retailers.find(r => r.name === retailer);
    return retailerConfig?.display_name || retailer;
  };

  if (!isAffiliateMode) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">
          This page is only available in Affiliate mode. Please switch to Affiliate mode to manage affiliate products.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Affiliate Products Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddProduct}
          sx={{ backgroundColor: '#4caf50' }}
        >
          Add Product
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <StoreIcon sx={{ fontSize: 40, color: '#4caf50', mr: 2 }} />
                <Box>
                  <Typography variant="h6">{products.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Products
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp sx={{ fontSize: 40, color: '#2196f3', mr: 2 }} />
                <Box>
                  <Typography variant="h6">
                    {products.reduce((sum, p) => sum + p.commission_rate, 0).toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Commission
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LinkIcon sx={{ fontSize: 40, color: '#ff9800', mr: 2 }} />
                <Box>
                  <Typography variant="h6">
                    {products.filter(p => p.in_stock).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    In Stock
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Visibility sx={{ fontSize: 40, color: '#9c27b0', mr: 2 }} />
                <Box>
                  <Typography variant="h6">
                    {retailers.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Retailers
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Products Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Affiliate Products
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Retailer</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Commission</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <img
                          src={product.image_url}
                          alt={product.name}
                          style={{ width: 50, height: 50, objectFit: 'cover', marginRight: 12, borderRadius: 4 }}
                        />
                        <Box>
                          <Typography variant="subtitle2">{product.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {product.brand} • {product.category}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getRetailerDisplayName(product.retailer)}
                        size="small"
                        sx={{ backgroundColor: getRetailerColor(product.retailer), color: 'white' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        ${product.price}
                        {product.original_price > product.price && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            <s>${product.original_price}</s>
                          </Typography>
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {product.commission_rate}%
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={product.in_stock ? 'In Stock' : 'Out of Stock'}
                        size="small"
                        color={product.in_stock ? 'success' : 'error'}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => window.open(product.affiliate_link, '_blank')}
                        title="View Product"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEditProduct(product)}
                        title="Edit Product"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteProduct(product.id)}
                        title="Delete Product"
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add/Edit Product Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Product Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Retailer</InputLabel>
                <Select
                  value={formData.retailer}
                  onChange={(e) => setFormData({ ...formData, retailer: e.target.value })}
                >
                  {retailers.map((retailer) => (
                    <MenuItem key={retailer.id} value={retailer.name}>
                      {retailer.display_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Original Price"
                type="number"
                value={formData.original_price}
                onChange={(e) => setFormData({ ...formData, original_price: parseFloat(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ASIN (Amazon)"
                value={formData.asin}
                onChange={(e) => setFormData({ ...formData, asin: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="SKU"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Generated Affiliate Link
              </Typography>
              <TextField
                fullWidth
                label="Affiliate Link"
                value={formData.affiliate_link || generateAffiliateLink(formData.retailer || '', formData.asin || '', formData.sku || '')}
                onChange={(e) => setFormData({ ...formData, affiliate_link: e.target.value })}
                helperText="This link will be generated automatically based on retailer and product ID"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveProduct} variant="contained">
            {editingProduct ? 'Update' : 'Add'} Product
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminAffiliateProductsPage;
