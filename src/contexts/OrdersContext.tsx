import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
  Order
} from '../types';
import { 
  getUserOrders, 
  getOrderById, 
  updateOrderStatus,
  getOrderStats
} from '../services/orderService';
import { useAuth } from './AuthContext';

interface OrderStatistics {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

interface OrdersContextType {
  orders: Order[];
  currentOrder: Order | null;
  orderStatistics: OrderStatistics | null;
  isLoading: boolean;
  error: string | null;
  loadUserOrders: () => Promise<void>;
  loadOrderById: (orderId: string) => Promise<void>;
  updateOrder: (orderId: string, status: Order['status']) => Promise<void>;
  loadOrderStatistics: () => Promise<void>;
  refreshOrders: () => Promise<void>;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

interface OrdersProviderProps {
  children: ReactNode;
}

export const OrdersProvider: React.FC<OrdersProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orderStatistics, setOrderStatistics] = useState<OrderStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const isAuthenticated = auth?.isAuthenticated || false;

  // Load user orders
  const loadUserOrders = useCallback(async () => {
    if (!isAuthenticated) {
      setOrders([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const userOrders = await getUserOrders();
      setOrders(userOrders);
    } catch (err) {
      console.error('Error loading user orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Load specific order by ID
  const loadOrderById = async (orderId: string) => {
    if (!isAuthenticated) {
      setCurrentOrder(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const order = await getOrderById(orderId);
      setCurrentOrder(order);
    } catch (err) {
      console.error('Error loading order:', err);
      setError(err instanceof Error ? err.message : 'Failed to load order');
    } finally {
      setIsLoading(false);
    }
  };

  // Update order status
  const updateOrder = async (orderId: string, status: Order['status']) => {
    if (!isAuthenticated) {
      setError('Please login to update orders');
      return;
    }

    try {
      setError(null);
      await updateOrderStatus(orderId, status);
      
      // Refresh orders list
      await loadUserOrders();
      
      // Update current order if it's the same
      if (currentOrder && currentOrder.id === orderId) {
        setCurrentOrder({ ...currentOrder, status });
      }
    } catch (err) {
      console.error('Error updating order:', err);
      setError(err instanceof Error ? err.message : 'Failed to update order');
    }
  };

  // Load order statistics
  const loadOrderStatistics = useCallback(async () => {
    if (!isAuthenticated) {
      setOrderStatistics(null);
      return;
    }

    try {
      setError(null);
      const stats = await getOrderStats();
      setOrderStatistics(stats);
    } catch (err) {
      console.error('Error loading order statistics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load order statistics');
    }
  }, [isAuthenticated]);

  // Refresh all orders data
  const refreshOrders = async () => {
    await Promise.all([
      loadUserOrders(),
      loadOrderStatistics()
    ]);
  };

  // Load orders when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      loadUserOrders();
      loadOrderStatistics();
    } else {
      setOrders([]);
      setCurrentOrder(null);
      setOrderStatistics(null);
    }
  }, [isAuthenticated, loadUserOrders, loadOrderStatistics]);

  const value: OrdersContextType = {
    orders,
    currentOrder,
    orderStatistics,
    isLoading,
    error,
    loadUserOrders,
    loadOrderById,
    updateOrder,
    loadOrderStatistics,
    refreshOrders
  };

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = (): OrdersContextType => {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};
