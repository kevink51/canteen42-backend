const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const chatService = require('../services/chatService');

// Get Tawk.to configuration
router.get('/config', async (req, res) => {
  try {
    const config = chatService.getTawkToConfig();
    res.status(200).json({ success: true, config });
  } catch (error) {
    console.error('Error getting chat config:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Auth middleware
const auth = authService.createAuthMiddleware();

// Store chat transcript
router.post('/transcript', auth, async (req, res) => {
  try {
    // Add user ID to transcript data
    const transcriptData = {
      ...req.body,
      userId: req.user.uid
    };
    
    const transcript = await chatService.storeChatTranscript(transcriptData);
    res.status(201).json({ success: true, transcript });
  } catch (error) {
    console.error('Error storing chat transcript:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get chat transcripts for authenticated user
router.get('/transcripts', auth, async (req, res) => {
  try {
    const transcripts = await chatService.getChatTranscriptsByUser(req.user.uid);
    res.status(200).json({ success: true, transcripts });
  } catch (error) {
    console.error('Error getting chat transcripts:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin middleware
const adminAuth = authService.createAdminMiddleware();

// Get all chat transcripts (admin only)
router.get('/admin/transcripts', adminAuth, async (req, res) => {
  try {
    const admin = require('../config/firebase-config');
    
    const transcriptsSnapshot = await admin.firestore()
      .collection('chatTranscripts')
      .orderBy('createdAt', 'desc')
      .get();
    
    const transcripts = [];
    transcriptsSnapshot.forEach(doc => {
      transcripts.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.status(200).json({ success: true, transcripts });
  } catch (error) {
    console.error('Error getting all chat transcripts:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
