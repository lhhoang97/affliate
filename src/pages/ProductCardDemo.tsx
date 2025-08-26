import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import ProductCard from '../components/ProductCard';

const ProductCardDemo: React.FC = () => {
  const sampleProducts = [
    {
      id: '1',
      name: '10KG ANYCUBIC 1.75mm PLA 3D Printer Filament Bundles (Various Colors)',
      price: 65,
      originalPrice: 246,
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=200&fit=crop',
      retailer: 'AliExpress',
      color: 'Pearl Black',
      likes: 15,
      comments: 12,
      isForYou: true,
      foundBy: {
        name: 'gabe23111',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=24&h=24&fit=crop',
        time: 'Yesterday 07:41 AM'
      }
    },
    {
      id: '2',
      name: 'Wireless Bluetooth Earbuds with Noise Cancellation',
      price: 29.99,
      originalPrice: 89.99,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=200&fit=crop',
      retailer: 'Amazon',
      color: 'White',
      likes: 8,
      comments: 5,
      isForYou: false,
      foundBy: {
        name: 'techdeals',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=24&h=24&fit=crop',
        time: '2 hours ago'
      }
    },
    {
      id: '3',
      name: 'Smart Fitness Watch with Heart Rate Monitor',
      price: 79.99,
      originalPrice: 199.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=200&fit=crop',
      retailer: 'Best Buy',
      color: 'Black',
      likes: 23,
      comments: 18,
      isForYou: true,
      foundBy: {
        name: 'fitnessguru',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=24&h=24&fit=crop',
        time: '5 hours ago'
      }
    },
    {
      id: '4',
      name: 'Portable Bluetooth Speaker Waterproof',
      price: 34.99,
      originalPrice: 79.99,
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=200&fit=crop',
      retailer: 'Walmart',
      color: 'Blue',
      likes: 12,
      comments: 7,
      isForYou: false,
      foundBy: {
        name: 'musiclover',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=24&h=24&fit=crop',
        time: '1 day ago'
      }
    },
    {
      id: '5',
      name: 'Gaming Mechanical Keyboard RGB Backlit',
      price: 89.99,
      originalPrice: 149.99,
      image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=200&fit=crop',
      retailer: 'Newegg',
      color: 'RGB',
      likes: 31,
      comments: 24,
      isForYou: true,
      foundBy: {
        name: 'gamerpro',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=24&h=24&fit=crop',
        time: '3 hours ago'
      }
    },
    {
      id: '6',
      name: '4K Ultra HD Smart TV 55 inch',
      price: 399.99,
      originalPrice: 699.99,
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=200&fit=crop',
      retailer: 'Target',
      color: 'Black',
      likes: 45,
      comments: 32,
      isForYou: false,
      foundBy: {
        name: 'tvdeals',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=24&h=24&fit=crop',
        time: '6 hours ago'
      }
    },
    {
      id: '7',
      name: 'Wireless Charging Pad Fast Charger',
      price: 19.99,
      originalPrice: 49.99,
      image: 'https://images.unsplash.com/photo-1609592806596-b43bada2f2d2?w=400&h=200&fit=crop',
      retailer: 'Amazon',
      color: 'White',
      likes: 18,
      comments: 11,
      isForYou: true,
      foundBy: {
        name: 'techfinder',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=24&h=24&fit=crop',
        time: '1 hour ago'
      }
    },
    {
      id: '8',
      name: 'Professional Camera DSLR Kit',
      price: 599.99,
      originalPrice: 999.99,
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=200&fit=crop',
      retailer: 'B&H Photo',
      color: 'Black',
      likes: 67,
      comments: 41,
      isForYou: false,
      foundBy: {
        name: 'photographer',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=24&h=24&fit=crop',
        time: '4 hours ago'
      }
    },
    {
      id: '9',
      name: 'Robot Vacuum Cleaner with Mapping',
      price: 199.99,
      originalPrice: 399.99,
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=200&fit=crop',
      retailer: 'Costco',
      color: 'White',
      likes: 28,
      comments: 19,
      isForYou: true,
      foundBy: {
        name: 'homehelper',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=24&h=24&fit=crop',
        time: '8 hours ago'
      }
    },
    {
      id: '10',
      name: 'Gaming Mouse RGB 16000 DPI',
      price: 39.99,
      originalPrice: 79.99,
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=200&fit=crop',
      retailer: 'Micro Center',
      color: 'RGB',
      likes: 22,
      comments: 15,
      isForYou: false,
      foundBy: {
        name: 'gamingdeals',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=24&h=24&fit=crop',
        time: '2 days ago'
      }
    },
    {
      id: '11',
      name: 'Air Fryer Digital 5.8L Capacity',
      price: 69.99,
      originalPrice: 129.99,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=200&fit=crop',
      retailer: 'Walmart',
      color: 'Stainless Steel',
      likes: 35,
      comments: 27,
      isForYou: true,
      foundBy: {
        name: 'kitchenpro',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=24&h=24&fit=crop',
        time: '12 hours ago'
      }
    },
    {
      id: '12',
      name: 'Wireless Gaming Headset with Mic',
      price: 49.99,
      originalPrice: 99.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=200&fit=crop',
      retailer: 'Best Buy',
      color: 'Black',
      likes: 19,
      comments: 13,
      isForYou: false,
      foundBy: {
        name: 'audioexpert',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=24&h=24&fit=crop',
        time: '7 hours ago'
      }
    },
    {
      id: '13',
      name: 'Smart Home Security Camera System',
      price: 149.99,
      originalPrice: 299.99,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop',
      retailer: 'Home Depot',
      color: 'White',
      likes: 42,
      comments: 29,
      isForYou: true,
      foundBy: {
        name: 'securityguru',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=24&h=24&fit=crop',
        time: '9 hours ago'
      }
    },
    {
      id: '14',
      name: 'Electric Standing Desk Adjustable',
      price: 299.99,
      originalPrice: 499.99,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=200&fit=crop',
      retailer: 'IKEA',
      color: 'Walnut',
      likes: 38,
      comments: 25,
      isForYou: false,
      foundBy: {
        name: 'officepro',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=24&h=24&fit=crop',
        time: '5 hours ago'
      }
    },
    {
      id: '15',
      name: 'Portable Power Bank 20000mAh',
      price: 24.99,
      originalPrice: 49.99,
      image: 'https://images.unsplash.com/photo-1609592806596-b43bada2f2d2?w=400&h=200&fit=crop',
      retailer: 'Amazon',
      color: 'Black',
      likes: 16,
      comments: 9,
      isForYou: true,
      foundBy: {
        name: 'powerdeals',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=24&h=24&fit=crop',
        time: '3 hours ago'
      }
    },
    {
      id: '16',
      name: 'Smart LED Light Bulbs Pack of 4',
      price: 19.99,
      originalPrice: 39.99,
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=200&fit=crop',
      retailer: 'Target',
      color: 'Multicolor',
      likes: 14,
      comments: 8,
      isForYou: false,
      foundBy: {
        name: 'lightingpro',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=24&h=24&fit=crop',
        time: '6 hours ago'
      }
    },
    {
      id: '17',
      name: 'Wireless Car Charger Mount',
      price: 29.99,
      originalPrice: 59.99,
      image: 'https://images.unsplash.com/photo-1609592806596-b43bada2f2d2?w=400&h=200&fit=crop',
      retailer: 'AutoZone',
      color: 'Black',
      likes: 21,
      comments: 16,
      isForYou: true,
      foundBy: {
        name: 'cardeals',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=24&h=24&fit=crop',
        time: '4 hours ago'
      }
    },
    {
      id: '18',
      name: 'Smart Coffee Maker WiFi Enabled',
      price: 89.99,
      originalPrice: 159.99,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=200&fit=crop',
      retailer: 'Bed Bath & Beyond',
      color: 'Stainless Steel',
      likes: 33,
      comments: 22,
      isForYou: false,
      foundBy: {
        name: 'coffeelover',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=24&h=24&fit=crop',
        time: '10 hours ago'
      }
    },
    {
      id: '19',
      name: 'Bluetooth Beanie with Speakers',
      price: 19.99,
      originalPrice: 39.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=200&fit=crop',
      retailer: 'Amazon',
      color: 'Gray',
      likes: 11,
      comments: 6,
      isForYou: true,
      foundBy: {
        name: 'winterdeals',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=24&h=24&fit=crop',
        time: '1 day ago'
      }
    },
    {
      id: '20',
      name: 'Smart Door Lock Keyless Entry',
      price: 129.99,
      originalPrice: 199.99,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop',
      retailer: 'Lowe\'s',
      color: 'Brass',
      likes: 26,
      comments: 18,
      isForYou: false,
      foundBy: {
        name: 'homeautomation',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=24&h=24&fit=crop',
        time: '8 hours ago'
      }
    }
  ];

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
        Hiển thị 20 sản phẩm mẫu với thông tin chi tiết bao gồm tên sản phẩm, giá hiện tại, giá gốc và nơi bán
      </Typography>

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
        {sampleProducts.map((product) => (
          <Box key={product.id}>
            <ProductCard
              product={product}
              onLike={handleLike}
              onShare={handleShare}
              onComment={handleComment}
              onView={handleView}
            />
          </Box>
        ))}
      </Box>

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
