const admin = require('firebase-admin');

// Step 1: Get the raw string from the env variable
const configString = process.env.FIREBASE_CONFIG;
const cleanString = configString.trim().replace(/^"|"$/g, "");
const properJson = JSON.parse(cleanString.replace(/\\n/g, "\n"));




// Step 4: Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(properJson),
  databaseURL: `https://${properJson.project_id}.firebaseio.com`
});

module.exports = admin;

