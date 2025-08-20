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
  Router
} from '@mui/icons-material';
import { Category } from '../types';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../services/productService';

const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ 
    name: '', 
    description: '', 
    image: '',
    icon: 'AcUnit',
    letter: 'A'
  });
  const [visibleCount, setVisibleCount] = useState(8);

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
        <Button variant="contained" startIcon={<Add />} onClick={openCreate}>Add Category</Button>
      </Box>
      <TextField label="Search categories" value={search} onChange={(e) => setSearch(e.target.value)} sx={{ mb: 2 }} />

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: 2,
        mb: 2
      }}>
        {filtered.slice(0, visibleCount).map((c) => (
          <Card key={c.id} sx={{ 
            borderRadius: 2, 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }
          }} onClick={() => openEdit(c)}>
            <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              {/* Icon Display */}
              <Box sx={{ 
                width: 60, 
                height: 60, 
                borderRadius: '50%', 
                backgroundColor: '#007bff',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'white',
                fontSize: 24
              }}>
                {getIconComponent(c.icon || 'LabelOutlined')}
              </Box>
              
              {/* Category Info */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {c.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Letter: {c.letter || 'A'}
                </Typography>
                {c.description && (
                  <Typography variant="body2" color="text.secondary">
                    {c.description}
                  </Typography>
                )}
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
    </Box>
  );
};

export default AdminCategoriesPage;


