import Header from './components/Header'
import Hero from './components/Hero'
import ValueProposition from './components/ValueProposition'
import HowItWorks from './components/HowItWorks'
import FeaturedCourses from './components/FeaturedCourses'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
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
import NotFound from './pages/NotFound.jsx'

function App() {
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
    <div className="min-h-screen bg-white dark:bg-dark-primary">
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={Home} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:slug" element={<Course />} />
          <Route path="/courses/:slug/:lesson" element={<Lesson />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/practice/session" element={<PracticeSession />} />
          <Route path="/tests" element={<Tests />} />
          <Route path="/tests/:id/attempt" element={<TestAttempt />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
