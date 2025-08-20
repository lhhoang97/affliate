import React from 'react';
import {
  Box,
  Chip,
  Typography,
  Tooltip
} from '@mui/material';
import {
  LocalOffer,
  Star,
  Inventory,
  TrendingUp,
  NewReleases,
  PriceCheck
} from '@mui/icons-material';

interface QuickFilter {
  id: string;
  label: string;
  icon: React.ReactElement;
  description: string;
  filters: {
    category?: string;
    brands?: string[];
    priceRange?: [number, number];
    rating?: number;
    inStockOnly?: boolean;
    onSaleOnly?: boolean;
    sortBy?: string;
  };
}

interface QuickFiltersProps {
  onApplyFilter: (filters: QuickFilter['filters']) => void;
}

const QuickFilters: React.FC<QuickFiltersProps> = ({ onApplyFilter }) => {
  const quickFilters: QuickFilter[] = [
    {
      id: 'electronics',
      label: 'Electronics',
      icon: <TrendingUp />,
              description: 'Phones, laptops, tablets',
      filters: {
        category: 'Electronics',
        sortBy: 'rating'
      }
    },
    {
      id: 'fashion',
      label: 'Fashion',
      icon: <NewReleases />,
              description: 'Clothing, shoes, accessories',
      filters: {
        category: 'Fashion',
        sortBy: 'newest'
      }
    },
    {
      id: 'home-garden',
      label: 'Home & Garden',
      icon: <Inventory />,
              description: 'Home appliances, furniture',
      filters: {
        category: 'Home & Garden',
        sortBy: 'name'
      }
    },
    {
      id: 'on-sale',
              label: 'On Sale',
      icon: <LocalOffer />,
      description: 'Products on sale',
      filters: {
        onSaleOnly: true,
        sortBy: 'price-low'
      }
    },
    {
      id: 'top-rated',
              label: 'Highly Rated',
      icon: <Star />,
              description: 'Products with 4+ stars',
      filters: {
        rating: 4,
        sortBy: 'rating'
      }
    },
    {
      id: 'in-stock',
              label: 'In Stock',
      icon: <Inventory />,
              description: 'Products in stock',
      filters: {
        inStockOnly: true,
        sortBy: 'name'
      }
    },
    {
      id: 'budget',
      label: 'Budget',
      icon: <PriceCheck />,
              description: 'Under $200',
      filters: {
        priceRange: [0, 200],
        sortBy: 'price-low'
      }
    },
    {
      id: 'premium',
      label: 'Premium',
      icon: <Star />,
              description: 'Over $1000',
      filters: {
        priceRange: [1000, 5000],
        sortBy: 'price-high'
      }
    }
  ];

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Quick Filters
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {quickFilters.map((filter) => (
          <Tooltip
            key={filter.id}
            title={filter.description}
            placement="top"
          >
            <Chip
              icon={filter.icon}
              label={filter.label}
              variant="outlined"
              clickable
              onClick={() => onApplyFilter(filter.filters)}
              sx={{
                '&:hover': {
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText'
                }
              }}
            />
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
};

export default QuickFilters;
