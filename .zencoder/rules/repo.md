# Repository Configuration

## Testing Framework
- **Primary Framework**: Playwright
- **Language**: TypeScript
- **Test Location**: `/tests/e2e/`

## Application Details
- **Type**: Full-stack E-commerce Application (ShopEase)
- **Frontend**: React 18 + TypeScript + Vite (http://localhost:3001)
- **Backend**: Ruby on Rails 7.1 API (http://localhost:3000)
- **Database**: MySQL 8.0 (localhost:3307)

## Key User Flows for E2E Testing
1. User Authentication (Sign Up, Sign In, Sign Out)
2. Product Browsing and Search
3. Shopping Cart Management
4. Checkout and Order Placement
5. Wishlist Management
6. Product Reviews
7. Seller Dashboard (Product Management)
8. Admin Dashboard

## Test Data
- Test users should be created during test execution
- Product data can be seeded or created via API
- Database should be cleaned between test runs