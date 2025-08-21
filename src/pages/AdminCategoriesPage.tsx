import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid
} from '@mui/material';
import { 
  Add, 
  LabelOutlined,
  AcUnit,
  Print,
  Speaker,
  Watch,
  Tablet,
  Phone,
  Headphones,
  Laptop,
  Computer,
  Tv,
  Camera,
  Gamepad,
  Keyboard,
  Mouse,
  Monitor,
  Router,
  Delete,
  DragIndicator,
  Save,
  Cancel
} from '@mui/icons-material';
import { Category } from '../types';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../services/productService';

const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [subcategoryDialogOpen, setSubcategoryDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<{categoryId: string, subcategory: string} | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [form, setForm] = useState({ 
    name: '', 
    description: '', 
    image: '',
    icon: 'AcUnit',
    letter: 'A'
  });
  const [subcategoryForm, setSubcategoryForm] = useState({
    name: ''
  });
  const [visibleCount, setVisibleCount] = useState(8);
  const [categoryOrder, setCategoryOrder] = useState<string[]>([]);
  const [showOrderDialog, setShowOrderDialog] = useState(false);

  // Predefined categories with subcategories
  const predefinedCategories = [
    {
      id: 'electronics',
      name: 'Electronics',
      color: '#007bff',
      subcategories: [
        'HEADPHONES', 'LAPTOP', 'TABLET', 'PHONE', 'TV', 'REFRIGERATOR', 'AIR CONDITIONER'
      ]
    },
    {
      id: 'fashion',
      name: 'Fashion',
      color: '#e91e63',
      subcategories: [
        'MEN', 'WOMEN', 'KIDS', 'SHOES', 'BAGS', 'JEWELRY', 'ACCESSORIES'
      ]
    },
    {
      id: 'home-garden',
      name: 'Home & Garden',
      color: '#4caf50',
      subcategories: [
        'FURNITURE', 'KITCHEN', 'BEDDING', 'GARDEN', 'LIGHTING', 'STORAGE'
      ]
    },
    {
      id: 'sports',
      name: 'Sports & Outdoors',
      color: '#ff9800',
      subcategories: [
        'FITNESS', 'TEAM SPORTS', 'OUTDOOR', 'SWIMMING', 'CYCLING', 'RUNNING'
      ]
    },
    {
      id: 'books',
      name: 'Books & Media',
      color: '#9c27b0',
      subcategories: [
        'FICTION', 'NON-FICTION', 'EDUCATIONAL', 'CHILDREN', 'MAGAZINES', 'E-BOOKS'
      ]
    },
    {
      id: 'toys',
      name: 'Toys & Games',
      color: '#f44336',
      subcategories: [
        'ACTION FIGURES', 'BOARD GAMES', 'EDUCATIONAL', 'LEGO', 'DOLLS', 'VIDEO GAMES'
      ]
    },
    {
      id: 'health',
      name: 'Health & Beauty',
      color: '#00bcd4',
      subcategories: [
        'SKINCARE', 'MAKEUP', 'HAIR CARE', 'PERSONAL CARE', 'VITAMINS', 'FRAGRANCES'
      ]
    },
    {
      id: 'automotive',
      name: 'Automotive',
      color: '#795548',
      subcategories: [
        'CAR PARTS', 'CAR CARE', 'MOTORCYCLE', 'TRUCK', 'TOOLS', 'ELECTRONICS'
      ]
    }
  ];

  const load = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
    // Load category order from localStorage
    const savedOrder = localStorage.getItem('categoryOrder');
    if (savedOrder) {
      setCategoryOrder(JSON.parse(savedOrder));
    } else {
      // Default order based on predefined categories
      const defaultOrder = predefinedCategories.map(c => c.id);
      setCategoryOrder(defaultOrder);
      localStorage.setItem('categoryOrder', JSON.stringify(defaultOrder));
    }
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '', image: '', icon: 'AcUnit', letter: 'A' });
    setDialogOpen(true);
  };

  const openEdit = (c: Category) => {
    setEditing(c);
    setForm({ 
      name: c.name, 
      description: c.description || '', 
      image: c.image || '',
      icon: 'AcUnit',
      letter: 'A'
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await updateCategory(editing.id, { ...form });
      } else {
        await createCategory({ name: form.name, description: form.description, image: form.image, slug: undefined as any });
      }
      setDialogOpen(false);
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      load();
    } catch (err) {
      console.error(err);
    }
  };

  // Subcategory management functions
  const openSubcategoryCreate = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setEditingSubcategory(null);
    setSubcategoryForm({ name: '' });
    setSubcategoryDialogOpen(true);
  };

  const openSubcategoryEdit = (categoryId: string, subcategory: string) => {
    setSelectedCategory(categoryId);
    setEditingSubcategory({ categoryId, subcategory });
    setSubcategoryForm({ name: subcategory });
    setSubcategoryDialogOpen(true);
  };

  const handleSubcategorySave = () => {
    const category = predefinedCategories.find(c => c.id === selectedCategory);
    if (category) {
      if (editingSubcategory) {
        // Update subcategory
        const index = category.subcategories.indexOf(editingSubcategory.subcategory);
        if (index > -1) {
          category.subcategories[index] = subcategoryForm.name;
        }
      } else {
        // Add new subcategory
        category.subcategories.push(subcategoryForm.name);
      }
      setSubcategoryDialogOpen(false);
      // Force re-render
      setCategories([...categories]);
    }
  };

  const handleSubcategoryDelete = (categoryId: string, subcategory: string) => {
    if (window.confirm(`Are you sure you want to delete subcategory "${subcategory}"?`)) {
      const category = predefinedCategories.find(c => c.id === categoryId);
      if (category) {
        const index = category.subcategories.indexOf(subcategory);
        if (index > -1) {
          category.subcategories.splice(index, 1);
          // Force re-render
          setCategories([...categories]);
        }
      }
    }
  };

  // Category ordering functions
  const openOrderDialog = () => {
    setShowOrderDialog(true);
  };

  const handleDragStart = (e: React.DragEvent, categoryId: string) => {
    e.dataTransfer.setData('categoryId', categoryId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetCategoryId: string) => {
    e.preventDefault();
    const draggedCategoryId = e.dataTransfer.getData('categoryId');
    
    if (draggedCategoryId === targetCategoryId) return;

    const newOrder = [...categoryOrder];
    const draggedIndex = newOrder.indexOf(draggedCategoryId);
    const targetIndex = newOrder.indexOf(targetCategoryId);

    // Remove dragged item from its current position
    newOrder.splice(draggedIndex, 1);
    // Insert dragged item at target position
    newOrder.splice(targetIndex, 0, draggedCategoryId);

    setCategoryOrder(newOrder);
  };

  const saveCategoryOrder = () => {
    localStorage.setItem('categoryOrder', JSON.stringify(categoryOrder));
    setShowOrderDialog(false);
  };

  const cancelOrderChanges = () => {
    // Reset to saved order
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

  const iconOptions = [
    { value: 'AcUnit', label: 'Air Conditioner', icon: <AcUnit /> },
    { value: 'Print', label: 'Printer', icon: <Print /> },
    { value: 'Speaker', label: 'Speaker', icon: <Speaker /> },
    { value: 'Watch', label: 'Watch', icon: <Watch /> },
    { value: 'Tablet', label: 'Tablet', icon: <Tablet /> },
    { value: 'Phone', label: 'Phone', icon: <Phone /> },
    { value: 'Headphones', label: 'Headphones', icon: <Headphones /> },
    { value: 'Laptop', label: 'Laptop', icon: <Laptop /> },
    { value: 'Computer', label: 'Computer', icon: <Computer /> },
    { value: 'Tv', label: 'TV', icon: <Tv /> },
    { value: 'Camera', label: 'Camera', icon: <Camera /> },
    { value: 'Gamepad', label: 'Gaming', icon: <Gamepad /> },
    { value: 'Keyboard', label: 'Keyboard', icon: <Keyboard /> },
    { value: 'Mouse', label: 'Mouse', icon: <Mouse /> },
    { value: 'Monitor', label: 'Monitor', icon: <Monitor /> },
    { value: 'Router', label: 'Router', icon: <Router /> },
  ];

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      AcUnit: <AcUnit />,
      Print: <Print />,
      Speaker: <Speaker />,
      Watch: <Watch />,
      Tablet: <Tablet />,
      Phone: <Phone />,
      Headphones: <Headphones />,
      Laptop: <Laptop />,
      Computer: <Computer />,
      Tv: <Tv />,
      Camera: <Camera />,
      Gamepad: <Gamepad />,
      Keyboard: <Keyboard />,
      Mouse: <Mouse />,
      Monitor: <Monitor />,
      Router: <Router />,
    };
    return iconMap[iconName] || <LabelOutlined />;
  };

  const filtered = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">Category Management</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<DragIndicator />} 
            onClick={openOrderDialog}
            sx={{ borderColor: '#007bff', color: '#007bff' }}
          >
            Manage Order
          </Button>
          <Button variant="contained" startIcon={<Add />} onClick={openCreate}>Add Category</Button>
        </Box>
      </Box>
      <TextField label="Search categories" value={search} onChange={(e) => setSearch(e.target.value)} sx={{ mb: 2 }} />

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 3,
        mb: 2
      }}>
        {categoryOrder
          .map(categoryId => predefinedCategories.find(c => c.id === categoryId))
          .filter((category): category is typeof predefinedCategories[0] => Boolean(category))
          .map((category) => (
          <Card key={category.id} sx={{ 
            borderRadius: 2, 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }
          }}>
            <Box sx={{ p: 3 }}>
              {/* Category Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{ 
                  width: 50, 
                  height: 50, 
                  borderRadius: '50%', 
                  backgroundColor: category.color,
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 20,
                  fontWeight: 'bold'
                }}>
                  {category.name.charAt(0)}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: category.color }}>
                    {category.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.subcategories.length} subcategories
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => openSubcategoryCreate(category.id)}
                  sx={{ borderColor: category.color, color: category.color }}
                >
                  Add Sub
                </Button>
              </Box>
              
              {/* Subcategories List */}
              <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                {category.subcategories.map((subcategory, index) => (
                  <Box key={index} sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    p: 1,
                    mb: 1,
                    borderRadius: 1,
                    backgroundColor: `${category.color}10`,
                    '&:hover': {
                      backgroundColor: `${category.color}20`
                    }
                  }}>
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {subcategory}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Button
                        size="small"
                        variant="text"
                        onClick={() => openSubcategoryEdit(category.id, subcategory)}
                        sx={{ minWidth: 'auto', p: 0.5 }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="text"
                        color="error"
                        onClick={() => handleSubcategoryDelete(category.id, subcategory)}
                        sx={{ minWidth: 'auto', p: 0.5 }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Card>
        ))}
      </Box>
      
      {filtered.length > visibleCount && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant="text" 
            onClick={() => setVisibleCount(v => v + 8)}
            sx={{ 
              color: '#6c757d',
              backgroundColor: '#f8f9fa',
              borderRadius: 2,
              px: 3,
              py: 1,
              '&:hover': {
                backgroundColor: '#e9ecef'
              }
            }}
          >
            Show more
          </Button>
        </Box>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Edit Category' : 'Add Category'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <TextField
              label="Category Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="Image URL"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              fullWidth
            />
            
            {/* Icon Selection */}
            <FormControl fullWidth>
              <InputLabel>Icon</InputLabel>
              <Select
                value={form.icon}
                label="Icon"
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
              >
                {iconOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ color: '#007bff' }}>
                        {option.icon}
                      </Box>
                      <Typography>{option.label}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Letter Input */}
            <TextField
              label="Letter (for display)"
              value={form.letter}
              onChange={(e) => setForm({ ...form, letter: e.target.value })}
              fullWidth
              inputProps={{ maxLength: 1 }}
              helperText="Single letter to display when icon is not selected"
            />

            {/* Icon Preview */}
            <Box sx={{ textAlign: 'center', p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>Icon Preview</Typography>
              <Box sx={{ 
                width: 60, 
                height: 60, 
                borderRadius: '50%', 
                backgroundColor: '#007bff',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'white',
                fontSize: 24,
                mx: 'auto'
              }}>
                {getIconComponent(form.icon)}
              </Box>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Letter: {form.letter}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Subcategory Dialog */}
      <Dialog open={subcategoryDialogOpen} onClose={() => setSubcategoryDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingSubcategory ? 'Edit Subcategory' : 'Add Subcategory'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Category: {predefinedCategories.find(c => c.id === selectedCategory)?.name}
            </Typography>
            <TextField
              label="Subcategory Name"
              value={subcategoryForm.name}
              onChange={(e) => setSubcategoryForm({ ...subcategoryForm, name: e.target.value })}
              fullWidth
              autoFocus
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubcategoryDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubcategorySave}>
            {editingSubcategory ? 'Update' : 'Add'}
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
          <Typography variant="h6" fontWeight="bold">
            Manage Category Order
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Drag and drop categories to reorder them, or use the arrow buttons
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {categoryOrder
              .map(categoryId => predefinedCategories.find(c => c.id === categoryId))
              .filter((category): category is typeof predefinedCategories[0] => Boolean(category))
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
                    borderRadius: 2,
                    backgroundColor: '#f8f9fa',
                    cursor: 'grab',
                    '&:hover': {
                      backgroundColor: '#e9ecef',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    },
                    '&:active': {
                      cursor: 'grabbing'
                    }
                  }}
                >
                  {/* Drag Handle */}
                  <DragIndicator sx={{ color: '#666', cursor: 'grab' }} />
                  
                  {/* Category Info */}
                  <Box sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: '50%', 
                    backgroundColor: category.color,
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: 16,
                    fontWeight: 'bold'
                  }}>
                    {category.name.charAt(0)}
                  </Box>
                  
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {category.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {category.subcategories.length} subcategories
                    </Typography>
                  </Box>
                  
                  {/* Position Info */}
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 60 }}>
                    Position {index + 1}
                  </Typography>
                  
                  {/* Move Buttons */}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => moveCategoryUp(category.id)}
                      disabled={index === 0}
                      sx={{ minWidth: 'auto', px: 1 }}
                    >
                      ↑
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => moveCategoryDown(category.id)}
                      disabled={index === categoryOrder.length - 1}
                      sx={{ minWidth: 'auto', px: 1 }}
                    >
                      ↓
                    </Button>
                  </Box>
                </Box>
              ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={cancelOrderChanges}
            variant="outlined"
            startIcon={<Cancel />}
          >
            Cancel
          </Button>
          <Button 
            onClick={saveCategoryOrder}
            variant="contained"
            startIcon={<Save />}
            sx={{ backgroundColor: '#007bff', '&:hover': { backgroundColor: '#0056b3' } }}
          >
            Save Order
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminCategoriesPage;


