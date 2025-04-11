// Auth Routes
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyFirebaseToken, verifyAdmin } = require('../middleware/authMiddleware');

// Public routes
// Register new user
router.post('/register', userController.registerUser);

// Protected routes (require authentication)
// Get user profile
router.get('/profile', verifyFirebaseToken, userController.getUserProfile);

// Update user profile
router.put('/profile', verifyFirebaseToken, userController.updateUserProfile);

// Admin routes (require admin role)
// Get all users
router.get('/users', verifyAdmin, userController.getAllUsers);

// Update user role
router.put('/users/role', verifyAdmin, userController.updateUserRole);

module.exports = router;
