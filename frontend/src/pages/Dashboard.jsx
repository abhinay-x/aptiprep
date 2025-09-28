import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserDashboard } from '../utils/firebaseFunctions';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Link } from 'react-router-dom';
import CustomVideoPlayer from '../components/CustomVideoPlayer';
import YouTubeCustomPlayer from '../components/YouTubeCustomPlayer';

export default function Dashboard() {
  const { currentUser, userProfile } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [recentContent, setRecentContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      fetchDashboardData();
    }
  }, [currentUser]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user is authenticated
      if (!currentUser) {
        setError('Please log in to view your dashboard');
        return;
      }
      
      // Fetch user dashboard data
      const data = await getUserDashboard();
      setDashboardData(data);

      // Fetch recent learning content added by admins
      await fetchRecentContent();
    } catch (error) {
      setError(error.message || 'Failed to load dashboard data');
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentContent = async () => {
    try {
      // Query without orderBy to avoid composite index requirement
      const snapshot = await getDocs(collection(db, 'lmsContent'));
      const contentList = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        // Filter for active content and sort in memory
        .filter(item => item.isActive === true)
        .sort((a, b) => {
          const aTime = a.createdAt?.seconds ?? 0;
          const bTime = b.createdAt?.seconds ?? 0;
          return bTime - aTime; // Most recent first
        })
        .slice(0, 6); // Limit to 6 items
      setRecentContent(contentList);
    } catch (err) {
      console.error('Error fetching recent content:', err);
      // Don't set error for content fetch failure, just log it
    }
  };

  const extractYouTubeVideoId = (url) => {
    if (!url) return null;
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const getYouTubeEmbedUrl = (videoId) => {
    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}`;
  };

  const getContentIcon = (contentType) => {
    const icons = {
      youtube: '📹',
      document: '📄',
      image: '🖼️',
      link: '🔗'
    };
    return icons[contentType] || '📚';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {userProfile?.displayName || currentUser?.email || 'Student'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Continue your learning journey and track your progress
          </p>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Continue Learning</h2>
                  <p className="text-gray-600 dark:text-gray-300">Quantitative Aptitude • Lesson 12 of 25</p>
                </div>
                <button className="btn-primary">Continue</button>
              </div>
              <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div className="h-2 bg-accent-500 rounded-full w-1/2" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: 'Current Streak', 
                  value: `${dashboardData?.user?.gamification?.currentStreak || 0} Days`, 
                  icon: '🔥'
                },
                {
                  label: 'Total XP', 
                  value: dashboardData?.user?.gamification?.totalXP || 0, 
                  icon: '⭐'
                },
                {
                  label: 'Level', 
                  value: dashboardData?.user?.gamification?.level || 1, 
                  icon: '🏆'
                },
                {
                  label: 'Playlists', 
                  value: dashboardData?.stats?.completedPlaylists || 0, 
                  icon: '📚'
                },
              ].map((m) => (
                <div key={m.label} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-center">
                  <div className="text-2xl">{m.icon}</div>
                  <div className="text-xl font-semibold text-gray-900 dark:text-white">{m.value}</div>
                  <div className="text-gray-600 dark:text-gray-300">{m.label}</div>
                </div>
              ))}
            </div>

            {/* Recent Test Attempts */}
            <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recent Test Attempts</h3>
              {dashboardData?.recentAttempts?.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.recentAttempts.slice(0, 5).map((attempt) => (
                    <div key={attempt.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Mock Test</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Score: {attempt.results?.percentage?.toFixed(1) || 'N/A'}% • 
                          {new Date(attempt.startTime?.seconds * 1000).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          (attempt.results?.percentage || 0) >= 70 
                            ? 'bg-green-100 text-green-800' 
                            : (attempt.results?.percentage || 0) >= 50 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {(attempt.results?.percentage || 0) >= 70 ? 'Good' : 
                           (attempt.results?.percentage || 0) >= 50 ? 'Average' : 'Needs Improvement'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">No test attempts yet</p>
                  <Link to="/tests" className="btn-primary">
                    Take Your First Test
                  </Link>
                </div>
              )}
            </div>
            
            {/* Recent Learning Content */}
            <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Learning Content</h3>
                <Link to="/learning" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All →
                </Link>
              </div>
              
              {recentContent.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentContent.map(item => {
                    const videoId = item.contentType === 'youtube' && item.contentUrl ? extractYouTubeVideoId(item.contentUrl) : null;
                    const contentUrl = item.contentUrl || item.fileUrl;
                    
                    return (
                      <div key={item.id} className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        {/* Content Preview - Play uploaded MP4s or YouTube inline */}
                        {item.fileUrl && item.fileType?.startsWith('video/') ? (
                          <CustomVideoPlayer
                            src={item.fileUrl}
                            title={item.title}
                            className="w-full aspect-video"
                          />
                        ) : videoId ? (
                          <YouTubeCustomPlayer
                            videoId={videoId}
                            title={item.title}
                            className="w-full"
                          />
                        ) : (
                          <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center">
                            <div className="text-4xl">{getContentIcon(item.contentType)}</div>
                          </div>
                        )}
                        
                        <div className="p-4">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-1 line-clamp-1">
                            {item.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                            {item.description}
                          </p>
                          
                          {/* Tags */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {item.tags?.slice(0, 2).map(tag => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          
                          {/* Action Button */}
                          {contentUrl && !videoId && !item.fileType?.startsWith('video/') && (
                            <a
                              href={contentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                              {item.contentType === 'document' ? '📄 View Document' :
                               item.contentType === 'image' ? '🖼️ View Image' :
                               '🔗 Open Link'} →
                            </a>
                          )}
                          
                          {(videoId || item.fileType?.startsWith('video/')) && (
                            <span className="inline-flex items-center text-sm text-green-600 font-medium">
                              ▶️ Video Player Above
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📚</div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">No learning content available yet</p>
                  <Link to="/learning" className="text-blue-600 hover:text-blue-700 font-medium">
                    Check back later for new content
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4">
              <Link to="/learning" className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-md transition-shadow">
                <div className="text-center">
                  <div className="text-3xl mb-2">📚</div>
                  <div className="font-semibold text-gray-900 dark:text-white mb-1">Learning Content</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Videos, docs & resources</div>
                </div>
              </Link>
              
              <Link to="/practice" className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-md transition-shadow">
                <div className="text-center">
                  <div className="text-3xl mb-2">🎯</div>
                  <div className="font-semibold text-gray-900 dark:text-white mb-1">Practice</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Solve practice questions</div>
                </div>
              </Link>
              
              <Link to="/tests" className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-md transition-shadow">
                <div className="text-center">
                  <div className="text-3xl mb-2">📝</div>
                  <div className="font-semibold text-gray-900 dark:text-white mb-1">Mock Tests</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Take practice tests</div>
                </div>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            {/* User Profile Card */}
            <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {userProfile?.displayName?.charAt(0) || currentUser?.email?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {userProfile?.displayName || 'User'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{currentUser?.email}</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400 capitalize">
                    {userProfile?.role || 'Student'}
                  </p>
                </div>
              </div>
              
              {/* Achievements */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Recent Achievements</h4>
                {dashboardData?.user?.gamification?.badges?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {dashboardData.user.gamification.badges.slice(0, 3).map((badge, index) => (
                      <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                        🏆 {badge.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 text-sm">No achievements yet. Keep learning!</p>
                )}
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Performance Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Average Score</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {dashboardData?.stats?.averageScore?.toFixed(1) || 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Attempts</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {dashboardData?.stats?.totalTestAttempts || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Current Level</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    Level {dashboardData?.user?.gamification?.level || 1}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
