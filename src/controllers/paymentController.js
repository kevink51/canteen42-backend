// Payment Controller
const paymentService = require('../services/paymentService');
const { Order } = require('../models/schemas');

class PaymentController {
  // Process Stripe payment
  async processStripePayment(req, res) {
    try {
      const { amount, currency, paymentMethodId, description, metadata, orderData } = req.body;
      
      // Add user ID to order data
      orderData.userId = req.user.uid;
      
      // Process payment
      const paymentResult = await paymentService.processStripePayment({
        amount,
        currency,
        paymentMethodId,
        description,
        metadata
      });
      
      // Create order after successful payment
      if (paymentResult.success) {
        const order = await paymentService.createOrderAfterPayment(orderData, {
          ...paymentResult,
          paymentMethod: 'stripe'
        });
        
        res.status(200).json({
          success: true,
          payment: paymentResult,
          order
        });
      } else {
        res.status(400).json({
          success: false,
          error: 'Payment processing failed'
        });
      }
    } catch (error) {
      console.error('Error processing Stripe payment:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Error processing payment'
      });
    }
  }
  
  // Process PayPal payment
  async processPayPalPayment(req, res) {
    try {
      const { amount, currency, returnUrl, cancelUrl, description, metadata, orderData } = req.body;
      
      // Add user ID to order data
      orderData.userId = req.user.uid;
      
      // Process payment
      const paymentResult = await paymentService.processPayPalPayment({
        amount,
        currency,
        returnUrl,
        cancelUrl,
        description,
        metadata
      });
      
      // For PayPal, we typically create the order after payment approval
      // But we'll store the order data temporarily
      
      res.status(200).json({
        success: true,
        payment: paymentResult,
        orderData
      });
    } catch (error) {
      console.error('Error processing PayPal payment:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Error processing payment'
      });
    }
  }
  
  // Complete PayPal payment after approval
  async completePayPalPayment(req, res) {
    try {
      const { paymentId, orderData } = req.body;
      
      // Verify payment status
      const paymentResult = await paymentService.verifyPaymentStatus(paymentId, 'paypal');
      
      // Create order after successful payment
      if (paymentResult.status === 'completed') {
        const order = await paymentService.createOrderAfterPayment(orderData, {
          paymentId,
          status: paymentResult.status,
          paymentMethod: 'paypal'
        });
        
        res.status(200).json({
          success: true,
          payment: paymentResult,
          order
        });
      } else {
        res.status(400).json({
          success: false,
          error: 'Payment not completed'
        });
      }
    } catch (error) {
      console.error('Error completing PayPal payment:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Error completing payment'
      });
    }
  }
  
  // Process Square payment
  async processSquarePayment(req, res) {
    try {
      const { amount, currency, sourceId, description, metadata, orderData } = req.body;
      
      // Add user ID to order data
      orderData.userId = req.user.uid;
      
      // Process payment
      const paymentResult = await paymentService.processSquarePayment({
        amount,
        currency,
        sourceId,
        description,
        metadata
      });
      
      // Create order after successful payment
      if (paymentResult.success) {
        const order = await paymentService.createOrderAfterPayment(orderData, {
          ...paymentResult,
          paymentMethod: 'square'
        });
        
        res.status(200).json({
          success: true,
          payment: paymentResult,
          order
        });
      } else {
        res.status(400).json({
          success: false,
          error: 'Payment processing failed'
        });
      }
    } catch (error) {
      console.error('Error processing Square payment:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Error processing payment'
      });
    }
  }
  
  // Process refund
  async processRefund(req, res) {
    try {
      const { orderId, amount, reason } = req.body;
      
      // Get order details
      const order = await Order.getById(orderId);
      
      // Process refund
      const refundResult = await paymentService.processRefund({
        paymentId: order.paymentId,
        amount: amount || order.total,
        reason,
        paymentMethod: order.paymentMethod
      });
      
      // Update order status
      await Order.update(orderId, {
        status: 'refunded',
        refund: refundResult
      });
      
      res.status(200).json({
        success: true,
        refund: refundResult
      });
    } catch (error) {
      console.error('Error processing refund:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Error processing refund'
      });
    }
  }
  
  // Get payment methods for a customer
  async getCustomerPaymentMethods(req, res) {
    try {
      const customerId = req.user.uid;
      
      const result = await paymentService.getCustomerPaymentMethods(customerId);
      
      res.status(200).json({
        success: true,
        paymentMethods: result.paymentMethods
      });
    } catch (error) {
      console.error('Error getting customer payment methods:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Error getting payment methods'
      });
    }
  }
}

module.exports = new PaymentController();
