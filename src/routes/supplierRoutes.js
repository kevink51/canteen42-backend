// Supplier Routes
const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { verifyAdmin } = require('../middleware/authMiddleware');

// All routes require admin role
// Get all suppliers
router.get('/', verifyAdmin, supplierController.getAllSuppliers);

// Get supplier by ID
router.get('/:id', verifyAdmin, supplierController.getSupplierById);

// Create new supplier
router.post('/', verifyAdmin, supplierController.createSupplier);

// Update supplier
router.put('/:id', verifyAdmin, supplierController.updateSupplier);

// Delete supplier
router.delete('/:id', verifyAdmin, supplierController.deleteSupplier);

// Get products from supplier
router.get('/:id/products', verifyAdmin, supplierController.getSupplierProducts);

// Import product from supplier
router.post('/:supplierId/import/:productId', verifyAdmin, supplierController.importProductFromSupplier);

// Check supplier connection
router.get('/:id/check-connection', verifyAdmin, supplierController.checkSupplierConnection);

module.exports = router;
