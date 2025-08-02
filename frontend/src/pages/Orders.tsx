import React from 'react';
import { motion } from 'framer-motion';
import { SidebarTrigger } from '../components/AppSidebar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOrders } from '../contexts/OrderContext';
import { useAuth } from '../contexts/AuthContext';
import { ClipboardList, Package, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const Orders = () => {
  const { orders, loading } = useOrders();
  const { user } = useAuth();

  // Filter orders for current user
  const userOrders = orders.filter(order => order.user_id === parseInt(user?.id || '0'));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'paid':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <ClipboardList className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full w-full">
        <header className="flex items-center sticky top-0 z-10 gap-4 border-b border-blue-200 bg-white/80 backdrop-blur-sm px-6 py-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-semibold">My Orders</h1>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading orders...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      <header className="flex items-center sticky top-0 z-10 gap-4 border-b border-blue-200 bg-white/80 backdrop-blur-sm px-6 py-4">
        <SidebarTrigger />
        <h1 className="text-2xl font-semibold">My Orders</h1>
      </header>
      
      <main className="flex-1 overflow-auto p-6">
        {userOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-blue-50 p-8 rounded-full mb-6">
              <ClipboardList className="h-16 w-16 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4">No orders yet</h2>
            <p className="text-gray-600 mb-8">Start shopping to see your orders here</p>
          </div>
        ) : (
          <div className="space-y-6">
            {userOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="bg-white border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                        <span className="text-lg font-bold text-blue-600">
                          ${order.total_amount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {order.order_items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <img 
                            src={item.product.image_url} 
                            alt={item.product.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.product.title}</h4>
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {order.shipping_address && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                          <strong>Shipping Address:</strong> {order.shipping_address}
                        </p>
                      </div>
                    )}
                    
                    {order.tracking_number && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          <strong>Tracking:</strong> {order.tracking_number}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders;