import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Save,
  Cancel,
  DragIndicator,
  CloudUpload,
  ColorLens,
  Palette
} from '@mui/icons-material';
import { Category } from '../types';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../services/productService';

const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [subcategoryDialogOpen, setSubcategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<{categoryId: string, index: number, name: string} | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    slug: '',
    color: '#007bff'
  });
  const [subcategoryFormData, setSubcategoryFormData] = useState({
    name: '',
    newSubcategory: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  const [categoryOrder, setCategoryOrder] = useState<string[]>([]);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [localCategories, setLocalCategories] = useState<any[]>([]);

  // Predefined categories with subcategories
  const predefinedCategories = [
    {
      id: 'electronics',
      name: 'Electronics',
      color: '#007bff',
      image: 'https://picsum.photos/300/200?random=501',
      subcategories: [
        'HEADPHONES', 'LAPTOP', 'TABLET', 'PHONE', 'TV', 'REFRIGERATOR', 'AIR CONDITIONER'
      ]
    },
    {
      id: 'fashion',
      name: 'Fashion',
      color: '#e91e63',
      image: 'https://picsum.photos/300/200?random=502',
      subcategories: [
        'MEN', 'WOMEN', 'KIDS', 'SHOES', 'BAGS', 'JEWELRY', 'ACCESSORIES'
      ]
    },
    {
      id: 'home-garden',
      name: 'Home & Garden',
      color: '#4caf50',
      image: 'https://picsum.photos/300/200?random=503',
      subcategories: [
        'FURNITURE', 'KITCHEN', 'BEDDING', 'GARDEN', 'LIGHTING', 'STORAGE'
      ]
    },
    {
      id: 'sports',
      name: 'Sports & Outdoors',
      color: '#ff9800',
      image: 'https://picsum.photos/300/200?random=504',
      subcategories: [
        'FITNESS', 'TEAM SPORTS', 'OUTDOOR', 'SWIMMING', 'CYCLING', 'RUNNING'
      ]
    },
    {
      id: 'books',
      name: 'Books & Media',
      color: '#9c27b0',
      image: 'https://picsum.photos/300/200?random=505',
      subcategories: [
        'FICTION', 'NON-FICTION', 'EDUCATIONAL', 'CHILDREN', 'MAGAZINES', 'E-BOOKS'
      ]
    },
    {
      id: 'toys',
      name: 'Toys & Games',
      color: '#f44336',
      image: 'https://picsum.photos/300/200?random=506',
      subcategories: [
        'ACTION FIGURES', 'BOARD GAMES', 'EDUCATIONAL', 'LEGO', 'DOLLS', 'VIDEO GAMES'
      ]
    },
    {
      id: 'health-beauty',
      name: 'Health & Beauty',
      color: '#ff6b9d',
      image: 'https://picsum.photos/300/200?random=507',
      subcategories: [
        'SKINCARE', 'MAKEUP', 'HAIR CARE', 'PERSONAL CARE', 'VITAMINS', 'FRAGRANCES', 'SUPPLEMENTS', 'FITNESS'
      ]
    },
    {
      id: 'automotive',
      name: 'Automotive',
      color: '#795548',
      image: 'https://picsum.photos/300/200?random=508',
      subcategories: [
        'CAR PARTS', 'CAR CARE', 'MOTORCYCLE', 'TRUCK', 'TOOLS', 'ELECTRONICS'
      ]
    }
  ];

  const colorOptions = [
    '#007bff', '#e91e63', '#4caf50', '#ff9800', '#9c27b0', '#f44336', '#ff6b9d', '#795548',
    '#00bcd4', '#3f51b5', '#009688', '#ff5722', '#607d8b', '#8bc34a', '#ffc107', '#9e9e9e'
  ];

  const load = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
      
      // Load local categories from localStorage or use predefined
      const savedCategories = localStorage.getItem('localCategories');
      if (savedCategories) {
        setLocalCategories(JSON.parse(savedCategories));
      } else {
        setLocalCategories([...predefinedCategories]);
        localStorage.setItem('localCategories', JSON.stringify(predefinedCategories));
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      // Fallback to predefined categories
      setLocalCategories([...predefinedCategories]);
      localStorage.setItem('localCategories', JSON.stringify(predefinedCategories));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const savedOrder = localStorage.getItem('categoryOrder');
    if (savedOrder) {
      setCategoryOrder(JSON.parse(savedOrder));
    } else {
      const defaultOrder = predefinedCategories.map(c => c.id);
      setCategoryOrder(defaultOrder);
      localStorage.setItem('categoryOrder', JSON.stringify(defaultOrder));
    }
  }, []);

  const handleOpenDialog = (category?: any) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        image: category.image || '',
        slug: category.slug || '',
        color: category.color || '#007bff'
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '', image: '', slug: '', color: '#007bff' });
    }
    setDialogOpen(true);
  };

  const handleOpenSubcategoryDialog = (categoryId: string, index?: number, subcategoryName?: string) => {
    if (index !== undefined && subcategoryName) {
      setEditingSubcategory({ categoryId, index, name: subcategoryName });
      setSubcategoryFormData({ name: subcategoryName, newSubcategory: '' });
    } else {
      setEditingSubcategory({ categoryId, index: -1, name: '' });
      setSubcategoryFormData({ name: '', newSubcategory: '' });
    }
    setSubcategoryDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingCategory) {
        // Update existing category
        const updatedCategories = localCategories.map(cat => 
          cat.id === editingCategory.id 
            ? { ...cat, ...formData }
            : cat
        );
        setLocalCategories(updatedCategories);
        localStorage.setItem('localCategories', JSON.stringify(updatedCategories));
        
        await updateCategory(editingCategory.id, formData);
        setSnackbar({ open: true, message: 'Category updated successfully!', severity: 'success' });
      } else {
        // Create new category
        const newCategory = {
          id: formData.name.toLowerCase().replace(/\s+/g, '-'),
          ...formData,
          subcategories: []
        };
        const updatedCategories = [...localCategories, newCategory];
        setLocalCategories(updatedCategories);
        localStorage.setItem('localCategories', JSON.stringify(updatedCategories));
        
        await createCategory(formData);
        setSnackbar({ open: true, message: 'Category created successfully!', severity: 'success' });
      }
      setDialogOpen(false);
      load();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error saving category', severity: 'error' });
    }
  };

  const handleSaveSubcategory = () => {
    if (!editingSubcategory) return;

    const updatedCategories = localCategories.map(cat => {
      if (cat.id === editingSubcategory.categoryId) {
        const newSubcategories = [...cat.subcategories];
        
        if (editingSubcategory.index >= 0) {
          // Edit existing subcategory
          newSubcategories[editingSubcategory.index] = subcategoryFormData.name;
        } else {
          // Add new subcategory
          newSubcategories.push(subcategoryFormData.newSubcategory);
        }
        
        return { ...cat, subcategories: newSubcategories };
      }
      return cat;
    });

    setLocalCategories(updatedCategories);
    localStorage.setItem('localCategories', JSON.stringify(updatedCategories));
    setSubcategoryDialogOpen(false);
    setSnackbar({ open: true, message: 'Subcategory updated successfully!', severity: 'success' });
  };

  const handleDeleteSubcategory = (categoryId: string, index: number) => {
    if (window.confirm('Are you sure you want to delete this subcategory?')) {
      const updatedCategories = localCategories.map(cat => {
        if (cat.id === categoryId) {
          const newSubcategories = cat.subcategories.filter((_: any, i: number) => i !== index);
          return { ...cat, subcategories: newSubcategories };
        }
        return cat;
      });

      setLocalCategories(updatedCategories);
      localStorage.setItem('localCategories', JSON.stringify(updatedCategories));
      setSnackbar({ open: true, message: 'Subcategory deleted successfully!', severity: 'success' });
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const updatedCategories = localCategories.filter(cat => cat.id !== categoryId);
        setLocalCategories(updatedCategories);
        localStorage.setItem('localCategories', JSON.stringify(updatedCategories));
        
        await deleteCategory(categoryId);
        setSnackbar({ open: true, message: 'Category deleted successfully!', severity: 'success' });
        load();
      } catch (error) {
        setSnackbar({ open: true, message: 'Error deleting category', severity: 'error' });
      }
    }
  };

  const openOrderDialog = () => {
    setShowOrderDialog(true);
  };

  const handleDragStart = (e: React.DragEvent, categoryId: string) => {
    e.dataTransfer.setData('text/plain', categoryId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetCategoryId: string) => {
    e.preventDefault();
    const draggedCategoryId = e.dataTransfer.getData('text/plain');
    
    if (draggedCategoryId !== targetCategoryId) {
      const newOrder = [...categoryOrder];
      const draggedIndex = newOrder.indexOf(draggedCategoryId);
      const targetIndex = newOrder.indexOf(targetCategoryId);
      
      newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedCategoryId);
      
      setCategoryOrder(newOrder);
    }
  };

  const saveCategoryOrder = () => {
    localStorage.setItem('categoryOrder', JSON.stringify(categoryOrder));
    
    // Also update the categories array in localStorage to match the order
    const orderedCategories = categoryOrder
      .map(categoryId => localCategories.find(c => c.id === categoryId))
      .filter(Boolean);
    
    // Save the ordered categories to localStorage so HomePage can use them
    localStorage.setItem('homepageCategories', JSON.stringify(orderedCategories));
    
    // Dispatch custom event to notify HomePage
    window.dispatchEvent(new CustomEvent('categoryOrderChanged'));
    
    setShowOrderDialog(false);
    setSnackbar({ open: true, message: 'Category order saved successfully!', severity: 'success' });
  };

  const cancelOrderChanges = () => {
    const savedOrder = localStorage.getItem('categoryOrder');
    if (savedOrder) {
      setCategoryOrder(JSON.parse(savedOrder));
    }
    setShowOrderDialog(false);
  };

  const moveCategoryUp = (categoryId: string) => {
    const newOrder = [...categoryOrder];
    const currentIndex = newOrder.indexOf(categoryId);
    if (currentIndex > 0) {
      [newOrder[currentIndex], newOrder[currentIndex - 1]] = [newOrder[currentIndex - 1], newOrder[currentIndex]];
      setCategoryOrder(newOrder);
    }
  };

  const moveCategoryDown = (categoryId: string) => {
    const newOrder = [...categoryOrder];
    const currentIndex = newOrder.indexOf(categoryId);
    if (currentIndex < newOrder.length - 1) {
      [newOrder[currentIndex], newOrder[currentIndex + 1]] = [newOrder[currentIndex + 1], newOrder[currentIndex]];
      setCategoryOrder(newOrder);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading categories...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Category Management</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<DragIndicator />} 
            onClick={openOrderDialog}
            sx={{ borderColor: '#007bff', color: '#007bff' }}
          >
            Manage Order
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{ backgroundColor: '#007bff', '&:hover': { backgroundColor: '#0056b3' } }}
          >
            Add Category
          </Button>
        </Box>
      </Box>

      {/* Categories Grid */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, 
        gap: 3 
      }}>
        {categoryOrder
          .map(categoryId => localCategories.find(c => c.id === categoryId))
          .filter((category): category is typeof localCategories[0] => Boolean(category))
          .map((category) => (
            <Card key={category.id} sx={{ 
              border: '1px solid #e0e0e0',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transform: 'translateY(-2px)'
              }
            }}>
              {/* Category Image */}
              <Box sx={{ 
                height: 120, 
                backgroundImage: `url(${category.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
              }}>
                <Box sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  backgroundColor: category.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>
                  {category.name.charAt(0)}
                </Box>
              </Box>
              
              <CardContent>
                {/* Category Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: '#333', mb: 0.5 }}>
                      {category.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {category.subcategories.length} subcategories
                    </Typography>
                  </Box>
                  
                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Manage Subcategories">
                      <IconButton 
                        size="small" 
                        sx={{ color: '#007bff' }}
                        onClick={() => handleOpenSubcategoryDialog(category.id)}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Category">
                      <IconButton 
                        size="small" 
                        sx={{ color: '#007bff' }}
                        onClick={() => handleOpenDialog(category)}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Category">
                      <IconButton 
                        size="small" 
                        sx={{ color: '#dc3545' }}
                        onClick={() => handleDelete(category.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                {/* Subcategories Preview */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" fontWeight="medium" sx={{ mb: 1, color: '#666' }}>
                    Subcategories:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {category.subcategories.slice(0, 4).map((sub: string, index: number) => (
                      <Chip
                        key={index}
                        label={sub}
                        size="small"
                        sx={{
                          backgroundColor: `${category.color}15`,
                          color: category.color,
                          border: `1px solid ${category.color}30`,
                          fontSize: '10px',
                          height: '20px'
                        }}
                      />
                    ))}
                    {category.subcategories.length > 4 && (
                      <Chip
                        label={`+${category.subcategories.length - 4} more`}
                        size="small"
                        sx={{
                          backgroundColor: '#f0f0f0',
                          color: '#666',
                          fontSize: '10px',
                          height: '20px'
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
      </Box>

      {/* Add/Edit Category Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                <TextField
                  fullWidth
                  label="Category Name *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  margin="normal"
                  required
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Category Color</InputLabel>
                  <Select
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    label="Category Color"
                  >
                    {colorOptions.map((color) => (
                      <MenuItem key={color} value={color}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            backgroundColor: color,
                            border: '1px solid #ddd'
                          }} />
                          {color}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                margin="normal"
                multiline
                rows={3}
              />
              <TextField
                fullWidth
                label="Image URL"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                margin="normal"
                helperText="URL to category image (recommended: 300x200px)"
              />
              {formData.image && (
                <Box sx={{ 
                  height: 150, 
                  backgroundImage: `url(${formData.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: 1,
                  border: '1px solid #ddd'
                }} />
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDialogOpen(false)} variant="outlined" startIcon={<Cancel />}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            startIcon={<Save />}
            sx={{ backgroundColor: '#007bff', '&:hover': { backgroundColor: '#0056b3' } }}
          >
            {editingCategory ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Subcategory Management Dialog */}
      <Dialog 
        open={subcategoryDialogOpen} 
        onClose={() => setSubcategoryDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Manage Subcategories
          </Typography>
          {editingSubcategory && (
            <Typography variant="body2" color="text.secondary">
              Category: {localCategories.find(c => c.id === editingSubcategory?.categoryId)?.name}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {/* Add New Subcategory */}
            <Box sx={{ mb: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
              <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
                Add New Subcategory
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
                <TextField
                  fullWidth
                  label="New Subcategory Name"
                  value={subcategoryFormData.newSubcategory}
                  onChange={(e) => setSubcategoryFormData({ ...subcategoryFormData, newSubcategory: e.target.value })}
                  placeholder="Enter subcategory name"
                />
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => {
                    if (subcategoryFormData.newSubcategory.trim()) {
                      handleOpenSubcategoryDialog(editingSubcategory?.categoryId || '', -1);
                    }
                  }}
                  disabled={!subcategoryFormData.newSubcategory.trim()}
                  sx={{ backgroundColor: '#007bff', '&:hover': { backgroundColor: '#0056b3' } }}
                >
                  Add
                </Button>
              </Box>
            </Box>

            {/* Existing Subcategories */}
            {editingSubcategory && (
              <Box>
                <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
                  Existing Subcategories
                </Typography>
                <List>
                  {localCategories
                    .find(c => c.id === editingSubcategory.categoryId)
                    ?.subcategories.map((subcategory: string, index: number) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemText 
                            primary={subcategory}
                            secondary={`Position ${index + 1}`}
                          />
                          <ListItemSecondaryAction>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title="Edit Subcategory">
                                <IconButton 
                                  size="small" 
                                  sx={{ color: '#007bff' }}
                                  onClick={() => handleOpenSubcategoryDialog(editingSubcategory.categoryId, index, subcategory)}
                                >
                                  <Edit />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Subcategory">
                                <IconButton 
                                  size="small" 
                                  sx={{ color: '#dc3545' }}
                                  onClick={() => handleDeleteSubcategory(editingSubcategory.categoryId, index)}
                                >
                                  <Delete />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </ListItemSecondaryAction>
                        </ListItem>
                        {index < localCategories.find(c => c.id === editingSubcategory.categoryId)!.subcategories.length - 1 && (
                          <Divider />
                        )}
                      </React.Fragment>
                    ))}
                </List>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setSubcategoryDialogOpen(false)} variant="outlined" startIcon={<Cancel />}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Subcategory Dialog */}
      <Dialog 
        open={editingSubcategory !== null && editingSubcategory.index >= 0} 
        onClose={() => setEditingSubcategory(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Edit Subcategory
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Subcategory Name"
              value={subcategoryFormData.name}
              onChange={(e) => setSubcategoryFormData({ ...subcategoryFormData, name: e.target.value })}
              margin="normal"
              required
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setEditingSubcategory(null)} variant="outlined" startIcon={<Cancel />}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveSubcategory} 
            variant="contained" 
            startIcon={<Save />}
            sx={{ backgroundColor: '#007bff', '&:hover': { backgroundColor: '#0056b3' } }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Category Order Management Dialog */}
      <Dialog 
        open={showOrderDialog} 
        onClose={cancelOrderChanges}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">Manage Category Order</Typography>
          <Typography variant="body2" color="text.secondary">Drag and drop categories to reorder them, or use the arrow buttons</Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {categoryOrder
              .map(categoryId => localCategories.find(c => c.id === categoryId))
              .filter((category): category is typeof localCategories[0] => Boolean(category))
              .map((category, index) => (
                <Box
                  key={category.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, category.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, category.id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    mb: 2,
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    backgroundColor: '#fafafa',
                    cursor: 'grab',
                    '&:hover': {
                      backgroundColor: '#f0f0f0'
                    }
                  }}
                >
                  <DragIndicator sx={{ color: '#666', cursor: 'grab' }} />
                  <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: category.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    {category.name.charAt(0)}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight="medium">{category.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{category.subcategories.length} subcategories</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 60 }}>Position {index + 1}</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" variant="outlined" onClick={() => moveCategoryUp(category.id)} disabled={index === 0}>↑</Button>
                    <Button size="small" variant="outlined" onClick={() => moveCategoryDown(category.id)} disabled={index === categoryOrder.length - 1}>↓</Button>
                  </Box>
                </Box>
              ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={cancelOrderChanges} variant="outlined" startIcon={<Cancel />}>Cancel</Button>
          <Button onClick={saveCategoryOrder} variant="contained" startIcon={<Save />} sx={{ backgroundColor: '#007bff', '&:hover': { backgroundColor: '#0056b3' } }}>Save Order</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminCategoriesPage;


