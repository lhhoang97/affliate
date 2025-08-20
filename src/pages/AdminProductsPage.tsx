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
  subcategory?: string;
  brand: string;
  inStock: boolean;
  features: string[];
  specifications: Record<string, string>;
  images: string[];
  tags: string[];
  externalUrl?: string;
  affiliateLink?: string;
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
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as any });
  
  // Predefined categories with subcategories for easy product management
  const predefinedCategories = [
    {
      id: 'electronics',
      name: 'Electronics',
      color: '#007bff',
      subcategories: [
        'Headphones', 'Laptops', 'Tablets', 'Phones', 'TVs', 
        'Refrigerators', 'Air Conditioners', 'Printers', 'Speakers', 'Watches'
      ]
    },
    {
      id: 'fashion',
      name: 'Fashion',
      color: '#e91e63',
      subcategories: [
        'Men\'s Clothing', 'Women\'s Clothing', 'Kids\' Clothing', 'Shoes',
        'Bags', 'Accessories', 'Jewelry', 'Watches', 'Sunglasses'
      ]
    },
    {
      id: 'home-garden',
      name: 'Home & Garden',
      color: '#4caf50',
      subcategories: [
        'Furniture', 'Kitchen Appliances', 'Garden Tools', 'Lighting',
        'Decor', 'Bedding', 'Bathroom', 'Storage', 'Outdoor Living'
      ]
    },
    {
      id: 'sports',
      name: 'Sports & Outdoors',
      color: '#ff9800',
      subcategories: [
        'Fitness Equipment', 'Team Sports', 'Outdoor Gear', 'Swimming',
        'Cycling', 'Running', 'Yoga', 'Hiking', 'Camping'
      ]
    },
    {
      id: 'books',
      name: 'Books & Media',
      color: '#9c27b0',
      subcategories: [
        'Fiction', 'Non-Fiction', 'Educational', 'Children\'s Books',
        'Magazines', 'E-books', 'Audiobooks', 'Music', 'Movies'
      ]
    },
    {
      id: 'toys',
      name: 'Toys & Games',
      color: '#f44336',
      subcategories: [
        'Action Figures', 'Board Games', 'Puzzles', 'Educational Toys',
        'Building Sets', 'Dolls', 'Remote Control', 'Arts & Crafts'
      ]
    },
    {
      id: 'health',
      name: 'Health & Beauty',
      color: '#00bcd4',
      subcategories: [
        'Skincare', 'Makeup', 'Hair Care', 'Personal Care',
        'Vitamins', 'Fitness Trackers', 'Medical Devices', 'Wellness'
      ]
    },
    {
      id: 'automotive',
      name: 'Automotive',
      color: '#795548',
      subcategories: [
        'Car Parts', 'Car Care', 'Motorcycle', 'Truck Accessories',
        'Tools', 'Electronics', 'Safety', 'Performance'
      ]
    }
  ];

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
    subcategory: '',
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
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ((product as any).subcategory && (product as any).subcategory.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (selectedSubcategory) {
      filtered = filtered.filter(product => (product as any).subcategory === selectedSubcategory);
    }

    return filtered;
  }, [products, searchTerm, selectedCategory, selectedSubcategory]);

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
        subcategory: (product as any).subcategory || '',
        brand: product.brand,
        inStock: product.inStock,
        features: [...product.features],
        specifications: { ...product.specifications },
        images: [...product.images],
        tags: [...product.tags],
        externalUrl: (product as any).externalUrl || '',
        affiliateLink: (product as any).affiliateLink || '',
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
        subcategory: '',
        brand: '',
        inStock: true,
        features: [],
        specifications: {},
        images: [],
        tags: [],
        externalUrl: '',
        affiliateLink: ''
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
          affiliateLink: formData.affiliateLink,
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
          affiliateLink: formData.affiliateLink,
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
        Product Management
      </Typography>

      {/* Quick Add Product Button */}
      <Card sx={{ mb: 4, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Product Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{
              backgroundColor: '#007bff',
              '&:hover': {
                backgroundColor: '#0056b3'
              }
            }}
          >
            Add New Product
          </Button>
        </Box>
      </Card>

      {/* Search and Filter */}
      <Card sx={{ mb: 4, p: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr 1fr' }, gap: 2, alignItems: 'center' }}>
          <TextField
            fullWidth
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search />
            }}
          />
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              label="Category"
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubcategory(''); // Reset subcategory filter
              }}
            >
              <MenuItem value="">All Categories</MenuItem>
              {predefinedCategories.map((category) => (
                <MenuItem key={category.id} value={category.name}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Subcategory</InputLabel>
            <Select
              value={selectedSubcategory}
              label="Subcategory"
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              disabled={!selectedCategory}
            >
              <MenuItem value="">All Subcategories</MenuItem>
              {selectedCategory && predefinedCategories
                .find(cat => cat.name === selectedCategory)
                ?.subcategories.map((subcategory) => (
                  <MenuItem key={subcategory} value={subcategory}>
                    {subcategory}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <Typography variant="body2" color="text.secondary">
            Total: {filteredProducts.length} products
          </Typography>
        </Box>
      </Card>

      {/* Products Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Subcategory</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Affiliate Link</TableCell>
              <TableCell>Actions</TableCell>
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
                <TableCell>
                  {(product as any).subcategory ? (
                    <Chip 
                      label={(product as any).subcategory} 
                      size="small" 
                      variant="outlined"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      -
                    </Typography>
                  )}
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
                    label={product.inStock ? 'In Stock' : 'Out of Stock'} 
                    color={product.inStock ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {product.affiliateLink ? (
                    <Tooltip title={product.affiliateLink}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => window.open(product.affiliateLink, '_blank')}
                        sx={{ 
                          maxWidth: 120, 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontSize: '0.7rem'
                        }}
                      >
                        View Link
                      </Button>
                    </Tooltip>
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      No link
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="View Details">
                      <IconButton size="small">
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => handleOpenDialog(product)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
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
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Product Name *"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Brand *"
              value={formData.brand}
              onChange={(e) => handleInputChange('brand', e.target.value)}
              margin="normal"
            />
          </Box>
          
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            multiline
            rows={2}
            margin="normal"
          />
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Price *"
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', Number(e.target.value))}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Original Price"
              type="number"
              value={formData.originalPrice}
              onChange={(e) => handleInputChange('originalPrice', Number(e.target.value))}
              margin="normal"
            />
          </Box>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 1 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Category *</InputLabel>
              <Select
                value={formData.category}
                label="Category *"
                onChange={(e) => {
                  handleInputChange('category', e.target.value);
                  handleInputChange('subcategory', ''); // Reset subcategory when category changes
                }}
              >
                <MenuItem value="">Select Category</MenuItem>
                {predefinedCategories.map((category) => (
                  <MenuItem key={category.id} value={category.name}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {formData.category && (
              <FormControl fullWidth margin="normal">
                <InputLabel>Subcategory</InputLabel>
                <Select
                  value={formData.subcategory || ''}
                  label="Subcategory"
                  onChange={(e) => handleInputChange('subcategory', e.target.value)}
                >
                  <MenuItem value="">Select Subcategory (Optional)</MenuItem>
                  {predefinedCategories
                    .find(cat => cat.name === formData.category)
                    ?.subcategories.map((subcategory) => (
                      <MenuItem key={subcategory} value={subcategory}>
                        {subcategory}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}
          </Box>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Product Image URL *"
              value={formData.image}
              onChange={(e) => handleInputChange('image', e.target.value)}
              margin="normal"
              helperText="Direct link to product image"
            />
            <TextField
              fullWidth
              label="External URL"
              value={formData.externalUrl}
              onChange={(e) => handleInputChange('externalUrl', e.target.value)}
              margin="normal"
              helperText="Link to original product page"
            />
          </Box>
          
          <TextField
            fullWidth
            label="Affiliate Link *"
            value={formData.affiliateLink}
            onChange={(e) => handleInputChange('affiliateLink', e.target.value)}
            margin="normal"
            helperText="Your affiliate link for this product (required for commission)"
            placeholder="https://example.com/product?ref=your-affiliate-id"
          />
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Rating"
              type="number"
              inputProps={{ min: 0, max: 5, step: 0.1 }}
              value={formData.rating}
              onChange={(e) => handleInputChange('rating', Number(e.target.value))}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Review Count"
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
            label="In Stock"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" startIcon={<Save />}>
            {editingProduct ? 'Update' : 'Add Product'}
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
