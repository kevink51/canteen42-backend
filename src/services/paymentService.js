// Payment Processing Service
const stripe = require('../config/stripe-config');
const paypal = require('../config/paypal-config');
const square = require('../config/square-config');
const admin = require('../config/firebase-config');
const { Order } = require('../models/schemas');

class PaymentService {
  // Process Stripe payment
  async processStripePayment(paymentData) {
    try {
      const { amount, currency, paymentMethodId, description, metadata } = paymentData;
      
      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency || 'usd',
        payment_method: paymentMethodId,
        description,
        metadata,
        confirm: true,
        return_url: process.env.STRIPE_RETURN_URL
      });
      
      return {
        success: true,
        paymentId: paymentIntent.id,
        status: paymentIntent.status
      };
    } catch (error) {
      console.error('Stripe payment error:', error);
      throw error;
    }
  }
  
  // Process PayPal payment
  async processPayPalPayment(paymentData) {
    try {
      const { amount, currency, returnUrl, cancelUrl, description, metadata } = paymentData;
      
      // This would typically use the PayPal SDK to create a payment
      // For now, we'll return a placeholder response
      
      return {
        success: true,
        paymentId: 'PAYPAL-' + Date.now(),
        status: 'created',
        approvalUrl: returnUrl
      };
    } catch (error) {
      console.error('PayPal payment error:', error);
      throw error;
    }
  }
  
  // Process Square payment
  async processSquarePayment(paymentData) {
    try {
      const { amount, currency, sourceId, description, metadata } = paymentData;
      
      // This would typically use the Square SDK to create a payment
      // For now, we'll return a placeholder response
      
      return {
        success: true,
        paymentId: 'SQUARE-' + Date.now(),
        status: 'completed'
      };
    } catch (error) {
      console.error('Square payment error:', error);
      throw error;
    }
  }
  
  // Create order after successful payment
  async createOrderAfterPayment(orderData, paymentResult) {
    try {
      // Add payment information to order data
      const completeOrderData = {
        ...orderData,
        paymentId: paymentResult.paymentId,
        paymentStatus: paymentResult.status,
        status: 'processing',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      // Create order in database
      const order = await Order.create(completeOrderData);
      
      return order;
    } catch (error) {
      console.error('Error creating order after payment:', error);
      throw error;
    }
  }
  
  // Verify payment status
  async verifyPaymentStatus(paymentId, paymentMethod) {
    try {
      let status;
      
      switch (paymentMethod) {
        case 'stripe':
          const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
          status = paymentIntent.status;
          break;
        case 'paypal':
          // This would typically use the PayPal SDK to verify payment
          status = 'completed'; // Placeholder
          break;
        case 'square':
          // This would typically use the Square SDK to verify payment
          status = 'completed'; // Placeholder
          break;
        default:
          throw new Error('Invalid payment method');
      }
      
      return {
        success: true,
        status
      };
    } catch (error) {
      console.error('Error verifying payment status:', error);
      throw error;
    }
  }
  
  // Process refund
  async processRefund(refundData) {
    try {
      const { paymentId, amount, reason, paymentMethod } = refundData;
      
      let refundResult;
      
      switch (paymentMethod) {
        case 'stripe':
          refundResult = await stripe.refunds.create({
            payment_intent: paymentId,
            amount: Math.round(amount * 100), // Convert to cents
            reason
          });
          break;
        case 'paypal':
          // This would typically use the PayPal SDK to process refund
          refundResult = { id: 'PAYPAL-REFUND-' + Date.now(), status: 'completed' }; // Placeholder
          break;
        case 'square':
          // This would typically use the Square SDK to process refund
          refundResult = { id: 'SQUARE-REFUND-' + Date.now(), status: 'completed' }; // Placeholder
          break;
        default:
          throw new Error('Invalid payment method');
      }
      
      return {
        success: true,
        refundId: refundResult.id,
        status: refundResult.status
      };
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }
  
  // Get payment methods for a customer
  async getCustomerPaymentMethods(customerId) {
    try {
      // This would typically retrieve saved payment methods from the payment provider
      // For now, we'll return a placeholder response
      
      return {
        success: true,
        paymentMethods: []
      };
    } catch (error) {
      console.error('Error getting customer payment methods:', error);
      throw error;
    }
  }
}

module.exports = new PaymentService();
