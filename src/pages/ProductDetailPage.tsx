import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Breadcrumbs
} from '@mui/material';
import {
  Add,
  Remove,
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Share,
  LocalShipping,
  Verified,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ThumbUp,
  ThumbUpOutlined,
  ChatBubbleOutline,
  Visibility,
  BookmarkBorder,
  NavigateNext,
  Star
} from '@mui/icons-material';

import { useCart } from '../contexts/CartContext';
import { useProducts } from '../contexts/ProductContext';
import { Product, Review } from '../types';

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

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { products, loading, refreshProducts } = useProducts();
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(27);
  const [comments, setComments] = useState(15);
  const [views, setViews] = useState(9995);
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [imageKey, setImageKey] = useState(Date.now());
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get product from context
  const product = products.find(p => p.id === id) || null;

  // Debug logging
  useEffect(() => {
    console.log('ProductDetailPage - ID:', id);
    console.log('ProductDetailPage - Products:', products);
    console.log('ProductDetailPage - Found Product:', product);
    console.log('ProductDetailPage - Product Images:', product?.images);
    console.log('ProductDetailPage - Number of Images:', product?.images?.length || 0);
    console.log('ProductDetailPage - Selected Image Index:', selectedImage);
  }, [id, products, product, selectedImage]);

  // Reset selected image when product changes
  useEffect(() => {
    setSelectedImage(0);
    setImageKey(Date.now());
    // Force re-render by updating a timestamp
    console.log('ProductDetailPage - Product changed, resetting image selection and updating image key');
  }, [id, product?.updatedAt, product?.images]);

  // Validate selected image index
  useEffect(() => {
    if (product && product.images && selectedImage >= product.images.length) {
      console.log('ProductDetailPage - Selected image index out of bounds, resetting to 0');
      setSelectedImage(0);
    }
  }, [product, selectedImage]);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && product && product.images.length > 1) {
      autoPlayIntervalRef.current = setInterval(() => {
        setSelectedImage((prev) => (prev + 1) % product.images.length);
      }, 3000); // Change image every 3 seconds
    } else {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
        autoPlayIntervalRef.current = null;
      }
    }

    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    };
  }, [isAutoPlaying, product]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleGetDeal = () => {
    // Open affiliate link or external URL
    if (product?.externalUrl) {
      window.open(product.externalUrl, '_blank', 'noopener,noreferrer');
    } else if (product?.affiliateLink) {
      window.open(product.affiliateLink, '_blank', 'noopener,noreferrer');
    } else {
      // Fallback to a generic affiliate link
      const affiliateLink = `https://${product?.retailer?.toLowerCase().replace(/\s+/g, '')}.com/product/${product?.id}?ref=shopwithus`;
      window.open(affiliateLink, '_blank', 'noopener,noreferrer');
    }
  };

  const handleGalleryMouseEnter = () => {
    if (product && product.images.length > 1) {
      setIsAutoPlaying(true);
    }
  };

  const handleGalleryMouseLeave = () => {
    setIsAutoPlaying(false);
  };

  const discountPercentage = product && product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">Loading product...</Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Product not found</Alert>
      </Container>
    );
  }

  return (
    <Container 
      key={`product-${id}-${product?.updatedAt || Date.now()}`}
      maxWidth="lg" 
      sx={{ 
        py: 2,
        '@keyframes pulse': {
          '0%': {
            opacity: 1,
          },
          '50%': {
            opacity: 0.5,
          },
          '100%': {
            opacity: 1,
          },
        },
      }}
    >
      {/* Breadcrumbs */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Breadcrumbs 
          separator={<NavigateNext fontSize="small" />} 
          sx={{ color: '#6b7280' }}
        >
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography variant="body2">ShopWithUs</Typography>
          </Link>
          <Link to="/deals" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography variant="body2">Forums</Typography>
          </Link>
          <Typography variant="body2" color="primary">Hot Deals</Typography>
        </Breadcrumbs>
        

      </Box>

      {/* Main Deal Card */}
      <Card sx={{ mb: 3, border: '1px solid #e5e7eb' }}>
        <CardContent sx={{ p: 0 }}>
          {/* Product Content - Images Left, Deal Info Right */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
            gap: 4,
            p: 3
          }}>
            {/* Left Side - Product Images Gallery */}
            <Box
              onMouseEnter={handleGalleryMouseEnter}
              onMouseLeave={handleGalleryMouseLeave}
            >
              {/* Main Image */}
              <Box sx={{ 
                position: 'relative', 
                mb: 3,
                backgroundColor: '#f8f9fa',
                borderRadius: 2,
                overflow: 'hidden',
                minHeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CardMedia
                  component="img"
                  image={`${product.images[selectedImage]}?t=${imageKey}`}
                  alt={product.name}
                  sx={{ 
                    objectFit: 'contain',
                    maxHeight: 500,
                    maxWidth: '100%',
                    width: 'auto',
                    height: 'auto',
                    transition: 'all 0.3s ease-in-out'
                  }}
                />
                
                {/* Image Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <IconButton
                      onClick={() => setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)}
                      sx={{
                        position: 'absolute',
                        left: 16,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
                        zIndex: 2
                      }}
                    >
                      <ChevronLeft />
                    </IconButton>
                    <IconButton
                      onClick={() => setSelectedImage((prev) => (prev + 1) % product.images.length)}
                      sx={{
                        position: 'absolute',
                        right: 16,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
                        zIndex: 2
                      }}
                    >
                      <ChevronRight />
                    </IconButton>
                  </>
                )}
                
                {/* Image Counter */}
                {product.images.length > 1 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    {selectedImage + 1} / {product.images.length}
                    {isAutoPlaying && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: '#10b981',
                          animation: 'pulse 1s infinite'
                        }}
                      />
                    )}
                  </Box>
                )}
              </Box>
              
              {/* Thumbnail Images - Horizontal Row */}
              {product.images.length > 1 && (
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1, 
                  justifyContent: 'center',
                  overflowX: 'auto',
                  pb: 1
                }}>
                  {product.images.map((image, index) => (
                    <Box
                      key={index}
                      component="img"
                      src={`${image}?t=${imageKey}`}
                      alt={`${product.name} ${index + 1}`}
                      sx={{
                        width: 100,
                        height: 75,
                        objectFit: 'cover',
                        borderRadius: 1,
                        cursor: 'pointer',
                        border: selectedImage === index ? '3px solid #3b82f6' : hoveredImage === index ? '3px solid #3b82f6' : '2px solid #e5e7eb',
                        opacity: selectedImage === index ? 1 : hoveredImage === index ? 1 : 0.8,
                        transition: 'all 0.2s ease-in-out',
                        flexShrink: 0,
                        '&:hover': { 
                          opacity: 1,
                          borderColor: '#3b82f6',
                          transform: 'scale(1.05)',
                          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                        }
                      }}
                      onClick={() => setSelectedImage(index)}
                      onMouseEnter={() => {
                        setHoveredImage(index);
                        setSelectedImage(index);
                      }}
                      onMouseLeave={() => setHoveredImage(null)}
                    />
                  ))}
                </Box>
              )}
            </Box>

            {/* Right Side - Deal Information */}
            <Box>
              {/* Popular Badge */}
              <Chip 
                label="Popular" 
                color="error" 
                size="small"
                sx={{ fontWeight: 600, mb: 2 }}
              />

              {/* Poster and Date */}
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                ShopWithUs Staff posted {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </Typography>

              {/* Deal Title */}
                          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, mb: 2, lineHeight: 1.3 }}>
              {product.dealTitle || `${product.name} - $${product.price} + Free Shipping`}
            </Typography>

              {/* Pricing Section */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#1f2937' }}>
                  ${product.price}
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    textDecoration: 'line-through', 
                    color: '#dc2626',
                    fontWeight: 500
                  }}
                >
                  ${product.originalPrice}
                </Typography>
                <Chip 
                  label={`${discountPercentage}% off`} 
                  color="success" 
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </Box>

              {/* Interaction Stats */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton 
                    size="small" 
                    onClick={handleLike}
                    sx={{ color: isLiked ? '#3b82f6' : '#6b7280' }}
                  >
                    {isLiked ? <ThumbUp fontSize="small" /> : <ThumbUpOutlined fontSize="small" />}
                  </IconButton>
                  <Typography variant="body2" color="text.secondary">
                    {likes}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ChatBubbleOutline sx={{ fontSize: '1.2rem', color: '#6b7280' }} />
                  <Typography variant="body2" color="text.secondary">
                    {comments} Comments
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Visibility sx={{ fontSize: '1.2rem', color: '#6b7280' }} />
                  <Typography variant="body2" color="text.secondary">
                    {views.toLocaleString()} Views
                  </Typography>
                </Box>
              </Box>

              {/* Retailer Information */}
              {product.retailer && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2, 
                  mb: 3,
                  p: 2,
                  backgroundColor: '#f8f9fa',
                  borderRadius: 2,
                  border: '1px solid #e5e7eb'
                }}>
                  <LocalShipping sx={{ color: '#3b82f6', fontSize: '1.5rem' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
                      Nơi bán: {product.retailer}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Được bán và vận chuyển bởi {product.retailer}
                    </Typography>
                  </Box>
                  <Verified sx={{ color: '#10b981', ml: 'auto' }} />
                </Box>
              )}

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleGetDeal}
                  sx={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    '&:hover': { backgroundColor: '#2563eb' }
                  }}
                >
                  Mua tại {product.retailer || 'Nhà bán'}
                </Button>
                <IconButton onClick={handleShare} sx={{ color: '#6b7280' }}>
                  <Share />
                </IconButton>
                <IconButton 
                  onClick={handleBookmark}
                  sx={{ color: isBookmarked ? '#3b82f6' : '#6b7280' }}
                >
                  <BookmarkBorder />
                </IconButton>
              </Box>

              {/* Product Description */}
              <Typography variant="body1" sx={{ mb: 3, color: '#6b7280', lineHeight: 1.6 }}>
                {product.dealDescription || product.description}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={selectedTab} 
            onChange={(e, newValue) => setSelectedTab(newValue)}
            sx={{
              '& .MuiTab-root': {
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem'
              }
            }}
          >
            <Tab label="Deal Details" />
            <Tab label="Community Notes" />
            <Tab label="About the Poster" />
          </Tabs>
        </Box>

        {/* Deal Details Tab */}
        <TabPanel value={selectedTab} index={0}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Chi tiết sản phẩm
            </Typography>
            
            {/* Retailer Information Section */}
            {product.retailer && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#3b82f6' }}>
                  🏪 Nơi bán hàng
                </Typography>
                <Box sx={{ 
                  p: 2, 
                  backgroundColor: '#f0f9ff', 
                  borderRadius: 2, 
                  border: '1px solid #bae6fd',
                  mb: 2
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
                    {product.retailer}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Nhà bán lẻ uy tín, đảm bảo chất lượng sản phẩm và dịch vụ vận chuyển
                  </Typography>
                </Box>
              </Box>
            )}
            
            <Typography variant="body1" sx={{ mb: 3 }}>
              {product.dealDescription || `${product.retailer || 'Nhà bán'} có ${product.name} với giá ${product.price}$ + Miễn phí vận chuyển`}
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Danh mục sản phẩm:
            </Typography>
            <Box sx={{ mb: 3 }}>
              {(product.dealCategories || [product.category, ...product.tags.slice(0, 2)]).map((category, index) => (
                <Chip 
                  key={index} 
                  label={category} 
                  sx={{ mr: 1, mb: 1 }} 
                />
              ))}
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Thông tin sản phẩm:
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                • <strong>Tên sản phẩm:</strong> {product.name}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                • <strong>Giá hiện tại:</strong> ${product.price}
              </Typography>
              {product.originalPrice && (
                <Typography variant="body1" sx={{ mb: 1 }}>
                  • <strong>Giá gốc:</strong> <span style={{ textDecoration: 'line-through' }}>${product.originalPrice}</span>
                </Typography>
              )}
              <Typography variant="body1" sx={{ mb: 1 }}>
                • <strong>Thương hiệu:</strong> {product.brand}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                • <strong>Đánh giá:</strong> {product.rating}/5 ({product.reviewCount} đánh giá)
              </Typography>
              {product.retailer && (
                <Typography variant="body1" sx={{ mb: 1 }}>
                  • <strong>Nơi bán:</strong> {product.retailer}
                </Typography>
              )}
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Key Features:
            </Typography>
            <Box>
              {(product.keyFeatures || product.features.slice(0, 5)).map((feature, index) => (
                <Typography key={index} variant="body1" sx={{ mb: 1 }}>
                  • {feature}
                </Typography>
              ))}
            </Box>
          </Box>
        </TabPanel>

        {/* Community Notes Tab */}
        <TabPanel value={selectedTab} index={1}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Community Notes
            </Typography>
            <Typography variant="body1" color="text.secondary">
              No community notes yet. Be the first to add a note!
            </Typography>
          </Box>
        </TabPanel>

        {/* About the Poster Tab */}
        <TabPanel value={selectedTab} index={2}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              About the Poster
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar sx={{ bgcolor: '#3b82f6' }}>SW</Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  ShopWithUs Staff
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Deal Curator
                </Typography>
              </Box>
            </Box>
            <Typography variant="body1" color="text.secondary">
              Our team of deal curators finds and verifies the best deals from trusted retailers to help you save money on quality products.
            </Typography>
          </Box>
        </TabPanel>
      </Card>
    </Container>
  );
};

export default ProductDetailPage;
