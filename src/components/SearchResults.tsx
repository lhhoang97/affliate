import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { Search } from '@mui/icons-material';

interface SearchResultsProps {
  searchTerm: string;
  resultCount: number;
  totalCount: number;
}

const SearchResults: React.FC<SearchResultsProps> = ({ searchTerm, resultCount, totalCount }) => {
  if (!searchTerm) return null;

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 2, 
      mb: 3, 
      p: 2, 
      backgroundColor: '#f8f9fa', 
      borderRadius: 2,
      border: '1px solid #e9ecef'
    }}>
      <Search sx={{ color: '#6c757d' }} />
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#495057' }}>
          Search results for "{searchTerm}"
        </Typography>
        <Typography variant="body2" sx={{ color: '#6c757d', mt: 0.5 }}>
          Showing {resultCount} of {totalCount} products
        </Typography>
      </Box>
      <Chip 
        label={`${resultCount} results`} 
        color="primary" 
        size="small"
        sx={{ ml: 'auto' }}
      />
    </Box>
  );
};

export default SearchResults;
