// Supplier Controller
const { Supplier } = require('../models/schemas');
const admin = require('../config/firebase-config');

class SupplierController {
  // Get all suppliers (admin only)
  async getAllSuppliers(req, res) {
    try {
      const suppliers = await Supplier.getAll();
      res.status(200).json({ success: true, suppliers });
    } catch (error) {
      console.error('Error getting all suppliers:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get supplier by ID (admin only)
  async getSupplierById(req, res) {
    try {
      const supplier = await Supplier.getById(req.params.id);
      res.status(200).json({ success: true, supplier });
    } catch (error) {
      console.error('Error getting supplier by ID:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Create new supplier (admin only)
  async createSupplier(req, res) {
    try {
      const supplierData = {
        ...req.body,
        isActive: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      const supplier = await Supplier.create(supplierData);
      res.status(201).json({ success: true, supplier });
    } catch (error) {
      console.error('Error creating supplier:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Update supplier (admin only)
  async updateSupplier(req, res) {
    try {
      const supplier = await Supplier.update(req.params.id, req.body);
      res.status(200).json({ success: true, supplier });
    } catch (error) {
      console.error('Error updating supplier:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Delete supplier (admin only)
  async deleteSupplier(req, res) {
    try {
      const result = await Supplier.delete(req.params.id);
      res.status(200).json({ success: true, result });
    } catch (error) {
      console.error('Error deleting supplier:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get products from supplier (admin only)
  async getSupplierProducts(req, res) {
    try {
      const supplier = await Supplier.getById(req.params.id);
      
      // This would typically call the supplier's API to get products
      // For now, we'll return a placeholder response
      
      res.status(200).json({ 
        success: true, 
        message: `Retrieved products from ${supplier.name}`,
        products: []
      });
    } catch (error) {
      console.error('Error getting supplier products:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Import product from supplier (admin only)
  async importProductFromSupplier(req, res) {
    try {
      const { supplierId, productId } = req.params;
      
      const supplier = await Supplier.getById(supplierId);
      
      // This would typically call the supplier's API to import a product
      // For now, we'll return a placeholder response
      
      res.status(200).json({ 
        success: true, 
        message: `Imported product ${productId} from ${supplier.name}`,
        product: {
          id: productId,
          name: 'Imported Product',
          supplierId: supplierId
        }
      });
    } catch (error) {
      console.error('Error importing product from supplier:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Check supplier connection (admin only)
  async checkSupplierConnection(req, res) {
    try {
      const supplier = await Supplier.getById(req.params.id);
      
      // This would typically test the connection to the supplier's API
      // For now, we'll return a placeholder response
      
      res.status(200).json({ 
        success: true, 
        message: `Connection to ${supplier.name} is working`,
        status: 'connected'
      });
    } catch (error) {
      console.error('Error checking supplier connection:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new SupplierController();
