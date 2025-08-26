import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Card,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Refresh,
  Schedule,
  PlayArrow,
  Stop,
  ExpandMore,
  Info,
  Warning,
  CheckCircle,
  Error
} from '@mui/icons-material';
import { fetchProducts } from '../services/productService';
import { 
  updateProductPrice, 
  updateAllProductPrices, 
  schedulePriceUpdates,
  SUPPORTED_SITES 
} from '../services/priceUpdateService';
import { Product } from '../types';

interface UpdateResult {
  productId: string;
  productName: string;
  success: boolean;
  message: string;
  oldPrice?: number;
  newPrice?: number;
}

const AdminPriceUpdatePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateResults, setUpdateResults] = useState<UpdateResult[]>([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as any });
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(false);
  const [updateInterval, setUpdateInterval] = useState(6);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [nextUpdate, setNextUpdate] = useState<string>('');

  useEffect(() => {
    loadProducts();
    loadScheduleSettings();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const productsData = await fetchProducts();
      setProducts(productsData);
    } catch (error) {
      setSnackbar({ open: true, message: 'Lỗi khi tải danh sách sản phẩm', severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const loadScheduleSettings = () => {
    const scheduleData = localStorage.getItem('priceUpdateSchedule');
    if (scheduleData) {
      const schedule = JSON.parse(scheduleData);
      setAutoUpdateEnabled(schedule.enabled);
      setUpdateInterval(schedule.intervalHours);
      setLastUpdate(schedule.lastRun);
      setNextUpdate(schedule.nextRun);
    }
  };

  const handleUpdateSingleProduct = async (productId: string) => {
    try {
      const result = await updateProductPrice(productId);
      setUpdateResults(prev => [{
        productId,
        productName: products.find(p => p.id === productId)?.name || '',
        success: result.success,
        message: result.message,
        oldPrice: result.oldPrice,
        newPrice: result.newPrice
      }, ...prev]);
      
      if (result.success) {
        setSnackbar({ open: true, message: result.message, severity: 'success' });
        loadProducts(); // Reload để cập nhật UI
      } else {
        setSnackbar({ open: true, message: result.message, severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Lỗi khi cập nhật sản phẩm', severity: 'error' });
    }
  };

  const handleUpdateAllProducts = async () => {
    setIsUpdating(true);
    setUpdateResults([]);
    
    try {
      const result = await updateAllProductPrices();
      setUpdateResults(result.results.map(r => ({
        productId: r.productId,
        productName: r.productName,
        success: r.success,
        message: r.message
      })));
      
      setSnackbar({ 
        open: true, 
        message: `Cập nhật hoàn tất: ${result.success}/${result.total} thành công`, 
        severity: result.failed > 0 ? 'warning' : 'success' 
      });
      
      loadProducts(); // Reload để cập nhật UI
    } catch (error) {
      setSnackbar({ open: true, message: 'Lỗi khi cập nhật tất cả sản phẩm', severity: 'error' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleAutoUpdate = (enabled: boolean) => {
    setAutoUpdateEnabled(enabled);
    
    if (enabled) {
      schedulePriceUpdates(updateInterval);
      setSnackbar({ open: true, message: 'Đã bật cập nhật giá tự động', severity: 'success' });
    } else {
      const schedule = {
        intervalHours: updateInterval,
        lastRun: lastUpdate,
        nextRun: nextUpdate,
        enabled: false
      };
      localStorage.setItem('priceUpdateSchedule', JSON.stringify(schedule));
      setSnackbar({ open: true, message: 'Đã tắt cập nhật giá tự động', severity: 'info' });
    }
    
    loadScheduleSettings();
  };

  const handleIntervalChange = (hours: number) => {
    setUpdateInterval(hours);
    
    if (autoUpdateEnabled) {
      schedulePriceUpdates(hours);
      setSnackbar({ open: true, message: `Đã cập nhật lịch: ${hours} giờ/lần`, severity: 'success' });
    }
    
    loadScheduleSettings();
  };

  const productsWithExternalUrl = products.filter(p => p.externalUrl);
  const supportedProducts = productsWithExternalUrl.filter(p => {
    if (!p.externalUrl) return false;
    const domain = new URL(p.externalUrl).hostname.replace('www.', '');
    return Object.keys(SUPPORTED_SITES).includes(domain);
  });

  const getStatusIcon = (success: boolean) => {
    return success ? <CheckCircle color="success" /> : <Error color="error" />;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý Cập nhật Giá Tự động
      </Typography>

      {/* Auto Update Settings */}
      <Card sx={{ mb: 3, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Cài đặt Cập nhật Tự động
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={autoUpdateEnabled}
                onChange={(e) => handleToggleAutoUpdate(e.target.checked)}
              />
            }
            label="Bật cập nhật giá tự động"
          />
          
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Chu kỳ cập nhật</InputLabel>
            <Select
              value={updateInterval}
              label="Chu kỳ cập nhật"
              onChange={(e) => handleIntervalChange(e.target.value as number)}
              disabled={!autoUpdateEnabled}
            >
              <MenuItem value={1}>1 giờ</MenuItem>
              <MenuItem value={3}>3 giờ</MenuItem>
              <MenuItem value={6}>6 giờ</MenuItem>
              <MenuItem value={12}>12 giờ</MenuItem>
              <MenuItem value={24}>24 giờ</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {autoUpdateEnabled && (
          <Box sx={{ display: 'flex', gap: 4, fontSize: '0.9rem', color: 'text.secondary' }}>
            <Box>
              <strong>Lần cập nhật cuối:</strong> {lastUpdate ? formatDateTime(lastUpdate) : 'Chưa có'}
            </Box>
            <Box>
              <strong>Lần cập nhật tiếp theo:</strong> {nextUpdate ? formatDateTime(nextUpdate) : 'Chưa có'}
            </Box>
          </Box>
        )}
      </Card>

      {/* Manual Update */}
      <Card sx={{ mb: 3, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Cập nhật Thủ công
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button
            variant="contained"
            startIcon={isUpdating ? <CircularProgress size={20} /> : <Refresh />}
            onClick={handleUpdateAllProducts}
            disabled={isUpdating || supportedProducts.length === 0}
          >
            {isUpdating ? 'Đang cập nhật...' : 'Cập nhật tất cả'}
          </Button>
          
          <Button
            variant="outlined"
            onClick={loadProducts}
            disabled={isLoading}
          >
            Làm mới danh sách
          </Button>
        </Box>

        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Hỗ trợ:</strong> {Object.keys(SUPPORTED_SITES).join(', ')}
          </Typography>
          <Typography variant="body2">
            <strong>Sản phẩm có thể cập nhật:</strong> {supportedProducts.length}/{productsWithExternalUrl.length}
          </Typography>
        </Alert>
      </Card>

      {/* Products Table */}
      <Card sx={{ mb: 3 }}>
        <Box sx={{ p: 3, pb: 1 }}>
          <Typography variant="h6">
            Danh sách Sản phẩm ({productsWithExternalUrl.length})
          </Typography>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sản phẩm</TableCell>
                <TableCell>Giá hiện tại</TableCell>
                <TableCell>External URL</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                             {productsWithExternalUrl.map((product) => {
                 const domain = product.externalUrl ? new URL(product.externalUrl).hostname.replace('www.', '') : '';
                 const isSupported = Object.keys(SUPPORTED_SITES).includes(domain);
                
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2">{product.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {product.brand}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {formatPrice(product.price)}
                      </Typography>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <Typography variant="caption" color="error" sx={{ textDecoration: 'line-through' }}>
                          {formatPrice(product.originalPrice)}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ maxWidth: 200 }}>
                        <Typography variant="body2" noWrap>
                          {product.externalUrl}
                        </Typography>
                        <Chip 
                          label={domain} 
                          size="small" 
                          color={isSupported ? 'success' : 'warning'}
                          variant="outlined"
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      {isSupported ? (
                        <Chip label="Hỗ trợ" color="success" size="small" />
                      ) : (
                        <Chip label="Không hỗ trợ" color="warning" size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleUpdateSingleProduct(product.id)}
                        disabled={!isSupported}
                      >
                        Cập nhật
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Update Results */}
      {updateResults.length > 0 && (
        <Card>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">
                Kết quả Cập nhật ({updateResults.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Sản phẩm</TableCell>
                      <TableCell>Kết quả</TableCell>
                      <TableCell>Thông báo</TableCell>
                      <TableCell>Thay đổi giá</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {updateResults.map((result, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="body2">{result.productName}</Typography>
                        </TableCell>
                        <TableCell>
                          {getStatusIcon(result.success)}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color={result.success ? 'success.main' : 'error.main'}>
                            {result.message}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {result.oldPrice && result.newPrice && (
                            <Typography variant="body2">
                              {formatPrice(result.oldPrice)} → {formatPrice(result.newPrice)}
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        </Card>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminPriceUpdatePage;
