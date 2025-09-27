import { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { auth, db, functions } from '../config/firebase';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize Google and Facebook providers
  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();

  // Sign up with email and password
  async function signup(email, password, userData) {
    try {
      setError(null);
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name
      await updateProfile(user, {
        displayName: `${userData.firstName} ${userData.lastName}`
      });

      // The user profile will be created automatically by the backend Cloud Function
      // But we can also create it here for immediate access
      const userDoc = {
        userId: user.uid,
        email: user.email,
        displayName: `${userData.firstName} ${userData.lastName}`,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'student',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, 'users', user.uid), userDoc);
      
      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }

  // Sign in with email and password
  async function login(email, password) {
    try {
      setError(null);
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last active
      const updateLastActive = httpsCallable(functions, 'updateLastActive');
      await updateLastActive();
      
      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }

  // Sign in with Google
  async function signInWithGoogle() {
    try {
      setError(null);
      const { user } = await signInWithPopup(auth, googleProvider);
      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }

  // Sign in with Facebook
  async function signInWithFacebook() {
    try {
      setError(null);
      const { user } = await signInWithPopup(auth, facebookProvider);
      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }

  // Sign out
  async function logout() {
    try {
      setError(null);
      await signOut(auth);
      setUserProfile(null);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }

  // Get user profile from Firestore
  async function getUserProfile(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  // Check if user is admin
  function isAdmin() {
    return userProfile?.role === 'admin';
  }

  // Check if user is instructor
  function isInstructor() {
    return userProfile?.role === 'instructor' || userProfile?.role === 'admin';
  }

  // Check if user has specific role
  function hasRole(role) {
    return userProfile?.role === role;
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Fetch user profile
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    signup,
    login,
    signInWithGoogle,
    signInWithFacebook,
    logout,
    isAdmin,
    isInstructor,
    hasRole,
    getUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
