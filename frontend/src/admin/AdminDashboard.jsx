import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 12547,
    totalVideos: 1234,
    totalPlaylists: 89,
    totalCompanies: 156,
    monthlyRevenue: 45670,
    activeUsers: 8934,
    newUsersToday: 127,
    videosWatched: 23456
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'video_upload',
      message: 'New video "Percentage Problems" uploaded by Content Team',
      time: '2 minutes ago',
      icon: '📹'
    },
    {
      id: 2,
      type: 'user_signup',
      message: '15 new users registered in the last hour',
      time: '1 hour ago',
      icon: '👥'
    },
    {
      id: 3,
      type: 'playlist_created',
      message: 'New playlist "CAT Preparation 2024" created',
      time: '3 hours ago',
      icon: '📚'
    },
    {
      id: 4,
      type: 'company_added',
      message: 'TCS test pattern updated',
      time: '5 hours ago',
      icon: '🏢'
    }
  ]);

  const [quickActions] = useState([
    {
      id: 1,
      title: 'Add New Video',
      description: 'Upload or import videos from YouTube',
      icon: '📹',
      color: 'blue',
      action: () => window.location.href = '/admin/videos/add'
    },
    {
      id: 2,
      title: 'Create Playlist',
      description: 'Organize videos into learning paths',
      icon: '📚',
      color: 'green',
      action: () => window.location.href = '/admin/playlists/create'
    },
    {
      id: 3,
      title: 'Add Company',
      description: 'Add new company test patterns',
      icon: '🏢',
      color: 'purple',
      action: () => window.location.href = '/admin/companies/add'
    },
    {
      id: 4,
      title: 'User Analytics',
      description: 'View detailed user insights',
      icon: '📊',
      color: 'accent',
      action: () => window.location.href = '/admin/analytics'
    }
  ]);

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
      green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
      purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
      accent: 'bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400 border-accent-200 dark:border-accent-800'
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <AdminLayout currentPage="dashboard">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary-600 dark:text-dark-text-secondary">
                  Total Users
                </p>
                <p className="text-3xl font-bold text-primary-900 dark:text-dark-text-primary">
                  {stats.totalUsers.toLocaleString()}
                </p>
                <p className="text-sm text-success-600 dark:text-success-400 mt-1">
                  ↗ +12% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary-600 dark:text-dark-text-secondary">
                  Total Videos
                </p>
                <p className="text-3xl font-bold text-primary-900 dark:text-dark-text-primary">
                  {stats.totalVideos.toLocaleString()}
                </p>
                <p className="text-sm text-success-600 dark:text-success-400 mt-1">
                  ↗ +8% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📹</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary-600 dark:text-dark-text-secondary">
                  Monthly Revenue
                </p>
                <p className="text-3xl font-bold text-primary-900 dark:text-dark-text-primary">
                  ₹{stats.monthlyRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-success-600 dark:text-success-400 mt-1">
                  ↗ +15% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/30 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary-600 dark:text-dark-text-secondary">
                  Active Users
                </p>
                <p className="text-3xl font-bold text-primary-900 dark:text-dark-text-primary">
                  {stats.activeUsers.toLocaleString()}
                </p>
                <p className="text-sm text-success-600 dark:text-success-400 mt-1">
                  ↗ +5% from yesterday
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔥</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-primary-900 dark:text-dark-text-primary mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={action.action}
                className={`
                  p-4 rounded-lg border-2 border-dashed transition-all duration-200
                  hover:scale-105 hover:shadow-md text-left
                  ${getColorClasses(action.color)}
                `}
              >
                <div className="text-3xl mb-2">{action.icon}</div>
                <h3 className="font-semibold mb-1">{action.title}</h3>
                <p className="text-sm opacity-80">{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-primary-900 dark:text-dark-text-primary">
                Recent Activity
              </h2>
              <button className="btn-outline btn-sm">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-dark-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">{activity.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-primary-900 dark:text-dark-text-primary">
                      {activity.message}
                    </p>
                    <p className="text-xs text-primary-500 dark:text-dark-text-secondary mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Performance */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-primary-900 dark:text-dark-text-primary">
                Content Performance
              </h2>
              <select className="input text-sm w-auto">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-primary-600 dark:text-dark-text-secondary">
                  Videos Watched
                </span>
                <span className="font-semibold text-primary-900 dark:text-dark-text-primary">
                  {stats.videosWatched.toLocaleString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-primary-600 dark:text-dark-text-secondary">
                  Completion Rate
                </span>
                <span className="font-semibold text-success-600 dark:text-success-400">
                  78.5%
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-primary-600 dark:text-dark-text-secondary">
                  Average Watch Time
                </span>
                <span className="font-semibold text-primary-900 dark:text-dark-text-primary">
                  12m 34s
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-primary-600 dark:text-dark-text-secondary">
                  User Engagement
                </span>
                <span className="font-semibold text-accent-600 dark:text-accent-400">
                  85.2%
                </span>
              </div>
            </div>

            {/* Simple Chart Placeholder */}
            <div className="mt-6 h-32 bg-primary-50 dark:bg-dark-secondary rounded-lg flex items-center justify-center">
              <span className="text-primary-500 dark:text-dark-text-secondary text-sm">
                📊 Performance Chart (Chart.js integration needed)
              </span>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-primary-900 dark:text-dark-text-primary mb-6">
            System Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-success-500 rounded-full"></div>
              <div>
                <p className="font-medium text-primary-900 dark:text-dark-text-primary">
                  API Status
                </p>
                <p className="text-sm text-primary-600 dark:text-dark-text-secondary">
                  All systems operational
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-success-500 rounded-full"></div>
              <div>
                <p className="font-medium text-primary-900 dark:text-dark-text-primary">
                  Database
                </p>
                <p className="text-sm text-primary-600 dark:text-dark-text-secondary">
                  Response time: 45ms
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-accent-500 rounded-full"></div>
              <div>
                <p className="font-medium text-primary-900 dark:text-dark-text-primary">
                  CDN Status
                </p>
                <p className="text-sm text-primary-600 dark:text-dark-text-secondary">
                  99.9% uptime
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
