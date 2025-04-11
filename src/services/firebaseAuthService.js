// Firebase Authentication Service
const admin = require('../config/firebase-config');

class FirebaseAuthService {
  // Create a new user with email and password
  async createUser(email, password, displayName) {
    try {
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName,
        emailVerified: false
      });
      
      return userRecord;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Get user by ID
  async getUserById(uid) {
    try {
      const userRecord = await admin.auth().getUser(uid);
      return userRecord;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }

  // Get user by email
  async getUserByEmail(email) {
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      return userRecord;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  // Update user profile
  async updateUser(uid, userData) {
    try {
      const userRecord = await admin.auth().updateUser(uid, userData);
      return userRecord;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Delete user
  async deleteUser(uid) {
    try {
      await admin.auth().deleteUser(uid);
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Set custom user claims (for role-based access control)
  async setCustomUserClaims(uid, claims) {
    try {
      await admin.auth().setCustomUserClaims(uid, claims);
      return true;
    } catch (error) {
      console.error('Error setting custom user claims:', error);
      throw error;
    }
  }

  // Verify ID token
  async verifyIdToken(idToken) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      console.error('Error verifying ID token:', error);
      throw error;
    }
  }

  // Create custom token for client-side sign-in
  async createCustomToken(uid, claims) {
    try {
      const customToken = await admin.auth().createCustomToken(uid, claims);
      return customToken;
    } catch (error) {
      console.error('Error creating custom token:', error);
      throw error;
    }
  }

  // Revoke refresh tokens for a user
  async revokeRefreshTokens(uid) {
    try {
      await admin.auth().revokeRefreshTokens(uid);
      return true;
    } catch (error) {
      console.error('Error revoking refresh tokens:', error);
      throw error;
    }
  }

  // List users (paginated)
  async listUsers(maxResults = 1000, pageToken) {
    try {
      const listUsersResult = await admin.auth().listUsers(maxResults, pageToken);
      return listUsersResult;
    } catch (error) {
      console.error('Error listing users:', error);
      throw error;
    }
  }
}

module.exports = new FirebaseAuthService();
