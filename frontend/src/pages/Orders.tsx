import React, { useEffect } from 'react';
import { useOrders } from '../contexts/OrderContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';

const Orders: React.FC = () => {
  const { orders, loading, getOrders } = useOrders();

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-gray-600">Track your order history and status</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-4">Start shopping to see your orders here</p>
            <Button>Browse Products</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Order #{order.id}
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium">${item.price.toFixed(2)}</p>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <p className="text-lg font-bold">Total</p>
                    <p className="text-lg font-bold">${order.total_amount.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders; 