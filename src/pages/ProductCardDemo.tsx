import React from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../contexts/ProductContext';

const ProductCardDemo: React.FC = () => {
  const { products, loading } = useProducts();

  const handleLike = (productId: string) => {
    console.log('Liked product:', productId);
  };

  const handleShare = (productId: string) => {
    console.log('Shared product:', productId);
  };

  const handleComment = (productId: string) => {
    console.log('Commented on product:', productId);
  };

  const handleView = (productId: string) => {
    console.log('Viewed product:', productId);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography 
        variant="h3" 
        component="h1" 
        sx={{ 
          fontWeight: 700, 
          mb: 4, 
          textAlign: 'center',
          color: '#1a1a1a'
        }}
      >
        Product Card Demo
      </Typography>
      
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 4, 
          textAlign: 'center',
          color: '#6b7280',
          maxWidth: 600,
          mx: 'auto'
        }}
      >
        Hiển thị sản phẩm từ Supabase với thông tin chi tiết bao gồm tên sản phẩm, giá hiện tại, giá gốc và nơi bán
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)', 
            lg: 'repeat(4, 1fr)' 
          }, 
          gap: 3 
        }}>
          {products.slice(0, 20).map((product) => (
            <Box key={product.id}>
              <ProductCard
                product={{
                  ...product,
                  originalPrice: product.originalPrice || product.price,
                  retailer: product.retailer || 'ShopWithUs',
                  color: 'Black',
                  likes: Math.floor(Math.random() * 50) + 5,
                  comments: Math.floor(Math.random() * 20) + 2,
                  isForYou: Math.random() > 0.5,
                  foundBy: {
                    name: 'ShopWithUs',
                    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=24&h=24&fit=crop',
                    time: 'Recently'
                  }
                }}
                onLike={handleLike}
                onShare={handleShare}
                onComment={handleComment}
                onView={handleView}
              />
            </Box>
          ))}
        </Box>
      )}

      <Box sx={{ mt: 6, p: 3, backgroundColor: '#f8fafc', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Tính năng của ProductCard Component:
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Hiển thị thông tin người tìm thấy deal (avatar, tên, thời gian)
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Hình ảnh sản phẩm với badge "For You" và nút fullscreen
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Nút chọn màu sản phẩm (nếu có)
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Tên sản phẩm với giới hạn 2 dòng
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Giá hiện tại, giá gốc và phần trăm giảm giá
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Tên cửa hàng/retailer
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Các nút tương tác: like, comment, share với số lượng
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            Hiệu ứng hover và responsive design
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default ProductCardDemo;
