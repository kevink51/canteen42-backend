const express = require('express');
const cors = require('cors');
const path = require('path');
const authService = require('./authService');
const admin = require('./firebase-config');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Admin authentication middleware
const adminAuth = authService.createAdminMiddleware();

// Public routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Canteen42 Admin API is running' });
});

// Admin login route
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // This would typically use Firebase Auth REST API for admin login
    // For now, we'll simulate the response structure
    
    // In a real implementation, we would verify credentials against Firebase Auth
    // and check if the user has admin role in Firestore
    
    res.status(200).json({
      message: 'Login endpoint reached successfully',
      info: 'This endpoint would verify admin credentials and return a token'
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Protected admin routes
app.get('/api/admin/dashboard', adminAuth, async (req, res) => {
  try {
    // In a real implementation, we would fetch dashboard data from Firestore
    res.status(200).json({
      message: 'Admin dashboard data retrieved successfully',
      user: req.user,
      dashboardData: {
        orders: 0,
        products: 0,
        users: 0,
        revenue: 0
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin products management
app.get('/api/admin/products', adminAuth, async (req, res) => {
  try {
    // In a real implementation, we would fetch products from Firestore
    res.status(200).json({
      message: 'Products retrieved successfully',
      products: []
    });
  } catch (error) {
    console.error('Products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin orders management
app.get('/api/admin/orders', adminAuth, async (req, res) => {
  try {
    // In a real implementation, we would fetch orders from Firestore
    res.status(200).json({
      message: 'Orders retrieved successfully',
      orders: []
    });
  } catch (error) {
    console.error('Orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Canteen42 Admin API is running' });
});

// Serve the admin dashboard for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Canteen42 Admin API running on port ${PORT}`);
});

module.exports = app;
