// PayPal configuration
// In production, these values would be loaded from environment variables
const paypal = {
  clientId: process.env.PAYPAL_CLIENT_ID,
  clientSecret: process.env.PAYPAL_CLIENT_SECRET,
  environment: process.env.NODE_ENV === 'production' ? 'live' : 'sandbox'
};

module.exports = paypal;
