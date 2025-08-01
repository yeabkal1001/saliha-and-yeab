import React from 'react';
import { motion } from 'framer-motion';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, Package, Truck, CheckCircle } from 'lucide-react';

const Orders = () => {
  // Mock order data - in a real app, this would come from an API
  const orders = [
    {
      id: 'ORD-001',
      date: '2024-02-15',
      status: 'delivered',
      total: 199.99,
      items: [
        {
          title: 'Wireless Bluetooth Headphones',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
          quantity: 1,
          price: 199.99
        }
      ]
    },
    {
      id: 'ORD-002',
      date: '2024-02-18',
      status: 'shipped',
      total: 54.98,
      items: [
        {
          title: 'Organic Cotton T-Shirt',
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
          quantity: 1,
          price: 29.99
        },
        {
          title: 'Artisan Coffee Beans',
          image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
          quantity: 1,
          price: 24.99
        }
      ]
    },
    {
      id: 'ORD-003',
      date: '2024-02-20',
      status: 'processing',
      total: 299.99,
      items: [
        {
          title: 'Smart Fitness Watch',
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
          quantity: 1,
          price: 299.99
        }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <ClipboardList className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <header className="flex items-center sticky top-0 z-10 gap-4 border-b border-blue-200 bg-white/80 backdrop-blur-sm px-6 py-4">
        <SidebarTrigger />
        <h1 className="text-2xl font-semibold">My Orders</h1>
      </header>
      
      <main className="flex-1 overflow-auto p-6">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-blue-50 p-8 rounded-full mb-6">
              <ClipboardList className="h-16 w-16 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4">No orders yet</h2>
            <p className="text-gray-600 mb-6 max-w-md">
              You haven't placed any orders yet. Start shopping to see your order history here!
            </p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="bg-white border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">Order {order.id}</h3>
                        <p className="text-gray-600">Placed on {new Date(order.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={`${getStatusColor(order.status)} mb-2`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                        <p className="text-lg font-bold">${order.total.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {order.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.title}</h4>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${item.price.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {order.status === 'delivered' && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-800 text-sm">
                          ✅ Order delivered successfully! We hope you love your purchase.
                        </p>
                      </div>
                    )}

                    {order.status === 'shipped' && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-blue-800 text-sm">
                          🚚 Your order is on its way! Expected delivery in 2-3 business days.
                        </p>
                      </div>
                    )}

                    {order.status === 'processing' && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800 text-sm">
                          📦 Your order is being prepared for shipment.
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