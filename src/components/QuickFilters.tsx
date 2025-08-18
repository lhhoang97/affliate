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
      label: 'Điện tử',
      icon: <TrendingUp />,
      description: 'Điện thoại, laptop, máy tính bảng',
      filters: {
        category: 'Electronics',
        sortBy: 'rating'
      }
    },
    {
      id: 'fashion',
      label: 'Thời trang',
      icon: <NewReleases />,
      description: 'Quần áo, giày dép, phụ kiện',
      filters: {
        category: 'Fashion',
        sortBy: 'newest'
      }
    },
    {
      id: 'home-garden',
      label: 'Nhà cửa',
      icon: <Inventory />,
      description: 'Đồ gia dụng, nội thất',
      filters: {
        category: 'Home & Garden',
        sortBy: 'name'
      }
    },
    {
      id: 'on-sale',
      label: 'Đang giảm giá',
      icon: <LocalOffer />,
      description: 'Sản phẩm có khuyến mãi',
      filters: {
        onSaleOnly: true,
        sortBy: 'price-low'
      }
    },
    {
      id: 'top-rated',
      label: 'Đánh giá cao',
      icon: <Star />,
      description: 'Sản phẩm 4+ sao',
      filters: {
        rating: 4,
        sortBy: 'rating'
      }
    },
    {
      id: 'in-stock',
      label: 'Có sẵn',
      icon: <Inventory />,
      description: 'Sản phẩm trong kho',
      filters: {
        inStockOnly: true,
        sortBy: 'name'
      }
    },
    {
      id: 'budget',
      label: 'Giá rẻ',
      icon: <PriceCheck />,
      description: 'Dưới $200',
      filters: {
        priceRange: [0, 200],
        sortBy: 'price-low'
      }
    },
    {
      id: 'premium',
      label: 'Cao cấp',
      icon: <Star />,
      description: 'Trên $1000',
      filters: {
        priceRange: [1000, 5000],
        sortBy: 'price-high'
      }
    }
  ];

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Bộ lọc nhanh
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
