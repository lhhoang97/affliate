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
    <Box ref={anchorRef} sx={{ position: 'relative', width: '100%' }}>
      {/* Custom Input */}
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: isMobile ? '#ffffff' : '#f1f3f4',
          borderRadius: isMobile ? '8px' : '24px',
          border: isMobile ? '1px solid #e2e8f0' : 'none',
          padding: isMobile ? '0 12px' : '0 16px',
          boxShadow: isFocused 
            ? isMobile 
              ? '0 2px 8px rgba(59, 130, 246, 0.12)' 
              : '0 2px 8px rgba(0,0,0,0.1)'
            : 'none',
          borderColor: isFocused && isMobile ? '#3b82f6' : 'transparent'
        }}
      >
        <Search 
          sx={{ 
            color: isMobile ? '#94a3b8' : '#666',
            fontSize: isMobile ? '18px' : '20px',
            mr: 1
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
            padding: isMobile ? '14px 0' : '12px 0',
            fontFamily: 'inherit'
          }}
        />
        
        {value && (
          <Clear
            onClick={handleClear}
            sx={{
              color: isMobile ? '#94a3b8' : '#666',
              fontSize: isMobile ? '16px' : '18px',
              cursor: 'pointer',
              ml: 1,
              p: 0.5,
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
