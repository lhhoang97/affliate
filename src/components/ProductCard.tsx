import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Avatar,
  Button
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Share,
  ChatBubbleOutline,
  Fullscreen,
  Person
} from '@mui/icons-material';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    retailer?: string;
    color?: string;
    likes?: number;
    comments?: number;
    rating?: number;
    reviewCount?: number;
    isForYou?: boolean;
    foundBy?: {
      name: string;
      avatar?: string;
      time: string;
    };
  };
  onLike?: (productId: string) => void;
  onShare?: (productId: string) => void;
  onComment?: (productId: string) => void;
  onView?: (productId: string) => void;
  variant?: 'default' | 'compact';
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onLike,
  onShare,
  onComment,
  onView,
  variant = 'default'
}) => {
  const [isLiked, setIsLiked] = React.useState(false);
  
  // Debug log to check product data
  console.log('ProductCard - Product data:', {
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    retailer: product.retailer,
    hasRetailer: !!product.retailer,
    retailerType: typeof product.retailer
  });
  
  const discountPercentage = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(product.id);
  };

  const handleShare = () => {
    onShare?.(product.id);
  };

  const handleComment = () => {
    onComment?.(product.id);
  };

  const handleView = () => {
    onView?.(product.id);
  };

  // Compact variant for category pages
  if (variant === 'compact') {
    return (
      <Card 
        sx={{ 
          height: '100%',
          width: '100%',
          borderRadius: { xs: 1.5, sm: 2 },
          boxShadow: { xs: '0 1px 4px rgba(0,0,0,0.1)', sm: '0 2px 8px rgba(0,0,0,0.08)' },
          transition: 'all 0.2s ease-in-out',
          cursor: 'pointer',
          border: { xs: '1px solid #e5e7eb', sm: 'none' },
          '&:hover': {
            transform: { xs: 'none', sm: 'translateY(-2px)' },
            boxShadow: { xs: '0 2px 6px rgba(0,0,0,0.15)', sm: '0 4px 16px rgba(0,0,0,0.12)' },
            borderColor: '#3b82f6'
          }
        }}
        onClick={() => onView?.(product.id)}
      >
        {/* Product Image */}
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="140"
            image={product.image}
            alt={product.name}
            sx={{ 
              objectFit: 'cover',
              height: { xs: 160, sm: 140 }, // Tăng height cho mobile để rõ hơn
              width: '100%'
            }}
          />
          
          {/* Discount Badge - Top Left */}
          {discountPercentage > 0 && (
            <Chip
              label={`-${discountPercentage}%`}
              size="small"
              sx={{
                position: 'absolute',
                top: { xs: 6, sm: 8 },
                left: { xs: 6, sm: 8 },
                backgroundColor: '#dc2626',
                color: 'white',
                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                fontWeight: 700,
                height: { xs: 20, sm: 24 },
                borderRadius: { xs: '10px', sm: '12px' },
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            />
          )}
          
          {/* Retailer Badge */}
          {product.retailer && (
            <Chip
              label={product.retailer}
              size="small"
              sx={{
                position: 'absolute',
                top: { xs: 6, sm: 8 },
                right: { xs: 6, sm: 8 },
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                fontSize: { xs: '0.55rem', sm: '0.6rem' },
                fontWeight: 600,
                height: { xs: 16, sm: 18 },
                maxWidth: { xs: 50, sm: 60 },
                '& .MuiChip-label': {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }
              }}
            />
          )}
        </Box>

        <CardContent sx={{ p: { xs: 1.2, sm: 1.5 }, pt: { xs: 0.8, sm: 1 } }}>
          {/* Product Name */}
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: '#1f2937',
              mb: { xs: 0.8, sm: 0.5 },
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              fontSize: { xs: '0.9rem', sm: '0.8rem' }, // Tăng font size cho mobile
              lineHeight: { xs: 1.3, sm: 1.2 },
              height: { xs: 'auto', sm: '2.4em' },
              minHeight: { xs: '2.6em', sm: 'auto' }
            }}
          >
            {product.name}
          </Typography>

          {/* Pricing */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 1, sm: 0.5 }, 
            mb: { xs: 0.8, sm: 0.5 }
          }}>
            <Typography 
              variant="h6" 
              component="span"
              sx={{ 
                fontWeight: 700,
                color: '#059669',
                fontSize: { xs: '1.1rem', sm: '1rem' } // Tăng font size cho mobile
              }}
            >
              ${product.price?.toFixed(2) || '0.00'}
            </Typography>
            {product.originalPrice && product.originalPrice > product.price && (
              <Typography 
                variant="body2" 
                component="span"
                sx={{ 
                  textDecoration: 'line-through',
                  color: '#dc2626',
                  fontSize: { xs: '0.8rem', sm: '0.7rem' },
                  fontWeight: 500
                }}
              >
                ${product.originalPrice?.toFixed(2) || '0.00'}
              </Typography>
            )}
          </Box>

          {/* Rating */}
          <Typography
            variant="body2"
            sx={{
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 0.7, sm: 0.5 },
              fontSize: { xs: '0.8rem', sm: '0.7rem' } // Tăng font size cho mobile
            }}
          >
            ⭐ {product.rating || 4.5} ({product.reviewCount || 0})
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card 
      sx={{ 
        maxWidth: { xs: '100%', sm: 400 },
        minWidth: { xs: 280, sm: 320 },
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
        }
      }}
    >
      {/* User who found the deal */}
      {product.foundBy && (
        <Box sx={{ p: 2, pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar 
            sx={{ width: 24, height: 24, fontSize: '0.75rem' }}
            src={product.foundBy.avatar}
          >
            {product.foundBy.avatar ? null : <Person sx={{ fontSize: '0.75rem' }} />}
          </Avatar>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
            Found by {product.foundBy.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto', fontSize: '0.75rem' }}>
            {product.foundBy.time}
          </Typography>
        </Box>
      )}

      {/* Product Image */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={product.image}
          alt={product.name}
          sx={{ 
            objectFit: 'cover',
            height: { xs: 180, sm: 200 }
          }}
        />
        
        {/* For You Badge */}
        {product.isForYou && (
          <Chip
            label="For You"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              backgroundColor: 'rgba(139, 92, 246, 0.9)',
              color: 'white',
              fontSize: { xs: '0.65rem', sm: '0.7rem' },
              fontWeight: 600,
              height: { xs: 20, sm: 24 }
            }}
          />
        )}

        {/* Retailer Badge */}
        <Chip
          label={product.retailer || 'ShopWithUs'}
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 40,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            fontSize: { xs: '0.6rem', sm: '0.65rem' },
            fontWeight: 600,
            height: { xs: 18, sm: 20 },
            maxWidth: 80,
            '& .MuiChip-label': {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }
          }}
        />

        {/* Fullscreen Button */}
        <IconButton
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)'
            },
            p: { xs: 0.5, sm: 1 }
          }}
          onClick={handleView}
        >
          <Fullscreen sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }} />
        </IconButton>
      </Box>

      {/* Color Selection Button */}
      {product.color && (
        <Box sx={{ p: 1, pt: 0 }}>
          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: '#1976d2',
              color: 'white',
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '0.8rem',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#1565c0'
              }
            }}
          >
            {product.color}
          </Button>
        </Box>
      )}

      <CardContent sx={{ p: { xs: 1.5, sm: 2 }, pt: 1 }}>
        {/* Product Name */}
        <Typography 
          variant="h6" 
          component="h3"
          sx={{ 
            fontWeight: 700,
            fontSize: { xs: '1rem', sm: '1.1rem' },
            lineHeight: 1.3,
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {product.name}
        </Typography>

        {/* Pricing */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          mb: 1.5,
          p: 1,
          backgroundColor: '#f8fafc',
          borderRadius: 1,
          border: '1px solid #e5e7eb'
        }}>
          <Typography 
            variant="h5" 
            component="span"
            sx={{ 
              fontWeight: 700,
              color: '#1a1a1a',
              fontSize: { xs: '1.4rem', sm: '1.6rem' }
            }}
          >
            ${product.price?.toFixed(2) || '0.00'}
          </Typography>
          <Typography 
            variant="body1" 
            component="span"
            sx={{ 
              textDecoration: 'line-through',
              color: '#dc2626',
              fontSize: { xs: '1rem', sm: '1.1rem' },
              fontWeight: 500
            }}
          >
            ${product.originalPrice?.toFixed(2) || '0.00'}
          </Typography>

        </Box>

        {/* Retailer Info - Prominent display */}
        <Box sx={{ 
          mb: 1.5,
          p: 1,
          backgroundColor: '#f8fafc',
          borderRadius: 1,
          border: '1px solid #e5e7eb'
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5,
            mb: 0.5
          }}>
            <Box sx={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'white',
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  lineHeight: 1
                }}
              >
                {product.retailer?.charAt(0)?.toUpperCase() || 'S'}
              </Typography>
            </Box>
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                fontWeight: 600,
                color: '#374151'
              }}
            >
              {product.retailer || 'ShopWithUs'}
            </Typography>
          </Box>
          
          {/* Website */}
          <Typography 
            variant="caption" 
            sx={{ 
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              color: '#6b7280',
              display: 'block'
            }}
          >
            🌐 {product.retailer?.toLowerCase().replace(/\s+/g, '')}.com
          </Typography>
          
          {/* Shipping Info */}
          <Typography 
            variant="caption" 
            sx={{ 
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              color: '#059669',
              display: 'block',
              fontWeight: 500
            }}
          >
            🚚 Free Shipping
          </Typography>
          
          {/* Rating Info */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5,
            mt: 0.5
          }}>
            <Typography 
              variant="caption" 
              sx={{ 
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                color: '#f59e0b',
                fontWeight: 600
              }}
            >
              ⭐ 4.5
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                color: '#6b7280'
              }}
            >
              (1,234 reviews)
            </Typography>
          </Box>
          
          {/* Delivery & Return Info */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            mt: 0.5
          }}>
            <Typography 
              variant="caption" 
              sx={{ 
                fontSize: { xs: '0.65rem', sm: '0.7rem' },
                color: '#059669',
                fontWeight: 500
              }}
            >
              📦 2-3 days
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                fontSize: { xs: '0.65rem', sm: '0.7rem' },
                color: '#3b82f6',
                fontWeight: 500
              }}
            >
              🔄 30-day return
            </Typography>
          </Box>
        </Box>
        


        {/* Buy Button with Retailer */}
        <Button
          variant="contained"
          size="small"
          fullWidth
          onClick={handleView}
          sx={{
            mb: 1.5,
            backgroundColor: '#3b82f6',
            color: 'white',
            fontWeight: 600,
            textTransform: 'none',
            fontSize: { xs: '0.8rem', sm: '0.9rem' },
            py: { xs: 0.75, sm: 1 },
            '&:hover': {
              backgroundColor: '#2563eb'
            }
          }}
        >
          Get Deal at {product.retailer || 'ShopWithUs'}
        </Button>

        {/* Interaction Buttons */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 1.5, sm: 2 },
          pt: 1,
          borderTop: '1px solid #f0f0f0'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton 
              size="small" 
              onClick={handleLike}
              sx={{ 
                color: isLiked ? '#dc2626' : '#6b7280',
                p: { xs: 0.5, sm: 1 }
              }}
            >
              {isLiked ? <Favorite sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }} /> : <FavoriteBorder sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }} />}
            </IconButton>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
              {product.likes || 0}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton 
              size="small" 
              onClick={handleComment}
              sx={{ 
                color: '#6b7280',
                p: { xs: 0.5, sm: 1 }
              }}
            >
              <ChatBubbleOutline sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }} />
            </IconButton>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
              {product.comments || 0}
            </Typography>
          </Box>

          <IconButton 
            size="small" 
            onClick={handleShare}
            sx={{ 
              color: '#6b7280',
              ml: 'auto',
              p: { xs: 0.5, sm: 1 }
            }}
          >
            <Share sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }} />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
