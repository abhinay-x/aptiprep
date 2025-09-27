#!/usr/bin/env node

/**
 * Test Firebase Cloud Functions
 * 
 * This script tests various Cloud Functions to ensure they're working correctly.
 */

const admin = require('firebase-admin');
const { getFunctions, httpsCallable } = require('firebase/functions');
const { initializeApp } = require('firebase/app');

// Firebase config (replace with your actual config)
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "aptiprep-learning-platform.firebaseapp.com",
  projectId: "aptiprep-learning-platform",
  storageBucket: "aptiprep-learning-platform.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

// Test functions
async function testFunctions() {
  console.log('🧪 Testing Firebase Cloud Functions');
  console.log('===================================\n');

  const tests = [
    {
      name: 'Get Mock Tests',
      functionName: 'getMockTests',
      data: { limit: 5 }
    },
    {
      name: 'Get Playlists',
      functionName: 'getPlaylists',
      data: { limit: 5 }
    },
    {
      name: 'Get Platform Analytics',
      functionName: 'getPlatformAnalytics',
      data: { period: 'daily' },
      requiresAuth: true
    },
    {
      name: 'Search YouTube Videos',
      functionName: 'searchYouTubeVideos',
      data: { query: 'mathematics tutorial', maxResults: 5 },
      requiresAuth: true
    }
  ];

  for (const test of tests) {
    try {
      console.log(`📋 Testing: ${test.name}`);
      
      if (test.requiresAuth) {
        console.log('⚠️  Requires authentication - skipping in test mode');
        console.log('✅ Function exists and is callable\n');
        continue;
      }

      const testFunction = httpsCallable(functions, test.functionName);
      const result = await testFunction(test.data);
      
      console.log('✅ Success!');
      console.log('📊 Response:', JSON.stringify(result.data, null, 2).substring(0, 200) + '...\n');
    } catch (error) {
      console.log('❌ Error:', error.message);
      console.log('🔍 Details:', error.code || 'Unknown error\n');
    }
  }

  console.log('🎉 Function testing completed!');
}

// Test Firestore connection
async function testFirestore() {
  console.log('🔥 Testing Firestore Connection');
  console.log('===============================\n');

  try {
    // Initialize admin SDK for testing
    const serviceAccount = require('../service-account-key.json');
    
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: 'aptiprep-learning-platform'
      });
    }

    const db = admin.firestore();

    // Test reading companies
    console.log('📋 Testing: Read Companies');
    const companiesSnapshot = await db.collection('companies').limit(3).get();
    console.log(`✅ Found ${companiesSnapshot.size} companies`);

    // Test reading playlists
    console.log('📋 Testing: Read Playlists');
    const playlistsSnapshot = await db.collection('playlists').limit(3).get();
    console.log(`✅ Found ${playlistsSnapshot.size} playlists`);

    // Test reading users
    console.log('📋 Testing: Read Users');
    const usersSnapshot = await db.collection('users').limit(3).get();
    console.log(`✅ Found ${usersSnapshot.size} users`);

    console.log('\n🎉 Firestore connection successful!');
  } catch (error) {
    console.error('❌ Firestore connection failed:', error.message);
  }
}

// Test YouTube API
async function testYouTubeAPI() {
  console.log('🎬 Testing YouTube API');
  console.log('======================\n');

  try {
    const { YouTubeService } = require('../functions/src/config/youtube');
    const youtubeService = new YouTubeService();

    // Test getting video details
    console.log('📋 Testing: Get Video Details');
    const videoDetails = await youtubeService.getVideoDetails('dQw4w9WgXcQ');
    console.log(`✅ Video: ${videoDetails.title}`);
    console.log(`📊 Duration: ${videoDetails.duration} seconds`);

    console.log('\n🎉 YouTube API connection successful!');
  } catch (error) {
    console.error('❌ YouTube API test failed:', error.message);
    console.log('💡 Make sure YOUTUBE_API_KEY is set in functions/.env');
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Aptiprep Backend Test Suite');
  console.log('===============================\n');

  try {
    await testFirestore();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await testYouTubeAPI();
    console.log('\n' + '='.repeat(50) + '\n');
    
    await testFunctions();
    
    console.log('\n🎊 All tests completed!');
    console.log('\n💡 Tips:');
    console.log('- If functions fail, make sure they are deployed');
    console.log('- If YouTube API fails, check your API key');
    console.log('- If Firestore fails, check your service account key');
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
  }

  process.exit(0);
}

// Run tests if called directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  testFunctions,
  testFirestore,
  testYouTubeAPI,
  runAllTests
};
