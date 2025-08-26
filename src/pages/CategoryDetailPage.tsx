import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Breadcrumbs,
  Divider,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Checkbox,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Skeleton
} from '@mui/material';
import {
  Search,
  FilterList,
  Sort,
  ExpandMore,
  NavigateNext,
  Home,
  Category,
  LocalOffer,
  Star,
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  TrendingUp,
  NewReleases
} from '@mui/icons-material';

import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import ProductCard from '../components/ProductCard';
import { fetchCategories } from '../services/productService';
import { 
  getCategoryBySlug, 
  categories as localCategories 
} from '../data/categories';
import CategorySubcategories from '../components/CategorySubcategories';
import { Product } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`category-tabpanel-${index}`}
      aria-labelledby={`category-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const CategoryDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [showOnlyInStock, setShowOnlyInStock] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState<string[]>(['brands']);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [dbLoading, setDbLoading] = useState(true);

  // Fetch categories from database
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await fetchCategories();
        setDbCategories(categories);
      } catch (error) {
        console.error('Error loading categories from database:', error);
      } finally {
        setDbLoading(false);
      }
    };
    loadCategories();
  }, []);

  // Get category data - try database first, then fall back to local
  const category = useMemo(() => {
    if (!slug) return null;
    
    // Try to find in database categories first
    const dbCategory = dbCategories.find(c => c.slug === slug);
    if (dbCategory) return dbCategory;
    
    // Fall back to local categories
    return getCategoryBySlug(slug);
  }, [slug, dbCategories]);

  // Filter products by category
  const categoryProducts = useMemo(() => {
    if (!category) return [];
    
    return products.filter(product => {
      const productCategory = product.category?.toLowerCase().replace(/\s+/g, '-');
      return productCategory === category.id || 
             product.category?.toLowerCase().includes(category.name.toLowerCase()) ||
             product.tags?.some(tag => tag.toLowerCase().includes(category.name.toLowerCase()));
    });
  }, [products, category]);

  // Apply filters
  const filteredProducts = useMemo(() => {
    let filtered = categoryProducts;

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Price range filter
    filtered = filtered.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product =>
        selectedBrands.includes(product.brand)
      );
    }

    // Rating filter
    if (selectedRatings.length > 0) {
      filtered = filtered.filter(product =>
        selectedRatings.includes(Math.floor(product.rating))
      );
    }

    // Stock filter
    if (showOnlyInStock) {
      filtered = filtered.filter(product => product.inStock);
    }

    return filtered;
  }, [categoryProducts, searchTerm, priceRange, selectedBrands, selectedRatings, showOnlyInStock]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);

  // Get unique brands and ratings
  const availableBrands = useMemo(() => {
    const brands = new Set(categoryProducts.map(p => p.brand));
    return Array.from(brands).sort();
  }, [categoryProducts]);

  const availableRatings = useMemo(() => {
    const ratings = new Set(categoryProducts.map(p => Math.floor(p.rating)));
    return Array.from(ratings).sort((a, b) => b - a);
  }, [categoryProducts]);

  // Get price range
  const priceRangeData = useMemo(() => {
    if (categoryProducts.length === 0) return [0, 1000];
    const prices = categoryProducts.map(p => p.price);
    return [Math.min(...prices), Math.max(...prices)];
  }, [categoryProducts]);

  // Handle filter changes
  const handleBrandChange = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const handleRatingChange = (rating: number) => {
    setSelectedRatings(prev =>
      prev.includes(rating)
        ? prev.filter(r => r !== rating)
        : [...prev, rating]
    );
  };

  const handleFilterToggle = (filterName: string) => {
    setExpandedFilters(prev =>
      prev.includes(filterName)
        ? prev.filter(f => f !== filterName)
        : [...prev, filterName]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setPriceRange([0, 1000]);
    setSelectedBrands([]);
    setSelectedRatings([]);
    setShowOnlyInStock(false);
    setSortBy('featured');
  };

  if (!category) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Category not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs 
          separator={<NavigateNext fontSize="small" />} 
          sx={{ color: '#6b7280' }}
        >
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Home fontSize="small" />
              <Typography variant="body2">Home</Typography>
            </Box>
          </Link>
          <Link to="/categories" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Category fontSize="small" />
              <Typography variant="body2">Categories</Typography>
            </Box>
          </Link>
          <Typography variant="body2" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {category.icon && <span>{category.icon}</span>}
            {category.name}
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* Category Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          {category.icon && (
            <Typography variant="h1" sx={{ fontSize: '3rem' }}>
              {category.icon}
            </Typography>
          )}
          <Box>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 700, color: '#1f2937' }}>
              {category.name}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              {category.description}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip 
                label={`${categoryProducts.length} products`} 
                color="primary" 
                size="small"
              />
              <Chip 
                label={`${filteredProducts.length} filtered`} 
                color="secondary" 
                size="small"
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Filters Sidebar */}
        <Grid item xs={12} md={3}>
          <Card sx={{ 
            position: { xs: 'static', md: 'sticky' }, 
            top: { xs: 'auto', md: 20 },
            mb: { xs: 2, md: 0 }
          }}>
            <CardContent sx={{ p: { xs: 2, md: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                  <FilterList sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Filters
                </Typography>
                <Button size="small" onClick={clearAllFilters}>
                  Clear All
                </Button>
              </Box>

              {/* Search */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-input': {
                      fontSize: { xs: '16px', sm: '14px' }, // Prevent zoom on iOS
                      padding: { xs: '12px 16px', sm: '8px 12px' }
                    },
                    '& .MuiInputAdornment-root': {
                      margin: { xs: '0 8px', sm: '0 4px' }
                    }
                  }}
                />
              </Box>

              {/* Price Range */}
              <Accordion 
                expanded={expandedFilters.includes('price')}
                onChange={() => handleFilterToggle('price')}
                sx={{ mb: 1 }}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Price Range
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ px: 1 }}>
                    <Slider
                      value={priceRange}
                      onChange={(_, newValue) => setPriceRange(newValue as [number, number])}
                      valueLabelDisplay="auto"
                      min={priceRangeData[0]}
                      max={priceRangeData[1]}
                      step={10}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="body2">${priceRange[0]}</Typography>
                      <Typography variant="body2">${priceRange[1]}</Typography>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>

              {/* Brands */}
              <Accordion 
                expanded={expandedFilters.includes('brands')}
                onChange={() => handleFilterToggle('brands')}
                sx={{ mb: 1 }}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Brands ({availableBrands.length})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                    {availableBrands.map(brand => (
                      <FormControlLabel
                        key={brand}
                        control={
                          <Checkbox
                            checked={selectedBrands.includes(brand)}
                            onChange={() => handleBrandChange(brand)}
                            size="small"
                          />
                        }
                        label={brand}
                        sx={{ display: 'block', mb: 0.5 }}
                      />
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>

              {/* Ratings */}
              <Accordion 
                expanded={expandedFilters.includes('ratings')}
                onChange={() => handleFilterToggle('ratings')}
                sx={{ mb: 1 }}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Ratings
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {availableRatings.map(rating => (
                    <FormControlLabel
                      key={rating}
                      control={
                        <Checkbox
                          checked={selectedRatings.includes(rating)}
                          onChange={() => handleRatingChange(rating)}
                          size="small"
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {Array.from({ length: rating }, (_, i) => (
                            <Star key={i} sx={{ fontSize: '1rem', color: '#fbbf24' }} />
                          ))}
                          <Typography variant="body2">+ ({rating})</Typography>
                        </Box>
                      }
                      sx={{ display: 'block', mb: 0.5 }}
                    />
                  ))}
                </AccordionDetails>
              </Accordion>

              {/* Stock Filter */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showOnlyInStock}
                    onChange={(e) => setShowOnlyInStock(e.target.checked)}
                    size="small"
                  />
                }
                label="In Stock Only"
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Products Grid */}
        <Grid item xs={12} md={9}>
          {/* Sort and Results Header */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' }, 
            justifyContent: 'space-between', 
            mb: 3,
            gap: { xs: 2, sm: 0 }
          }}>
            <Typography variant="body2" color="text.secondary">
              Showing {sortedProducts.length} of {categoryProducts.length} products
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 150 } }}>
                <InputLabel>Sort by</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Sort by"
                >
                  <MenuItem value="featured">Featured</MenuItem>
                  <MenuItem value="price-low">Price: Low to High</MenuItem>
                  <MenuItem value="price-high">Price: High to Low</MenuItem>
                  <MenuItem value="rating">Highest Rated</MenuItem>
                  <MenuItem value="newest">Newest First</MenuItem>
                  <MenuItem value="name">Name A-Z</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Products Grid */}
          {loading ? (
            <Grid container spacing={3}>
              {Array.from({ length: 8 }).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Card>
                    <Skeleton variant="rectangular" height={200} />
                    <CardContent>
                      <Skeleton variant="text" height={24} sx={{ mb: 1 }} />
                      <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
                      <Skeleton variant="text" height={16} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : sortedProducts.length === 0 ? (
            <Box sx={{ 
              textAlign: 'center', 
              py: 8,
              backgroundColor: '#f8fafc',
              borderRadius: 2
            }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#6b7280' }}>
                No products found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Try adjusting your filters or search terms
              </Typography>
              <Button variant="outlined" onClick={clearAllFilters}>
                Clear All Filters
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {sortedProducts.map((product) => (
                <Grid xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>

      {/* Subcategories Section */}
      <CategorySubcategories 
        categoryId={category.id}
        variant="chips"
        maxItems={8}
        showIcons={true}
      />
    </Container>
  );
};

export default CategoryDetailPage;
