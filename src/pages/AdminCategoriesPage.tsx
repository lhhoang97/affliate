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
  DialogActions
} from '@mui/material';
import { Add, LabelOutlined } from '@mui/icons-material';
import { Category } from '../types';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../services/productService';

const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: '', description: '', image: '' });
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
    setForm({ name: '', description: '', image: '' });
    setDialogOpen(true);
  };

  const openEdit = (c: Category) => {
    setEditing(c);
    setForm({ name: c.name, description: c.description || '', image: c.image || '' });
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

  const filtered = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">Quản lý danh mục</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={openCreate}>Thêm danh mục</Button>
      </Box>
      <TextField label="Tìm kiếm" value={search} onChange={(e) => setSearch(e.target.value)} sx={{ mb: 2 }} />

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
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
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              {c.image ? (
                <Box sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: 1, 
                  overflow: 'hidden', 
                  flexShrink: 0,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}>
                  <img src={c.image} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
              ) : (
                <Box sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: 1, 
                  backgroundColor: '#6c757d',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  flexShrink: 0 
                }}>
                  <LabelOutlined sx={{ color: 'white', fontSize: 20 }} />
                </Box>
              )}
              <Typography variant="subtitle1" sx={{ fontWeight: 500, flex: 1 }}>
                {c.name}
              </Typography>
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

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Sửa danh mục' : 'Thêm danh mục'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Tên danh mục"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Mô tả"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="Ảnh (URL)"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleSave}>Lưu</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminCategoriesPage;


