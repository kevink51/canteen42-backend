// Firebase User Controller
const firebaseAuthService = require('../services/firebaseAuthService');
const admin = require('../config/firebase-config');

class UserController {
  // Register a new user
  async registerUser(req, res) {
    try {
      const { email, password, displayName, userData } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ 
          success: false, 
          error: 'Email and password are required' 
        });
      }
      
      // Create user in Firebase Auth
      const userRecord = await firebaseAuthService.createUser(
        email, 
        password, 
        displayName || email.split('@')[0]
      );
      
      // Store additional user data in Firestore
      const userProfile = {
        email: email,
        displayName: displayName || email.split('@')[0],
        role: 'customer',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        ...userData
      };
      
      await admin.firestore()
        .collection('users')
        .doc(userRecord.uid)
        .set(userProfile);
      
      res.status(201).json({ 
        success: true, 
        uid: userRecord.uid,
        message: 'User registered successfully'
      });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Error registering user' 
      });
    }
  }
  
  // Get user profile
  async getUserProfile(req, res) {
    try {
      const uid = req.user.uid;
      
      // Get user data from Firestore
      const userDoc = await admin.firestore()
        .collection('users')
        .doc(uid)
        .get();
      
      if (!userDoc.exists) {
        return res.status(404).json({ 
          success: false, 
          error: 'User profile not found' 
        });
      }
      
      const userProfile = userDoc.data();
      
      // Remove sensitive information
      delete userProfile.password;
      
      res.status(200).json({ 
        success: true, 
        profile: userProfile 
      });
    } catch (error) {
      console.error('Error getting user profile:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Error getting user profile' 
      });
    }
  }
  
  // Update user profile
  async updateUserProfile(req, res) {
    try {
      const uid = req.user.uid;
      const updates = req.body;
      
      // Remove fields that shouldn't be updated directly
      delete updates.email;
      delete updates.role;
      delete updates.createdAt;
      
      // Add updated timestamp
      updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();
      
      // Update user in Firestore
      await admin.firestore()
        .collection('users')
        .doc(uid)
        .update(updates);
      
      // If displayName is updated, also update in Firebase Auth
      if (updates.displayName) {
        await firebaseAuthService.updateUser(uid, {
          displayName: updates.displayName
        });
      }
      
      res.status(200).json({ 
        success: true, 
        message: 'Profile updated successfully' 
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Error updating user profile' 
      });
    }
  }
  
  // Admin: Get all users
  async getAllUsers(req, res) {
    try {
      const usersSnapshot = await admin.firestore()
        .collection('users')
        .get();
      
      const users = [];
      usersSnapshot.forEach(doc => {
        const userData = doc.data();
        // Remove sensitive information
        delete userData.password;
        
        users.push({
          id: doc.id,
          ...userData
        });
      });
      
      res.status(200).json({ 
        success: true, 
        users 
      });
    } catch (error) {
      console.error('Error getting all users:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Error getting all users' 
      });
    }
  }
  
  // Admin: Update user role
  async updateUserRole(req, res) {
    try {
      const { uid, role } = req.body;
      
      if (!uid || !role) {
        return res.status(400).json({ 
          success: false, 
          error: 'User ID and role are required' 
        });
      }
      
      // Validate role
      if (!['admin', 'customer', 'manager'].includes(role)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid role. Must be admin, customer, or manager' 
        });
      }
      
      // Update user role in Firestore
      await admin.firestore()
        .collection('users')
        .doc(uid)
        .update({
          role,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      
      // Set custom claims for role-based access
      const claims = { role };
      await firebaseAuthService.setCustomUserClaims(uid, claims);
      
      res.status(200).json({ 
        success: true, 
        message: `User role updated to ${role}` 
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Error updating user role' 
      });
    }
  }
}

module.exports = new UserController();
