import React, { useState, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import {
  Search,
  TrendingUp,
  Star,
  ShoppingCart,
  FilterList,
  Clear,
  Category,
  Inventory,
  NewReleases
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { mockCategories, mockProducts } from '../utils/mockData';
import { useCart } from '../contexts/CartContext';

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
      id={`categories-tabpanel-${index}`}
      aria-labelledby={`categories-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const CategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [sortBy, setSortBy] = useState<'name' | 'products' | 'popular'>('popular');

  // Calculate real product counts for each category
  const categoriesWithRealCounts = useMemo(() => {
    return mockCategories.map(category => ({
      ...category,
      productCount: mockProducts.filter(product => product.category === category.name).length,
      averageRating: (() => {
        const products = mockProducts.filter(product => product.category === category.name);
        if (products.length === 0) return 0;
        return products.reduce((sum, product) => sum + product.rating, 0) / products.length;
      })(),
      totalReviews: (() => {
        const products = mockProducts.filter(product => product.category === category.name);
        return products.reduce((sum, product) => sum + product.reviewCount, 0);
      })(),
      priceRange: (() => {
        const products = mockProducts.filter(product => product.category === category.name);
        if (products.length === 0) return { min: 0, max: 0 };
        const prices = products.map(p => p.price);
        return {
          min: Math.min(...prices),
          max: Math.max(...prices)
        };
      })()
    }));
  }, []);

  // Filter and sort categories
  const filteredCategories = useMemo(() => {
    let filtered = categoriesWithRealCounts;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort categories
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'products':
          return b.productCount - a.productCount;
        case 'popular':
        default:
          return b.totalReviews - a.totalReviews;
      }
    });

    return filtered;
  }, [categoriesWithRealCounts, searchTerm, sortBy]);

  const handleCategoryClick = (category: any) => {
    navigate(`/products?category=${encodeURIComponent(category.name)}`);
  };

  const handleQuickView = (category: any) => {
    // Navigate to products page with category filter
    navigate(`/products?category=${encodeURIComponent(category.name)}`);
  };

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case 'electronics':
        return <TrendingUp />;
      case 'fashion':
        return <NewReleases />;
      case 'home & garden':
        return <Inventory />;
      case 'sports':
        return <Star />;
      case 'books':
        return <Category />;
      case 'beauty':
        return <NewReleases />;
      case 'toys & games':
        return <Category />;
      case 'automotive':
        return <TrendingUp />;
      default:
        return <Category />;
    }
  };

  const getCategoryColor = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case 'electronics':
        return 'primary';
      case 'fashion':
        return 'secondary';
      case 'home & garden':
        return 'success';
      case 'sports':
        return 'warning';
      case 'books':
        return 'info';
      case 'beauty':
        return 'secondary';
      case 'toys & games':
        return 'success';
      case 'automotive':
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Danh mục sản phẩm
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Khám phá các danh mục sản phẩm đa dạng với đánh giá và thông tin chi tiết
        </Typography>
      </Box>

      {/* Search and Filter */}
      <Card sx={{ mb: 4, p: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            fullWidth
            placeholder="Tìm kiếm danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearchTerm('')}
                    edge="end"
                  >
                    <Clear />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300 }}
          />
          
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setSortBy(sortBy === 'popular' ? 'products' : sortBy === 'products' ? 'name' : 'popular')}
          >
            {sortBy === 'popular' ? 'Phổ biến' : sortBy === 'products' ? 'Số sản phẩm' : 'Tên A-Z'}
          </Button>
        </Box>
      </Card>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={selectedTab} onChange={(_, newValue) => setSelectedTab(newValue)}>
          <Tab label="Tất cả danh mục" />
          <Tab label="Danh mục nổi bật" />
          <Tab label="Danh mục mới" />
        </Tabs>
      </Box>

      {/* Categories Grid */}
      <TabPanel value={selectedTab} index={0}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
          {filteredCategories.map((category) => (
            <Card
              key={category.id}
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
              onClick={() => handleCategoryClick(category)}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={category.image}
                  alt={category.name}
                  sx={{ objectFit: 'cover' }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    p: 2
                  }}
                >
                  <Chip
                    icon={getCategoryIcon(category.name)}
                    label={category.name}
                    color={getCategoryColor(category.name) as any}
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>
              </Box>
              
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  {category.name}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                  {category.description}
                </Typography>

                {/* Stats */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      {category.productCount}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Sản phẩm
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="secondary" fontWeight="bold">
                      {category.averageRating.toFixed(1)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Đánh giá
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="success.main" fontWeight="bold">
                      {category.totalReviews}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Review
                    </Typography>
                  </Box>
                </Box>

                {/* Price Range */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Khoảng giá: ${category.priceRange.min.toLocaleString()} - ${category.priceRange.max.toLocaleString()}
                  </Typography>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategoryClick(category);
                    }}
                  >
                    Xem tất cả
                  </Button>
                  <Tooltip title="Xem nhanh">
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickView(category);
                      }}
                    >
                      <ShoppingCart />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </TabPanel>

      <TabPanel value={selectedTab} index={1}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
          {filteredCategories
            .filter(category => category.totalReviews > 100)
            .map((category) => (
              <Card
                key={category.id}
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
                onClick={() => handleCategoryClick(category)}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={category.image}
                    alt={category.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'warning.main',
                      color: 'white',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}
                  >
                    NỔI BẬT
                  </Box>
                </Box>
                
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {category.name}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                    {category.description}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Star sx={{ color: 'warning.main', mr: 0.5 }} />
                    <Typography variant="body2" fontWeight="bold">
                      {category.averageRating.toFixed(1)} ({category.totalReviews} đánh giá)
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategoryClick(category);
                    }}
                  >
                    Khám phá ngay
                  </Button>
                </CardContent>
              </Card>
            ))}
        </Box>
      </TabPanel>

      <TabPanel value={selectedTab} index={2}>
        <Alert severity="info" sx={{ mb: 3 }}>
          Các danh mục mới sẽ được cập nhật sớm nhất!
        </Alert>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
          {filteredCategories.slice(0, 3).map((category) => (
            <Card
              key={category.id}
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
              onClick={() => handleCategoryClick(category)}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={category.image}
                  alt={category.name}
                  sx={{ objectFit: 'cover' }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'success.main',
                    color: 'white',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}
                >
                  MỚI
                </Box>
              </Box>
              
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  {category.name}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                  {category.description}
                </Typography>

                <Button
                  variant="outlined"
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCategoryClick(category);
                  }}
                >
                  Xem chi tiết
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      </TabPanel>

      {/* Empty State */}
      {filteredCategories.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Không tìm thấy danh mục nào
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hãy thử điều chỉnh từ khóa tìm kiếm
          </Typography>
          <Button 
            variant="outlined" 
            onClick={() => setSearchTerm('')}
            sx={{ mt: 2 }}
          >
            Xóa bộ lọc
          </Button>
        </Box>
      )}

      {/* Stats Summary */}
      {filteredCategories.length > 0 && (
        <Box sx={{ mt: 6, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Thống kê tổng quan
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)' }, gap: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {filteredCategories.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Danh mục
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="secondary" fontWeight="bold">
                {filteredCategories.reduce((sum, cat) => sum + cat.productCount, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng sản phẩm
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {filteredCategories.reduce((sum, cat) => sum + cat.totalReviews, 0).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng đánh giá
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main" fontWeight="bold">
                {(filteredCategories.reduce((sum, cat) => sum + cat.averageRating, 0) / filteredCategories.length).toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đánh giá TB
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default CategoriesPage;
