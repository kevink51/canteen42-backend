// Firebase Authentication Middleware
const firebaseAuthService = require('../services/firebaseAuthService');

// Middleware to verify Firebase ID token
const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized: No token provided' 
      });
    }
    
    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await firebaseAuthService.verifyIdToken(idToken);
    
    // Add user info to request
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(401).json({ 
      success: false, 
      error: 'Unauthorized: Invalid token' 
    });
  }
};

// Middleware to check admin role
const verifyAdmin = async (req, res, next) => {
  try {
    // First verify the token
    await verifyFirebaseToken(req, res, async () => {
      try {
        const admin = require('../config/firebase-config');
        
        // Get user from Firestore database
        const userDoc = await admin.firestore()
          .collection('users')
          .doc(req.user.uid)
          .get();
        
        if (!userDoc.exists) {
          return res.status(403).json({ 
            success: false, 
            error: 'Forbidden: User not found' 
          });
        }
        
        const userData = userDoc.data();
        
        // Check if user has admin role
        if (userData.role !== 'admin') {
          return res.status(403).json({ 
            success: false, 
            error: 'Forbidden: Admin access required' 
          });
        }
        
        next();
      } catch (error) {
        console.error('Admin verification error:', error);
        return res.status(500).json({ 
          success: false, 
          error: 'Internal server error' 
        });
      }
    });
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(401).json({ 
      success: false, 
      error: 'Unauthorized: Invalid token' 
    });
  }
};

module.exports = {
  verifyFirebaseToken,
  verifyAdmin
};
