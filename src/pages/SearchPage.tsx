import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  Rating
} from '@mui/material';
import {
  Search,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { mockProducts } from '../utils/mockData';
import SearchBar from '../components/SearchBar';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const navigate = useNavigate();



  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const mockSearchResults = mockProducts.slice(0, 6);

  return (
    <Box sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header with Search */}
      <Box sx={{ backgroundColor: 'white', borderBottom: '1px solid #e9ecef', py: 2 }}>
        <Container maxWidth="xl">
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            width: '100%'
          }}>
            {/* Left side: Hamburger menu */}
            <IconButton sx={{ color: '#333' }}>
              <MenuIcon />
            </IconButton>
            
            {/* Center: Logo */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              flexShrink: 0
            }}>
              <Box sx={{ 
                position: 'relative',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 16,
                  height: 16,
                  backgroundColor: '#ff4444',
                  borderRadius: '50% 50% 0 50%',
                  transform: 'rotate(-45deg)'
                }} />
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 12,
                  height: 12,
                  backgroundColor: '#ffaa00',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '8px',
                  color: '#333'
                }}>
                  ☀
                </Box>
              </Box>
              <Typography sx={{ 
                color: '#007bff', 
                fontWeight: 'bold', 
                fontSize: '18px',
                textTransform: 'lowercase'
              }}>
                giatotday
              </Typography>
            </Box>
            
            {/* Right side: Search bar */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              flex: 1,
              maxWidth: { xs: '100%', md: 500 },
              mx: { xs: 1, md: 2 }
            }}>
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                onSearch={handleSearch}
                placeholder="Tìm kiếm..."
              />
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 0 }}>
        <Box sx={{ 
          display: 'flex', 
          minHeight: 'calc(100vh - 80px)',
          flexDirection: 'column'
        }}>
          {/* Main Content */}
          <Box sx={{ 
            flex: 1, 
            p: { xs: 2, md: 3 },
            width: '100%'
          }}>
            {searchTerm ? (
              <>
                <Typography variant="h6" sx={{ mb: 2, color: '#333' }}>
                  Kết quả tìm kiếm cho "{searchTerm}"
                </Typography>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { 
                    xs: '1fr', 
                    sm: 'repeat(2, 1fr)', 
                    md: 'repeat(3, 1fr)', 
                    lg: 'repeat(4, 1fr)' 
                  }, 
                  gap: { xs: 1.5, md: 2 }
                }}>
                  {mockSearchResults.map((product) => (
                    <Card
                      key={product.id} 
                      sx={{ 
                        height: '100%',
                        cursor: 'pointer',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }
                      }}
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                        <CardMedia
                          component="img"
                          height="180"
                          image={product.image}
                          alt={product.name}
                          sx={{ 
                            objectFit: 'cover',
                            height: { xs: 140, sm: 160, md: 180 }
                          }}
                        />
                        <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
                          <Typography variant="body2" sx={{ 
                            fontWeight: 500,
                            mb: 1,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {product.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Rating value={product.rating} size="small" readOnly />
                            <Typography variant="caption" sx={{ ml: 0.5, color: '#666' }}>
                              ({product.reviewCount || 0})
                            </Typography>
                          </Box>
                          <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                            {product.price.toLocaleString('vi-VN')}đ
                          </Typography>
                          {product.originalPrice && (
                            <Typography variant="body2" sx={{ 
                              textDecoration: 'line-through',
                              color: '#999',
                              fontSize: '12px'
                            }}>
                              {product.originalPrice.toLocaleString('vi-VN')}đ
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                  ))}
                </Box>
              </>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '50vh',
                flexDirection: 'column',
                color: '#666'
              }}>
                <Search sx={{ fontSize: 48, mb: 2, color: '#ccc' }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Tìm kiếm sản phẩm
                </Typography>
                <Typography variant="body2">
                  Nhập từ khóa để tìm kiếm sản phẩm bạn muốn
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default SearchPage;
