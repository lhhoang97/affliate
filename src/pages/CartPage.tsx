import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  TextField,
  Divider,
  Alert
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';

const CartPage: React.FC = () => {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  if (items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Shopping Cart
        </Typography>
        <Alert severity="info" sx={{ mt: 2 }}>
          Your cart is empty. <Button href="/" color="primary">Continue Shopping</Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Shopping Cart ({totalItems} items)
        </Typography>
        <Button variant="outlined" color="error" onClick={clearCart}>
          Clear Cart
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
        {/* Cart Items */}
        <Box>
          {items.map((item) => (
            <Card key={item.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <CardMedia
                    component="img"
                    sx={{ width: 100, height: 100, objectFit: 'cover' }}
                    image={item.product.image}
                    alt={item.product.name}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {item.product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      ${item.product.price}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Remove />
                      </IconButton>
                      <TextField
                        size="small"
                        value={item.quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value) && value > 0) {
                            handleQuantityChange(item.productId, value);
                          }
                        }}
                        sx={{ width: 60 }}
                        inputProps={{ min: 1, style: { textAlign: 'center' } }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                      >
                        <Add />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeFromCart(item.productId)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" color="primary">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Order Summary */}
        <Card sx={{ height: 'fit-content' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Subtotal ({totalItems} items):</Typography>
              <Typography>${totalPrice.toFixed(2)}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Shipping:</Typography>
              <Typography>Free</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Tax:</Typography>
              <Typography>${(totalPrice * 0.1).toFixed(2)}</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6" color="primary">
                ${(totalPrice * 1.1).toFixed(2)}
              </Typography>
            </Box>

            <Button variant="contained" fullWidth size="large">
              Proceed to Checkout
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default CartPage;
