const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const orderService = require('../services/orderService');

// Admin middleware
const adminAuth = authService.createAdminMiddleware();

// Get all orders
router.get('/', adminAuth, async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Error in admin orders route:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get order by ID
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Error in admin order route:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update order
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const order = await orderService.updateOrder(req.params.id, req.body);
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update order status
router.patch('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, error: 'Status is required' });
    }
    
    const result = await orderService.updateOrderStatus(req.params.id, status);
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Process order fulfillment
router.post('/:id/fulfill', adminAuth, async (req, res) => {
  try {
    const result = await orderService.processOrderFulfillment(req.params.id, req.body);
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('Error processing order fulfillment:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
