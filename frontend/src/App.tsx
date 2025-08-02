import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Contexts
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ProductProvider } from './contexts/ProductContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { ReviewProvider } from './contexts/ReviewContext';
import { OrderProvider } from './contexts/OrderContext';
import { SearchProvider } from './contexts/SearchContext';
import { SidebarProvider } from '@/components/ui/sidebar';

// Components
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppSidebar } from './components/AppSidebar';

// Pages
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Index from './pages/Index';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import Search from './pages/Search';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import MyListings from './pages/MyListings';
import OrderManagement from './pages/OrderManagement';
import SellerDashboard from './pages/SellerDashboard';
import Profile from './pages/Profile';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/signin" element={
          user ? <Navigate to="/" replace /> : <SignIn />
        } />
        <Route path="/signup" element={
          user ? <Navigate to="/" replace /> : <SignUp />
        } />
        
        {/* Protected routes - require authentication */}
        <Route path="/*" element={
          <ProtectedRoute>
            <SidebarProvider>
              <div className="flex min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100">
                <AppSidebar />
                <div className="flex-1 flex flex-col">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetails />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/add-product" element={<AddProduct />} />
                    <Route path="/edit-product/:id" element={<EditProduct />} />
                    <Route path="/my-listings" element={<MyListings />} />
                    <Route path="/order-management" element={<OrderManagement />} />
                    <Route path="/seller-dashboard" element={<SellerDashboard />} />
                    <Route path="/profile" element={<Profile />} />
                  </Routes>
                </div>
              </div>
            </SidebarProvider>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <AuthProvider>
          <ProductProvider>
            <WishlistProvider>
              <ReviewProvider>
                <OrderProvider>
                  <SearchProvider>
                    <AppContent />
                    <Toaster />
                  </SearchProvider>
                </OrderProvider>
              </ReviewProvider>
            </WishlistProvider>
          </ProductProvider>
        </AuthProvider>
      </NotificationProvider>
    </QueryClientProvider>
  );
}

export default App;