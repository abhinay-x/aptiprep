import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-primary-50 dark:bg-dark-secondary flex items-center justify-center">
      <div className="text-center px-4">
        <div className="mb-8">
          <div className="text-8xl mb-4">🤔</div>
          <h1 className="text-6xl font-bold text-primary-900 dark:text-dark-text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-primary-700 dark:text-dark-text-secondary mb-2">
            Page Not Found
          </h2>
          <p className="text-primary-600 dark:text-dark-text-secondary max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        <div className="space-y-4">
          <Link 
            to="/" 
            className="btn-primary inline-flex items-center gap-2"
          >
            🏠 Go Home
          </Link>
          
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/courses" className="btn-outline btn-sm">
              📚 Browse Courses
            </Link>
            <Link to="/practice" className="btn-outline btn-sm">
              🎯 Practice Hub
            </Link>
            <Link to="/tests" className="btn-outline btn-sm">
              📝 Mock Tests
            </Link>
          </div>
        </div>

        <div className="mt-12 text-sm text-primary-500 dark:text-dark-text-secondary">
          If you think this is an error, please contact our support team.
        </div>
      </div>
    </div>
  )
}
