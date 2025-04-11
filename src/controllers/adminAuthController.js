// Admin Authentication Controller
const admin = require('../config/firebase-config');
const firebaseAuthService = require('../services/firebaseAuthService');

class AdminAuthController {
  // Admin login verification
  async verifyAdminLogin(req, res) {
    try {
      const { idToken } = req.body;
      
      if (!idToken) {
        return res.status(400).json({ 
          success: false, 
          error: 'ID token is required' 
        });
      }
      
      // Verify the ID token
      const decodedToken = await firebaseAuthService.verifyIdToken(idToken);
      const uid = decodedToken.uid;
      
      // Check if user has admin role in Firestore
      const userDoc = await admin.firestore()
        .collection('users')
        .doc(uid)
        .get();
      
      if (!userDoc.exists) {
        return res.status(403).json({ 
          success: false, 
          error: 'Forbidden: User not found' 
        });
      }
      
      const userData = userDoc.data();
      
      if (userData.role !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          error: 'Forbidden: Admin access required' 
        });
      }
      
      // User is an admin, return success
      res.status(200).json({ 
        success: true, 
        message: 'Admin authentication successful',
        user: {
          uid,
          email: decodedToken.email,
          displayName: decodedToken.name || userData.displayName,
          role: userData.role
        }
      });
    } catch (error) {
      console.error('Admin login verification error:', error);
      res.status(401).json({ 
        success: false, 
        error: error.message || 'Authentication failed' 
      });
    }
  }
  
  // Create admin user
  async createAdminUser(req, res) {
    try {
      const { email, password, displayName } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ 
          success: false, 
          error: 'Email and password are required' 
        });
      }
      
      // Create user in Firebase Auth
      const userRecord = await firebaseAuthService.createUser(
        email, 
        password, 
        displayName || email.split('@')[0]
      );
      
      // Store user data in Firestore with admin role
      const userProfile = {
        email: email,
        displayName: displayName || email.split('@')[0],
        role: 'admin',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      await admin.firestore()
        .collection('users')
        .doc(userRecord.uid)
        .set(userProfile);
      
      // Set custom claims for admin role
      await firebaseAuthService.setCustomUserClaims(userRecord.uid, { role: 'admin' });
      
      res.status(201).json({ 
        success: true, 
        uid: userRecord.uid,
        message: 'Admin user created successfully'
      });
    } catch (error) {
      console.error('Error creating admin user:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Error creating admin user' 
      });
    }
  }
  
  // Get admin dashboard data
  async getAdminDashboardData(req, res) {
    try {
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
      console.error('Error getting admin dashboard data:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Error getting admin dashboard data' 
      });
    }
  }
}

module.exports = new AdminAuthController();
