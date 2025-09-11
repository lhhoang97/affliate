import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  Skeleton,
  Drawer,
  AppBar,
  Toolbar,
  Fab,
  useTheme,
  useMediaQuery
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
  NewReleases,
  Close,
  Tune
} from '@mui/icons-material';

import { useProducts } from '../contexts/ProductContext';
import { useSimpleCart } from '../contexts/SimpleCartContext';
import { useCartSidebar } from '../contexts/CartSidebarContext';
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
      {value === index && <Box sx={{ py: { xs: 2, md: 3 } }}>{children}</Box>}
    </div>
  );
}

const CategoryDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { addToCart } = useSimpleCart();
  const { openCart } = useCartSidebar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
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
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

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
    
    console.log('CategoryDetailPage - Filtering products for category:', category.name);
    console.log('CategoryDetailPage - Total products available:', products.length);
    console.log('CategoryDetailPage - Sample products:', products.slice(0, 3).map(p => ({ name: p.name, category: p.category })));
    
    const filtered = products.filter(product => 
      product.category.toLowerCase() === category.name.toLowerCase() ||
      product.category.toLowerCase().includes(category.name.toLowerCase())
    );
    
    console.log('CategoryDetailPage - Products matching category:', filtered.length);
    filtered.forEach(p => {
      console.log('CategoryDetailPage - Matching product:', p.name, p.category);
    });
    
    return filtered;
  }, [products, category]);

  // Apply filters
  const filteredProducts = useMemo(() => {
    let filtered = categoryProducts;

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        (product.brand && product.brand.toLowerCase().includes(searchLower)) ||
        (product.description && product.description.toLowerCase().includes(searchLower))
      );
    }

    // Price filter
    filtered = filtered.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product =>
        product.brand && selectedBrands.includes(product.brand)
      );
    }

    // Rating filter
    if (selectedRatings.length > 0) {
      filtered = filtered.filter(product =>
        selectedRatings.some(rating => Math.floor(product.rating) >= rating)
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
    const brands = new Set(
      categoryProducts
        .filter(p => p.brand && p.brand.trim() !== '')
        .map(p => p.brand)
    );
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

  // Enhanced Filter content component
  const FilterContent = () => (
    <Box sx={{ p: 3 }}>
      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ 
          fontWeight: 600, 
          color: '#374151', 
          mb: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Search sx={{ fontSize: '1.1rem', color: '#667eea' }} />
          Search Products
        </Typography>
        <TextField
          fullWidth
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: '#f1f5f9',
                borderColor: '#667eea'
              },
              '&.Mui-focused': {
                background: 'white',
                borderColor: '#667eea',
                boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
              }
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: '#6b7280' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Price Range */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ 
          fontWeight: 600, 
          color: '#374151', 
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <LocalOffer sx={{ fontSize: '1.1rem', color: '#667eea' }} />
          Price Range
        </Typography>
        <Box sx={{ 
          p: 2.5, 
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          borderRadius: 2,
          border: '1px solid #e2e8f0'
        }}>
          <Slider
            value={priceRange}
            onChange={(_, newValue) => setPriceRange(newValue as [number, number])}
            valueLabelDisplay="auto"
            min={priceRangeData[0]}
            max={priceRangeData[1]}
            step={10}
            valueLabelFormat={(value) => `$${value}`}
            sx={{
              '& .MuiSlider-thumb': {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: '3px solid white',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                width: 20,
                height: 20,
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(102, 126, 234, 0.6)'
                }
              },
              '& .MuiSlider-track': {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                height: 6
              },
              '& .MuiSlider-rail': {
                background: '#cbd5e1',
                height: 6
              },
              '& .MuiSlider-valueLabel': {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:before': {
                  borderTopColor: '#667eea'
                }
              }
            }}
          />
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            mt: 2,
            p: 1.5,
            background: 'white',
            borderRadius: 1.5,
            border: '1px solid #e2e8f0'
          }}>
            <Chip 
              label={`$${priceRange[0]}`} 
              size="small" 
              sx={{ 
                fontWeight: 600, 
                color: '#059669',
                background: '#d1fae5'
              }} 
            />
            <Typography variant="body2" sx={{ color: '#6b7280', alignSelf: 'center' }}>
              to
            </Typography>
            <Chip 
              label={`$${priceRange[1]}`} 
              size="small" 
              sx={{ 
                fontWeight: 600, 
                color: '#059669',
                background: '#d1fae5'
              }} 
            />
          </Box>
        </Box>
      </Box>

      {/* Brands */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ 
          fontWeight: 600, 
          color: '#374151', 
          mb: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Star sx={{ fontSize: '1.1rem', color: '#667eea' }} />
          Brands ({availableBrands.length})
        </Typography>
        <Box sx={{ 
          p: 2, 
          background: '#f8fafc',
          borderRadius: 2,
          border: '1px solid #e2e8f0',
          maxHeight: 220,
          overflowY: 'auto'
        }}>
          {availableBrands.map(brand => (
            <Box
              key={brand}
              onClick={() => handleBrandChange(brand)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 1.5,
                borderRadius: 1.5,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: selectedBrands.includes(brand) ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                color: selectedBrands.includes(brand) ? 'white' : '#374151',
                '&:hover': {
                  background: selectedBrands.includes(brand) 
                    ? 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
                    : '#e2e8f0',
                  transform: 'translateX(4px)'
                }
              }}
            >
              <Box sx={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                border: selectedBrands.includes(brand) ? '2px solid white' : '2px solid #d1d5db',
                background: selectedBrands.includes(brand) ? 'white' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {selectedBrands.includes(brand) && (
                  <Box sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    background: '#667eea' 
                  }} />
                )}
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {brand}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Ratings */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ 
          fontWeight: 600, 
          color: '#374151', 
          mb: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Star sx={{ fontSize: '1.1rem', color: '#667eea' }} />
          Ratings
        </Typography>
        <Box sx={{ 
          p: 2, 
          background: '#f8fafc',
          borderRadius: 2,
          border: '1px solid #e2e8f0'
        }}>
          {availableRatings.map(rating => (
            <Box
              key={rating}
              onClick={() => handleRatingChange(rating)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 1.5,
                borderRadius: 1.5,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: selectedRatings.includes(rating) ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                color: selectedRatings.includes(rating) ? 'white' : '#374151',
                '&:hover': {
                  background: selectedRatings.includes(rating) 
                    ? 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
                    : '#e2e8f0',
                  transform: 'translateX(4px)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {Array.from({ length: rating }, (_, i) => (
                  <Star key={i} sx={{ 
                    fontSize: '1rem', 
                    color: selectedRatings.includes(rating) ? '#fbbf24' : '#fbbf24' 
                  }} />
                ))}
                <Typography variant="body2" sx={{ ml: 0.5, fontWeight: 500 }}>
                  & up
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Stock Filter */}
      <Box sx={{
        p: 2,
        background: showOnlyInStock ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f8fafc',
        borderRadius: 2,
        border: '1px solid #e2e8f0',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
        }
      }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={showOnlyInStock}
              onChange={(e) => setShowOnlyInStock(e.target.checked)}
              sx={{
                color: showOnlyInStock ? 'white' : '#667eea',
                '&.Mui-checked': {
                  color: 'white'
                }
              }}
            />
          }
          label={
            <Typography variant="body2" sx={{ 
              fontWeight: 600,
              color: showOnlyInStock ? 'white' : '#374151'
            }}>
              In Stock Only
            </Typography>
          }
          sx={{ margin: 0 }}
        />
      </Box>
    </Box>
  );

  if (!category) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        <Alert severity="error">Category not found</Alert>
      </Container>
    );
  }

  return (
    <>
      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="left"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 320 },
            maxWidth: '100vw'
          }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
          <Typography variant="h6">Filters</Typography>
          <IconButton onClick={() => setFilterDrawerOpen(false)}>
            <Close />
          </IconButton>
        </Box>
        <FilterContent />
      </Drawer>

      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        {/* Breadcrumbs */}
        <Box sx={{ mb: { xs: 2, md: 3 } }}>
          <Breadcrumbs 
            separator={<NavigateNext fontSize="small" />} 
            sx={{ 
              color: '#6b7280',
              '& .MuiBreadcrumbs-ol': {
                flexWrap: 'nowrap',
                overflow: 'hidden'
              },
              '& .MuiBreadcrumbs-li': {
                minWidth: 0
              }
            }}
          >
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Home fontSize="small" />
                <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                  Home
                </Typography>
              </Box>
            </Link>
            <Link to="/categories" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Category fontSize="small" />
                <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                  Categories
                </Typography>
              </Box>
            </Link>
            <Typography 
              variant="body2" 
              color="primary" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5,
                fontSize: { xs: '0.75rem', md: '0.875rem' },
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {category.name}
            </Typography>
          </Breadcrumbs>
        </Box>



        {/* Main Content */}
        <Grid container spacing={{ xs: 1, md: 2 }}>
          {/* Filters Sidebar - Desktop */}
          {!isMobile && (
            <Grid item xs={12} md={3}>
              <Box sx={{ position: 'sticky', top: 20 }}>
                {/* Filter Header */}
                <Card sx={{ 
                  mb: 2,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white'
                }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '50%',
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Tune sx={{ fontSize: '1.2rem' }} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Filters
                      </Typography>
                      {(selectedBrands.length > 0 || selectedRatings.length > 0 || priceRange[0] > 0 || priceRange[1] < 5000 || searchTerm) && (
                        <Button
                          size="small"
                          onClick={clearAllFilters}
                          sx={{
                            ml: 'auto',
                            color: 'white',
                            fontSize: '0.75rem',
                            textTransform: 'none',
                            '&:hover': {
                              background: 'rgba(255, 255, 255, 0.1)'
                            }
                          }}
                        >
                          Clear All
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>

                {/* Enhanced Filter Content */}
                <Card sx={{ 
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <CardContent sx={{ p: 0 }}>
                    <FilterContent />
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          )}

          {/* Products Grid */}
          <Grid item xs={12} md={isMobile ? 12 : 9}>
            {/* Sort and Results Header */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'stretch', sm: 'center' }, 
              justifyContent: 'space-between', 
              mb: 3,
              gap: { xs: 2, sm: 0 }
            }}>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.875rem', md: '0.875rem' } }}
              >
                Showing {sortedProducts.length} of {categoryProducts.length} products
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                flexDirection: { xs: 'column', sm: 'row' },
                width: { xs: '100%', sm: 'auto' }
              }}>
                <FormControl 
                  size="small" 
                  sx={{ 
                    minWidth: { xs: '100%', sm: 150 },
                    width: { xs: '100%', sm: 'auto' }
                  }}
                >
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
              <Grid container spacing={{ xs: 1, sm: 2, md: 2 }}>
                {Array.from({ length: 8 }).map((_, index) => (
                  <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
                    <Card sx={{ height: '100%', borderRadius: 2 }}>
                      <Skeleton variant="rectangular" height={160} sx={{ borderRadius: '8px 8px 0 0' }} />
                      <CardContent sx={{ p: 1.5 }}>
                        <Skeleton variant="text" height={20} sx={{ mb: 0.5 }} />
                        <Skeleton variant="text" height={16} sx={{ mb: 0.5 }} />
                        <Skeleton variant="text" height={14} />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : sortedProducts.length === 0 ? (
              <Box sx={{ 
                textAlign: 'center', 
                py: { xs: 6, md: 8 },
                backgroundColor: '#f8fafc',
                borderRadius: 2
              }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 2, 
                    color: '#6b7280',
                    fontSize: { xs: '1.1rem', md: '1.25rem' }
                  }}
                >
                  No products found
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 3,
                    fontSize: { xs: '0.875rem', md: '0.875rem' }
                  }}
                >
                  Try adjusting your filters or search terms
                </Typography>
                <Button 
                  variant="outlined" 
                  onClick={clearAllFilters}
                  sx={{ 
                    fontSize: { xs: '0.875rem', md: '0.875rem' },
                    px: { xs: 3, md: 2 }
                  }}
                >
                  Clear All Filters
                </Button>
              </Box>
            ) : (
              <Grid container spacing={{ xs: 1, sm: 2, md: 2 }}>
                {sortedProducts.map((product) => (
                  <Grid item xs={6} sm={4} md={3} lg={2} key={product.id}>
                    <Box sx={{ height: '100%' }}>
                      <ProductCard 
                        product={product} 
                        variant="compact"
                        onView={() => navigate(`/product/${product.id}`)}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>

        {/* Subcategories Section */}
        <Box sx={{ mt: { xs: 4, md: 6 } }}>
          <CategorySubcategories 
            categoryId={category.id}
            variant="chips"
            maxItems={8}
            showIcons={true}
          />
        </Box>
      </Container>

      {/* Mobile Filter FAB */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="filters"
          onClick={() => setFilterDrawerOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000
          }}
        >
          <Tune />
        </Fab>
      )}
    </>
  );
};

export default CategoryDetailPage;
