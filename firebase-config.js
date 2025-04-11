const admin = require('firebase-admin');
const fs = require('fs');

const configPath = '/tmp/firebase-config.json';
fs.writeFileSync(configPath, process.env.FIREBASE_CONFIG);

const serviceAccount = require(configPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});

module.exports = admin;
