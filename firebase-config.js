const admin = require('firebase-admin');
const fs = require('fs');

// Write the config string to a temporary JSON file
const configPath = '/tmp/firebase-config.json';
fs.writeFileSync(configPath, process.env.FIREBASE_CONFIG);

// Load it as a file
const serviceAccount = require(configPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});

module.exports = admin;
