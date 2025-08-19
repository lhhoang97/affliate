import React, { useState, useMemo, useEffect } from 'react';
import {
  Typography,
  Box,
  Card,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  Tooltip
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Save,
  Search
} from '@mui/icons-material';
import { Product, Category } from '../types';
import { fetchProducts, fetchCategories, createProduct, updateProduct, deleteProduct as deleteProductApi } from '../services/productService';

interface ProductFormData {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  brand: string;
  inStock: boolean;
  features: string[];
  specifications: Record<string, string>;
  images: string[];
  tags: string[];
  externalUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductFormData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as any });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [items, cats] = await Promise.all([fetchProducts(), fetchCategories()]);
        if (!mounted) return;
        setProducts(items);
        setCategories(cats);
      } catch (e) {
        // noop
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Form data
  const [formData, setFormData] = useState<ProductFormData>({
    id: '',
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    image: '',
    rating: 0,
    reviewCount: 0,
    category: '',
    brand: '',
    inStock: true,
    features: [],
    specifications: {},
    images: [],
    tags: [],
    externalUrl: ''
  });

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    return filtered;
  }, [products, searchTerm, selectedCategory]);

  const handleOpenDialog = (product?: any) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice || 0,
        image: product.image,
        rating: product.rating,
        reviewCount: product.reviewCount,
        category: product.category,
        brand: product.brand,
        inStock: product.inStock,
        features: [...product.features],
        specifications: { ...product.specifications },
        images: [...product.images],
        tags: [...product.tags],
        externalUrl: (product as any).externalUrl || '',
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        id: `product-${Date.now()}`,
        name: '',
        description: '',
        price: 0,
        originalPrice: 0,
        image: '',
        rating: 0,
        reviewCount: 0,
        category: '',
        brand: '',
        inStock: true,
        features: [],
        specifications: {},
        images: [],
        tags: [],
        externalUrl: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.description || !formData.category || !formData.brand) {
      setSnackbar({ open: true, message: 'Vui lòng điền đầy đủ thông tin bắt buộc', severity: 'error' });
      return;
    }

    try {
      if (editingProduct) {
        const updated = await updateProduct(editingProduct.id, {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          originalPrice: formData.originalPrice,
          image: formData.image,
          rating: formData.rating,
          reviewCount: formData.reviewCount,
          category: formData.category,
          brand: formData.brand,
          inStock: formData.inStock,
          features: formData.features,
          specifications: formData.specifications,
          images: formData.images,
          tags: formData.tags,
          externalUrl: formData.externalUrl,
        });
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? updated : p));
        setSnackbar({ open: true, message: 'Cập nhật sản phẩm thành công!', severity: 'success' });
      } else {
        const created = await createProduct({
          name: formData.name,
          description: formData.description,
          price: formData.price,
          originalPrice: formData.originalPrice,
          image: formData.image,
          rating: formData.rating,
          reviewCount: formData.reviewCount,
          category: formData.category,
          brand: formData.brand,
          inStock: formData.inStock,
          features: formData.features,
          specifications: formData.specifications,
          images: formData.images,
          tags: formData.tags,
          externalUrl: formData.externalUrl,
        });
        setProducts(prev => [...prev, created]);
        setSnackbar({ open: true, message: 'Thêm sản phẩm mới thành công!', severity: 'success' });
      }
      handleCloseDialog();
    } catch (e) {
      setSnackbar({ open: true, message: 'Có lỗi khi lưu sản phẩm', severity: 'error' });
    }
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await deleteProductApi(productId);
        setProducts(prev => prev.filter(p => p.id !== productId));
        setSnackbar({ open: true, message: 'Xóa sản phẩm thành công!', severity: 'success' });
      } catch (e) {
        setSnackbar({ open: true, message: 'Có lỗi khi xóa sản phẩm', severity: 'error' });
      }
    }
  };

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFeaturesChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      features: prev.features.filter((_, i) => i !== index) 
    }));
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Quản lý sản phẩm
      </Typography>

      {/* Search and Filter */}
      <Card sx={{ mb: 4, p: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1.5fr 1fr 1fr' }, gap: 2, alignItems: 'center' }}>
          <TextField
            fullWidth
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search />
            }}
          />
          <FormControl fullWidth>
            <InputLabel>Danh mục</InputLabel>
            <Select
              value={selectedCategory}
              label="Danh mục"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.name}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="body2" color="text.secondary">
            Tổng: {filteredProducts.length} sản phẩm
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            fullWidth
            onClick={() => handleOpenDialog()}
          >
            Thêm mới
          </Button>
        </Box>
      </Card>

      {/* Products Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Hình ảnh</TableCell>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell>Thương hiệu</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Đánh giá</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {product.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {product.description.substring(0, 50)}...
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={product.category} size="small" />
                </TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    ${product.price.toLocaleString()}
                  </Typography>
                  {product.originalPrice && (
                    <Typography variant="caption" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                      ${product.originalPrice.toLocaleString()}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    ⭐ {product.rating} ({product.reviewCount})
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={product.inStock ? 'Có sẵn' : 'Hết hàng'} 
                    color={product.inStock ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Xem chi tiết">
                      <IconButton size="small">
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                      <IconButton size="small" onClick={() => handleOpenDialog(product)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Product Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Tên sản phẩm *"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Thương hiệu *"
              value={formData.brand}
              onChange={(e) => handleInputChange('brand', e.target.value)}
              margin="normal"
            />
          </Box>
          
          <TextField
            fullWidth
            label="Mô tả *"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            multiline
            rows={3}
            margin="normal"
          />
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Giá *"
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', Number(e.target.value))}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Giá gốc"
              type="number"
              value={formData.originalPrice}
              onChange={(e) => handleInputChange('originalPrice', Number(e.target.value))}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Danh mục *</InputLabel>
              <Select
                value={formData.category}
                label="Danh mục *"
                onChange={(e) => handleInputChange('category', e.target.value)}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.name}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' }, gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="URL hình ảnh chính *"
              value={formData.image}
              onChange={(e) => handleInputChange('image', e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Affiliate Link (external URL)"
              value={formData.externalUrl}
              onChange={(e) => handleInputChange('externalUrl', e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Đánh giá"
              type="number"
              inputProps={{ min: 0, max: 5, step: 0.1 }}
              value={formData.rating}
              onChange={(e) => handleInputChange('rating', Number(e.target.value))}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Số review"
              type="number"
              value={formData.reviewCount}
              onChange={(e) => handleInputChange('reviewCount', Number(e.target.value))}
              margin="normal"
            />
          </Box>
          
          <FormControlLabel
            control={
              <Switch
                checked={formData.inStock}
                onChange={(e) => handleInputChange('inStock', e.target.checked)}
              />
            }
            label="Có sẵn hàng"
            sx={{ mt: 2 }}
          />
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Tính năng
            </Typography>
            {formData.features.map((feature, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  fullWidth
                  label={`Tính năng ${index + 1}`}
                  value={feature}
                  onChange={(e) => handleFeaturesChange(index, e.target.value)}
                />
                <IconButton 
                  color="error" 
                  onClick={() => removeFeature(index)}
                >
                  <Delete />
                </IconButton>
              </Box>
            ))}
            <Button startIcon={<Add />} onClick={addFeature}>
              Thêm tính năng
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSave} variant="contained" startIcon={<Save />}>
            {editingProduct ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminProductsPage;
