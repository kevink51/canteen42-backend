const express = require('express');
const router = express.Router();
const productService = require('../services/productService');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error('Error in products route:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error('Error in product route:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const products = await productService.getProductsByCategory(req.params.category);
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error('Error in products by category route:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Search products
router.get('/search/:query', async (req, res) => {
  try {
    const products = await productService.searchProducts(req.params.query);
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error('Error in products search route:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
