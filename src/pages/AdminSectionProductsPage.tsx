import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Alert,
  Tabs,
  Tab,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { getAllProducts } from '../services/productService';

interface Section {
  id: string;
  name: string;
  key: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

interface SectionProduct {
  id: string;
  productId: string;
  sectionId: string;
  position: number;
  isActive: boolean;
  product?: Product;
}

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
      id={`section-tabpanel-${index}`}
      aria-labelledby={`section-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminSectionProductsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [sectionProducts, setSectionProducts] = useState<SectionProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SectionProduct | null>(null);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [formData, setFormData] = useState({
    productId: '',
    sectionId: '',
    position: 1,
    isActive: true
  });
  const [sectionFormData, setSectionFormData] = useState({
    name: '',
    key: '',
    description: '',
    isActive: true
  });
  const navigate = useNavigate();

  // Load products, sections and section products
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const allProducts = await getAllProducts();
        setProducts(allProducts);
        
        // Mock sections data
        const mockSections: Section[] = [
          {
            id: '1',
            name: 'Just For You',
            key: 'justForYou',
            description: 'Personalized recommendations for users',
            isActive: true,
            createdAt: '2024-01-15'
          },
          {
            id: '2',
            name: 'Hot Deals',
            key: 'hotDeals',
            description: 'Best deals and discounts',
            isActive: true,
            createdAt: '2024-01-15'
          },
          {
            id: '3',
            name: 'Trending Deals',
            key: 'trendingDeals',
            description: 'Most popular and trending products',
            isActive: true,
            createdAt: '2024-01-15'
          }
        ];
        setSections(mockSections);
        
        // Mock section products data - in real app, this would come from API
        const mockSectionProducts: SectionProduct[] = [
          {
            id: '1',
            productId: '1',
            sectionId: '1',
            position: 1,
            isActive: true,
            product: allProducts.find(p => p.id === '1')
          },
          {
            id: '2',
            productId: '2',
            sectionId: '1',
            position: 2,
            isActive: true,
            product: allProducts.find(p => p.id === '2')
          },
          {
            id: '3',
            productId: '3',
            sectionId: '2',
            position: 1,
            isActive: true,
            product: allProducts.find(p => p.id === '3')
          },
          {
            id: '4',
            productId: '4',
            sectionId: '2',
            position: 2,
            isActive: true,
            product: allProducts.find(p => p.id === '4')
          },
          {
            id: '5',
            productId: '5',
            sectionId: '3',
            position: 1,
            isActive: true,
            product: allProducts.find(p => p.id === '5')
          }
        ];
        
        setSectionProducts(mockSectionProducts);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getSectionName = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    return section ? section.name : 'Unknown Section';
  };

  const getCurrentSection = () => {
    return sections[tabValue] || null;
  };

  const getSectionProducts = (sectionId: string) => {
    return sectionProducts
      .filter(sp => sp.sectionId === sectionId)
      .sort((a, b) => a.position - b.position);
  };

  const handleOpenDialog = (product?: SectionProduct) => {
    const currentSection = getCurrentSection();
    if (product) {
      setEditingProduct(product);
      setFormData({
        productId: product.productId,
        sectionId: product.sectionId,
        position: product.position,
        isActive: product.isActive
      });
    } else {
      setEditingProduct(null);
      setFormData({
        productId: '',
        sectionId: currentSection?.id || '',
        position: currentSection ? getSectionProducts(currentSection.id).length + 1 : 1,
        isActive: true
      });
    }
    setDialogOpen(true);
  };

  const handleOpenSectionDialog = (section?: Section) => {
    if (section) {
      setEditingSection(section);
      setSectionFormData({
        name: section.name,
        key: section.key,
        description: section.description,
        isActive: section.isActive
      });
    } else {
      setEditingSection(null);
      setSectionFormData({
        name: '',
        key: '',
        description: '',
        isActive: true
      });
    }
    setSectionDialogOpen(true);
  };

  const handleCloseSectionDialog = () => {
    setSectionDialogOpen(false);
    setEditingSection(null);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingProduct(null);
  };

  const handleSave = () => {
    if (!formData.productId) {
      alert('Please select a product');
      return;
    }

    if (!formData.sectionId) {
      alert('Please select a section');
      return;
    }

    const selectedProduct = products.find(p => p.id === formData.productId);
    if (!selectedProduct) {
      alert('Selected product not found');
      return;
    }

    if (editingProduct) {
      // Update existing section product
      setSectionProducts(prev => prev.map(sp => 
        sp.id === editingProduct.id 
          ? { ...sp, ...formData, product: selectedProduct }
          : sp
      ));
    } else {
      // Add new section product
      const newSectionProduct: SectionProduct = {
        id: Date.now().toString(),
        ...formData,
        product: selectedProduct
      };
      setSectionProducts(prev => [...prev, newSectionProduct]);
    }

    handleCloseDialog();
  };

  const handleSaveSection = () => {
    if (!sectionFormData.name || !sectionFormData.key) {
      alert('Please fill in section name and key');
      return;
    }

    // Check if key already exists
    const keyExists = sections.find(s => s.key === sectionFormData.key && s.id !== editingSection?.id);
    if (keyExists) {
      alert('Section key already exists');
      return;
    }

    if (editingSection) {
      // Update existing section
      setSections(prev => prev.map(s => 
        s.id === editingSection.id 
          ? { ...s, ...sectionFormData }
          : s
      ));
    } else {
      // Add new section
      const newSection: Section = {
        id: Date.now().toString(),
        ...sectionFormData,
        createdAt: new Date().toISOString()
      };
      setSections(prev => [...prev, newSection]);
    }

    handleCloseSectionDialog();
  };

  const handleDeleteSection = (section: Section) => {
    if (window.confirm(`Are you sure you want to delete section "${section.name}"? This will also remove all products in this section.`)) {
      // Remove section
      setSections(prev => prev.filter(s => s.id !== section.id));
      // Remove all products in this section
      setSectionProducts(prev => prev.filter(sp => sp.sectionId !== section.id));
      // Reset tab if current tab is deleted
      if (tabValue >= sections.length - 1) {
        setTabValue(Math.max(0, sections.length - 2));
      }
    }
  };

  const handleDelete = (sectionProduct: SectionProduct) => {
    if (window.confirm(`Are you sure you want to remove "${sectionProduct.product?.name}" from ${getSectionName(sectionProduct.sectionId)}?`)) {
      setSectionProducts(prev => prev.filter(sp => sp.id !== sectionProduct.id));
    }
  };

  const handleToggleActive = (sectionProduct: SectionProduct) => {
    setSectionProducts(prev => prev.map(sp => 
      sp.id === sectionProduct.id 
        ? { ...sp, isActive: !sp.isActive }
        : sp
    ));
  };

  const handleViewProduct = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">Loading section products...</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Section Products Management
        </Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => handleOpenSectionDialog()}
          sx={{ ml: 2 }}
        >
          Add Section
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            {sections.map((section, index) => (
              <Tab 
                key={section.id} 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{section.name}</span>
                    {!section.isActive && (
                      <Chip label="Inactive" size="small" color="error" sx={{ fontSize: '0.6rem', height: 16 }} />
                    )}
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Box>

        {sections.map((section, index) => (
          <TabPanel key={section.id} value={tabValue} index={index}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h6">{section.name} Products</Typography>
                <Chip 
                  label={section.isActive ? 'Active' : 'Inactive'} 
                  color={section.isActive ? 'success' : 'error'} 
                  size="small" 
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleOpenSectionDialog(section)}
                >
                  Edit Section
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog()}
                >
                  Add Product
                </Button>
              </Box>
            </Box>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
              {getSectionProducts(section.id).map((sectionProduct) => (
              <Box key={sectionProduct.id}>
                <Card sx={{ 
                  border: sectionProduct.isActive ? '2px solid #10b981' : '2px solid #e5e7eb',
                  opacity: sectionProduct.isActive ? 1 : 0.6
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Chip 
                        label={`Position ${sectionProduct.position}`} 
                        size="small" 
                        color="primary"
                        sx={{ mr: 1 }}
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={sectionProduct.isActive}
                            onChange={() => handleToggleActive(sectionProduct)}
                            size="small"
                          />
                        }
                        label="Active"
                        sx={{ ml: 'auto' }}
                      />
                    </Box>
                    
                    <Typography variant="h6" sx={{ mb: 1, fontSize: '1rem' }}>
                      {sectionProduct.product?.name}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      ${sectionProduct.product?.price} - {sectionProduct.product?.retailer}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleViewProduct(sectionProduct.productId)}
                        sx={{ color: '#3b82f6' }}
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(sectionProduct)}
                        sx={{ color: '#f59e0b' }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(sectionProduct)}
                        sx={{ color: '#ef4444' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                                         </Box>
                   </CardContent>
                 </Card>
               </Box>
             ))}
           </Box>
         </TabPanel>
       ))}
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingProduct ? 'Edit Section Product' : 'Add Product to Section'}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
            <InputLabel>Product</InputLabel>
            <Select
              value={formData.productId}
              onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
              label="Product"
            >
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name} - ${product.price} ({product.retailer})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Section</InputLabel>
            <Select
              value={formData.sectionId}
              onChange={(e) => setFormData({ ...formData, sectionId: e.target.value })}
              label="Section"
            >
              {sections.map((section) => (
                <MenuItem key={section.id} value={section.id}>
                  {section.name} {!section.isActive && '(Inactive)'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Position"
            type="number"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) })}
            sx={{ mb: 2 }}
            helperText="Order in which the product appears in the section"
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
            }
            label="Active"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {editingProduct ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Section Management Dialog */}
      <Dialog open={sectionDialogOpen} onClose={handleCloseSectionDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingSection ? 'Edit Section' : 'Add New Section'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Section Name"
            value={sectionFormData.name}
            onChange={(e) => setSectionFormData({ ...sectionFormData, name: e.target.value })}
            sx={{ mt: 2, mb: 2 }}
            placeholder="e.g., New Arrivals, Best Sellers"
          />

          <TextField
            fullWidth
            label="Section Key"
            value={sectionFormData.key}
            onChange={(e) => setSectionFormData({ ...sectionFormData, key: e.target.value.toLowerCase().replace(/\s+/g, '') })}
            sx={{ mb: 2 }}
            helperText="Unique identifier for the section (auto-generated from name)"
            placeholder="e.g., newarrivals, bestsellers"
          />

          <TextField
            fullWidth
            label="Description"
            value={sectionFormData.description}
            onChange={(e) => setSectionFormData({ ...sectionFormData, description: e.target.value })}
            multiline
            rows={3}
            sx={{ mb: 2 }}
            placeholder="Brief description of what this section contains"
          />

          <FormControlLabel
            control={
              <Switch
                checked={sectionFormData.isActive}
                onChange={(e) => setSectionFormData({ ...sectionFormData, isActive: e.target.checked })}
              />
            }
            label="Active"
          />
        </DialogContent>
        <DialogActions>
          {editingSection && (
            <Button 
              onClick={() => handleDeleteSection(editingSection)} 
              color="error"
              variant="outlined"
            >
              Delete Section
            </Button>
          )}
          <Button onClick={handleCloseSectionDialog}>Cancel</Button>
          <Button onClick={handleSaveSection} variant="contained">
            {editingSection ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminSectionProductsPage;
