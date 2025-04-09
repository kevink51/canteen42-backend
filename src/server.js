const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import configuration
const appConfig = require('./config/app-config');

// Import routes
const authRoutes = require('./routes/auth');
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');
const paymentsRoutes = require('./routes/payments');
const chatRoutes = require('./routes/chat');
const adminProductsRoutes = require('./routes/admin-products');
const adminOrdersRoutes = require('./routes/admin-orders');
const adminDashboardRoutes = require('./routes/admin-dashboard');

// Initialize express app
const app = express();
const PORT = appConfig.port;

// Middleware
app.use(cors(appConfig.corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/chat', chatRoutes);

// Admin Routes
app.use('/api/admin/products', adminProductsRoutes);
app.use('/api/admin/orders', adminOrdersRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Canteen42 API is running',
    environment: appConfig.nodeEnv,
    version: process.env.APP_VERSION || '1.0.0'
  });
});

// Serve the admin dashboard for admin routes
app.get('/admin*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin.html'));
});

// Serve the frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Canteen42 API running on port ${PORT} in ${appConfig.nodeEnv} mode`);
});

module.exports = app;
