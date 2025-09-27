const functions = require('firebase-functions');
const { db, auth } = require('../config/firebase');
const { FieldValue } = require('firebase-admin').firestore;

// Create user profile on first sign up
exports.createUserProfile = functions.auth.user().onCreate(async (user) => {
  try {
    const userProfile = {
      userId: user.uid,
      email: user.email,
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      role: 'student', // Default role
      profile: {
        fullName: user.displayName || '',
        phone: '',
        college: '',
        graduationYear: null,
        targetCompanies: [],
        goals: [],
        bio: ''
      },
      preferences: {
        theme: 'light',
        notifications: true,
        emailUpdates: true,
        studyReminders: true,
        language: 'en'
      },
      gamification: {
        totalXP: 0,
        currentStreak: 0,
        longestStreak: 0,
        level: 1,
        badges: [],
        achievements: []
      },
      subscription: {
        plan: 'free',
        startDate: FieldValue.serverTimestamp(),
        endDate: null,
        autoRenew: false
      },
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      lastActiveAt: FieldValue.serverTimestamp()
    };

    // Create user document
    await db.collection('users').doc(user.uid).set(userProfile);

    // Initialize user progress document
    const userProgress = {
      userId: user.uid,
      playlists: {},
      roadmaps: {},
      achievements: [],
      bookmarks: []
    };

    await db.collection('userProgress').doc(user.uid).set(userProgress);

    console.log(`User profile created for ${user.email}`);
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
});

// Clean up user data on account deletion
exports.deleteUserData = functions.auth.user().onDelete(async (user) => {
  try {
    const batch = db.batch();

    // Delete user profile
    batch.delete(db.collection('users').doc(user.uid));

    // Delete user progress
    batch.delete(db.collection('userProgress').doc(user.uid));

    // Delete user test attempts
    const testAttempts = await db.collection('testAttempts')
      .where('userId', '==', user.uid)
      .get();

    testAttempts.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Delete user notifications
    const notifications = await db.collection('notifications')
      .doc(user.uid)
      .collection('items')
      .get();

    notifications.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    console.log(`User data deleted for ${user.uid}`);
  } catch (error) {
    console.error('Error deleting user data:', error);
    throw error;
  }
});

// Update user last active timestamp
exports.updateLastActive = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    await db.collection('users').doc(context.auth.uid).update({
      lastActiveAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating last active:', error);
    throw new functions.https.HttpsError('internal', 'Failed to update last active');
  }
});

// Custom claims for role-based access
exports.setCustomClaims = functions.https.onCall(async (data, context) => {
  // Only admins can set custom claims
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can set custom claims');
  }

  const { uid, role } = data;

  if (!uid || !role) {
    throw new functions.https.HttpsError('invalid-argument', 'UID and role are required');
  }

  try {
    // Set custom claims
    await auth.setCustomUserClaims(uid, { role });

    // Update user document
    await db.collection('users').doc(uid).update({
      role: role,
      updatedAt: FieldValue.serverTimestamp()
    });

    return { success: true, message: `Role ${role} assigned to user ${uid}` };
  } catch (error) {
    console.error('Error setting custom claims:', error);
    throw new functions.https.HttpsError('internal', 'Failed to set custom claims');
  }
});
