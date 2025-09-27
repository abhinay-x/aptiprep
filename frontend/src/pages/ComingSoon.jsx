import { Link } from 'react-router-dom'

export default function ComingSoon() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white dark:bg-dark-primary flex items-center justify-center px-4">
      <div className="max-w-xl w-full text-center rounded-2xl border border-primary-100 dark:border-dark-border bg-white/80 dark:bg-dark-secondary/60 backdrop-blur-sm p-8">
        <div className="flex items-center justify-center mb-4">
          <img src="/logo-1.png" alt="Aptiprep Logo" className="w-12 h-12 rounded-lg object-cover" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary-900 dark:text-white">Feature will be implemented soon</h1>
        <p className="mt-2 text-primary-700 dark:text-dark-text-secondary">
          We’re working hard to bring this experience to the App Store and Google Play. Stay tuned!
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/" className="btn-primary">Go to Home</Link>
          <Link to="/about" className="btn-outline">About the Developers</Link>
        </div>
        <div className="mt-6 text-xs text-primary-500 dark:text-dark-text-secondary">
          If you reached here from a badge, mobile apps are not available yet. Web app works great on mobile browsers.
        </div>
      </div>
    </div>
  )
}
