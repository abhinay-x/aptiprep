import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  getUserDashboard, 
  updateStudyStreak, 
  getLeaderboard,
  callFirebaseFunction 
} from '../utils/firebaseFunctions';
import { auth, functions, getFirebaseConfig } from '../config/firebase';

const FirebaseFunctionTest = () => {
  const { currentUser } = useAuth();
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});
  const [error, setError] = useState(null);

  const runTest = async (testName, testFunction) => {
    setLoading(prev => ({ ...prev, [testName]: true }));
    setError(null);
    
    try {
      const result = await testFunction();
      setResults(prev => ({ 
        ...prev, 
        [testName]: { 
          success: true, 
          data: result,
          timestamp: new Date().toLocaleTimeString()
        }
      }));
    } catch (err) {
      setResults(prev => ({ 
        ...prev, 
        [testName]: { 
          success: false, 
          error: err.message,
          timestamp: new Date().toLocaleTimeString()
        }
      }));
      setError(`${testName} failed: ${err.message}`);
    } finally {
      setLoading(prev => ({ ...prev, [testName]: false }));
    }
  };

  const tests = [
    {
      name: 'Firebase Config',
      description: 'Check Firebase configuration',
      test: async () => {
        const config = getFirebaseConfig();
        return {
          hasApiKey: !!config.apiKey && config.apiKey !== 'NOT_SET',
          projectId: config.projectId,
          authDomain: config.authDomain,
          functionsRegion: functions.app.options.projectId ? 'us-central1' : 'unknown'
        };
      }
    },
    {
      name: 'Auth Status',
      description: 'Check authentication status',
      test: async () => {
        return {
          isAuthenticated: !!currentUser,
          userEmail: currentUser?.email,
          userId: currentUser?.uid,
          emailVerified: currentUser?.emailVerified
        };
      }
    },
    {
      name: 'Get Dashboard',
      description: 'Test getUserDashboard function',
      test: () => getUserDashboard(),
      requiresAuth: true
    },
    {
      name: 'Update Streak',
      description: 'Test updateStudyStreak function',
      test: () => updateStudyStreak(),
      requiresAuth: true
    },
    {
      name: 'Get Leaderboard',
      description: 'Test getLeaderboard function (public)',
      test: () => getLeaderboard({ limit: 5 }),
      requiresAuth: false
    },
    {
      name: 'Direct Function Call',
      description: 'Test direct function call',
      test: () => callFirebaseFunction('getUserDashboard'),
      requiresAuth: true
    }
  ];

  const runAllTests = async () => {
    for (const test of tests) {
      if (test.requiresAuth && !currentUser) {
        setResults(prev => ({ 
          ...prev, 
          [test.name]: { 
            success: false, 
            error: 'Authentication required',
            timestamp: new Date().toLocaleTimeString()
          }
        }));
        continue;
      }
      await runTest(test.name, test.test);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-dark-card rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-primary-900 dark:text-dark-text-primary mb-6">
        🔧 Firebase Functions Test
      </h2>

      {/* Current Status */}
      <div className="mb-6 p-4 bg-primary-50 dark:bg-dark-secondary rounded-lg">
        <h3 className="font-semibold text-primary-900 dark:text-dark-text-primary mb-2">
          Current Status
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-primary-600 dark:text-dark-text-secondary">User:</span>
            <span className="ml-2 font-medium text-primary-900 dark:text-dark-text-primary">
              {currentUser ? currentUser.email : 'Not authenticated'}
            </span>
          </div>
          <div>
            <span className="text-primary-600 dark:text-dark-text-secondary">Functions:</span>
            <span className="ml-2 font-medium text-primary-900 dark:text-dark-text-primary">
              {functions ? 'Initialized' : 'Not initialized'}
            </span>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
          <p className="text-error-700 dark:text-error-300 text-sm">{error}</p>
        </div>
      )}

      {/* Test Controls */}
      <div className="mb-6 flex space-x-4">
        <button
          onClick={runAllTests}
          className="btn-primary"
          disabled={Object.values(loading).some(Boolean)}
        >
          {Object.values(loading).some(Boolean) ? '⏳ Running Tests...' : '🚀 Run All Tests'}
        </button>
        <button
          onClick={() => {
            setResults({});
            setError(null);
          }}
          className="btn-outline"
        >
          🗑️ Clear Results
        </button>
      </div>

      {/* Individual Tests */}
      <div className="grid gap-4">
        {tests.map((test) => (
          <div key={test.name} className="border border-primary-200 dark:border-dark-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-semibold text-primary-900 dark:text-dark-text-primary">
                  {test.name}
                </h4>
                <p className="text-sm text-primary-600 dark:text-dark-text-secondary">
                  {test.description}
                  {test.requiresAuth && (
                    <span className="ml-2 px-2 py-1 bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 rounded text-xs">
                      Auth Required
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={() => runTest(test.name, test.test)}
                disabled={loading[test.name] || (test.requiresAuth && !currentUser)}
                className="btn-outline btn-sm"
              >
                {loading[test.name] ? '⏳' : '▶️'} Test
              </button>
            </div>

            {/* Test Result */}
            {results[test.name] && (
              <div className={`mt-3 p-3 rounded-lg ${
                results[test.name].success 
                  ? 'bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800'
                  : 'bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium ${
                    results[test.name].success 
                      ? 'text-success-700 dark:text-success-300' 
                      : 'text-error-700 dark:text-error-300'
                  }`}>
                    {results[test.name].success ? '✅ Success' : '❌ Failed'}
                  </span>
                  <span className="text-xs text-primary-500 dark:text-dark-text-secondary">
                    {results[test.name].timestamp}
                  </span>
                </div>
                
                <pre className={`text-xs overflow-auto ${
                  results[test.name].success 
                    ? 'text-success-700 dark:text-success-300' 
                    : 'text-error-700 dark:text-error-300'
                }`}>
                  {results[test.name].success 
                    ? JSON.stringify(results[test.name].data, null, 2)
                    : results[test.name].error
                  }
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
          📋 Troubleshooting Steps
        </h3>
        <ol className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-decimal list-inside">
          <li>Ensure you're logged in for authenticated functions</li>
          <li>Check that your Firebase configuration is correct in .env</li>
          <li>Verify that Cloud Functions are deployed to us-central1 region</li>
          <li>Check browser console for detailed error messages</li>
          <li>Ensure your user has the correct permissions in Firestore</li>
        </ol>
      </div>
    </div>
  );
};

export default FirebaseFunctionTest;
