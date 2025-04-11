// Review Controller
const { Review, Product } = require('../models/schemas');
const admin = require('../config/firebase-config');

class ReviewController {
  // Get all reviews for a product
  async getProductReviews(req, res) {
    try {
      const reviews = await Review.query('productId', '==', req.params.productId);
      res.status(200).json({ success: true, reviews });
    } catch (error) {
      console.error('Error getting product reviews:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get review by ID
  async getReviewById(req, res) {
    try {
      const review = await Review.getById(req.params.id);
      res.status(200).json({ success: true, review });
    } catch (error) {
      console.error('Error getting review by ID:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Create new review
  async createReview(req, res) {
    try {
      // Add user information to review data
      const reviewData = {
        ...req.body,
        userId: req.user.uid,
        userName: req.user.displayName || 'Anonymous',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      // Check if user has purchased the product
      const orders = await admin.firestore()
        .collection('orders')
        .where('userId', '==', req.user.uid)
        .where('status', 'in', ['completed', 'fulfilled'])
        .get();
      
      let isVerifiedPurchase = false;
      
      orders.forEach(doc => {
        const order = doc.data();
        const items = order.items || [];
        
        if (items.some(item => item.productId === reviewData.productId)) {
          isVerifiedPurchase = true;
        }
      });
      
      reviewData.isVerifiedPurchase = isVerifiedPurchase;
      
      // Create the review
      const review = await Review.create(reviewData);
      
      // Update product rating
      const productReviews = await Review.query('productId', '==', reviewData.productId);
      
      const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / productReviews.length;
      
      await Product.update(reviewData.productId, {
        'ratings.average': averageRating,
        'ratings.count': productReviews.length
      });
      
      res.status(201).json({ success: true, review });
    } catch (error) {
      console.error('Error creating review:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Update review
  async updateReview(req, res) {
    try {
      const review = await Review.getById(req.params.id);
      
      // Verify the review belongs to the user
      if (review.userId !== req.user.uid && req.user.role !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          error: 'Forbidden: Review does not belong to user' 
        });
      }
      
      // Update the review
      const updatedReview = await Review.update(req.params.id, {
        ...req.body,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      // If rating was updated, update product rating
      if (req.body.rating && req.body.rating !== review.rating) {
        const productReviews = await Review.query('productId', '==', review.productId);
        
        const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / productReviews.length;
        
        await Product.update(review.productId, {
          'ratings.average': averageRating
        });
      }
      
      res.status(200).json({ success: true, review: updatedReview });
    } catch (error) {
      console.error('Error updating review:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Delete review
  async deleteReview(req, res) {
    try {
      const review = await Review.getById(req.params.id);
      
      // Verify the review belongs to the user or user is admin
      if (review.userId !== req.user.uid && req.user.role !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          error: 'Forbidden: Review does not belong to user' 
        });
      }
      
      // Delete the review
      const result = await Review.delete(req.params.id);
      
      // Update product rating
      const productReviews = await Review.query('productId', '==', review.productId);
      
      if (productReviews.length > 0) {
        const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / productReviews.length;
        
        await Product.update(review.productId, {
          'ratings.average': averageRating,
          'ratings.count': productReviews.length
        });
      } else {
        // No reviews left
        await Product.update(review.productId, {
          'ratings.average': 0,
          'ratings.count': 0
        });
      }
      
      res.status(200).json({ success: true, result });
    } catch (error) {
      console.error('Error deleting review:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Vote review as helpful
  async voteReviewHelpful(req, res) {
    try {
      const review = await Review.getById(req.params.id);
      
      // Increment helpful votes
      const updatedReview = await Review.update(req.params.id, {
        helpfulVotes: (review.helpfulVotes || 0) + 1
      });
      
      res.status(200).json({ success: true, review: updatedReview });
    } catch (error) {
      console.error('Error voting review as helpful:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new ReviewController();
