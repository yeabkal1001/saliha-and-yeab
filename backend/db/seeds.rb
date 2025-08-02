# Clear existing data
puts "Clearing existing data..."
User.destroy_all
Product.destroy_all
Order.destroy_all
OrderItem.destroy_all
Review.destroy_all
WishlistItem.destroy_all

# Create admin user (password will be encrypted)
admin_user = User.create!(
  name: "Admin User",
  email: "admin@shopease.com",
  password: "admin123",
  store_name: "ShopEase Admin Store",
  admin: true
)
puts "Created admin user: #{admin_user.email} (password: admin123)"

# Create 5 regular users with products
users_data = [
  {
    name: "Sarah Johnson",
    email: "sarah@example.com",
    password: "password123",
    store_name: "Sarah's Electronics",
    products: [
      {
        title: "Wireless Bluetooth Headphones",
        description: "Premium quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.",
        price: 199.99,
        category: "Electronics",
        image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        stock_quantity: 15
      },
      {
        title: "Smart Fitness Watch",
        description: "Advanced fitness tracking with heart rate monitor, GPS, and smartphone integration. Track your workouts with precision.",
        price: 299.99,
        category: "Electronics",
        image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
        stock_quantity: 8
      }
    ]
  },
  {
    name: "Mike Chen",
    email: "mike@example.com",
    password: "password123",
    store_name: "Mike's Coffee Corner",
    products: [
      {
        title: "Artisan Coffee Beans",
        description: "Premium single-origin coffee beans, freshly roasted with rich flavor notes. Perfect for coffee enthusiasts.",
        price: 24.99,
        category: "Food & Beverages",
        image_url: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
        stock_quantity: 98
      },
      {
        title: "Ceramic Coffee Mug Set",
        description: "Beautiful handcrafted ceramic coffee mugs, perfect for your morning brew. Set of 4 with different designs.",
        price: 39.99,
        category: "Home & Garden",
        image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
        stock_quantity: 25
      }
    ]
  },
  {
    name: "Emma Wilson",
    email: "emma@example.com",
    password: "password123",
    store_name: "Emma's Fashion Boutique",
    products: [
      {
        title: "Organic Cotton T-Shirt",
        description: "Comfortable and sustainable organic cotton t-shirt available in multiple colors. Made from 100% organic cotton.",
        price: 29.99,
        category: "Clothing",
        image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        stock_quantity: 50
      },
      {
        title: "Leather Laptop Bag",
        description: "Handcrafted genuine leather laptop bag with multiple compartments and adjustable strap. Perfect for professionals.",
        price: 149.99,
        category: "Accessories",
        image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
        stock_quantity: 12
      }
    ]
  },
  {
    name: "David Rodriguez",
    email: "david@example.com",
    password: "password123",
    store_name: "David's Sports Gear",
    products: [
      {
        title: "Professional Basketball",
        description: "Official size and weight basketball perfect for indoor and outdoor play. Made with premium materials.",
        price: 49.99,
        category: "Sports & Outdoors",
        image_url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400",
        stock_quantity: 30
      },
      {
        title: "Yoga Mat Premium",
        description: "Non-slip yoga mat with alignment lines, perfect for yoga, pilates, and fitness activities.",
        price: 79.99,
        category: "Sports & Outdoors",
        image_url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
        stock_quantity: 20
      }
    ]
  },
  {
    name: "Lisa Thompson",
    email: "lisa@example.com",
    password: "password123",
    store_name: "Lisa's Home Decor",
    products: [
      {
        title: "Indoor Plant Collection",
        description: "Set of 3 low-maintenance indoor plants perfect for home or office decoration. Includes care instructions.",
        price: 79.99,
        category: "Home & Garden",
        image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
        stock_quantity: 25
      },
      {
        title: "Wall Art Canvas",
        description: "Beautiful abstract wall art canvas, perfect for living room or bedroom decoration. Multiple sizes available.",
        price: 89.99,
        category: "Home & Garden",
        image_url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400",
        stock_quantity: 10
      }
    ]
  }
]

# Create users and their products
users_data.each do |user_data|
  user = User.create!(
    name: user_data[:name],
    email: user_data[:email],
    password: user_data[:password],
    store_name: user_data[:store_name],
    admin: false
  )
  puts "Created user: #{user.email} (password: #{user_data[:password]})"
  
  # Create products for this user
  user_data[:products].each do |product_data|
    product = user.products.create!(product_data)
    puts "  - Created product: #{product.title}"
    
    # Add some reviews for each product
    if product.category == "Electronics"
      # Get a random user that's not the current product owner
      other_users = User.where.not(id: user.id).limit(2)
      if other_users.any?
        product.reviews.create!(
          user: other_users.first,
          rating: rand(4..5),
          comment: "Great product! Highly recommend."
        )
        if other_users.count > 1
          product.reviews.create!(
            user: other_users.second,
            rating: rand(4..5),
            comment: "Excellent quality and fast shipping."
          )
        end
      end
    end
  end
end

puts "\nSeed data created successfully!"
puts "Admin user: admin@shopease.com (password: admin123)"
puts "Regular users: sarah@example.com, mike@example.com, emma@example.com, david@example.com, lisa@example.com (password: password123)"
puts "Total users: #{User.count}"
puts "Total products: #{Product.count}"
puts "Total reviews: #{Review.count}" 