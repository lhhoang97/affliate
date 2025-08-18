import React, { useState, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  Rating,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Pagination,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  Switch,
  IconButton,
  Tooltip,
  Badge
} from '@mui/material';
import { 
  FilterList, 
  ExpandMore, 
  Clear
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { mockProducts, mockCategories } from '../utils/mockData';
import { useCart } from '../contexts/CartContext';
import SearchBar from '../components/SearchBar';
import QuickFilters from '../components/QuickFilters';
import ActiveFilters from '../components/ActiveFilters';

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
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
    const brands = Array.from(new Set(mockProducts.map(product => product.brand)));
    return brands.sort();
  }, []);

  // Get price range for slider
  const priceRangeData = useMemo(() => {
    const prices = mockProducts.map(product => product.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, []);

  // Filter and search products
  const filteredProducts = useMemo(() => {
    let filtered = mockProducts;

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
        case 'reviews':
          return b.reviewCount - a.reviewCount;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, selectedBrands, priceRange, ratingFilter, inStockOnly, onSaleOnly, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Tìm kiếm sản phẩm
      </Typography>

      {/* Search Bar */}
      <Card sx={{ mb: 3, p: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={(query) => {
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
            Bộ lọc
            {activeFiltersCount > 0 && (
              <Badge badgeContent={activeFiltersCount} color="primary" sx={{ ml: 1 }} />
            )}
          </Button>
          {activeFiltersCount > 0 && (
            <Tooltip title="Xóa tất cả bộ lọc">
              <IconButton onClick={clearAllFilters} color="error">
                <Clear />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Card>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <Card sx={{ mb: 3 }}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Bộ lọc nâng cao</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
                
                {/* Category Filter */}
                <FormControl fullWidth>
                  <InputLabel>Danh mục</InputLabel>
                  <Select
                    value={selectedCategory}
                    label="Danh mục"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <MenuItem value="">Tất cả danh mục</MenuItem>
                    {mockCategories.map((category) => (
                      <MenuItem key={category.id} value={category.name}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Brand Filter */}
                <FormControl fullWidth>
                  <InputLabel>Thương hiệu</InputLabel>
                  <Select
                    multiple
                    value={selectedBrands}
                    label="Thương hiệu"
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
                  <InputLabel>Sắp xếp theo</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sắp xếp theo"
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <MenuItem value="name">Tên sản phẩm</MenuItem>
                    <MenuItem value="price-low">Giá: Thấp đến cao</MenuItem>
                    <MenuItem value="price-high">Giá: Cao đến thấp</MenuItem>
                    <MenuItem value="rating">Đánh giá cao nhất</MenuItem>
                    <MenuItem value="reviews">Nhiều đánh giá nhất</MenuItem>
                    <MenuItem value="newest">Mới nhất</MenuItem>
                  </Select>
                </FormControl>

                {/* Price Range */}
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Khoảng giá: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
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
                      {ratingFilter > 0 ? `${ratingFilter}+ sao` : 'Tất cả'}
                    </Typography>
                  </Box>
                </Box>

                {/* Quick Filters */}
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Bộ lọc nhanh
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={inStockOnly}
                          onChange={(e) => setInStockOnly(e.target.checked)}
                        />
                      }
                      label="Chỉ sản phẩm có sẵn"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={onSaleOnly}
                          onChange={(e) => setOnSaleOnly(e.target.checked)}
                        />
                      }
                      label="Chỉ sản phẩm giảm giá"
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
          Hiển thị {filteredProducts.length} sản phẩm
        </Typography>
        <Chip 
          icon={<FilterList />} 
          label={`${filteredProducts.length} kết quả`} 
          variant="outlined" 
        />
      </Box>

      {/* Products Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
        {paginatedProducts.map((product) => (
          <Card 
            key={product.id}
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4
              }
            }}
            onClick={() => handleProductClick(product.id)}
          >
            <Box sx={{ position: 'relative' }}>
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.name}
                sx={{ objectFit: 'cover' }}
              />
              {product.originalPrice && product.originalPrice > product.price && (
                <Chip
                  label={`-${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%`}
                  color="error"
                  size="small"
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                />
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
                    Hết hàng
                  </Typography>
                </Box>
              )}
            </Box>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography gutterBottom variant="h6" component="h3" sx={{ 
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}>
                {product.name}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                {product.description.substring(0, 80)}...
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={product.rating} precision={0.1} readOnly size="small" />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  ({product.reviewCount})
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                  ${product.price.toLocaleString()}
                </Typography>
                {product.originalPrice && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textDecoration: 'line-through' }}
                  >
                    ${product.originalPrice.toLocaleString()}
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                <Chip label={product.category} size="small" variant="outlined" />
                <Chip label={product.brand} size="small" variant="outlined" />
              </Box>

              <Button
                variant="contained"
                fullWidth
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
                disabled={!product.inStock}
              >
                {product.inStock ? 'Thêm vào giỏ' : 'Hết hàng'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            color="primary"
            size="large"
          />
        </Box>
      )}

      {filteredProducts.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Không tìm thấy sản phẩm
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hãy thử điều chỉnh tiêu chí tìm kiếm hoặc bộ lọc
          </Typography>
          <Button 
            variant="outlined" 
            onClick={clearAllFilters}
            sx={{ mt: 2 }}
          >
            Xóa tất cả bộ lọc
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default ProductsPage;
