import { httpsCallable } from 'firebase/functions';
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs, getCountFromServer } from 'firebase/firestore';
import { functions, db, auth } from '../config/firebase';

// Wrapper function for Firebase callable functions with better error handling
export const callFirebaseFunction = async (functionName, data = {}) => {
  try {
    console.log(`Calling Firebase function: ${functionName}`, data);
    
    const callable = httpsCallable(functions, functionName);
    const result = await callable(data);
    
    console.log(`Firebase function ${functionName} result:`, result.data);
    return result.data;
  } catch (error) {
    console.error(`Error calling Firebase function ${functionName}:`, error);
    
    // Handle different types of Firebase errors
    if (error.code === 'functions/unauthenticated') {
      throw new Error('You must be logged in to perform this action');
    } else if (error.code === 'functions/permission-denied') {
      throw new Error('You do not have permission to perform this action');
    } else if (error.code === 'functions/not-found') {
      throw new Error('The requested function was not found');
    } else if (error.code === 'functions/internal') {
      throw new Error('An internal error occurred. Please try again later');
    } else if (error.code === 'functions/unavailable') {
      throw new Error('Service is temporarily unavailable. Please try again later');
    } else {
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
};

// Specific function wrappers
// Fallback: build dashboard client-side from Firestore if callable is unavailable
const getUserDashboardFromClient = async () => {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new Error('You must be logged in to perform this action');
  }

  // Fetch user profile
  const userSnap = await getDoc(doc(db, 'users', uid));
  if (!userSnap.exists()) {
    throw new Error('User profile not found');
  }
  const user = userSnap.data();

  // Fetch user progress
  const progressSnap = await getDoc(doc(db, 'userProgress', uid));
  const progress = progressSnap.exists() ? progressSnap.data() : {};

  // Fetch recent attempts
  // Query without orderBy to avoid composite index requirement; we'll sort client-side
  const attemptsQ = query(
    collection(db, 'testAttempts'),
    where('userId', '==', uid),
    limit(50) // fetch more, then sort and slice
  );
  const attemptsSnap = await getDocs(attemptsQ);
  const attempts = attemptsSnap.docs.map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => {
      const aTime = a.startTime?.seconds ?? (a.startTime?.toDate ? a.startTime.toDate().getTime() / 1000 : 0);
      const bTime = b.startTime?.seconds ?? (b.startTime?.toDate ? b.startTime.toDate().getTime() / 1000 : 0);
      return bTime - aTime; // desc
    })
    .slice(0, 5);

  // Calculate stats similar to backend
  const totalXP = user.gamification?.totalXP || 0;
  const currentStreak = user.gamification?.currentStreak || 0;
  const level = user.gamification?.level || 1;
  const completedPlaylists = Object.keys(progress.playlists || {}).length;
  const averageScore = attempts.length > 0
    ? attempts.reduce((sum, a) => sum + (a.results?.percentage || 0), 0) / attempts.length
    : 0;

  return {
    user: { ...user, userId: uid },
    progress,
    recentAttempts: attempts,
    stats: {
      totalXP,
      currentStreak,
      level,
      completedPlaylists,
      totalTestAttempts: attempts.length,
      averageScore
    }
  };
};

export const getUserDashboard = async () => {
  try {
    return await callFirebaseFunction('getUserDashboard');
  } catch (err) {
    console.warn('Callable getUserDashboard failed, falling back to client aggregation:', err);
    // Fallback to client-side aggregation to avoid dependency on Cloud Functions
    return await getUserDashboardFromClient();
  }
};

export const updateUserProfile = (profileData) => 
  callFirebaseFunction('updateUserProfile', profileData);

export const updateUserXP = (xpData) => 
  callFirebaseFunction('updateUserXP', xpData);

export const updateStudyStreak = () => 
  callFirebaseFunction('updateStudyStreak');

export const getLeaderboard = (options = {}) => 
  callFirebaseFunction('getLeaderboard', options);

export const createMockTest = (testData) => 
  callFirebaseFunction('createMockTest', testData);

export const submitTestAttempt = (attemptData) => 
  callFirebaseFunction('submitTestAttempt', attemptData);

export const getTestResults = (attemptId) => 
  callFirebaseFunction('getTestResults', { attemptId });

export const getUserProgress = () => 
  callFirebaseFunction('getUserProgress');

export const updateVideoProgress = (progressData) => 
  callFirebaseFunction('updateVideoProgress', progressData);

export const getPlaylistContent = (playlistId) => 
  callFirebaseFunction('getPlaylistContent', { playlistId });

export const importYouTubeVideo = (videoData) => 
  callFirebaseFunction('importYouTubeVideo', videoData);

export const importYouTubePlaylist = (playlistData) => 
  callFirebaseFunction('importYouTubePlaylist', playlistData);

// Admin functions
export const getAllUsers = (options = {}) => 
  callFirebaseFunction('getAllUsers', options);

export const updateUserRole = (userData) => 
  callFirebaseFunction('updateUserRole', userData);

export const getAnalytics = (options = {}) => 
  callFirebaseFunction('getAnalytics', options);

export const createCompany = (companyData) => 
  callFirebaseFunction('createCompany', companyData);

export const updateCompany = (companyData) => 
  callFirebaseFunction('updateCompany', companyData);

export const createRoadmap = (roadmapData) => 
  callFirebaseFunction('createRoadmap', roadmapData);

// Admin dashboard fallback implementation
const getAdminDashboardFromClient = async () => {
  // Counts using count() aggregate to avoid downloading entire collections
  let totalUsers = 0, totalPlaylists = 0, totalVideos = 0, totalTests = 0;
  try { totalUsers = (await getCountFromServer(query(collection(db, 'users')))).data().count || 0; } catch (_) { totalUsers = 0; }
  try { totalPlaylists = (await getCountFromServer(query(collection(db, 'playlists')))).data().count || 0; } catch (_) { totalPlaylists = 0; }
  try { totalVideos = (await getCountFromServer(query(collection(db, 'videos')))).data().count || 0; } catch (_) { totalVideos = 0; }
  try { totalTests = (await getCountFromServer(query(collection(db, 'mockTests')))).data().count || 0; } catch (_) { totalTests = 0; }

  const overview = { totalUsers, totalPlaylists, totalVideos, totalTests };

  // Recent users (try server sort; fallback to client sort if index/field missing)
  let recentUsers = [];
  try {
    const recentUsersSnap = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(5)));
    recentUsers = recentUsersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (_) {
    const allUsersSnap = await getDocs(query(collection(db, 'users'), limit(50)));
    recentUsers = allUsersSnap.docs.map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => {
        const aT = a.createdAt?.seconds ?? (a.createdAt?.toDate ? a.createdAt.toDate().getTime() / 1000 : 0);
        const bT = b.createdAt?.seconds ?? (b.createdAt?.toDate ? b.createdAt.toDate().getTime() / 1000 : 0);
        return bT - aT;
      })
      .slice(0, 5);
  }

  // Recent test attempts (try server sort; fallback to client sort)
  let recentTestAttempts = [];
  try {
    const recentAttemptsSnap = await getDocs(query(collection(db, 'testAttempts'), orderBy('startTime', 'desc'), limit(5)));
    recentTestAttempts = recentAttemptsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (_) {
    const attemptsSnap = await getDocs(query(collection(db, 'testAttempts'), limit(50)));
    recentTestAttempts = attemptsSnap.docs.map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => {
        const aT = a.startTime?.seconds ?? (a.startTime?.toDate ? a.startTime.toDate().getTime() / 1000 : 0);
        const bT = b.startTime?.seconds ?? (b.startTime?.toDate ? b.startTime.toDate().getTime() / 1000 : 0);
        return bT - aT;
      })
      .slice(0, 5);
  }

  return {
    dashboard: {
      overview,
      recentActivity: {
        newUsers: recentUsers,
        recentTestAttempts,
      },
    },
  };
};

export const getAdminDashboard = async () => {
  // On Spark plan, callable Cloud Functions are not deployed; use client aggregation directly
  return await getAdminDashboardFromClient();
};
