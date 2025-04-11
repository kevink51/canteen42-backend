// Admin Dashboard Controller
const admin = require('../config/firebase-config');
const { Product, Order, User, Category, Review, Coupon, Supplier } = require('../models/schemas');

class AdminDashboardController {
  // Get dashboard overview data
  async getDashboardOverview(req, res) {
    try {
      // Get counts from Firestore
      const productsSnapshot = await admin.firestore().collection('products').get();
      const ordersSnapshot = await admin.firestore().collection('orders').get();
      const usersSnapshot = await admin.firestore().collection('users').get();
      const categoriesSnapshot = await admin.firestore().collection('categories').get();
      
      // Calculate revenue
      let totalRevenue = 0;
      let monthlyRevenue = 0;
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      ordersSnapshot.forEach(doc => {
        const order = doc.data();
        if (order.status === 'completed' || order.status === 'fulfilled') {
          totalRevenue += order.total || 0;
          
          // Check if order was placed this month
          if (order.createdAt && order.createdAt.toDate() >= firstDayOfMonth) {
            monthlyRevenue += order.total || 0;
          }
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
      
      // Get recent users
      const recentUsersSnapshot = await admin.firestore()
        .collection('users')
        .orderBy('createdAt', 'desc')
        .limit(5)
        .get();
      
      const recentUsers = [];
      recentUsersSnapshot.forEach(doc => {
        const userData = doc.data();
        // Remove sensitive information
        delete userData.password;
        
        recentUsers.push({
          id: doc.id,
          ...userData
        });
      });
      
      res.status(200).json({
        success: true,
        dashboard: {
          counts: {
            products: productsSnapshot.size,
            orders: ordersSnapshot.size,
            users: usersSnapshot.size,
            categories: categoriesSnapshot.size
          },
          revenue: {
            total: totalRevenue,
            monthly: monthlyRevenue
          },
          recentOrders,
          topProducts,
          recentUsers
        }
      });
    } catch (error) {
      console.error('Error getting dashboard overview:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
  
  // Get sales analytics
  async getSalesAnalytics(req, res) {
    try {
      const { period } = req.query;
      const now = new Date();
      let startDate;
      
      // Determine start date based on period
      switch (period) {
        case 'week':
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 30); // Default to 30 days
      }
      
      // Get orders within the period
      const ordersSnapshot = await admin.firestore()
        .collection('orders')
        .where('createdAt', '>=', startDate)
        .orderBy('createdAt', 'asc')
        .get();
      
      // Prepare data for analytics
      const salesByDay = {};
      const salesByCategory = {};
      const salesByPaymentMethod = {};
      
      ordersSnapshot.forEach(doc => {
        const order = doc.data();
        if (order.status === 'completed' || order.status === 'fulfilled') {
          // Format date as YYYY-MM-DD
          const orderDate = order.createdAt.toDate();
          const dateKey = orderDate.toISOString().split('T')[0];
          
          // Sales by day
          if (!salesByDay[dateKey]) {
            salesByDay[dateKey] = {
              count: 0,
              revenue: 0
            };
          }
          salesByDay[dateKey].count += 1;
          salesByDay[dateKey].revenue += order.total || 0;
          
          // Sales by payment method
          const paymentMethod = order.paymentMethod || 'unknown';
          if (!salesByPaymentMethod[paymentMethod]) {
            salesByPaymentMethod[paymentMethod] = {
              count: 0,
              revenue: 0
            };
          }
          salesByPaymentMethod[paymentMethod].count += 1;
          salesByPaymentMethod[paymentMethod].revenue += order.total || 0;
          
          // Sales by category (requires additional processing of order items)
          if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
              if (item.category) {
                if (!salesByCategory[item.category]) {
                  salesByCategory[item.category] = {
                    count: 0,
                    revenue: 0
                  };
                }
                salesByCategory[item.category].count += item.quantity || 1;
                salesByCategory[item.category].revenue += (item.price * (item.quantity || 1)) || 0;
              }
            });
          }
        }
      });
      
      res.status(200).json({
        success: true,
        analytics: {
          period,
          salesByDay,
          salesByCategory,
          salesByPaymentMethod
        }
      });
    } catch (error) {
      console.error('Error getting sales analytics:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
  
  // Get inventory status
  async getInventoryStatus(req, res) {
    try {
      const productsSnapshot = await admin.firestore()
        .collection('products')
        .get();
      
      const inventory = {
        total: productsSnapshot.size,
        lowStock: 0,
        outOfStock: 0,
        products: []
      };
      
      productsSnapshot.forEach(doc => {
        const product = doc.data();
        const stockLevel = product.inventory || 0;
        
        // Add to appropriate category
        if (stockLevel === 0) {
          inventory.outOfStock += 1;
        } else if (stockLevel < 10) { // Assuming 10 is low stock threshold
          inventory.lowStock += 1;
        }
        
        // Add product to list
        inventory.products.push({
          id: doc.id,
          name: product.name,
          sku: product.sku,
          inventory: stockLevel,
          status: stockLevel === 0 ? 'out_of_stock' : stockLevel < 10 ? 'low_stock' : 'in_stock'
        });
      });
      
      res.status(200).json({
        success: true,
        inventory
      });
    } catch (error) {
      console.error('Error getting inventory status:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
  
  // Get user analytics
  async getUserAnalytics(req, res) {
    try {
      const usersSnapshot = await admin.firestore()
        .collection('users')
        .get();
      
      const now = new Date();
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(now.getDate() - 30);
      
      const userAnalytics = {
        total: usersSnapshot.size,
        newThisMonth: 0,
        roles: {
          admin: 0,
          customer: 0,
          manager: 0
        }
      };
      
      usersSnapshot.forEach(doc => {
        const user = doc.data();
        
        // Count by role
        const role = user.role || 'customer';
        if (userAnalytics.roles[role] !== undefined) {
          userAnalytics.roles[role] += 1;
        } else {
          userAnalytics.roles[role] = 1;
        }
        
        // Count new users this month
        if (user.createdAt && user.createdAt.toDate() >= thirtyDaysAgo) {
          userAnalytics.newThisMonth += 1;
        }
      });
      
      res.status(200).json({
        success: true,
        userAnalytics
      });
    } catch (error) {
      console.error('Error getting user analytics:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new AdminDashboardController();
