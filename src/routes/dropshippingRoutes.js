// Dropshipping Routes
const express = require('express');
const router = express.Router();
const dropshippingController = require('../controllers/dropshippingController');
const { verifyAdmin } = require('../middleware/authMiddleware');

// All routes require admin role
// Connect to supplier API
router.post('/:supplierId/connect', verifyAdmin, dropshippingController.connectToSupplier);

// Get products from supplier
router.get('/:supplierId/products', verifyAdmin, dropshippingController.getProductsFromSupplier);

// Import product from supplier
router.post('/:supplierId/import/:productId', verifyAdmin, dropshippingController.importProductFromSupplier);

// Update product inventory from supplier
router.put('/products/:productId/inventory', verifyAdmin, dropshippingController.updateProductInventory);

// Place order with supplier
router.post('/:supplierId/orders', verifyAdmin, dropshippingController.placeOrderWithSupplier);

// Get order status from supplier
router.get('/:supplierId/orders/:orderId', verifyAdmin, dropshippingController.getOrderStatusFromSupplier);

// Configure supplier settings
router.put('/:supplierId/settings', verifyAdmin, dropshippingController.configureSupplierSettings);

module.exports = router;
