import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Redirect to dashboard on success
      window.location.href = '/dashboard'
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-dark-secondary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-vibrant-green-500 to-vibrant-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-2xl font-bold text-primary-900 dark:text-dark-text-primary">Aptiprep</span>
          </Link>
          <h2 className="text-3xl font-bold text-primary-900 dark:text-dark-text-primary">
            Welcome back
          </h2>
          <p className="mt-2 text-primary-600 dark:text-dark-text-secondary">
            Sign in to your account to continue learning
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-dark-card rounded-lg shadow-lg border border-primary-200 dark:border-dark-border p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary-900 dark:text-dark-text-primary mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input w-full"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-primary-900 dark:text-dark-text-primary mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input w-full pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-primary-600 dark:text-dark-text-secondary hover:text-primary-900 dark:hover:text-dark-text-primary"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-accent-500 focus:ring-accent-500 border-primary-300 dark:border-dark-border rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-primary-600 dark:text-dark-text-secondary">
                  Remember me
                </label>
              </div>
              <Link 
                to="/forgot-password" 
                className="text-sm text-accent-500 hover:text-accent-600 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-primary-200 dark:border-dark-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-dark-card text-primary-600 dark:text-dark-text-secondary">
                  Or continue with
                </span>
              </div>
            </div>
          </div>

          {/* Social Login */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="btn-outline flex items-center justify-center">
              <span className="mr-2">🔍</span>
              Google
            </button>
            <button className="btn-outline flex items-center justify-center">
              <span className="mr-2">📘</span>
              Facebook
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-primary-600 dark:text-dark-text-secondary">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="font-medium text-accent-500 hover:text-accent-600"
              >
                Get started for free
              </Link>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="text-center">
          <p className="text-sm text-primary-500 dark:text-dark-text-secondary mb-4">
            Join 10,000+ students who are already learning with us
          </p>
          <div className="flex justify-center space-x-6 text-xs text-primary-600 dark:text-dark-text-secondary">
            <div className="flex items-center">
              <span className="mr-1">✅</span>
              Free courses
            </div>
            <div className="flex items-center">
              <span className="mr-1">📊</span>
              Progress tracking
            </div>
            <div className="flex items-center">
              <span className="mr-1">🏆</span>
              Certificates
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
