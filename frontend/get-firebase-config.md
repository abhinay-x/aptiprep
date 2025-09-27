# Get Firebase Configuration

To connect your frontend with Firebase, you need to get your Firebase project configuration values and update the `.env` file.

## Step 1: Get Firebase Configuration

1. **Go to Firebase Console**: https://console.firebase.google.com/project/aptiprep-99a54/overview

2. **Click on the Settings Gear Icon** (⚙️) in the left sidebar

3. **Select "Project settings"**

4. **Scroll down to "Your apps" section**

5. **If you don't have a web app yet:**
   - Click "Add app" button
   - Select the web icon (`</>`)
   - Enter app nickname: "Aptiprep Frontend"
   - Check "Also set up Firebase Hosting" (optional)
   - Click "Register app"

6. **Copy the Firebase configuration object** that looks like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyC...",
     authDomain: "aptiprep-99a54.firebaseapp.com",
     projectId: "aptiprep-99a54",
     storageBucket: "aptiprep-99a54.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef123456"
   };
   ```

## Step 2: Update .env File

Open `frontend/.env` and replace the placeholder values with your actual Firebase configuration:

```env
# Replace these with your actual values from Firebase Console
VITE_FIREBASE_API_KEY=AIzaSyC...  # Your actual API key
VITE_FIREBASE_AUTH_DOMAIN=aptiprep-99a54.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=aptiprep-99a54
VITE_FIREBASE_STORAGE_BUCKET=aptiprep-99a54.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789  # Your actual sender ID
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456  # Your actual app ID

# Optional: If you have Analytics enabled
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Step 3: Enable Authentication

1. **In Firebase Console**, go to "Authentication" in the left sidebar
2. **Click "Get started"** if not already enabled
3. **Go to "Sign-in method" tab**
4. **Enable the sign-in methods you want to use:**
   - Email/Password (recommended)
   - Google (optional)
   - Facebook (optional)

## Step 4: Set up Firestore Database

1. **In Firebase Console**, go to "Firestore Database"
2. **Click "Create database"** if not already created
3. **Choose "Start in test mode"** for now (you already have security rules)
4. **Select a location** (choose closest to your users)

## Step 5: Test the Connection

After updating the `.env` file:

1. **Restart your development server:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Check the browser console** for any Firebase configuration errors

3. **Try to sign up/login** to test the authentication

## Troubleshooting

### Common Issues:

1. **"Firebase: Error (auth/api-key-not-valid)"**
   - Make sure you copied the correct API key from Firebase Console
   - Ensure there are no extra spaces or characters

2. **"Firebase: No Firebase App '[DEFAULT]' has been created"**
   - Check that all required environment variables are set
   - Restart your development server after updating .env

3. **CORS errors**
   - Make sure your domain is added to Firebase Authentication authorized domains
   - Go to Authentication > Settings > Authorized domains

### Environment Variables Not Loading?

If Vite isn't loading your environment variables:

1. **Make sure the .env file is in the frontend root directory**
2. **Restart the development server completely**
3. **Check that variables start with `VITE_`**
4. **Verify no syntax errors in .env file**

## Security Note

- **Never commit your .env file to version control**
- **Add .env to your .gitignore file**
- **Use different Firebase projects for development and production**
