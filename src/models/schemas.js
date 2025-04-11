// E-commerce Schema Models
const admin = require('../config/firebase-config');

// Product Schema
const productSchema = {
  name: String,
  description: String,
  price: Number,
  salePrice: Number,
  category: String,
  subcategory: String,
  images: Array,
  inventory: Number,
  sku: String,
  weight: Number,
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  features: Array,
  specifications: Object,
  variants: Array,
  tags: Array,
  brand: String,
  isActive: Boolean,
  isFeatured: Boolean,
  ratings: {
    average: Number,
    count: Number
  },
  sales: Number,
  createdAt: Date,
  updatedAt: Date
};

// Order Schema
const orderSchema = {
  userId: String,
  items: Array,
  subtotal: Number,
  tax: Number,
  shipping: Number,
  discount: Number,
  total: Number,
  paymentMethod: String,
  paymentId: String,
  status: String,
  shippingAddress: {
    name: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String
  },
  billingAddress: {
    name: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String
  },
  trackingNumber: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
};

// User Schema
const userSchema = {
  email: String,
  displayName: String,
  role: String,
  phone: String,
  addresses: Array,
  defaultAddress: Object,
  orders: Array,
  wishlist: Array,
  cart: Array,
  paymentMethods: Array,
  preferences: Object,
  createdAt: Date,
  updatedAt: Date
};

// Category Schema
const categorySchema = {
  name: String,
  description: String,
  image: String,
  parentCategory: String,
  subcategories: Array,
  isActive: Boolean,
  order: Number,
  createdAt: Date,
  updatedAt: Date
};

// Review Schema
const reviewSchema = {
  productId: String,
  userId: String,
  userName: String,
  rating: Number,
  title: String,
  content: String,
  images: Array,
  isVerifiedPurchase: Boolean,
  helpfulVotes: Number,
  createdAt: Date,
  updatedAt: Date
};

// Coupon Schema
const couponSchema = {
  code: String,
  description: String,
  type: String,
  value: Number,
  minPurchase: Number,
  maxDiscount: Number,
  startDate: Date,
  endDate: Date,
  isActive: Boolean,
  usageLimit: Number,
  usageCount: Number,
  applicableProducts: Array,
  applicableCategories: Array,
  createdAt: Date,
  updatedAt: Date
};

// Supplier Schema
const supplierSchema = {
  name: String,
  type: String,
  contactName: String,
  email: String,
  phone: String,
  website: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  products: Array,
  apiKey: String,
  apiEndpoint: String,
  isActive: Boolean,
  notes: String,
  createdAt: Date,
  updatedAt: Date
};

// Create a model class for Firestore collections
class FirestoreModel {
  constructor(collectionName, schema) {
    this.collectionName = collectionName;
    this.schema = schema;
    this.collection = admin.firestore().collection(collectionName);
  }

  // Create a new document
  async create(data) {
    try {
      // Add timestamps
      data.createdAt = admin.firestore.FieldValue.serverTimestamp();
      data.updatedAt = admin.firestore.FieldValue.serverTimestamp();
      
      const docRef = await this.collection.add(data);
      return {
        id: docRef.id,
        ...data
      };
    } catch (error) {
      console.error(`Error creating ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Get all documents
  async getAll() {
    try {
      const snapshot = await this.collection.get();
      
      const documents = [];
      snapshot.forEach(doc => {
        documents.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return documents;
    } catch (error) {
      console.error(`Error getting all ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Get document by ID
  async getById(id) {
    try {
      const doc = await this.collection.doc(id).get();
      
      if (!doc.exists) {
        throw new Error(`${this.collectionName} not found`);
      }
      
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      console.error(`Error getting ${this.collectionName} by ID:`, error);
      throw error;
    }
  }

  // Update document
  async update(id, data) {
    try {
      // Add updated timestamp
      data.updatedAt = admin.firestore.FieldValue.serverTimestamp();
      
      await this.collection.doc(id).update(data);
      
      return {
        id,
        ...data
      };
    } catch (error) {
      console.error(`Error updating ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Delete document
  async delete(id) {
    try {
      await this.collection.doc(id).delete();
      
      return {
        id,
        deleted: true
      };
    } catch (error) {
      console.error(`Error deleting ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Query documents
  async query(field, operator, value) {
    try {
      const snapshot = await this.collection.where(field, operator, value).get();
      
      const documents = [];
      snapshot.forEach(doc => {
        documents.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return documents;
    } catch (error) {
      console.error(`Error querying ${this.collectionName}:`, error);
      throw error;
    }
  }
}

// Create model instances
const Product = new FirestoreModel('products', productSchema);
const Order = new FirestoreModel('orders', orderSchema);
const User = new FirestoreModel('users', userSchema);
const Category = new FirestoreModel('categories', categorySchema);
const Review = new FirestoreModel('reviews', reviewSchema);
const Coupon = new FirestoreModel('coupons', couponSchema);
const Supplier = new FirestoreModel('suppliers', supplierSchema);

module.exports = {
  Product,
  Order,
  User,
  Category,
  Review,
  Coupon,
  Supplier,
  schemas: {
    productSchema,
    orderSchema,
    userSchema,
    categorySchema,
    reviewSchema,
    couponSchema,
    supplierSchema
  }
};
