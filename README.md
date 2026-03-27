# Selux E-Commerce Platform

## Overview

This is a comprehensive e-commerce platform built with Node.js and Express, designed to handle user authentication, product management, order processing, and administrative functions. The application provides a robust backend API for managing sellers, products, orders, and users, with integrated email notifications and tracking services.

## Features

### User Management
- Secure user registration and authentication using JWT tokens
- Password hashing with bcrypt for enhanced security
- Role-based access control for different user types (users, sellers, admins)

### Product Management
- Comprehensive product catalog with detailed information
- Seller-specific product management
- Product search and filtering capabilities

### Order Processing
- Complete order lifecycle management from creation to fulfillment
- Order tracking with real-time status updates
- Integration with tracking services for shipment monitoring

### Administrative Functions
- Admin dashboard for overseeing platform operations
- User and seller account management
- Order and product moderation tools

### Email Integration
- Automated email notifications for order updates
- User communication system using Nodemailer
- Customizable email templates for various events

### API Documentation
- Interactive API documentation powered by Swagger UI
- Comprehensive endpoint descriptions and examples
- Easy-to-use interface for testing API calls

## Technology Stack

- **Backend Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Security**: bcrypt for password hashing
- **Email Service**: Nodemailer
- **Validation**: Express Validator
- **API Documentation**: Swagger
- **Development**: Nodemon for hot reloading

## Installation

1. Clone the repository to your local machine
2. Navigate to the project directory
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory and configure the following environment variables:
   - Database connection string
   - JWT secret key
   - Email service credentials
   - Other necessary configuration settings
5. Start the development server:
   ```
   npm run dev
   ```
6. For production deployment:
   ```
   npm start
   ```

## Usage

Once the server is running, you can access:
- The main API at `http://localhost:3000` (or your configured port)
- Swagger API documentation at `http://localhost:3000/api-docs`

### Key API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

#### Products
- `GET /api/products` - Retrieve all products
- `POST /api/products` - Create a new product (seller/admin only)
- `GET /api/products/:id` - Get product details
- `PUT /api/products/:id` - Update product (seller/admin only)
- `DELETE /api/products/:id` - Delete product (seller/admin only)

#### Orders
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create a new order
- `GET /api/orders/:id` - Get order details
- `PATCH /api/orders/:id` - Update order status (admin/seller only)

#### Admin
- `GET /api/admin/users` - List all users
- `GET /api/admin/orders` - List all orders
- `GET /api/admin/products` - List all products

## Project Structure

```
├── app.js                 # Main application file
├── server.js              # Server startup file
├── config.js              # Application configuration
├── swagger.js             # Swagger documentation setup
├── config/
│   └── database.js        # Database connection configuration
├── controllers/           # Route controllers
│   ├── authController.js
│   ├── adminController.js
│   ├── orderController.js
│   └── productController.js
├── middleware/            # Custom middleware
│   ├── authMiddleware.js
│   ├── validationMiddleware.js
│   └── ...
├── models/                # MongoDB models
│   ├── User.js
│   ├── Seller.js
│   ├── Product.js
│   └── Order.js
├── routes/                # API route definitions
│   ├── authRoutes.js
│   ├── adminRoutes.js
│   ├── orderRoutes.js
│   └── productRoutes.js
└── services/              # Business logic services
    ├── emailService.js
    ├── productService.js
    └── trackingServices.js
```

## Configuration

The application uses environment variables for configuration. Create a `.env` file with the following variables:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/demo
JWT_SECRET=your_jwt_secret_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

> Critical: for create/update/delete operations on `users` (and other RLS-blocked tables) in the backend, use `SUPABASE_SERVICE_ROLE_KEY`.

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.