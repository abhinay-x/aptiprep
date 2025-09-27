#!/usr/bin/env node

/**
 * Firebase Project Setup Script
 * 
 * This script helps set up the Firebase project with all necessary
 * services and initial configuration.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

function executeCommand(command, description) {
  console.log(`\n📋 ${description}`);
  console.log(`Running: ${command}`);
  
  try {
    execSync(command, { stdio: 'inherit' });
    console.log('✅ Success!');
    return true;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

function createServiceAccountKeyTemplate() {
  const template = {
    "type": "service_account",
    "project_id": "aptiprep-learning-platform",
    "private_key_id": "YOUR_PRIVATE_KEY_ID",
    "private_key": "-----BEGIN PRIVATE KEY-----\\nYOUR_PRIVATE_KEY\\n-----END PRIVATE KEY-----\\n",
    "client_email": "firebase-adminsdk-xxxxx@aptiprep-learning-platform.iam.gserviceaccount.com",
    "client_id": "YOUR_CLIENT_ID",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40aptiprep-learning-platform.iam.gserviceaccount.com"
  };

  const templatePath = path.join(__dirname, '..', 'service-account-key.template.json');
  fs.writeFileSync(templatePath, JSON.stringify(template, null, 2));
  
  console.log(`📄 Service account key template created at: ${templatePath}`);
  console.log('⚠️  Please replace with your actual service account key from Firebase Console');
}

async function setupFirebaseProject() {
  console.log('🔥 Firebase Project Setup for Aptiprep');
  console.log('=====================================\n');

  // Check if Firebase CLI is installed
  try {
    execSync('firebase --version', { stdio: 'pipe' });
    console.log('✅ Firebase CLI is installed');
  } catch (error) {
    console.log('❌ Firebase CLI not found. Installing...');
    if (!executeCommand('npm install -g firebase-tools', 'Installing Firebase CLI')) {
      console.log('Please install Firebase CLI manually: npm install -g firebase-tools');
      return;
    }
  }

  // Login to Firebase
  const loginChoice = await askQuestion('Are you logged into Firebase CLI? (y/n): ');
  if (loginChoice.toLowerCase() !== 'y') {
    executeCommand('firebase login', 'Logging into Firebase');
  }

  // List projects
  console.log('\n📋 Available Firebase projects:');
  executeCommand('firebase projects:list', 'Listing Firebase projects');

  const projectId = await askQuestion('\nEnter your Firebase project ID (or press Enter for "aptiprep-learning-platform"): ') 
    || 'aptiprep-learning-platform';

  // Update .firebaserc
  const firebaserc = {
    projects: {
      default: projectId
    }
  };
  
  const firebasercPath = path.join(__dirname, '..', '.firebaserc');
  fs.writeFileSync(firebasercPath, JSON.stringify(firebaserc, null, 2));
  console.log(`✅ Updated .firebaserc with project: ${projectId}`);

  // Initialize Firebase features
  console.log('\n🔧 Setting up Firebase features...');
  
  const features = [
    'firestore',
    'functions',
    'storage',
    'hosting'
  ];

  console.log('The following features will be configured:');
  features.forEach(feature => console.log(`  - ${feature}`));

  const continueSetup = await askQuestion('\nContinue with setup? (y/n): ');
  if (continueSetup.toLowerCase() !== 'y') {
    console.log('Setup cancelled.');
    rl.close();
    return;
  }

  // Deploy Firestore rules and indexes
  if (executeCommand('firebase deploy --only firestore:rules,firestore:indexes', 'Deploying Firestore rules and indexes')) {
    console.log('✅ Firestore rules and indexes deployed');
  }

  // Deploy Storage rules
  if (executeCommand('firebase deploy --only storage', 'Deploying Storage rules')) {
    console.log('✅ Storage rules deployed');
  }

  // Install Functions dependencies
  const functionsDir = path.join(__dirname, '..', 'functions');
  process.chdir(functionsDir);
  
  if (executeCommand('npm install', 'Installing Cloud Functions dependencies')) {
    console.log('✅ Functions dependencies installed');
  }

  // Create service account key template
  createServiceAccountKeyTemplate();

  // Setup environment variables
  console.log('\n🔑 Environment Setup');
  console.log('Please set up the following:');
  console.log('1. Download service account key from Firebase Console');
  console.log('2. Replace the template file with your actual key');
  console.log('3. Get YouTube Data API key from Google Cloud Console');
  console.log('4. Update functions/.env file with your API keys');

  const envPath = path.join(functionsDir, '.env');
  if (!fs.existsSync(envPath)) {
    const exampleEnvPath = path.join(functionsDir, '.env.example');
    if (fs.existsSync(exampleEnvPath)) {
      fs.copyFileSync(exampleEnvPath, envPath);
      console.log('✅ Created .env file from template');
    }
  }

  console.log('\n🎉 Firebase setup completed!');
  console.log('\nNext steps:');
  console.log('1. Update service-account-key.json with your actual key');
  console.log('2. Update functions/.env with your API keys');
  console.log('3. Deploy functions: npm run deploy');
  console.log('4. Seed database: npm run seed');

  rl.close();
}

async function main() {
  try {
    await setupFirebaseProject();
  } catch (error) {
    console.error('❌ Setup failed:', error);
    rl.close();
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { setupFirebaseProject };
