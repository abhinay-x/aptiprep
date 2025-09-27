const functions = require('firebase-functions');
const { db } = require('../config/firebase');
const { FieldValue } = require('firebase-admin').firestore;

// Update user profile
exports.updateUserProfile = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { profile, preferences } = data;
  const userId = context.auth.uid;

  try {
    const updateData = {
      updatedAt: FieldValue.serverTimestamp()
    };

    if (profile) {
      updateData.profile = profile;
    }

    if (preferences) {
      updateData.preferences = preferences;
    }

    await db.collection('users').doc(userId).update(updateData);

    return { success: true, message: 'Profile updated successfully' };
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new functions.https.HttpsError('internal', 'Failed to update profile');
  }
});

// Get user dashboard data
exports.getUserDashboard = functions.region('us-central1').https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;

  try {
    // Get user profile
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'User profile not found');
    }

    const user = userDoc.data();

    // Get user progress
    const progressDoc = await db.collection('userProgress').doc(userId).get();
    const progress = progressDoc.exists ? progressDoc.data() : {};

    // Get recent test attempts
    const recentAttempts = await db.collection('testAttempts')
      .where('userId', '==', userId)
      .orderBy('startTime', 'desc')
      .limit(5)
      .get();

    const attempts = recentAttempts.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Calculate dashboard statistics
    const stats = {
      totalXP: user.gamification?.totalXP || 0,
      currentStreak: user.gamification?.currentStreak || 0,
      level: user.gamification?.level || 1,
      completedPlaylists: Object.keys(progress.playlists || {}).length,
      totalTestAttempts: attempts.length,
      averageScore: attempts.length > 0 
        ? attempts.reduce((sum, attempt) => sum + (attempt.results?.percentage || 0), 0) / attempts.length 
        : 0
    };

    return {
      user: {
        ...user,
        userId: userDoc.id
      },
      progress,
      recentAttempts: attempts,
      stats
    };
  } catch (error) {
    console.error('Error getting user dashboard:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get dashboard data');
  }
});

// Update user XP and achievements
exports.updateUserXP = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { xpGained, reason, achievementId } = data;
  const userId = context.auth.uid;

  if (!xpGained || xpGained <= 0) {
    throw new functions.https.HttpsError('invalid-argument', 'XP gained must be positive');
  }

  try {
    const userRef = db.collection('users').doc(userId);
    
    await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      
      if (!userDoc.exists) {
        throw new Error('User not found');
      }

      const userData = userDoc.data();
      const currentXP = userData.gamification?.totalXP || 0;
      const newTotalXP = currentXP + xpGained;
      
      // Calculate new level (every 1000 XP = 1 level)
      const newLevel = Math.floor(newTotalXP / 1000) + 1;
      const currentLevel = userData.gamification?.level || 1;

      const updateData = {
        'gamification.totalXP': newTotalXP,
        'gamification.level': newLevel,
        updatedAt: FieldValue.serverTimestamp()
      };

      // Add achievement if provided
      if (achievementId) {
        const currentAchievements = userData.gamification?.achievements || [];
        if (!currentAchievements.includes(achievementId)) {
          updateData['gamification.achievements'] = FieldValue.arrayUnion(achievementId);
        }
      }

      transaction.update(userRef, updateData);

      return {
        xpGained,
        newTotalXP,
        levelUp: newLevel > currentLevel,
        newLevel
      };
    });

    return { success: true, message: 'XP updated successfully' };
  } catch (error) {
    console.error('Error updating user XP:', error);
    throw new functions.https.HttpsError('internal', 'Failed to update XP');
  }
});

// Update study streak
exports.updateStudyStreak = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;

  try {
    const userRef = db.collection('users').doc(userId);
    
    await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      
      if (!userDoc.exists) {
        throw new Error('User not found');
      }

      const userData = userDoc.data();
      const lastActiveDate = userData.lastActiveAt?.toDate();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let currentStreak = userData.gamification?.currentStreak || 0;
      let longestStreak = userData.gamification?.longestStreak || 0;

      if (lastActiveDate) {
        const lastActiveDay = new Date(lastActiveDate);
        lastActiveDay.setHours(0, 0, 0, 0);
        
        const daysDiff = Math.floor((today - lastActiveDay) / (1000 * 60 * 60 * 24));

        if (daysDiff === 1) {
          // Consecutive day - increment streak
          currentStreak += 1;
        } else if (daysDiff > 1) {
          // Streak broken - reset to 1
          currentStreak = 1;
        }
        // If daysDiff === 0, same day - no change to streak
      } else {
        // First time - start streak
        currentStreak = 1;
      }

      // Update longest streak if current is higher
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }

      const updateData = {
        'gamification.currentStreak': currentStreak,
        'gamification.longestStreak': longestStreak,
        lastActiveAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      };

      transaction.update(userRef, updateData);

      return { currentStreak, longestStreak };
    });

    return { success: true, message: 'Streak updated successfully' };
  } catch (error) {
    console.error('Error updating study streak:', error);
    throw new functions.https.HttpsError('internal', 'Failed to update streak');
  }
});

// Get user leaderboard
exports.getLeaderboard = functions.https.onCall(async (data, context) => {
  const { type = 'xp', limit = 50 } = data;

  try {
    let query = db.collection('users');

    switch (type) {
      case 'xp':
        query = query.orderBy('gamification.totalXP', 'desc');
        break;
      case 'streak':
        query = query.orderBy('gamification.currentStreak', 'desc');
        break;
      case 'level':
        query = query.orderBy('gamification.level', 'desc');
        break;
      default:
        query = query.orderBy('gamification.totalXP', 'desc');
    }

    const snapshot = await query.limit(limit).get();
    
    const leaderboard = snapshot.docs.map((doc, index) => {
      const userData = doc.data();
      return {
        rank: index + 1,
        userId: doc.id,
        displayName: userData.displayName || 'Anonymous',
        photoURL: userData.photoURL || '',
        totalXP: userData.gamification?.totalXP || 0,
        level: userData.gamification?.level || 1,
        currentStreak: userData.gamification?.currentStreak || 0,
        badges: userData.gamification?.badges || []
      };
    });

    return { leaderboard };
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get leaderboard');
  }
});
