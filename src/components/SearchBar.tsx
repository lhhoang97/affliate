import React, { useState, useRef, useEffect } from 'react';
import {
  TextField,
  InputAdornment,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  IconButton,
  Popper,
  ClickAwayListener,
  Divider
} from '@mui/material';
import {
  Search,
  History,
  TrendingUp,
  Clear,
  KeyboardArrowUp
} from '@mui/icons-material';
import { mockProducts, mockCategories } from '../utils/mockData';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = "Tìm kiếm sản phẩm, thương hiệu, danh mục..."
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const anchorRef = useRef<HTMLDivElement>(null);

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Generate suggestions based on input
  const generateSuggestions = (input: string) => {
    if (!input.trim()) {
      return [];
    }

    const inputLower = input.toLowerCase();
    const suggestions: string[] = [];

    // Product name suggestions
    mockProducts.forEach(product => {
      if (product.name.toLowerCase().includes(inputLower)) {
        suggestions.push(product.name);
      }
    });

    // Brand suggestions
    const brands = Array.from(new Set(mockProducts.map(p => p.brand)));
    brands.forEach(brand => {
      if (brand.toLowerCase().includes(inputLower)) {
        suggestions.push(brand);
      }
    });

    // Category suggestions
    mockCategories.forEach(category => {
      if (category.name.toLowerCase().includes(inputLower)) {
        suggestions.push(category.name);
      }
    });

    // Remove duplicates and limit results
    return Array.from(new Set(suggestions)).slice(0, 8);
  };

  const handleInputChange = (newValue: string) => {
    onChange(newValue);
    
    if (newValue.trim()) {
      const newSuggestions = generateSuggestions(newValue);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSuggestionClick(suggestions[selectedIndex]);
      } else if (value.trim()) {
        handleSearch(value.trim());
      }
    } else if (event.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    handleSearch(suggestion);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Add to search history
      const newHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const removeFromHistory = (item: string) => {
    const newHistory = searchHistory.filter(historyItem => historyItem !== item);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const handleFocus = () => {
    if (value.trim()) {
      setShowSuggestions(true);
    } else if (searchHistory.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleClickAway = () => {
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  return (
    <Box ref={anchorRef} sx={{ position: 'relative', width: '100%' }}>
      <TextField
        fullWidth
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        placeholder={placeholder}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
          endAdornment: value && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => handleInputChange('')}
                edge="end"
              >
                <Clear />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Popper
        open={showSuggestions}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        style={{ width: anchorRef.current?.offsetWidth, zIndex: 1300 }}
      >
        <ClickAwayListener onClickAway={handleClickAway}>
          <Paper elevation={8} sx={{ maxHeight: 400, overflow: 'auto' }}>
            {value.trim() && suggestions.length > 0 && (
              <>
                <Box sx={{ p: 2, pb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUp fontSize="small" />
                    Gợi ý tìm kiếm
                  </Typography>
                </Box>
                <List dense>
                  {suggestions.map((suggestion, index) => (
                    <ListItem
                      key={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      sx={{
                        cursor: 'pointer',
                        bgcolor: index === selectedIndex ? 'primary.light' : 'transparent',
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      <ListItemIcon>
                        <Search fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={suggestion}
                        primaryTypographyProps={{
                          sx: { 
                            fontWeight: index === selectedIndex ? 'bold' : 'normal'
                          }
                        }}
                      />
                      {index === selectedIndex && (
                        <IconButton size="small">
                          <KeyboardArrowUp />
                        </IconButton>
                      )}
                    </ListItem>
                  ))}
                </List>
                {searchHistory.length > 0 && <Divider />}
              </>
            )}

            {(!value.trim() || suggestions.length === 0) && searchHistory.length > 0 && (
              <>
                <Box sx={{ p: 2, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <History fontSize="small" />
                    Lịch sử tìm kiếm
                  </Typography>
                  <IconButton size="small" onClick={clearHistory}>
                    <Clear fontSize="small" />
                  </IconButton>
                </Box>
                <List dense>
                  {searchHistory.map((historyItem, index) => (
                    <ListItem
                      key={`${historyItem}-${index}`}
                      onClick={() => handleSuggestionClick(historyItem)}
                      sx={{
                        cursor: 'pointer',
                        bgcolor: index === selectedIndex ? 'primary.light' : 'transparent',
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      <ListItemIcon>
                        <History fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={historyItem}
                        primaryTypographyProps={{
                          sx: { 
                            fontWeight: index === selectedIndex ? 'bold' : 'normal'
                          }
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromHistory(historyItem);
                        }}
                      >
                        <Clear fontSize="small" />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            {!value.trim() && suggestions.length === 0 && searchHistory.length === 0 && (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Bắt đầu nhập để tìm kiếm sản phẩm
                </Typography>
              </Box>
            )}
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
};

export default SearchBar;
