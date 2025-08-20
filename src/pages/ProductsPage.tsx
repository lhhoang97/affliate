import React, { useState, useMemo, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Rating,
  LinearProgress
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Product } from '../types';
import { fetchProducts } from '../services/productService';
import { useCart } from '../contexts/CartContext';
import CategoryBreadcrumb from '../components/CategoryBreadcrumb';
import CategoryNavigation from '../components/CategoryNavigation';

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();
  
  // Get category and search from URL parameters
  const categoryFromUrl = searchParams.get('category');
  const searchFromUrl = searchParams.get('search');
  
  // Data
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetchProducts()
      .then((items) => { if (isMounted) setAllProducts(items); })
      .finally(() => { if (isMounted) setIsLoading(false); });
    return () => { isMounted = false; };
  }, []);


  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || '');
  const [currentPage, setCurrentPage] = useState(1);
  
  const itemsPerPage = 12;

  // Filter products by category
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    return filtered;
  }, [allProducts, selectedCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    if (product.externalUrl) {
      window.open(product.externalUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };





  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Category Navigation */}
      <CategoryNavigation 
        selectedCategory={selectedCategory}
        onCategorySelect={(categoryId) => {
          setSelectedCategory(categoryId);
          setCurrentPage(1);
        }}
      />
      
      <Container maxWidth="lg" sx={{ py: 2 }}>


        {/* Category Breadcrumb */}
        {selectedCategory && (
          <CategoryBreadcrumb
            categoryName={selectedCategory}
            productCount={filteredProducts.length}
            onClear={() => setSelectedCategory('')}
          />
        )}









      {/* Products Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(5, 1fr)', xl: 'repeat(6, 1fr)' }, gap: 2 }}>
        {paginatedProducts.map((product) => (
          <Card 
            key={product.id}
            sx={{ 
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              borderRadius: 1,
              border: '1px solid #e9ecef',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }
            }}
            onClick={() => handleProductClick(product.id)}
          >
            <Box sx={{ position: 'relative' }}>
              <CardMedia
                component="img"
                height="160"
                image={product.image}
                alt={product.name}
                sx={{ objectFit: 'cover' }}
              />
              {product.originalPrice && product.originalPrice > product.price && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    padding: '2px 6px',
                    borderRadius: '2px',
                    lineHeight: 1
                  }}
                >
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </Box>
              )}
              {!product.inStock && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography variant="h6" color="white" sx={{ fontWeight: 'bold' }}>
                    Out of Stock
                  </Typography>
                </Box>
              )}
            </Box>
            <CardContent sx={{ p: 2 }}>
              {/* Category Label */}
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#666',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  mb: 1
                }}
              >
                {product.category === 'Electronics' ? 'ĐIỆN THOẠI THÔNG MINH' : 
                 product.category === 'Fashion' ? 'THỜI TRANG' :
                 product.category === 'Home & Garden' ? 'NHÀ CỬA' :
                 product.category.toUpperCase()}
              </Typography>
              
              {/* Product Name */}
              <Typography 
                variant="body1" 
                component="h3" 
                sx={{ 
                  fontWeight: 'bold',
                  color: '#333',
                  fontSize: '14px',
                  lineHeight: 1.3,
                  mb: 1
                }}
              >
                {product.name}
              </Typography>
              
              {/* Color Variants - Horizontal Layout */}
              <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
                {product.category === 'Electronics' && product.name.toLowerCase().includes('iphone') ? (
                  // iPhone color variants - horizontal layout
                  <>
                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#000', border: '1px solid #ddd' }} />
                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#4CAF50', border: '1px solid #ddd' }} />
                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#FFEB3B', border: '1px solid #ddd' }} />
                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#9C27B0', border: '1px solid #ddd' }} />
                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#F44336', border: '1px solid #ddd' }} />
                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#fff', border: '1px solid #ddd' }} />
                  </>
                ) : product.category === 'Fashion' && product.name.toLowerCase().includes('nike') ? (
                  // Nike shoe color variants
                  <>
                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#F44336', border: '1px solid #ddd' }} />
                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#2196F3', border: '1px solid #ddd' }} />
                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#4CAF50', border: '1px solid #ddd' }} />
                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#FF9800', border: '1px solid #ddd' }} />
                  </>
                ) : (
                  // Default color variants for other products
                  <>
                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#2196F3', border: '1px solid #ddd' }} />
                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#F44336', border: '1px solid #ddd' }} />
                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#4CAF50', border: '1px solid #ddd' }} />
                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#FF9800', border: '1px solid #ddd' }} />
                  </>
                )}
              </Box>
              
              {/* Price */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: '#e74c3c',
                    fontSize: '16px'
                  }}
                >
                  ${product.price.toLocaleString()}
                </Typography>
                {product.originalPrice && product.originalPrice > product.price && (
                  <Typography
                    variant="body2"
                    sx={{ 
                      textDecoration: 'line-through',
                      color: '#999',
                      fontSize: '12px'
                    }}
                  >
                    ${product.originalPrice.toLocaleString()}
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          {/* Assuming Pagination component is available or needs to be imported */}
          {/* For now, leaving a placeholder */}
          {/* <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            color="primary"
            size="large"
          /> */}
        </Box>
      )}

      {filteredProducts.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No products found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try selecting a different category
          </Typography>
        </Box>
      )}
      </Container>
    </Box>
  );
};

export default ProductsPage;
