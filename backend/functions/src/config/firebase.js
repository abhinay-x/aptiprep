const admin = require('firebase-admin');

// Initialize Firebase Admin SDK using default credentials and project settings
// In Cloud Functions, admin.initializeApp() with no args picks up the correct
// project, service account, and default storage bucket automatically.
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const storage = admin.storage();
const auth = admin.auth();

module.exports = {
  admin,
  db,
  storage,
  auth
};
