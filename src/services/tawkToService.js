// Tawk.to Integration Service
const tawkToConfig = require('../config/tawkto-config');
const admin = require('../config/firebase-config');

class TawkToService {
  // Get Tawk.to configuration for client-side integration
  getTawkToConfig() {
    return {
      propertyId: tawkToConfig.propertyId,
      widgetId: tawkToConfig.widgetId
    };
  }
  
  // Store chat transcript in Firestore
  async storeChatTranscript(chatData) {
    try {
      // Add timestamp
      const transcript = {
        ...chatData,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      const docRef = await admin.firestore().collection('chatTranscripts').add(transcript);
      
      return {
        id: docRef.id,
        ...transcript
      };
    } catch (error) {
      console.error('Error storing chat transcript:', error);
      throw error;
    }
  }
  
  // Get chat transcripts for a user
  async getChatTranscriptsByUser(userId) {
    try {
      const transcriptsSnapshot = await admin.firestore()
        .collection('chatTranscripts')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();
      
      const transcripts = [];
      transcriptsSnapshot.forEach(doc => {
        transcripts.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return transcripts;
    } catch (error) {
      console.error('Error getting chat transcripts:', error);
      throw error;
    }
  }
  
  // Get all chat transcripts (admin only)
  async getAllChatTranscripts() {
    try {
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
      
      return transcripts;
    } catch (error) {
      console.error('Error getting all chat transcripts:', error);
      throw error;
    }
  }
  
  // Generate Tawk.to widget script for client-side
  generateTawkToScript() {
    return `
      var Tawk_API = Tawk_API || {};
      var Tawk_LoadStart = new Date();
      (function(){
        var s1 = document.createElement("script"),
            s0 = document.getElementsByTagName("script")[0];
        s1.async = true;
        s1.src = 'https://embed.tawk.to/${tawkToConfig.propertyId}/${tawkToConfig.widgetId}';
        s1.charset = 'UTF-8';
        s1.setAttribute('crossorigin','*');
        s0.parentNode.insertBefore(s1, s0);
      })();
    `;
  }
  
  // Set visitor information for Tawk.to
  generateVisitorInfoScript(user) {
    if (!user) return '';
    
    return `
      Tawk_API.onLoad = function() {
        Tawk_API.setAttributes({
          name: '${user.displayName || 'Customer'}',
          email: '${user.email || ''}',
          id: '${user.uid || ''}',
        }, function(error) {});
      };
    `;
  }
}

module.exports = new TawkToService();
