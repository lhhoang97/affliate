import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Tabs,
  Tab
} from '@mui/material';
import {
  Search,
  TrendingUp,
  Clear,
  Category,
  NewReleases
} from '@mui/icons-material';


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`categories-tabpanel-${index}`}
      aria-labelledby={`categories-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const CategoriesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);









  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      Product Categories
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                      Explore diverse product categories with reviews and detailed information
        </Typography>
      </Box>

            {/* Search and Filter */}
      <Box sx={{ mb: 4, p: 3 }}>
        <TextField
          fullWidth
                        placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setSearchTerm('')}
                  edge="end"
                >
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 300 }}
        />
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={selectedTab} onChange={(_, newValue) => setSelectedTab(newValue)}>
                      <Tab label="All Categories" />
                      <Tab label="Featured Categories" />
                      <Tab label="New Categories" />
        </Tabs>
      </Box>

      {/* Categories Grid */}
      <TabPanel value={selectedTab} index={0}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '50vh',
          flexDirection: 'column',
          color: '#666'
        }}>
          <Category sx={{ fontSize: 48, mb: 2, color: '#ccc' }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            No categories
          </Typography>
          <Typography variant="body2">
            Category list has been hidden
          </Typography>
        </Box>
      </TabPanel>

      <TabPanel value={selectedTab} index={1}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '50vh',
          flexDirection: 'column',
          color: '#666'
        }}>
          <TrendingUp sx={{ fontSize: 48, mb: 2, color: '#ccc' }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            No featured categories
          </Typography>
          <Typography variant="body2">
            Category list has been hidden
          </Typography>
        </Box>
      </TabPanel>

      <TabPanel value={selectedTab} index={2}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '50vh',
          flexDirection: 'column',
          color: '#666'
        }}>
          <NewReleases sx={{ fontSize: 48, mb: 2, color: '#ccc' }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            No new categories
          </Typography>
          <Typography variant="body2">
            Category list has been hidden
          </Typography>
        </Box>
      </TabPanel>


    </Container>
  );
};

export default CategoriesPage;
