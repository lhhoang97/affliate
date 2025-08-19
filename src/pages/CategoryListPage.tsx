import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper
} from '@mui/material';
import CategoryList from '../components/CategoryList';

const CategoryListPage: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', gap: 4 }}>
          {/* Category List Sidebar */}
          <Box sx={{ flexShrink: 0 }}>
            <CategoryList />
          </Box>
          
          {/* Main Content Area */}
          <Box sx={{ flex: 1 }}>
            <Paper sx={{ p: 4, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50', mb: 3 }}>
                Danh Mục Sản Phẩm
              </Typography>
              
              <Typography variant="body1" sx={{ color: '#6c757d', lineHeight: 1.6, mb: 3 }}>
                Di chuột vào các danh mục bên trái để xem các sản phẩm con. Mỗi danh mục sẽ hiển thị 
                một dropdown menu với các sản phẩm con khi bạn hover chuột vào.
              </Typography>
              
              <Box sx={{ 
                backgroundColor: '#e3f2fd', 
                p: 3, 
                borderRadius: 2,
                border: '1px solid #bbdefb'
              }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}>
                  Hướng dẫn sử dụng:
                </Typography>
                <Box component="ul" sx={{ color: '#1976d2', pl: 2 }}>
                  <li>Di chuột vào danh mục để xem sản phẩm con</li>
                  <li>Click vào danh mục để xem tất cả sản phẩm</li>
                  <li>Click vào sản phẩm con để lọc theo danh mục</li>
                  <li>Menu sẽ tự động đóng khi rời chuột</li>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CategoryListPage;
