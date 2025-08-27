import React, { useRef, useState } from 'react';
import {
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Avatar,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Search,
  Clear,
  ShoppingBag
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';

interface SearchBarSimpleProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  products?: Product[];
}

const SearchBarSimple: React.FC<SearchBarSimpleProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = "Search products...",
  products = []
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  // Filter products based on search query
  const filteredProducts = value.trim() 
    ? products.filter(product =>
        product.name.toLowerCase().includes(value.toLowerCase()) ||
        product.description?.toLowerCase().includes(value.toLowerCase()) ||
        product.category?.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log('Simple SearchBar input change:', newValue);
    onChange(newValue);
    
    if (newValue.trim()) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleProductClick = (product: Product) => {
    setShowDropdown(false);
    onChange('');
    navigate(`/product/${product.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (value.trim()) {
        onSearch(value.trim());
        setShowDropdown(false);
      }
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (value.trim()) {
      setShowDropdown(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding dropdown to allow clicks
    setTimeout(() => setShowDropdown(false), 150);
  };

  const handleClear = () => {
    onChange('');
    setShowDropdown(false);
  };

  return (
    <Box ref={anchorRef} sx={{ position: 'relative', width: '100%', maxWidth: '100%' }}>
      {/* Custom Input */}
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: { xs: '#f8fafc', sm: '#f1f3f4' },
          borderRadius: { xs: '8px', sm: '24px' },
          border: { xs: '1px solid #e2e8f0', sm: 'none' },
          padding: { xs: '0 12px', sm: '0 16px' },
          height: { xs: '44px', sm: '48px' },
          minHeight: { xs: '44px', sm: '48px' },
          boxShadow: isFocused 
            ? { xs: '0 2px 8px rgba(59, 130, 246, 0.12)', sm: '0 2px 8px rgba(0,0,0,0.1)' }
            : 'none',
          borderColor: isFocused ? { xs: '#3b82f6', sm: 'transparent' } : 'transparent',
          '&:hover': {
            backgroundColor: { xs: '#f1f5f9', sm: '#e8eaed' },
            borderColor: { xs: '#cbd5e1', sm: 'transparent' }
          }
        }}
      >
        <Search 
          sx={{ 
            color: { xs: '#94a3b8', sm: '#666' },
            fontSize: { xs: '18px', sm: '20px' },
            mr: 1,
            flexShrink: 0
          }} 
        />
        
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          style={{
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            flex: 1,
            fontSize: '16px',
            fontWeight: 400,
            color: '#000000',
            padding: '0',
            fontFamily: 'inherit',
            width: '100%',
            minWidth: 0
          }}
        />
        
        {value && (
          <Clear
            onClick={handleClear}
            sx={{
              color: { xs: '#94a3b8', sm: '#666' },
              fontSize: { xs: '16px', sm: '18px' },
              cursor: 'pointer',
              ml: 1,
              p: 0.5,
              flexShrink: 0,
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.04)',
                borderRadius: '50%'
              }
            }}
          />
        )}
      </Box>

      {/* Dropdown */}
      {showDropdown && filteredProducts.length > 0 && (
        <Paper
          elevation={8}
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            mt: 1,
            borderRadius: 2,
            maxHeight: 400,
            overflow: 'auto',
            zIndex: 1300,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
        >
          <Box sx={{ p: 2, pb: 1 }}>
            <Typography variant="subtitle2" sx={{ 
              color: '#475569', 
              fontWeight: 600,
              fontSize: '0.875rem'
            }}>
              Products
            </Typography>
          </Box>
          
          <List dense>
            {filteredProducts.map((product) => (
              <ListItem
                key={product.id}
                onClick={() => handleProductClick(product)}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: '#f5f5f5'
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 46 }}>
                  <Avatar
                    src={product.image}
                    sx={{ 
                      width: 36, 
                      height: 36,
                      borderRadius: 1
                    }}
                  >
                    <ShoppingBag sx={{ fontSize: 18 }} />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={product.name}
                  secondary={`${product.category} • $${product.price}`}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      color: '#333'
                    },
                    '& .MuiListItemText-secondary': {
                      fontSize: '0.8rem',
                      color: '#666'
                    }
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default SearchBarSimple;
