import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import analytics from './services/analyticsService';

import Header from './components/Header';
import Footer from './components/Footer';
import PageTracker from './components/PageTracker';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SearchPage from './pages/SearchPage';
import CategoriesPage from './pages/CategoriesPage';
import CategoryDetailPage from './pages/CategoryDetailPage';

import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import DealsPage from './pages/DealsPage';
import ReviewsPage from './pages/ReviewsPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminCategoriesPage from './pages/AdminCategoriesPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import AdminPriceUpdatePage from './pages/AdminPriceUpdatePage';
import AdminSectionManagementPage from './pages/AdminSectionManagementPage';
import AdminSliderProductsPage from './pages/AdminSliderProductsPage';
import AdminSectionProductsPage from './pages/AdminSectionProductsPage';
import AdminMenuManagementPage from './pages/AdminMenuManagementPage';
import AdminCouponManagementPage from './pages/AdminCouponManagementPage';
import AdminDealManagementPage from './pages/AdminDealManagementPage';
import AdminDealConfigPage from './pages/AdminDealConfigPage';
import AdminAIAssistantPage from './pages/AdminAIAssistantPage';
import ProductCardDemo from './pages/ProductCardDemo';
import NotFoundPage from './pages/NotFoundPage';
import ServerErrorPage from './pages/ServerErrorPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { OrdersProvider } from './contexts/OrdersContext';
import { ProfileProvider } from './contexts/ProfileContext';
import { ProductProvider } from './contexts/ProductContext';
import SupabaseTest from './components/SupabaseTest';

const AdminAmazonPage = React.lazy(() => import('./pages/AdminAmazonPage'));

// Create a SlickDeals-inspired theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1a73e8', // Google Blue - modern and trustworthy
      light: '#4285f4',
      dark: '#0d47a1',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#34a853', // Google Green - for success/deals
      light: '#66bb6a',
      dark: '#2e7d32',
    },
    error: {
      main: '#ea4335', // Google Red
    },
    warning: {
      main: '#fbbc04', // Google Yellow
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#202124',
      secondary: '#5f6368',
    },
    divider: '#dadce0',
  },
  typography: {
    fontFamily: '"Google Sans", "Roboto", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontWeight: 400,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 400,
      fontSize: '2rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 500,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.125rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
      fontSize: '0.875rem',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
          padding: '8px 16px',
          fontSize: '0.875rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          },
        },
        outlined: {
          borderWidth: '1px',
          '&:hover': {
            borderWidth: '1px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
          border: '1px solid #e8eaed',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#202124',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          borderBottom: '1px solid #e8eaed',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
          fontSize: '0.75rem',
        },
        colorPrimary: {
          backgroundColor: '#e8f0fe',
          color: '#1a73e8',
        },
        colorSecondary: {
          backgroundColor: '#e6f4ea',
          color: '#34a853',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#dadce0',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1a73e8',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        },
      },
    },
  },
});

function App() {
  console.log('App component rendering...');
  
  // Initialize Google Analytics
  useEffect(() => {
    analytics.initialize();
  }, []);
  
  // Simple fallback component
  if (!process.env.REACT_APP_SUPABASE_URL || !process.env.REACT_APP_SUPABASE_ANON_KEY) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Configuration Error</h1>
        <p>Supabase is not configured. Please check your .env file.</p>
        <p>REACT_APP_SUPABASE_URL: {process.env.REACT_APP_SUPABASE_URL ? 'Set' : 'Not set'}</p>
        <p>REACT_APP_SUPABASE_ANON_KEY: {process.env.REACT_APP_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}</p>
      </div>
    );
  }
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
              <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <OrdersProvider>
                <ProfileProvider>
                  <ProductProvider>
              <Router>
                <PageTracker />
            <Routes>
              {/* Regular layout with header/footer */}
              <Route path="/*" element={
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                  <Header />
                  <main style={{ flex: 1 }}>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<HomePage />} />
                      <Route path="/search" element={<SearchPage />} />
                      <Route path="/products" element={<ProductsPage />} />
                      <Route path="/product/:id" element={<ProductDetailPage />} />
                      <Route path="/categories" element={<CategoriesPage />} />
                      <Route path="/category/:slug" element={<CategoryDetailPage />} />
              
                      <Route path="/deals" element={<DealsPage />} />
                      <Route path="/reviews" element={<ReviewsPage />} />
                      <Route path="/about" element={<AboutUsPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/privacy" element={<PrivacyPolicyPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/test-supabase" element={<SupabaseTest />} />
                      <Route path="/product-card-demo" element={<ProductCardDemo />} />
                      
                      {/* Protected Routes */}
                                <Route path="/cart" element={
                                  <ProtectedRoute>
                                    <CartPage />
                                  </ProtectedRoute>
                                } />
                                <Route path="/wishlist" element={
                                  <ProtectedRoute>
                                    <WishlistPage />
                                  </ProtectedRoute>
                                } />
                                <Route path="/profile" element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      } />
                      <Route path="/orders" element={
                        <ProtectedRoute>
                          <OrdersPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/orders/:orderId" element={
                        <ProtectedRoute>
                          <OrderDetailPage />
                        </ProtectedRoute>
                      } />
                      
                      {/* Admin Routes */}
                      <Route path="/admin" element={
                        <AdminProtectedRoute>
                          <AdminLayout />
                        </AdminProtectedRoute>
                      }>
                        <Route index element={<AdminDashboard />} />
                        <Route path="products" element={<AdminProductsPage />} />
                        <Route path="categories" element={<AdminCategoriesPage />} />
                        <Route path="price-updates" element={<AdminPriceUpdatePage />} />
                        <Route path="section-management" element={<AdminSectionManagementPage />} />
                                                    <Route path="slider-products" element={<AdminSliderProductsPage />} />
                            <Route path="section-products" element={<AdminSectionProductsPage />} />
                        <Route path="menu-management" element={<AdminMenuManagementPage />} />
                        <Route path="coupon-management" element={<AdminCouponManagementPage />} />
                        <Route path="deal-management" element={<AdminDealManagementPage />} />
                        <Route path="deal-config" element={<AdminDealConfigPage />} />
                        <Route path="ai-assistant" element={<AdminAIAssistantPage />} />
                        <Route path="amazon" element={
                          <Suspense fallback={<div>Loading Amazon Products...</div>}>
                            <AdminAmazonPage />
                          </Suspense>
                        } />
                        <Route path="users" element={<AdminUsersPage />} />
                        <Route path="orders" element={<AdminOrdersPage />} />
                        <Route path="settings" element={<AdminSettingsPage />} />
                      </Route>
                      
                      {/* Error Pages */}
                      <Route path="/500" element={<ServerErrorPage />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              } />
            </Routes>
                        </Router>
                  </ProductProvider>
                </ProfileProvider>
              </OrdersProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
