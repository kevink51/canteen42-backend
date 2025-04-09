const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin with the project ID
const serviceAccount = {
  "type": "service_account",
  "project_id": "canteen42-e1058"
  // Note: In a production environment, the rest of the service account credentials
  // would be loaded from environment variables or a secure configuration
};

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});

module.exports = admin;
