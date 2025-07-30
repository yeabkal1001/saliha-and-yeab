import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../lib/api';

interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  user_id: number;
  status: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  createOrder: (orderData: { items: Array<{ product_id: number; quantity: number }> }) => Promise<Order>;
  getOrders: () => Promise<void>;
  updateOrderStatus: (orderId: number, status: string) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const getOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/v1/orders');
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: { items: Array<{ product_id: number; quantity: number }> }) => {
    const response = await api.post('/api/v1/orders', orderData);
    const newOrder = response.data.order;
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    await api.put(`/api/v1/orders/${orderId}`, { status });
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status, updated_at: new Date().toISOString() } : order
      )
    );
  };

  const value = {
    orders,
    loading,
    createOrder,
    getOrders,
    updateOrderStatus,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}; 