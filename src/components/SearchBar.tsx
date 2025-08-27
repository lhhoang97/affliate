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
  Divider,
  useMediaQuery,
  useTheme
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

  const handleClearClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    handleInputChange('');
  };

  // Prevent zoom on iOS when focusing input
  const handleInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    handleFocus();
    // Ensure proper viewport on mobile
    if (isMobile) {
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1');
      }
    }
  };

  const handleInputBlur = () => {
    handleBlur();
    // Restore viewport after blur
    if (isMobile) {
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1');
      }
    }
  };

      return (
      <Box 
        ref={anchorRef} 
        sx={{ 
          position: 'relative', 
          width: '100%',
          maxWidth: '100%',
          overflow: 'hidden'
        }}
      >
        <TextField
          fullWidth
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          size="small"
          sx={{
            width: '100%',
            '& .MuiOutlinedInput-root': {
              backgroundColor: { xs: '#f8fafc', sm: '#f1f3f4' },
              borderRadius: { xs: '8px', sm: '24px' },
              border: { xs: '1px solid #e2e8f0', sm: 'none' },
              '&:hover': {
                backgroundColor: { xs: '#f1f5f9', sm: '#e8eaed' },
                borderColor: { xs: '#cbd5e1', sm: 'transparent' }
              },
              '&.Mui-focused': {
                backgroundColor: 'white',
                boxShadow: { xs: '0 2px 8px rgba(59, 130, 246, 0.12)', sm: '0 2px 8px rgba(0,0,0,0.1)' },
                borderColor: { xs: '#3b82f6', sm: 'transparent' }
              }
            },
            '& .MuiOutlinedInput-input': {
              fontSize: { xs: '14px', sm: '16px' }, // Prevent zoom on iOS
              padding: { xs: '10px 12px', sm: '12px 16px' },
              fontWeight: { xs: 400, sm: 400 },
              '&::placeholder': {
                fontSize: { xs: '14px', sm: '16px' },
                color: { xs: '#94a3b8', sm: '#666' },
                fontWeight: { xs: 400, sm: 400 }
              }
            },
            '& .MuiInputAdornment-root': {
              margin: { xs: '0 8px', sm: '0 8px' }
            },
            // Mobile-specific fixes
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none'
            },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              border: 'none'
            }
          }}
                  InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ 
                  color: { xs: '#94a3b8', sm: '#666' }, 
                  fontSize: { xs: '18px', sm: '20px' },
                  cursor: 'pointer'
                }} />
              </InputAdornment>
            ),
            endAdornment: value && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={handleClearClick}
                  edge="end"
                  sx={{
                    p: { xs: 1, sm: 1 },
                    color: { xs: '#94a3b8', sm: '#666' },
                    '&:hover': {
                      backgroundColor: { xs: 'rgba(59, 130, 246, 0.1)', sm: 'rgba(0,0,0,0.04)' }
                    }
                  }}
                >
                  <Clear sx={{ fontSize: { xs: '16px', sm: '18px' } }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
      />

      {/* Search Suggestions Dropdown */}
      <Popper
        open={showDropdown && showSuggestions}
        anchorEl={anchorRef.current}
        placement={isMobile ? "bottom" : "bottom-start"}
        sx={{ 
          zIndex: 1300, 
          width: isMobile ? '100vw' : anchorRef.current?.offsetWidth,
          maxWidth: isMobile ? '100vw' : '400px',
          left: isMobile ? '0 !important' : 'auto',
          right: isMobile ? '0 !important' : 'auto'
        }}
      >
        <Paper
          elevation={isMobile ? 8 : 8}
          sx={{
            mt: { xs: 0.5, sm: 1 },
            borderRadius: { xs: '8px', sm: 2 },
            maxHeight: { xs: '40vh', sm: 400 },
            overflow: 'auto',
            mx: { xs: 1, sm: 0 },
            border: { xs: '1px solid #e2e8f0', sm: 'none' },
            boxShadow: { 
              xs: '0 4px 12px rgba(0, 0, 0, 0.1)', 
              sm: '0 2px 8px rgba(0,0,0,0.1)' 
            }
          }}
        >
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <>
              <Box sx={{ p: { xs: 2, sm: 2 }, pb: { xs: 1, sm: 1 } }}>
                <Typography variant="subtitle2" sx={{ 
                  color: { xs: '#475569', sm: '#666' }, 
                  fontWeight: 600,
                  fontSize: { xs: '0.8rem', sm: '0.875rem' }
                }}>
                  Recent Searches
                </Typography>
              </Box>
              <List dense>
                {recentSearches.slice(0, 5).map((search, index) => (
                  <ListItem
                    key={index}
                    onClick={() => handleSuggestionClick(search)}
                    sx={{ 
                      py: { xs: 1.5, sm: 1 },
                      px: { xs: 2, sm: 2 },
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: { xs: '#f1f5f9', sm: '#f5f5f5' }
                      },
                      '&:active': {
                        backgroundColor: { xs: '#e2e8f0', sm: '#e0e0e0' }
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: { xs: 36, sm: 36 } }}>
                      <History sx={{ 
                        fontSize: { xs: 16, sm: 18 }, 
                        color: { xs: '#64748b', sm: '#666' } 
                      }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={search}
                      primaryTypographyProps={{
                        fontSize: { xs: '0.9rem', sm: '0.9rem' },
                        color: { xs: '#1e293b', sm: '#333' },
                        fontWeight: { xs: 400, sm: 400 }
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
              <Box sx={{ p: { xs: 2, sm: 2 }, pb: { xs: 1, sm: 1 } }}>
                <Typography variant="subtitle2" sx={{ 
                  color: { xs: '#475569', sm: '#666' }, 
                  fontWeight: 600,
                  fontSize: { xs: '0.8rem', sm: '0.875rem' }
                }}>
                  Trending Searches
                </Typography>
              </Box>
              <Box sx={{ p: { xs: 2, sm: 2 }, pt: 0 }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: { xs: 1, sm: 1 },
                  justifyContent: { xs: 'center', sm: 'flex-start' }
                }}>
                  {trendingSearches.slice(0, isMobile ? 6 : 8).map((trend, index) => (
                    <Chip
                      key={index}
                      label={trend}
                      size={isMobile ? "small" : "small"}
                      icon={<TrendingUp sx={{ fontSize: { xs: 14, sm: 16 } }} />}
                      onClick={() => handleSuggestionClick(trend)}
                      sx={{
                        cursor: 'pointer',
                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                        fontWeight: { xs: 400, sm: 400 },
                        height: { xs: 28, sm: 32 },
                        '&:hover': {
                          backgroundColor: { xs: '#dbeafe', sm: '#e3f2fd' }
                        },
                        '&:active': {
                          backgroundColor: { xs: '#bfdbfe', sm: '#bbdefb' }
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </>
          )}

          {/* Quick Categories */}
          <Divider sx={{ my: { xs: 1, sm: 0 } }} />
          <Box sx={{ p: { xs: 2.5, sm: 2 } }}>
            <Typography variant="subtitle2" sx={{ 
              color: { xs: '#475569', sm: '#666' }, 
              fontWeight: 600, 
              mb: { xs: 1.5, sm: 1 },
              fontSize: { xs: '0.9rem', sm: '0.875rem' }
            }}>
              Popular Categories
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: { xs: 1.5, sm: 1 },
              justifyContent: { xs: 'center', sm: 'flex-start' }
            }}>
              {['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Toys'].map((category) => (
                <Chip
                  key={category}
                  label={category}
                  size={isMobile ? "medium" : "small"}
                  icon={<LocalOffer sx={{ fontSize: { xs: 18, sm: 16 } }} />}
                  onClick={() => handleSuggestionClick(category)}
                  sx={{
                    cursor: 'pointer',
                    fontSize: { xs: '0.9rem', sm: '0.875rem' },
                    fontWeight: { xs: 500, sm: 400 },
                    height: { xs: 36, sm: 32 },
                    '&:hover': {
                      backgroundColor: { xs: '#dbeafe', sm: '#e3f2fd' }
                    },
                    '&:active': {
                      backgroundColor: { xs: '#bfdbfe', sm: '#bbdefb' }
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