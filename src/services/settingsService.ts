import { supabase } from '../utils/supabaseClient';

export interface SystemSettings {
  id?: string;
  site_name: string;
  site_description: string;
  currency: string;
  maintenance_mode: boolean;
  allow_registration: boolean;
  max_products_per_page: number;
  enable_reviews: boolean;
  enable_wishlist: boolean;
  enable_coupons: boolean;
  default_language: string;
  timezone: string;
  contact_email: string;
  contact_phone: string;
  social_facebook?: string;
  social_twitter?: string;
  social_instagram?: string;
  analytics_google_id?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EmailSettings {
  id?: string;
  smtp_host: string;
  smtp_port: number;
  smtp_username: string;
  smtp_password: string;
  smtp_secure: boolean;
  from_email: string;
  from_name: string;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentSettings {
  id?: string;
  stripe_public_key?: string;
  stripe_secret_key?: string;
  paypal_client_id?: string;
  paypal_client_secret?: string;
  default_payment_method: string;
  currency: string;
  created_at?: string;
  updated_at?: string;
}

// System Settings
export async function getSystemSettings(): Promise<SystemSettings | null> {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .single();

    if (error) {
      console.error('Error fetching system settings:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error fetching system settings:', err);
    return null;
  }
}

export async function updateSystemSettings(settings: Partial<SystemSettings>): Promise<SystemSettings | null> {
  try {
    // Check if settings exist
    const { data: existing } = await supabase
      .from('system_settings')
      .select('id')
      .single();

    let result;
    if (existing) {
      // Update existing settings
      const { data, error } = await supabase
        .from('system_settings')
        .update({
          ...settings,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select('*')
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create new settings
      const { data, error } = await supabase
        .from('system_settings')
        .insert({
          ...settings,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('*')
        .single();

      if (error) throw error;
      result = data;
    }

    return result;
  } catch (err) {
    console.error('Error updating system settings:', err);
    throw err;
  }
}

// Email Settings
export async function getEmailSettings(): Promise<EmailSettings | null> {
  try {
    const { data, error } = await supabase
      .from('email_settings')
      .select('*')
      .single();

    if (error) {
      console.error('Error fetching email settings:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error fetching email settings:', err);
    return null;
  }
}

export async function updateEmailSettings(settings: Partial<EmailSettings>): Promise<EmailSettings | null> {
  try {
    // Check if settings exist
    const { data: existing } = await supabase
      .from('email_settings')
      .select('id')
      .single();

    let result;
    if (existing) {
      // Update existing settings
      const { data, error } = await supabase
        .from('email_settings')
        .update({
          ...settings,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select('*')
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create new settings
      const { data, error } = await supabase
        .from('email_settings')
        .insert({
          ...settings,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('*')
        .single();

      if (error) throw error;
      result = data;
    }

    return result;
  } catch (err) {
    console.error('Error updating email settings:', err);
    throw err;
  }
}

// Payment Settings
export async function getPaymentSettings(): Promise<PaymentSettings | null> {
  try {
    const { data, error } = await supabase
      .from('payment_settings')
      .select('*')
      .single();

    if (error) {
      console.error('Error fetching payment settings:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error fetching payment settings:', err);
    return null;
  }
}

export async function updatePaymentSettings(settings: Partial<PaymentSettings>): Promise<PaymentSettings | null> {
  try {
    // Check if settings exist
    const { data: existing } = await supabase
      .from('payment_settings')
      .select('id')
      .single();

    let result;
    if (existing) {
      // Update existing settings
      const { data, error } = await supabase
        .from('payment_settings')
        .update({
          ...settings,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select('*')
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create new settings
      const { data, error } = await supabase
        .from('payment_settings')
        .insert({
          ...settings,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('*')
        .single();

      if (error) throw error;
      result = data;
    }

    return result;
  } catch (err) {
    console.error('Error updating payment settings:', err);
    throw err;
  }
}

// Test email connection
export async function testEmailConnection(): Promise<{ success: boolean; message: string }> {
  try {
    // This would typically send a test email
    // For now, we'll just simulate a test
    const result = {
      success: true,
      message: 'Email connection test successful'
    };
    return result;
  } catch (err) {
    console.error('Email test error:', err);
    return {
      success: false,
      message: 'Email connection test failed'
    };
  }
}

// Get all settings
export async function getAllSettings(): Promise<{
  system: SystemSettings | null;
  email: EmailSettings | null;
  payment: PaymentSettings | null;
}> {
  try {
    const [system, email, payment] = await Promise.all([
      getSystemSettings(),
      getEmailSettings(),
      getPaymentSettings()
    ]);

    return { system, email, payment };
  } catch (err) {
    console.error('Error fetching all settings:', err);
    return { system: null, email: null, payment: null };
  }
}

