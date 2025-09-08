import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  Search,
  CloudUpload
} from '@mui/icons-material';
import { Product } from '../types';
import { fetchCategories } from '../services/productService';
import { useProducts } from '../contexts/ProductContext';
import { getAllProducts } from '../services/productService';
import VideoPlayer from '../components/VideoPlayer';

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
  retailer?: string;
  inStock: boolean;
  features: string[];
  specifications: Record<string, string>;
  images: string[];
  tags: string[];
  externalUrl?: string;
  affiliateLink?: string;
  // Video fields
  videoUrl?: string;
  videoFile?: string;
  videoType?: 'youtube' | 'vimeo' | 'direct' | 'upload';
  // Deal Details content
  dealTitle?: string;
  dealDescription?: string;
  dealCategories?: string[];
  productDetails?: string;
  keyFeatures?: string[];
  communityNotes?: string;
  aboutPoster?: string;
  createdAt?: string;
  updatedAt?: string;
}

const AdminProductsPage: React.FC = () => {
  const { updateProductById, createNewProduct, deleteProductById } = useProducts();
  const [products, setProducts] = useState<Product[]>([]);
  // const [loading, setLoading] = useState(true); // TODO: Implement loading state
  // const [categories, setCategories] = useState<Category[]>([]); // TODO: Implement categories
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductFormData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  // const [expandedCategory, setExpandedCategory] = useState<string | null>(null); // TODO: Implement category expansion
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as any });
  const [isUploading, setIsUploading] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load all products for admin (not just homepage optimized set)
  useEffect(() => {
    const loadAllProducts = async () => {
      try {
        // setLoading(true); // TODO: Implement loading state
        const allProducts = await getAllProducts();
        setProducts(allProducts);
      } catch (error) {
        console.error('Error loading products for admin:', error);
      } finally {
        // setLoading(false); // TODO: Implement loading state
      }
    };

    loadAllProducts();
  }, []);
  
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

  // TODO: Implement categories loading
  // useEffect(() => {
  //   let mounted = true;
  //   (async () => {
  //     try {
  //       const cats = await fetchCategories();
  //       if (!mounted) return;
  //       setCategories(cats);
  //     } catch (e) {
  //       console.error('Error loading categories:', e);
  //     }
  //   })();
  //   return () => { mounted = false; };
  // }, []);

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
    retailer: '',
    inStock: true,
    features: [],
    specifications: {},
    images: [],
    tags: [],
    externalUrl: '',
    affiliateLink: '',
    // Video fields
    videoUrl: '',
    videoFile: '',
    videoType: undefined
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
        retailer: product.retailer || '',
        inStock: product.inStock,
        features: [...product.features],
        specifications: { ...product.specifications },
        images: [...product.images],
        tags: [...product.tags],
        externalUrl: (product as any).externalUrl || '',
        affiliateLink: (product as any).affiliateLink || '',
        // Video fields
        videoUrl: (product as any).videoUrl || '',
        videoFile: (product as any).videoFile || '',
        videoType: (product as any).videoType || undefined,
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
        retailer: '',
        inStock: true,
        features: [],
        specifications: {},
        images: [],
        tags: [],
        externalUrl: '',
        affiliateLink: '',
        // Video fields
        videoUrl: '',
        videoFile: '',
        videoType: undefined
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
      setSnackbar({ open: true, message: 'Please fill in all required information', severity: 'error' });
      return;
    }

    try {
      // Validate required fields
      if (!formData.name || !formData.price || !formData.category || !formData.brand) {
        setSnackbar({ open: true, message: 'Please fill in all required fields (Name, Price, Category, Brand)', severity: 'error' });
        return;
      }

      // Validate price
      if (formData.price <= 0) {
        setSnackbar({ open: true, message: 'Price must be greater than 0', severity: 'error' });
        return;
      }

      // Validate rating
      if (formData.rating < 0 || formData.rating > 5) {
        setSnackbar({ open: true, message: 'Rating must be between 0 and 5', severity: 'error' });
        return;
      }

      if (editingProduct) {
        console.log('Saving product with data:', formData);
        await updateProductById(editingProduct.id, {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          originalPrice: formData.originalPrice,
          image: formData.image,
          rating: formData.rating,
          reviewCount: formData.reviewCount,
          category: formData.category,
          brand: formData.brand,
          retailer: formData.retailer,
          inStock: formData.inStock,
          features: formData.features,
          specifications: formData.specifications,
          images: formData.images,
          tags: formData.tags,
          externalUrl: formData.externalUrl,
          affiliateLink: formData.affiliateLink,
          // Deal Details content
          dealTitle: formData.dealTitle,
          dealDescription: formData.dealDescription,
          dealCategories: formData.dealCategories,
          productDetails: formData.productDetails,
          keyFeatures: formData.keyFeatures,
          communityNotes: formData.communityNotes,
          aboutPoster: formData.aboutPoster,
        });
        setSnackbar({ open: true, message: 'Product updated successfully!', severity: 'success' });
              } else {
          await createNewProduct({
            name: formData.name,
            description: formData.description,
            price: formData.price,
            originalPrice: formData.originalPrice,
            image: formData.image,
            rating: formData.rating,
            reviewCount: formData.reviewCount,
            category: formData.category,
            brand: formData.brand,
            retailer: formData.retailer,
            inStock: formData.inStock,
            features: formData.features,
            specifications: formData.specifications,
            images: formData.images,
            tags: formData.tags,
            externalUrl: formData.externalUrl,
            affiliateLink: formData.affiliateLink,
            // Deal Details content
            dealTitle: formData.dealTitle,
            dealDescription: formData.dealDescription,
            dealCategories: formData.dealCategories,
            productDetails: formData.productDetails,
            keyFeatures: formData.keyFeatures,
            communityNotes: formData.communityNotes,
            aboutPoster: formData.aboutPoster,
          });
        setSnackbar({ open: true, message: 'New product added successfully!', severity: 'success' });
      }
      
      // Refresh the local products list after save
      const updatedProducts = await getAllProducts();
      setProducts(updatedProducts);
      
      handleCloseDialog();
    } catch (e) {
              setSnackbar({ open: true, message: `Error saving product: ${e instanceof Error ? e.message : 'Unknown error'}`, severity: 'error' });
        // Don't close dialog on error, let user try again
        return;
    }
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProductById(productId);
        
        // Refresh the local products list after delete
        const updatedProducts = await getAllProducts();
        setProducts(updatedProducts);
        
        setSnackbar({ open: true, message: 'Product deleted successfully!', severity: 'success' });
      } catch (e) {
        setSnackbar({ open: true, message: 'Error deleting product', severity: 'error' });
      }
    }
  };

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // TODO: Implement feature management functions
  // const handleFeaturesChange = (index: number, value: string) => {
  //   const newFeatures = [...formData.features];
  //   newFeatures[index] = value;
  //   setFormData(prev => ({ ...prev, features: newFeatures }));
  // };

  // const addFeature = () => {
  //   setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  // };

  // const removeFeature = (index: number) => {
  //   setFormData(prev => ({ 
  //     ...prev, 
  //     features: prev.features.filter((_, i) => i !== index)
  //   }));
  // };

  // Image upload functions
  const handleFileUpload = async (file: File, type: 'main' | 'additional') => {
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      setSnackbar({ open: true, message: 'Please select an image file', severity: 'error' });
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setSnackbar({ open: true, message: 'File size must be less than 5MB', severity: 'error' });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Convert to base64 for immediate preview
      const base64 = await convertFileToBase64(file);
      
      if (type === 'main') {
        handleInputChange('image', base64);
      } else {
        // Add to additional images
        const newImages = [...formData.images, base64];
        handleInputChange('images', newImages);
      }
      
      setSnackbar({ open: true, message: 'Image uploaded successfully!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to upload image', severity: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleUploadClick = (type: 'main' | 'additional') => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('data-upload-type', type);
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const type = event.target.getAttribute('data-upload-type') as 'main' | 'additional';
    
    if (file) {
      handleFileUpload(file, type);
    }
    
    // Reset input
    event.target.value = '';
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
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                    />
                    {product.images && product.images.length > 0 && (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {product.images.slice(0, 2).map((img, index) => (
                          <img 
                            key={index}
                            src={img} 
                            alt={`${product.name} ${index + 1}`}
                            style={{ width: 25, height: 25, objectFit: 'cover', borderRadius: 2 }}
                          />
                        ))}
                        {product.images.length > 2 && (
                          <Box 
                            sx={{ 
                              width: 25, 
                              height: 25, 
                              bgcolor: 'grey.300', 
                              borderRadius: 2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.6rem',
                              color: 'grey.600'
                            }}
                          >
                            +{product.images.length - 2}
                          </Box>
                        )}
                      </Box>
                    )}
                  </Box>
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
            <Box>
              <TextField
                fullWidth
                label="Main Product Image URL *"
                value={formData.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
                margin="normal"
                helperText="Direct link to main product image"
              />
              <Button
                variant="outlined"
                size="small"
                startIcon={<CloudUpload />}
                onClick={() => handleUploadClick('main')}
                disabled={isUploading}
                sx={{ mt: 1 }}
              >
                {isUploading ? 'Uploading...' : 'Upload Image'}
              </Button>
            </Box>
            <TextField
              fullWidth
              label="External URL"
              value={formData.externalUrl}
              onChange={(e) => handleInputChange('externalUrl', e.target.value)}
              margin="normal"
              helperText="Link to original product page"
            />
          </Box>
          
          {/* Image Preview */}
          {formData.image && (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Main Image Preview:
              </Typography>
              <img 
                src={formData.image} 
                alt="Product preview"
                style={{ 
                  maxWidth: '200px', 
                  maxHeight: '200px', 
                  objectFit: 'cover', 
                  borderRadius: '8px',
                  border: '1px solid #ddd'
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </Box>
          )}
          
          {/* Image Upload Guide */}
          <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom color="primary">
              📸 Image Upload Guide:
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              • <strong>Upload from computer:</strong> Click "Upload Image" button (max 5MB)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              • <strong>Use URL:</strong> Direct image URLs (ending with .jpg, .png, .webp)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              • <strong>Quick upload services:</strong>
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', ml: 2 }}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => window.open('https://imgur.com/upload', '_blank')}
              >
                Imgur
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => window.open('https://cloudinary.com/console/media_library', '_blank')}
              >
                Cloudinary
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => window.open('https://postimages.org/', '_blank')}
              >
                PostImages
              </Button>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              • <strong>Example:</strong> https://i.imgur.com/example.jpg
            </Typography>
          </Box>
          
          {/* Additional Images */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Additional Product Images:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {formData.images.map((img, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <TextField
                    fullWidth
                    size="small"
                    label={`Image ${index + 1} URL`}
                    value={img}
                    onChange={(e) => {
                      const newImages = [...formData.images];
                      newImages[index] = e.target.value;
                      handleInputChange('images', newImages);
                    }}
                    placeholder="https://example.com/image.jpg"
                  />
                  <Button
                    size="small"
                    color="error"
                    onClick={() => {
                      const newImages = formData.images.filter((_, i) => i !== index);
                      handleInputChange('images', newImages);
                    }}
                  >
                    Remove
                  </Button>
                </Box>
              ))}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    handleInputChange('images', [...formData.images, '']);
                  }}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  Add Image URL
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<CloudUpload />}
                  onClick={() => handleUploadClick('additional')}
                  disabled={isUploading}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  {isUploading ? 'Uploading...' : 'Upload Image'}
                </Button>
              </Box>
            </Box>
            
            {/* Additional Images Preview */}
            {formData.images.filter(img => img.trim()).length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2">
                    Additional Images Preview:
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setShowImagePreview(true)}
                  >
                    View All Images
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {formData.images.filter(img => img.trim()).slice(0, 4).map((img, index) => (
                    <Box key={index} sx={{ position: 'relative' }}>
                      <img 
                        src={img} 
                        alt={`Product ${index + 1}`}
                        style={{ 
                          width: '100px', 
                          height: '100px', 
                          objectFit: 'cover', 
                          borderRadius: '4px',
                          border: '1px solid #ddd'
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </Box>
                  ))}
                  {formData.images.filter(img => img.trim()).length > 4 && (
                    <Box 
                      sx={{ 
                        width: '100px', 
                        height: '100px', 
                        bgcolor: 'grey.300', 
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        color: 'grey.600',
                        cursor: 'pointer'
                      }}
                      onClick={() => setShowImagePreview(true)}
                    >
                      +{formData.images.filter(img => img.trim()).length - 4} more
                    </Box>
                  )}
                </Box>
              </Box>
            )}
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

          {/* Video Section */}
          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Product Video
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Add a video to showcase your product. You can use YouTube, Vimeo, or upload a video file.
            </Typography>
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Video Type</InputLabel>
              <Select
                value={formData.videoType || ''}
                onChange={(e) => handleInputChange('videoType', e.target.value)}
                label="Video Type"
              >
                <MenuItem value="">No Video</MenuItem>
                <MenuItem value="youtube">YouTube</MenuItem>
                <MenuItem value="vimeo">Vimeo</MenuItem>
                <MenuItem value="direct">Direct Video URL</MenuItem>
                <MenuItem value="upload">Upload Video File</MenuItem>
              </Select>
            </FormControl>

            {formData.videoType && formData.videoType !== 'upload' && (
              <TextField
                fullWidth
                label={`${formData.videoType === 'youtube' ? 'YouTube' : formData.videoType === 'vimeo' ? 'Vimeo' : 'Video'} URL`}
                value={formData.videoUrl || ''}
                onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                margin="normal"
                helperText={
                  formData.videoType === 'youtube' 
                    ? "Paste YouTube video URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID)"
                    : formData.videoType === 'vimeo'
                    ? "Paste Vimeo video URL (e.g., https://vimeo.com/VIDEO_ID)"
                    : "Direct link to video file (MP4, WebM, etc.)"
                }
                placeholder={
                  formData.videoType === 'youtube'
                    ? "https://www.youtube.com/watch?v=VIDEO_ID"
                    : formData.videoType === 'vimeo'
                    ? "https://vimeo.com/VIDEO_ID"
                    : "https://example.com/video.mp4"
                }
              />
            )}

            {formData.videoType === 'upload' && (
              <Box sx={{ mt: 2 }}>
                <input
                  accept="video/*"
                  style={{ display: 'none' }}
                  id="video-upload"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // For now, we'll store the file name. In production, you'd upload to Supabase Storage
                      handleInputChange('videoFile', file.name);
                    }
                  }}
                />
                <label htmlFor="video-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUpload />}
                    sx={{ mr: 2 }}
                  >
                    Upload Video
                  </Button>
                </label>
                {formData.videoFile && (
                  <Typography variant="body2" color="text.secondary">
                    Selected: {formData.videoFile}
                  </Typography>
                )}
                <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                  Supported formats: MP4, WebM, MOV, AVI (Max 100MB)
                </Typography>
              </Box>
            )}

            {/* Video Preview */}
            {formData.videoUrl && formData.videoType && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Video Preview:
                </Typography>
                <Box sx={{ maxWidth: 400, maxHeight: 300 }}>
                  <VideoPlayer
                    videoUrl={formData.videoUrl}
                    videoType={formData.videoType as 'youtube' | 'vimeo' | 'direct'}
                    width="100%"
                    height="auto"
                    controls={true}
                  />
                </Box>
              </Box>
            )}
          </Box>
          
          <TextField
            fullWidth
            label="Retailer Name"
            value={formData.retailer || ''}
            onChange={(e) => handleInputChange('retailer', e.target.value)}
            margin="normal"
            helperText="Name of the retailer (e.g., Amazon, Best Buy, Walmart)"
            placeholder="Amazon"
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

          {/* Deal Details Section */}
          <Typography variant="h6" sx={{ mt: 3, mb: 2, color: 'primary', borderBottom: '1px solid #e0e0e0', pb: 1 }}>
            Deal Details Content
          </Typography>

          <TextField
            fullWidth
            label="Deal Title"
            value={formData.dealTitle || ''}
            onChange={(e) => handleInputChange('dealTitle', e.target.value)}
            margin="normal"
            helperText="Custom title for the deal (optional - will use default if empty)"
            placeholder="MacBook Pro M3 - $1999.99 + Free Shipping"
          />

          <TextField
            fullWidth
            label="Deal Description"
            value={formData.dealDescription || ''}
            onChange={(e) => handleInputChange('dealDescription', e.target.value)}
            margin="normal"
            multiline
            rows={3}
            helperText="Custom description for the deal (optional - will use default if empty)"
            placeholder="Amazon has MacBook Pro M3 + Free Shipping"
          />

          <TextField
            fullWidth
            label="Deal Categories (comma separated)"
            value={formData.dealCategories?.join(', ') || ''}
            onChange={(e) => handleInputChange('dealCategories', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
            margin="normal"
            helperText="Custom categories for the deal (optional - will use product category and tags if empty)"
            placeholder="Electronics, laptop, macbook"
          />

          <TextField
            fullWidth
            label="Product Details"
            value={formData.productDetails || ''}
            onChange={(e) => handleInputChange('productDetails', e.target.value)}
            margin="normal"
            multiline
            rows={3}
            helperText="Custom product details text (optional)"
            placeholder="MacBook Pro M3 [amazon.com] $1999.99"
          />

          <TextField
            fullWidth
            label="Key Features (comma separated)"
            value={formData.keyFeatures?.join(', ') || ''}
            onChange={(e) => handleInputChange('keyFeatures', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
            margin="normal"
            helperText="Custom key features (optional - will use product features if empty)"
            placeholder="M3 Chip, Retina Display, Touch Bar, Thunderbolt 4"
          />

          <TextField
            fullWidth
            label="Community Notes"
            value={formData.communityNotes || ''}
            onChange={(e) => handleInputChange('communityNotes', e.target.value)}
            margin="normal"
            multiline
            rows={4}
            helperText="Community notes and comments about this deal"
            placeholder="Great deal! This is the lowest price I've seen..."
          />

          <TextField
            fullWidth
            label="About the Poster"
            value={formData.aboutPoster || ''}
            onChange={(e) => handleInputChange('aboutPoster', e.target.value)}
            margin="normal"
            multiline
            rows={3}
            helperText="Information about who posted this deal"
            placeholder="BestFinds Staff - Verified Deals Expert"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" startIcon={<Save />}>
            {editingProduct ? 'Update' : 'Add Product'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Hidden file input for image upload */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleFileInputChange}
      />

      {/* Image Preview Modal */}
      <Dialog 
        open={showImagePreview} 
        onClose={() => setShowImagePreview(false)} 
        maxWidth="lg" 
        fullWidth
      >
        <DialogTitle>
          All Product Images
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 2 }}>
            {/* Main Image */}
            <Box>
              <Typography variant="subtitle2" gutterBottom color="primary">
                Main Image:
              </Typography>
              <img 
                src={formData.image} 
                alt="Main product"
                style={{ 
                  width: '100%', 
                  height: '200px', 
                  objectFit: 'cover', 
                  borderRadius: '8px',
                  border: '1px solid #ddd'
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </Box>
            
            {/* Additional Images */}
            {formData.images.filter(img => img.trim()).map((img, index) => (
              <Box key={index}>
                <Typography variant="subtitle2" gutterBottom color="text.secondary">
                  Additional Image {index + 1}:
                </Typography>
                <img 
                  src={img} 
                  alt={`Product ${index + 1}`}
                  style={{ 
                    width: '100%', 
                    height: '200px', 
                    objectFit: 'cover', 
                    borderRadius: '8px',
                    border: '1px solid #ddd'
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowImagePreview(false)}>Close</Button>
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
