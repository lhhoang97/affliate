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
  Grid,
  Card,
  CardContent,
  Avatar
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
import { supabase } from '../utils/supabaseClient';
import { Product } from '../types';

interface SectionProduct {
  id: string;
  product_id: string;
  section: 'just_for_you' | 'hot_deals' | 'trending_deals';
  position: number;
  is_active: boolean;
  created_at: string;
  product: Product;
}

const AdminSectionManagementPage: React.FC = () => {
  const [sectionProducts, setSectionProducts] = useState<SectionProduct[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SectionProduct | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const [formData, setFormData] = useState({
    product_id: '',
    section: 'just_for_you' as 'just_for_you' | 'hot_deals' | 'trending_deals',
    position: 1,
    is_active: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load all products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (productsError) throw productsError;
      setAllProducts(products || []);

      // Load section products
      const { data: sectionData, error: sectionError } = await supabase
        .from('section_products')
        .select(`
          *,
          product:products(*)
        `)
        .order('position');

      if (sectionError) throw sectionError;
      setSectionProducts(sectionData || []);

    } catch (error) {
      console.error('Error loading data:', error);
      setSnackbar({ open: true, message: 'Error loading data', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      product_id: '',
      section: 'just_for_you',
      position: 1,
      is_active: true
    });
    setDialogOpen(true);
  };

  const handleEditProduct = (product: SectionProduct) => {
    setEditingProduct(product);
    setFormData({
      product_id: product.product_id,
      section: product.section,
      position: product.position,
      is_active: product.is_active
    });
    setDialogOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product from the section?')) return;

    try {
      const { error } = await supabase
        .from('section_products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSnackbar({ open: true, message: 'Product removed from section successfully', severity: 'success' });
      loadData();
    } catch (error) {
      console.error('Error deleting product:', error);
      setSnackbar({ open: true, message: 'Error removing product from section', severity: 'error' });
    }
  };

  const handleSave = async () => {
    try {
      if (editingProduct) {
        // Update existing
        const { error } = await supabase
          .from('section_products')
          .update(formData)
          .eq('id', editingProduct.id);

        if (error) throw error;
        setSnackbar({ open: true, message: 'Product updated successfully', severity: 'success' });
      } else {
        // Add new
        const { error } = await supabase
          .from('section_products')
          .insert(formData);

        if (error) throw error;
        setSnackbar({ open: true, message: 'Product added to section successfully', severity: 'success' });
      }

      setDialogOpen(false);
      loadData();
    } catch (error) {
      console.error('Error saving product:', error);
      setSnackbar({ open: true, message: 'Error saving product', severity: 'error' });
    }
  };



  const filteredProducts = (section: string) => {
    return sectionProducts.filter(sp => sp.section === section);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          Section Management
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Manage products in different sections: Just For You, Hot Deals, and Trending Deals
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddProduct}
          sx={{ mb: 3 }}
        >
          Add Product to Section
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
        {/* Just For You Section */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: '#8b5cf6', mr: 2 }}>
                <StarIcon />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Just For You
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {filteredProducts('just_for_you').length} products
            </Typography>
            
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProducts('just_for_you')
                    .sort((a, b) => a.position - b.position)
                    .map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              src={item.product.image}
                              sx={{ width: 32, height: 32, mr: 1 }}
                            />
                            <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
                              {item.product.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{item.position}</TableCell>
                        <TableCell>
                          <IconButton size="small" onClick={() => handleEditProduct(item)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDeleteProduct(item.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Hot Deals Section */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: '#dc2626', mr: 2 }}>
                <OfferIcon />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Hot Deals
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {filteredProducts('hot_deals').length} products
            </Typography>
            
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProducts('hot_deals')
                    .sort((a, b) => a.position - b.position)
                    .map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              src={item.product.image}
                              sx={{ width: 32, height: 32, mr: 1 }}
                            />
                            <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
                              {item.product.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{item.position}</TableCell>
                        <TableCell>
                          <IconButton size="small" onClick={() => handleEditProduct(item)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDeleteProduct(item.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Trending Deals Section */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: '#059669', mr: 2 }}>
                <TrendingIcon />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Trending Deals
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {filteredProducts('trending_deals').length} products
            </Typography>
            
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProducts('trending_deals')
                    .sort((a, b) => a.position - b.position)
                    .map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              src={item.product.image}
                              sx={{ width: 32, height: 32, mr: 1 }}
                            />
                            <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
                              {item.product.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{item.position}</TableCell>
                        <TableCell>
                          <IconButton size="small" onClick={() => handleEditProduct(item)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDeleteProduct(item.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingProduct ? 'Edit Section Product' : 'Add Product to Section'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Product</InputLabel>
              <Select
                value={formData.product_id}
                onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                label="Product"
              >
                {allProducts.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar src={product.image} sx={{ width: 24, height: 24, mr: 1 }} />
                      {product.name}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Section</InputLabel>
              <Select
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value as any })}
                label="Section"
              >
                <MenuItem value="just_for_you">Just For You</MenuItem>
                <MenuItem value="hot_deals">Hot Deals</MenuItem>
                <MenuItem value="trending_deals">Trending Deals</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Position"
              type="number"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) })}
              sx={{ mb: 2 }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                />
              }
              label="Active"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {editingProduct ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminSectionManagementPage;
