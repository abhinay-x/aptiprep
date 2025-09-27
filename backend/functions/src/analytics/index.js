const functions = require('firebase-functions');
const { db } = require('../config/firebase');
const { FieldValue } = require('firebase-admin').firestore;

// Calculate and update test percentiles (triggered when test attempt is created)
exports.calculateTestPercentiles = functions.firestore
  .document('testAttempts/{attemptId}')
  .onCreate(async (snap, context) => {
    const attemptData = snap.data();
    
    if (attemptData.status !== 'completed') {
      return null;
    }

    try {
      const testId = attemptData.testId;
      const userScore = attemptData.results?.score || 0;

      // Get all completed attempts for this test
      const allAttempts = await db.collection('testAttempts')
        .where('testId', '==', testId)
        .where('status', '==', 'completed')
        .get();

      const scores = allAttempts.docs.map(doc => doc.data().results?.score || 0);
      scores.sort((a, b) => a - b);

      // Calculate percentile
      const rank = scores.filter(score => score < userScore).length;
      const percentile = scores.length > 1 ? Math.round((rank / (scores.length - 1)) * 100) : 50;

      // Update the attempt with percentile
      await snap.ref.update({
        'results.percentile': percentile,
        updatedAt: FieldValue.serverTimestamp()
      });

      console.log(`Updated percentile for attempt ${context.params.attemptId}: ${percentile}`);
      return null;
    } catch (error) {
      console.error('Error calculating percentiles:', error);
      return null;
    }
  });

// Update user progress and XP when video is completed
exports.updateUserProgress = functions.firestore
  .document('userProgress/{userId}')
  .onUpdate(async (change, context) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();
    const userId = context.params.userId;

    try {
      // Check for video completions
      const beforePlaylists = beforeData.playlists || {};
      const afterPlaylists = afterData.playlists || {};

      let xpGained = 0;
      const achievements = [];

      // Check each playlist for new video completions
      for (const playlistId in afterPlaylists) {
        const beforePlaylist = beforePlaylists[playlistId];
        const afterPlaylist = afterPlaylists[playlistId];

        if (!beforePlaylist || !afterPlaylist) continue;

        const beforeVideos = beforePlaylist.videos || {};
        const afterVideos = afterPlaylist.videos || {};

        // Check for newly completed videos
        for (const videoId in afterVideos) {
          const beforeVideo = beforeVideos[videoId];
          const afterVideo = afterVideos[videoId];

          if (!beforeVideo?.isCompleted && afterVideo?.isCompleted) {
            xpGained += 50; // 50 XP per video completion
          }
        }

        // Check for playlist completion
        const beforeCompleted = beforePlaylist.progress?.percentageCompleted || 0;
        const afterCompleted = afterPlaylist.progress?.percentageCompleted || 0;

        if (beforeCompleted < 100 && afterCompleted >= 100) {
          xpGained += 200; // 200 XP for playlist completion
          achievements.push('playlist-completion');
        }
      }

      // Update user XP and achievements if any gained
      if (xpGained > 0) {
        const userRef = db.collection('users').doc(userId);
        
        await db.runTransaction(async (transaction) => {
          const userDoc = await transaction.get(userRef);
          
          if (!userDoc.exists) return;

          const userData = userDoc.data();
          const currentXP = userData.gamification?.totalXP || 0;
          const newTotalXP = currentXP + xpGained;
          const newLevel = Math.floor(newTotalXP / 1000) + 1;
          const currentLevel = userData.gamification?.level || 1;

          const updateData = {
            'gamification.totalXP': newTotalXP,
            'gamification.level': newLevel,
            updatedAt: FieldValue.serverTimestamp()
          };

          // Add new achievements
          if (achievements.length > 0) {
            const currentAchievements = userData.gamification?.achievements || [];
            const newAchievements = achievements.filter(a => !currentAchievements.includes(a));
            if (newAchievements.length > 0) {
              updateData['gamification.achievements'] = FieldValue.arrayUnion(...newAchievements);
            }
          }

          transaction.update(userRef, updateData);

          console.log(`Updated XP for user ${userId}: +${xpGained} (Total: ${newTotalXP})`);
        });
      }

      return null;
    } catch (error) {
      console.error('Error updating user progress:', error);
      return null;
    }
  });

// Generate platform analytics (scheduled function)
exports.generatePlatformAnalytics = functions.pubsub
  .schedule('0 2 * * *') // Run daily at 2 AM
  .onRun(async (context) => {
    try {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      const todayStart = new Date(today);
      todayStart.setHours(0, 0, 0, 0);

      // Get daily statistics
      const [
        totalUsers,
        activeUsers,
        newUsers,
        testAttempts,
        videoViews,
        playlistEnrollments
      ] = await Promise.all([
        // Total users
        db.collection('users').get().then(snap => snap.size),
        
        // Active users (logged in yesterday)
        db.collection('users')
          .where('lastActiveAt', '>=', yesterday)
          .where('lastActiveAt', '<', todayStart)
          .get()
          .then(snap => snap.size),
        
        // New users (created yesterday)
        db.collection('users')
          .where('createdAt', '>=', yesterday)
          .where('createdAt', '<', todayStart)
          .get()
          .then(snap => snap.size),
        
        // Test attempts yesterday
        db.collection('testAttempts')
          .where('startTime', '>=', yesterday)
          .where('startTime', '<', todayStart)
          .get()
          .then(snap => snap.size),
        
        // Video progress updates (approximate video views)
        db.collection('userProgress')
          .where('updatedAt', '>=', yesterday)
          .where('updatedAt', '<', todayStart)
          .get()
          .then(snap => snap.size),
        
        // New playlist enrollments
        db.collection('userProgress')
          .where('updatedAt', '>=', yesterday)
          .where('updatedAt', '<', todayStart)
          .get()
          .then(snap => {
            // This is a simplified count - in reality, you'd need to check for new playlist enrollments
            return snap.size;
          })
      ]);

      // Calculate engagement metrics
      const engagementRate = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;

      // Save analytics data
      const analyticsData = {
        date: yesterday,
        metrics: {
          totalUsers,
          activeUsers,
          newUsers,
          testAttempts,
          videoViews,
          playlistEnrollments,
          engagementRate
        },
        createdAt: FieldValue.serverTimestamp()
      };

      await db.collection('analytics').doc(yesterday.toISOString().split('T')[0]).set(analyticsData);

      console.log('Daily analytics generated successfully');
      return null;
    } catch (error) {
      console.error('Error generating platform analytics:', error);
      return null;
    }
  });

// Get platform analytics
exports.getPlatformAnalytics = functions.https.onCall(async (data, context) => {
  // Only admins can access platform analytics
  if (!context.auth || context.auth.token?.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can access platform analytics');
  }

  const { startDate, endDate, period = 'daily' } = data;

  try {
    let query = db.collection('analytics');

    if (startDate) {
      query = query.where('date', '>=', new Date(startDate));
    }

    if (endDate) {
      query = query.where('date', '<=', new Date(endDate));
    }

    query = query.orderBy('date', 'desc').limit(100);

    const snapshot = await query.get();
    
    const analytics = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate().toISOString().split('T')[0]
    }));

    // Calculate summary statistics
    const summary = {
      totalUsers: analytics.length > 0 ? analytics[0].metrics.totalUsers : 0,
      avgDailyActiveUsers: analytics.length > 0 
        ? Math.round(analytics.reduce((sum, day) => sum + day.metrics.activeUsers, 0) / analytics.length)
        : 0,
      totalTestAttempts: analytics.reduce((sum, day) => sum + day.metrics.testAttempts, 0),
      totalVideoViews: analytics.reduce((sum, day) => sum + day.metrics.videoViews, 0),
      avgEngagementRate: analytics.length > 0
        ? Math.round(analytics.reduce((sum, day) => sum + day.metrics.engagementRate, 0) / analytics.length)
        : 0
    };

    return { 
      analytics,
      summary,
      period: analytics.length
    };
  } catch (error) {
    console.error('Error getting platform analytics:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get platform analytics');
  }
});

// Get user analytics
exports.getUserAnalytics = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;

  try {
    // Get user's test attempts
    const testAttempts = await db.collection('testAttempts')
      .where('userId', '==', userId)
      .orderBy('startTime', 'desc')
      .limit(50)
      .get();

    const attempts = testAttempts.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      startTime: doc.data().startTime.toDate(),
      endTime: doc.data().endTime?.toDate()
    }));

    // Calculate performance trends
    const performanceTrend = attempts.map(attempt => ({
      date: attempt.startTime.toISOString().split('T')[0],
      score: attempt.results?.percentage || 0,
      testTitle: attempt.testId // You might want to join with test data
    }));

    // Calculate topic-wise performance
    const topicPerformance = {};
    attempts.forEach(attempt => {
      if (attempt.results?.topicWise) {
        Object.entries(attempt.results.topicWise).forEach(([topic, data]) => {
          if (!topicPerformance[topic]) {
            topicPerformance[topic] = { attempts: 0, totalAccuracy: 0 };
          }
          topicPerformance[topic].attempts++;
          topicPerformance[topic].totalAccuracy += data.accuracy;
        });
      }
    });

    // Calculate average accuracy per topic
    Object.keys(topicPerformance).forEach(topic => {
      const data = topicPerformance[topic];
      data.averageAccuracy = Math.round(data.totalAccuracy / data.attempts);
    });

    // Get user progress data
    const progressDoc = await db.collection('userProgress').doc(userId).get();
    const progress = progressDoc.exists ? progressDoc.data() : {};

    const analytics = {
      testPerformance: {
        totalAttempts: attempts.length,
        averageScore: attempts.length > 0 
          ? Math.round(attempts.reduce((sum, a) => sum + (a.results?.percentage || 0), 0) / attempts.length)
          : 0,
        bestScore: attempts.length > 0 
          ? Math.max(...attempts.map(a => a.results?.percentage || 0))
          : 0,
        recentTrend: performanceTrend.slice(0, 10)
      },
      topicPerformance,
      studyProgress: {
        enrolledPlaylists: Object.keys(progress.playlists || {}).length,
        completedPlaylists: Object.values(progress.playlists || {})
          .filter(p => p.progress?.percentageCompleted >= 100).length,
        totalWatchTime: Object.values(progress.playlists || {})
          .reduce((sum, p) => sum + (p.progress?.totalWatchTime || 0), 0)
      }
    };

    return { analytics };
  } catch (error) {
    console.error('Error getting user analytics:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get user analytics');
  }
});
