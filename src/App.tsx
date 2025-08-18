import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CategoriesPage from './pages/CategoriesPage';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminProductsPage from './pages/AdminProductsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <CartProvider>
            <Router>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={
                  <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                    <Header />
                    <Box component="main" sx={{ flexGrow: 1 }}>
                      <HomePage />
                    </Box>
                    <Footer />
                  </Box>
                } />
                <Route path="/products" element={
                  <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                    <Header />
                    <Box component="main" sx={{ flexGrow: 1 }}>
                      <ProductsPage />
                    </Box>
                    <Footer />
                  </Box>
                } />
                <Route path="/product/:id" element={
                  <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                    <Header />
                    <Box component="main" sx={{ flexGrow: 1 }}>
                      <ProductDetailPage />
                    </Box>
                    <Footer />
                  </Box>
                } />
                <Route path="/categories" element={
                  <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                    <Header />
                    <Box component="main" sx={{ flexGrow: 1 }}>
                      <CategoriesPage />
                    </Box>
                    <Footer />
                  </Box>
                } />
                <Route path="/login" element={
                  <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                    <Header />
                    <Box component="main" sx={{ flexGrow: 1 }}>
                      <LoginPage />
                    </Box>
                    <Footer />
                  </Box>
                } />
                <Route path="/register" element={
                  <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                    <Header />
                    <Box component="main" sx={{ flexGrow: 1 }}>
                      <RegisterPage />
                    </Box>
                    <Footer />
                  </Box>
                } />
                <Route path="/cart" element={
                  <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                    <Header />
                    <Box component="main" sx={{ flexGrow: 1 }}>
                      <CartPage />
                    </Box>
                    <Footer />
                  </Box>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                      <Header />
                      <Box component="main" sx={{ flexGrow: 1 }}>
                        <ProfilePage />
                      </Box>
                      <Footer />
                    </Box>
                  </ProtectedRoute>
                } />

                {/* Admin routes */}
                <Route path="/admin" element={
                  <AdminProtectedRoute>
                    <AdminLayout />
                  </AdminProtectedRoute>
                }>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="categories" element={<CategoriesPage />} />
                  <Route path="users" element={<div>User Management (Coming Soon)</div>} />
                  <Route path="settings" element={<div>Settings (Coming Soon)</div>} />
                </Route>
              </Routes>
            </Router>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
