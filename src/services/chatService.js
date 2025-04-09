const tawkTo = require('../config/tawkto-config');

class ChatService {
  // Get Tawk.to configuration for client-side integration
  getTawkToConfig() {
    return {
      propertyId: tawkTo.propertyId,
      widgetId: tawkTo.widgetId
    };
  }
  
  // Store chat transcript in database
  async storeChatTranscript(chatData) {
    try {
      const admin = require('../config/firebase-config');
      
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
      const admin = require('../config/firebase-config');
      
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
}

module.exports = new ChatService();
