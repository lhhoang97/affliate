import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  Rating,
  CircularProgress
} from '@mui/material';
import {
  Search,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';

import SearchBar from '../components/SearchBar';
import Logo from '../components/Logo';
import { Product } from '../types';
import { useProducts } from '../contexts/ProductContext';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const navigate = useNavigate();
  const { products } = useProducts();
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Recent searches from localStorage
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  });

  // Trending searches
  const trendingSearches = [
    'iPhone', 'Samsung', 'Laptop', 'Headphones', 
    'Gaming', 'Fitness', 'Home Decor', 'Books'
  ];

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Add to recent searches
      const newRecentSearches = [
        query.trim(),
        ...recentSearches.filter(s => s !== query.trim())
      ].slice(0, 10);
      setRecentSearches(newRecentSearches);
      localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
      
      // Navigate to search results
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  // Search logic
  useEffect(() => {
    if (searchTerm) {
      setIsSearching(true);
      
      // Simulate search delay
      const timer = setTimeout(() => {
        const query = searchTerm.toLowerCase();
        const results = products.filter(product => 
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.tags.some(tag => tag.toLowerCase().includes(query))
        );
        
        setSearchResults(results);
        setIsSearching(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchTerm, products]);

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
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Logo variant="mobile" />
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
                placeholder="Search products..."
                showSuggestions={true}
                recentSearches={recentSearches}
                trendingSearches={trendingSearches}
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
                  Search results for "{searchTerm}"
                  {isSearching && (
                    <CircularProgress size={16} sx={{ ml: 2 }} />
                  )}
                </Typography>
                {isSearching ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : searchResults.length > 0 ? (
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
                    {searchResults.map((product) => (
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
                            ${product.price}
                          </Typography>
                          {product.originalPrice && (
                            <Typography variant="body2" sx={{ 
                              textDecoration: 'line-through',
                              color: '#999',
                              fontSize: '12px'
                            }}>
                              ${product.originalPrice}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
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
                      No results found
                    </Typography>
                    <Typography variant="body2">
                      Try different keywords or browse our categories
                    </Typography>
                  </Box>
                )}
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
                  Search Products
                </Typography>
                <Typography variant="body2">
                  Enter keywords to search for products you want
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
