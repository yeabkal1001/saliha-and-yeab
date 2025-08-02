# 🛍️ ShopEase - Full-Stack E-commerce Application

A modern, production-ready e-commerce platform built with React (frontend) and Ruby on Rails (backend).

## 🚀 Features

### Frontend (React + TypeScript)
- **Modern UI/UX** - Built with Tailwind CSS and Radix UI components
- **Authentication** - JWT-based login/signup system
- **Product Management** - Browse, search, and manage products
- **Shopping Cart** - Add/remove items with real-time updates
- **Order Management** - Complete order lifecycle
- **Seller Dashboard** - Manage listings and track sales
- **Wishlist** - Save favorite products
- **Reviews & Ratings** - User-generated content
- **Responsive Design** - Works on all devices

### Backend (Ruby on Rails API)
- **RESTful API** - Clean, well-documented endpoints
- **PostgreSQL Database** - Robust data storage
- **JWT Authentication** - Secure user sessions
- **Active Storage** - File uploads and image management
- **CORS Support** - Cross-origin resource sharing
- **Database Seeding** - Sample data for testing

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Framer Motion** - Smooth animations
- **Axios** - HTTP client

### Backend
- **Ruby on Rails 7** - API-only mode
- **PostgreSQL** - Primary database
- **JWT** - JSON Web Tokens for authentication
- **Active Storage** - File uploads
- **CORS** - Cross-origin support
- **Puma** - Web server

### DevOps
- **Docker** - Containerization
- **Nginx** - Reverse proxy and static file serving
- **Docker Compose** - Multi-container orchestration

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Ruby 3.4+ and Bundler
- PostgreSQL
- Docker (optional, for production)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yeabkal1001/saliha-and-yeab.git
   cd saliha-and-yeab
   ```

2. **Backend Setup**
   ```bash
   cd backend
   bundle install
   rails db:create db:migrate db:seed
   rails server -p 3000
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3002
   - Backend API: http://localhost:3000

## 🔐 Test Credentials

### Admin User
- Email: `admin@example.com`
- Password: `admin123`

### Sample Users
- Email: `john.doe@example.com` / Password: `password123`
- Email: `sarah@example.com` / Password: `password123`
- Email: `mike@example.com` / Password: `password123`
- Email: `emma@example.com` / Password: `password123`

## 🐳 Production Deployment

### Using Docker Compose
```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up -d

# Run database migrations
docker-compose -f docker-compose.prod.yml exec backend rails db:migrate

# Check service status
docker-compose -f docker-compose.prod.yml ps
```

### Manual Deployment
```bash
# Use the deployment script
./deploy.sh

# Or deploy manually
cd frontend && npm run build
cd ../backend && bundle exec rails assets:precompile
```

## 📁 Project Structure

```
yeab-saliha/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── pages/          # Page components
│   │   └── types/          # TypeScript type definitions
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── backend/                # Rails API backend
│   ├── app/
│   │   ├── controllers/    # API controllers
│   │   ├── models/         # ActiveRecord models
│   │   └── serializers/    # JSON serializers
│   ├── config/             # Rails configuration
│   ├── db/                 # Database migrations and seeds
│   └── Gemfile             # Ruby dependencies
├── docker-compose.prod.yml # Production Docker setup
├── nginx.conf              # Nginx configuration
├── deploy.sh               # Deployment script
└── README.md               # This file
```

## 🔧 Development Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
```

### Backend
```bash
rails server         # Start development server
rails console        # Start Rails console
rails db:migrate     # Run database migrations
rails db:seed        # Seed database with sample data
rails routes         # List all routes
```

## 🌟 Key Features Implemented

- ✅ **Real-time Product Management** - Add, edit, delete products
- ✅ **User Authentication** - Secure login/signup with JWT
- ✅ **Shopping Cart** - Add items, update quantities, checkout
- ✅ **Order Processing** - Complete order lifecycle
- ✅ **Seller Dashboard** - Manage listings and track sales
- ✅ **Search & Filtering** - Find products by category, price, etc.
- ✅ **Reviews & Ratings** - User-generated product reviews
- ✅ **Wishlist** - Save favorite products
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Production Ready** - Docker, Nginx, security headers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Yeab** - Backend development
- **Saliha** - Frontend development

## 🙏 Acknowledgments

- React and Rails communities
- Tailwind CSS for the amazing styling framework
- Radix UI for accessible components
- All contributors and testers

---

**Happy Shopping! 🛍️** 