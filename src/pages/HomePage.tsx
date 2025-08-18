import React from 'react';
import { Container, Typography, Box, Card, CardContent, CardMedia, Button, Rating } from '@mui/material';
import { mockProducts } from '../utils/mockData';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          ReviewHub
        </Typography>
        <Typography variant="h5" component="h2" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Discover the best products with honest reviews
        </Typography>
      </Box>

      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
        Featured Products
      </Typography>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: 3 
      }}>
        {mockProducts.map((product) => (
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
            <CardMedia
              component="img"
              height="200"
              image={product.image}
              alt={product.name}
              sx={{ objectFit: 'cover' }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h6" component="h3">
                {product.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {product.description.substring(0, 100)}...
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={product.rating} precision={0.1} readOnly size="small" />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  ({product.reviewCount} reviews)
                </Typography>
              </Box>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
                ${product.price}
                {product.originalPrice && (
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                    sx={{ textDecoration: 'line-through', ml: 1 }}
                  >
                    ${product.originalPrice}
                  </Typography>
                )}
              </Typography>
              <Button 
                variant="contained" 
                fullWidth 
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
              >
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default HomePage;
