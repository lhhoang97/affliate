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
  IconButton
} from '@mui/material';
import {
  Add,
  Remove,
  ShoppingCart,
  Favorite,
  Share
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

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [tabValue, setTabValue] = useState(0);
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
    addToCart(product, quantity);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const averageRating = productReviews.length > 0
    ? productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length
    : product.rating;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
        {/* Product Images */}
        <Box>
          <Card>
            <CardMedia
              component="img"
              height="400"
              image={product.image}
              alt={product.name}
              sx={{ objectFit: 'cover' }}
            />
            <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
              {product.images?.slice(0, 4).map((image, index) => (
                <CardMedia
                  key={index}
                  component="img"
                  height="80"
                  image={image}
                  alt={`${product.name} ${index + 1}`}
                  sx={{ 
                    width: 80, 
                    objectFit: 'cover', 
                    cursor: 'pointer',
                    border: '2px solid transparent',
                    '&:hover': { borderColor: 'primary.main' }
                  }}
                />
              ))}
            </Box>
          </Card>
        </Box>

        {/* Product Info */}
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {product.name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={averageRating} precision={0.1} readOnly />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({productReviews.length} reviews)
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
              ${product.price}
            </Typography>
            {product.originalPrice && (
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ textDecoration: 'line-through' }}
              >
                ${product.originalPrice}
              </Typography>
            )}
            {product.originalPrice && (
              <Chip
                label={`${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF`}
                color="error"
                size="small"
              />
            )}
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {product.description}
          </Typography>

          {/* Features */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Key Features
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {product.features.map((feature, index) => (
                <Chip key={index} label={feature} variant="outlined" size="small" />
              ))}
            </Box>
          </Box>

          {/* Stock Status */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color={product.inStock ? 'success.main' : 'error.main'}>
              {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
            </Typography>
          </Box>

          {/* Quantity and Add to Cart */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <IconButton
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                <Remove />
              </IconButton>
              <TextField
                value={quantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value > 0) {
                    setQuantity(value);
                  }
                }}
                sx={{ width: 60 }}
                inputProps={{ 
                  min: 1, 
                  style: { textAlign: 'center' },
                  'aria-label': 'quantity'
                }}
              />
              <IconButton onClick={() => handleQuantityChange(quantity + 1)}>
                <Add />
              </IconButton>
            </Box>
            
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCart />}
              onClick={handleAddToCart}
              disabled={!product.inStock}
              sx={{ flexGrow: 1 }}
            >
              Add to Cart
            </Button>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" startIcon={<Favorite />}>
              Add to Wishlist
            </Button>
            <Button variant="outlined" startIcon={<Share />}>
              Share
            </Button>
          </Box>
        </Box>
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
            This product offers exceptional quality and performance. It's designed with the latest technology 
            to provide the best user experience. Whether you're a professional or casual user, this product 
            will meet all your needs and exceed your expectations.
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
                <Card key={review.id} sx={{ mb: 2 }}>
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
                            {new Date(review.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                      {review.verified && (
                        <Chip label="Verified Purchase" size="small" color="success" />
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
  );
};

export default ProductDetailPage;
