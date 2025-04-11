// Order Routes
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyFirebaseToken, verifyAdmin } = require('../middleware/authMiddleware');

// Protected routes (require authentication)
// Get orders for authenticated user
router.get('/user', verifyFirebaseToken, orderController.getOrdersByUser);

// Get order by ID for authenticated user
router.get('/:id', verifyFirebaseToken, orderController.getOrderById);

// Create new order for authenticated user
router.post('/', verifyFirebaseToken, orderController.createOrder);

// Admin routes (require admin role)
// Get all orders
router.get('/', verifyAdmin, orderController.getAllOrders);

// Update order
router.put('/:id', verifyAdmin, orderController.updateOrder);

// Update order status
router.patch('/:id/status', verifyAdmin, orderController.updateOrderStatus);

// Process order fulfillment
router.post('/:id/fulfill', verifyAdmin, orderController.processOrderFulfillment);

module.exports = router;
