import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Divider
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Thông Tin',
      links: [
        { text: 'Về Chúng Tôi', path: '/about' },
        { text: 'Liên Hệ', path: '/contact' },
        { text: 'Trung Tâm Trợ Giúp', path: '/help' }
      ]
    },
    {
      title: 'Quy Định & Hướng Dẫn',
      links: [
        { text: 'Quy Định & Hướng Dẫn', path: '/terms' },
        { text: 'Điều Khoản & Điều Kiện', path: '/terms' },
        { text: 'Chính Sách Bảo Mật', path: '/privacy' },
        { text: 'Chính Sách Cookie', path: '/cookies' },
        { text: 'Cài Đặt Bảo Mật', path: '/security' }
      ]
    }
  ];

  return (
    <Box sx={{ backgroundColor: '#f8f9fa', color: '#333333', mt: 'auto', borderTop: '1px solid #e9ecef' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Main Footer Content */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, 
          gap: 4 
        }}>
          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <Box key={index}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2, color: '#2c3e50', fontSize: '0.875rem' }}>
                {section.title}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {section.links.map((link, linkIndex) => (
                  <Link
                    key={linkIndex}
                    component={RouterLink}
                    to={link.path}
                    sx={{
                      color: '#6c757d',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      '&:hover': {
                        color: '#007bff',
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    {link.text}
                  </Link>
                ))}
              </Box>
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 3, borderColor: '#dee2e6' }} />

        {/* Bottom Footer */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
            GiaTotDay
          </Typography>
          
          <Typography variant="body2" sx={{ color: '#6c757d' }}>
            ©{currentYear} GiaTotDay
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
