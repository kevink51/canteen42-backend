const stripe = require('../config/stripe-config');
const paypal = require('../config/paypal-config');
const square = require('../config/square-config');

class PaymentService {
  // Process payment with Stripe
  async processStripePayment(paymentData) {
    try {
      const { amount, currency, paymentMethodId, description, metadata } = paymentData;
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        payment_method: paymentMethodId,
        description,
        metadata,
        confirm: true
      });
      
      return {
        success: paymentIntent.status === 'succeeded',
        paymentId: paymentIntent.id,
        status: paymentIntent.status
      };
    } catch (error) {
      console.error('Stripe payment error:', error);
      throw error;
    }
  }
  
  // Process payment with PayPal
  async processPayPalPayment(paymentData) {
    try {
      // In a real implementation, this would use the PayPal SDK
      // to create and capture a payment
      console.log('Processing PayPal payment:', paymentData);
      
      return {
        success: true,
        paymentId: 'paypal-' + Date.now(),
        status: 'COMPLETED'
      };
    } catch (error) {
      console.error('PayPal payment error:', error);
      throw error;
    }
  }
  
  // Process payment with Square
  async processSquarePayment(paymentData) {
    try {
      // In a real implementation, this would use the Square SDK
      // to create and capture a payment
      console.log('Processing Square payment:', paymentData);
      
      return {
        success: true,
        paymentId: 'square-' + Date.now(),
        status: 'COMPLETED'
      };
    } catch (error) {
      console.error('Square payment error:', error);
      throw error;
    }
  }
  
  // Create Stripe checkout session
  async createStripeCheckoutSession(orderData) {
    try {
      const { items, successUrl, cancelUrl, metadata } = orderData;
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: items.map(item => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name,
              images: item.images || []
            },
            unit_amount: Math.round(item.price * 100)
          },
          quantity: item.quantity
        })),
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata
      });
      
      return {
        sessionId: session.id,
        url: session.url
      };
    } catch (error) {
      console.error('Stripe checkout error:', error);
      throw error;
    }
  }
  
  // Handle Stripe webhook
  async handleStripeWebhook(event) {
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          // Handle successful payment
          console.log('Payment succeeded:', paymentIntent.id);
          break;
        case 'checkout.session.completed':
          const session = event.data.object;
          // Handle completed checkout
          console.log('Checkout completed:', session.id);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
      
      return true;
    } catch (error) {
      console.error('Stripe webhook error:', error);
      throw error;
    }
  }
}

module.exports = new PaymentService();
