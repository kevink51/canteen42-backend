# CANTEEN42 E-commerce Platform Documentation

## Overview

CANTEEN42 is a full-featured e-commerce platform for outdoor and camping gear. The platform consists of a backend API built with Node.js, Express, and Firebase, and supports multiple payment processors, dropshipping suppliers, and live chat integration.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Setup and Installation](#setup-and-installation)
3. [Authentication](#authentication)
4. [E-commerce Schema](#e-commerce-schema)
5. [Admin Dashboard](#admin-dashboard)
6. [Payment Processing](#payment-processing)
7. [Dropshipping Integration](#dropshipping-integration)
8. [Live Chat (Tawk.to)](#live-chat-tawkto)
9. [API Endpoints](#api-endpoints)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)

## Project Structure

The project follows a modular architecture with clear separation of concerns:

```
canteen42-backend/
├── src/
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Express middleware
│   ├── models/             # Data models and schemas
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── utils/              # Utility functions
│   ├── frontend/           # Frontend components
│   └── server.js           # Main application entry point
├── public/                 # Static files
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore file
├── package.json            # Project dependencies
└── README.md               # Project overview
```

## Setup and Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Firebase account with Firestore and Authentication enabled
- Stripe, PayPal, and/or Square accounts for payment processing
- Tawk.to account for live chat

### Installation Steps

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/canteen42-backend.git
   cd canteen42-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration values:
   ```
   # Firebase
   FIREBASE_PROJECT_ID=canteen42-e1058
   FIREBASE_PRIVATE_KEY=your-private-key
   FIREBASE_CLIENT_EMAIL=your-client-email
   
   # Stripe
   STRIPE_SECRET_KEY=your-stripe-secret-key
   STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
   STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
   
   # PayPal
   PAYPAL_CLIENT_ID=your-paypal-client-id
   PAYPAL_CLIENT_SECRET=your-paypal-client-secret
   
   # Square
   SQUARE_ACCESS_TOKEN=your-square-access-token
   SQUARE_LOCATION_ID=your-square-location-id
   
   # Tawk.to
   TAWKTO_PROPERTY_ID=your-tawkto-property-id
   TAWKTO_WIDGET_ID=your-tawkto-widget-id
   
   # Server
   PORT=3000
   NODE_ENV=development
   ```

5. Start the development server:
   ```
   npm run dev
   ```

## Authentication

The platform uses Firebase Authentication for user management and includes role-based access control.

### User Roles

- **Customer**: Regular users who can browse products, place orders, and manage their profiles
- **Admin**: Users with full access to the admin dashboard and all management features
- **Manager**: Users with limited admin access (optional)

### Authentication Flow

1. Users register or log in using email/password or social providers
2. Firebase Authentication issues a JWT token
3. The token is verified by the backend middleware
4. User roles and permissions are checked for protected routes

### Admin Authentication

Admin users have access to the admin dashboard and management features. The admin login process includes:

1. Login with Firebase Authentication
2. Verification of admin role in Firestore
3. Access to admin-only routes and features

## E-commerce Schema

The platform uses Firestore as the database and includes the following data models:

### Products

```javascript
{
  name: String,
  description: String,
  price: Number,
  salePrice: Number,
  category: String,
  subcategory: String,
  images: Array,
  inventory: Number,
  sku: String,
  weight: Number,
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  features: Array,
  specifications: Object,
  variants: Array,
  tags: Array,
  brand: String,
  isActive: Boolean,
  isFeatured: Boolean,
  ratings: {
    average: Number,
    count: Number
  },
  sales: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Orders

```javascript
{
  userId: String,
  items: Array,
  subtotal: Number,
  tax: Number,
  shipping: Number,
  discount: Number,
  total: Number,
  paymentMethod: String,
  paymentId: String,
  status: String,
  shippingAddress: {
    name: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String
  },
  billingAddress: {
    name: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String
  },
  trackingNumber: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Users

```javascript
{
  email: String,
  displayName: String,
  role: String,
  phone: String,
  addresses: Array,
  defaultAddress: Object,
  orders: Array,
  wishlist: Array,
  cart: Array,
  paymentMethods: Array,
  preferences: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### Categories

```javascript
{
  name: String,
  description: String,
  image: String,
  parentCategory: String,
  subcategories: Array,
  isActive: Boolean,
  order: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Reviews

```javascript
{
  productId: String,
  userId: String,
  userName: String,
  rating: Number,
  title: String,
  content: String,
  images: Array,
  isVerifiedPurchase: Boolean,
  helpfulVotes: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Coupons

```javascript
{
  code: String,
  description: String,
  type: String,
  value: Number,
  minPurchase: Number,
  maxDiscount: Number,
  startDate: Date,
  endDate: Date,
  isActive: Boolean,
  usageLimit: Number,
  usageCount: Number,
  applicableProducts: Array,
  applicableCategories: Array,
  createdAt: Date,
  updatedAt: Date
}
```

### Suppliers

```javascript
{
  name: String,
  type: String,
  contactName: String,
  email: String,
  phone: String,
  website: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  products: Array,
  apiKey: String,
  apiEndpoint: String,
  isActive: Boolean,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Admin Dashboard

The admin dashboard provides a comprehensive interface for managing all aspects of the e-commerce platform.

### Dashboard Overview

- Sales statistics and metrics
- Recent orders
- Top-selling products
- User growth

### Product Management

- Add, edit, and delete products
- Manage product categories
- Update inventory
- Import products from suppliers

### Order Management

- View and process orders
- Update order status
- Process refunds
- Generate shipping labels

### User Management

- View and manage user accounts
- Assign user roles
- Reset passwords
- View user order history

### Inventory Management

- Track product inventory
- Set low stock alerts
- Update stock levels
- View inventory reports

### Coupon Management

- Create and manage discount coupons
- Set coupon validity periods
- Track coupon usage
- Apply coupons to specific products or categories

## Payment Processing

The platform supports multiple payment processors:

### Stripe Integration

- Credit card processing
- Subscription management
- Refund processing
- Webhook handling

### PayPal Integration

- Express Checkout
- Standard payments
- Refund processing
- IPN handling

### Square Integration

- In-person payments
- Online payments
- Refund processing
- Webhook handling

## Dropshipping Integration

The platform supports integration with multiple dropshipping suppliers:

### Supplier Management

- Connect to supplier APIs
- Import products from suppliers
- Update product inventory
- Place orders with suppliers

### Supported Suppliers

- Oberlo
- Spocket
- DSers
- CJDropshipping
- Alibaba

## Live Chat (Tawk.to)

The platform integrates with Tawk.to for live customer support:

### Features

- Real-time chat with customers
- Chat transcript storage
- Visitor information tracking
- Offline messaging

### Integration

- Widget embedding
- API integration
- Chat history retrieval
- Agent management

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `GET /api/auth/users` - Get all users (admin only)
- `PUT /api/auth/users/role` - Update user role (admin only)

### Admin

- `POST /api/admin/login/verify` - Verify admin login
- `POST /api/admin/create` - Create admin user
- `GET /api/admin/dashboard` - Get admin dashboard data

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/search/:query` - Search products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/categories/all` - Get all categories

### Orders

- `GET /api/orders/user` - Get orders for authenticated user
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders (admin only)
- `PUT /api/orders/:id` - Update order (admin only)
- `PATCH /api/orders/:id/status` - Update order status (admin only)
- `POST /api/orders/:id/fulfill` - Process order fulfillment (admin only)

### Reviews

- `GET /api/reviews/product/:productId` - Get all reviews for a product
- `GET /api/reviews/:id` - Get review by ID
- `POST /api/reviews` - Create new review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `POST /api/reviews/:id/helpful` - Vote review as helpful

### Coupons

- `GET /api/coupons/active` - Get active coupons
- `POST /api/coupons/validate/:code` - Validate coupon
- `POST /api/coupons/apply/:code` - Apply coupon to order
- `GET /api/coupons` - Get all coupons (admin only)
- `GET /api/coupons/:id` - Get coupon by ID (admin only)
- `POST /api/coupons` - Create new coupon (admin only)
- `PUT /api/coupons/:id` - Update coupon (admin only)
- `DELETE /api/coupons/:id` - Delete coupon (admin only)

### Payments

- `POST /api/payments/stripe` - Process Stripe payment
- `POST /api/payments/paypal` - Process PayPal payment
- `POST /api/payments/paypal/complete` - Complete PayPal payment
- `POST /api/payments/square` - Process Square payment
- `GET /api/payments/methods` - Get customer payment methods
- `POST /api/payments/refund` - Process refund (admin only)

### Dropshipping

- `POST /api/dropshipping/:supplierId/connect` - Connect to supplier API (admin only)
- `GET /api/dropshipping/:supplierId/products` - Get products from supplier (admin only)
- `POST /api/dropshipping/:supplierId/import/:productId` - Import product from supplier (admin only)
- `PUT /api/dropshipping/products/:productId/inventory` - Update product inventory (admin only)
- `POST /api/dropshipping/:supplierId/orders` - Place order with supplier (admin only)
- `GET /api/dropshipping/:supplierId/orders/:orderId` - Get order status from supplier (admin only)
- `PUT /api/dropshipping/:supplierId/settings` - Configure supplier settings (admin only)

### Chat

- `GET /api/chat/config` - Get Tawk.to configuration
- `GET /api/chat/script` - Get Tawk.to widget script
- `POST /api/chat/transcript` - Store chat transcript
- `GET /api/chat/transcripts/user` - Get chat transcripts for authenticated user
- `GET /api/chat/transcripts/all` - Get all chat transcripts (admin only)

## Deployment

### Development Environment

```
npm run dev
```

### Production Environment

```
npm run build
npm start
```

### Firebase Deployment

1. Install Firebase CLI:
   ```
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```
   firebase login
   ```

3. Initialize Firebase:
   ```
   firebase init
   ```

4. Deploy to Firebase:
   ```
   firebase deploy
   ```

## Troubleshooting

### Common Issues

1. **Firebase Authentication Issues**
   - Check Firebase configuration in `.env` file
   - Verify Firebase project settings
   - Check Firebase Authentication rules

2. **Payment Processing Issues**
   - Verify API keys for payment processors
   - Check webhook configurations
   - Test in sandbox/test mode first

3. **Dropshipping Integration Issues**
   - Verify supplier API credentials
   - Check network connectivity to supplier APIs
   - Review supplier documentation for API changes

4. **Database Issues**
   - Check Firestore rules and indexes
   - Verify database connection
   - Check for schema validation errors

### Support

For additional support, please contact the development team or refer to the individual service documentation:

- [Firebase Documentation](https://firebase.google.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [PayPal Documentation](https://developer.paypal.com/docs)
- [Square Documentation](https://developer.squareup.com/docs)
- [Tawk.to Documentation](https://www.tawk.to/knowledgebase)
