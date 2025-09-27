# Firebase Setup Guide for Aptiprep Frontend

## Prerequisites

1. **Firebase Project**: Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. **Firebase Services**: Enable Authentication, Firestore, and Cloud Functions
3. **Node.js**: Ensure you have Node.js 18+ installed

## Setup Steps

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Firebase Configuration

1. Go to your Firebase project settings
2. Click on "Web app" and register your app
3. Copy the Firebase configuration object
4. Update `src/config/firebase.js` with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 3. Authentication Setup

1. In Firebase Console, go to Authentication > Sign-in method
2. Enable the following providers:
   - Email/Password
   - Google (optional)
   - Facebook (optional)

3. Add your domain to authorized domains:
   - `localhost` (for development)
   - Your production domain

### 4. Firestore Setup

1. Go to Firestore Database in Firebase Console
2. Create database in production mode
3. The backend Cloud Functions will handle security rules

### 5. Development

```bash
# Start the development server
npm run dev
```

### 6. Testing Authentication

1. Navigate to `http://localhost:5173/signup`
2. Create a new account
3. You should be automatically logged in and redirected to `/dashboard`
4. Try logging out and logging back in

## Features Available

### For All Users (Students)
- **Signup/Login**: Email/password and social authentication
- **Dashboard**: Personal learning dashboard with progress tracking
- **Courses**: Browse and enroll in learning playlists
- **Practice**: Solve practice questions
- **Tests**: Take mock tests and view results
- **Analytics**: View personal performance analytics

### For Admin Users
- **Admin Dashboard**: Platform analytics and management
- **User Management**: View and manage user accounts
- **Content Management**: Add and manage learning content
- **Test Management**: Create and manage mock tests

## User Roles

The system supports three user roles:

1. **Student** (default): Access to learning features
2. **Instructor**: Can create and manage content
3. **Admin**: Full access to all features and admin dashboard

## Protected Routes

- `/dashboard` - Requires authentication
- `/courses` - Requires authentication
- `/practice` - Requires authentication
- `/tests` - Requires authentication
- `/analytics` - Requires authentication
- `/admin/dashboard` - Requires admin role

## Public Routes

- `/` - Home page
- `/login` - Login page (redirects to dashboard if already logged in)
- `/signup` - Signup page (redirects to dashboard if already logged in)

## Troubleshooting

### Common Issues

1. **Firebase not initialized**: Make sure you've updated the config in `firebase.js`
2. **Authentication errors**: Check that Email/Password is enabled in Firebase Console
3. **Permission denied**: Ensure Firestore security rules are deployed from the backend
4. **Social login not working**: Configure OAuth providers in Firebase Console

### Error Messages

- `Firebase: Error (auth/user-not-found)`: User doesn't exist, try signing up
- `Firebase: Error (auth/wrong-password)`: Incorrect password
- `Firebase: Error (auth/email-already-in-use)`: Email already registered
- `Firebase: Error (auth/weak-password)`: Password should be at least 6 characters

## Next Steps

1. Deploy the Firebase backend functions (see backend/README.md)
2. Seed the database with sample content
3. Configure your production domain in Firebase Console
4. Set up monitoring and analytics

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify Firebase configuration
3. Ensure backend functions are deployed
4. Check Firebase Console for authentication and database activity
