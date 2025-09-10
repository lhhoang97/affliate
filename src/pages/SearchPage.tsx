import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  Rating,
  CircularProgress,
  Grid,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  FormControlLabel,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Divider,
  Alert
} from '@mui/material';
import {
  Search,
  Menu as MenuIcon,
  ExpandMore,
  FilterList,
  Clear,
  Sort,
  Category,
  Store,
  Star,
  LocalOffer,
  Inventory
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';

import SearchBar from '../components/SearchBar';
import SmartLink from '../components/SmartLink';
import Logo from '../components/Logo';
import { Product } from '../types';
import { useProducts } from '../contexts/ProductContext';

interface FilterState {
  category: string;
  brands: string[];
  priceRange: [number, number];
  rating: number;
  inStockOnly: boolean;
  onSaleOnly: boolean;
  sortBy: string;
}

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const navigate = useNavigate();
  const { products } = useProducts();
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    brands: [],
    priceRange: [0, 5000],
    rating: 0,
    inStockOnly: false,
    onSaleOnly: false,
    sortBy: 'relevance'
  });

  // Recent searches from localStorage
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  });

  // Trending searches
  const trendingSearches = [
    'iPhone', 'Samsung', 'Laptop', 'Headphones', 
    'Gaming', 'Fitness', 'Home Decor', 'Books'
  ];

  // Get unique categories and brands from products
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map(p => p.category)));
    return uniqueCategories.sort();
  }, [products]);

  const brands = useMemo(() => {
    const uniqueBrands = Array.from(new Set(products.map(p => p.brand)));
    return uniqueBrands.sort();
  }, [products]);

  // Filter and sort products
  const filteredAndSortedResults = useMemo(() => {
    let filtered = searchResults;

    // Apply filters
    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    if (filters.brands.length > 0) {
      filtered = filtered.filter(p => filters.brands.includes(p.brand));
    }

    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 5000) {
      filtered = filtered.filter(p => 
        p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
      );
    }

    if (filters.rating > 0) {
      filtered = filtered.filter(p => p.rating >= filters.rating);
    }

    if (filters.inStockOnly) {
      filtered = filtered.filter(p => p.inStock);
    }

    if (filters.onSaleOnly) {
      filtered = filtered.filter(p => p.originalPrice && p.originalPrice > p.price);
    }

    // Sort results
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
        break;
      default: // relevance
        // Keep original order for relevance
        break;
    }

    return filtered;
  }, [searchResults, filters]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Add to recent searches
      const newRecentSearches = [
        query.trim(),
        ...recentSearches.filter(s => s !== query.trim())
      ].slice(0, 10);
      setRecentSearches(newRecentSearches);
      localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
      
      // Navigate to search results
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleFilterChange = (filterType: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      category: '',
      brands: [],
      priceRange: [0, 5000],
      rating: 0,
      inStockOnly: false,
      onSaleOnly: false,
      sortBy: 'relevance'
    });
  };

  // Search logic
  useEffect(() => {
    if (searchTerm) {
      setIsSearching(true);
      
      // Simulate search delay
      const timer = setTimeout(() => {
        const query = searchTerm.toLowerCase();
        const results = products.filter(product => 
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.tags.some(tag => tag.toLowerCase().includes(query))
        );
        
        setSearchResults(results);
        setIsSearching(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchTerm, products]);

  return (
    <Box sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header with Search */}
      <Box sx={{ backgroundColor: 'white', borderBottom: '1px solid #e9ecef', py: 2 }}>
        <Container maxWidth="xl">
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            width: '100%'
          }}>
            {/* Left side: Hamburger menu */}
            <IconButton sx={{ color: '#333' }}>
              <MenuIcon />
            </IconButton>
            
            {/* Center: Logo */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Logo variant="mobile" />
            </Box>
            
            {/* Right side: Search bar */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              flex: 1,
              maxWidth: { xs: '100%', md: 500 },
              mx: { xs: 1, md: 2 }
            }}>
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                onSearch={handleSearch}
                placeholder="Search products..."
                showSuggestions={true}
                recentSearches={recentSearches}
                trendingSearches={trendingSearches}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 0 }}>
        <Box sx={{ 
          display: 'flex', 
          minHeight: 'calc(100vh - 80px)',
          flexDirection: 'column'
        }}>
          {/* Main Content */}
          <Box sx={{ 
            flex: 1, 
            p: { xs: 2, md: 3 },
            width: '100%'
          }}>
            {searchTerm ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ color: '#333' }}>
                    Search results for "{searchTerm}" ({filteredAndSortedResults.length} found)
                    {isSearching && (
                      <CircularProgress size={16} sx={{ ml: 2 }} />
                    )}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<FilterList />}
                      onClick={() => setShowFilters(!showFilters)}
                      size="small"
                    >
                      Filters
                    </Button>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Sort by</InputLabel>
                      <Select
                        value={filters.sortBy}
                        label="Sort by"
                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                      >
                        <MenuItem value="relevance">Relevance</MenuItem>
                        <MenuItem value="price-low">Price: Low to High</MenuItem>
                        <MenuItem value="price-high">Price: High to Low</MenuItem>
                        <MenuItem value="rating">Rating</MenuItem>
                        <MenuItem value="newest">Newest</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>

                {/* Filters Panel */}
                {showFilters && (
                  <Card sx={{ mb: 3, p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">Filters</Typography>
                      <Button
                        variant="outlined"
                        startIcon={<Clear />}
                        onClick={clearAllFilters}
                        size="small"
                      >
                        Clear All
                      </Button>
                    </Box>
                    
                    <Grid container spacing={2}>
                      {/* Category Filter */}
                      <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Category</InputLabel>
                          <Select
                            value={filters.category}
                            label="Category"
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                          >
                            <MenuItem value="">All Categories</MenuItem>
                            {categories.map(category => (
                              <MenuItem key={category} value={category}>
                                {category}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      {/* Brand Filter */}
                      <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Brand</InputLabel>
                          <Select
                            multiple
                            value={filters.brands}
                            label="Brand"
                            onChange={(e) => handleFilterChange('brands', e.target.value)}
                            renderValue={(selected) => (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                  <Chip key={value} label={value} size="small" />
                                ))}
                              </Box>
                            )}
                          >
                            {brands.map(brand => (
                              <MenuItem key={brand} value={brand}>
                                {brand}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      {/* Price Range */}
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body2" gutterBottom>
                          Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                        </Typography>
                        <Slider
                          value={filters.priceRange}
                          onChange={(_, newValue) => handleFilterChange('priceRange', newValue)}
                          valueLabelDisplay="auto"
                          min={0}
                          max={5000}
                          step={50}
                        />
                      </Grid>

                      {/* Rating Filter */}
                      <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Minimum Rating</InputLabel>
                          <Select
                            value={filters.rating}
                            label="Minimum Rating"
                            onChange={(e) => handleFilterChange('rating', e.target.value)}
                          >
                            <MenuItem value={0}>Any Rating</MenuItem>
                            <MenuItem value={1}>1+ Stars</MenuItem>
                            <MenuItem value={2}>2+ Stars</MenuItem>
                            <MenuItem value={3}>3+ Stars</MenuItem>
                            <MenuItem value={4}>4+ Stars</MenuItem>
                            <MenuItem value={5}>5 Stars</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      {/* Checkboxes */}
                      <Grid item xs={12}>
                        <Stack direction="row" spacing={2}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={filters.inStockOnly}
                                onChange={(e) => handleFilterChange('inStockOnly', e.target.checked)}
                              />
                            }
                            label="In Stock Only"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={filters.onSaleOnly}
                                onChange={(e) => handleFilterChange('onSaleOnly', e.target.checked)}
                              />
                            }
                            label="On Sale Only"
                          />
                        </Stack>
                      </Grid>
                    </Grid>
                  </Card>
                )}
                {isSearching ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : filteredAndSortedResults.length > 0 ? (
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { 
                      xs: '1fr', 
                      sm: 'repeat(2, 1fr)', 
                      md: 'repeat(3, 1fr)', 
                      lg: 'repeat(4, 1fr)' 
                    }, 
                    gap: { xs: 1.5, md: 2 }
                  }}>
                    {filteredAndSortedResults.map((product) => (
                      <SmartLink 
                        key={product.id}
                        to={`/product/${product.id}`}
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        <Card
                          sx={{ 
                            height: '100%',
                            cursor: 'pointer',
                            '&:hover': {
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                            }
                          }}
                        >
                        <CardMedia
                          component="img"
                          height="180"
                          image={product.image}
                          alt={product.name}
                          sx={{ 
                            objectFit: 'cover',
                            height: { xs: 140, sm: 160, md: 180 }
                          }}
                        />
                        <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
                          <Typography variant="body2" sx={{ 
                            fontWeight: 500,
                            mb: 1,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {product.name}
                          </Typography>
                          
                          {/* Retailer Information */}
                          {product.retailer && (
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: '#3b82f6',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                mb: 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5
                              }}
                            >
                              🏪 {product.retailer}
                            </Typography>
                          )}
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Rating value={product.rating} size="small" readOnly />
                            <Typography variant="caption" sx={{ ml: 0.5, color: '#666' }}>
                              ({product.reviewCount || 0})
                            </Typography>
                          </Box>
                          <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                            ${product.price}
                          </Typography>
                          {product.originalPrice && (
                            <Typography variant="body2" sx={{ 
                              textDecoration: 'line-through',
                              color: '#999',
                              fontSize: '12px'
                            }}>
                              ${product.originalPrice}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                      </SmartLink>
                    ))}
                  </Box>
                ) : (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '50vh',
                    flexDirection: 'column',
                    color: '#666'
                  }}>
                    <Search sx={{ fontSize: 48, mb: 2, color: '#ccc' }} />
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      No results found
                    </Typography>
                    <Typography variant="body2">
                      Try different keywords or browse our categories
                    </Typography>
                  </Box>
                )}
              </>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '50vh',
                flexDirection: 'column',
                color: '#666'
              }}>
                <Search sx={{ fontSize: 48, mb: 2, color: '#ccc' }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Search Products
                </Typography>
                <Typography variant="body2">
                  Enter keywords to search for products you want
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default SearchPage;
