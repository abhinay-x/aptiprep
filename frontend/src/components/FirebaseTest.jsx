import { useState, useEffect } from 'react';
import { auth, db, getFirebaseConfig } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const FirebaseTest = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [config, setConfig] = useState(null);

  useEffect(() => {
    // Check Firebase configuration
    const firebaseConfig = getFirebaseConfig();
    setConfig(firebaseConfig);

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const testSignUp = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const testEmail = `test-${Date.now()}@example.com`;
      const testPassword = 'testpassword123';

      const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
      
      // Test Firestore write
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: testEmail,
        createdAt: new Date(),
        testUser: true
      });

      setSuccess(`✅ Successfully created test user: ${testEmail}`);
    } catch (err) {
      setError(`❌ Sign up failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testSignIn = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Try to sign in with a test account
      const testEmail = 'admin@aptiprep.co.in';
      const testPassword = 'admin123';

      const userCredential = await signInWithEmailAndPassword(auth, testEmail, testPassword);
      
      // Test Firestore read
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      setSuccess(`✅ Successfully signed in: ${testEmail}`);
      if (userDoc.exists()) {
        setSuccess(prev => prev + '\n✅ Firestore read successful');
      }
    } catch (err) {
      setError(`❌ Sign in failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testSignOut = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await signOut(auth);
      setSuccess('✅ Successfully signed out');
    } catch (err) {
      setError(`❌ Sign out failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const configStatus = () => {
    if (!config) return '⏳ Loading configuration...';
    
    const issues = [];
    if (!config.apiKey || config.apiKey === 'NOT_SET') issues.push('API Key');
    if (!config.authDomain) issues.push('Auth Domain');
    if (!config.projectId) issues.push('Project ID');
    if (!config.storageBucket) issues.push('Storage Bucket');
    if (!config.messagingSenderId) issues.push('Messaging Sender ID');
    if (!config.appId) issues.push('App ID');

    if (issues.length > 0) {
      return `❌ Missing configuration: ${issues.join(', ')}`;
    }
    return '✅ Firebase configuration looks good';
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-dark-card rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-primary-900 dark:text-dark-text-primary mb-6">
        🔥 Firebase Connection Test
      </h2>

      {/* Configuration Status */}
      <div className="mb-6 p-4 bg-primary-50 dark:bg-dark-secondary rounded-lg">
        <h3 className="font-semibold text-primary-900 dark:text-dark-text-primary mb-2">
          Configuration Status
        </h3>
        <p className="text-sm text-primary-700 dark:text-dark-text-secondary">
          {configStatus()}
        </p>
        {config && (
          <div className="mt-2 text-xs text-primary-600 dark:text-dark-text-secondary">
            <p>Project ID: {config.projectId || 'NOT_SET'}</p>
            <p>Auth Domain: {config.authDomain || 'NOT_SET'}</p>
            <p>API Key: {config.apiKey}</p>
          </div>
        )}
      </div>

      {/* Current User */}
      {user && (
        <div className="mb-6 p-4 bg-success-50 dark:bg-success-900/20 rounded-lg">
          <h3 className="font-semibold text-success-800 dark:text-success-300 mb-2">
            Current User
          </h3>
          <p className="text-sm text-success-700 dark:text-success-400">
            Email: {user.email}
          </p>
          <p className="text-sm text-success-700 dark:text-success-400">
            UID: {user.uid}
          </p>
        </div>
      )}

      {/* Test Buttons */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={testSignUp}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? '⏳' : '📝'} Test Sign Up
          </button>
          
          <button
            onClick={testSignIn}
            disabled={loading}
            className="btn-outline"
          >
            {loading ? '⏳' : '🔑'} Test Sign In
          </button>
          
          <button
            onClick={testSignOut}
            disabled={loading || !user}
            className="btn-outline"
          >
            {loading ? '⏳' : '🚪'} Test Sign Out
          </button>
        </div>

        {/* Results */}
        {error && (
          <div className="p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
            <pre className="text-sm text-error-700 dark:text-error-300 whitespace-pre-wrap">
              {error}
            </pre>
          </div>
        )}

        {success && (
          <div className="p-4 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-lg">
            <pre className="text-sm text-success-700 dark:text-success-300 whitespace-pre-wrap">
              {success}
            </pre>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
          📋 Instructions
        </h3>
        <ol className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-decimal list-inside">
          <li>Check that your Firebase configuration is properly set in the .env file</li>
          <li>Make sure Firebase Authentication is enabled in your Firebase Console</li>
          <li>Verify that Firestore Database is created and accessible</li>
          <li>Test each function to ensure your Firebase connection is working</li>
        </ol>
      </div>
    </div>
  );
};

export default FirebaseTest;
