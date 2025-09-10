import { supabase } from '../utils/supabaseClient';
import { Product } from '../types';

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  total_amount: number;
  shipping_amount: number;
  tax_amount: number;
  discount_amount: number;
  payment_method?: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  shipping_address: any;
  billing_address?: any;
  tracking_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Joined order items data
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface CreateOrderData {
  items: Array<{
    product_id: string;
    product_name: string;
    product_image?: string;
    quantity: number;
    unit_price: number;
  }>;
  shipping_address: any;
  billing_address?: any;
  payment_method?: string;
  notes?: string;
}

// Create new order
export async function createOrder(orderData: CreateOrderData): Promise<Order> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Calculate totals
    const subtotal = orderData.items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
    const shippingAmount = 0; // Free shipping for now
    const taxAmount = subtotal * 0.1; // 10% tax
    const discountAmount = 0; // No discount for now
    const totalAmount = subtotal + shippingAmount + taxAmount - discountAmount;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        status: 'pending',
        total_amount: totalAmount,
        shipping_amount: shippingAmount,
        tax_amount: taxAmount,
        discount_amount: discountAmount,
        payment_method: orderData.payment_method,
        payment_status: 'pending',
        shipping_address: orderData.shipping_address,
        billing_address: orderData.billing_address,
        notes: orderData.notes
      })
      .select()
      .single();

    if (orderError) {
      throw orderError;
    }

    // Create order items
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_image: item.product_image,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.unit_price * item.quantity
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      // Rollback order if items creation fails
      await supabase.from('orders').delete().eq('id', order.id);
      throw itemsError;
    }

    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

// Get user's orders
export async function getUserOrders(): Promise<Order[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return orders || [];
  } catch (error) {
    console.error('Error getting user orders:', error);
    throw error;
  }
}

// Get order by ID
export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Order not found
      }
      throw error;
    }

    return order;
  } catch (error) {
    console.error('Error getting order by ID:', error);
    throw error;
  }
}

// Get order items
export async function getOrderItems(orderId: string): Promise<OrderItem[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Verify user owns the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single();

    if (orderError) {
      throw new Error('Order not found or access denied');
    }

    const { data: items, error } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    return items || [];
  } catch (error) {
    console.error('Error getting order items:', error);
    throw error;
  }
}

// Update order status (admin only)
export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .update({
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return order;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

// Update payment status
export async function updatePaymentStatus(orderId: string, paymentStatus: Order['payment_status']): Promise<Order> {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .update({
        payment_status: paymentStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return order;
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
}

// Add tracking number
export async function addTrackingNumber(orderId: string, trackingNumber: string): Promise<Order> {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .update({
        tracking_number: trackingNumber,
        status: 'shipped',
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return order;
  } catch (error) {
    console.error('Error adding tracking number:', error);
    throw error;
  }
}

// Cancel order
export async function cancelOrder(orderId: string): Promise<Order> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data: order, error } = await supabase
      .from('orders')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return order;
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw error;
  }
}

// Get all orders (admin only)
export async function getAllOrders(): Promise<Order[]> {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return orders || [];
  } catch (error) {
    console.error('Error getting all orders:', error);
    throw error;
  }
}

// Get order statistics
export async function getOrderStats(): Promise<{
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}> {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('status, total_amount');

    if (error) {
      throw error;
    }

    const stats = {
      totalOrders: orders?.length || 0,
      pendingOrders: orders?.filter((o: any) => o.status === 'pending').length || 0,
      completedOrders: orders?.filter((o: any) => o.status === 'delivered').length || 0,
      totalRevenue: orders?.reduce((sum: number, o: any) => sum + o.total_amount, 0) || 0,
      averageOrderValue: 0
    };

    if (stats.totalOrders > 0) {
      stats.averageOrderValue = stats.totalRevenue / stats.totalOrders;
    }

    return stats;
  } catch (error) {
    console.error('Error getting order stats:', error);
    throw error;
  }
}
