const admin = require("firebase-admin");
require("dotenv").config();

admin.initializeApp({
  apiKey: process.env.FIREBASE_KEY,
  authDomain: process.env.FIREBASE_DOMAIN,
  projectId: process.env.FIREBASE_ID,
  storageBucket: process.env.FIREBASE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESS,
  appId: process.env.FIREBASE_APPID,
  measurementId: process.env.FIREBASE_MEASURE,
});

module.exports = {
  auth: admin.auth(),
  messaging: admin.messaging(),
};
