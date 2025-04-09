const admin = require('../config/firebase-config');

class OrderService {
  // Get all orders
  async getAllOrders() {
    try {
      const ordersSnapshot = await admin.firestore().collection('orders').get();
      
      const orders = [];
      ordersSnapshot.forEach(doc => {
        orders.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return orders;
    } catch (error) {
      console.error('Error getting orders:', error);
      throw error;
    }
  }
  
  // Get order by ID
  async getOrderById(orderId) {
    try {
      const orderDoc = await admin.firestore().collection('orders').doc(orderId).get();
      
      if (!orderDoc.exists) {
        throw new Error('Order not found');
      }
      
      return {
        id: orderDoc.id,
        ...orderDoc.data()
      };
    } catch (error) {
      console.error('Error getting order:', error);
      throw error;
    }
  }
  
  // Create new order
  async createOrder(orderData) {
    try {
      // Add created timestamp
      const order = {
        ...orderData,
        status: 'pending',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      const docRef = await admin.firestore().collection('orders').add(order);
      
      return {
        id: docRef.id,
        ...order
      };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }
  
  // Update order
  async updateOrder(orderId, orderData) {
    try {
      // Add updated timestamp
      const updates = {
        ...orderData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      await admin.firestore().collection('orders').doc(orderId).update(updates);
      
      return {
        id: orderId,
        ...updates
      };
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }
  
  // Get orders by user
  async getOrdersByUser(userId) {
    try {
      const ordersSnapshot = await admin.firestore()
        .collection('orders')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();
      
      const orders = [];
      ordersSnapshot.forEach(doc => {
        orders.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return orders;
    } catch (error) {
      console.error('Error getting orders by user:', error);
      throw error;
    }
  }
  
  // Update order status
  async updateOrderStatus(orderId, status) {
    try {
      await admin.firestore().collection('orders').doc(orderId).update({
        status,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      return {
        id: orderId,
        status
      };
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
  
  // Process order fulfillment
  async processOrderFulfillment(orderId, fulfillmentData) {
    try {
      const orderDoc = await admin.firestore().collection('orders').doc(orderId).get();
      
      if (!orderDoc.exists) {
        throw new Error('Order not found');
      }
      
      const order = orderDoc.data();
      
      // Update order with fulfillment information
      await admin.firestore().collection('orders').doc(orderId).update({
        status: 'fulfilled',
        fulfillment: {
          ...fulfillmentData,
          processedAt: admin.firestore.FieldValue.serverTimestamp()
        },
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      return {
        id: orderId,
        status: 'fulfilled',
        fulfillment: fulfillmentData
      };
    } catch (error) {
      console.error('Error processing order fulfillment:', error);
      throw error;
    }
  }
}

module.exports = new OrderService();
