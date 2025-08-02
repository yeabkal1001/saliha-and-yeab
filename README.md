# 🛍️ ShopEase - Full-Stack E-commerce Application

A modern, production-ready e-commerce platform built with React (frontend) and Ruby on Rails (backend).

## 👥 Team Members

- **Yeab Kalayu** (Backend Developer) - `yeabsira.kayel@bitscollege.edu.et`
- **Saliha Abdo** (Frontend Developer) - `saloooalfakiii13@gmail.com`

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
- **JWT Authentication** - Secure user authentication
- **Active Storage** - File upload and management
- **CORS Configuration** - Cross-origin resource sharing
- **Data Validation** - Comprehensive input validation
- **Error Handling** - Proper error responses

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **Framer Motion** - Animation library
- **Axios** - HTTP client

### Backend
- **Ruby on Rails 7** - API-only mode
- **PostgreSQL** - Primary database
- **JWT** - JSON Web Tokens for authentication
- **Active Storage** - File attachment framework
- **CORS** - Cross-origin resource sharing
- **Rack CORS** - CORS middleware

### DevOps & Deployment
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy and static file serving
- **PostgreSQL** - Production database
- **Redis** - Caching and session storage

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Ruby 3.4+ and Bundler
- PostgreSQL
- Docker (optional, for containerized deployment)

### Manual Installation

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

## 🚀 Production Deployment

### Docker Deployment (Recommended)

1. **Build and deploy**
   ```bash
   ./deploy.sh build
   ./deploy.sh deploy
   ```

2. **Access production**
   - Application: http://your-domain.com
   - API: http://your-domain.com/api

### Manual Production Setup

1. **Environment Configuration**
   ```bash
   # Backend
   export DATABASE_URL="postgresql://user:password@localhost/shop_ease_production"
   export JWT_SECRET="your-secret-key"
   
   # Frontend
   export VITE_API_URL="http://your-api-domain.com"
   ```

2. **Database Setup**
   ```bash
   cd backend
   RAILS_ENV=production bundle exec rails db:create db:migrate db:seed
   ```

3. **Build Frontend**
   ```bash
   cd frontend
   npm run build:prod
   ```

## 🧪 Development Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:prod   # Production build with optimizations
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
```

### Backend
```bash
bundle exec rails server     # Start development server
bundle exec rails console    # Rails console
bundle exec rails routes     # List all routes
bundle exec rails db:reset   # Reset database
```

## 📁 Project Structure

```
yeab-saliha/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React contexts for state management
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions and API config
│   │   ├── pages/          # Page components
│   │   └── main.tsx        # Application entry point
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── backend/                # Rails API backend
│   ├── app/
│   │   ├── controllers/    # API controllers
│   │   ├── models/         # ActiveRecord models
│   │   └── assets/         # Backend assets
│   ├── config/             # Rails configuration
│   ├── db/                 # Database migrations and seeds
│   └── Gemfile             # Ruby dependencies
├── docker-compose.yml      # Development Docker setup
├── docker-compose.prod.yml # Production Docker setup
├── deploy.sh              # Deployment script
└── README.md              # Project documentation
```

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **CORS Configuration** - Controlled cross-origin access
- **Input Validation** - Comprehensive data validation
- **SQL Injection Protection** - ActiveRecord ORM protection
- **XSS Protection** - React's built-in XSS protection
- **CSRF Protection** - Rails CSRF token protection

## 📊 Performance Optimizations

- **Code Splitting** - Dynamic imports for better loading
- **Image Optimization** - Compressed and optimized images
- **Caching** - React Query for API response caching
- **Bundle Optimization** - Tree shaking and minification
- **Database Indexing** - Optimized database queries
- **CDN Ready** - Static asset optimization

## 🧪 Testing

### Frontend Testing
```bash
npm run test        # Run unit tests
npm run test:e2e    # Run end-to-end tests
```

### Backend Testing
```bash
bundle exec rspec   # Run RSpec tests
bundle exec rails test  # Run Rails tests
```

## 📈 Monitoring & Logging

- **Application Logs** - Rails and React logging
- **Error Tracking** - Comprehensive error handling
- **Performance Monitoring** - Response time tracking
- **Database Monitoring** - Query performance analysis

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- **Backend Issues**: Contact Yeab Kalayu (`yeabsira.kayel@bitscollege.edu.et`)
- **Frontend Issues**: Contact Saliha Abdo (`saloooalfakiii13@gmail.com`)

## 🔄 Updates & Maintenance

- Regular security updates
- Performance optimizations
- Feature enhancements
- Bug fixes and improvements

---

**Built with ❤️ by Yeab Kalayu & Saliha Abdo** 