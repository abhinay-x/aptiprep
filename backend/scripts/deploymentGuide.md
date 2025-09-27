# Aptiprep Backend Deployment Guide

This guide walks you through deploying the Aptiprep Firebase backend from scratch.

## 📋 Prerequisites

Before starting, ensure you have:

- [ ] Node.js 18+ installed
- [ ] Firebase CLI installed (`npm install -g firebase-tools`)
- [ ] Google Cloud account with billing enabled
- [ ] Firebase project created
- [ ] YouTube Data API access

## 🚀 Step-by-Step Deployment

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Project name: `aptiprep-learning-platform`
4. Enable Google Analytics (recommended)
5. Choose analytics location: India

### Step 2: Enable Firebase Services

In your Firebase project, enable these services:

- [ ] **Authentication**
  - Go to Authentication > Sign-in method
  - Enable Email/Password
  - Enable Google Sign-in
  - Add authorized domains

- [ ] **Firestore Database**
  - Go to Firestore Database
  - Create database in production mode
  - Choose location: asia-south1 (Mumbai)

- [ ] **Cloud Storage**
  - Go to Storage
  - Get started with default rules
  - Choose location: asia-south1

- [ ] **Cloud Functions**
  - Will be enabled automatically when deploying

### Step 3: Setup YouTube Data API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Navigate to "APIs & Services" → "Library"
4. Search and enable "YouTube Data API v3"
5. Go to "APIs & Services" → "Credentials"
6. Create API Key
7. Restrict the API key to YouTube Data API v3
8. Note down the API key

### Step 4: Download Service Account Key

1. Go to Firebase Console → Project Settings
2. Click on "Service accounts" tab
3. Click "Generate new private key"
4. Download the JSON file
5. Rename it to `service-account-key.json`

### Step 5: Clone and Setup Project

```bash
# Clone the repository
git clone <your-repo-url>
cd aptiprep/backend

# Install dependencies
npm install

# Setup Firebase CLI
firebase login
```

### Step 6: Configure Environment

```bash
# Copy environment template
cp functions/.env.example functions/.env

# Edit the .env file with your credentials
nano functions/.env
```

Update the `.env` file with:
```env
YOUTUBE_API_KEY=your-youtube-api-key-here
FIREBASE_PROJECT_ID=aptiprep-learning-platform
# Add other required keys
```

Place your `service-account-key.json` in the project root.

### Step 7: Deploy Security Rules

```bash
# Deploy Firestore and Storage rules
firebase deploy --only firestore:rules,storage
```

### Step 8: Deploy Cloud Functions

```bash
# Install function dependencies
cd functions
npm install
cd ..

# Deploy all functions
firebase deploy --only functions
```

### Step 9: Seed Initial Data

```bash
# Run the seeding script
npm run seed
```

This will create:
- Sample companies (TCS, Infosys, Wipro)
- Sample playlists and videos
- Sample mock tests
- Admin user account

### Step 10: Verify Deployment

1. Check Firebase Console:
   - Functions are deployed
   - Firestore has data
   - Rules are active

2. Test API endpoints:
```bash
# Test a function
curl -X POST https://us-central1-aptiprep-learning-platform.cloudfunctions.net/getMockTests \
  -H "Content-Type: application/json" \
  -d '{"data": {}}'
```

## 🔧 Configuration Details

### Firebase Configuration Object

Add this to your frontend:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "aptiprep-learning-platform.firebaseapp.com",
  projectId: "aptiprep-learning-platform",
  storageBucket: "aptiprep-learning-platform.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### Environment Variables

Required environment variables in `functions/.env`:

```env
# Firebase (auto-configured in Cloud Functions)
FIREBASE_PROJECT_ID=aptiprep-learning-platform

# YouTube Data API
YOUTUBE_API_KEY=your-youtube-api-key

# Security
ENCRYPTION_SECRET=your-32-character-secret-key
JWT_SECRET=your-jwt-secret-key

# Optional: Email service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 🔐 Security Setup

### Firestore Security Rules

The deployed rules ensure:
- Users can only access their own data
- Public content is readable by authenticated users
- Admin operations require admin role
- Test answers are protected during attempts

### Storage Security Rules

- Users can upload profile pictures (5MB limit)
- Course materials readable by authenticated users
- Admin content requires admin role

### Authentication Setup

1. Enable sign-in methods in Firebase Console
2. Configure OAuth providers (Google, Facebook)
3. Set up custom claims for roles
4. Configure password policies

## 📊 Monitoring Setup

### Enable Monitoring

1. Go to Firebase Console → Functions
2. Enable detailed monitoring
3. Set up error alerting
4. Configure performance monitoring

### Analytics Setup

1. Enable Google Analytics in Firebase
2. Set up custom events tracking
3. Configure conversion goals
4. Set up audience segments

## 🚨 Production Considerations

### Performance Optimization

- [ ] Enable function concurrency
- [ ] Set appropriate timeout values
- [ ] Implement caching strategies
- [ ] Optimize database queries

### Backup Strategy

- [ ] Enable Firestore automatic backups
- [ ] Set up Cloud Storage backups
- [ ] Document recovery procedures
- [ ] Test backup restoration

### Scaling Considerations

- [ ] Monitor function execution times
- [ ] Set up auto-scaling policies
- [ ] Implement rate limiting
- [ ] Plan for database sharding

## 🔄 CI/CD Setup (Optional)

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: |
        npm install
        cd functions && npm install
    
    - name: Deploy to Firebase
      run: |
        npm install -g firebase-tools
        firebase deploy --token "$FIREBASE_TOKEN"
      env:
        FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

## 🧪 Testing

### Local Testing

```bash
# Start emulators
npm run serve

# Run tests
npm test

# Test specific functions
firebase functions:shell
```

### Production Testing

```bash
# Test deployed functions
npm run test:production

# Load testing
npm run test:load
```

## 📈 Post-Deployment

### Initial Setup Tasks

1. [ ] Create admin user accounts
2. [ ] Import initial content via YouTube importer
3. [ ] Set up monitoring dashboards
4. [ ] Configure backup schedules
5. [ ] Test all user flows

### Content Management

1. [ ] Import educational YouTube playlists
2. [ ] Create company-specific roadmaps
3. [ ] Set up mock test question banks
4. [ ] Configure difficulty levels

### User Management

1. [ ] Set up user roles and permissions
2. [ ] Configure email templates
3. [ ] Set up user onboarding flow
4. [ ] Test authentication flows

## 🆘 Troubleshooting

### Common Issues

**Functions not deploying:**
- Check Node.js version (must be 18+)
- Verify service account permissions
- Check function timeout settings

**Database permission errors:**
- Verify Firestore rules are deployed
- Check user authentication
- Validate custom claims setup

**YouTube API errors:**
- Verify API key is correct
- Check API quotas and limits
- Ensure API is enabled in Google Cloud

**Storage upload failures:**
- Check storage rules
- Verify file size limits
- Check CORS configuration

### Getting Help

1. Check Firebase Console logs
2. Review function execution logs
3. Test with Firebase emulators
4. Check GitHub issues
5. Contact support team

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [YouTube Data API Documentation](https://developers.google.com/youtube/v3)
- [Firestore Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)
- [Cloud Functions Best Practices](https://firebase.google.com/docs/functions/best-practices)

---

🎉 **Congratulations!** Your Aptiprep backend is now deployed and ready to power your adaptive learning platform.
