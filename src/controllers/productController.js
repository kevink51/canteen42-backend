// Product Controller
const { Product, Category } = require('../models/schemas');

class ProductController {
  // Get all products
  async getAllProducts(req, res) {
    try {
      const products = await Product.getAll();
      res.status(200).json({ success: true, products });
    } catch (error) {
      console.error('Error getting all products:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get product by ID
  async getProductById(req, res) {
    try {
      const product = await Product.getById(req.params.id);
      res.status(200).json({ success: true, product });
    } catch (error) {
      console.error('Error getting product by ID:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Create new product
  async createProduct(req, res) {
    try {
      const product = await Product.create(req.body);
      res.status(201).json({ success: true, product });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Update product
  async updateProduct(req, res) {
    try {
      const product = await Product.update(req.params.id, req.body);
      res.status(200).json({ success: true, product });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Delete product
  async deleteProduct(req, res) {
    try {
      const result = await Product.delete(req.params.id);
      res.status(200).json({ success: true, result });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get products by category
  async getProductsByCategory(req, res) {
    try {
      const products = await Product.query('category', '==', req.params.category);
      res.status(200).json({ success: true, products });
    } catch (error) {
      console.error('Error getting products by category:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Search products
  async searchProducts(req, res) {
    try {
      const { query } = req.params;
      
      // In a real implementation, this would use Firestore queries
      // or a dedicated search service like Algolia
      const allProducts = await Product.getAll();
      
      const products = allProducts.filter(product => {
        const searchableText = `${product.name} ${product.description} ${product.category}`.toLowerCase();
        return searchableText.includes(query.toLowerCase());
      });
      
      res.status(200).json({ success: true, products });
    } catch (error) {
      console.error('Error searching products:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get featured products
  async getFeaturedProducts(req, res) {
    try {
      const products = await Product.query('isFeatured', '==', true);
      res.status(200).json({ success: true, products });
    } catch (error) {
      console.error('Error getting featured products:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Get all categories
  async getAllCategories(req, res) {
    try {
      const categories = await Category.getAll();
      res.status(200).json({ success: true, categories });
    } catch (error) {
      console.error('Error getting all categories:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Create new category
  async createCategory(req, res) {
    try {
      const category = await Category.create(req.body);
      res.status(201).json({ success: true, category });
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Update category
  async updateCategory(req, res) {
    try {
      const category = await Category.update(req.params.id, req.body);
      res.status(200).json({ success: true, category });
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Delete category
  async deleteCategory(req, res) {
    try {
      const result = await Category.delete(req.params.id);
      res.status(200).json({ success: true, result });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new ProductController();
