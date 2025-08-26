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
  DragIndicator as DragIndicatorIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { menuService, MenuCategory, MenuSubcategory, CreateMenuCategoryData, CreateMenuSubcategoryData } from '../services/menuService';

const AdminMenuManagementPage: React.FC = () => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [subcategories, setSubcategories] = useState<MenuSubcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Dialog states
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [subcategoryDialogOpen, setSubcategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<MenuSubcategory | null>(null);

  // Form states
  const [categoryForm, setCategoryForm] = useState<CreateMenuCategoryData>({
    name: '',
    icon: '',
    display_order: 0
  });
  const [subcategoryForm, setSubcategoryForm] = useState<CreateMenuSubcategoryData>({
    category_id: 0,
    name: '',
    slug: '',
    display_order: 0
  });

  // Common icons for selection
  const commonIcons = [
    '📱', '💻', '🎮', '🏠', '👕', '👗', '👟', '👜', '💍', '⌚',
    '📺', '🎧', '📷', '🔊', '🍳', '❄️', '🧺', '🍽️', '☕', '💨',
    '🛋️', '🛏️', '🌳', '👶', '📚', '🎨', '⚽', '🚗', '🐕', '📎'
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [categoriesData, subcategoriesData] = await Promise.all([
        menuService.getAllMenuCategories(),
        menuService.getAllMenuSubcategories()
      ]);
      setCategories(categoriesData);
      setSubcategories(subcategoriesData);
    } catch (err) {
      setError('Failed to load menu data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async () => {
    try {
      if (editingCategory) {
        await menuService.updateMenuCategory(editingCategory.id, categoryForm);
        setSuccess('Category updated successfully');
      } else {
        await menuService.createMenuCategory(categoryForm);
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

  const handleSubcategorySubmit = async () => {
    try {
      if (editingSubcategory) {
        await menuService.updateMenuSubcategory(editingSubcategory.id, subcategoryForm);
        setSuccess('Subcategory updated successfully');
      } else {
        await menuService.createMenuSubcategory(subcategoryForm);
        setSuccess('Subcategory created successfully');
      }
      setSubcategoryDialogOpen(false);
      resetSubcategoryForm();
      loadData();
    } catch (err) {
      setError('Failed to save subcategory');
      console.error(err);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category? All subcategories will also be deleted.')) {
      try {
        await menuService.deleteMenuCategory(id);
        setSuccess('Category deleted successfully');
        loadData();
      } catch (err) {
        setError('Failed to delete category');
        console.error(err);
      }
    }
  };

  const handleDeleteSubcategory = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this subcategory?')) {
      try {
        await menuService.deleteMenuSubcategory(id);
        setSuccess('Subcategory deleted successfully');
        loadData();
      } catch (err) {
        setError('Failed to delete subcategory');
        console.error(err);
      }
    }
  };

  const openCategoryDialog = (category?: MenuCategory) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({
        name: category.name,
        icon: category.icon,
        display_order: category.display_order
      });
    } else {
      setEditingCategory(null);
      resetCategoryForm();
    }
    setCategoryDialogOpen(true);
  };

  const openSubcategoryDialog = (subcategory?: MenuSubcategory) => {
    if (subcategory) {
      setEditingSubcategory(subcategory);
      setSubcategoryForm({
        category_id: subcategory.category_id,
        name: subcategory.name,
        slug: subcategory.slug,
        display_order: subcategory.display_order
      });
    } else {
      setEditingSubcategory(null);
      resetSubcategoryForm();
    }
    setSubcategoryDialogOpen(true);
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      icon: '',
      display_order: 0
    });
  };

  const resetSubcategoryForm = () => {
    setSubcategoryForm({
      category_id: 0,
      name: '',
      slug: '',
      display_order: 0
    });
  };

  const getSubcategoriesForCategory = (categoryId: number) => {
    return subcategories.filter(sub => sub.category_id === categoryId);
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
        Menu Management
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Manage categories and subcategories for the hamburger menu
      </Typography>

      {/* Categories Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Categories</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => openCategoryDialog()}
          >
            Add Category
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order</TableCell>
                <TableCell>Icon</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Subcategories</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.display_order}</TableCell>
                  <TableCell>
                    <span style={{ fontSize: '1.5rem' }}>{category.icon}</span>
                  </TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={category.is_active ? 'Active' : 'Inactive'}
                      color={category.is_active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {getSubcategoriesForCategory(category.id).length} items
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
      </Paper>

      {/* Subcategories Section */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Subcategories</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => openSubcategoryDialog()}
          >
            Add Subcategory
          </Button>
        </Box>

        {categories.map((category) => (
          <Accordion key={category.id} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <span style={{ fontSize: '1.2rem' }}>{category.icon}</span>
                <Typography variant="subtitle1">{category.name}</Typography>
                <Chip
                  label={`${getSubcategoriesForCategory(category.id).length} subcategories`}
                  size="small"
                  color="primary"
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer>
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
                    {getSubcategoriesForCategory(category.id).map((subcategory) => (
                      <TableRow key={subcategory.id}>
                        <TableCell>{subcategory.display_order}</TableCell>
                        <TableCell>{subcategory.name}</TableCell>
                        <TableCell>
                          <Chip label={subcategory.slug} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={subcategory.is_active ? 'Active' : 'Inactive'}
                            color={subcategory.is_active ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => openSubcategoryDialog(subcategory)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteSubcategory(subcategory.id)}
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

      {/* Category Dialog */}
      <Dialog open={categoryDialogOpen} onClose={() => setCategoryDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCategory ? 'Edit Category' : 'Add New Category'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Category Name"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Icon</InputLabel>
                <Select
                  value={categoryForm.icon}
                  onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
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

      {/* Subcategory Dialog */}
      <Dialog open={subcategoryDialogOpen} onClose={() => setSubcategoryDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingSubcategory ? 'Edit Subcategory' : 'Add New Subcategory'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Parent Category</InputLabel>
                <Select
                  value={subcategoryForm.category_id}
                  onChange={(e) => setSubcategoryForm({ ...subcategoryForm, category_id: e.target.value as number })}
                  label="Parent Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span style={{ fontSize: '1.2rem' }}>{category.icon}</span>
                        <span>{category.name}</span>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Subcategory Name"
                value={subcategoryForm.name}
                onChange={(e) => setSubcategoryForm({ ...subcategoryForm, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Slug"
                value={subcategoryForm.slug}
                onChange={(e) => setSubcategoryForm({ ...subcategoryForm, slug: e.target.value })}
                helperText="URL-friendly version of the name (e.g., 'mens-clothing')"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Display Order"
                value={subcategoryForm.display_order}
                onChange={(e) => setSubcategoryForm({ ...subcategoryForm, display_order: parseInt(e.target.value) || 0 })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubcategoryDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubcategorySubmit} variant="contained">
            {editingSubcategory ? 'Update' : 'Create'}
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

export default AdminMenuManagementPage;
