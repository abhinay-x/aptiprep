const functions = require('firebase-functions');
const { db } = require('../config/firebase');
const { YouTubeService } = require('../config/youtube');
const { FieldValue } = require('firebase-admin').firestore;

const youtubeService = new YouTubeService();

// Import single YouTube video
exports.importYouTubeVideo = functions.https.onCall(async (data, context) => {
  // Only admins and instructors can import videos
  if (!context.auth || !['admin', 'instructor'].includes(context.auth.token?.role)) {
    throw new functions.https.HttpsError('permission-denied', 'Only admins and instructors can import videos');
  }

  const { youtubeId, category, subcategory, level, tags } = data;

  if (!youtubeId) {
    throw new functions.https.HttpsError('invalid-argument', 'YouTube video ID is required');
  }

  try {
    // Get video details from YouTube API
    const videoData = await youtubeService.getVideoDetails(youtubeId);

    // Create video document
    const videoDoc = {
      ...videoData,
      category: category || 'general',
      subcategory: subcategory || '',
      level: level || 'beginner',
      tags: tags || [],
      instructor: {
        name: videoData.channelTitle,
        channelId: videoData.channelId
      },
      content: {
        topics: [],
        learningObjectives: []
      },
      resources: {
        notes: [],
        practiceQuestions: []
      },
      stats: {
        views: 0,
        likes: 0,
        dislikes: 0,
        averageWatchTime: 0,
        completionRate: 0
      },
      isActive: true,
      createdBy: context.auth.uid,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    };

    // Save to Firestore
    const videoRef = await db.collection('videos').add(videoDoc);

    return { 
      success: true, 
      videoId: videoRef.id,
      message: 'Video imported successfully' 
    };
  } catch (error) {
    console.error('Error importing YouTube video:', error);
    throw new functions.https.HttpsError('internal', 'Failed to import video');
  }
});

// Import YouTube playlist
exports.importYouTubePlaylist = functions.https.onCall(async (data, context) => {
  // Only admins and instructors can import playlists
  if (!context.auth || !['admin', 'instructor'].includes(context.auth.token?.role)) {
    throw new functions.https.HttpsError('permission-denied', 'Only admins and instructors can import playlists');
  }

  const { 
    youtubePlaylistId, 
    title, 
    description, 
    category, 
    subcategory, 
    level, 
    tags,
    instructorInfo
  } = data;

  if (!youtubePlaylistId) {
    throw new functions.https.HttpsError('invalid-argument', 'YouTube playlist ID is required');
  }

  try {
    // Get playlist videos from YouTube API
    const videos = await youtubeService.getPlaylistItems(youtubePlaylistId);

    if (videos.length === 0) {
      throw new functions.https.HttpsError('not-found', 'No videos found in playlist');
    }

    // Create playlist document
    const playlistDoc = {
      playlistId: '', // Will be set after creation
      title: title || `Imported Playlist - ${Date.now()}`,
      description: description || '',
      thumbnail: videos[0]?.thumbnail?.high || '',
      category: category || 'general',
      subcategory: subcategory || '',
      level: level || 'beginner',
      tags: tags || [],
      videos: [],
      totalVideos: videos.length,
      totalDuration: videos.reduce((sum, video) => sum + video.duration, 0),
      instructor: instructorInfo || {
        name: videos[0]?.channelTitle || 'Unknown',
        bio: '',
        avatar: ''
      },
      stats: {
        enrolledUsers: 0,
        completionRate: 0,
        averageRating: 0,
        totalRatings: 0
      },
      resources: {
        notes: [],
        practiceSheets: []
      },
      isPublic: true,
      createdBy: context.auth.uid,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    };

    // Create playlist
    const playlistRef = await db.collection('playlists').add(playlistDoc);
    const playlistId = playlistRef.id;

    // Update playlist with its ID
    await playlistRef.update({ playlistId });

    // Import videos and update playlist
    const batch = db.batch();
    const playlistVideos = [];

    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];
      
      // Create video document
      const videoDoc = {
        ...video,
        category: category || 'general',
        subcategory: subcategory || '',
        level: level || 'beginner',
        tags: tags || [],
        instructor: {
          name: video.channelTitle,
          channelId: video.channelId
        },
        content: {
          topics: [],
          learningObjectives: []
        },
        resources: {
          notes: [],
          practiceQuestions: []
        },
        stats: {
          views: 0,
          likes: 0,
          dislikes: 0,
          averageWatchTime: 0,
          completionRate: 0
        },
        isActive: true,
        createdBy: context.auth.uid,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      };

      const videoRef = db.collection('videos').doc();
      batch.set(videoRef, videoDoc);

      // Add to playlist videos array
      playlistVideos.push({
        videoId: videoRef.id,
        youtubeId: video.youtubeId,
        title: video.title,
        duration: video.duration,
        order: i + 1,
        isRequired: true,
        watchTime: 0,
        isCompleted: false
      });
    }

    // Update playlist with videos
    batch.update(playlistRef, { videos: playlistVideos });

    // Commit batch
    await batch.commit();

    return { 
      success: true, 
      playlistId: playlistId,
      videosImported: videos.length,
      message: 'Playlist imported successfully' 
    };
  } catch (error) {
    console.error('Error importing YouTube playlist:', error);
    throw new functions.https.HttpsError('internal', 'Failed to import playlist');
  }
});

// Sync video data from YouTube (scheduled function)
exports.syncYouTubeVideoData = functions.firestore
  .document('videos/{videoId}')
  .onWrite(async (change, context) => {
    // Only sync on updates, not creates or deletes
    if (!change.before.exists || !change.after.exists) {
      return null;
    }

    const videoData = change.after.data();
    const youtubeId = videoData.youtubeId;

    if (!youtubeId) {
      return null;
    }

    try {
      // Get fresh data from YouTube API
      const freshData = await youtubeService.getVideoDetails(youtubeId);

      // Update only if data has changed
      const updates = {};
      
      if (videoData.title !== freshData.title) {
        updates.title = freshData.title;
      }
      
      if (videoData.description !== freshData.description) {
        updates.description = freshData.description;
      }
      
      if (videoData.duration !== freshData.duration) {
        updates.duration = freshData.duration;
      }

      if (JSON.stringify(videoData.thumbnail) !== JSON.stringify(freshData.thumbnail)) {
        updates.thumbnail = freshData.thumbnail;
      }

      // Update statistics
      updates['statistics.viewCount'] = freshData.statistics.viewCount;
      updates['statistics.likeCount'] = freshData.statistics.likeCount;
      updates['statistics.commentCount'] = freshData.statistics.commentCount;

      if (Object.keys(updates).length > 0) {
        updates.updatedAt = FieldValue.serverTimestamp();
        await change.after.ref.update(updates);
        console.log(`Synced video data for ${youtubeId}`);
      }

      return null;
    } catch (error) {
      console.error(`Error syncing video data for ${youtubeId}:`, error);
      return null;
    }
  });

// Search YouTube videos
exports.searchYouTubeVideos = functions.https.onCall(async (data, context) => {
  // Only admins and instructors can search
  if (!context.auth || !['admin', 'instructor'].includes(context.auth.token?.role)) {
    throw new functions.https.HttpsError('permission-denied', 'Only admins and instructors can search videos');
  }

  const { query, maxResults = 25, duration, channelId } = data;

  if (!query) {
    throw new functions.https.HttpsError('invalid-argument', 'Search query is required');
  }

  try {
    const searchOptions = {
      maxResults,
      duration, // short, medium, long
      channelId
    };

    const videos = await youtubeService.searchVideos(query, searchOptions);

    return { 
      success: true, 
      videos,
      count: videos.length 
    };
  } catch (error) {
    console.error('Error searching YouTube videos:', error);
    throw new functions.https.HttpsError('internal', 'Failed to search videos');
  }
});

// Get YouTube channel info
exports.getYouTubeChannelInfo = functions.https.onCall(async (data, context) => {
  // Only admins and instructors can get channel info
  if (!context.auth || !['admin', 'instructor'].includes(context.auth.token?.role)) {
    throw new functions.https.HttpsError('permission-denied', 'Only admins and instructors can get channel info');
  }

  const { channelId } = data;

  if (!channelId) {
    throw new functions.https.HttpsError('invalid-argument', 'Channel ID is required');
  }

  try {
    const channelInfo = await youtubeService.getChannelInfo(channelId);

    return { 
      success: true, 
      channelInfo 
    };
  } catch (error) {
    console.error('Error getting YouTube channel info:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get channel info');
  }
});
