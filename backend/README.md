# Aptiprep Backend - Firebase Implementation

A comprehensive Firebase backend for the Aptiprep adaptive learning platform, supporting competitive exam preparation with YouTube integration, mock tests, and advanced analytics.

## 🏗️ Architecture Overview

### Core Services
- **Firebase Firestore**: Primary NoSQL database
- **Firebase Authentication**: User authentication and authorization
- **Firebase Cloud Functions**: Serverless backend logic
- **Firebase Cloud Storage**: File and media storage
- **YouTube Data API v3**: Video content integration
- **Firebase Real-time Database**: Live features and notifications

### Key Features
- ✅ User authentication and profile management
- ✅ YouTube video and playlist integration
- ✅ Mock test system with analytics
- ✅ Progress tracking and gamification
- ✅ Company-specific roadmaps
- ✅ Admin dashboard and content management
- ✅ Real-time analytics and reporting

## 📁 Project Structure

```
backend/
├── functions/                 # Firebase Cloud Functions
│   ├── src/
│   │   ├── auth/             # Authentication functions
│   │   ├── user/             # User management functions
│   │   ├── content/          # Content management functions
│   │   ├── youtube/          # YouTube integration functions
│   │   ├── tests/            # Mock test functions
│   │   ├── analytics/        # Analytics functions
│   │   ├── admin/            # Admin functions
│   │   └── config/           # Configuration files
│   ├── index.js              # Main functions entry point
│   └── package.json          # Functions dependencies
├── scripts/                  # Utility scripts
│   └── seedData.js          # Database seeding script
├── tools/                    # Development tools
│   └── youtubeImporter.js   # YouTube content importer
├── firebase.json             # Firebase configuration
├── firestore.rules          # Firestore security rules
├── storage.rules            # Storage security rules
├── firestore.indexes.json   # Database indexes
└── README.md                # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase project created
- YouTube Data API key

### 1. Setup Firebase Project

```bash
# Clone the repository
git clone <repository-url>
cd backend

# Install dependencies
npm install

# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init
```

### 2. Environment Configuration

Create a `.env` file in the `functions/` directory:

```bash
cp functions/.env.example functions/.env
```

Update the `.env` file with your credentials:
- Firebase service account key
- YouTube Data API key
- Other API keys as needed

### 3. Deploy Security Rules

```bash
# Deploy Firestore and Storage rules
firebase deploy --only firestore:rules,storage
```

### 4. Deploy Cloud Functions

```bash
# Deploy all functions
firebase deploy --only functions

# Or deploy specific functions
firebase deploy --only functions:createUserProfile,updateUserProgress
```

### 5. Seed Database (Optional)

```bash
# Run the seeding script
npm run seed
```

## 🔧 Development

### Local Development

```bash
# Start Firebase emulators
npm run serve

# This starts:
# - Functions emulator (http://localhost:5001)
# - Firestore emulator (http://localhost:8080)
# - Auth emulator (http://localhost:9099)
# - Storage emulator (http://localhost:9199)
# - Emulator UI (http://localhost:4000)
```

### Testing

```bash
# Run tests
npm test

# Run specific test suite
npm test -- --testNamePattern="auth"
```

### Deployment

```bash
# Deploy everything
firebase deploy

# Deploy only functions
npm run deploy

# Deploy with specific target
firebase deploy --only functions,firestore:rules
```

## 📊 Database Schema

### Core Collections

#### Users (`/users/{userId}`)
```javascript
{
  userId: "string",
  email: "string",
  displayName: "string",
  role: "student|instructor|admin",
  profile: {
    fullName: "string",
    phone: "string",
    college: "string",
    // ... more fields
  },
  gamification: {
    totalXP: "number",
    currentStreak: "number",
    level: "number",
    // ... more fields
  }
}
```

#### Companies (`/companies/{companyId}`)
```javascript
{
  companyId: "string",
  name: "string",
  shortName: "string",
  aptitudeInfo: {
    testPattern: {
      sections: [/* test sections */],
      totalQuestions: "number",
      totalTime: "number"
    }
  }
}
```

#### Playlists (`/playlists/{playlistId}`)
```javascript
{
  playlistId: "string",
  title: "string",
  category: "string",
  videos: [/* video objects */],
  instructor: {/* instructor info */},
  stats: {/* engagement stats */}
}
```

### Security Rules

The database uses comprehensive security rules:
- Users can only access their own data
- Public content is readable by all authenticated users
- Admin and instructor roles have elevated permissions
- Content creation requires appropriate roles

## 🎬 YouTube Integration

### Features
- Import individual videos or entire playlists
- Automatic metadata synchronization
- Channel content discovery
- Search and import functionality

### Usage

```bash
# Interactive YouTube importer
npm run import-youtube

# Or use programmatically
node tools/youtubeImporter.js
```

### API Integration
The YouTube service automatically:
- Fetches video metadata (title, description, duration)
- Downloads thumbnails
- Tracks video statistics
- Syncs data periodically

## 🧪 Mock Test System

### Features
- Company-specific test patterns
- Section-wise time limits
- Real-time answer submission
- Automatic scoring and percentile calculation
- Detailed analytics and recommendations

### Test Flow
1. User starts test attempt
2. Questions are served (shuffled for security)
3. Answers submitted in real-time
4. Test completion triggers scoring
5. Results and analytics generated
6. Percentile calculated against other attempts

## 📈 Analytics & Reporting

### User Analytics
- Performance trends over time
- Topic-wise accuracy analysis
- Study time tracking
- Achievement and XP progression

### Platform Analytics
- Daily active users
- Content engagement metrics
- Test attempt patterns
- Growth and retention metrics

### Admin Dashboard
- Real-time platform statistics
- User management tools
- Content performance metrics
- Revenue and subscription analytics

## 🔐 Security Features

### Authentication
- Firebase Authentication integration
- Role-based access control (RBAC)
- Custom claims for permissions
- Session management

### Data Protection
- Comprehensive Firestore security rules
- Input validation and sanitization
- API rate limiting
- Audit logging for admin actions

### Content Security
- Test question security (answers hidden)
- User data privacy protection
- File upload restrictions
- XSS and injection prevention

## 🛠️ API Reference

### Cloud Functions

#### Authentication Functions
- `createUserProfile` - Auto-create user profile on signup
- `deleteUserData` - Clean up user data on deletion
- `updateLastActive` - Track user activity
- `setCustomClaims` - Manage user roles

#### Content Functions
- `getPlaylists` - Fetch playlists with filtering
- `enrollInPlaylist` - Enroll user in playlist
- `updateVideoProgress` - Track video watch progress
- `addBookmark` - Add video bookmarks

#### Test Functions
- `getMockTests` - Get available tests
- `startTestAttempt` - Begin test session
- `submitTestAnswer` - Submit individual answers
- `completeTestAttempt` - Finish and score test

#### YouTube Functions
- `importYouTubeVideo` - Import single video
- `importYouTubePlaylist` - Import entire playlist
- `searchYouTubeVideos` - Search for content
- `syncYouTubeVideoData` - Update video metadata

#### Admin Functions
- `manageCompany` - CRUD operations for companies
- `manageRoadmap` - CRUD operations for roadmaps
- `manageMockTest` - CRUD operations for tests
- `getAdminDashboard` - Admin analytics dashboard

### HTTP Endpoints

All functions are callable via HTTPS:
```
https://us-central1-aptiprep-learning-platform.cloudfunctions.net/functionName
```

## 📱 Frontend Integration

### Firebase SDK Setup
```javascript
import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

// Call a function
const getUserDashboard = httpsCallable(functions, 'getUserDashboard');
const result = await getUserDashboard();
```

### Authentication Integration
```javascript
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const auth = getAuth();
const provider = new GoogleAuthProvider();

// Sign in with Google
const result = await signInWithPopup(auth, provider);
```

## 🔄 Data Flow

### User Journey
1. **Authentication**: User signs up/logs in
2. **Profile Creation**: Auto-generated user profile
3. **Content Discovery**: Browse playlists and roadmaps
4. **Learning**: Watch videos, track progress
5. **Assessment**: Take mock tests
6. **Analytics**: View performance insights

### Content Management
1. **Import**: YouTube content imported via API
2. **Curation**: Admin reviews and organizes content
3. **Publishing**: Content made available to users
4. **Tracking**: Usage analytics collected
5. **Optimization**: Content improved based on data

## 🚨 Monitoring & Maintenance

### Error Tracking
- Cloud Functions error logging
- Performance monitoring
- User-reported issues tracking
- Automated alerting for critical errors

### Performance Optimization
- Database query optimization
- Function cold start reduction
- CDN for static assets
- Caching strategies

### Backup & Recovery
- Automated Firestore backups
- Point-in-time recovery
- Data export capabilities
- Disaster recovery procedures

## 📚 Additional Resources

### Documentation
- [Firebase Documentation](https://firebase.google.com/docs)
- [YouTube Data API](https://developers.google.com/youtube/v3)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

### Development Tools
- [Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite)
- [Firestore Rules Playground](https://firebase.google.com/docs/firestore/security/test-rules-emulator)
- [Cloud Functions Local Testing](https://firebase.google.com/docs/functions/local-emulator)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation and FAQs

---

Built with ❤️ for Aptiprep - Empowering competitive exam preparation through adaptive learning.
