const admin = require('firebase-admin');

const config = process.env.FIREBASE_CONFIG;

const parsedConfig = JSON.parse(config.replace(/\\n/g, '\n'));

admin.initializeApp({
  credential: admin.credential.cert(parsedConfig),
  databaseURL: `https://${parsedConfig.project_id}.firebaseio.com`
});

module.exports = admin;




