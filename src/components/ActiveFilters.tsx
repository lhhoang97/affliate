import React from 'react';
import {
  Box,
  Chip,
  Typography,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Clear,
  Category,
  Store,
  PriceCheck,
  Star,
  Inventory,
  LocalOffer
} from '@mui/icons-material';

interface ActiveFiltersProps {
  filters: {
    searchTerm: string;
    selectedCategory: string;
    selectedBrands: string[];
    priceRange: [number, number];
    ratingFilter: number;
    inStockOnly: boolean;
    onSaleOnly: boolean;
  };
  onRemoveFilter: (filterType: string, value?: any) => void;
  onClearAll: () => void;
}

interface FilterItem {
  type: string;
  label: string;
  icon: React.ReactElement;
  value: any;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  onRemoveFilter,
  onClearAll
}) => {
  const activeFilters: FilterItem[] = [];

  if (filters.searchTerm) {
    activeFilters.push({
      type: 'search',
      label: `Tìm kiếm: "${filters.searchTerm}"`,
      icon: <Clear />,
      value: filters.searchTerm
    });
  }

  if (filters.selectedCategory) {
    activeFilters.push({
      type: 'category',
      label: filters.selectedCategory,
      icon: <Category />,
      value: filters.selectedCategory
    });
  }

  filters.selectedBrands.forEach(brand => {
    activeFilters.push({
      type: 'brand',
      label: brand,
      icon: <Store />,
      value: brand
    });
  });

  if (filters.priceRange[0] > 0 || filters.priceRange[1] < 5000) {
    activeFilters.push({
      type: 'price',
      label: `$${filters.priceRange[0].toLocaleString()} - $${filters.priceRange[1].toLocaleString()}`,
      icon: <PriceCheck />,
      value: filters.priceRange
    });
  }

  if (filters.ratingFilter > 0) {
    activeFilters.push({
      type: 'rating',
      label: `${filters.ratingFilter}+ sao`,
      icon: <Star />,
      value: filters.ratingFilter
    });
  }

  if (filters.inStockOnly) {
    activeFilters.push({
      type: 'stock',
      label: 'Chỉ sản phẩm có sẵn',
      icon: <Inventory />,
      value: true
    });
  }

  if (filters.onSaleOnly) {
    activeFilters.push({
      type: 'sale',
      label: 'Chỉ sản phẩm giảm giá',
      icon: <LocalOffer />,
      value: true
    });
  }

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Bộ lọc đang hoạt động:
        </Typography>
        <Tooltip title="Xóa tất cả bộ lọc">
          <IconButton size="small" onClick={onClearAll} color="error">
            <Clear />
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {activeFilters.map((filter, index) => (
          <Chip
            key={`${filter.type}-${index}`}
            icon={filter.icon}
            label={filter.label}
            onDelete={() => onRemoveFilter(filter.type, filter.value)}
            color="primary"
            variant="outlined"
            size="small"
            sx={{
              '& .MuiChip-deleteIcon': {
                color: 'error.main',
                '&:hover': {
                  color: 'error.dark'
                }
              }
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ActiveFilters;
