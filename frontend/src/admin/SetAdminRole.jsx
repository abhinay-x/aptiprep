import { useState } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

export default function SetAdminRole() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const setAdminRole = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('You must be logged in first');
      }

      await setDoc(
        doc(db, 'users', user.uid),
        {
          displayName: user.displayName || 'Platform Admin',
          email: user.email || 'admin@yourdomain.com',
          role: 'admin',
          photoURL: user.photoURL || '',
          createdAt: serverTimestamp(),
          isActive: true
        },
        { merge: true }
      );

      setSuccess(true);
      console.log('Admin role set for user:', user.uid);
    } catch (err) {
      setError(err.message || 'Failed to set admin role');
      console.error('Error setting admin role:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Set Admin Role
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
          Click the button below to set your current user as an admin. This is required to access admin features.
        </p>

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm">✅ Admin role set successfully! You can now access admin features.</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">❌ {error}</p>
          </div>
        )}

        <button
          onClick={setAdminRole}
          disabled={loading || success}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Setting Admin Role...' : success ? 'Admin Role Set ✓' : 'Set Admin Role'}
        </button>

        {success && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-700 text-sm">
              💡 <strong>Next steps:</strong>
              <br />1. Sign out and sign back in
              <br />2. Try accessing admin features again
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
