const functions = require('firebase-functions');
const { db } = require('../config/firebase');
const { FieldValue } = require('firebase-admin').firestore;

// Get playlists with filtering and pagination
exports.getPlaylists = functions.https.onCall(async (data, context) => {
  const { 
    category, 
    level, 
    limit = 20, 
    startAfter, 
    searchQuery 
  } = data;

  try {
    let query = db.collection('playlists').where('isPublic', '==', true);

    // Apply filters
    if (category) {
      query = query.where('category', '==', category);
    }

    if (level) {
      query = query.where('level', '==', level);
    }

    // Apply search if provided
    if (searchQuery) {
      // Note: Firestore doesn't support full-text search natively
      // This is a basic implementation - consider using Algolia for better search
      query = query.where('title', '>=', searchQuery)
                   .where('title', '<=', searchQuery + '\uf8ff');
    }

    // Order by creation date
    query = query.orderBy('createdAt', 'desc');

    // Apply pagination
    if (startAfter) {
      const startAfterDoc = await db.collection('playlists').doc(startAfter).get();
      query = query.startAfter(startAfterDoc);
    }

    query = query.limit(limit);

    const snapshot = await query.get();
    
    const playlists = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { 
      playlists,
      hasMore: snapshot.docs.length === limit,
      lastDoc: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1].id : null
    };
  } catch (error) {
    console.error('Error getting playlists:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get playlists');
  }
});

// Get playlist details with user progress
exports.getPlaylistDetails = functions.https.onCall(async (data, context) => {
  const { playlistId } = data;

  if (!playlistId) {
    throw new functions.https.HttpsError('invalid-argument', 'Playlist ID is required');
  }

  try {
    const playlistDoc = await db.collection('playlists').doc(playlistId).get();
    
    if (!playlistDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Playlist not found');
    }

    const playlist = {
      id: playlistDoc.id,
      ...playlistDoc.data()
    };

    // Get user progress if authenticated
    let userProgress = null;
    if (context.auth) {
      const progressDoc = await db.collection('userProgress').doc(context.auth.uid).get();
      if (progressDoc.exists) {
        const progressData = progressDoc.data();
        userProgress = progressData.playlists?.[playlistId] || null;
      }
    }

    return { 
      playlist,
      userProgress
    };
  } catch (error) {
    console.error('Error getting playlist details:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get playlist details');
  }
});

// Enroll user in playlist
exports.enrollInPlaylist = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { playlistId } = data;
  const userId = context.auth.uid;

  if (!playlistId) {
    throw new functions.https.HttpsError('invalid-argument', 'Playlist ID is required');
  }

  try {
    // Check if playlist exists and is public
    const playlistDoc = await db.collection('playlists').doc(playlistId).get();
    
    if (!playlistDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Playlist not found');
    }

    const playlist = playlistDoc.data();
    
    if (!playlist.isPublic) {
      throw new functions.https.HttpsError('permission-denied', 'Playlist is not public');
    }

    // Initialize user progress for playlist
    const enrollmentData = {
      playlistId: playlistId,
      enrolledAt: FieldValue.serverTimestamp(),
      lastWatchedAt: null,
      progress: {
        videosCompleted: 0,
        totalVideos: playlist.totalVideos || 0,
        percentageCompleted: 0,
        totalWatchTime: 0
      },
      videos: {},
      notes: []
    };

    // Update user progress document
    await db.collection('userProgress').doc(userId).update({
      [`playlists.${playlistId}`]: enrollmentData,
      updatedAt: FieldValue.serverTimestamp()
    });

    // Update playlist enrollment count
    await db.collection('playlists').doc(playlistId).update({
      'stats.enrolledUsers': FieldValue.increment(1)
    });

    return { success: true, message: 'Successfully enrolled in playlist' };
  } catch (error) {
    console.error('Error enrolling in playlist:', error);
    throw new functions.https.HttpsError('internal', 'Failed to enroll in playlist');
  }
});

// Update video progress
exports.updateVideoProgress = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { playlistId, videoId, watchTime, isCompleted } = data;
  const userId = context.auth.uid;

  if (!playlistId || !videoId) {
    throw new functions.https.HttpsError('invalid-argument', 'Playlist ID and Video ID are required');
  }

  try {
    const progressRef = db.collection('userProgress').doc(userId);
    
    await db.runTransaction(async (transaction) => {
      const progressDoc = await transaction.get(progressRef);
      
      if (!progressDoc.exists) {
        throw new Error('User progress not found');
      }

      const progressData = progressDoc.data();
      const playlistProgress = progressData.playlists?.[playlistId];

      if (!playlistProgress) {
        throw new Error('User not enrolled in playlist');
      }

      // Update video progress
      const videoProgress = {
        videoId: videoId,
        watchTime: watchTime || 0,
        isCompleted: isCompleted || false,
        lastWatchedAt: FieldValue.serverTimestamp()
      };

      if (isCompleted && !playlistProgress.videos[videoId]?.isCompleted) {
        videoProgress.completedAt = FieldValue.serverTimestamp();
      }

      // Calculate updated playlist progress
      const updatedVideos = {
        ...playlistProgress.videos,
        [videoId]: videoProgress
      };

      const completedCount = Object.values(updatedVideos).filter(v => v.isCompleted).length;
      const totalVideos = playlistProgress.progress.totalVideos;
      const percentageCompleted = totalVideos > 0 ? Math.round((completedCount / totalVideos) * 100) : 0;

      const updateData = {
        [`playlists.${playlistId}.videos.${videoId}`]: videoProgress,
        [`playlists.${playlistId}.progress.videosCompleted`]: completedCount,
        [`playlists.${playlistId}.progress.percentageCompleted`]: percentageCompleted,
        [`playlists.${playlistId}.lastWatchedAt`]: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      };

      transaction.update(progressRef, updateData);

      return { completedCount, percentageCompleted };
    });

    // Award XP for video completion
    if (isCompleted) {
      // Call updateUserXP function (you might want to implement this as a separate transaction)
      // await updateUserXP({ xpGained: 50, reason: 'video_completion' }, context);
    }

    return { success: true, message: 'Video progress updated successfully' };
  } catch (error) {
    console.error('Error updating video progress:', error);
    throw new functions.https.HttpsError('internal', 'Failed to update video progress');
  }
});

// Add bookmark
exports.addBookmark = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { videoId, timestamp, note } = data;
  const userId = context.auth.uid;

  if (!videoId || timestamp === undefined) {
    throw new functions.https.HttpsError('invalid-argument', 'Video ID and timestamp are required');
  }

  try {
    const bookmark = {
      videoId: videoId,
      timestamp: timestamp,
      note: note || '',
      createdAt: FieldValue.serverTimestamp()
    };

    await db.collection('userProgress').doc(userId).update({
      bookmarks: FieldValue.arrayUnion(bookmark),
      updatedAt: FieldValue.serverTimestamp()
    });

    return { success: true, message: 'Bookmark added successfully' };
  } catch (error) {
    console.error('Error adding bookmark:', error);
    throw new functions.https.HttpsError('internal', 'Failed to add bookmark');
  }
});

// Get user bookmarks
exports.getUserBookmarks = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;

  try {
    const progressDoc = await db.collection('userProgress').doc(userId).get();
    
    if (!progressDoc.exists) {
      return { bookmarks: [] };
    }

    const progressData = progressDoc.data();
    const bookmarks = progressData.bookmarks || [];

    return { bookmarks };
  } catch (error) {
    console.error('Error getting user bookmarks:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get bookmarks');
  }
});
