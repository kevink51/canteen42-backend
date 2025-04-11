// Chat Routes
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { verifyFirebaseToken, verifyAdmin } = require('../middleware/authMiddleware');

// Public routes
// Get Tawk.to configuration
router.get('/config', chatController.getTawkToConfig);

// Get Tawk.to widget script
router.get('/script', chatController.getTawkToScript);

// Store chat transcript (no auth required for public chats)
router.post('/transcript', chatController.storeChatTranscript);

// Protected routes (require authentication)
// Get chat transcripts for authenticated user
router.get('/transcripts/user', verifyFirebaseToken, chatController.getUserChatTranscripts);

// Admin routes (require admin role)
// Get all chat transcripts
router.get('/transcripts/all', verifyAdmin, chatController.getAllChatTranscripts);

module.exports = router;
