import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  Chip,
  Alert,
  Snackbar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Grid
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { couponService, CouponRetailer, CouponCategory, CreateCouponRetailerData, CreateCouponCategoryData } from '../services/couponService';

const AdminCouponManagementPage: React.FC = () => {
  const [retailers, setRetailers] = useState<CouponRetailer[]>([]);
  const [categories, setCategories] = useState<CouponCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Dialog states
  const [retailerDialogOpen, setRetailerDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingRetailer, setEditingRetailer] = useState<CouponRetailer | null>(null);
  const [editingCategory, setEditingCategory] = useState<CouponCategory | null>(null);

  // Form states
  const [retailerForm, setRetailerForm] = useState<CreateCouponRetailerData>({
    name: '',
    icon: '',
    display_order: 0
  });
  const [categoryForm, setCategoryForm] = useState<CreateCouponCategoryData>({
    retailer_id: 0,
    name: '',
    slug: '',
    display_order: 0
  });

  // Common icons for selection
  const commonIcons = [
    '🛒', '🛍️', '🏪', '🛒', '🛒', '🛒', '🛒', '🛒', '🛒', '🛒',
    '🛒', '🛒', '🛒', '🛒', '🛒', '🛒', '🛒', '🛒', '🛒', '🛒',
    '🛒', '🛒', '🛒', '🛒', '🛒', '🛒', '🛒', '🛒', '🛒', '🛒'
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [retailersData, categoriesData] = await Promise.all([
        couponService.getAllCouponRetailers(),
        couponService.getAllCouponCategories()
      ]);
      setRetailers(retailersData);
      setCategories(categoriesData);
    } catch (err) {
      setError('Failed to load coupon data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetailerSubmit = async () => {
    try {
      if (editingRetailer) {
        await couponService.updateCouponRetailer(editingRetailer.id, retailerForm);
        setSuccess('Retailer updated successfully');
      } else {
        await couponService.createCouponRetailer(retailerForm);
        setSuccess('Retailer created successfully');
      }
      setRetailerDialogOpen(false);
      resetRetailerForm();
      loadData();
    } catch (err) {
      setError('Failed to save retailer');
      console.error(err);
    }
  };

  const handleCategorySubmit = async () => {
    try {
      if (editingCategory) {
        await couponService.updateCouponCategory(editingCategory.id, categoryForm);
        setSuccess('Category updated successfully');
      } else {
        await couponService.createCouponCategory(categoryForm);
        setSuccess('Category created successfully');
      }
      setCategoryDialogOpen(false);
      resetCategoryForm();
      loadData();
    } catch (err) {
      setError('Failed to save category');
      console.error(err);
    }
  };

  const handleDeleteRetailer = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this retailer? All categories will also be deleted.')) {
      try {
        await couponService.deleteCouponRetailer(id);
        setSuccess('Retailer deleted successfully');
        loadData();
      } catch (err) {
        setError('Failed to delete retailer');
        console.error(err);
      }
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await couponService.deleteCouponCategory(id);
        setSuccess('Category deleted successfully');
        loadData();
      } catch (err) {
        setError('Failed to delete category');
        console.error(err);
      }
    }
  };

  const openRetailerDialog = (retailer?: CouponRetailer) => {
    if (retailer) {
      setEditingRetailer(retailer);
      setRetailerForm({
        name: retailer.name,
        icon: retailer.icon,
        display_order: retailer.display_order
      });
    } else {
      setEditingRetailer(null);
      resetRetailerForm();
    }
    setRetailerDialogOpen(true);
  };

  const openCategoryDialog = (category?: CouponCategory) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({
        retailer_id: category.retailer_id,
        name: category.name,
        slug: category.slug,
        display_order: category.display_order
      });
    } else {
      setEditingCategory(null);
      resetCategoryForm();
    }
    setCategoryDialogOpen(true);
  };

  const resetRetailerForm = () => {
    setRetailerForm({
      name: '',
      icon: '',
      display_order: 0
    });
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      retailer_id: 0,
      name: '',
      slug: '',
      display_order: 0
    });
  };

  const getCategoriesForRetailer = (retailerId: number) => {
    return categories.filter(cat => cat.retailer_id === retailerId);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Coupon Management
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Manage coupon retailers and categories for the hamburger menu
      </Typography>

      {/* Retailers Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Coupon Retailers</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => openRetailerDialog()}
          >
            Add Retailer
          </Button>
        </Box>

        <TableContainer
          sx={{
            overflowX: 'auto',
            '& .MuiTable-root': {
              minWidth: { xs: '600px', sm: 'auto' }
            }
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order</TableCell>
                <TableCell>Icon</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Categories</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {retailers.map((retailer) => (
                <TableRow key={retailer.id}>
                  <TableCell>{retailer.display_order}</TableCell>
                  <TableCell>
                    <span style={{ fontSize: '1.5rem' }}>{retailer.icon}</span>
                  </TableCell>
                  <TableCell>{retailer.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={retailer.is_active ? 'Active' : 'Inactive'}
                      color={retailer.is_active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {getCategoriesForRetailer(retailer.id).length} items
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => openRetailerDialog(retailer)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteRetailer(retailer.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Categories Section */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Coupon Categories</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => openCategoryDialog()}
          >
            Add Category
          </Button>
        </Box>

        {retailers.map((retailer) => (
          <Accordion key={retailer.id} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <span style={{ fontSize: '1.2rem' }}>{retailer.icon}</span>
                <Typography variant="subtitle1">{retailer.name}</Typography>
                <Chip
                  label={`${getCategoriesForRetailer(retailer.id).length} categories`}
                  size="small"
                  color="primary"
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer
                sx={{
                  overflowX: 'auto',
                  '& .MuiTable-root': {
                    minWidth: { xs: '500px', sm: 'auto' }
                  }
                }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Order</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Slug</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getCategoriesForRetailer(retailer.id).map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>{category.display_order}</TableCell>
                        <TableCell>{category.name}</TableCell>
                        <TableCell>
                          <Chip label={category.slug} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={category.is_active ? 'Active' : 'Inactive'}
                            color={category.is_active ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => openCategoryDialog(category)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteCategory(category.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>

      {/* Retailer Dialog */}
      <Dialog open={retailerDialogOpen} onClose={() => setRetailerDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingRetailer ? 'Edit Retailer' : 'Add New Retailer'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Retailer Name"
                value={retailerForm.name}
                onChange={(e) => setRetailerForm({ ...retailerForm, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Icon</InputLabel>
                <Select
                  value={retailerForm.icon}
                  onChange={(e) => setRetailerForm({ ...retailerForm, icon: e.target.value })}
                  label="Icon"
                >
                  {commonIcons.map((icon) => (
                    <MenuItem key={icon} value={icon}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span style={{ fontSize: '1.2rem' }}>{icon}</span>
                        <span>{icon}</span>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Display Order"
                value={retailerForm.display_order}
                onChange={(e) => setRetailerForm({ ...retailerForm, display_order: parseInt(e.target.value) || 0 })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRetailerDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleRetailerSubmit} variant="contained">
            {editingRetailer ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={categoryDialogOpen} onClose={() => setCategoryDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCategory ? 'Edit Category' : 'Add New Category'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Parent Retailer</InputLabel>
                <Select
                  value={categoryForm.retailer_id}
                  onChange={(e) => setCategoryForm({ ...categoryForm, retailer_id: e.target.value as number })}
                  label="Parent Retailer"
                >
                  {retailers.map((retailer) => (
                    <MenuItem key={retailer.id} value={retailer.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span style={{ fontSize: '1.2rem' }}>{retailer.icon}</span>
                        <span>{retailer.name}</span>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Category Name"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Slug"
                value={categoryForm.slug}
                onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                helperText="URL-friendly version of the name (e.g., 'amazon-electronics')"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Display Order"
                value={categoryForm.display_order}
                onChange={(e) => setCategoryForm({ ...categoryForm, display_order: parseInt(e.target.value) || 0 })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCategoryDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCategorySubmit} variant="contained">
            {editingCategory ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
      >
        <Alert onClose={() => setSuccess(null)} severity="success">
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminCouponManagementPage;
