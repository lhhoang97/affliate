import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Switch,
  FormControlLabel,
  Box,
  Alert,
  Button,
  Divider,
  Chip
} from '@mui/material';
import {
  Email,
  NotificationsActive,
  NotificationsOff,
  Save,
  CheckCircle
} from '@mui/icons-material';
import { EmailService } from '../services/emailService';
import { useAuth } from '../contexts/AuthContext';

interface EmailPreferencesData {
  welcomeEmails: boolean;
  orderEmails: boolean;
  priceAlerts: boolean;
  dealNotifications: boolean;
}

const EmailPreferences: React.FC = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<EmailPreferencesData>({
    welcomeEmails: true,
    orderEmails: true,
    priceAlerts: true,
    dealNotifications: true
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadPreferences = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const prefs = await EmailService.getUserEmailPreferences(user.id);
      setPreferences(prefs);
    } catch (error) {
      console.error('Failed to load email preferences:', error);
      setMessage({ type: 'error', text: 'Không thể tải cài đặt email' });
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const handlePreferenceChange = (key: keyof EmailPreferencesData, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  useEffect(() => {
    if (user?.id) {
      loadPreferences();
    }
  }, [user?.id, loadPreferences]);

  const handleSave = async () => {
    if (!user?.id) return;

    setSaving(true);
    setMessage(null);
    
    try {
      await EmailService.updateUserEmailPreferences(user.id, preferences);
      setMessage({ type: 'success', text: 'Cài đặt email đã được lưu thành công!' });
    } catch (error) {
      console.error('Failed to save email preferences:', error);
      setMessage({ type: 'error', text: 'Không thể lưu cài đặt email' });
    } finally {
      setSaving(false);
    }
  };

  const getPreferenceIcon = (enabled: boolean) => {
    return enabled ? <NotificationsActive color="primary" /> : <NotificationsOff color="disabled" />;
  };

  const getPreferenceDescription = (key: keyof EmailPreferencesData) => {
    const descriptions = {
      welcomeEmails: 'Nhận email chào mừng khi đăng ký tài khoản mới',
      orderEmails: 'Nhận email xác nhận và cập nhật trạng thái đơn hàng',
      priceAlerts: 'Nhận thông báo khi giá sản phẩm trong wishlist giảm',
      dealNotifications: 'Nhận thông báo về các deal mới và khuyến mãi'
    };
    return descriptions[key];
  };

  const getPreferenceLabel = (key: keyof EmailPreferencesData) => {
    const labels = {
      welcomeEmails: 'Email chào mừng',
      orderEmails: 'Email đơn hàng',
      priceAlerts: 'Thông báo giá',
      dealNotifications: 'Thông báo deal'
    };
    return labels[key];
  };

  const enabledCount = Object.values(preferences).filter(Boolean).length;
  const totalCount = Object.keys(preferences).length;

  return (
    <Card>
      <CardHeader
        title={
          <Box display="flex" alignItems="center" gap={2}>
            <Email color="primary" />
            <Typography variant="h6">Cài đặt Email</Typography>
            <Chip 
              label={`${enabledCount}/${totalCount} bật`}
              color={enabledCount > 0 ? 'primary' : 'default'}
              size="small"
            />
          </Box>
        }
        subheader="Quản lý các thông báo email bạn muốn nhận từ BestFinds"
      />
      
      <CardContent>
        {message && (
          <Alert 
            severity={message.type} 
            sx={{ mb: 2 }}
            onClose={() => setMessage(null)}
          >
            {message.text}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Chọn các loại email bạn muốn nhận. Bạn có thể thay đổi cài đặt này bất kỳ lúc nào.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {Object.entries(preferences).map(([key, value]) => (
            <Box key={key}>
              <FormControlLabel
                control={
                  <Switch
                    checked={value}
                    onChange={(e) => handlePreferenceChange(key as keyof EmailPreferencesData, e.target.checked)}
                    disabled={loading || saving}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getPreferenceIcon(value)}
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {getPreferenceLabel(key as keyof EmailPreferencesData)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {getPreferenceDescription(key as keyof EmailPreferencesData)}
                      </Typography>
                    </Box>
                  </Box>
                }
                sx={{ 
                  width: '100%',
                  alignItems: 'flex-start',
                  '& .MuiFormControlLabel-label': { width: '100%' }
                }}
              />
              {key !== 'dealNotifications' && <Divider sx={{ mt: 1 }} />}
            </Box>
          ))}
        </Box>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {enabledCount === 0 
              ? 'Bạn sẽ không nhận được email thông báo nào'
              : `Bạn sẽ nhận ${enabledCount} loại email thông báo`
            }
          </Typography>
          
          <Button
            variant="contained"
            startIcon={saving ? <CheckCircle /> : <Save />}
            onClick={handleSave}
            disabled={loading || saving}
            sx={{ minWidth: 120 }}
          >
            {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
          </Button>
        </Box>

        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Lưu ý:</strong> Các email quan trọng về tài khoản (như đặt lại mật khẩu) 
            vẫn sẽ được gửi bất kể cài đặt này.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EmailPreferences;
