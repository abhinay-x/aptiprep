import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Save video watch progress to Firestore
 * @param {string} userId - User ID
 * @param {string} videoId - Video content ID
 * @param {number} currentTime - Current playback time in seconds
 * @param {number} duration - Total video duration in seconds
 */
export const saveVideoProgress = async (userId, videoId, currentTime, duration) => {
  if (!userId || !videoId || currentTime < 0 || duration <= 0) return;

  try {
    const progressRef = doc(db, 'videoProgress', `${userId}_${videoId}`);
    const progressData = {
      userId,
      videoId,
      currentTime,
      duration,
      percentage: Math.min((currentTime / duration) * 100, 100),
      lastWatched: new Date(),
      completed: currentTime >= duration * 0.95 // Consider 95% as completed
    };

    await setDoc(progressRef, progressData, { merge: true });
  } catch (error) {
    console.error('Error saving video progress:', error);
  }
};

/**
 * Get video watch progress from Firestore
 * @param {string} userId - User ID
 * @param {string} videoId - Video content ID
 * @returns {Object|null} Progress data or null if not found
 */
export const getVideoProgress = async (userId, videoId) => {
  if (!userId || !videoId) return null;

  try {
    const progressRef = doc(db, 'videoProgress', `${userId}_${videoId}`);
    const progressDoc = await getDoc(progressRef);
    
    if (progressDoc.exists()) {
      return progressDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting video progress:', error);
    return null;
  }
};

/**
 * Get all video progress for a user
 * @param {string} userId - User ID
 * @returns {Array} Array of progress data
 */
export const getUserVideoProgress = async (userId) => {
  if (!userId) return [];

  try {
    const { collection, query, where, getDocs } = await import('firebase/firestore');
    const progressQuery = query(
      collection(db, 'videoProgress'),
      where('userId', '==', userId)
    );
    
    const snapshot = await getDocs(progressQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting user video progress:', error);
    return [];
  }
};

/**
 * Calculate watch time statistics
 * @param {Array} progressData - Array of progress data
 * @returns {Object} Statistics object
 */
export const calculateWatchStats = (progressData) => {
  if (!progressData || progressData.length === 0) {
    return {
      totalVideos: 0,
      completedVideos: 0,
      totalWatchTime: 0,
      averageProgress: 0,
      completionRate: 0
    };
  }

  const totalVideos = progressData.length;
  const completedVideos = progressData.filter(p => p.completed).length;
  const totalWatchTime = progressData.reduce((sum, p) => sum + (p.currentTime || 0), 0);
  const averageProgress = progressData.reduce((sum, p) => sum + (p.percentage || 0), 0) / totalVideos;
  const completionRate = (completedVideos / totalVideos) * 100;

  return {
    totalVideos,
    completedVideos,
    totalWatchTime: Math.round(totalWatchTime),
    averageProgress: Math.round(averageProgress),
    completionRate: Math.round(completionRate)
  };
};

/**
 * Format seconds to human readable time
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
export const formatWatchTime = (seconds) => {
  if (!seconds || seconds < 0) return '0m';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};
