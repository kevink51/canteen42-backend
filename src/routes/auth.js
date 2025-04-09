const express = require('express');
const router = express.Router();
const authService = require('../services/authService');

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, userData } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }
    
    const userRecord = await authService.registerUser(email, password, userData);
    
    res.status(201).json({ success: true, uid: userRecord.uid });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Auth middleware
const auth = authService.createAuthMiddleware();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const profile = await authService.getUserProfile(req.user.uid);
    res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    await authService.updateUserProfile(req.user.uid, req.body);
    const updatedProfile = await authService.getUserProfile(req.user.uid);
    
    res.status(200).json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
