import { useState } from 'react';
import { useAdminAuth } from './AdminAuth';
import ThemeToggle from '../components/ThemeToggle';

const AdminLayout = ({ children, currentPage = 'dashboard' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { adminUser, logout, hasPermission } = useAdminAuth();

  const navigationItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: '📊',
      href: '/admin',
      permission: 'all'
    },
    {
      id: 'videos',
      name: 'Video Management',
      icon: '📹',
      href: '/admin/videos',
      permission: 'videos'
    },
    {
      id: 'playlists',
      name: 'Playlist Management',
      icon: '📚',
      href: '/admin/playlists',
      permission: 'playlists'
    },
    {
      id: 'companies',
      name: 'Companies & Roadmaps',
      icon: '🏢',
      href: '/admin/companies',
      permission: 'companies'
    },
    {
      id: 'users',
      name: 'User Management',
      icon: '👥',
      href: '/admin/users',
      permission: 'users'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: '📈',
      href: '/admin/analytics',
      permission: 'analytics'
    },
    {
      id: 'content',
      name: 'Content Approval',
      icon: '✅',
      href: '/admin/content',
      permission: 'content'
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: '⚙️',
      href: '/admin/settings',
      permission: 'all'
    }
  ];

  const filteredNavItems = navigationItems.filter(item => 
    hasPermission(item.permission)
  );

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-dark-primary flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-white dark:bg-dark-card border-r border-primary-200 dark:border-dark-border flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-primary-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="font-bold text-primary-900 dark:text-dark-text-primary">
                  Admin Panel
                </span>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-primary-100 dark:hover:bg-dark-secondary transition-colors"
            >
              <span className="text-xl">
                {sidebarOpen ? '◀' : '▶'}
              </span>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {filteredNavItems.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
                    ${currentPage === item.id
                      ? 'bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-300'
                      : 'text-primary-600 hover:text-primary-900 hover:bg-primary-100 dark:text-dark-text-secondary dark:hover:text-dark-text-primary dark:hover:bg-dark-secondary'
                    }
                  `}
                >
                  <span className="text-xl">{item.icon}</span>
                  {sidebarOpen && (
                    <span className="font-medium">{item.name}</span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-primary-200 dark:border-dark-border">
          {sidebarOpen ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {adminUser?.name?.charAt(0) || 'A'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary-900 dark:text-dark-text-primary truncate">
                    {adminUser?.name}
                  </p>
                  <p className="text-xs text-primary-500 dark:text-dark-text-secondary truncate">
                    {adminUser?.role?.replace('_', ' ')}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full btn-outline btn-sm text-left"
              >
                🚪 Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {adminUser?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-xl hover:bg-primary-100 dark:hover:bg-dark-secondary p-2 rounded-lg transition-colors"
                title="Logout"
              >
                🚪
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white dark:bg-dark-card border-b border-primary-200 dark:border-dark-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary-900 dark:text-dark-text-primary">
                {filteredNavItems.find(item => item.id === currentPage)?.name || 'Dashboard'}
              </h1>
              <p className="text-primary-600 dark:text-dark-text-secondary">
                Welcome back, {adminUser?.name}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-primary-600 dark:text-dark-text-secondary hover:text-primary-900 dark:hover:text-dark-text-primary transition-colors">
                <span className="text-xl">🔔</span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-error-500 rounded-full"></span>
              </button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Quick Actions */}
              <div className="flex items-center space-x-2">
                <button className="btn-outline btn-sm">
                  📊 Quick Stats
                </button>
                <button className="btn-primary btn-sm">
                  ➕ Add Content
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
