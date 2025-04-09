const admin = require('../config/firebase-config');

class ProductService {
  // Get all products
  async getAllProducts() {
    try {
      const productsSnapshot = await admin.firestore().collection('products').get();
      
      const products = [];
      productsSnapshot.forEach(doc => {
        products.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return products;
    } catch (error) {
      console.error('Error getting products:', error);
      throw error;
    }
  }
  
  // Get product by ID
  async getProductById(productId) {
    try {
      const productDoc = await admin.firestore().collection('products').doc(productId).get();
      
      if (!productDoc.exists) {
        throw new Error('Product not found');
      }
      
      return {
        id: productDoc.id,
        ...productDoc.data()
      };
    } catch (error) {
      console.error('Error getting product:', error);
      throw error;
    }
  }
  
  // Create new product
  async createProduct(productData) {
    try {
      // Add created timestamp
      const product = {
        ...productData,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      const docRef = await admin.firestore().collection('products').add(product);
      
      return {
        id: docRef.id,
        ...product
      };
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }
  
  // Update product
  async updateProduct(productId, productData) {
    try {
      // Add updated timestamp
      const updates = {
        ...productData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      await admin.firestore().collection('products').doc(productId).update(updates);
      
      return {
        id: productId,
        ...updates
      };
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }
  
  // Delete product
  async deleteProduct(productId) {
    try {
      await admin.firestore().collection('products').doc(productId).delete();
      
      return { success: true, id: productId };
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
  
  // Get products by category
  async getProductsByCategory(category) {
    try {
      const productsSnapshot = await admin.firestore()
        .collection('products')
        .where('category', '==', category)
        .get();
      
      const products = [];
      productsSnapshot.forEach(doc => {
        products.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return products;
    } catch (error) {
      console.error('Error getting products by category:', error);
      throw error;
    }
  }
  
  // Search products
  async searchProducts(query) {
    try {
      // In a real implementation, this would use Firestore queries
      // or a dedicated search service like Algolia
      const productsSnapshot = await admin.firestore().collection('products').get();
      
      const products = [];
      productsSnapshot.forEach(doc => {
        const product = doc.data();
        const searchableText = `${product.name} ${product.description} ${product.category}`.toLowerCase();
        
        if (searchableText.includes(query.toLowerCase())) {
          products.push({
            id: doc.id,
            ...product
          });
        }
      });
      
      return products;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }
}

module.exports = new ProductService();
