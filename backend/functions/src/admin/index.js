const functions = require('firebase-functions');
const { db } = require('../config/firebase');
const { FieldValue } = require('firebase-admin').firestore;

// Create or update company
exports.manageCompany = functions.https.onCall(async (data, context) => {
  // Only admins can manage companies
  if (!context.auth || context.auth.token?.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can manage companies');
  }

  const { companyId, companyData, action = 'create' } = data;

  if (!companyData) {
    throw new functions.https.HttpsError('invalid-argument', 'Company data is required');
  }

  try {
    let result;

    if (action === 'create') {
      const newCompanyData = {
        ...companyData,
        isActive: true,
        createdBy: context.auth.uid,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      };

      const companyRef = await db.collection('companies').add(newCompanyData);
      await companyRef.update({ companyId: companyRef.id });

      result = { companyId: companyRef.id, message: 'Company created successfully' };
    } else if (action === 'update') {
      if (!companyId) {
        throw new functions.https.HttpsError('invalid-argument', 'Company ID is required for update');
      }

      const updateData = {
        ...companyData,
        updatedBy: context.auth.uid,
        updatedAt: FieldValue.serverTimestamp()
      };

      await db.collection('companies').doc(companyId).update(updateData);
      result = { companyId, message: 'Company updated successfully' };
    } else {
      throw new functions.https.HttpsError('invalid-argument', 'Invalid action');
    }

    return { success: true, ...result };
  } catch (error) {
    console.error('Error managing company:', error);
    throw new functions.https.HttpsError('internal', 'Failed to manage company');
  }
});

// Create or update roadmap
exports.manageRoadmap = functions.https.onCall(async (data, context) => {
  // Only admins and instructors can manage roadmaps
  if (!context.auth || !['admin', 'instructor'].includes(context.auth.token?.role)) {
    throw new functions.https.HttpsError('permission-denied', 'Only admins and instructors can manage roadmaps');
  }

  const { roadmapId, roadmapData, action = 'create' } = data;

  if (!roadmapData) {
    throw new functions.https.HttpsError('invalid-argument', 'Roadmap data is required');
  }

  try {
    let result;

    if (action === 'create') {
      const newRoadmapData = {
        ...roadmapData,
        isPublished: false, // Default to unpublished
        createdBy: context.auth.uid,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      };

      const roadmapRef = await db.collection('roadmaps').add(newRoadmapData);
      await roadmapRef.update({ roadmapId: roadmapRef.id });

      result = { roadmapId: roadmapRef.id, message: 'Roadmap created successfully' };
    } else if (action === 'update') {
      if (!roadmapId) {
        throw new functions.https.HttpsError('invalid-argument', 'Roadmap ID is required for update');
      }

      const updateData = {
        ...roadmapData,
        updatedBy: context.auth.uid,
        updatedAt: FieldValue.serverTimestamp()
      };

      await db.collection('roadmaps').doc(roadmapId).update(updateData);
      result = { roadmapId, message: 'Roadmap updated successfully' };
    } else if (action === 'publish') {
      if (!roadmapId) {
        throw new functions.https.HttpsError('invalid-argument', 'Roadmap ID is required for publish');
      }

      await db.collection('roadmaps').doc(roadmapId).update({
        isPublished: true,
        publishedBy: context.auth.uid,
        publishedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      });

      result = { roadmapId, message: 'Roadmap published successfully' };
    } else {
      throw new functions.https.HttpsError('invalid-argument', 'Invalid action');
    }

    return { success: true, ...result };
  } catch (error) {
    console.error('Error managing roadmap:', error);
    throw new functions.https.HttpsError('internal', 'Failed to manage roadmap');
  }
});

// Create or update mock test
exports.manageMockTest = functions.https.onCall(async (data, context) => {
  // Only admins can manage mock tests
  if (!context.auth || context.auth.token?.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can manage mock tests');
  }

  const { testId, testData, action = 'create' } = data;

  if (!testData) {
    throw new functions.https.HttpsError('invalid-argument', 'Test data is required');
  }

  try {
    let result;

    if (action === 'create') {
      // Validate test structure
      if (!testData.questions || !Array.isArray(testData.questions) || testData.questions.length === 0) {
        throw new functions.https.HttpsError('invalid-argument', 'Test must have questions');
      }

      // Add question IDs if not present
      testData.questions = testData.questions.map((q, index) => ({
        ...q,
        questionId: q.questionId || `q-${Date.now()}-${index}`
      }));

      const newTestData = {
        ...testData,
        isActive: true,
        createdBy: context.auth.uid,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      };

      const testRef = await db.collection('mockTests').add(newTestData);
      await testRef.update({ testId: testRef.id });

      result = { testId: testRef.id, message: 'Mock test created successfully' };
    } else if (action === 'update') {
      if (!testId) {
        throw new functions.https.HttpsError('invalid-argument', 'Test ID is required for update');
      }

      const updateData = {
        ...testData,
        updatedBy: context.auth.uid,
        updatedAt: FieldValue.serverTimestamp()
      };

      await db.collection('mockTests').doc(testId).update(updateData);
      result = { testId, message: 'Mock test updated successfully' };
    } else if (action === 'activate' || action === 'deactivate') {
      if (!testId) {
        throw new functions.https.HttpsError('invalid-argument', 'Test ID is required');
      }

      await db.collection('mockTests').doc(testId).update({
        isActive: action === 'activate',
        updatedBy: context.auth.uid,
        updatedAt: FieldValue.serverTimestamp()
      });

      result = { testId, message: `Mock test ${action}d successfully` };
    } else {
      throw new functions.https.HttpsError('invalid-argument', 'Invalid action');
    }

    return { success: true, ...result };
  } catch (error) {
    console.error('Error managing mock test:', error);
    throw new functions.https.HttpsError('internal', 'Failed to manage mock test');
  }
});

// Get admin dashboard data
exports.getAdminDashboard = functions.https.onCall(async (data, context) => {
  // Only admins can access admin dashboard
  if (!context.auth || context.auth.token?.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can access admin dashboard');
  }

  try {
    const [
      totalUsers,
      totalPlaylists,
      totalVideos,
      totalTests,
      recentUsers,
      recentAttempts,
      contentStats
    ] = await Promise.all([
      // Total counts
      db.collection('users').get().then(snap => snap.size),
      db.collection('playlists').get().then(snap => snap.size),
      db.collection('videos').get().then(snap => snap.size),
      db.collection('mockTests').get().then(snap => snap.size),
      
      // Recent users (last 7 days)
      db.collection('users')
        .where('createdAt', '>=', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get()
        .then(snap => snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate()
        }))),
      
      // Recent test attempts
      db.collection('testAttempts')
        .where('startTime', '>=', new Date(Date.now() - 24 * 60 * 60 * 1000))
        .orderBy('startTime', 'desc')
        .limit(10)
        .get()
        .then(snap => snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          startTime: doc.data().startTime.toDate()
        }))),
      
      // Content statistics
      Promise.all([
        db.collection('playlists').where('isPublic', '==', true).get(),
        db.collection('videos').where('isActive', '==', true).get(),
        db.collection('mockTests').where('isActive', '==', true).get()
      ]).then(([publicPlaylists, activeVideos, activeTests]) => ({
        publicPlaylists: publicPlaylists.size,
        activeVideos: activeVideos.size,
        activeTests: activeTests.size
      }))
    ]);

    // Calculate growth metrics (simplified)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const usersLastWeek = await db.collection('users')
      .where('createdAt', '>=', weekAgo)
      .get()
      .then(snap => snap.size);

    const dashboard = {
      overview: {
        totalUsers,
        totalPlaylists,
        totalVideos,
        totalTests,
        newUsersThisWeek: usersLastWeek,
        activeContent: contentStats
      },
      recentActivity: {
        newUsers: recentUsers,
        recentTestAttempts: recentAttempts
      },
      quickStats: {
        userGrowthRate: totalUsers > 0 ? Math.round((usersLastWeek / totalUsers) * 100) : 0,
        contentUtilization: {
          playlistsPublic: contentStats.publicPlaylists,
          videosActive: contentStats.activeVideos,
          testsActive: contentStats.activeTests
        }
      }
    };

    return { dashboard };
  } catch (error) {
    console.error('Error getting admin dashboard:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get admin dashboard');
  }
});

// Manage user roles and permissions
exports.manageUserRole = functions.https.onCall(async (data, context) => {
  // Only admins can manage user roles
  if (!context.auth || context.auth.token?.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can manage user roles');
  }

  const { userId, role, action = 'update' } = data;

  if (!userId || !role) {
    throw new functions.https.HttpsError('invalid-argument', 'User ID and role are required');
  }

  const validRoles = ['student', 'instructor', 'admin'];
  if (!validRoles.includes(role)) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid role');
  }

  try {
    // Update user document
    await db.collection('users').doc(userId).update({
      role: role,
      updatedBy: context.auth.uid,
      updatedAt: FieldValue.serverTimestamp()
    });

    // Set custom claims for authentication
    const { auth } = require('../config/firebase');
    await auth.setCustomUserClaims(userId, { role });

    return { 
      success: true, 
      message: `User role updated to ${role} successfully` 
    };
  } catch (error) {
    console.error('Error managing user role:', error);
    throw new functions.https.HttpsError('internal', 'Failed to manage user role');
  }
});

// Bulk operations for content management
exports.bulkContentOperation = functions.https.onCall(async (data, context) => {
  // Only admins can perform bulk operations
  if (!context.auth || context.auth.token?.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can perform bulk operations');
  }

  const { collection, documentIds, operation, operationData } = data;

  if (!collection || !documentIds || !Array.isArray(documentIds) || !operation) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid bulk operation parameters');
  }

  const validCollections = ['playlists', 'videos', 'mockTests', 'companies', 'roadmaps'];
  if (!validCollections.includes(collection)) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid collection');
  }

  try {
    const batch = db.batch();
    let updateData = {};

    switch (operation) {
      case 'activate':
        updateData = { isActive: true, updatedAt: FieldValue.serverTimestamp() };
        break;
      case 'deactivate':
        updateData = { isActive: false, updatedAt: FieldValue.serverTimestamp() };
        break;
      case 'publish':
        updateData = { isPublished: true, updatedAt: FieldValue.serverTimestamp() };
        break;
      case 'unpublish':
        updateData = { isPublished: false, updatedAt: FieldValue.serverTimestamp() };
        break;
      case 'update':
        updateData = { ...operationData, updatedAt: FieldValue.serverTimestamp() };
        break;
      case 'delete':
        // For delete operations, we'll mark as inactive instead of actual deletion
        updateData = { isActive: false, deletedAt: FieldValue.serverTimestamp() };
        break;
      default:
        throw new functions.https.HttpsError('invalid-argument', 'Invalid operation');
    }

    // Apply operation to all documents
    documentIds.forEach(docId => {
      const docRef = db.collection(collection).doc(docId);
      batch.update(docRef, updateData);
    });

    await batch.commit();

    return { 
      success: true, 
      message: `Bulk ${operation} completed for ${documentIds.length} documents`,
      processedCount: documentIds.length
    };
  } catch (error) {
    console.error('Error performing bulk operation:', error);
    throw new functions.https.HttpsError('internal', 'Failed to perform bulk operation');
  }
});

// Content approval workflow
exports.manageContentApproval = functions.https.onCall(async (data, context) => {
  // Only admins can manage content approval
  if (!context.auth || context.auth.token?.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can manage content approval');
  }

  const { contentId, contentType, action, comments } = data;

  if (!contentId || !contentType || !action) {
    throw new functions.https.HttpsError('invalid-argument', 'Content ID, type, and action are required');
  }

  const validActions = ['approve', 'reject', 'request-changes'];
  if (!validActions.includes(action)) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid action');
  }

  try {
    const approvalData = {
      status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'changes-requested',
      reviewedBy: context.auth.uid,
      reviewedAt: FieldValue.serverTimestamp(),
      comments: comments || ''
    };

    // Update the content document
    await db.collection(contentType).doc(contentId).update({
      approvalWorkflow: approvalData,
      updatedAt: FieldValue.serverTimestamp()
    });

    // If approved, also publish the content
    if (action === 'approve') {
      await db.collection(contentType).doc(contentId).update({
        isPublished: true,
        publishedAt: FieldValue.serverTimestamp()
      });
    }

    return { 
      success: true, 
      message: `Content ${action}d successfully` 
    };
  } catch (error) {
    console.error('Error managing content approval:', error);
    throw new functions.https.HttpsError('internal', 'Failed to manage content approval');
  }
});
