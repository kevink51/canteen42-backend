# Canteen42 E-commerce Platform

A comprehensive e-commerce platform for outdoor and camping gear with admin dashboard, payment processing, and live chat support.

## Features

- **User Authentication**: Secure login and registration using Firebase Authentication
- **Product Management**: Add, edit, and delete products with categories and search functionality
- **Order Processing**: Complete order management system with fulfillment tracking
- **Payment Integration**: Support for multiple payment processors (Stripe, PayPal, Square)
- **Admin Dashboard**: Comprehensive admin interface for managing products, orders, and users
- **Live Chat Support**: Integrated Tawk.to for customer support
- **Responsive Design**: Mobile-friendly interface for customers

## Tech Stack

- **Backend**: Node.js with Express
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **Payment Processing**: Stripe, PayPal, Square
- **Live Chat**: Tawk.to
- **Hosting**: Firebase Hosting

## Project Structure

```
canteen42-backend/
├── public/                  # Static files for frontend
├── src/
│   ├── config/              # Configuration files
│   ├── controllers/         # Request handlers
│   ├── middleware/          # Custom middleware
│   ├── models/              # Data models
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   └── utils/               # Utility functions
├── .env                     # Environment variables (not in repo)
├── .gitignore               # Git ignore file
├── package.json             # Project dependencies
└── README.md                # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase project

### Installation

1. Clone the repository
   ```
   git clone https://github.com/your-username/canteen42.git
   cd canteen42-backend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   NODE_ENV=development
   
   # Firebase
   FIREBASE_PROJECT_ID=canteen42-e1058
   
   # Stripe
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   
   # PayPal
   PAYPAL_CLIENT_ID=your_paypal_client_id
   PAYPAL_CLIENT_SECRET=your_paypal_client_secret
   
   # Square
   SQUARE_ACCESS_TOKEN=your_square_access_token
   SQUARE_LOCATION_ID=your_square_location_id
   
   # Tawk.to
   TAWK_TO_PROPERTY_ID=your_tawkto_property_id
   TAWK_TO_WIDGET_ID=your_tawkto_widget_id
   ```

4. Start the development server
   ```
   npm run dev
   ```

## Deployment

The application can be deployed to Firebase Hosting:

1. Install Firebase CLI
   ```
   npm install -g firebase-tools
   ```

2. Login to Firebase
   ```
   firebase login
   ```

3. Initialize Firebase project
   ```
   firebase init
   ```

4. Deploy to Firebase
   ```
   firebase deploy
   ```

## License

This project is proprietary and confidential.

## Contact

For any inquiries, please contact the project owner.
