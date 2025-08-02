import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useOrders } from '../contexts/OrderContext';
import { useSidebar } from '../contexts/SidebarContext';
import { 
  ShoppingBag, 
  Home, 
  Package, 
  Plus, 
  ShoppingCart, 
  ClipboardList, 
  User,
  Store,
  LogOut,
  Search,
  Heart,
  Settings,
  Menu,
  X
} from 'lucide-react';

export function AppSidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const { wishlist } = useWishlist();
  const { sellerOrders } = useOrders();
  const { isOpen, toggle, close } = useSidebar();
  
  const pendingOrders = sellerOrders.filter(order => order.status === 'pending').length;
  
  const shopItems = [
    { title: 'Home', icon: Home, href: '/' },
    { title: 'Search', icon: Search, href: '/search' },
    { title: 'Browse Products', icon: Package, href: '/products' },
    { title: 'Wishlist', icon: Heart, href: '/wishlist', badge: wishlist.length },
    { title: 'My Cart', icon: ShoppingCart, href: '/cart' },
    { title: 'My Orders', icon: ClipboardList, href: '/orders' },
  ];

  const sellingItems = [
    { title: 'My Store', icon: Store, href: '/my-listings' },
    { title: 'Add Product', icon: Plus, href: '/add-product' },
    { title: 'Order Management', icon: Settings, href: '/order-management', badge: pendingOrders },
  ];

  const accountItems = [
    { title: 'Profile', icon: User, href: '/profile' },
  ];

  const handleLinkClick = () => {
    // Close sidebar on mobile when link is clicked
    if (window.innerWidth < 768) {
      close();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={close}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-blue-200 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-blue-200">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
              <ShoppingBag className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ShopEase
              </h1>
              <p className="text-xs text-gray-500">
                {user ? `Welcome, ${user.name}` : 'Welcome, Guest'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={close}
            className="md:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Shopping Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-3">Shopping</h3>
            <nav className="space-y-1">
              {shopItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={handleLinkClick}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${location.pathname === item.href 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                  {item.badge && item.badge > 0 && (
                    <Badge variant="secondary" className="ml-auto h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Selling Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600">My Store</h3>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <nav className="space-y-1">
              {sellingItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={handleLinkClick}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${location.pathname === item.href 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                  {item.badge && item.badge > 0 && (
                    <Badge variant="destructive" className="ml-auto h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Account Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-3">Account</h3>
            <nav className="space-y-1">
              {accountItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={handleLinkClick}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${location.pathname === item.href 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-blue-200 p-4">
          <Button
            variant="outline"
            onClick={logout}
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </>
  );
}

// Mobile menu trigger component
export function SidebarTrigger() {
  const { toggle } = useSidebar();
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      className="md:hidden"
    >
      <Menu className="h-4 w-4" />
    </Button>
  );
}