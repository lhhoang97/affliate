import React, { useRef, useState, useEffect } from 'react';
import {
  TextField,
  InputAdornment,
  Box,
  IconButton,
  Popper,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Chip,
  Divider
} from '@mui/material';
import {
  Search,
  Clear,
  TrendingUp,
  History,
  LocalOffer
} from '@mui/icons-material';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  showSuggestions?: boolean;
  recentSearches?: string[];
  trendingSearches?: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = "What are you looking for?",
  showSuggestions = true,
  recentSearches = [],
  trendingSearches = []
}) => {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleInputChange = (newValue: string) => {
    onChange(newValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (value.trim()) {
        handleSearch(value.trim());
      }
    }
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      onSearch(query);
      setShowDropdown(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    handleSearch(suggestion);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (showSuggestions && (recentSearches.length > 0 || trendingSearches.length > 0)) {
      setShowDropdown(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding dropdown to allow clicking on suggestions
    setTimeout(() => setShowDropdown(false), 200);
  };

  return (
    <Box ref={anchorRef} sx={{ position: 'relative', width: '100%' }}>
      <TextField
        fullWidth
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        size="medium"
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#f1f3f4',
            borderRadius: '24px',
            '&:hover': {
              backgroundColor: '#e8eaed'
            },
            '&.Mui-focused': {
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }
          },
          '& .MuiOutlinedInput-input': {
            fontSize: { xs: '14px', sm: '16px' },
            padding: { xs: '8px 12px', sm: '12px 16px' }
          },
          '& .MuiInputAdornment-root': {
            margin: { xs: '0 4px', sm: '0 8px' }
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: '#666', fontSize: { xs: '18px', sm: '20px' } }} />
            </InputAdornment>
          ),
          endAdornment: value && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => handleInputChange('')}
                edge="end"
                sx={{
                  p: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.04)'
                  }
                }}
              >
                <Clear sx={{ fontSize: { xs: '16px', sm: '20px' } }} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Search Suggestions Dropdown */}
      <Popper
        open={showDropdown && showSuggestions}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        sx={{ zIndex: 1300, width: anchorRef.current?.offsetWidth }}
      >
        <Paper
          elevation={8}
          sx={{
            mt: 1,
            borderRadius: 2,
            maxHeight: 400,
            overflow: 'auto'
          }}
        >
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <>
              <Box sx={{ p: 2, pb: 1 }}>
                <Typography variant="subtitle2" sx={{ color: '#666', fontWeight: 600 }}>
                  Recent Searches
                </Typography>
              </Box>
              <List dense>
                {recentSearches.slice(0, 5).map((search, index) => (
                  <ListItem
                    key={index}
                    onClick={() => handleSuggestionClick(search)}
                    sx={{ 
                      py: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#f5f5f5'
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <History sx={{ fontSize: 18, color: '#666' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={search}
                      primaryTypographyProps={{
                        fontSize: '0.9rem',
                        color: '#333'
                      }}
                    />
                  </ListItem>
                ))}
              </List>
              <Divider />
            </>
          )}

          {/* Trending Searches */}
          {trendingSearches.length > 0 && (
            <>
              <Box sx={{ p: 2, pb: 1 }}>
                <Typography variant="subtitle2" sx={{ color: '#666', fontWeight: 600 }}>
                  Trending Searches
                </Typography>
              </Box>
              <Box sx={{ p: 2, pt: 0 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {trendingSearches.slice(0, 8).map((trend, index) => (
                    <Chip
                      key={index}
                      label={trend}
                      size="small"
                      icon={<TrendingUp sx={{ fontSize: 16 }} />}
                      onClick={() => handleSuggestionClick(trend)}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: '#e3f2fd'
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </>
          )}

          {/* Quick Categories */}
          <Divider />
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ color: '#666', fontWeight: 600, mb: 1 }}>
              Popular Categories
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Toys'].map((category) => (
                <Chip
                  key={category}
                  label={category}
                  size="small"
                  icon={<LocalOffer sx={{ fontSize: 16 }} />}
                  onClick={() => handleSuggestionClick(category)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#e3f2fd'
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        </Paper>
      </Popper>
    </Box>
  );
};

export default SearchBar;