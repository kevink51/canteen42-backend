// Coupon Routes
const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { verifyFirebaseToken, verifyAdmin } = require('../middleware/authMiddleware');

// Public routes
// Get active coupons
router.get('/active', couponController.getActiveCoupons);

// Validate coupon
router.post('/validate/:code', couponController.validateCoupon);

// Protected routes (require authentication)
// Apply coupon to order
router.post('/apply/:code', verifyFirebaseToken, couponController.applyCoupon);

// Admin routes (require admin role)
// Get all coupons
router.get('/', verifyAdmin, couponController.getAllCoupons);

// Get coupon by ID
router.get('/:id', verifyAdmin, couponController.getCouponById);

// Create new coupon
router.post('/', verifyAdmin, couponController.createCoupon);

// Update coupon
router.put('/:id', verifyAdmin, couponController.updateCoupon);

// Delete coupon
router.delete('/:id', verifyAdmin, couponController.deleteCoupon);

module.exports = router;
