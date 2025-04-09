const admin = require('./firebase-config');

// Authentication service for admin users
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
}

module.exports = new AuthService();
