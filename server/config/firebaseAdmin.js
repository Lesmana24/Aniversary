const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const dataFilePath = path.join(__dirname, '../data/defaultData.json');

let db = null;
let firebaseInitialized = false;

// Attempt Firebase Admin SDK Initialization if credentials are present
try {
  const admin = require('firebase-admin');
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  
  if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(path.resolve(serviceAccountPath));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });
    db = admin.firestore();
    firebaseInitialized = true;
    console.log('🔥 Firebase Admin SDK initialized successfully!');
  } else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });
    db = admin.firestore();
    firebaseInitialized = true;
    console.log('🔥 Firebase Admin SDK initialized via Environment Variables!');
  } else {
    console.log('ℹ️ Firebase credentials not provided. Operating in Local JSON Storage fallback mode.');
  }
} catch (error) {
  console.warn('⚠️ Firebase Admin init failed or skipped. Falling back to local storage:', error.message);
}

// Local File Helper Functions
function getLocalData() {
  try {
    const raw = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local data:', err);
    return {};
  }
}

function saveLocalData(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving local data:', err);
    return false;
  }
}

module.exports = {
  db,
  firebaseInitialized,
  getLocalData,
  saveLocalData
};
