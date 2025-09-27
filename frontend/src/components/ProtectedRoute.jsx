import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, requireRole = null, requireAuth = true }) {
  const { currentUser, userProfile, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If authentication is required but user is not logged in
  if (requireAuth && !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific role is required
  if (requireRole && (!userProfile || userProfile.role !== requireRole)) {
    // If user doesn't have required role, redirect based on their actual role
    if (userProfile?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (userProfile?.role === 'instructor') {
      return <Navigate to="/instructor/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}

// Specific role-based route components
export function AdminRoute({ children }) {
  return (
    <ProtectedRoute requireRole="admin">
      {children}
    </ProtectedRoute>
  );
}

// Admin-only route that sends unauthenticated users to /admin/login
export function AdminOnlyRoute({ children }) {
  const { currentUser, userProfile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (userProfile?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export function InstructorRoute({ children }) {
  const { userProfile } = useAuth();
  
  // Allow both instructors and admins
  if (userProfile?.role === 'admin' || userProfile?.role === 'instructor') {
    return <ProtectedRoute>{children}</ProtectedRoute>;
  }
  
  return <Navigate to="/dashboard" replace />;
}

export function StudentRoute({ children }) {
  return (
    <ProtectedRoute requireRole="student">
      {children}
    </ProtectedRoute>
  );
}

// Public route (only accessible when NOT logged in)
export function PublicRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If user is already logged in, redirect to appropriate dashboard
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
