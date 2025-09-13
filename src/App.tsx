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
import EmailConfirmationPage from './pages/EmailConfirmationPage';
import EmailSentPage from './pages/EmailSentPage';
import ResendEmailPage from './pages/ResendEmailPage';
import SmartCheckoutPage from './pages/SmartCheckoutPage';
import AdminBusinessModePage from './pages/AdminBusinessModePage';
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
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import CartProviderWrapper from './components/CartProviderWrapper';
import { WishlistProvider } from './contexts/WishlistContext';
import { OrdersProvider } from './contexts/OrdersContext';
import { ProfileProvider } from './contexts/ProfileContext';
import { ProductProvider } from './contexts/ProductContext';
import { BusinessModeProvider } from './contexts/BusinessModeContext';
import { AffiliateProductProvider } from './contexts/AffiliateProductContext';
import SupabaseTest from './components/SupabaseTest';
import FloatingCartIcon from './components/FloatingCartIcon';

// Lazy load admin pages for better performance
const AdminCategoriesPage = React.lazy(() => import('./pages/AdminCategoriesPage'));
const AdminUsersPage = React.lazy(() => import('./pages/AdminUsersPage'));
const AdminOrdersPage = React.lazy(() => import('./pages/AdminOrdersPage'));
const AdminSettingsPage = React.lazy(() => import('./pages/AdminSettingsPage'));
const AdminPriceUpdatePage = React.lazy(() => import('./pages/AdminPriceUpdatePage'));
const AdminSectionManagementPage = React.lazy(() => import('./pages/AdminSectionManagementPage'));
const AdminSliderProductsPage = React.lazy(() => import('./pages/AdminSliderProductsPage'));
const AdminSectionProductsPage = React.lazy(() => import('./pages/AdminSectionProductsPage'));
const AdminMenuManagementPage = React.lazy(() => import('./pages/AdminMenuManagementPage'));
const AdminCouponManagementPage = React.lazy(() => import('./pages/AdminCouponManagementPage'));
const AdminDealManagementPage = React.lazy(() => import('./pages/AdminDealManagementPage'));
const AdminDealConfigPage = React.lazy(() => import('./pages/AdminDealConfigPage'));
const AdminAIAssistantPage = React.lazy(() => import('./pages/AdminAIAssistantPage'));
const AdminBundleDealsPage = React.lazy(() => import('./pages/AdminBundleDealsPage'));
const AdminAmazonPage = React.lazy(() => import('./pages/AdminAmazonPage'));
const ProductCardDemo = React.lazy(() => import('./pages/ProductCardDemo'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));
const ServerErrorPage = React.lazy(() => import('./pages/ServerErrorPage'));

// Add Suspense wrapper for lazy loaded components
const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <React.Suspense fallback={
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '200px',
      fontSize: '16px',
      color: '#666'
    }}>
      Loading...
    </div>
  }>
    {children}
  </React.Suspense>
);

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
      <BusinessModeProvider>
        <AffiliateProductProvider>
          <AuthProvider>
            <CartProviderWrapper>
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
                      <Route path="/verify-email" element={<EmailConfirmationPage />} />
                      <Route path="/email-sent" element={<EmailSentPage />} />
                      <Route path="/resend-email" element={<ResendEmailPage />} />
                      <Route path="/checkout" element={<SmartCheckoutPage />} />
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
                        <Route path="categories" element={<SuspenseWrapper><AdminCategoriesPage /></SuspenseWrapper>} />
                        <Route path="price-updates" element={<SuspenseWrapper><AdminPriceUpdatePage /></SuspenseWrapper>} />
                        <Route path="section-management" element={<SuspenseWrapper><AdminSectionManagementPage /></SuspenseWrapper>} />
                        <Route path="slider-products" element={<SuspenseWrapper><AdminSliderProductsPage /></SuspenseWrapper>} />
                        <Route path="section-products" element={<SuspenseWrapper><AdminSectionProductsPage /></SuspenseWrapper>} />
                        <Route path="menu-management" element={<SuspenseWrapper><AdminMenuManagementPage /></SuspenseWrapper>} />
                        <Route path="coupon-management" element={<SuspenseWrapper><AdminCouponManagementPage /></SuspenseWrapper>} />
                        <Route path="deal-management" element={<SuspenseWrapper><AdminDealManagementPage /></SuspenseWrapper>} />
                        <Route path="deal-config" element={<SuspenseWrapper><AdminDealConfigPage /></SuspenseWrapper>} />
                        <Route path="bundle-deals" element={<SuspenseWrapper><AdminBundleDealsPage /></SuspenseWrapper>} />
                        <Route path="ai-assistant" element={<SuspenseWrapper><AdminAIAssistantPage /></SuspenseWrapper>} />
                        <Route path="amazon" element={
                          <Suspense fallback={<div>Loading Amazon Products...</div>}>
                            <AdminAmazonPage />
                          </Suspense>
                        } />
                        <Route path="users" element={<SuspenseWrapper><AdminUsersPage /></SuspenseWrapper>} />
                        <Route path="orders" element={<SuspenseWrapper><AdminOrdersPage /></SuspenseWrapper>} />
                        <Route path="business-mode" element={<SuspenseWrapper><AdminBusinessModePage /></SuspenseWrapper>} />
                        <Route path="settings" element={<SuspenseWrapper><AdminSettingsPage /></SuspenseWrapper>} />
                      </Route>
                      
                      {/* Error Pages */}
                      <Route path="/500" element={<SuspenseWrapper><ServerErrorPage /></SuspenseWrapper>} />
                      <Route path="*" element={<SuspenseWrapper><NotFoundPage /></SuspenseWrapper>} />
                    </Routes>
                  </main>
                  <Footer />
                  
                  {/* Floating Cart Icon */}
                  <FloatingCartIcon />
                </div>
              } />
            </Routes>
                    </Router>
                    </ProductProvider>
                  </ProfileProvider>
                </OrdersProvider>
              </WishlistProvider>
            </CartProviderWrapper>
          </AuthProvider>
        </AffiliateProductProvider>
      </BusinessModeProvider>
    </ThemeProvider>
  );
}

export default App;
