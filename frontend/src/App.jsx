import Header from './components/Header'
import Hero from './components/Hero'
import ValueProposition from './components/ValueProposition'
import HowItWorks from './components/HowItWorks'
import FeaturedCourses from './components/FeaturedCourses'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import ProtectedRoute, { AdminRoute, PublicRoute, AdminOnlyRoute } from './components/ProtectedRoute'
import { useLocation, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Routes, Route } from 'react-router-dom'
import Courses from './pages/Courses.jsx'
import Course from './pages/Course.jsx'
import Lesson from './pages/Lesson.jsx'
import Practice from './pages/Practice.jsx'
import PracticeSession from './pages/PracticeSession.jsx'
import Tests from './pages/Tests.jsx'
import TestAttempt from './pages/TestAttempt.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Analytics from './pages/Analytics.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import About from './pages/About.jsx'
import ComingSoon from './pages/ComingSoon.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AdminLogin from './admin/AdminLogin.jsx'
import AddContent from './admin/AddContent.jsx'
import ManageContent from './admin/ManageContent.jsx'
import SetAdminRole from './admin/SetAdminRole.jsx'
import LearningContent from './pages/LearningContent.jsx'
import NotFound from './pages/NotFound.jsx'

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const Home = (
    <>
      <Hero />
      <ValueProposition />
      <HowItWorks />
      <FeaturedCourses />
      <Testimonials />
    </>
  )

  return (
    <AuthProvider>
      <div className="min-h-screen bg-white dark:bg-dark-primary">
        <ScrollToTop />
        {!isAdminRoute && <Header />}
        <main>
          <Routes>
            <Route path="/" element={Home} />
            
            {/* Public routes (only accessible when NOT logged in) */}
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/signup" element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            } />
            
            {/* Protected routes (require authentication) */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/courses" element={
              <ProtectedRoute>
                <Courses />
              </ProtectedRoute>
            } />
            <Route path="/courses/:slug" element={
              <ProtectedRoute>
                <Course />
              </ProtectedRoute>
            } />
            <Route path="/courses/:slug/:lesson" element={
              <ProtectedRoute>
                <Lesson />
              </ProtectedRoute>
            } />
            <Route path="/practice" element={
              <ProtectedRoute>
                <Practice />
              </ProtectedRoute>
            } />
            <Route path="/practice/session" element={
              <ProtectedRoute>
                <PracticeSession />
              </ProtectedRoute>
            } />
            <Route path="/tests" element={
              <ProtectedRoute>
                <Tests />
              </ProtectedRoute>
            } />
            <Route path="/tests/:id/attempt" element={
              <ProtectedRoute>
                <TestAttempt />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            } />
            
            {/* Public About page */}
            <Route path="/about" element={<About />} />

            {/* Public Coming Soon page */}
            <Route path="/coming-soon" element={<ComingSoon />} />

            {/* Learning Content - accessible to all authenticated users */}
            <Route path="/learning" element={
              <ProtectedRoute>
                <LearningContent />
              </ProtectedRoute>
            } />
            
            {/* Admin module: separate login and guarded dashboard */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/set-role" element={
              <ProtectedRoute>
                <SetAdminRole />
              </ProtectedRoute>
            } />
            <Route path="/Admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={
              <AdminOnlyRoute>
                <AdminDashboard />
              </AdminOnlyRoute>
            } />
            <Route path="/admin/add-content" element={
              <AdminOnlyRoute>
                <AddContent />
              </AdminOnlyRoute>
            } />
            <Route path="/admin/manage-content" element={
              <AdminOnlyRoute>
                <ManageContent />
              </AdminOnlyRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        {!isAdminRoute && <Footer />}
      </div>
    </AuthProvider>
  )
}

export default App
