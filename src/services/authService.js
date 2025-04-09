const admin = require('../config/firebase-config');

class AuthService {
  // Verify Firebase ID token
  async verifyIdToken(idToken) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      console.error('Error verifying ID token:', error);
      throw new Error('Unauthorized: Invalid token');
    }
  }

  // Check if user has admin role
  async isAdmin(uid) {
    try {
      // Get user from Firestore database
      const userDoc = await admin.firestore().collection('users').doc(uid).get();
      
      if (!userDoc.exists) {
        return false;
      }
      
      const userData = userDoc.data();
      return userData.role === 'admin';
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  // Create admin middleware for protecting routes
  createAdminMiddleware() {
    return async (req, res, next) => {
      try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }
        
        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await this.verifyIdToken(idToken);
        
        // Check if user is an admin
        const isAdmin = await this.isAdmin(decodedToken.uid);
        
        if (!isAdmin) {
          return res.status(403).json({ error: 'Forbidden: Admin access required' });
        }
        
        // Add user info to request
        req.user = decodedToken;
        next();
      } catch (error) {
        console.error('Admin middleware error:', error);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }
    };
  }

  // Create user authentication middleware
  createAuthMiddleware() {
    return async (req, res, next) => {
      try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }
        
        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await this.verifyIdToken(idToken);
        
        // Add user info to request
        req.user = decodedToken;
        next();
      } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }
    };
  }

  // Register a new user
  async registerUser(email, password, userData) {
    try {
      // Create user in Firebase Auth
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: userData.name
      });
      
      // Store additional user data in Firestore
      await admin.firestore().collection('users').doc(userRecord.uid).set({
        email: email,
        name: userData.name,
        role: 'customer',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        ...userData
      });
      
      return userRecord;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  // Get user profile
  async getUserProfile(uid) {
    try {
      const userDoc = await admin.firestore().collection('users').doc(uid).get();
      
      if (!userDoc.exists) {
        throw new Error('User not found');
      }
      
      return userDoc.data();
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  // Update user profile
  async updateUserProfile(uid, userData) {
    try {
      // Update user in Firestore
      await admin.firestore().collection('users').doc(uid).update({
        ...userData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      // If name is updated, also update in Firebase Auth
      if (userData.name) {
        await admin.auth().updateUser(uid, {
          displayName: userData.name
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
}

module.exports = new AuthService();
