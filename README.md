# CANTEEN42 E-commerce Platform

A full-featured e-commerce platform for outdoor and camping gear, built with Node.js, Express, Firebase, and modern frontend technologies.

## Overview

CANTEEN42 is a comprehensive e-commerce solution that includes:

- User authentication and account management
- Product catalog with categories and search
- Shopping cart and checkout functionality
- Payment processing (Stripe, PayPal, Square)
- Order management and tracking
- Admin dashboard for store management
- Dropshipping supplier integration
- Live chat support via Tawk.to

## Project Structure

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
├── docs/                   # Documentation
│   ├── api/                # API documentation
│   ├── setup/              # Setup guides
│   └── images/             # Documentation images
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore file
├── package.json            # Project dependencies
└── README.md               # Project overview
```

## Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables: Copy `.env.example` to `.env` and update values
4. Start the development server: `npm run dev`

## Documentation

For detailed documentation, please refer to the following:

- [Setup Guide](./docs/setup/setup-guide.md) - Step-by-step setup instructions
- [API Documentation](./docs/api/api-documentation.md) - Detailed API reference
- [Main Documentation](./docs/README.md) - Comprehensive project documentation

## Features

### User Features

- User registration and authentication
- Product browsing and searching
- Shopping cart management
- Secure checkout process
- Order history and tracking
- User profile management
- Wishlist functionality
- Live chat support

### Admin Features

- Comprehensive admin dashboard
- Product management
- Order processing
- Inventory management
- User management
- Sales analytics
- Coupon management
- Supplier integration

## Technologies

- **Backend**: Node.js, Express.js
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **Payment Processing**: Stripe, PayPal, Square
- **Live Chat**: Tawk.to
- **Frontend Components**: React (for admin dashboard)

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## Support

For support, please contact the development team or refer to the documentation.
