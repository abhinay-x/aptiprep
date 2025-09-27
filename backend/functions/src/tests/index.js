const functions = require('firebase-functions');
const { db } = require('../config/firebase');
const { FieldValue } = require('firebase-admin').firestore;

// Get available mock tests
exports.getMockTests = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { companyId, type, difficulty, limit = 20 } = data;

  try {
    let query = db.collection('mockTests').where('isActive', '==', true);

    if (companyId) {
      query = query.where('companyId', '==', companyId);
    }

    if (type) {
      query = query.where('type', '==', type);
    }

    if (difficulty) {
      query = query.where('difficulty', '==', difficulty);
    }

    query = query.orderBy('createdAt', 'desc').limit(limit);

    const snapshot = await query.get();
    
    const tests = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Remove questions from the response for security
      questions: undefined
    }));

    return { tests };
  } catch (error) {
    console.error('Error getting mock tests:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get mock tests');
  }
});

// Start a test attempt
exports.startTestAttempt = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { testId } = data;
  const userId = context.auth.uid;

  if (!testId) {
    throw new functions.https.HttpsError('invalid-argument', 'Test ID is required');
  }

  try {
    // Get test details
    const testDoc = await db.collection('mockTests').doc(testId).get();
    
    if (!testDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Test not found');
    }

    const test = testDoc.data();

    if (!test.isActive) {
      throw new functions.https.HttpsError('permission-denied', 'Test is not active');
    }

    // Create test attempt
    const attemptData = {
      attemptId: '', // Will be set after creation
      userId: userId,
      testId: testId,
      startTime: FieldValue.serverTimestamp(),
      endTime: null,
      duration: 0,
      status: 'in-progress',
      answers: [],
      results: null,
      analytics: null,
      createdAt: FieldValue.serverTimestamp()
    };

    const attemptRef = await db.collection('testAttempts').add(attemptData);
    await attemptRef.update({ attemptId: attemptRef.id });

    // Return test questions (shuffled for security)
    const shuffledQuestions = [...test.questions].sort(() => Math.random() - 0.5);

    return { 
      success: true,
      attemptId: attemptRef.id,
      test: {
        ...test,
        questions: shuffledQuestions.map(q => ({
          ...q,
          correctAnswer: undefined, // Remove correct answer
          explanation: undefined // Remove explanation
        }))
      }
    };
  } catch (error) {
    console.error('Error starting test attempt:', error);
    throw new functions.https.HttpsError('internal', 'Failed to start test attempt');
  }
});

// Submit test answer
exports.submitTestAnswer = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { attemptId, questionId, selectedAnswer, timeSpent, isMarkedForReview } = data;
  const userId = context.auth.uid;

  if (!attemptId || !questionId) {
    throw new functions.https.HttpsError('invalid-argument', 'Attempt ID and Question ID are required');
  }

  try {
    const attemptRef = db.collection('testAttempts').doc(attemptId);
    
    await db.runTransaction(async (transaction) => {
      const attemptDoc = await transaction.get(attemptRef);
      
      if (!attemptDoc.exists) {
        throw new Error('Test attempt not found');
      }

      const attemptData = attemptDoc.data();

      // Verify user owns this attempt
      if (attemptData.userId !== userId) {
        throw new Error('Unauthorized access to test attempt');
      }

      // Check if test is still in progress
      if (attemptData.status !== 'in-progress') {
        throw new Error('Test attempt is not in progress');
      }

      // Update or add answer
      const answers = attemptData.answers || [];
      const existingAnswerIndex = answers.findIndex(a => a.questionId === questionId);

      const answerData = {
        questionId,
        selectedAnswer,
        timeSpent: timeSpent || 0,
        isMarkedForReview: isMarkedForReview || false,
        submittedAt: FieldValue.serverTimestamp()
      };

      if (existingAnswerIndex >= 0) {
        answers[existingAnswerIndex] = answerData;
      } else {
        answers.push(answerData);
      }

      transaction.update(attemptRef, {
        answers: answers,
        updatedAt: FieldValue.serverTimestamp()
      });
    });

    return { success: true, message: 'Answer submitted successfully' };
  } catch (error) {
    console.error('Error submitting test answer:', error);
    throw new functions.https.HttpsError('internal', 'Failed to submit answer');
  }
});

// Complete test attempt
exports.completeTestAttempt = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { attemptId } = data;
  const userId = context.auth.uid;

  if (!attemptId) {
    throw new functions.https.HttpsError('invalid-argument', 'Attempt ID is required');
  }

  try {
    const attemptRef = db.collection('testAttempts').doc(attemptId);
    
    const result = await db.runTransaction(async (transaction) => {
      const attemptDoc = await transaction.get(attemptRef);
      
      if (!attemptDoc.exists) {
        throw new Error('Test attempt not found');
      }

      const attemptData = attemptDoc.data();

      // Verify user owns this attempt
      if (attemptData.userId !== userId) {
        throw new Error('Unauthorized access to test attempt');
      }

      // Check if test is still in progress
      if (attemptData.status !== 'in-progress') {
        throw new Error('Test attempt is not in progress');
      }

      // Get test details for scoring
      const testDoc = await transaction.get(db.collection('mockTests').doc(attemptData.testId));
      const test = testDoc.data();

      // Calculate results
      const results = calculateTestResults(attemptData.answers, test);
      const analytics = generateTestAnalytics(attemptData.answers, test, results);

      // Calculate duration
      const startTime = attemptData.startTime.toDate();
      const endTime = new Date();
      const duration = Math.floor((endTime - startTime) / 1000); // in seconds

      // Update attempt with results
      const updateData = {
        endTime: FieldValue.serverTimestamp(),
        duration: duration,
        status: 'completed',
        results: results,
        analytics: analytics,
        updatedAt: FieldValue.serverTimestamp()
      };

      transaction.update(attemptRef, updateData);

      return { results, analytics };
    });

    return { 
      success: true, 
      message: 'Test completed successfully',
      ...result
    };
  } catch (error) {
    console.error('Error completing test attempt:', error);
    throw new functions.https.HttpsError('internal', 'Failed to complete test');
  }
});

// Get test attempt results
exports.getTestResults = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { attemptId } = data;
  const userId = context.auth.uid;

  if (!attemptId) {
    throw new functions.https.HttpsError('invalid-argument', 'Attempt ID is required');
  }

  try {
    const attemptDoc = await db.collection('testAttempts').doc(attemptId).get();
    
    if (!attemptDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Test attempt not found');
    }

    const attemptData = attemptDoc.data();

    // Verify user owns this attempt
    if (attemptData.userId !== userId) {
      throw new functions.https.HttpsError('permission-denied', 'Unauthorized access to test attempt');
    }

    // Get test details for question explanations
    const testDoc = await db.collection('mockTests').doc(attemptData.testId).get();
    const test = testDoc.data();

    // Add correct answers and explanations to user answers
    const answersWithExplanations = attemptData.answers.map(answer => {
      const question = test.questions.find(q => q.questionId === answer.questionId);
      return {
        ...answer,
        isCorrect: answer.selectedAnswer === question?.correctAnswer,
        correctAnswer: question?.correctAnswer,
        explanation: question?.explanation,
        question: question?.question,
        options: question?.options
      };
    });

    return {
      attempt: {
        ...attemptData,
        id: attemptDoc.id
      },
      answersWithExplanations,
      test: {
        title: test.title,
        sections: test.sections,
        timeLimit: test.timeLimit
      }
    };
  } catch (error) {
    console.error('Error getting test results:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get test results');
  }
});

// Helper function to calculate test results
function calculateTestResults(answers, test) {
  const totalQuestions = test.questions.length;
  const attempted = answers.length;
  let correct = 0;
  let incorrect = 0;

  // Section-wise and topic-wise tracking
  const sectionWise = {};
  const topicWise = {};

  answers.forEach(answer => {
    const question = test.questions.find(q => q.questionId === answer.questionId);
    if (!question) return;

    const isCorrect = answer.selectedAnswer === question.correctAnswer;
    
    if (isCorrect) {
      correct++;
    } else {
      incorrect++;
    }

    // Section-wise stats
    const sectionId = question.sectionId;
    if (!sectionWise[sectionId]) {
      sectionWise[sectionId] = { attempted: 0, correct: 0, incorrect: 0 };
    }
    sectionWise[sectionId].attempted++;
    if (isCorrect) {
      sectionWise[sectionId].correct++;
    } else {
      sectionWise[sectionId].incorrect++;
    }

    // Topic-wise stats
    const topic = question.topic;
    if (!topicWise[topic]) {
      topicWise[topic] = { attempted: 0, correct: 0 };
    }
    topicWise[topic].attempted++;
    if (isCorrect) {
      topicWise[topic].correct++;
    }
  });

  // Calculate scores (assuming 1 mark per question, -0.25 for wrong)
  const score = correct - (incorrect * 0.25);
  const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

  // Calculate section-wise percentages
  Object.keys(sectionWise).forEach(sectionId => {
    const section = sectionWise[sectionId];
    const sectionScore = section.correct - (section.incorrect * 0.25);
    section.score = sectionScore;
    section.percentage = section.attempted > 0 ? (sectionScore / section.attempted) * 100 : 0;
  });

  // Calculate topic-wise accuracy
  Object.keys(topicWise).forEach(topic => {
    const topicData = topicWise[topic];
    topicData.accuracy = topicData.attempted > 0 ? (topicData.correct / topicData.attempted) * 100 : 0;
  });

  return {
    totalQuestions,
    attempted,
    correct,
    incorrect,
    unattempted: totalQuestions - attempted,
    score: Math.max(0, score), // Ensure score is not negative
    percentage: Math.max(0, percentage),
    percentile: 0, // Will be calculated later with other attempts
    sectionWise,
    topicWise,
    timeAnalysis: calculateTimeAnalysis(answers)
  };
}

// Helper function to calculate time analysis
function calculateTimeAnalysis(answers) {
  const timeDistribution = {
    '0-30s': 0,
    '31-60s': 0,
    '61-120s': 0,
    '120s+': 0
  };

  let totalTime = 0;

  answers.forEach(answer => {
    const timeSpent = answer.timeSpent || 0;
    totalTime += timeSpent;

    if (timeSpent <= 30) {
      timeDistribution['0-30s']++;
    } else if (timeSpent <= 60) {
      timeDistribution['31-60s']++;
    } else if (timeSpent <= 120) {
      timeDistribution['61-120s']++;
    } else {
      timeDistribution['120s+']++;
    }
  });

  return {
    avgTimePerQuestion: answers.length > 0 ? Math.round(totalTime / answers.length) : 0,
    timeDistribution
  };
}

// Helper function to generate test analytics
function generateTestAnalytics(answers, test, results) {
  const strengths = [];
  const weaknesses = [];
  const recommendations = [];

  // Analyze topic-wise performance
  Object.entries(results.topicWise).forEach(([topic, data]) => {
    if (data.accuracy >= 70) {
      strengths.push(topic);
    } else if (data.accuracy < 50) {
      weaknesses.push(topic);
    }
  });

  // Generate recommendations based on performance
  if (results.percentage < 50) {
    recommendations.push('Focus on fundamental concepts and practice more questions');
  }

  if (results.timeAnalysis.avgTimePerQuestion > 90) {
    recommendations.push('Work on time management and speed');
  }

  weaknesses.forEach(topic => {
    recommendations.push(`Practice more ${topic} problems`);
  });

  return {
    strengths,
    weaknesses,
    recommendations
  };
}
