// Dropshipping Controller
const dropshippingService = require('../services/dropshippingService');

class DropshippingController {
  // Connect to supplier API
  async connectToSupplier(req, res) {
    try {
      const { supplierId } = req.params;
      
      const result = await dropshippingService.connectToSupplier(supplierId);
      
      res.status(200).json({
        success: true,
        connection: result
      });
    } catch (error) {
      console.error('Error connecting to supplier:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Error connecting to supplier'
      });
    }
  }
  
  // Get products from supplier
  async getProductsFromSupplier(req, res) {
    try {
      const { supplierId } = req.params;
      const options = req.query;
      
      const result = await dropshippingService.getProductsFromSupplier(supplierId, options);
      
      res.status(200).json({
        success: true,
        products: result.products,
        supplier: result.supplier
      });
    } catch (error) {
      console.error('Error getting products from supplier:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Error getting products from supplier'
      });
    }
  }
  
  // Import product from supplier
  async importProductFromSupplier(req, res) {
    try {
      const { supplierId, productId } = req.params;
      
      const result = await dropshippingService.importProductFromSupplier(supplierId, productId);
      
      res.status(200).json({
        success: true,
        product: result.product,
        supplier: result.supplier
      });
    } catch (error) {
      console.error('Error importing product from supplier:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Error importing product from supplier'
      });
    }
  }
  
  // Update product inventory from supplier
  async updateProductInventory(req, res) {
    try {
      const { productId } = req.params;
      
      const result = await dropshippingService.updateProductInventory(productId);
      
      res.status(200).json({
        success: true,
        productId: result.productId,
        inventory: result.inventory
      });
    } catch (error) {
      console.error('Error updating product inventory:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Error updating product inventory'
      });
    }
  }
  
  // Place order with supplier
  async placeOrderWithSupplier(req, res) {
    try {
      const { supplierId } = req.params;
      const orderData = req.body;
      
      const result = await dropshippingService.placeOrderWithSupplier(supplierId, orderData);
      
      res.status(200).json({
        success: true,
        orderId: result.orderId,
        status: result.status
      });
    } catch (error) {
      console.error('Error placing order with supplier:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Error placing order with supplier'
      });
    }
  }
  
  // Get order status from supplier
  async getOrderStatusFromSupplier(req, res) {
    try {
      const { supplierId, orderId } = req.params;
      
      const result = await dropshippingService.getOrderStatusFromSupplier(supplierId, orderId);
      
      res.status(200).json({
        success: true,
        orderId: result.orderId,
        status: result.status,
        trackingNumber: result.trackingNumber,
        estimatedDelivery: result.estimatedDelivery
      });
    } catch (error) {
      console.error('Error getting order status from supplier:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Error getting order status from supplier'
      });
    }
  }
  
  // Configure supplier settings
  async configureSupplierSettings(req, res) {
    try {
      const { supplierId } = req.params;
      const settings = req.body;
      
      const result = await dropshippingService.configureSupplierSettings(supplierId, settings);
      
      res.status(200).json({
        success: true,
        supplierId: result.supplierId,
        settings: result.settings
      });
    } catch (error) {
      console.error('Error configuring supplier settings:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Error configuring supplier settings'
      });
    }
  }
}

module.exports = new DropshippingController();
