import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  CloudDownload as ImportIcon,
  Sync as SyncIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  ShoppingBag as AmazonIcon,
  TrendingUp as StatsIcon
} from '@mui/icons-material';
import amazonService from '../services/amazonService';
import { supabase } from '../utils/supabaseClient';

interface AmazonProduct {
  id?: number;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  description: string;
  category: string;
  brand: string;
  rating?: number;
  reviewCount?: number;
  externalUrl: string;
  affiliateLink: string;
  retailer: string;
  source: string;
  asin: string;
  createdAt?: string;
}

interface ImportStats {
  searched: number;
  found: number;
  imported: number;
  errors: number;
}

const AdminAmazonPage: React.FC = () => {
  // Search state
  const [searchKeywords, setSearchKeywords] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Electronics');
  const [maxResults, setMaxResults] = useState(10);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Import state
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importStats, setImportStats] = useState<ImportStats>({ searched: 0, found: 0, imported: 0, errors: 0 });

  // Products state
  const [amazonProducts, setAmazonProducts] = useState<AmazonProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // UI state
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; message: string } | null>(null);

  // Categories
  const categories = amazonService.getAvailableCategories();

  const loadAmazonProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('source', 'amazon')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAmazonProducts(data || []);
    } catch (error) {
      console.error('Error loading Amazon products:', error);
      showAlert('error', 'Failed to load Amazon products');
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  const showAlert = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  useEffect(() => {
    loadAmazonProducts();
  }, [loadAmazonProducts]);

  const handleSearch = async () => {
    if (!searchKeywords.trim()) {
      showAlert('warning', 'Please enter search keywords');
      return;
    }

    setIsSearching(true);
    setSearchResults([]);
    
    try {
      const results = await amazonService.searchProducts(searchKeywords, selectedCategory, maxResults);
      setSearchResults(results);
      
      if (results.length === 0) {
        showAlert('info', 'No products found for your search');
      } else {
        showAlert('success', `Found ${results.length} products on Amazon`);
      }
    } catch (error) {
      console.error('Search error:', error);
      showAlert('error', 'Failed to search Amazon products. Check your API credentials.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleImportProducts = async () => {
    if (!searchKeywords.trim()) {
      showAlert('warning', 'Please enter search keywords for import');
      return;
    }

    setIsImporting(true);
    setImportProgress(0);
    setImportStats({ searched: 0, found: 0, imported: 0, errors: 0 });

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setImportProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const importedCount = await amazonService.importProductsToSupabase(
        searchKeywords, 
        selectedCategory, 
        maxResults
      );

      clearInterval(progressInterval);
      setImportProgress(100);

      setImportStats({
        searched: maxResults,
        found: searchResults.length || 0,
        imported: importedCount,
        errors: 0
      });

      showAlert('success', `Successfully imported ${importedCount} products to database`);
      await loadAmazonProducts(); // Refresh the products list

    } catch (error) {
      console.error('Import error:', error);
      showAlert('error', 'Failed to import products. Check your API credentials and database connection.');
      setImportStats(prev => ({ ...prev, errors: prev.errors + 1 }));
    } finally {
      setIsImporting(false);
      setTimeout(() => setImportProgress(0), 2000);
    }
  };

  const handleSyncProducts = async () => {
    showAlert('info', 'Sync functionality will be implemented in next update');
    // TODO: Implement product sync functionality
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      showAlert('success', 'Product deleted successfully');
      await loadAmazonProducts();
    } catch (error) {
      console.error('Delete error:', error);
      showAlert('error', 'Failed to delete product');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price / 100); // Assuming price is in cents
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <AmazonIcon sx={{ mr: 2, fontSize: 32, color: '#FF9900' }} />
        <Typography variant="h4" component="h1">
          Amazon Product Management
        </Typography>
      </Box>

      {/* Alert */}
      {alert && (
        <Alert severity={alert.type} sx={{ mb: 3 }} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      {/* Search & Import Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Search & Import Amazon Products
        </Typography>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search Keywords"
              value={searchKeywords}
              onChange={(e) => setSearchKeywords(e.target.value)}
              placeholder="e.g., iPhone 15, Samsung Galaxy"
              disabled={isSearching || isImporting}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                disabled={isSearching || isImporting}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              type="number"
              label="Max Results"
              value={maxResults}
              onChange={(e) => setMaxResults(parseInt(e.target.value) || 10)}
              inputProps={{ min: 1, max: 50 }}
              disabled={isSearching || isImporting}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                startIcon={isSearching ? <CircularProgress size={20} /> : <SearchIcon />}
                onClick={handleSearch}
                disabled={isSearching || isImporting}
                fullWidth
              >
                Search
              </Button>
              
              <Button
                variant="contained"
                startIcon={isImporting ? <CircularProgress size={20} /> : <ImportIcon />}
                onClick={handleImportProducts}
                disabled={isSearching || isImporting || searchResults.length === 0}
                fullWidth
              >
                Import
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Import Progress */}
        {isImporting && (
          <Box mt={2}>
            <Typography variant="body2" gutterBottom>
              Importing products... {importProgress}%
            </Typography>
            <LinearProgress variant="determinate" value={importProgress} />
          </Box>
        )}

        {/* Import Stats */}
        {(importStats.imported > 0 || importStats.errors > 0) && (
          <Box mt={2}>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Chip label={`Searched: ${importStats.searched}`} color="default" />
              </Grid>
              <Grid item xs={3}>
                <Chip label={`Found: ${importStats.found}`} color="info" />
              </Grid>
              <Grid item xs={3}>
                <Chip label={`Imported: ${importStats.imported}`} color="success" />
              </Grid>
              <Grid item xs={3}>
                <Chip label={`Errors: ${importStats.errors}`} color="error" />
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Search Results ({searchResults.length})
          </Typography>
          
          <Grid container spacing={2}>
            {searchResults.map((product, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.ASIN || index}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.images?.primary?.medium?.URL || '/placeholder-image.jpg'}
                    alt={product.title}
                    sx={{ objectFit: 'contain' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" gutterBottom noWrap>
                      {product.title}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {product.price?.displayAmount || 'N/A'}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1} mt={1}>
                      <Chip label={product.brand || 'Unknown'} size="small" />
                      {product.customerReviews && (
                        <Chip 
                          label={`${product.customerReviews.starRating?.value || 0}★`} 
                          size="small" 
                          color="warning" 
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Amazon Products Table */}
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            Amazon Products in Database ({amazonProducts.length})
          </Typography>
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              startIcon={<SyncIcon />}
              onClick={handleSyncProducts}
              disabled={isLoadingProducts}
            >
              Sync Prices
            </Button>
            <Button
              variant="outlined"
              startIcon={<StatsIcon />}
              onClick={loadAmazonProducts}
              disabled={isLoadingProducts}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        {isLoadingProducts ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Brand</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>ASIN</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {amazonProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          style={{ width: 50, height: 50, objectFit: 'contain' }}
                        />
                        <Box>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                            {product.name}
                          </Typography>
                          <Chip label="Amazon" size="small" color="warning" />
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell>{formatPrice(product.price)}</TableCell>
                    <TableCell>
                      {product.rating ? (
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2">
                            {product.rating}★
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ({product.reviewCount})
                          </Typography>
                        </Box>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>{product.asin}</TableCell>
                    <TableCell>
                      {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Tooltip title="View Product">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedProduct(product);
                              setShowProductDialog(true);
                            }}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Product">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => product.id && handleDeleteProduct(product.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Product Details Dialog */}
      <Dialog 
        open={showProductDialog} 
        onClose={() => setShowProductDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Product Details</DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <img 
                  src={selectedProduct.imageUrl} 
                  alt={selectedProduct.name}
                  style={{ width: '100%', maxHeight: 300, objectFit: 'contain' }}
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>
                  {selectedProduct.name}
                </Typography>
                <Typography variant="h5" color="primary" gutterBottom>
                  {formatPrice(selectedProduct.price)}
                </Typography>
                <Box display="flex" gap={1} mb={2}>
                  <Chip label={selectedProduct.category} />
                  <Chip label={selectedProduct.brand} />
                  <Chip label={`ASIN: ${selectedProduct.asin}`} />
                </Box>
                <Typography variant="body1" paragraph>
                  {selectedProduct.description}
                </Typography>
                <Box display="flex" gap={1}>
                  <Button
                    variant="contained"
                    href={selectedProduct.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Amazon
                  </Button>
                  <Button
                    variant="outlined"
                    href={selectedProduct.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Affiliate Link
                  </Button>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowProductDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminAmazonPage;
