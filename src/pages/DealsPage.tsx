import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  Grid,
  Chip,
  Rating,
  LinearProgress,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import {
  LocalOffer,
  Timer,
  ShoppingCart,
  Favorite,
  TrendingDown,
  FlashOn
} from '@mui/icons-material';
import { useSimpleCart } from '../contexts/SimpleCartContext';
import { useCartSidebar } from '../contexts/CartSidebarContext';
import { useBusinessMode } from '../contexts/BusinessModeContext';

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
      id={`deals-tabpanel-${index}`}
      aria-labelledby={`deals-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const DealsPage: React.FC = () => {
  const { addToCart } = useSimpleCart();
  const { openCart } = useCartSidebar();
  const { isAffiliateMode, isEcommerceMode, isHybridMode } = useBusinessMode();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const flashDeals = [
    {
      id: '1',
      name: 'iPhone 15 Pro Max',
      originalPrice: 1199.99,
      dealPrice: 999.99,
      discount: 17,
      image: 'https://picsum.photos/400/400?random=301',
      rating: 4.8,
      reviewCount: 1250,
      timeLeft: '2:45:30',
      soldPercentage: 75,
      badge: 'Flash Deal',
      retailer: 'Apple Store'
    },
    {
      id: '2',
      name: 'Samsung 65" 4K Smart TV',
      originalPrice: 899.99,
      dealPrice: 599.99,
      discount: 33,
      image: 'https://picsum.photos/400/400?random=302',
      rating: 4.6,
      reviewCount: 890,
      timeLeft: '5:20:15',
      soldPercentage: 60,
      badge: 'Limited Time',
      retailer: 'Best Buy'
    },
    {
      id: '3',
      name: 'Sony WH-1000XM5 Headphones',
      originalPrice: 399.99,
      dealPrice: 249.99,
      discount: 38,
      image: 'https://picsum.photos/400/400?random=303',
      rating: 4.9,
      reviewCount: 567,
      timeLeft: '1:15:45',
      soldPercentage: 90,
      badge: 'Almost Gone',
      retailer: 'Amazon'
    }
  ];

  const categoryDeals = [
    {
      category: 'Electronics',
      deals: [
        {
          id: '4',
          name: 'MacBook Air M2',
          originalPrice: 1199.99,
          dealPrice: 999.99,
          discount: 17,
          image: 'https://picsum.photos/400/400?random=304',
          rating: 4.7,
          reviewCount: 432
        },
        {
          id: '5',
          name: 'iPad Pro 12.9"',
          originalPrice: 1099.99,
          dealPrice: 899.99,
          discount: 18,
          image: 'https://picsum.photos/400/400?random=305',
          rating: 4.8,
          reviewCount: 321
        }
      ]
    },
    {
      category: 'Fashion',
      deals: [
        {
          id: '6',
          name: 'Nike Air Max 270',
          originalPrice: 150.00,
          dealPrice: 89.99,
          discount: 40,
          image: 'https://picsum.photos/400/400?random=306',
          rating: 4.5,
          reviewCount: 789
        },
        {
          id: '7',
          name: 'Adidas Ultraboost 22',
          originalPrice: 180.00,
          dealPrice: 119.99,
          discount: 33,
          image: 'https://picsum.photos/400/400?random=307',
          rating: 4.6,
          reviewCount: 456
        }
      ]
    }
  ];

  const handleAddToCart = (product: any) => {
    const productData = {
      id: product.id,
      name: product.name,
      price: product.dealPrice,
      image: product.image,
      rating: product.rating,
      reviewCount: product.reviewCount,
      category: 'Electronics',
      brand: 'Brand',
      inStock: true,
      features: [],
      specifications: {},
      images: [product.image],
      tags: [],
      externalUrl: product.externalUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      description: ''
    };
    addToCart(productData.id, 1, 'single');
    openCart();
    if (productData.externalUrl) {
      window.open(productData.externalUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Box sx={{ backgroundColor: '#f3f3f3', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
        color: 'white',
        py: 4
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <FlashOn sx={{ fontSize: 40 }} />
            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
              Today's Deals
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Limited time offers on thousands of products
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="deals tabs">
            <Tab label="Flash Deals" />
            <Tab label="Category Deals" />
            <Tab label="Clearance" />
            <Tab label="Prime Deals" />
          </Tabs>
        </Box>

        {/* Flash Deals Tab */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
            Flash Deals - Limited Time Only
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {flashDeals.map((deal) => (
              <Card key={deal.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={deal.image}
                    alt={deal.name}
                  />
                  <Chip
                    label={deal.badge}
                    color="error"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      backgroundColor: '#ff4757',
                      color: 'white'
                    }}
                  />
                  <Box sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}>
                    <Timer sx={{ fontSize: 16 }} />
                    <Typography variant="caption">
                      {deal.timeLeft}
                    </Typography>
                  </Box>
                </Box>
                
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {deal.name}
                  </Typography>
                  
                  {/* Retailer Information */}
                  {deal.retailer && (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 0.5, 
                      mb: 1,
                      p: 0.5,
                      backgroundColor: '#f0f9ff',
                      borderRadius: 1,
                      border: '1px solid #bae6fd'
                    }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#3b82f6',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                      >
                        🏪 {deal.retailer}
                      </Typography>
                    </Box>
                  )}
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={deal.rating} precision={0.1} size="small" readOnly />
                    <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                      ({deal.reviewCount})
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" sx={{ color: '#B12704', fontWeight: 'bold' }}>
                      ${deal.dealPrice}
                    </Typography>
                    <Typography variant="body1" sx={{ textDecoration: 'line-through', ml: 1, color: 'text.secondary' }}>
                      ${deal.originalPrice}
                    </Typography>
                    <Chip
                      label={`-${deal.discount}%`}
                      color="error"
                      size="small"
                      sx={{ ml: 1, backgroundColor: '#ff4757' }}
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        Sold: {deal.soldPercentage}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {deal.soldPercentage}% claimed
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={deal.soldPercentage} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#ff4757'
                        }
                      }}
                    />
                  </Box>

                  {!isAffiliateMode && (
                    <Button
                      variant="contained"
                      startIcon={<ShoppingCart />}
                      onClick={() => handleAddToCart(deal)}
                      sx={{
                        backgroundColor: '#ff4757',
                        '&:hover': { backgroundColor: '#ff3742' }
                      }}
                    >
                      Add to Cart
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        </TabPanel>

        {/* Category Deals Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
            Deals by Category
          </Typography>
          {categoryDeals.map((category) => (
            <Box key={category.category} sx={{ mb: 6 }}>
              <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                {category.category}
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                {category.deals.map((deal) => (
                  <Card key={deal.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={deal.image}
                      alt={deal.name}
                    />
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {deal.name}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating value={deal.rating} precision={0.1} size="small" readOnly />
                        <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                          ({deal.reviewCount})
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ color: '#B12704', fontWeight: 'bold' }}>
                          ${deal.dealPrice}
                        </Typography>
                        <Typography variant="body2" sx={{ textDecoration: 'line-through', ml: 1, color: 'text.secondary' }}>
                          ${deal.originalPrice}
                        </Typography>
                        <Chip
                          label={`-${deal.discount}%`}
                          color="error"
                          size="small"
                          sx={{ ml: 1, backgroundColor: '#ff4757' }}
                        />
                      </Box>

                      <Button
                        variant="contained"
                        startIcon={<ShoppingCart />}
                        onClick={() => handleAddToCart(deal)}
                        sx={{
                          backgroundColor: '#ff4757',
                          '&:hover': { backgroundColor: '#ff3742' }
                        }}
                      >
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          ))}
        </TabPanel>

        {/* Clearance Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
            Clearance Sale
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Up to 80% off on selected items. While supplies last.
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {flashDeals.slice(0, 2).map((deal) => (
              <Card key={`clearance-${deal.id}`} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={deal.image}
                  alt={deal.name}
                />
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {deal.name}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ color: '#B12704', fontWeight: 'bold' }}>
                      ${deal.dealPrice}
                    </Typography>
                    <Typography variant="body2" sx={{ textDecoration: 'line-through', ml: 1, color: 'text.secondary' }}>
                      ${deal.originalPrice}
                    </Typography>
                  </Box>

                  {!isAffiliateMode && (
                    <Button
                      variant="contained"
                      startIcon={<ShoppingCart />}
                      onClick={() => handleAddToCart(deal)}
                      sx={{
                        backgroundColor: '#ff4757',
                        '&:hover': { backgroundColor: '#ff3742' }
                      }}
                    >
                      Add to Cart
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        </TabPanel>

        {/* Prime Deals Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
            Prime Member Deals
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Exclusive deals for Prime members. Join Prime to access these special offers.
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {flashDeals.map((deal) => (
              <Card key={`prime-${deal.id}`} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={deal.image}
                    alt={deal.name}
                  />
                  <Chip
                    label="Prime"
                    color="primary"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      backgroundColor: '#00a8e8'
                    }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {deal.name}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ color: '#B12704', fontWeight: 'bold' }}>
                      ${deal.dealPrice}
                    </Typography>
                    <Typography variant="body2" sx={{ textDecoration: 'line-through', ml: 1, color: 'text.secondary' }}>
                      ${deal.originalPrice}
                    </Typography>
                  </Box>

                  {!isAffiliateMode && (
                    <Button
                      variant="contained"
                      startIcon={<ShoppingCart />}
                      onClick={() => handleAddToCart(deal)}
                      sx={{
                        backgroundColor: '#00a8e8',
                        '&:hover': { backgroundColor: '#0097d1' }
                      }}
                    >
                      Prime Add to Cart
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        </TabPanel>
      </Container>
    </Box>
  );
};

export default DealsPage;
