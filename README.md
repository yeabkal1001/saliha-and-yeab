# Yeab-Saliha E-commerce Platform

A full-stack e-commerce platform built with React (TypeScript) frontend and Ruby on Rails backend.

## 🚀 Features

- **User Authentication**: Secure signup/login with JWT tokens
- **Product Management**: Add, edit, and manage products with images
- **Shopping Cart**: Add/remove items with quantity management
- **Order Management**: Complete order lifecycle for buyers and sellers
- **Wishlist**: Save favorite products
- **Search & Filtering**: Advanced product search and filtering
- **Responsive Design**: Mobile-first responsive UI
- **Real-time Updates**: Live order status updates
- **Admin Dashboard**: Seller analytics and management tools

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **React Router** for navigation
- **React Query** for data fetching
- **Framer Motion** for animations
- **Axios** for API communication

### Backend
- **Ruby on Rails 7** with API mode
- **PostgreSQL** database
- **JWT** authentication
- **Active Storage** for file uploads
- **CORS** enabled for cross-origin requests

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Ruby 3.2+ and Rails 7
- PostgreSQL

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd yeab-saliha/backend
   ```

2. **Install dependencies**
   ```bash
   bundle install
   ```

3. **Database setup**
   ```bash
   rails db:create
   rails db:migrate
   rails db:seed
   ```

4. **Start the server**
   ```bash
   rails server -p 3000
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment configuration**
   Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🚀 Production Deployment

### Environment Variables

Create production environment files:

**Backend (.env)**
```env
RAILS_ENV=production
DATABASE_URL=postgresql://username:password@localhost/database_name
SECRET_KEY_BASE=your_secret_key_base
JWT_SECRET_KEY=your_jwt_secret
```

**Frontend (.env.production)**
```env
VITE_API_URL=https://your-production-api-domain.com
```

### Build for Production

1. **Backend**
   ```bash
   cd backend
   RAILS_ENV=production bundle install
   RAILS_ENV=production rails db:migrate
   RAILS_ENV=production rails assets:precompile
   ```

2. **Frontend**
   ```bash
   cd frontend
   npm run build:prod
   ```

### Deployment Options

#### Option 1: Docker (Recommended)

1. **Build and run with Docker Compose**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

#### Option 2: Manual Deployment

1. **Backend (using Passenger/Nginx)**
   ```bash
   # Install Passenger
   gem install passenger
   passenger-install-nginx-module
   
   # Configure Nginx
   sudo nano /etc/nginx/sites-available/your-app
   sudo ln -s /etc/nginx/sites-available/your-app /etc/nginx/sites-enabled/
   sudo systemctl restart nginx
   ```

2. **Frontend (using Nginx)**
   ```bash
   # Copy built files
   sudo cp -r frontend/dist/* /var/www/html/
   
   # Configure Nginx for SPA routing
   sudo nano /etc/nginx/sites-available/frontend
   ```

## 🔧 Development

### Available Scripts

**Frontend**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:prod` - Build with production optimizations
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run typecheck` - Run TypeScript type checking
- `npm run preview` - Preview production build

**Backend**
- `rails server` - Start development server
- `rails console` - Open Rails console
- `rails db:migrate` - Run database migrations
- `rails db:seed` - Seed database with sample data
- `rails test` - Run tests

### Code Quality

The project includes:
- **ESLint** for JavaScript/TypeScript linting
- **TypeScript** for type safety
- **Prettier** for code formatting
- **RuboCop** for Ruby code style

## 📁 Project Structure

```
yeab-saliha/
├── backend/                 # Rails API backend
│   ├── app/
│   │   ├── controllers/     # API controllers
│   │   ├── models/         # ActiveRecord models
│   │   └── assets/         # Static assets
│   ├── config/             # Rails configuration
│   ├── db/                 # Database migrations
│   └── Dockerfile          # Backend Docker config
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   └── lib/            # Utilities and API
│   ├── public/             # Static assets
│   └── Dockerfile          # Frontend Docker config
└── docker-compose.yml      # Development Docker setup
```

## 🔒 Security Features

- JWT token-based authentication
- CORS configuration
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection

## 📊 Performance Optimizations

### Frontend
- Code splitting with dynamic imports
- Lazy loading of components
- Optimized bundle size with chunk splitting
- Image optimization
- Caching strategies

### Backend
- Database query optimization
- N+1 query prevention
- Caching with Redis (optional)
- Asset compression
- CDN integration ready

## 🧪 Testing

### Frontend Testing
```bash
npm run test
```

### Backend Testing
```bash
rails test
```

## 📈 Monitoring & Analytics

- Error tracking with Sentry (configurable)
- Performance monitoring
- User analytics
- Order tracking and notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Updates

To update the application:

1. **Pull latest changes**
   ```bash
   git pull origin main
   ```

2. **Update dependencies**
   ```bash
   # Frontend
   cd frontend && npm install
   
   # Backend
   cd backend && bundle install
   ```

3. **Run migrations**
   ```bash
   cd backend && rails db:migrate
   ```

4. **Rebuild and restart**
   ```bash
   # Frontend
   cd frontend && npm run build:prod
   
   # Backend
   cd backend && rails restart
   ```

---

**Note**: Make sure to update environment variables and database configurations according to your production setup. 