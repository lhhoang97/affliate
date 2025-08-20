import React, { useState, useMemo, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Rating,
  Checkbox,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Badge,
  LinearProgress
} from '@mui/material';
import { 
  FilterList, 
  ExpandMore, 
  Clear
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Product } from '../types';
import { fetchProducts } from '../services/productService';
import { useCart } from '../contexts/CartContext';
import SearchBar from '../components/SearchBar';
import QuickFilters from '../components/QuickFilters';
import ActiveFilters from '../components/ActiveFilters';
import CategoryBreadcrumb from '../components/CategoryBreadcrumb';
import SearchResults from '../components/SearchResults';
import CategoryNavigation from '../components/CategoryNavigation';

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();
  
  // Get category and search from URL parameters
  const categoryFromUrl = searchParams.get('category');
  const searchFromUrl = searchParams.get('search');
  
  // Data
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetchProducts()
      .then((items) => { if (isMounted) setAllProducts(items); })
      .finally(() => { if (isMounted) setIsLoading(false); });
    return () => { isMounted = false; };
  }, []);

  // Update search term when URL changes
  useEffect(() => {
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }
  }, [searchFromUrl]);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState(searchFromUrl || '');
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || '');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  const itemsPerPage = 12;

  // Get unique brands from products
  const uniqueBrands = useMemo(() => {
    const brands = Array.from(new Set(allProducts.map(product => product.brand)));
    return brands.sort();
  }, [allProducts]);

  // Get price range for slider
  const priceRangeData = useMemo(() => {
    if (allProducts.length === 0) return { min: 0, max: 5000 };
    const prices = allProducts.map(product => product.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, [allProducts]);

  // Filter and search products
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // Search by name, description, or brand
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by brands
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product => selectedBrands.includes(product.brand));
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Filter by rating
    if (ratingFilter > 0) {
      filtered = filtered.filter(product => product.rating >= ratingFilter);
    }

    // Filter by stock status
    if (inStockOnly) {
      filtered = filtered.filter(product => product.inStock);
    }

    // Filter by sale items
    if (onSaleOnly) {
      filtered = filtered.filter(product => product.originalPrice && product.originalPrice > product.price);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [allProducts, searchTerm, selectedCategory, selectedBrands, priceRange, ratingFilter, inStockOnly, onSaleOnly, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    if (product.externalUrl) {
      window.open(product.externalUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };



  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedBrands([]);
    setPriceRange([priceRangeData.min, priceRangeData.max]);
    setRatingFilter(0);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setSortBy('name');
    setCurrentPage(1);
  };

  const applyQuickFilter = (filters: any) => {
    if (filters.category) setSelectedCategory(filters.category);
    if (filters.brands) setSelectedBrands(filters.brands);
    if (filters.priceRange) setPriceRange(filters.priceRange);
    if (filters.rating) setRatingFilter(filters.rating);
    if (filters.inStockOnly !== undefined) setInStockOnly(filters.inStockOnly);
    if (filters.onSaleOnly !== undefined) setOnSaleOnly(filters.onSaleOnly);
    if (filters.sortBy) setSortBy(filters.sortBy);
    setCurrentPage(1);
  };

  const removeFilter = (filterType: string, value?: any) => {
    switch (filterType) {
      case 'search':
        setSearchTerm('');
        break;
      case 'category':
        setSelectedCategory('');
        break;
      case 'brand':
        setSelectedBrands(prev => prev.filter(brand => brand !== value));
        break;
      case 'price':
        setPriceRange([priceRangeData.min, priceRangeData.max]);
        break;
      case 'rating':
        setRatingFilter(0);
        break;
      case 'stock':
        setInStockOnly(false);
        break;
      case 'sale':
        setOnSaleOnly(false);
        break;
    }
    setCurrentPage(1);
  };

  const activeFiltersCount = [
    searchTerm,
    selectedCategory,
    selectedBrands.length,
    ratingFilter > 0,
    inStockOnly,
    onSaleOnly
  ].filter(Boolean).length;

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Category Navigation */}
      <CategoryNavigation 
        selectedCategory={selectedCategory}
        onCategorySelect={(categoryId) => {
          setSelectedCategory(categoryId);
          setCurrentPage(1);
        }}
      />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Category Breadcrumb */}
        {selectedCategory && (
          <CategoryBreadcrumb
            categoryName={selectedCategory}
            productCount={filteredProducts.length}
            onClear={() => setSelectedCategory('')}
          />
        )}
        
        <Typography variant="h3" component="h1" gutterBottom>
          {selectedCategory ? `${selectedCategory}` : 'Search Products'}
        </Typography>

      {/* Search Bar */}
      <Card sx={{ mb: 3, p: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={(query: string) => {
              setSearchTerm(query);
              setCurrentPage(1);
            }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            sx={{ minWidth: 120 }}
          >
            Filter
            {activeFiltersCount > 0 && (
              <Badge badgeContent={activeFiltersCount} color="primary" sx={{ ml: 1 }} />
            )}
          </Button>
          {activeFiltersCount > 0 && (
            <Tooltip title="Clear all filters">
              <IconButton onClick={clearAllFilters} color="error">
                <Clear />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Card>

      {/* Search Results */}
      <SearchResults
        searchTerm={searchTerm}
        resultCount={filteredProducts.length}
        totalCount={allProducts.length}
      />

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <Card sx={{ mb: 3 }}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Advanced Filters</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
                
                {/* Category Filter */}
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={selectedCategory}
                    label="Category"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {/* mockCategories is removed, so this will be empty or need to be fetched */}
                    {/* For now, assuming mockCategories is replaced by a dynamic list or removed */}
                    {/* If mockCategories is still needed, it should be re-imported or defined */}
                    {/* For now, leaving it empty as a placeholder */}
                  </Select>
                </FormControl>

                {/* Brand Filter */}
                <FormControl fullWidth>
                  <InputLabel>Brand</InputLabel>
                  <Select
                    multiple
                    value={selectedBrands}
                    label="Brand"
                    onChange={(e) => setSelectedBrands(e.target.value as string[])}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {uniqueBrands.map((brand) => (
                      <MenuItem key={brand} value={brand}>
                        <Checkbox checked={selectedBrands.indexOf(brand) > -1} />
                        {brand}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Sort By */}
                <FormControl fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort By"
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <MenuItem value="name">Product Name</MenuItem>
                    <MenuItem value="price-low">Price: Low to High</MenuItem>
                    <MenuItem value="price-high">Price: High to Low</MenuItem>
                    <MenuItem value="rating">Highest Rating</MenuItem>
                    <MenuItem value="newest">Newest</MenuItem>
                  </Select>
                </FormControl>

                {/* Price Range */}
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Price Range: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                  </Typography>
                  <Slider
                    value={priceRange}
                    onChange={(_, newValue) => setPriceRange(newValue as [number, number])}
                    valueLabelDisplay="auto"
                    min={priceRangeData.min}
                    max={priceRangeData.max}
                    step={10}
                  />
                </Box>

                {/* Rating Filter */}
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Đánh giá tối thiểu
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating
                      value={ratingFilter}
                      onChange={(_, newValue) => setRatingFilter(newValue || 0)}
                      precision={0.5}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {ratingFilter > 0 ? `${ratingFilter}+ stars` : 'All'}
                    </Typography>
                  </Box>
                </Box>

                {/* Quick Filters */}
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Quick Filters
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={inStockOnly}
                          onChange={(e) => setInStockOnly(e.target.checked)}
                        />
                      }
                      label="In Stock Only"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={onSaleOnly}
                          onChange={(e) => setOnSaleOnly(e.target.checked)}
                        />
                      }
                      label="On Sale Only"
                    />
                  </Box>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Card>
      )}

      {/* Active Filters */}
      <ActiveFilters
        filters={{
          searchTerm,
          selectedCategory,
          selectedBrands,
          priceRange,
          ratingFilter,
          inStockOnly,
          onSaleOnly
        }}
        onRemoveFilter={removeFilter}
        onClearAll={clearAllFilters}
      />

      {/* Quick Filters */}
      <QuickFilters onApplyFilter={applyQuickFilter} />

      {/* Results Count */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="body1" color="text.secondary">
                      Showing {filteredProducts.length} products
        </Typography>
        <Chip 
          icon={<FilterList />} 
          label={`${filteredProducts.length} results`} 
          variant="outlined" 
        />
      </Box>

      {/* Products Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(5, 1fr)', xl: 'repeat(6, 1fr)' }, gap: 2 }}>
        {paginatedProducts.map((product) => (
          <Card 
            key={product.id}
            sx={{ 
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              borderRadius: 1,
              border: '1px solid #e9ecef',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }
            }}
            onClick={() => handleProductClick(product.id)}
          >
            <Box sx={{ position: 'relative' }}>
              <CardMedia
                component="img"
                height="160"
                image={product.image}
                alt={product.name}
                sx={{ objectFit: 'cover' }}
              />
              {product.originalPrice && product.originalPrice > product.price && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    padding: '2px 6px',
                    borderRadius: '2px',
                    lineHeight: 1
                  }}
                >
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </Box>
              )}
              {!product.inStock && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography variant="h6" color="white" sx={{ fontWeight: 'bold' }}>
                    Out of Stock
                  </Typography>
                </Box>
              )}
            </Box>
            <CardContent sx={{ p: 2 }}>
              {/* Category Label */}
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#666',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  mb: 1
                }}
              >
                {product.category === 'Electronics' ? 'ĐIỆN THOẠI THÔNG MINH' : 
                 product.category === 'Fashion' ? 'THỜI TRANG' :
                 product.category === 'Home & Garden' ? 'NHÀ CỬA' :
                 product.category.toUpperCase()}
              </Typography>
              
              {/* Product Name */}
              <Typography 
                variant="body1" 
                component="h3" 
                sx={{ 
                  fontWeight: 'bold',
                  color: '#333',
                  fontSize: '14px',
                  lineHeight: 1.3,
                  mb: 1
                }}
              >
                {product.name}
              </Typography>
              
              {/* Color Variants - Horizontal Layout */}
              <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
                {product.category === 'Electronics' && product.name.toLowerCase().includes('iphone') ? (
                  // iPhone color variants - horizontal layout
                  <>
                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#000', border: '1px solid #ddd' }} />
                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#4CAF50', border: '1px solid #ddd' }} />
                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#FFEB3B', border: '1px solid #ddd' }} />
                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#9C27B0', border: '1px solid #ddd' }} />
                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#F44336', border: '1px solid #ddd' }} />
                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#fff', border: '1px solid #ddd' }} />
                  </>
                ) : product.category === 'Fashion' && product.name.toLowerCase().includes('nike') ? (
                  // Nike shoe color variants
                  <>
                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#F44336', border: '1px solid #ddd' }} />
                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#2196F3', border: '1px solid #ddd' }} />
                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#4CAF50', border: '1px solid #ddd' }} />
                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#FF9800', border: '1px solid #ddd' }} />
                  </>
                ) : (
                  // Default color variants for other products
                  <>
                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#2196F3', border: '1px solid #ddd' }} />
                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#F44336', border: '1px solid #ddd' }} />
                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#4CAF50', border: '1px solid #ddd' }} />
                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#FF9800', border: '1px solid #ddd' }} />
                  </>
                )}
              </Box>
              
              {/* Price */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: '#e74c3c',
                    fontSize: '16px'
                  }}
                >
                  ${product.price.toLocaleString()}
                </Typography>
                {product.originalPrice && product.originalPrice > product.price && (
                  <Typography
                    variant="body2"
                    sx={{ 
                      textDecoration: 'line-through',
                      color: '#999',
                      fontSize: '12px'
                    }}
                  >
                    ${product.originalPrice.toLocaleString()}
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          {/* Assuming Pagination component is available or needs to be imported */}
          {/* For now, leaving a placeholder */}
          {/* <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            color="primary"
            size="large"
          /> */}
        </Box>
      )}

      {filteredProducts.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No products found
          </Typography>
          <Typography variant="body2" color="text.secondary">
                          Try adjusting your search criteria or filters
          </Typography>
          <Button 
            variant="outlined" 
            onClick={clearAllFilters}
            sx={{ mt: 2 }}
          >
            Clear All Filters
          </Button>
        </Box>
      )}
      </Container>
    </Box>
  );
};

export default ProductsPage;
