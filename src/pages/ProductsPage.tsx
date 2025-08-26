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
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  TextField
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Product } from '../types';
import { fetchProducts } from '../services/productService';
import { useCart } from '../contexts/CartContext';

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

  // Update selectedCategory when URL changes
  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [guestCheckoutOpen, setGuestCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  const itemsPerPage = 12;

  // Filter products by category
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    return filtered;
  }, [allProducts, selectedCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
  };

  const handleGuestBuyNow = (product: Product) => {
    setSelectedProduct(product);
    setGuestCheckoutOpen(true);
  };

  const handleGuestCheckout = () => {
    if (!selectedProduct) return;
    
    // Validate guest info
    if (!guestInfo.name || !guestInfo.email || !guestInfo.phone) {
      alert('Please fill in all required information');
      return;
    }

    // Save guest info to localStorage
    localStorage.setItem('guestInfo', JSON.stringify(guestInfo));
    
    // Close dialog
    setGuestCheckoutOpen(false);
    
    // Open affiliate link
    if (selectedProduct.affiliateLink) {
      window.open(selectedProduct.affiliateLink, '_blank', 'noopener,noreferrer');
    } else if (selectedProduct.externalUrl) {
      window.open(selectedProduct.externalUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Fallback to default affiliate link
      const affiliateLink = `https://techmart.vn/product/${selectedProduct.id}?ref=shopwithus`;
      window.open(affiliateLink, '_blank', 'noopener,noreferrer');
    }
  };

  const handleGuestInfoChange = (field: string, value: string) => {
    setGuestInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };





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
      
      <Container maxWidth="lg" sx={{ py: 2 }}>












      {/* Products Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(4, 1fr)', xl: 'repeat(4, 1fr)' }, gap: 2 }}>
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
                {product.category === 'Electronics' ? 'SMARTPHONE' : 
                 product.category === 'Fashion' ? 'FASHION' :
                 product.category === 'Home & Garden' ? 'HOME & GARDEN' :
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
              
              {/* Retailer Information */}
              {product.retailer && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#3b82f6',
                    fontSize: '12px',
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
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
              
              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                  disabled={!product.inStock}
                  sx={{
                    flex: 1,
                    borderColor: '#007bff',
                    color: '#007bff',
                    '&:hover': {
                      borderColor: '#0056b3',
                      backgroundColor: '#f8f9fa'
                    },
                    '&:disabled': {
                      borderColor: '#ccc',
                      color: '#ccc'
                    }
                  }}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGuestBuyNow(product);
                  }}
                  disabled={!product.inStock}
                  sx={{
                    flex: 1,
                    backgroundColor: '#007bff',
                    '&:hover': {
                      backgroundColor: '#0056b3'
                    },
                    '&:disabled': {
                      backgroundColor: '#ccc'
                    }
                  }}
                >
                  Buy Now
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {/* Previous Button */}
            <Button
              variant="outlined"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              sx={{
                minWidth: 'auto',
                px: 2,
                py: 1,
                borderRadius: '8px',
                borderColor: '#007bff',
                color: '#007bff',
                '&:hover': {
                  borderColor: '#0056b3',
                  backgroundColor: '#f8f9fa'
                },
                '&:disabled': {
                  borderColor: '#ccc',
                  color: '#ccc'
                }
              }}
            >
              ←
            </Button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "contained" : "outlined"}
                onClick={() => setCurrentPage(page)}
                sx={{
                  minWidth: 'auto',
                  px: 2,
                  py: 1,
                  borderRadius: '8px',
                  backgroundColor: currentPage === page ? '#007bff' : 'transparent',
                  borderColor: currentPage === page ? '#007bff' : '#007bff',
                  color: currentPage === page ? 'white' : '#007bff',
                  '&:hover': {
                    backgroundColor: currentPage === page ? '#0056b3' : '#f8f9fa',
                    borderColor: '#0056b3'
                  }
                }}
              >
                Page {page}
              </Button>
            ))}

            {/* Next Button */}
            <Button
              variant="outlined"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              sx={{
                minWidth: 'auto',
                px: 2,
                py: 1,
                borderRadius: '8px',
                borderColor: '#007bff',
                color: '#007bff',
                '&:hover': {
                  borderColor: '#0056b3',
                  backgroundColor: '#f8f9fa'
                },
                '&:disabled': {
                  borderColor: '#ccc',
                  color: '#ccc'
                }
              }}
            >
              →
            </Button>
          </Box>
        </Box>
      )}

      {filteredProducts.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No products found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try selecting a different category
          </Typography>
        </Box>
      )}
      </Container>

      {/* Guest Checkout Dialog */}
      <Dialog 
        open={guestCheckoutOpen} 
        onClose={() => setGuestCheckoutOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Quick Checkout
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enter your information to proceed to the seller's website
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {selectedProduct && (
              <>
                <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                  Product: {selectedProduct.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Price: ${selectedProduct.price.toLocaleString()}
                </Typography>
              </>
            )}
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom fontWeight="medium">
              Contact Information
            </Typography>
            
            <TextField
              fullWidth
              label="Full Name *"
              value={guestInfo.name}
              onChange={(e) => handleGuestInfoChange('name', e.target.value)}
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              label="Email Address *"
              type="email"
              value={guestInfo.email}
              onChange={(e) => handleGuestInfoChange('email', e.target.value)}
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              label="Phone Number *"
              value={guestInfo.phone}
              onChange={(e) => handleGuestInfoChange('phone', e.target.value)}
              margin="normal"
              required
            />
            
            <Box sx={{ mt: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Note:</strong> You will be redirected to the seller's website to complete your purchase. 
                Your information will be used to pre-fill the checkout form on their website.
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setGuestCheckoutOpen(false)}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleGuestCheckout}
            variant="contained"
            sx={{ backgroundColor: '#007bff', '&:hover': { backgroundColor: '#0056b3' } }}
          >
            Continue to Checkout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductsPage;
