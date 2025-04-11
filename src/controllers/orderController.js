// Order Controller
const { Order } = require('../models/schemas');

class OrderController {
  // Get all orders
  async getAllOrders(req, res) {
    try {
      const orders = await Order.getAll();
      res.status(200).json({ success: true, orders });
    } catch (error) {
      console.error('Error getting all orders:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get order by ID
  async getOrderById(req, res) {
    try {
      const order = await Order.getById(req.params.id);
      
      // If user is not admin, verify the order belongs to them
      if (req.user.role !== 'admin' && order.userId !== req.user.uid) {
        return res.status(403).json({ 
          success: false, 
          error: 'Forbidden: Order does not belong to user' 
        });
      }
      
      res.status(200).json({ success: true, order });
    } catch (error) {
      console.error('Error getting order by ID:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Create new order
  async createOrder(req, res) {
    try {
      // Add user ID to order data
      const orderData = {
        ...req.body,
        userId: req.user.uid,
        status: 'pending'
      };
      
      const order = await Order.create(orderData);
      res.status(201).json({ success: true, order });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Update order
  async updateOrder(req, res) {
    try {
      // Only admins can update orders
      if (req.user.role !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          error: 'Forbidden: Admin access required' 
        });
      }
      
      const order = await Order.update(req.params.id, req.body);
      res.status(200).json({ success: true, order });
    } catch (error) {
      console.error('Error updating order:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get orders by user
  async getOrdersByUser(req, res) {
    try {
      // If user is admin and userId is provided, get orders for that user
      const userId = req.user.role === 'admin' && req.query.userId 
        ? req.query.userId 
        : req.user.uid;
      
      const orders = await Order.query('userId', '==', userId);
      res.status(200).json({ success: true, orders });
    } catch (error) {
      console.error('Error getting orders by user:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Update order status
  async updateOrderStatus(req, res) {
    try {
      // Only admins can update order status
      if (req.user.role !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          error: 'Forbidden: Admin access required' 
        });
      }
      
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ 
          success: false, 
          error: 'Status is required' 
        });
      }
      
      const order = await Order.update(req.params.id, { status });
      res.status(200).json({ success: true, order });
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Process order fulfillment
  async processOrderFulfillment(req, res) {
    try {
      // Only admins can process order fulfillment
      if (req.user.role !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          error: 'Forbidden: Admin access required' 
        });
      }
      
      const order = await Order.getById(req.params.id);
      
      // Update order with fulfillment information
      const updatedOrder = await Order.update(req.params.id, {
        status: 'fulfilled',
        fulfillment: {
          ...req.body,
          processedAt: new Date()
        }
      });
      
      res.status(200).json({ success: true, order: updatedOrder });
    } catch (error) {
      console.error('Error processing order fulfillment:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new OrderController();
