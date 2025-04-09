const express = require('express');
const router = express.Router();
const paymentService = require('../services/paymentService');
const authService = require('../services/authService');

// Auth middleware
const auth = authService.createAuthMiddleware();

// Create Stripe checkout session
router.post('/stripe/create-checkout', auth, async (req, res) => {
  try {
    const session = await paymentService.createStripeCheckoutSession(req.body);
    res.status(200).json({ success: true, session });
  } catch (error) {
    console.error('Error creating Stripe checkout:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Process Stripe payment
router.post('/stripe/process', auth, async (req, res) => {
  try {
    const result = await paymentService.processStripePayment(req.body);
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('Error processing Stripe payment:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Stripe webhook
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const stripe = require('../config/stripe-config');
    const signature = req.headers['stripe-signature'];
    
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    await paymentService.handleStripeWebhook(event);
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// Process PayPal payment
router.post('/paypal/process', auth, async (req, res) => {
  try {
    const result = await paymentService.processPayPalPayment(req.body);
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('Error processing PayPal payment:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Process Square payment
router.post('/square/process', auth, async (req, res) => {
  try {
    const result = await paymentService.processSquarePayment(req.body);
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('Error processing Square payment:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
