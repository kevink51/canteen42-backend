const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const productService = require('../services/productService');

// Admin middleware
const adminAuth = authService.createAdminMiddleware();

// Get all products
router.get('/', adminAuth, async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error('Error in admin products route:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get product by ID
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error('Error in admin product route:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new product
router.post('/', adminAuth, async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update product
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete product
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const result = await productService.deleteProduct(req.params.id);
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
