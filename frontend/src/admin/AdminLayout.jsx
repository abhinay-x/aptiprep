import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from './AdminAuth';
import ThemeToggle from '../components/ThemeToggle';

const AdminLayout = ({ children, currentPage = 'dashboard' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
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

  // Close drawer on md+ screens to avoid stuck overlay
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768 && sidebarOpen) setSidebarOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-dark-primary flex">
      {/* Sidebar - desktop static, mobile drawer */}
      <div
        className={`
          fixed md:static z-[10000]
          top-0 left-0 h-screen w-64
          bg-white dark:bg-dark-card border-r border-primary-200 dark:border-dark-border flex flex-col
          transform transition-transform duration-200 ease-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
        aria-hidden={!sidebarOpen && window.innerWidth < 768}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-primary-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            {true && (
              <Link to="/" className="flex items-center space-x-2" onClick={() => setSidebarOpen(false)}>
                <img src="/logo-1.png" alt="Aptiprep Logo" className="w-8 h-8 rounded-lg object-cover" />
                <span className="font-bold text-primary-900 dark:text-dark-text-primary">APTIPREP</span>
              </Link>
            )}
            {/* Collapse button hidden on mobile, show on md+ if desired */}
            <div className="hidden md:block">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-primary-100 dark:hover:bg-dark-secondary transition-colors"
                aria-label="Toggle sidebar"
              >
                <span className="text-xl">{sidebarOpen ? '◀' : '▶'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {filteredNavItems.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.href}
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
                    ${currentPage === item.id
                      ? 'bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-300'
                      : 'text-primary-600 hover:text-primary-900 hover:bg-primary-100 dark:text-dark-text-secondary dark:hover:text-dark-text-primary dark:hover:bg-dark-secondary'
                    }
                  `}
                  onClick={() => {
                    // close on mobile after navigation
                    if (window.innerWidth < 768) setSidebarOpen(false);
                  }}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
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

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[9999] md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white dark:bg-dark-card border-b border-primary-200 dark:border-dark-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Hamburger for mobile */}
              <button
                className="md:hidden p-2 rounded-lg border border-primary-200 dark:border-dark-border"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
                aria-controls="admin-sidebar"
                aria-expanded={sidebarOpen}
              >
                ☰
              </button>
              <button onClick={() => navigate(-1)} className="btn-outline btn-sm">← Back</button>
              <h1 className="text-2xl font-bold text-primary-900 dark:text-dark-text-primary">
                {filteredNavItems.find(item => item.id === currentPage)?.name || 'Dashboard'}
              </h1>
              <p className="text-primary-600 dark:text-dark-text-secondary">
                Welcome back, {adminUser?.name}
              </p>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-primary-600 dark:text-dark-text-secondary hover:text-primary-900 dark:hover:text-dark-text-primary transition-colors">
                <span className="text-xl">🔔</span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-error-500 rounded-full"></span>
              </button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Quick Actions (desktop) */}
              <div className="items-center space-x-2 hidden md:flex">
                <button className="btn-outline btn-sm" onClick={() => navigate('/admin/dashboard')}>
                  📊 Quick Stats
                </button>
                <button className="btn-primary btn-sm" onClick={() => navigate('/admin/add-content')}>
                  ➕ Add Content
                </button>
              </div>
            </div>
          </div>
          {/* Mobile actions row */}
          <div className="mt-3 flex items-center gap-2 md:hidden">
            <button className="btn-outline btn-xs" onClick={() => navigate('/')}>🏠 Home</button>
            <button className="btn-primary btn-xs" onClick={() => navigate('/admin/add-content')}>➕ Add Content</button>
            <button className="btn-outline btn-xs" onClick={() => navigate('/admin/manage-content')}>🗂️ Manage</button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
