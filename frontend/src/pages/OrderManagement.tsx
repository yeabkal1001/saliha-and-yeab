import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useOrders, Order } from '../contexts/OrderContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Edit,
  Eye,
  Calendar,
  MapPin,
  User,
  Mail
} from 'lucide-react';

const OrderManagement = () => {
  const { getSellerOrders, updateOrderStatus, getOrderById } = useOrders();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [updateForm, setUpdateForm] = useState({
    status: '',
    notes: '',
    trackingNumber: '',
    estimatedDelivery: ''
  });

  const { sellerOrders } = useOrders();
  
  const filteredOrders = selectedStatus === 'all' 
    ? sellerOrders 
    : sellerOrders.filter(order => order.status === selectedStatus);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
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

  const handleUpdateOrder = (orderId: string) => {
    if (!updateForm.status) {
      toast({
        title: "Status required",
        description: "Please select a status to update the order.",
        variant: "destructive"
      });
      return;
    }

    const updateData: any = {
      orderId: parseInt(orderId),
      status: updateForm.status as 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled',
    };

    if (updateForm.notes) updateData.notes = updateForm.notes;
    if (updateForm.trackingNumber) updateData.trackingNumber = updateForm.trackingNumber;
    if (updateForm.estimatedDelivery) {
      updateData.estimatedDelivery = new Date(updateForm.estimatedDelivery);
    }

    updateOrderStatus(updateData);
    
    toast({
      title: "Order updated!",
      description: `Order ${orderId} has been updated successfully.`,
    });

    setSelectedOrder(null);
    setUpdateForm({ status: '', notes: '', trackingNumber: '', estimatedDelivery: '' });
  };

  const openUpdateDialog = (order: Order) => {
    setSelectedOrder(order.id.toString());
    setUpdateForm({
      status: order.status,
      notes: order.notes || '',
      trackingNumber: order.trackingNumber || '',
      estimatedDelivery: order.estimatedDelivery 
        ? new Date(order.estimatedDelivery).toISOString().split('T')[0] 
        : ''
    });
  };

  const orderStats = {
    total: sellerOrders.length,
    pending: sellerOrders.filter(o => o.status === 'pending').length,
    processing: sellerOrders.filter(o => o.status === 'processing').length,
    shipped: sellerOrders.filter(o => o.status === 'shipped').length,
    delivered: sellerOrders.filter(o => o.status === 'delivered').length,
  };

  return (
    <div className="flex flex-col h-full w-full">
      <header className="flex items-center sticky top-0 z-10 gap-4 border-b border-blue-200 bg-white/80 backdrop-blur-sm px-6 py-4">
        <SidebarTrigger />
        <h1 className="text-2xl font-semibold">Order Management</h1>
      </header>
      
      <main className="flex-1 overflow-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Orders</p>
                  <p className="text-2xl font-bold">{orderStats.total}</p>
                </div>
                <Package className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100">Pending</p>
                  <p className="text-2xl font-bold">{orderStats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Processing</p>
                  <p className="text-2xl font-bold">{orderStats.processing}</p>
                </div>
                <Package className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100">Shipped</p>
                  <p className="text-2xl font-bold">{orderStats.shipped}</p>
                </div>
                <Truck className="h-8 w-8 text-indigo-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Delivered</p>
                  <p className="text-2xl font-bold">{orderStats.delivered}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                <p className="text-gray-600">
                  {selectedStatus === 'all' 
                    ? "You haven't received any orders yet." 
                    : `No orders with status "${selectedStatus}".`}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="bg-white border-blue-200">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Order {order.id}</CardTitle>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {order.userName}
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {order.userEmail}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {order.createdAt.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Order Details - {order.id}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="font-medium">Customer</Label>
                                  <p>{order.userName}</p>
                                  <p className="text-sm text-gray-600">{order.userEmail}</p>
                                </div>
                                <div>
                                  <Label className="font-medium">Order Date</Label>
                                  <p>{order.createdAt.toLocaleString()}</p>
                                </div>
                              </div>
                              
                              <div>
                                <Label className="font-medium">Shipping Address</Label>
                                <p className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {order.shippingAddress}
                                </p>
                              </div>

                              {order.trackingNumber && (
                                <div>
                                  <Label className="font-medium">Tracking Number</Label>
                                  <p className="font-mono">{order.trackingNumber}</p>
                                </div>
                              )}

                              {order.estimatedDelivery && (
                                <div>
                                  <Label className="font-medium">Estimated Delivery</Label>
                                  <p>{new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                                </div>
                              )}

                              <div>
                                <Label className="font-medium">Items</Label>
                                <div className="space-y-2 mt-2">
                                  {order.items.map(item => (
                                    <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                                      <img 
                                        src={item.product.image} 
                                        alt={item.product.title}
                                        className="w-12 h-12 object-cover rounded"
                                      />
                                      <div className="flex-1">
                                        <p className="font-medium">{item.product.title}</p>
                                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                      </div>
                                      <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="border-t pt-4">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">Total</span>
                                  <span className="text-xl font-bold text-blue-600">${order.total.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openUpdateDialog(order)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{order.shippingAddress}</span>
                      </div>
                      <span className="text-xl font-bold text-blue-600">${order.total.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                      {order.trackingNumber && (
                        <span className="font-mono">Tracking: {order.trackingNumber}</span>
                      )}
                      {order.estimatedDelivery && (
                        <span>ETA: {new Date(order.estimatedDelivery).toLocaleDateString()}</span>
                      )}
                    </div>

                    {order.notes && (
                      <div className="mt-3 p-2 bg-blue-50 rounded">
                        <p className="text-sm"><strong>Notes:</strong> {order.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Update Order Dialog */}
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Order {selectedOrder}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="status">Order Status</Label>
                <Select value={updateForm.status} onValueChange={(value) => setUpdateForm(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="trackingNumber">Tracking Number</Label>
                <Input
                  id="trackingNumber"
                  value={updateForm.trackingNumber}
                  onChange={(e) => setUpdateForm(prev => ({ ...prev, trackingNumber: e.target.value }))}
                  placeholder="Enter tracking number"
                />
              </div>

              <div>
                <Label htmlFor="estimatedDelivery">Estimated Delivery Date</Label>
                <Input
                  id="estimatedDelivery"
                  type="date"
                  value={updateForm.estimatedDelivery}
                  onChange={(e) => setUpdateForm(prev => ({ ...prev, estimatedDelivery: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={updateForm.notes}
                  onChange={(e) => setUpdateForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any notes for the customer..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => selectedOrder && handleUpdateOrder(selectedOrder)}
                  className="flex-1"
                >
                  Update Order
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedOrder(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default OrderManagement;