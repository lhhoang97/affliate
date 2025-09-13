import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  Avatar,
  Divider,
  Grid,
  Paper,
  Stack,
  Alert,
  LinearProgress,
  Badge,
  AppBar,
  Toolbar
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Share,
  LocalShipping,
  Verified,
  CheckCircle,
  Security,
  Star,
  StarBorder,
  Timer,
  Visibility,
  People,
  TrendingUp,
  FlashOn,
  LocalOffer,
  AttachMoney,
  Add,
  Remove,
  ThumbUp,
  ThumbUpOutlined,
  Home,
  TrackChanges,
  ContactMail
} from '@mui/icons-material';

import { useCart } from '../contexts/CartContext';
import { useSimpleCart } from '../contexts/SimpleCartContext';
import { useCartSidebar } from '../contexts/CartSidebarContext';
import { useBusinessMode } from '../contexts/BusinessModeContext';
import { useProducts } from '../contexts/ProductContext';
import { Product } from '../types';
import { getProductById } from '../services/productService';
import LazyImage from '../components/LazyImage';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useSimpleCart();
  const { openCart } = useCartSidebar();
  const { products, loading } = useProducts();
  const { isAffiliateMode, isEcommerceMode, isHybridMode } = useBusinessMode();
  
  // State for hybrid model
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(1247);
  const [viewers, setViewers] = useState(5412);
  const [purchasers, setPurchasers] = useState(2346);
  const [timeLeft, setTimeLeft] = useState(783); // Total seconds (13:03)
  const [selectedBundle, setSelectedBundle] = useState(2); // Default to bundle 2 for testing
  const [isInStock, setIsInStock] = useState(true);
  
  // Loading states for buttons
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [isPayPalLoading, setIsPayPalLoading] = useState(false);

  // Get product from service (with fallback)
  const [product, setProduct] = useState<Product | null>(null);
  const [productLoading, setProductLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      if (id) {
        try {
          setProductLoading(true);
          const productData = await getProductById(id);
          setProduct(productData);
        } catch (error) {
          console.error('Error loading product:', error);
          setProduct(null);
        } finally {
          setProductLoading(false);
        }
      }
    };

    loadProduct();
  }, [id]);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time for display
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Handle bundle selection
  const handleBundleSelect = (bundle: any) => {
    setSelectedBundle(bundle.id);
  };

  // Get current bundle info
  const getCurrentBundle = () => {
    const basePrice = product?.price || 0;
    switch (selectedBundle) {
      case 2:
        return { quantity: 2, price: basePrice * 2 - 15, savings: 15 };
      case 3:
        return { quantity: 3, price: basePrice * 3 - 30, savings: 30 };
      default:
        return { quantity: 1, price: basePrice, savings: 0 };
    }
  };

  const customerReviews = [
    {
      id: 1,
      name: "Jim Newman",
      rating: 5,
      title: "Finally have energy & lost 60 pounds",
      content: "Before I started using the AirFlow Jaw Strap I was tired all the time, sleeping 10 hours a day and drinking 4 cups of coffee a day. I was 240 pounds and had breathing issues. After AirFlow, I had WAY MORE ENERGY. I stopped drinking caffeine and started working out everyday. I ran my first half marathon this year and lost 60 pounds. I'm still recovering but this jaw strap saved my life. I'm overall way happier",
      avatar: "JN",
      verified: true
    },
    {
      id: 2,
      name: "Jeanette Stewart",
      rating: 5,
      title: "I feel a MILLION times better!",
      content: "My brain fog went away, I no longer fall asleep while driving to work after 14 hours of sleep, and my husband sleeps better because I rarely snore now. My relationship with my husband has also never been better. I have a sex drive again after two years without. I can't imagine living without the AirFlow Jaw Strap!",
      avatar: "JS",
      verified: true
    },
    {
      id: 3,
      name: "Michael Perez",
      rating: 5,
      title: "Only thing that worked...",
      content: "I struggled for years with CPAP, waking up frequently and feeling worse than without it. Since using the Airflow Jaw Strap, my sleep has dramatically improved. I now wake up refreshed, and I feel a lot happier. The combination of CPAP and the Airflow Jaw Strap has truly transformed my sleep quality.",
      avatar: "MP",
      verified: true
    },
    {
      id: 4,
      name: "Ada Dodson",
      rating: 5,
      title: "Perfect fit and quality",
      content: "I tried another flimsy one first and it didn't stay on my head 2 seconds before slipping off. I'm petite and have a small head so I ordered the pink one. I just now took it out of the package and found it is fully adjustable and fits like a dream! I can already tell there's no way it will slip off in the night.",
      avatar: "AD",
      verified: true
    },
    {
      id: 5,
      name: "John Maisano",
      rating: 5,
      title: "It works well",
      content: "With this product, not only do I sleep a lot better, but the people around me no longer need to endure annoying snoring.",
      avatar: "JM",
      verified: true
    }
  ];

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const handleAddToCart = async () => {
    if (isInStock && product) {
      setIsAddingToCart(true);
      
      try {
        // Determine bundle type based on selected bundle
        const bundleType = selectedBundle === 1 ? 'single' : selectedBundle === 2 ? 'double' : 'triple';
        
        // Add to cart with bundle type
        if (product) {
          await addToCart(product.id!, quantity, bundleType);
          
          // Show success message
          console.log(`✅ Added ${bundleType} bundle of ${product.name} to cart!`);
        }
        
        // Open cart sidebar
        openCart();
        
        // Update purchasers count
        setPurchasers(prev => prev + 1);
        
      } catch (error) {
        console.error('Error adding to cart:', error);
        alert('❌ Failed to add to cart. Please try again.');
      } finally {
        setIsAddingToCart(false);
      }
    } else {
      alert('❌ Product is out of stock!');
    }
  };

  const handleBuyNow = async () => {
    if (product) {
      setIsBuyingNow(true);
      
      try {
        if (true) {
          // Open affiliate link in new tab
          const affiliateUrl = product?.affiliateLink || product?.externalUrl || `https://amazon.com/dp/${product?.id}`;
          window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
          
          // Track affiliate click
          console.log('Affiliate link clicked:', affiliateUrl);
          
          // Update purchasers count
          setPurchasers(prev => prev + 1);
          
    } else {
          // Direct purchase - redirect to checkout
          const bundle = getCurrentBundle();
          const totalQuantity = quantity * bundle.quantity;
          
          if (product?.id) {
            addToCart((product as Product).id, totalQuantity);
          }
          
          // Simulate processing
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Redirect to cart page
          window.location.href = '/cart';
        }
      } catch (error) {
        alert('❌ Purchase failed. Please try again.');
      } finally {
        setIsBuyingNow(false);
      }
    }
  };

  const handlePayPal = async () => {
    if (product) {
      setIsPayPalLoading(true);
      
      try {
        // PayPal Express Checkout
        const bundle = getCurrentBundle();
        const totalQuantity = quantity * bundle.quantity;
        const totalPrice = (bundle.price * quantity).toFixed(2);
        
        // Simulate PayPal processing
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Create PayPal payment URL
        if (product) {
          const paypalUrl = `https://www.paypal.com/checkoutnow?token=${product.id}&amount=${totalPrice}&quantity=${totalQuantity}`;
          
          // Open PayPal in new tab
          window.open(paypalUrl, '_blank', 'noopener,noreferrer');
          
          // Track PayPal click
          console.log('PayPal checkout initiated:', { product: product.name, quantity: totalQuantity, price: totalPrice });
        }
        
        // Update purchasers count
        setPurchasers(prev => prev + 1);
        
      } catch (error) {
        alert('❌ PayPal checkout failed. Please try again.');
      } finally {
        setIsPayPalLoading(false);
      }
    }
  };

  if (loading || productLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
          Loading product details...
        </Typography>
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

  const discountPercentage = product?.originalPrice ? 
    Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const selectedBundleOption = getCurrentBundle();

  return (
    <Box sx={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      {/* Header - Exactly like Louistores */}
      <AppBar 
        position="static" 
      sx={{ 
          backgroundColor: '#ffffff', 
          color: '#000000',
          boxShadow: 'none',
          borderBottom: '1px solid #e5e7eb'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Box sx={{ width: 20, height: 20, backgroundColor: '#ff69b4', borderRadius: '50%' }} />
              <Box sx={{ width: 20, height: 20, backgroundColor: '#00bfff', borderRadius: '50%' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#000000' }}>
              Louistores ONLINE STORE
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#000000' }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>Home</Typography>
            </Link>
            <Link to="/orders" style={{ textDecoration: 'none', color: '#000000' }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>Track My Order</Typography>
          </Link>
            <Link to="/contact" style={{ textDecoration: 'none', color: '#000000' }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>Contact Us</Typography>
          </Link>
      </Box>

          {/* Cart Icon */}
          <IconButton sx={{ color: '#000000' }}>
            <ShoppingCart />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Grid container spacing={4}>
          {/* Left Side - Product Images */}
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative' }}>
              {/* Main Product Image */}
              <Card sx={{ mb: 2, overflow: 'hidden', boxShadow: 'none', border: '1px solid #e5e7eb' }}>
                <LazyImage
                  src={product.image}
                  alt={product.name}
                  height={500}
                  loading="eager"
                  sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 600px"
                  sx={{ 
                    width: '100%',
                    height: 500,
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              </Card>

              {/* Thumbnail Images */}
              <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto' }}>
                {product.images?.slice(0, 4).map((image, index) => (
                    <LazyImage
                      key={index}
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={60}
                      loading="lazy"
                      sizes="80px"
                      sx={{
                        objectFit: 'cover',
                        borderRadius: 1,
                        cursor: 'pointer',
                        border: '2px solid #e5e7eb',
                        '&:hover': { borderColor: '#3b82f6' }
                      }}
                    />
                  ))}
                </Box>
            </Box>
          </Grid>

          {/* Right Side - Product Info & Purchase */}
          <Grid item xs={12} md={6}>
            {/* Sale Badge - Exact styling */}
              <Chip 
              icon={<FlashOn />}
              label="💥Last Day SALE 50% OFF💥"
              sx={{ 
                mb: 2, 
                fontWeight: 700, 
                fontSize: '0.9rem',
                backgroundColor: '#ff4444',
                color: '#ffffff',
                '& .MuiChip-icon': { color: '#ffffff' }
              }}
            />

            {/* Product Title */}
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, lineHeight: 1.2, color: '#000000' }}>
              {product.name}
            </Typography>

            {/* Pricing - Exact like Louistores */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#000000' }}>
                  ${product.price}
                </Typography>
              {product.originalPrice && (
                <Typography 
                  variant="h5" 
                  sx={{ 
                    textDecoration: 'line-through', 
                    color: '#666666',
                    fontWeight: 500
                  }}
                >
                  ${product.originalPrice}
                </Typography>
              )}
              </Box>

            {/* Social Proof - Exact like the image */}
                <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 2, color: '#000000' }}>
                <Typography component="span" sx={{ fontWeight: 700 }}>{viewers.toLocaleString()}</Typography> people are viewing right now and <Typography component="span" sx={{ fontWeight: 700 }}>{purchasers.toLocaleString()}</Typography> purchased it.
                  </Typography>
              
              {/* Sale End with Progress Bar */}
              <Typography variant="body2" sx={{ color: '#666666', mb: 1 }}>
                Sale end in
                  </Typography>
              
              {/* Progress Bar */}
              <Box sx={{ mb: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={(timeLeft / 783) * 100} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: '#f0f0f0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#d0d0d0',
                      borderRadius: 4
                    }
                  }} 
                />
              </Box>

              {/* Countdown Timer - Red color */}
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#dc2626' }}>
                {formattedTime}
                    </Typography>
                  </Box>

            {/* Bundle Options - Only show in E-commerce and Hybrid modes */}
            {!isAffiliateMode && (
              <>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#000000' }}>
                  Bundle & save
                </Typography>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Paper
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  border: selectedBundle === 1 ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                  backgroundColor: selectedBundle === 1 ? '#f0f9ff' : 'white',
                  '&:hover': { borderColor: 'primary.main' }
                }}
                onClick={() => setSelectedBundle(1)}
              >
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#000000' }}>
                  🔥 Get 1 {product?.name || 'Product'} 🔥
                </Typography>
              </Paper>
              <Paper
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  border: selectedBundle === 2 ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                  backgroundColor: selectedBundle === 2 ? '#f0f9ff' : 'white',
                  '&:hover': { borderColor: 'primary.main' }
                }}
                onClick={() => setSelectedBundle(2)}
              >
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#000000' }}>
                  🔥 Get 2 {product?.name || 'Product'} SAVE $15 OFF - ONLY DAY 🔥
                </Typography>
              </Paper>
              <Paper
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  border: selectedBundle === 3 ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                  backgroundColor: selectedBundle === 3 ? '#f0f9ff' : 'white',
                  '&:hover': { borderColor: 'primary.main' }
                }}
                onClick={() => setSelectedBundle(3)}
              >
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#000000' }}>
                  🔥 Get 3 {product?.name || 'Product'} SAVE $30 OFF - ONLY DAY 🔥
                </Typography>
              </Paper>
            </Stack>
              </>
            )}

            {/* Quantity Selector - Only show in E-commerce and Hybrid modes */}
            {!isAffiliateMode && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: 1 }}>
                  <IconButton onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    <Remove />
                  </IconButton>
                  <Typography variant="h6" sx={{ px: 2, minWidth: 50, textAlign: 'center' }}>
                    {quantity}
                  </Typography>
                  <IconButton onClick={() => setQuantity(quantity + 1)}>
                    <Add />
                  </IconButton>
                </Box>
              </Box>
            )}

            {/* Action Buttons - Based on Business Mode */}
            <Stack spacing={2} sx={{ mb: 3 }}>
              {isAffiliateMode ? (
                // Affiliate Mode: Only "Buy Now" button
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleBuyNow}
                  disabled={isBuyingNow}
                  sx={{
                    backgroundColor: '#4caf50',
                    color: 'white',
                    fontWeight: 700,
                    py: 2,
                    fontSize: '1.1rem',
                    '&:hover': { backgroundColor: '#45a049' },
                    '&:disabled': { backgroundColor: '#a5d6a7' }
                  }}
                >
                  {isBuyingNow ? 'PROCESSING...' : 'BUY NOW'}
                </Button>
              ) : isEcommerceMode ? (
                // E-commerce Mode: Only "Add to Cart" button
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  sx={{
                    backgroundColor: '#333333',
                    color: 'white',
                    fontWeight: 700,
                    py: 2,
                    fontSize: '1.1rem',
                    '&:hover': {
                      backgroundColor: '#000000'
                    },
                    '&:disabled': {
                      backgroundColor: '#cccccc',
                      color: '#666666'
                    }
                  }}
                >
                  {isAddingToCart ? 'ADDING...' : 'ADD TO CART'}
                </Button>
              ) : (
                // Hybrid Mode: Both buttons
                <>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    sx={{
                      backgroundColor: '#333333',
                      color: 'white',
                      fontWeight: 700,
                      py: 2,
                      fontSize: '1.1rem',
                      '&:hover': {
                        backgroundColor: '#000000'
                      },
                      '&:disabled': {
                        backgroundColor: '#cccccc',
                        color: '#666666'
                      }
                    }}
                  >
                    {isAddingToCart ? 'ADDING...' : 'ADD TO CART'}
                  </Button>

                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleBuyNow}
                    disabled={isBuyingNow}
                    sx={{
                      backgroundColor: '#dc2626',
                      color: 'white',
                      fontWeight: 700,
                      py: 2,
                      fontSize: '1.1rem',
                      '&:hover': { backgroundColor: '#b91c1c' },
                      '&:disabled': { backgroundColor: '#f87171' }
                    }}
                  >
                    {isBuyingNow ? 'PROCESSING...' : 'BUY IT NOW'}
                  </Button>
                </>
              )}

              {/* PayPal Button - Only show in E-commerce and Hybrid modes */}
              {!isAffiliateMode && (
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handlePayPal}
                  disabled={isPayPalLoading}
                  sx={{
                    backgroundColor: '#0070ba',
                    color: 'white',
                    fontWeight: 700,
                    py: 2,
                    fontSize: '1.1rem',
                    '&:hover': { backgroundColor: '#005ea6' },
                    '&:disabled': { backgroundColor: '#60a5fa' }
                  }}
                >
                  {isPayPalLoading ? 'LOADING...' : 'PayPal'}
                </Button>
              )}
            </Stack>

            {/* Trust Badge - Exact text */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 600 }}>
                ✅ Guaranteed Safe Checkout
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Product Description Section - Exact content */}
        <Card sx={{ mt: 4, mb: 3, boxShadow: 'none', border: '1px solid #e5e7eb' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, textAlign: 'center', color: '#000000' }}>
              Eliminate Sleep Apnea & Wake Up Refreshed Overnight!
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem', lineHeight: 1.8, color: '#000000' }}>
              If you're reading this, chances are you are suffering from interrupted sleep and chronic fatigue.
              The result? You fall asleep everywhere, your work and relationship suffer, and have no energy for anything.
              Long term, this can lead to severe depression, strokes, heart failure, and even premature death.
                </Typography>

            <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem', lineHeight: 1.8, color: '#000000' }}>
              Using the power of jaw alignment, the AirFlow Jaw Strap gently holds your mouth closed while you sleep, 
              effectively preventing your tongue from obstructing your airway by shifting backward.
              Eliminating your sleep apnea, daytime sleepiness, snoring, & brain fog.
                  </Typography>
            
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#000000' }}>
              Breakthrough Discovery
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem', lineHeight: 1.8, color: '#000000' }}>
              You've probably tried several other sleep apnea remedies that promise the world and fail to deliver. 
              And, I'm here to tell you it is not your fault that you're still in pain.
              Those other remedies don't target the root cause of sleep apnea.
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#000000' }}>
                ✅ Optimal jaw position
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#000000' }}>
                ✅ Preventing tongue slippage
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#000000' }}>
                ✅ Enhanced airway expansion
              </Typography>
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#000000' }}>
              Dramatically Improve Your Quality of Life
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#000000' }}>
                ✅ Rejuvenating deep sleep
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#000000' }}>
                ✅ Increased energy & alertness at work
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#000000' }}>
                ✅ Boosts libido & weight loss
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#000000' }}>
                ✅ Improved mental health & mood
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#000000' }}>
                ✅ Lower risk of heart disease, stroke, & hypertension
                </Typography>
            </Box>

            <Alert severity="info" sx={{ mb: 3, backgroundColor: '#e3f2fd' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#000000' }}>
                *Limited Items Available In Stock! Not Sold In Stores*
              </Typography>
              <Typography variant="body1" sx={{ color: '#000000' }}>
                The Checkout Process is Guaranteed to be 100% Safe and Secure with Visa, Mastercard, AMex, Discover, Apple Pay or PayPal.
              </Typography>
            </Alert>

            <Alert severity="success" sx={{ mb: 3, backgroundColor: '#e8f5e8' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#000000' }}>
                100% Satisfaction Guaranteed With Every Order
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#000000' }}>
                MONEY BACK GUARANTEE
              </Typography>
              <Typography variant="body1" sx={{ color: '#000000' }}>
                We want you to be 100% satisfied with the products you buy from us. If for ANY reason you are not satisfied with your purchase, we offer iron-clad money back guarantee.
              </Typography>
            </Alert>

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, textAlign: 'center', color: '#000000' }}>
              ⭐I Wish You A Happy Shopping, THANK YOU⭐
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, textAlign: 'center', color: '#000000' }}>
              Click the 'Add to Cart' and 'Buy Now' button to GET YOURS!
            </Typography>
          </CardContent>
        </Card>

        {/* Customer Reviews Section - Exact like Louistores */}
        <Card sx={{ mb: 3, boxShadow: 'none', border: '1px solid #e5e7eb' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, textAlign: 'center', color: '#000000' }}>
              REVIEWS
            </Typography>
            
            <Stack spacing={3}>
              {customerReviews.map((review) => (
                <Paper key={review.id} sx={{ p: 3, border: '1px solid #e5e7eb' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: '#3b82f6', width: 40, height: 40 }}>{review.avatar}</Avatar>
            <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#000000' }}>
                        {review.name}
                        {review.verified && <Verified sx={{ ml: 1, color: '#10b981', fontSize: '1.2rem' }} />}
                </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} sx={{ color: i < review.rating ? '#ffc107' : '#e0e0e0', fontSize: '1.2rem' }} />
              ))}
            </Box>
          </Box>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#000000' }}>
                    {review.title}
            </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.6, color: '#000000' }}>
                    {review.content}
            </Typography>
                </Paper>
              ))}
            </Stack>
          </CardContent>
        </Card>

    </Container>
    </Box>
  );
};

export default ProductDetailPage;