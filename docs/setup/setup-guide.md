# Setup Guide

This document provides step-by-step instructions for setting up the CANTEEN42 e-commerce platform.

## Prerequisites

Before you begin, ensure you have the following:

1. Node.js (v14 or higher) and npm (v6 or higher) installed
2. Firebase account with Firestore and Authentication enabled
3. Payment processor accounts (Stripe, PayPal, and/or Square)
4. Tawk.to account for live chat functionality
5. Git installed (for version control)

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/canteen42-backend.git
cd canteen42-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file and add your configuration values:

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

## Firebase Setup

### 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Enable Firestore Database
4. Enable Authentication (Email/Password and any other providers you want)

### 2. Generate Firebase Admin SDK Service Account

1. In the Firebase Console, go to Project Settings
2. Go to the "Service accounts" tab
3. Click "Generate new private key"
4. Save the JSON file securely
5. Extract the values for `FIREBASE_PRIVATE_KEY` and `FIREBASE_CLIENT_EMAIL` from this file

### 3. Configure Firebase Authentication

1. In the Firebase Console, go to Authentication
2. Set up the sign-in methods you want to use (Email/Password, Google, etc.)
3. Add your domain to the authorized domains list

## Payment Processor Setup

### Stripe Setup

1. Create a [Stripe account](https://dashboard.stripe.com/register)
2. Get your API keys from the Stripe Dashboard
3. Set up webhook endpoints for payment events
4. Add the keys to your `.env` file

### PayPal Setup

1. Create a [PayPal Developer account](https://developer.paypal.com/)
2. Create a new app to get your client ID and secret
3. Configure the return and cancel URLs
4. Add the credentials to your `.env` file

### Square Setup

1. Create a [Square Developer account](https://developer.squareup.com/)
2. Create a new application
3. Get your access token and location ID
4. Add the credentials to your `.env` file

## Tawk.to Setup

1. Create a [Tawk.to account](https://www.tawk.to/)
2. Add a new property for your website
3. Get your property ID and widget ID
4. Add these values to your `.env` file

## Database Schema Setup

The application will automatically create the necessary collections in Firestore when it first runs. However, you may want to set up some initial data:

### Create Admin User

1. Start the application
2. Use the registration endpoint to create a user
3. In the Firebase Console, go to Firestore
4. Find the user document in the "users" collection
5. Add a "role" field with the value "admin"

### Add Product Categories

Create documents in the "categories" collection with the following structure:

```json
{
  "name": "Tents",
  "description": "Camping and outdoor tents",
  "image": "https://example.com/tents.jpg",
  "isActive": true,
  "order": 1
}
```

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

## Deployment

### Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase:
   ```bash
   firebase init
   ```
   - Select Hosting, Functions, and Firestore
   - Choose your Firebase project
   - Configure the deployment options

4. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

### Other Hosting Options

The application can also be deployed to other platforms:

- **Heroku**: Use the Heroku CLI to deploy
- **AWS**: Deploy to Elastic Beanstalk or EC2
- **Google Cloud**: Deploy to App Engine or Cloud Run
- **DigitalOcean**: Deploy to App Platform or Droplets

## Troubleshooting

### Common Issues

1. **Firebase Authentication Issues**
   - Check that your Firebase configuration is correct
   - Verify that the authentication providers are enabled
   - Check that your domain is in the authorized domains list

2. **Payment Processing Issues**
   - Verify that your API keys are correct
   - Check that your webhook endpoints are configured properly
   - Test in sandbox/test mode first

3. **Database Issues**
   - Check Firestore rules and indexes
   - Verify that your service account has the necessary permissions
   - Check for schema validation errors

4. **Deployment Issues**
   - Check that all environment variables are set
   - Verify that the build process completes successfully
   - Check the deployment logs for errors

## Next Steps

After setting up the basic application, you may want to:

1. Customize the frontend design
2. Add more payment processors
3. Integrate with additional dropshipping suppliers
4. Set up email notifications
5. Configure analytics tracking
6. Implement additional security measures

For more information, refer to the main documentation and API reference.
