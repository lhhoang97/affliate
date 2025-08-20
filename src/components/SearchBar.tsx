import React, { useRef } from 'react';
import {
  TextField,
  InputAdornment,
  Box,
  IconButton
} from '@mui/material';
import {
  Search,
  Clear
} from '@mui/icons-material';

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
      placeholder = "What are you looking for?"
}) => {
  const anchorRef = useRef<HTMLDivElement>(null);

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
    }
  };

  return (
    <Box ref={anchorRef} sx={{ position: 'relative', width: '100%' }}>
      <TextField
        fullWidth
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
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
    </Box>
  );
};

export default SearchBar;