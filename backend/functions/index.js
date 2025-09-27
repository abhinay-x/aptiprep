const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp();

// Import all function modules
const authFunctions = require('./src/auth');
const userFunctions = require('./src/user');
const contentFunctions = require('./src/content');
const youtubeFunctions = require('./src/youtube');
const testFunctions = require('./src/tests');
const analyticsFunctions = require('./src/analytics');
const adminFunctions = require('./src/admin');

// Export all functions
module.exports = {
  // Authentication functions
  ...authFunctions,
  
  // User management functions
  ...userFunctions,
  
  // Content management functions
  ...contentFunctions,
  
  // YouTube integration functions
  ...youtubeFunctions,
  
  // Test and assessment functions
  ...testFunctions,
  
  // Analytics functions
  ...analyticsFunctions,
  
  // Admin functions
  ...adminFunctions
};
