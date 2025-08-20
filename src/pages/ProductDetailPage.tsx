import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
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
  Tabs,
  Tab,
  TextField,
  Avatar,
  Alert,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  Add,
  Remove,
  ShoppingCart,
  Favorite,
  Share,
  LocalShipping,
  Verified,
  CheckCircle,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material';
import { mockProducts, mockReviews } from '../utils/mockData';
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
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// Mock price comparison data
const mockPriceComparison = [
  {
    id: 1,
    seller: 'ShopWithUs Official',
    price: 2990000,
    originalPrice: 3500000,
    shipping: 'Free',
    delivery: '1-2 days',
    rating: 4.8,
    reviewCount: 1247,
    verified: true,
    badge: 'Best Price',
    badgeColor: 'success' as const,
    features: ['Free Shipping', 'Official Warranty', '30-day Return'],
    affiliateLink: 'https://shopwithus.com/product/air-purifier?ref=official'
  },
  {
    id: 2,
    seller: 'TechMart Vietnam',
    price: 3150000,
    originalPrice: 3600000,
    shipping: 50000,
    delivery: '2-3 days',
    rating: 4.6,
    reviewCount: 892,
    verified: true,
    badge: 'Fast Delivery',
    badgeColor: 'info' as const,
    features: ['Fast Delivery', 'Extended Warranty'],
    affiliateLink: 'https://techmart.vn/product/air-purifier?ref=shopwithus'
  },
  {
    id: 3,
    seller: 'SmartHome Store',
    price: 3250000,
    originalPrice: 3700000,
    shipping: 'Free',
    delivery: '3-5 days',
    rating: 4.4,
    reviewCount: 567,
    verified: false,
    badge: 'New Seller',
    badgeColor: 'warning' as const,
    features: ['Free Shipping', 'Installation Service'],
    affiliateLink: 'https://smarthome.vn/product/air-purifier?ref=shopwithus'
  },
  {
    id: 4,
    seller: 'Electronics Hub',
    price: 3400000,
    originalPrice: 3800000,
    shipping: 75000,
    delivery: '1-3 days',
    rating: 4.7,
    reviewCount: 734,
    verified: true,
    badge: 'Premium Service',
    badgeColor: 'primary' as const,
    features: ['Premium Support', 'Free Installation'],
    affiliateLink: 'https://electronicshub.vn/product/air-purifier?ref=shopwithus'
  }
];

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [tabValue, setTabValue] = useState(0);
  const [selectedSeller, setSelectedSeller] = useState(mockPriceComparison[0]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();

  // Find product by ID
  const product = mockProducts.find(p => p.id === id);
  const productReviews = mockReviews.filter(r => r.productId === id);

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Product not found</Alert>
      </Container>
    );
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    addToCart(product as any, quantity);
    // Open affiliate link for the selected seller
    if (selectedSeller.affiliateLink) {
      window.open(selectedSeller.affiliateLink, '_blank', 'noopener,noreferrer');
    } else if ((product as any).externalUrl) {
      window.open((product as any).externalUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Fallback to default affiliate link
      const affiliateLink = `https://techmart.vn/product/${product.id}?ref=shopwithus`;
      window.open(affiliateLink, '_blank', 'noopener,noreferrer');
    }
  };

  // Image slider functions
  const allImages = [product.image, ...(product.images || [])].filter(Boolean);
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const averageRating = productReviews.length > 0
    ? productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length
    : product.rating;

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + 'đ';
  };

  const formatShipping = (shipping: string | number) => {
    if (shipping === 'Free') return 'Miễn phí';
    return formatPrice(shipping as number);
  };

  return (
    <Box sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Breadcrumb */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Home / Electronics / Air Purifiers / {product.name}
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
          {/* Product Images Slider */}
          <Box>
            <Card sx={{ borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
              {/* Main Image */}
              <Box sx={{ position: 'relative', height: 400 }}>
                <CardMedia
                  component="img"
                  height="400"
                  image={allImages[currentImageIndex]}
                  alt={`${product.name} ${currentImageIndex + 1}`}
                  sx={{ objectFit: 'cover' }}
                />
                
                {/* Navigation Arrows */}
                {allImages.length > 1 && (
                  <>
                    <IconButton
                      onClick={prevImage}
                      sx={{
                        position: 'absolute',
                        left: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' }
                      }}
                    >
                      <ChevronLeft />
                    </IconButton>
                    <IconButton
                      onClick={nextImage}
                      sx={{
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' }
                      }}
                    >
                      <ChevronRight />
                    </IconButton>
                  </>
                )}
                
                {/* Image Counter */}
                {allImages.length > 1 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      color: 'white',
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      fontSize: '0.875rem'
                    }}
                  >
                    {currentImageIndex + 1} / {allImages.length}
                  </Box>
                )}
              </Box>
              
              {/* Thumbnail Navigation */}
              {allImages.length > 1 && (
                <Box sx={{ p: 2, display: 'flex', gap: 1, overflowX: 'auto' }}>
                  {allImages.map((image, index) => (
                    <Box
                      key={index}
                      onClick={() => goToImage(index)}
                      sx={{
                        minWidth: 80,
                        height: 80,
                        cursor: 'pointer',
                        border: `2px solid ${currentImageIndex === index ? '#1976d2' : 'transparent'}`,
                        borderRadius: 1,
                        overflow: 'hidden',
                        '&:hover': { borderColor: '#1976d2' },
                        transition: 'border-color 0.2s'
                      }}
                    >
                      <img
                        src={image}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Card>
          </Box>

          {/* Product Info */}
          <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
              {product.name}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={averageRating} precision={0.1} readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({productReviews.length} reviews)
              </Typography>
            </Box>

            {/* Selected Seller Price */}
            <Card sx={{ mb: 3, p: 3, backgroundColor: '#fff', border: '2px solid #e3f2fd' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mr: 2 }}>
                  {formatPrice(selectedSeller.price)}
                </Typography>
                {selectedSeller.originalPrice && (
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ textDecoration: 'line-through' }}
                  >
                    {formatPrice(selectedSeller.originalPrice)}
                  </Typography>
                )}
                {selectedSeller.originalPrice && (
                  <Chip
                    label={`-${Math.round(((selectedSeller.originalPrice - selectedSeller.price) / selectedSeller.originalPrice) * 100)}%`}
                    color="error"
                    size="small"
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                  Seller: {selectedSeller.seller}
                </Typography>
                {selectedSeller.verified && (
                  <Verified sx={{ color: 'success.main', fontSize: 16 }} />
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocalShipping sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                  <Typography variant="body2" color="success.main">
                    {formatShipping(selectedSeller.shipping)}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Delivery: {selectedSeller.delivery}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<ShoppingCart />}
                  onClick={() => {
                    addToCart(product as any, quantity);
                  }}
                  disabled={!product.inStock}
                  sx={{ 
                    flex: 1,
                    borderColor: '#007bff',
                    color: '#007bff',
                    '&:hover': { 
                      borderColor: '#0056b3',
                      backgroundColor: '#f8f9fa'
                    }
                  }}
                >
                  Add to Cart
                </Button>
                
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCart />}
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  sx={{ 
                    flex: 1,
                    backgroundColor: '#007bff',
                    '&:hover': { backgroundColor: '#0056b3' }
                  }}
                >
                  Buy now from {selectedSeller.seller}
                </Button>
              </Box>
            </Card>

            {/* Features */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Key Features
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {product.features.map((feature, index) => (
                  <Chip 
                    key={index} 
                    label={feature} 
                    variant="outlined" 
                    size="small"
                    icon={<CheckCircle />}
                    sx={{ borderColor: '#007bff', color: '#007bff' }}
                  />
                ))}
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined" 
                startIcon={<Favorite />}
                sx={{ borderColor: '#007bff', color: '#007bff' }}
              >
                Yêu thích
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<Share />}
                sx={{ borderColor: '#007bff', color: '#007bff' }}
              >
                Chia sẻ
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Price Comparison Section */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50', mb: 3 }}>
            So sánh giá từ các người bán
          </Typography>
          
          <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Seller</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Shipping</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Delivery</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Rating</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockPriceComparison.map((seller) => (
                  <TableRow 
                    key={seller.id}
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: '#f8f9fa' },
                      backgroundColor: selectedSeller.id === seller.id ? '#e3f2fd' : 'inherit'
                    }}
                    onClick={() => setSelectedSeller(seller)}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {seller.seller}
                        </Typography>
                        {seller.verified && (
                          <Verified sx={{ color: 'success.main', fontSize: 16 }} />
                        )}
                        <Chip 
                          label={seller.badge} 
                          size="small" 
                          color={seller.badgeColor}
                          sx={{ fontSize: '0.7rem' }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#007bff' }}>
                          {formatPrice(seller.price)}
                        </Typography>
                        {seller.originalPrice && (
                          <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                            {formatPrice(seller.originalPrice)}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color={seller.shipping === 'Free' ? 'success.main' : 'text.secondary'}>
                        {formatShipping(seller.shipping)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {seller.delivery}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Rating value={seller.rating} size="small" readOnly />
                        <Typography variant="body2" color="text.secondary">
                          ({seller.reviewCount})
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSeller(seller);
                          // Open affiliate link
                          if (seller.affiliateLink) {
                            window.open(seller.affiliateLink, '_blank', 'noopener,noreferrer');
                          }
                        }}
                        sx={{ 
                          backgroundColor: '#007bff',
                          '&:hover': { backgroundColor: '#0056b3' }
                        }}
                      >
                        Visit Page
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Product Details Tabs */}
        <Box sx={{ mt: 6 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Description" />
              <Tab label="Specifications" />
              <Tab label={`Reviews (${productReviews.length})`} />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>
            <Typography variant="body1">
              This product offers outstanding quality and performance. Designed with the latest technology 
              to provide the best user experience. Whether you are a professional or regular user, 
              this product will meet all your needs and exceed your expectations.
            </Typography>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
              {Object.entries(product.specifications).map(([key, value]) => (
                <Box key={key}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="body2" color="text.secondary">
                      {key}
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {value}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            {productReviews.length === 0 ? (
              <Typography variant="body1" color="text.secondary">
                No reviews yet. Be the first to review this product!
              </Typography>
            ) : (
              <Box>
                {productReviews.map((review) => (
                  <Card key={review.id} sx={{ mb: 2, borderRadius: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar src={review.userAvatar} sx={{ mr: 2 }}>
                          {review.userName.charAt(0)}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {review.userName}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Rating value={review.rating} size="small" readOnly />
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                              {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                            </Typography>
                          </Box>
                        </Box>
                        {review.verified && (
                          <Chip label="Đã mua hàng" size="small" color="success" />
                        )}
                      </Box>
                      <Typography variant="h6" gutterBottom>
                        {review.title}
                      </Typography>
                      <Typography variant="body1">
                        {review.content}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </TabPanel>
        </Box>
      </Container>
    </Box>
  );
};

export default ProductDetailPage;
