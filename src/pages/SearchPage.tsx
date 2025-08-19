import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  InputBase,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardMedia,
  CardContent,
  Button,
  Chip,
  Rating
} from '@mui/material';
import {
  Search,
  Close,
  Menu as MenuIcon,
  Laptop,
  PhoneIphone,
  Tv,
  Print,
  SportsEsports,
  AcUnit,
  SmartToy,
  Home,
  DirectionsCar,
  FitnessCenter,
  School,
  Checkroom,
  ChildCare
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { mockProducts } from '../utils/mockData';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const navigate = useNavigate();

  const categories = [
    {
      id: 1,
      name: 'Thiết bị điện tử',
      icon: (
        <Box sx={{ 
          width: 24, 
          height: 24, 
          backgroundColor: '#4FC3F7', 
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.5
        }}>
          <Box sx={{ width: 6, height: 4, backgroundColor: 'white', borderRadius: 0.5 }} />
          <Box sx={{ width: 6, height: 4, backgroundColor: 'white', borderRadius: 0.5 }} />
          <Box sx={{ width: 6, height: 4, backgroundColor: 'white', borderRadius: 0.5 }} />
        </Box>
      ),
      subcategories: ['Tai nghe', 'Laptop', 'Tablet', 'Điện Thoại', 'Tivi', 'Máy In', 'Thiết bị chơi game', 'Máy Lạnh', 'Loa']
    },
    {
      id: 2,
      name: 'Đồ Gia Dụng',
      icon: (
        <Box sx={{ 
          width: 24, 
          height: 24, 
          backgroundColor: '#333', 
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Box sx={{ 
            width: 12, 
            height: 8, 
            backgroundColor: 'white', 
            borderRadius: '2px 2px 0 0',
            position: 'relative'
          }}>
            <Box sx={{ 
              position: 'absolute',
              top: -2,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '3px solid transparent',
              borderRight: '3px solid transparent',
              borderBottom: '4px solid white'
            }} />
          </Box>
        </Box>
      ),
      subcategories: []
    },
    {
      id: 3,
      name: 'Hàng cũ',
      icon: (
        <Box sx={{ 
          width: 24, 
          height: 24, 
          backgroundColor: '#333', 
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Box sx={{ 
            width: 12, 
            height: 8, 
            backgroundColor: 'white', 
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '8px',
            color: '#333'
          }}>
            ₫
          </Box>
        </Box>
      ),
      subcategories: []
    },
    {
      id: 4,
      name: 'Thể thao - Sức khỏe',
      icon: (
        <Box sx={{ 
          width: 24, 
          height: 24, 
          backgroundColor: '#333', 
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Box sx={{ 
            width: 8, 
            height: 8, 
            backgroundColor: 'white', 
            borderRadius: '50%'
          }} />
        </Box>
      ),
      subcategories: []
    },
    {
      id: 5,
      name: 'Xe',
      icon: (
        <Box sx={{ 
          width: 24, 
          height: 24, 
          backgroundColor: '#333', 
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Box sx={{ 
            width: 12, 
            height: 6, 
            backgroundColor: 'white', 
            borderRadius: 1
          }} />
        </Box>
      ),
      subcategories: []
    },
    {
      id: 6,
      name: 'Mẹ và Bé',
      icon: (
        <Box sx={{ 
          width: 24, 
          height: 24, 
          backgroundColor: '#333', 
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Box sx={{ 
            width: 8, 
            height: 8, 
            backgroundColor: 'white', 
            borderRadius: '50%'
          }} />
        </Box>
      ),
      subcategories: []
    },
    {
      id: 7,
      name: 'Thời Trang',
      icon: (
        <Box sx={{ 
          width: 24, 
          height: 24, 
          backgroundColor: '#333', 
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Box sx={{ 
            width: 10, 
            height: 8, 
            backgroundColor: 'white', 
            borderRadius: 1
          }} />
        </Box>
      ),
      subcategories: []
    },
    {
      id: 8,
      name: 'Đồ Dùng Học Sinh',
      icon: (
        <Box sx={{ 
          width: 24, 
          height: 24, 
          backgroundColor: '#333', 
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Box sx={{ 
            width: 12, 
            height: 8, 
            backgroundColor: 'white', 
            borderRadius: 1
          }} />
        </Box>
      ),
      subcategories: []
    },
    {
      id: 9,
      name: 'Chăm sóc thú cưng',
      icon: (
        <Box sx={{ 
          width: 24, 
          height: 24, 
          backgroundColor: '#333', 
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Box sx={{ 
            width: 8, 
            height: 8, 
            backgroundColor: 'white', 
            borderRadius: '50%'
          }} />
        </Box>
      ),
      subcategories: []
    }
  ];

  const subcategoryItems = {
    'Tai nghe': ['iphone', 'Vivo', 'Iphone', 'Show all'],
    'Laptop': [],
    'Tablet': ['Ipad'],
    'Điện Thoại': [],
    'Tivi': [],
    'Máy In': [],
    'Thiết bị chơi game': [],
    'Máy Lạnh': [],
    'Loa': [],
    'Tủ Lạnh': ['Robot Hút Bụi , Máy Hút Bụi, Máy Hút Bụi']
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
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
            <Box 
              component="form" 
              onSubmit={handleSearch}
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                backgroundColor: '#f1f3f4',
                borderRadius: '24px',
                px: 2,
                py: 1,
                flex: 1,
                maxWidth: 500
              }}
            >
              <IconButton sx={{ p: 0.5, color: '#666' }}>
                <Search />
              </IconButton>
              <InputBase
                placeholder="Bạn ơi, bạn muốn tìm gì?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ 
                  ml: 1, 
                  flex: 1,
                  fontSize: '16px',
                  color: '#333'
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 0 }}>
        <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 80px)' }}>
          {/* Sidebar Categories */}
          <Box sx={{ 
            width: 300, 
            backgroundColor: 'white',
            borderRight: '1px solid #e9ecef',
            overflowY: 'auto',
            height: 'calc(100vh - 80px)',
            position: 'sticky',
            top: 0
          }}>
            <List sx={{ p: 0 }}>
              {categories.map((category, index) => (
                <React.Fragment key={category.id}>
                  <ListItem 
                    sx={{ 
                      py: 1.5,
                      px: 2,
                      borderBottom: '1px solid #f1f1f1',
                      cursor: 'pointer',
                      backgroundColor: index === 0 ? '#e3f2fd' : 'transparent',
                      '&:hover': {
                        backgroundColor: index === 0 ? '#e3f2fd' : '#f8f9fa'
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {category.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={category.name}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontSize: '14px',
                          fontWeight: 500,
                          color: index === 0 ? '#007bff' : '#333'
                        }
                      }}
                    />
                  </ListItem>
                  
                  {/* Subcategories for Electronics */}
                  {category.name === 'Thiết bị điện tử' && (
                    <Box sx={{ pl: 6, pr: 2, py: 2, backgroundColor: '#fafafa' }}>
                      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
                            Tai nghe
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Typography variant="body2" sx={{ color: '#666', cursor: 'pointer', '&:hover': { color: '#007bff' } }}>
                              iphone
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#666', cursor: 'pointer', '&:hover': { color: '#007bff' } }}>
                              Vivo
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#666', cursor: 'pointer', '&:hover': { color: '#007bff' } }}>
                              Iphone
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#4285f4', cursor: 'pointer', fontSize: '12px' }}>
                              Show all
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
                            Laptop
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
                            Tablet
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666', cursor: 'pointer', '&:hover': { color: '#007bff' } }}>
                            Ipad
                          </Typography>
                        </Box>
                      </Box>
                      
                      {/* Additional categories below */}
                      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>
                          Điện Thoại
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>
                          Tivi
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>
                          Máy In
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>
                          Thiết bị chơi game
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>
                          Tủ Lạnh
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>
                          Máy Lạnh
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>
                          Loa
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>
                          Robot Hút Bụi , Máy Hút Bụi, Máy Hút Bụi
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </React.Fragment>
              ))}
            </List>
          </Box>

          {/* Main Content */}
          <Box sx={{ flex: 1, p: 3 }}>
            {searchTerm ? (
              <>
                <Typography variant="h6" sx={{ mb: 2, color: '#333' }}>
                  Kết quả tìm kiếm cho "{searchTerm}"
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2 }}>
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
                          sx={{ objectFit: 'cover' }}
                        />
                        <CardContent sx={{ p: 2 }}>
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
