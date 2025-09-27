import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);

      // Check admin by custom claim first, then fallback to users collection role
      const idTokenResult = await cred.user.getIdTokenResult(true);
      const isAdminClaim = !!idTokenResult.claims.admin;

      let isAdminDoc = false;
      try {
        const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
        isAdminDoc = userDoc.exists() && (userDoc.data().role === 'admin');
      } catch (_) {
        // ignore users doc errors
      }

      if (isAdminClaim || isAdminDoc) {
        const redirectTo = (location.state && location.state.from && location.state.from.pathname) || '/admin/dashboard';
        navigate(redirectTo, { replace: true });
      } else {
        // Not an admin: sign out and show error
        await signOut(auth);
        setError('This account is not authorized for admin access.');
      }
    } catch (err) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-primary p-4">
      <div className="w-full max-w-md bg-white dark:bg-dark-card rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">Admin Login</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Sign in to manage the platform</p>
        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-dark-primary text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@yourdomain.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-dark-primary text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
