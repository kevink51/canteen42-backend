// Review Routes
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { verifyFirebaseToken, verifyAdmin } = require('../middleware/authMiddleware');

// Public routes
// Get all reviews for a product
router.get('/product/:productId', reviewController.getProductReviews);

// Get review by ID
router.get('/:id', reviewController.getReviewById);

// Vote review as helpful
router.post('/:id/helpful', reviewController.voteReviewHelpful);

// Protected routes (require authentication)
// Create new review
router.post('/', verifyFirebaseToken, reviewController.createReview);

// Update review
router.put('/:id', verifyFirebaseToken, reviewController.updateReview);

// Delete review
router.delete('/:id', verifyFirebaseToken, reviewController.deleteReview);

module.exports = router;
