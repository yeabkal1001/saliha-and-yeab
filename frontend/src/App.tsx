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
import { SidebarProvider } from './contexts/SidebarContext';

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
import Profile from './pages/Profile';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import MyListings from './pages/MyListings';
import OrderManagement from './pages/OrderManagement';
import SellerDashboard from './pages/SellerDashboard';
import Search from './pages/Search';
import Notifications from './pages/Notifications';
import NotFound from './pages/NotFound';

// Create a client
const queryClient = new QueryClient();

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
        
        {/* Protected routes */}
        <Route path="/*" element={
          <ProtectedRoute>
            <SidebarProvider>
              <div className="flex min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100">
                <AppSidebar />
                <main className="flex-1 overflow-y-auto">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetails />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/add-product" element={<AddProduct />} />
                    <Route path="/edit-product/:id" element={<EditProduct />} />
                    <Route path="/my-listings" element={<MyListings />} />
                    <Route path="/order-management" element={<OrderManagement />} />
                    <Route path="/seller-dashboard" element={<SellerDashboard />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
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
      <AuthProvider>
        <NotificationProvider>
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
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;