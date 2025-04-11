// Product Routes
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyFirebaseToken, verifyAdmin } = require('../middleware/authMiddleware');

// Public routes
// Get all products
router.get('/', productController.getAllProducts);

// Get product by ID
router.get('/:id', productController.getProductById);

// Get products by category
router.get('/category/:category', productController.getProductsByCategory);

// Search products
router.get('/search/:query', productController.searchProducts);

// Get featured products
router.get('/featured', productController.getFeaturedProducts);

// Get all categories
router.get('/categories/all', productController.getAllCategories);

// Admin routes (require admin role)
// Create new product
router.post('/', verifyAdmin, productController.createProduct);

// Update product
router.put('/:id', verifyAdmin, productController.updateProduct);

// Delete product
router.delete('/:id', verifyAdmin, productController.deleteProduct);

// Create new category
router.post('/categories', verifyAdmin, productController.createCategory);

// Update category
router.put('/categories/:id', verifyAdmin, productController.updateCategory);

// Delete category
router.delete('/categories/:id', verifyAdmin, productController.deleteCategory);

module.exports = router;
