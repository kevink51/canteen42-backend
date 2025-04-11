// Admin Routes
const express = require('express');
const router = express.Router();
const adminAuthController = require('../controllers/adminAuthController');
const { verifyAdmin } = require('../middleware/authMiddleware');

// Admin login verification
router.post('/login/verify', adminAuthController.verifyAdminLogin);

// Protected admin routes (require admin role)
// Create admin user (super admin only)
router.post('/create', verifyAdmin, adminAuthController.createAdminUser);

// Get admin dashboard data
router.get('/dashboard', verifyAdmin, adminAuthController.getAdminDashboardData);

module.exports = router;
