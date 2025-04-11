// Tawk.to Chat Controller
const tawkToService = require('../services/tawkToService');

class ChatController {
  // Get Tawk.to configuration
  async getTawkToConfig(req, res) {
    try {
      const config = tawkToService.getTawkToConfig();
      res.status(200).json({ 
        success: true, 
        config 
      });
    } catch (error) {
      console.error('Error getting Tawk.to config:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Error getting Tawk.to config' 
      });
    }
  }
  
  // Store chat transcript
  async storeChatTranscript(req, res) {
    try {
      const transcriptData = req.body;
      
      // Add user ID if authenticated
      if (req.user) {
        transcriptData.userId = req.user.uid;
      }
      
      const transcript = await tawkToService.storeChatTranscript(transcriptData);
      
      res.status(201).json({ 
        success: true, 
        transcript 
      });
    } catch (error) {
      console.error('Error storing chat transcript:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Error storing chat transcript' 
      });
    }
  }
  
  // Get chat transcripts for authenticated user
  async getUserChatTranscripts(req, res) {
    try {
      const transcripts = await tawkToService.getChatTranscriptsByUser(req.user.uid);
      
      res.status(200).json({ 
        success: true, 
        transcripts 
      });
    } catch (error) {
      console.error('Error getting user chat transcripts:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Error getting user chat transcripts' 
      });
    }
  }
  
  // Get all chat transcripts (admin only)
  async getAllChatTranscripts(req, res) {
    try {
      const transcripts = await tawkToService.getAllChatTranscripts();
      
      res.status(200).json({ 
        success: true, 
        transcripts 
      });
    } catch (error) {
      console.error('Error getting all chat transcripts:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Error getting all chat transcripts' 
      });
    }
  }
  
  // Get Tawk.to widget script
  async getTawkToScript(req, res) {
    try {
      const script = tawkToService.generateTawkToScript();
      
      res.status(200).send(script);
    } catch (error) {
      console.error('Error getting Tawk.to script:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Error getting Tawk.to script' 
      });
    }
  }
}

module.exports = new ChatController();
