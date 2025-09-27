import { useState, createContext, useContext, useEffect } from 'react';

// Admin Authentication Context
const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing admin session
  useEffect(() => {
    const checkAdminAuth = () => {
      try {
        const adminToken = localStorage.getItem('admin_token');
        const adminData = localStorage.getItem('admin_user');
        
        if (adminToken && adminData) {
          setAdminUser(JSON.parse(adminData));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking admin auth:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAdminAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      
      // Mock authentication - replace with actual API call
      const mockAdminUsers = [
        {
          id: 1,
          email: 'admin@aptiprep.co.in',
          password: 'admin123',
          name: 'Super Admin',
          role: 'super_admin',
          permissions: ['all']
        },
        {
          id: 2,
          email: 'content@aptiprep.co.in',
          password: 'content123',
          name: 'Content Manager',
          role: 'content_manager',
          permissions: ['videos', 'playlists', 'content']
        }
      ];

      const user = mockAdminUsers.find(
        u => u.email === credentials.email && u.password === credentials.password
      );

      if (user) {
        const { password, ...userWithoutPassword } = user;
        const token = `admin_token_${user.id}_${Date.now()}`;
        
        localStorage.setItem('admin_token', token);
        localStorage.setItem('admin_user', JSON.stringify(userWithoutPassword));
        
        setAdminUser(userWithoutPassword);
        setIsAuthenticated(true);
        
        return { success: true, user: userWithoutPassword };
      } else {
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setAdminUser(null);
    setIsAuthenticated(false);
  };

  const hasPermission = (permission) => {
    if (!adminUser) return false;
    return adminUser.permissions.includes('all') || adminUser.permissions.includes(permission);
  };

  const value = {
    isAuthenticated,
    adminUser,
    loading,
    login,
    logout,
    hasPermission
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

// Admin Login Component
export const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAdminAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(credentials);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setIsLoading(false);
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 dark:from-dark-primary dark:to-dark-secondary flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="text-2xl font-bold text-primary-900 dark:text-dark-text-primary">
              Aptiprep Admin
            </span>
          </div>
          <p className="text-primary-600 dark:text-dark-text-secondary">
            Sign in to access the admin dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
                <p className="text-error-700 dark:text-error-300 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-primary-700 dark:text-dark-text-primary mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                className="input"
                placeholder="admin@aptiprep.co.in"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 dark:text-dark-text-primary mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className="input"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-primary-50 dark:bg-dark-secondary rounded-lg">
            <h4 className="text-sm font-medium text-primary-700 dark:text-dark-text-primary mb-2">
              Demo Credentials:
            </h4>
            <div className="text-xs text-primary-600 dark:text-dark-text-secondary space-y-1">
              <p><strong>Super Admin:</strong> admin@aptiprep.co.in / admin123</p>
              <p><strong>Content Manager:</strong> content@aptiprep.co.in / content123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Protected Route Component
export const AdminProtectedRoute = ({ children, requiredPermission }) => {
  const { isAuthenticated, loading, hasPermission } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-primary-600 dark:text-dark-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-primary flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-primary-900 dark:text-dark-text-primary mb-2">
            Access Denied
          </h2>
          <p className="text-primary-600 dark:text-dark-text-secondary">
            You don't have permission to access this resource.
          </p>
        </div>
      </div>
    );
  }

  return children;
};
