import React from 'react';
import { IconButton, Menu, MenuItem, Divider } from '@mui/material';
import { AccountCircle, Login, PersonAdd } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface AuthButtonsProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onMenuClick: (event: React.MouseEvent<HTMLElement>) => void;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ anchorEl, onClose, onMenuClick }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose();
  };

  // For affiliate model, show minimal auth options
  // Only show login/register for potential collaborators
  const showAuthOptions = false; // Set to true when you have CTV system

  if (!showAuthOptions) {
    return null; // Hide auth buttons for pure affiliate model
  }

  if (isAuthenticated && user) {
    return (
      <>
        <IconButton
          size="large"
          edge="end"
          aria-label="account of current user"
          aria-controls="profile-menu"
          aria-haspopup="true"
          onClick={onMenuClick}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        
        <Menu
          id="profile-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={onClose}
          sx={{
            '& .MuiPaper-root': {
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              minWidth: 200
            }
          }}
        >
          <MenuItem onClick={() => { navigate('/profile'); onClose(); }}>
            Profile
          </MenuItem>
          <MenuItem onClick={() => { navigate('/orders'); onClose(); }}>
            Orders
          </MenuItem>
          {user?.role === 'admin' && (
            <MenuItem onClick={() => { navigate('/admin'); onClose(); }} sx={{ color: '#dc3545', fontWeight: 600 }}>
              🔧 Admin Panel
            </MenuItem>
          )}
          <Divider />
          <MenuItem onClick={handleLogout}>
            Logout
          </MenuItem>
        </Menu>
      </>
    );
  }

  return (
    <>
      <IconButton
        size="large"
        edge="end"
        aria-label="account menu"
        aria-controls="account-menu"
        aria-haspopup="true"
        onClick={onMenuClick}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
      
      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            minWidth: 200
          }
        }}
      >
        <MenuItem 
          onClick={() => { 
            navigate('/login'); 
            onClose(); 
          }}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            py: 1.5
          }}
        >
          <Login sx={{ fontSize: 20 }} />
          Login
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => { 
            navigate('/register'); 
            onClose(); 
          }}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            py: 1.5
          }}
        >
          <PersonAdd sx={{ fontSize: 20 }} />
          Register
        </MenuItem>
      </Menu>
    </>
  );
};

export default AuthButtons;
