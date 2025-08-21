import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import {
  AcUnit,
  Print,
  Speaker,
  Watch,
  Tablet,
  Phone,
  Headphones,
  Laptop,
  Tv,
  Kitchen,
  ShoppingBag,
  Home,
  FitnessCenter,
  SportsEsports,
  Spa,
  LocalShipping,
  Business,
  Pets,
  HealthAndSafety
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  letter: string;
}

// Define subcategories for each main category
const categorySubcategories: { [key: string]: Category[] } = {
  'electronics': [
    { id: 'headphones', name: 'Headphones', icon: <Headphones />, letter: 'H' },
    { id: 'laptop', name: 'Laptop', icon: <Laptop />, letter: 'L' },
    { id: 'tablet', name: 'Tablet', icon: <Tablet />, letter: 'T' },
    { id: 'phone', name: 'Phone', icon: <Phone />, letter: 'P' },
    { id: 'tv', name: 'TV', icon: <Tv />, letter: 'T' },
    { id: 'refrigerator', name: 'Refrigerator', icon: <Kitchen />, letter: 'R' },
    { id: 'air-conditioner', name: 'Air Conditioner', icon: <AcUnit />, letter: 'A' },
  ],
  'fashion': [
    { id: 'men', name: 'Men', icon: <ShoppingBag />, letter: 'M' },
    { id: 'women', name: 'Women', icon: <ShoppingBag />, letter: 'W' },
    { id: 'kids', name: 'Kids', icon: <ShoppingBag />, letter: 'K' },
    { id: 'shoes', name: 'Shoes', icon: <ShoppingBag />, letter: 'S' },
    { id: 'bags', name: 'Bags', icon: <ShoppingBag />, letter: 'B' },
    { id: 'jewelry', name: 'Jewelry', icon: <ShoppingBag />, letter: 'J' },
    { id: 'accessories', name: 'Accessories', icon: <ShoppingBag />, letter: 'A' },
  ],
  'home-garden': [
    { id: 'furniture', name: 'Furniture', icon: <Home />, letter: 'F' },
    { id: 'kitchen', name: 'Kitchen', icon: <Kitchen />, letter: 'K' },
    { id: 'bedding', name: 'Bedding', icon: <Home />, letter: 'B' },
    { id: 'garden', name: 'Garden', icon: <Home />, letter: 'G' },
    { id: 'lighting', name: 'Lighting', icon: <Home />, letter: 'L' },
    { id: 'storage', name: 'Storage', icon: <Home />, letter: 'S' },
  ],
  'sports': [
    { id: 'fitness', name: 'Fitness', icon: <FitnessCenter />, letter: 'F' },
    { id: 'team-sports', name: 'Team Sports', icon: <SportsEsports />, letter: 'T' },
    { id: 'outdoor', name: 'Outdoor', icon: <FitnessCenter />, letter: 'O' },
    { id: 'swimming', name: 'Swimming', icon: <FitnessCenter />, letter: 'S' },
    { id: 'cycling', name: 'Cycling', icon: <FitnessCenter />, letter: 'C' },
    { id: 'running', name: 'Running', icon: <FitnessCenter />, letter: 'R' },
  ],
  'beauty': [
    { id: 'skincare', name: 'Skincare', icon: <Spa />, letter: 'S' },
    { id: 'makeup', name: 'Makeup', icon: <Spa />, letter: 'M' },
    { id: 'hair-care', name: 'Hair Care', icon: <Spa />, letter: 'H' },
    { id: 'personal-care', name: 'Personal Care', icon: <Spa />, letter: 'P' },
    { id: 'vitamins', name: 'Vitamins', icon: <HealthAndSafety />, letter: 'V' },
    { id: 'fragrances', name: 'Fragrances', icon: <Spa />, letter: 'F' },
  ],
  'toys-games': [
    { id: 'action-figures', name: 'Action Figures', icon: <SportsEsports />, letter: 'A' },
    { id: 'board-games', name: 'Board Games', icon: <SportsEsports />, letter: 'B' },
    { id: 'educational', name: 'Educational', icon: <SportsEsports />, letter: 'E' },
    { id: 'lego', name: 'Lego', icon: <SportsEsports />, letter: 'L' },
    { id: 'dolls', name: 'Dolls', icon: <SportsEsports />, letter: 'D' },
    { id: 'video-games', name: 'Video Games', icon: <SportsEsports />, letter: 'V' },
  ],
  'automotive': [
    { id: 'car-parts', name: 'Car Parts', icon: <LocalShipping />, letter: 'C' },
    { id: 'car-care', name: 'Car Care', icon: <LocalShipping />, letter: 'C' },
    { id: 'motorcycle', name: 'Motorcycle', icon: <LocalShipping />, letter: 'M' },
    { id: 'truck', name: 'Truck', icon: <LocalShipping />, letter: 'T' },
    { id: 'tools', name: 'Tools', icon: <LocalShipping />, letter: 'T' },
    { id: 'electronics', name: 'Electronics', icon: <Tv />, letter: 'E' },
  ],
  'office-supplies': [
    { id: 'paper', name: 'Paper', icon: <Business />, letter: 'P' },
    { id: 'pens', name: 'Pens', icon: <Business />, letter: 'P' },
    { id: 'desk', name: 'Desk', icon: <Business />, letter: 'D' },
    { id: 'filing', name: 'Filing', icon: <Business />, letter: 'F' },
    { id: 'furniture', name: 'Furniture', icon: <Business />, letter: 'F' },
  ],
  'pet-supplies': [
    { id: 'dog', name: 'Dog', icon: <Pets />, letter: 'D' },
    { id: 'cat', name: 'Cat', icon: <Pets />, letter: 'C' },
    { id: 'food', name: 'Food', icon: <Pets />, letter: 'F' },
    { id: 'toys', name: 'Toys', icon: <Pets />, letter: 'T' },
    { id: 'health', name: 'Health', icon: <Pets />, letter: 'H' },
  ],
  'health-wellness': [
    { id: 'vitamins', name: 'Vitamins', icon: <HealthAndSafety />, letter: 'V' },
    { id: 'fitness', name: 'Fitness', icon: <FitnessCenter />, letter: 'F' },
    { id: 'medical', name: 'Medical', icon: <HealthAndSafety />, letter: 'M' },
    { id: 'care', name: 'Care', icon: <HealthAndSafety />, letter: 'C' },
    { id: 'wellness', name: 'Wellness', icon: <HealthAndSafety />, letter: 'W' },
  ]
};

// Category colors
const categoryColors: { [key: string]: string } = {
  'electronics': '#007bff',
  'fashion': '#e91e63',
  'home-garden': '#4caf50',
  'sports': '#ff9800',
  'beauty': '#00bcd4',
  'toys-games': '#f44336',
  'automotive': '#795548',
  'office-supplies': '#607d8b',
  'pet-supplies': '#8bc34a',
  'health-wellness': '#9c27b0'
};

interface CategoryNavigationProps {
  selectedCategory?: string;
  onCategorySelect?: (categoryId: string) => void;
}

const CategoryNavigation: React.FC<CategoryNavigationProps> = ({
  selectedCategory,
  onCategorySelect
}) => {
  const navigate = useNavigate();

  // Determine which main category we're in based on selectedCategory
  const getMainCategory = (): string => {
    if (!selectedCategory) return 'electronics';
    
    const lowerSelected = selectedCategory.toLowerCase();
    
    // Direct mapping for common cases
    const directMapping: { [key: string]: string } = {
      'electronics': 'electronics',
      'fashion': 'fashion',
      'home-garden': 'home-garden',
      'home & garden': 'home-garden',
      'sports': 'sports',
      'beauty': 'beauty',
      'toys-games': 'toys-games',
      'toys & games': 'toys-games',
      'automotive': 'automotive',
      'office-supplies': 'office-supplies',
      'office supplies': 'office-supplies',
      'pet-supplies': 'pet-supplies',
      'pet supplies': 'pet-supplies',
      'health-wellness': 'health-wellness',
      'health & wellness': 'health-wellness'
    };
    
    // Check direct mapping first
    if (directMapping[lowerSelected]) {
      return directMapping[lowerSelected];
    }
    
    // Check if selectedCategory is a main category
    if (categorySubcategories[lowerSelected]) {
      return lowerSelected;
    }
    
    // Check if selectedCategory is a subcategory
    for (const [mainCategory, subcategories] of Object.entries(categorySubcategories)) {
      if (subcategories.some(sub => 
        sub.id === lowerSelected || 
        sub.name.toLowerCase() === lowerSelected ||
        sub.name.toLowerCase().replace(/\s+/g, '-') === lowerSelected
      )) {
        return mainCategory;
      }
    }
    
    // Try to match partial names
    for (const [mainCategory, subcategories] of Object.entries(categorySubcategories)) {
      if (subcategories.some(sub => 
        sub.name.toLowerCase().includes(lowerSelected) ||
        lowerSelected.includes(sub.name.toLowerCase())
      )) {
        return mainCategory;
      }
    }
    
    console.log('Category not found for:', selectedCategory, 'falling back to electronics');
    return 'electronics'; // Default fallback
  };

  const mainCategory = getMainCategory();
  const currentSubcategories = categorySubcategories[mainCategory] || categorySubcategories['electronics'];
  const categoryColor = categoryColors[mainCategory] || '#007bff';
  const categoryName = mainCategory.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  // Debug logging
  console.log('CategoryNavigation Debug:', {
    selectedCategory,
    mainCategory,
    categoryName,
    subcategoriesCount: currentSubcategories.length,
    subcategories: currentSubcategories.map(sub => sub.name)
  });

  const handleCategoryClick = (categoryId: string) => {
    if (onCategorySelect) {
      onCategorySelect(categoryId);
    } else {
      navigate(`/products?category=${categoryId}`);
    }
  };

  return (
    <Box sx={{ 
      py: 3, 
      borderBottom: '1px solid #e9ecef',
      backgroundColor: 'white',
      px: 2
    }}>
      {/* Title Section */}
      <Box sx={{ 
        textAlign: 'center', 
        mb: 3,
        borderBottom: `2px solid ${categoryColor}`,
        pb: 2,
        mx: 'auto',
        maxWidth: 'fit-content'
      }}>
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: '24px', sm: '28px', md: '32px' },
            fontWeight: 'bold',
            color: '#333',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
        >
          {categoryName}
        </Typography>
      </Box>

      {/* Subcategories Grid */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(4, 1fr)', sm: 'repeat(4, 1fr)', md: 'repeat(7, 1fr)' },
        gap: { xs: 2, sm: 3, md: 4 },
        maxWidth: '1200px',
        mx: 'auto'
      }}>
        {currentSubcategories.map((category) => (
          <Box
            key={category.id}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease-in-out',
              p: 1,
              borderRadius: '12px',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                backgroundColor: '#f8f9fa'
              }
            }}
            onClick={() => handleCategoryClick(category.id)}
          >
            {/* Circular Icon */}
            <Box
              sx={{
                width: { xs: 45, sm: 50, md: 55 },
                height: { xs: 45, sm: 50, md: 55 },
                borderRadius: '50%',
                backgroundColor: selectedCategory === category.id ? categoryColor : '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1.5,
                border: selectedCategory === category.id ? `3px solid ${categoryColor}` : `2px solid ${categoryColor}`,
                transition: 'all 0.3s ease-in-out',
                boxShadow: selectedCategory === category.id ? `0 4px 15px ${categoryColor}40` : '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              {selectedCategory === category.id ? (
                // Show icon when selected
                <Box sx={{ 
                  color: 'white',
                  fontSize: { xs: '20px', sm: '22px', md: '24px' }
                }}>
                  {category.icon}
                </Box>
              ) : (
                // Show letter when not selected
                <Typography
                  sx={{
                    fontSize: { xs: '16px', sm: '18px', md: '20px' },
                    fontWeight: 'bold',
                    color: '#333',
                    textTransform: 'uppercase'
                  }}
                >
                  {category.letter}
                </Typography>
              )}
            </Box>
            
            {/* Category Name */}
            <Typography
              sx={{
                fontSize: { xs: '11px', sm: '12px', md: '13px' },
                color: selectedCategory === category.id ? categoryColor : '#666',
                fontWeight: selectedCategory === category.id ? 'bold' : 'normal',
                textAlign: 'center',
                maxWidth: 70,
                lineHeight: 1.3,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              {category.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CategoryNavigation;
