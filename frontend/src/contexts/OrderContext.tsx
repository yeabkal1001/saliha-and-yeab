import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem } from './ProductContext';
import { ordersAPI } from '@/lib/api';
import { useAuth } from './AuthContext';

export interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    title: string;
    price: number;
    image_url: string;
  };
}

export interface Order {
  id: number;
  user_id: number;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  order_items: OrderItem[];
  total_amount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
  shipping_address: string;
  billing_address: string;
  tracking_number?: string;
  estimated_delivery?: string;
  notes?: string;
  // Additional properties for compatibility
  items?: OrderItem[];
  total?: number;
  userName?: string;
  userEmail?: string;
  createdAt?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  shippingAddress?: string;
}

export interface OrderUpdate {
  orderId: number;
  status: Order['status'];
  notes?: string;
  tracking_number?: string;
  estimated_delivery?: string;
  // Additional properties for compatibility
  trackingNumber?: string;
  estimatedDelivery?: string;
}

interface OrderContextType {
  orders: Order[];
  sellerOrders: Order[];
  loading: boolean;
  error: string | null;
  getSellerOrders: () => Promise<void>;
  getUserOrders: () => Order[];
  updateOrderStatus: (update: OrderUpdate) => Promise<void>;
  getOrderById: (orderId: number) => Order | undefined;
  addOrder: (orderData: {
    shipping_address: string;
    billing_address?: string;
    order_items: Array<{ product_id: number; quantity: number }>;
  }) => Promise<void>;
  refreshOrders: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | null>(null);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [sellerOrders, setSellerOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user orders from API
  const fetchOrders = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await ordersAPI.getAll();
      setOrders(response.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch seller orders from API
  const fetchSellerOrders = useCallback(async () => {
    if (!user) {
      return;
    }

    try {
      const response = await ordersAPI.getSellerOrders();
      setSellerOrders(response.data);
    } catch (err) {
      console.error('Failed to fetch seller orders:', err);
    }
  }, [user]);

  // Load orders when user changes - SIMPLIFIED TO PREVENT LOOPS
  useEffect(() => {
    // Only fetch if user exists and we haven't loaded yet
    if (user && orders.length === 0) {
      fetchOrders();
      fetchSellerOrders();
    }
  }, [user]); // Only depend on user, not the functions

  const refreshOrders = async () => {
    await fetchOrders();
    await fetchSellerOrders();
  };

  const getSellerOrders = async () => {
    await fetchSellerOrders();
  };

  const getUserOrders = (): Order[] => {
    return orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  const updateOrderStatus = async (update: OrderUpdate) => {
    try {
      const response = await ordersAPI.update(update.orderId, {
        status: update.status,
        notes: update.notes,
        tracking_number: update.tracking_number,
        estimated_delivery: update.estimated_delivery
      });
      
      const updatedOrder = response.data;
      setOrders(prev =>
        prev.map(order =>
          order.id === update.orderId
            ? updatedOrder
            : order
        )
      );
      
      // Also update seller orders if this order is in there
      setSellerOrders(prev =>
        prev.map(order =>
          order.id === update.orderId
            ? updatedOrder
            : order
        )
      );
    } catch (err) {
      console.error('Failed to update order status:', err);
      setError('Failed to update order status. Please try again.');
    }
  };

  const getOrderById = (orderId: number): Order | undefined => {
    return orders.find(order => order.id === orderId);
  };

  const addOrder = async (orderData: {
    shipping_address: string;
    billing_address?: string;
    order_items: Array<{ product_id: number; quantity: number }>;
  }) => {
    try {
      const response = await ordersAPI.create(orderData);
      const newOrder = response.data;
      setOrders(prev => [newOrder, ...prev]);
    } catch (err) {
      console.error('Failed to create order:', err);
      setError('Failed to create order. Please try again.');
    }
  };

  return (
    <OrderContext.Provider value={{
      orders,
      sellerOrders,
      loading,
      error,
      getSellerOrders,
      getUserOrders,
      updateOrderStatus,
      getOrderById,
      addOrder,
      refreshOrders
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within OrderProvider');
  }
  return context;
};