// Payment Routes
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { verifyFirebaseToken, verifyAdmin } = require('../middleware/authMiddleware');

// Protected routes (require authentication)
// Process Stripe payment
router.post('/stripe', verifyFirebaseToken, paymentController.processStripePayment);

// Process PayPal payment
router.post('/paypal', verifyFirebaseToken, paymentController.processPayPalPayment);

// Complete PayPal payment after approval
router.post('/paypal/complete', verifyFirebaseToken, paymentController.completePayPalPayment);

// Process Square payment
router.post('/square', verifyFirebaseToken, paymentController.processSquarePayment);

// Get customer payment methods
router.get('/methods', verifyFirebaseToken, paymentController.getCustomerPaymentMethods);

// Admin routes (require admin role)
// Process refund
router.post('/refund', verifyAdmin, paymentController.processRefund);

module.exports = router;
