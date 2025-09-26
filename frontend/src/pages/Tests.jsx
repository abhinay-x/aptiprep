import { Link } from 'react-router-dom'

export default function Tests() {
  const mockTests = [
    {
      id: 1,
      title: 'CAT Mock Test #1',
      description: 'Full-length CAT simulation with latest pattern',
      duration: '180 minutes',
      questions: 66,
      sections: ['QA', 'DILR', 'VARC'],
      difficulty: 'Medium',
      attempts: 1245,
      rating: 4.8,
      tags: ['CAT', 'Full Length', 'Latest Pattern']
    },
    {
      id: 2,
      title: 'XAT Mock Test #1',
      description: 'Complete XAT practice test with decision making',
      duration: '210 minutes',
      questions: 75,
      sections: ['QA', 'DILR', 'VARC', 'DM'],
      difficulty: 'Hard',
      attempts: 856,
      rating: 4.7,
      tags: ['XAT', 'Decision Making', 'Full Length']
    },
    {
      id: 3,
      title: 'Quantitative Aptitude Sectional',
      description: 'Focus on QA section with adaptive difficulty',
      duration: '60 minutes',
      questions: 22,
      sections: ['QA'],
      difficulty: 'Medium',
      attempts: 2341,
      rating: 4.9,
      tags: ['Sectional', 'QA Only', 'Adaptive']
    },
    {
      id: 4,
      title: 'TCS NQT Mock Test',
      description: 'Complete TCS National Qualifier Test simulation',
      duration: '120 minutes',
      questions: 50,
      sections: ['Numerical', 'Verbal', 'Reasoning', 'Programming'],
      difficulty: 'Easy',
      attempts: 3456,
      rating: 4.6,
      tags: ['TCS', 'Placement', 'Programming']
    }
  ]

  const recentAttempts = [
    { test: 'CAT Mock Test #1', score: '78%', percentile: '92nd', date: '2 days ago' },
    { test: 'QA Sectional Test', score: '85%', percentile: '96th', date: '1 week ago' },
    { test: 'XAT Mock Test #1', score: '72%', percentile: '88th', date: '2 weeks ago' }
  ]

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400'
      case 'medium': return 'bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-400'
      case 'hard': return 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400'
      default: return 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
    }
  }

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-dark-secondary">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-900 dark:text-dark-text-primary mb-2">
            📝 Mock Tests & Assessments
          </h1>
          <p className="text-primary-600 dark:text-dark-text-secondary">
            Practice with real exam simulations and track your progress
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white dark:bg-dark-card p-4 rounded-lg mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <select className="input">
              <option>All Exams</option>
              <option>CAT</option>
              <option>XAT</option>
              <option>SNAP</option>
              <option>TCS NQT</option>
              <option>Infosys</option>
            </select>
            
            <select className="input">
              <option>All Types</option>
              <option>Full Length</option>
              <option>Sectional</option>
              <option>Topic Wise</option>
            </select>

            <select className="input">
              <option>All Difficulties</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>

            <div className="flex-1">
              <input 
                type="text" 
                placeholder="🔍 Search tests..."
                className="input w-full"
              />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Available Tests */}
            <div>
              <h2 className="text-xl font-semibold text-primary-900 dark:text-dark-text-primary mb-6">
                Available Tests
              </h2>
              <div className="space-y-4">
                {mockTests.map(test => (
                  <div key={test.id} className="bg-white dark:bg-dark-card rounded-lg border border-primary-200 dark:border-dark-border p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-primary-900 dark:text-dark-text-primary">
                            {test.title}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(test.difficulty)}`}>
                            {test.difficulty}
                          </span>
                        </div>
                        <p className="text-primary-600 dark:text-dark-text-secondary mb-3">
                          {test.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {test.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-primary-100 dark:bg-dark-secondary text-primary-700 dark:text-dark-text-secondary text-xs rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-primary-600 dark:text-dark-text-secondary">Duration:</span>
                          <span className="font-medium">⏱️ {test.duration}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-primary-600 dark:text-dark-text-secondary">Questions:</span>
                          <span className="font-medium">❓ {test.questions}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-primary-600 dark:text-dark-text-secondary">Sections:</span>
                          <span className="font-medium">📚 {test.sections.join(', ')}</span>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-primary-600 dark:text-dark-text-secondary">Rating:</span>
                          <div className="flex items-center gap-1">
                            <span className="text-accent-500">⭐</span>
                            <span className="font-medium">{test.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-primary-600 dark:text-dark-text-secondary">Attempts:</span>
                          <span className="font-medium">👥 {test.attempts.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link 
                        to={`/tests/${test.id}/attempt`}
                        className="btn-primary flex-1"
                      >
                        🚀 Start Test
                      </Link>
                      <button className="btn-outline">
                        📊 View Analysis
                      </button>
                      <button className="btn-outline">
                        📄 Instructions
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Attempts */}
            <div>
              <h2 className="text-xl font-semibold text-primary-900 dark:text-dark-text-primary mb-4">
                📈 Recent Attempts
              </h2>
              <div className="bg-white dark:bg-dark-card rounded-lg border border-primary-200 dark:border-dark-border">
                <div className="divide-y divide-primary-200 dark:divide-dark-border">
                  {recentAttempts.map((attempt, index) => (
                    <div key={index} className="p-4 flex items-center justify-between hover:bg-primary-50 dark:hover:bg-dark-secondary">
                      <div>
                        <h4 className="font-medium text-primary-900 dark:text-dark-text-primary">
                          {attempt.test}
                        </h4>
                        <p className="text-sm text-primary-600 dark:text-dark-text-secondary">
                          📅 {attempt.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-primary-900 dark:text-dark-text-primary">
                          {attempt.score}
                        </div>
                        <div className="text-sm text-primary-600 dark:text-dark-text-secondary">
                          {attempt.percentile} percentile
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-primary-200 dark:border-dark-border">
                  <Link to="/analytics" className="btn-outline w-full">
                    View Detailed Analytics
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Test Stats */}
            <div className="bg-white dark:bg-dark-card p-6 rounded-lg border border-primary-200 dark:border-dark-border">
              <h3 className="font-semibold text-primary-900 dark:text-dark-text-primary mb-4">
                📊 Your Test Stats
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Tests Taken', value: '24', icon: '📝' },
                  { label: 'Avg Score', value: '76%', icon: '🎯' },
                  { label: 'Best Score', value: '89%', icon: '🏆' },
                  { label: 'Time Saved', value: '12h', icon: '⏱️' }
                ].map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{stat.icon}</span>
                      <span className="text-primary-600 dark:text-dark-text-secondary">{stat.label}</span>
                    </div>
                    <span className="font-semibold">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Tests */}
            <div className="bg-white dark:bg-dark-card p-6 rounded-lg border border-primary-200 dark:border-dark-border">
              <h3 className="font-semibold text-primary-900 dark:text-dark-text-primary mb-4">
                📅 Upcoming Tests
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'CAT 2024', date: 'Nov 26, 2024', type: 'Official' },
                  { name: 'XAT 2025', date: 'Jan 5, 2025', type: 'Official' },
                  { name: 'SNAP 2024', date: 'Dec 10, 2024', type: 'Official' }
                ].map((exam, index) => (
                  <div key={index} className="p-3 bg-primary-50 dark:bg-dark-secondary rounded-lg">
                    <div className="font-medium text-sm text-primary-900 dark:text-dark-text-primary">
                      {exam.name}
                    </div>
                    <div className="text-xs text-primary-600 dark:text-dark-text-secondary">
                      {exam.date} • {exam.type}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-dark-card p-6 rounded-lg border border-primary-200 dark:border-dark-border">
              <h3 className="font-semibold text-primary-900 dark:text-dark-text-primary mb-4">
                ⚡ Quick Actions
              </h3>
              <div className="space-y-3">
                <Link to="/tests/1/attempt" className="btn-primary w-full">
                  🚀 Take Random Test
                </Link>
                <Link to="/practice" className="btn-outline w-full">
                  🎯 Practice Weak Areas
                </Link>
                <Link to="/analytics" className="btn-outline w-full">
                  📊 View Performance
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
