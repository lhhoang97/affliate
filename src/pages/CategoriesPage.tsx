import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Tabs,
  Tab,
  Grid,
  Alert,
  Chip,
  Divider
} from '@mui/material';
import {
  Search,
  TrendingUp,
  Clear,
  Category,
  NewReleases,
  FilterList,
  Sort
} from '@mui/icons-material';

import { useProducts } from '../contexts/ProductContext';
import CategoryCard from '../components/CategoryCard';
import { fetchCategories } from '../services/productService';
import { Category as CategoryType } from '../types';
import { 
  categories as localCategories, 
  featuredCategories as localFeaturedCategories, 
  newCategories as localNewCategories, 
  updateCategoryProductCounts 
} from '../data/categories';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [dbCategories, setDbCategories] = useState<CategoryType[]>([]);
  const [dbLoading, setDbLoading] = useState(true);
  const { products, loading } = useProducts();

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

  // Use database categories if available, otherwise fall back to local categories
  const categories = dbCategories.length > 0 ? dbCategories : localCategories;

  // Update category product counts based on actual products
  const categoriesWithCounts = useMemo(() => {
    return updateCategoryProductCounts(products, categories);
  }, [products, categories]);

  const featuredCategoriesWithCounts = useMemo(() => {
    const featuredIds = localFeaturedCategories.map(fc => fc.id);
    return categoriesWithCounts.filter(c => featuredIds.includes(c.id));
  }, [categoriesWithCounts]);

  const newCategoriesWithCounts = useMemo(() => {
    const newIds = localNewCategories.map(nc => nc.id);
    return categoriesWithCounts.filter(c => newIds.includes(c.id));
  }, [categoriesWithCounts]);

  // Filter categories based on search term
  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return categoriesWithCounts;
    
    const searchLower = searchTerm.toLowerCase();
    return categoriesWithCounts.filter(category =>
      category.name.toLowerCase().includes(searchLower) ||
      category.description.toLowerCase().includes(searchLower) ||
      category.slug.toLowerCase().includes(searchLower)
    );
  }, [categoriesWithCounts, searchTerm]);

  const filteredFeaturedCategories = useMemo(() => {
    if (!searchTerm.trim()) return featuredCategoriesWithCounts;
    
    const searchLower = searchTerm.toLowerCase();
    return featuredCategoriesWithCounts.filter(category =>
      category.name.toLowerCase().includes(searchLower) ||
      category.description.toLowerCase().includes(searchLower) ||
      category.slug.toLowerCase().includes(searchLower)
    );
  }, [featuredCategoriesWithCounts, searchTerm]);

  const filteredNewCategories = useMemo(() => {
    if (!searchTerm.trim()) return newCategoriesWithCounts;
    
    const searchLower = searchTerm.toLowerCase();
    return newCategoriesWithCounts.filter(category =>
      category.name.toLowerCase().includes(searchLower) ||
      category.description.toLowerCase().includes(searchLower) ||
      category.slug.toLowerCase().includes(searchLower)
    );
  }, [newCategoriesWithCounts, searchTerm]);

  // Stats
  const totalCategories = categoriesWithCounts.length;
  const totalProducts = categoriesWithCounts.reduce((sum, cat) => sum + cat.productCount, 0);
  const featuredCount = featuredCategoriesWithCounts.length;
  const newCount = newCategoriesWithCounts.length;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Product Categories
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Explore diverse product categories with reviews and detailed information
        </Typography>
        
        {/* Stats */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#3b82f6' }}>
              {totalCategories}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Categories
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981' }}>
              {totalProducts.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Products
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b' }}>
              {featuredCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Featured
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Search and Filter */}
      <Box sx={{ mb: 4, p: 3, backgroundColor: '#f8fafc', borderRadius: 3 }}>
        <TextField
          fullWidth
          placeholder="Search categories by name, description, or keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: '#6b7280' }} />
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
          sx={{ 
            minWidth: 300,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white',
              '&:hover': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#3b82f6'
                }
              }
            }
          }}
        />
        
        {searchTerm && (
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Found {filteredCategories.length} categories matching "{searchTerm}"
            </Typography>
            <Chip 
              label="Clear search" 
              size="small" 
              onClick={() => setSearchTerm('')}
              sx={{ cursor: 'pointer' }}
            />
          </Box>
        )}
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs 
          value={selectedTab} 
          onChange={(_, newValue) => setSelectedTab(newValue)}
          sx={{
            '& .MuiTab-root': {
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem'
            }
          }}
        >
          <Tab label={`All Categories (${filteredCategories.length})`} />
          <Tab label={`Featured (${filteredFeaturedCategories.length})`} />
          <Tab label={`New (${filteredNewCategories.length})`} />
        </Tabs>
      </Box>

      {/* Categories Grid */}
      <TabPanel value={selectedTab} index={0}>
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '50vh',
            flexDirection: 'column',
            color: '#666'
          }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Loading categories...
            </Typography>
          </Box>
        ) : filteredCategories.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '50vh',
            flexDirection: 'column',
            color: '#666'
          }}>
            <Category sx={{ fontSize: 48, mb: 2, color: '#ccc' }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              No categories found
            </Typography>
            <Typography variant="body2">
              Try adjusting your search terms
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredCategories.map((category) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
                <CategoryCard 
                  category={category}
                  variant="default"
                  showProductCount={true}
                  showIcon={true}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      <TabPanel value={selectedTab} index={1}>
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '50vh',
            flexDirection: 'column',
            color: '#666'
          }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Loading featured categories...
            </Typography>
          </Box>
        ) : filteredFeaturedCategories.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '50vh',
            flexDirection: 'column',
            color: '#666'
          }}>
            <TrendingUp sx={{ fontSize: 48, mb: 2, color: '#ccc' }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              No featured categories found
            </Typography>
            <Typography variant="body2">
              Try adjusting your search terms
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredFeaturedCategories.map((category) => (
              <Grid item xs={12} sm={6} md={4} key={category.id}>
                <CategoryCard 
                  category={category}
                  variant="featured"
                  showProductCount={true}
                  showIcon={true}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      <TabPanel value={selectedTab} index={2}>
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '50vh',
            flexDirection: 'column',
            color: '#666'
          }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Loading new categories...
            </Typography>
          </Box>
        ) : filteredNewCategories.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '50vh',
            flexDirection: 'column',
            color: '#666'
          }}>
            <NewReleases sx={{ fontSize: 48, mb: 2, color: '#ccc' }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              No new categories found
            </Typography>
            <Typography variant="body2">
              Try adjusting your search terms
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredNewCategories.map((category) => (
              <Grid item xs={12} sm={6} md={4} key={category.id}>
                <CategoryCard 
                  category={category}
                  variant="new"
                  showProductCount={true}
                  showIcon={true}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>
    </Container>
  );
};

export default CategoriesPage;
