import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, Typography, CircularProgress } from '@mui/material';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Debug logging
  console.log('AdminProtectedRoute Debug:', {
    user,
    isAuthenticated,
    isLoading,
    userEmail: user?.email,
    userRole: user?.role
  });

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress />
        <Typography>Checking access permissions...</Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check if user is admin - improved logic
  const isAdmin = user?.email === 'admin@example.com' || user?.role === 'admin';
  
  console.log('Admin check result:', { isAdmin, userEmail: user?.email, userRole: user?.role });
  
  if (!isAdmin) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        flexDirection="column"
        gap={2}
      >
        <Typography variant="h4" color="error">
          Access Denied
        </Typography>
        <Typography>
          You don't have permission to access the admin page.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Email: {user?.email} | Role: {user?.role}
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
