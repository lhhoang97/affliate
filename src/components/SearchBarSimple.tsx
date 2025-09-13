import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Modal,
  useMediaQuery,
  useTheme,
  Typography,
  Button,
  Divider
} from '@mui/material';
import {
  Search,
  Clear,
  ArrowBack,
  Delete,
  History
} from '@mui/icons-material';
// Remove unused import
import { Product } from '../types';
import analytics from '../services/analyticsService';

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
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [mobileSearchValue, setMobileSearchValue] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const anchorRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory);
        setSearchHistory(Array.isArray(history) ? history.slice(0, 10) : []);
      } catch (error) {
        console.error('Failed to load search history:', error);
        setSearchHistory([]);
      }
    }
  }, []);

  // Save search to history
  const addToSearchHistory = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    const term = searchTerm.trim();
    const newHistory = [term, ...searchHistory.filter(item => item !== term)].slice(0, 10);
    
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  // Clear search history
  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  // Smart prediction database
  const predictionMap: Record<string, string[]> = {
    'i': ['iPhone', 'iPad', 'iWatch', 'Intel', 'iPhone 15', 'iPhone 14', 'iPhone 13'],
    'ip': ['iPhone', 'iPad', 'iPhone 15', 'iPhone 14', 'iPhone 13', 'iPhone Pro'],
    'iph': ['iPhone', 'iPhone 15', 'iPhone 14', 'iPhone 13', 'iPhone Pro', 'iPhone Pro Max'],
    's': ['Samsung', 'Sony', 'Smart TV', 'Smartphone', 'Samsung Galaxy', 'Surface'],
    'sa': ['Samsung', 'Samsung Galaxy', 'Samsung S24', 'Samsung Note', 'Samsung Tab'],
    'sam': ['Samsung', 'Samsung Galaxy', 'Samsung S24', 'Samsung Galaxy S23'],
    'n': ['Nike', 'Nintendo', 'Notebook', 'Nikon', 'Nokia', 'Nike Air'],
    'ni': ['Nike', 'Nintendo', 'Nikon', 'Nike Air', 'Nike Jordan'],
    'l': ['Laptop', 'LG', 'Lenovo', 'Louis Vuitton', 'LED TV'],
    'la': ['Laptop', 'Laptop Gaming', 'Laptop Dell', 'Laptop HP', 'Laptop Asus'],
    'h': ['HP', 'Headphones', 'Honor', 'Huawei', 'Home'],
    'he': ['Headphones', 'Headphones Sony', 'Headphones Bose', 'Headphones Apple'],
    'm': ['MacBook', 'Mouse', 'Monitor', 'Microsoft', 'Mobile'],
    'ma': ['MacBook', 'MacBook Pro', 'MacBook Air', 'Mac', 'MacBook M3'],
    'a': ['Apple', 'Asus', 'Android', 'AirPods', 'AMD'],
    'ap': ['Apple', 'AirPods', 'Apple Watch', 'Apple iPhone', 'Apple iPad'],
    'd': ['Dell', 'Dell Laptop', 'Desktop', 'Dyson', 'Drone'],
    'g': ['Gaming', 'Google', 'Galaxy', 'Gaming Laptop', 'Guitar'],
    'c': ['Canon', 'Computer', 'Camera', 'Chair', 'Coffee'],
    'p': ['PlayStation', 'Phone', 'Pro', 'PC', 'Perfume']
  };

  // Generate intelligent suggestions
  const getCurrentSuggestions = (searchValue: string): string[] => {
    if (!searchValue.trim()) return [];
    
    const query = searchValue.toLowerCase().trim();
    const suggestions = new Set();
    
    // Add the current search query
    suggestions.add(searchValue.trim());
    
    // Smart predictions based on typed characters
    for (let i = query.length; i >= 1; i--) {
      const prefix = query.substring(0, i);
      if (predictionMap[prefix]) {
        predictionMap[prefix]
          .filter((suggestion: string) => suggestion.toLowerCase().includes(query))
          .forEach((suggestion: string) => suggestions.add(suggestion));
      }
    }
    
    // Product-based suggestions
    products
      .filter(product => 
        product.name.toLowerCase().includes(query) ||
        (product.category && product.category.toLowerCase().includes(query)) ||
        (product.brand && product.brand.toLowerCase().includes(query))
      )
      .slice(0, 5)
      .forEach(product => {
        suggestions.add(product.name);
        if (product.brand) suggestions.add(product.brand);
        if (product.category) suggestions.add(product.category);
      });
    
    // Fuzzy matching for common terms
    const commonTerms = [
      'iPhone', 'Samsung Galaxy', 'MacBook', 'iPad', 'AirPods', 'PlayStation',
      'Nintendo Switch', 'Xbox', 'Dell Laptop', 'HP Laptop', 'Gaming Chair',
      'Smartphone', 'Tablet', 'Headphones', 'Smart Watch', 'Camera', 'TV'
    ];
    
    commonTerms
      .filter(term => term.toLowerCase().includes(query))
      .forEach(term => suggestions.add(term));
    
    return Array.from(suggestions) as string[];
  };

  const searchSuggestions = getCurrentSuggestions(value);
  const mobileSuggestions = getCurrentSuggestions(mobileSearchValue);

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

  const handleSuggestionClick = (suggestion: string) => {
    setShowDropdown(false);
    onChange(suggestion);
    onSearch(suggestion);
    addToSearchHistory(suggestion);
    
    // Track search event
    analytics.trackSearch(suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (value.trim()) {
        onSearch(value.trim());
        addToSearchHistory(value.trim());
        setShowDropdown(false);
        
        // Track search event
        analytics.trackSearch(value.trim());
      }
    }
  };

  const handleFocus = () => {
    console.log('🎯 handleFocus triggered - isMobile:', isMobile, 'current modal state:', showMobileModal);
    if (isMobile && !showMobileModal) {
      // Only open if not already open to prevent conflicts
      setShowMobileModal(true);
      setMobileSearchValue(value || '');
    } else if (!isMobile) {
      setIsFocused(true);
      if (value.trim()) {
        setShowDropdown(true);
      }
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    setTimeout(() => setShowDropdown(false), 150);
  };

  const handleMobileClose = () => {
    console.log('✅ handleMobileClose executed - Current states:', {
      showMobileModal,
      mobileSearchValue,
      value
    });
    setShowMobileModal(false);
    setMobileSearchValue('');
    // Reset focus states to prevent conflicts
    setIsFocused(false);
    setShowDropdown(false);
  };

  const handleMobileSearch = (searchValue: string) => {
    setShowMobileModal(false);
    onChange(searchValue);
    onSearch(searchValue);
    addToSearchHistory(searchValue);
    setMobileSearchValue('');
    
    // Track search event
    analytics.trackSearch(searchValue);
  };

  const handleClear = () => {
    onChange('');
    setShowDropdown(false);
  };

  return (
    <>
      <Box ref={anchorRef} sx={{ position: 'relative', width: '100%', maxWidth: '100%' }}>
        {/* Custom Input */}
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: { xs: '#ffffff', sm: '#f1f3f4' },
            borderRadius: { xs: '8px', sm: '25px' }, // More rounded
            border: { xs: '1px solid #d1d5db', sm: '1px solid #e0e0e0' }, // Add border on desktop too
            padding: { xs: '0 14px', sm: '0 20px' }, // More padding on desktop
            height: { xs: '44px', sm: '52px' }, // Taller on desktop
            minHeight: { xs: '44px', sm: '52px' },
            boxShadow: isFocused 
              ? { xs: '0 0 0 2px rgba(59, 130, 246, 0.2)', sm: '0 2px 8px rgba(0,0,0,0.1)' }
              : { xs: '0 1px 3px rgba(0, 0, 0, 0.1)', sm: 'none' },
            borderColor: isFocused ? { xs: '#3b82f6', sm: '#3b82f6' } : { xs: '#d1d5db', sm: '#e0e0e0' },
            transition: 'all 0.2s ease-in-out',
            cursor: { xs: 'pointer', sm: 'text' }, // Pointer trên mobile
            userSelect: 'none', // Prevent text selection on mobile
            '&:hover': {
              backgroundColor: { xs: '#ffffff', sm: '#e8eaed' },
              borderColor: { xs: '#9ca3af', sm: 'transparent' },
              boxShadow: { xs: '0 2px 4px rgba(0, 0, 0, 0.1)', sm: 'none' }
            }
          }}
          onClick={isMobile ? (e) => {
            e.preventDefault();
            console.log('📱 Mobile search bar clicked');
            handleFocus();
          } : undefined}
        >
          <Search 
            sx={{ 
              color: { xs: '#6b7280', sm: '#666' },
              fontSize: { xs: '18px', sm: '22px' }, // Larger icon on desktop
              mr: { xs: 0.8, sm: 1 },
              flexShrink: 0
            }} 
          />
        
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={isMobile ? undefined : handleFocus}
          onBlur={handleBlur}
          onClick={isMobile ? (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('📱 Input clicked on mobile');
            handleFocus();
          } : undefined}
          placeholder={placeholder}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          readOnly={isMobile} // Read-only trên mobile để trigger modal
          style={{
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            flex: 1,
            fontSize: typeof window !== 'undefined' && window.innerWidth < 600 ? '15px' : '16px',
            fontWeight: 400,
            color: '#000000',
            padding: '0',
            fontFamily: 'inherit',
            width: '100%',
            minWidth: 0,
            lineHeight: '1.2',
            cursor: isMobile ? 'pointer' : 'text',
            pointerEvents: isMobile ? 'auto' : 'auto'
          }}
        />
        
        {value && (
          <Clear
            onClick={handleClear}
            sx={{
              color: { xs: '#6b7280', sm: '#666' },
              fontSize: { xs: '16px', sm: '18px' },
              cursor: 'pointer',
              ml: { xs: 0.8, sm: 1 },
              p: { xs: 0.4, sm: 0.5 },
              flexShrink: 0,
              borderRadius: '50%',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.06)',
                color: '#374151'
              }
            }}
          />
        )}
      </Box>

      {/* Text Suggestions - Exactly like Slickdeals Mobile */}
      {showDropdown && searchSuggestions.length > 0 && (
        <Paper
          elevation={2}
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            mt: { xs: 0.3, sm: 0.5 },
            borderRadius: { xs: '8px', sm: '12px' },
            maxHeight: { xs: 280, sm: 300 },
            overflow: 'auto',
            zIndex: 1300,
            border: { xs: '1px solid #e5e7eb', sm: '1px solid #e0e0e0' },
            backgroundColor: '#ffffff',
            boxShadow: { 
              xs: '0 2px 4px rgba(0, 0, 0, 0.1)', 
              sm: '0 4px 6px rgba(0, 0, 0, 0.1)' 
            }
          }}
        >
          <List sx={{ py: 0 }}>
            {searchSuggestions.map((suggestion: string, index: number) => (
              <ListItem
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                sx={{ 
                  cursor: 'pointer',
                  py: { xs: 0.9, sm: 1 },
                  px: { xs: 1.2, sm: 1.5 },
                  '&:hover': {
                    backgroundColor: '#f8f9fa'
                  },
                  borderBottom: index < searchSuggestions.length - 1 ? '1px solid #f0f0f0' : 'none'
                }}
              >
                <ListItemIcon sx={{ minWidth: { xs: 28, sm: 32 } }}>
                  <Search 
                    sx={{ 
                      fontSize: { xs: 14, sm: 16 },
                      color: '#9ca3af'
                    }} 
                  />
                </ListItemIcon>
                <ListItemText
                  primary={suggestion}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontSize: { xs: '0.85rem', sm: '0.9rem' },
                      fontWeight: 400,
                      color: '#374151',
                      lineHeight: 1.3
                    }
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
      </Box>

      {/* Mobile Fullscreen Search Modal */}
      <Modal
        open={showMobileModal}
        onClose={() => {
          console.log('📱 Modal onClose triggered');
          handleMobileClose();
        }}
        keepMounted={false}
        disableAutoFocus={true}
        disableEnforceFocus={true}
        sx={{
          display: { xs: 'block', sm: 'none' }, // Chỉ hiển thị trên mobile
          zIndex: 9999
        }}
      >
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 9999
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: '#ffffff',
              position: 'relative',
              zIndex: 9999
            }}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔙 NATIVE BUTTON clicked - closing mobile search');
                console.log('📊 Before close - Modal state:', showMobileModal);
                handleMobileClose();
                console.log('📊 After close triggered');
              }}
              style={{
                background: 'rgba(255,255,255,0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '48px',
                minHeight: '48px',
                marginRight: '8px',
                color: '#374151',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease',
                WebkitTapHighlightColor: 'transparent'
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.95)';
                e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.95)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.95)';
              }}
            >
              <ArrowBack sx={{ fontSize: 24 }} />
            </button>
            
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                padding: '0 12px',
                height: '44px',
                border: mobileSearchValue ? '2px solid #3b82f6' : '1px solid #e9ecef',
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <Search 
                sx={{ 
                  fontSize: 18,
                  color: '#6b7280',
                  mr: 1,
                  flexShrink: 0
                }} 
              />
              <input
                type="text"
                value={mobileSearchValue}
                onChange={(e) => setMobileSearchValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && mobileSearchValue.trim()) {
                    handleMobileSearch(mobileSearchValue.trim());
                  }
                }}
                placeholder={placeholder}
                autoFocus
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
                  WebkitTextFillColor: '#000000', // Force black text on iOS
                  WebkitAppearance: 'none' // Remove iOS styling
                }}
              />
              {mobileSearchValue && (
                <Clear
                  onClick={() => setMobileSearchValue('')}
                  sx={{
                    fontSize: 16,
                    color: '#6b7280',
                    cursor: 'pointer',
                    ml: 1,
                    p: 0.5,
                    borderRadius: '50%',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.06)'
                    }
                  }}
                />
              )}
            </Box>
          </Box>

          {/* Suggestions */}
          <Box sx={{ flex: 1, overflow: 'auto', backgroundColor: '#ffffff' }}>
            {mobileSearchValue.trim() === '' ? (
              /* Default state - show search history or popular searches */
              <Box sx={{ p: 2 }}>
                {searchHistory.length > 0 ? (
                  <>
                    {/* Search History Header */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      mb: 2
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <History sx={{ fontSize: 16, color: '#6b7280' }} />
                        <Typography variant="body2" color="text.secondary">
                          Search History
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        onClick={clearSearchHistory}
                        startIcon={<Delete sx={{ fontSize: 14 }} />}
                        sx={{
                          fontSize: '0.75rem',
                          color: '#dc2626',
                          textTransform: 'none',
                          minWidth: 'auto',
                          p: '4px 8px',
                          '&:hover': {
                            backgroundColor: 'rgba(220, 38, 38, 0.05)'
                          }
                        }}
                      >
                        Clear
                      </Button>
                    </Box>
                    
                    {/* Search History List */}
                    <List sx={{ py: 0 }}>
                      {searchHistory.map((item, index) => (
                        <ListItem
                          key={index}
                          onClick={() => handleMobileSearch(item)}
                          sx={{ 
                            cursor: 'pointer',
                            py: 1.2,
                            px: 1,
                            borderRadius: 1,
                            mb: 0.5,
                            '&:hover': {
                              backgroundColor: '#f0f9ff',
                              borderLeft: '3px solid #3b82f6'
                            },
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <History 
                              sx={{ 
                                fontSize: 18,
                                color: '#6b7280'
                              }} 
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={item}
                            sx={{
                              '& .MuiListItemText-primary': {
                                fontSize: '0.95rem',
                                fontWeight: 400,
                                color: '#1f2937'
                              }
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                    
                    <Divider sx={{ my: 2 }} />
                  </>
                ) : null}
                
                {/* Popular Searches */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Popular Searches
                </Typography>
                <List sx={{ py: 0 }}>
                  {['iPhone 15', 'Samsung Galaxy S24', 'MacBook Pro', 'AirPods Pro', 'Gaming Laptop', 'Smart Watch'].map((item, index) => (
                    <ListItem
                      key={index}
                      onClick={() => handleMobileSearch(item)}
                      sx={{ 
                        cursor: 'pointer',
                        py: 1.2,
                        px: 1,
                        borderRadius: 1,
                        mb: 0.5,
                        '&:hover': {
                          backgroundColor: '#f0f9ff',
                          borderLeft: '3px solid #3b82f6'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Search 
                          sx={{ 
                            fontSize: 18,
                            color: '#3b82f6'
                          }} 
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={item}
                        sx={{
                          '& .MuiListItemText-primary': {
                            fontSize: '0.95rem',
                            fontWeight: 500,
                            color: '#1f2937'
                          }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            ) : mobileSuggestions.length > 0 ? (
              /* Show search suggestions */
              <List sx={{ py: 0 }}>
                {mobileSuggestions.map((suggestion: string, index: number) => (
                  <ListItem
                    key={index}
                    onClick={() => handleMobileSearch(suggestion)}
                    sx={{ 
                      cursor: 'pointer',
                      py: 1.2,
                      px: 2,
                      borderRadius: 1,
                      mx: 1,
                      mb: 0.5,
                      '&:hover': {
                        backgroundColor: '#f0f9ff',
                        borderLeft: '3px solid #3b82f6',
                        transform: 'translateX(2px)'
                      },
                      transition: 'all 0.2s ease',
                      border: '1px solid transparent'
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Search 
                        sx={{ 
                          fontSize: 16,
                          color: '#3b82f6'
                        }} 
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <span>
                          {suggestion.toLowerCase().includes(mobileSearchValue.toLowerCase()) ? (
                            <>
                              {suggestion.split(new RegExp(`(${mobileSearchValue})`, 'gi')).map((part: string, i: number) => 
                                part.toLowerCase() === mobileSearchValue.toLowerCase() ? 
                                  <strong key={i} style={{ color: '#3b82f6', backgroundColor: '#dbeafe', padding: '1px 3px', borderRadius: '3px' }}>{part}</strong> : 
                                  part
                              )}
                            </>
                          ) : suggestion}
                        </span>
                      }
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontSize: '0.95rem',
                          fontWeight: 500,
                          color: '#1f2937',
                          lineHeight: 1.4
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              /* No results state */
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No suggestions found for "{mobileSearchValue}"
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default SearchBarSimple;
