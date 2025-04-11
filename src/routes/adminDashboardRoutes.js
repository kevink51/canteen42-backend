// Admin Dashboard Routes
const express = require('express');
const router = express.Router();
const adminDashboardController = require('../controllers/adminDashboardController');
const { verifyAdmin } = require('../middleware/authMiddleware');

// All routes require admin role
// Get dashboard overview
router.get('/overview', verifyAdmin, adminDashboardController.getDashboardOverview);

// Get sales analytics
router.get('/analytics/sales', verifyAdmin, adminDashboardController.getSalesAnalytics);

// Get inventory status
router.get('/inventory', verifyAdmin, adminDashboardController.getInventoryStatus);

// Get user analytics
router.get('/analytics/users', verifyAdmin, adminDashboardController.getUserAnalytics);

module.exports = router;
