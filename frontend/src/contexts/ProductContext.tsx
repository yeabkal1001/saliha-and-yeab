import React, { createContext, useContext, useState, useEffect } from 'react';
import { productsAPI, ordersAPI } from '../lib/api';
import { useNotifications } from './NotificationContext';
import { useAuth } from './AuthContext';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock_quantity: number;
  user_id: string;
  user: {
    id: string;
    name: string;
  };
  reviews: Array<{
    rating: number;
    comment: string;
    created_at: string;
  }>;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  shipping_address: string;
}

interface ProductContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  myListings: Product[];
  loading: boolean;
  error: string | null;
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (shippingAddress: string) => void;
  getSellerOrders: (sellerId: string) => Order[];
  refreshProducts: () => void;
  getCartTotal: () => number;
}

const ProductContext = createContext<ProductContextType | null>(null);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { addNotification } = useNotifications();
  const { user } = useAuth();

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      setProducts(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders from API - only when user is authenticated
  const fetchOrders = async () => {
    if (!user) return; // Don't fetch orders if user is not authenticated
    
    try {
      const response = await ordersAPI.getAll();
      setOrders(response.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      // Don't set error for orders since it's not critical
    }
  };

  // Load products and orders on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch orders when user changes
  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setOrders([]); // Clear orders when user logs out
    }
  }, [user]);

  const refreshProducts = () => {
    fetchProducts();
  };

  const addProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    try {
      const response = await productsAPI.create(productData);
      const newProduct = response.data;
      setProducts(prev => [newProduct, ...prev]);
      addNotification({
        type: 'message',
        title: 'Success',
        message: 'Product added successfully!'
      });
    } catch (err) {
      console.error('Failed to add product:', err);
      addNotification({
        type: 'message',
        title: 'Error',
        message: 'Failed to add product. Please try again.'
      });
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const response = await productsAPI.update(parseInt(id), updates);
      const updatedProduct = response.data;
      setProducts(prev =>
        prev.map(product =>
          product.id === id ? updatedProduct : product
        )
      );
      addNotification({
        type: 'message',
        title: 'Success',
        message: 'Product updated successfully!'
      });
    } catch (err) {
      console.error('Failed to update product:', err);
      addNotification({
        type: 'message',
        title: 'Error',
        message: 'Failed to update product. Please try again.'
      });
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await productsAPI.delete(parseInt(productId));
      setProducts(prev => prev.filter(p => p.id !== productId));
      // Also remove from cart if present
      setCart(prev => prev.filter(item => item.product.id !== productId));
      addNotification({
        type: 'message',
        title: 'Success',
        message: 'Product deleted successfully!'
      });
    } catch (err) {
      console.error('Failed to delete product:', err);
      addNotification({
        type: 'message',
        title: 'Error',
        message: 'Failed to delete product. Please try again.'
      });
    }
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
    addNotification({
      type: 'message',
      title: 'Added to Cart',
      message: `${product.title} added to cart!`
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prev => prev.map(item =>
      item.product.id === productId
        ? { ...item, quantity }
        : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = async (shippingAddress: string) => {
    if (!user) {
      addNotification({
        type: 'message',
        title: 'Error',
        message: 'You must be logged in to place an order.'
      });
      return;
    }

    if (cart.length === 0) {
      addNotification({
        type: 'message',
        title: 'Error',
        message: 'Your cart is empty.'
      });
      return;
    }

    try {
      const orderData = {
        items: cart.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        })),
        total: getCartTotal(),
        shipping_address: shippingAddress
      };

      const response = await ordersAPI.create(orderData);
      const newOrder = response.data;
      
      setOrders(prev => [newOrder, ...prev]);
      clearCart();
      
      addNotification({
        type: 'message',
        title: 'Order Placed!',
        message: 'Your order has been placed successfully.'
      });
    } catch (err) {
      console.error('Failed to place order:', err);
      addNotification({
        type: 'message',
        title: 'Error',
        message: 'Failed to place order. Please try again.'
      });
    }
  };

  // Get products listed by the current user
  const myListings = products.filter(product => product.user_id === user?.id);

  // Get orders for a specific seller
  const getSellerOrders = (sellerId: string): Order[] => {
    return orders.filter(order => 
      order.items.some(item => item.product.user_id === sellerId)
    );
  };

  const getCartTotal = (): number => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const value: ProductContextType = {
    products,
    cart,
    orders,
    myListings,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    placeOrder,
    getSellerOrders,
    refreshProducts,
    getCartTotal
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};