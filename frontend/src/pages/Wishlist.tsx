import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Heart, ShoppingCart, Trash2, Star } from 'lucide-react';

interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  inStock: boolean;
}

const Wishlist: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      price: 89.99,
      image: '/placeholder-product.jpg',
      rating: 4.5,
      inStock: true
    },
    {
      id: 2,
      name: 'Smartphone Case',
      price: 19.99,
      image: '/placeholder-product.jpg',
      rating: 4.2,
      inStock: true
    },
    {
      id: 3,
      name: 'Laptop Stand',
      price: 45.00,
      image: '/placeholder-product.jpg',
      rating: 4.8,
      inStock: false
    }
  ]);

  const removeFromWishlist = (id: number) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
  };

  const addToCart = (id: number) => {
    // In real app, this would add to cart context
    console.log(`Added item ${id} to cart`);
  };

  const totalValue = wishlistItems.reduce((sum, item) => sum + item.price, 0);

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Your wishlist is empty</h1>
          <p className="text-gray-600 mb-6">Start adding products you love!</p>
          <Button>Browse Products</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
        <p className="text-gray-600">{wishlistItems.length} item(s) • Total value: ${totalValue.toFixed(2)}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item) => (
          <Card key={item.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="aspect-square bg-gray-200 rounded-lg mb-3 relative">
                {/* Product image placeholder */}
                <div className="absolute top-2 right-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromWishlist(item.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-lg">{item.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">${item.price.toFixed(2)}</p>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{item.rating}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {item.inStock ? (
                  <Badge className="bg-green-100 text-green-800">In Stock</Badge>
                ) : (
                  <Badge variant="secondary">Out of Stock</Badge>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  className="flex-1" 
                  disabled={!item.inStock}
                  onClick={() => addToCart(item.id)}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => removeFromWishlist(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {wishlistItems.length > 0 && (
        <div className="mt-8 text-center">
          <Button variant="outline" className="mr-4">
            Share Wishlist
          </Button>
          <Button variant="outline">
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};

export default Wishlist;