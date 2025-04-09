const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const orderService = require('../services/orderService');

// Auth middleware
const auth = authService.createAuthMiddleware();

// Get orders for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const orders = await orderService.getOrdersByUser(req.user.uid);
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Error in user orders route:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get order by ID for authenticated user
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    
    // Verify the order belongs to the authenticated user
    if (order.userId !== req.user.uid) {
      return res.status(403).json({ success: false, error: 'Forbidden: Order does not belong to user' });
    }
    
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Error in user order route:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new order for authenticated user
router.post('/', auth, async (req, res) => {
  try {
    // Add user ID to order data
    const orderData = {
      ...req.body,
      userId: req.user.uid
    };
    
    const order = await orderService.createOrder(orderData);
    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
