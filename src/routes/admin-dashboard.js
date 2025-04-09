const express = require('express');
const router = express.Router();
const authService = require('../services/authService');

// Admin middleware
const adminAuth = authService.createAdminMiddleware();

// Get admin dashboard data
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const admin = require('../config/firebase-config');
    
    // Get counts from Firestore
    const productsSnapshot = await admin.firestore().collection('products').get();
    const ordersSnapshot = await admin.firestore().collection('orders').get();
    const usersSnapshot = await admin.firestore().collection('users').get();
    
    // Calculate revenue
    let revenue = 0;
    ordersSnapshot.forEach(doc => {
      const order = doc.data();
      if (order.status === 'completed' || order.status === 'fulfilled') {
        revenue += order.total || 0;
      }
    });
    
    // Get recent orders
    const recentOrdersSnapshot = await admin.firestore()
      .collection('orders')
      .orderBy('createdAt', 'desc')
      .limit(5)
      .get();
    
    const recentOrders = [];
    recentOrdersSnapshot.forEach(doc => {
      recentOrders.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Get top products
    const topProductsSnapshot = await admin.firestore()
      .collection('products')
      .orderBy('sales', 'desc')
      .limit(5)
      .get();
    
    const topProducts = [];
    topProductsSnapshot.forEach(doc => {
      topProducts.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.status(200).json({
      success: true,
      dashboardData: {
        counts: {
          products: productsSnapshot.size,
          orders: ordersSnapshot.size,
          users: usersSnapshot.size,
          revenue: revenue
        },
        recentOrders,
        topProducts
      }
    });
  } catch (error) {
    console.error('Error in admin dashboard route:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get admin users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const admin = require('../config/firebase-config');
    
    const usersSnapshot = await admin.firestore()
      .collection('users')
      .where('role', '==', 'admin')
      .get();
    
    const users = [];
    usersSnapshot.forEach(doc => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error('Error in admin users route:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add admin role to user
router.post('/users/:id/make-admin', adminAuth, async (req, res) => {
  try {
    const admin = require('../config/firebase-config');
    const userId = req.params.id;
    
    await admin.firestore().collection('users').doc(userId).update({
      role: 'admin',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.status(200).json({ success: true, message: 'User is now an admin' });
  } catch (error) {
    console.error('Error making user admin:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Remove admin role from user
router.post('/users/:id/remove-admin', adminAuth, async (req, res) => {
  try {
    const admin = require('../config/firebase-config');
    const userId = req.params.id;
    
    await admin.firestore().collection('users').doc(userId).update({
      role: 'customer',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.status(200).json({ success: true, message: 'Admin role removed from user' });
  } catch (error) {
    console.error('Error removing admin role:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
