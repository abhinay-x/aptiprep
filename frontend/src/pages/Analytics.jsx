export default function Analytics() {
  const performanceData = {
    overallScore: 78,
    testsTaken: 12,
    practiceSessions: 45,
    studyHours: 24,
    trends: {
      scoreChange: 5,
      testsChange: 2,
      sessionsChange: 8,
      hoursChange: 3
    }
  }

  const sectionWiseData = [
    { section: 'QA', score: 80, color: 'bg-success-500' },
    { section: 'LR', score: 65, color: 'bg-accent-500' },
    { section: 'DI', score: 45, color: 'bg-error-500' }
  ]

  const recentActivity = [
    { type: 'test', name: 'CAT Mock Test #3', score: '82%', date: '2 hours ago' },
    { type: 'practice', name: 'Percentage Problems', score: '9/10', date: '1 day ago' },
    { type: 'test', name: 'QA Sectional Test', score: '78%', date: '3 days ago' },
    { type: 'practice', name: 'Time & Work', score: '7/10', date: '5 days ago' }
  ]

  const mistakePatterns = [
    { type: 'Calculation', percentage: 35, color: 'bg-error-500' },
    { type: 'Conceptual', percentage: 40, color: 'bg-accent-500' },
    { type: 'Silly', percentage: 25, color: 'bg-success-500' }
  ]

  const recommendations = [
    'Focus on Data Interpretation - your weakest section',
    'Practice speed in Quantitative Aptitude',
    'Review Logical Reasoning concepts',
    'Work on calculation accuracy'
  ]

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-dark-secondary">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-900 dark:text-dark-text-primary mb-2">
            📊 Performance Analytics
          </h1>
          <p className="text-primary-600 dark:text-dark-text-secondary">
            Last Updated: 2 hours ago
          </p>
        </div>

        {/* Key Metrics Row */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            { 
              label: 'Overall Score', 
              value: `${performanceData.overallScore}%`, 
              change: performanceData.trends.scoreChange,
              icon: '🎯'
            },
            { 
              label: 'Tests Taken', 
              value: performanceData.testsTaken, 
              change: performanceData.trends.testsChange,
              icon: '📝'
            },
            { 
              label: 'Practice Sessions', 
              value: performanceData.practiceSessions, 
              change: performanceData.trends.sessionsChange,
              icon: '🎯'
            },
            { 
              label: 'Study Hours', 
              value: performanceData.studyHours, 
              change: performanceData.trends.hoursChange,
              icon: '⏱️'
            }
          ].map((metric, index) => (
            <div key={index} className="bg-white dark:bg-dark-card p-6 rounded-lg border border-primary-200 dark:border-dark-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{metric.icon}</span>
                <span className={`text-sm font-medium ${metric.change > 0 ? 'text-success-500' : 'text-error-500'}`}>
                  {metric.change > 0 ? '+' : ''}{metric.change} {metric.change > 0 ? '↗' : '↘'}
                </span>
              </div>
              <div className="text-2xl font-bold text-primary-900 dark:text-dark-text-primary mb-1">
                {metric.value}
              </div>
              <div className="text-sm text-primary-600 dark:text-dark-text-secondary">
                {metric.label}
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Performance Trend */}
            <div className="bg-white dark:bg-dark-card p-6 rounded-lg border border-primary-200 dark:border-dark-border">
              <h3 className="text-xl font-semibold text-primary-900 dark:text-dark-text-primary mb-4">
                📈 Performance Trend
              </h3>
              <div className="h-64 bg-primary-50 dark:bg-dark-secondary rounded-lg flex items-center justify-center">
                <div className="text-center text-primary-600 dark:text-dark-text-secondary">
                  <div className="text-4xl mb-2">📊</div>
                  <div>Line Chart - Score over time</div>
                  <div className="text-sm mt-2">Showing improvement from 65% to 78%</div>
                </div>
              </div>
            </div>

            {/* Section-wise Breakdown */}
            <div className="bg-white dark:bg-dark-card p-6 rounded-lg border border-primary-200 dark:border-dark-border">
              <h3 className="text-xl font-semibold text-primary-900 dark:text-dark-text-primary mb-4">
                📊 Section-wise Breakdown
              </h3>
              <div className="space-y-4">
                {sectionWiseData.map((section, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-primary-900 dark:text-dark-text-primary">
                        {section.section}:
                      </span>
                      <span className="font-semibold">{section.score}%</span>
                    </div>
                    <div className="h-3 bg-primary-200 dark:bg-dark-border rounded-full">
                      <div 
                        className={`h-3 rounded-full ${section.color} transition-all duration-500`}
                        style={{ width: `${section.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white dark:bg-dark-card p-6 rounded-lg border border-primary-200 dark:border-dark-border">
              <h3 className="text-xl font-semibold text-primary-900 dark:text-dark-text-primary mb-4">
                💡 Recommendations
              </h3>
              <div className="space-y-3">
                {recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-accent-50 dark:bg-accent-900/20 rounded-lg">
                    <span className="text-accent-500 mt-0.5">•</span>
                    <span className="text-primary-700 dark:text-dark-text-primary">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Topic Mastery */}
            <div className="bg-white dark:bg-dark-card p-6 rounded-lg border border-primary-200 dark:border-dark-border">
              <h3 className="text-xl font-semibold text-primary-900 dark:text-dark-text-primary mb-4">
                🎯 Topic Mastery
              </h3>
              <div className="h-64 bg-primary-50 dark:bg-dark-secondary rounded-lg flex items-center justify-center">
                <div className="text-center text-primary-600 dark:text-dark-text-secondary">
                  <div className="text-4xl mb-2">🗺️</div>
                  <div>Heat Map / Bar Chart</div>
                  <div className="text-sm mt-2">Topic-wise performance visualization</div>
                </div>
              </div>
            </div>

            {/* Time Analysis */}
            <div className="bg-white dark:bg-dark-card p-6 rounded-lg border border-primary-200 dark:border-dark-border">
              <h3 className="text-xl font-semibold text-primary-900 dark:text-dark-text-primary mb-4">
                ⏱️ Time Analysis
              </h3>
              <div className="h-48 bg-primary-50 dark:bg-dark-secondary rounded-lg flex items-center justify-center">
                <div className="text-center text-primary-600 dark:text-dark-text-secondary">
                  <div className="text-4xl mb-2">⏰</div>
                  <div>Time per question chart</div>
                  <div className="text-sm mt-2">Average: 2.3 min/question</div>
                </div>
              </div>
            </div>

            {/* Mistake Patterns */}
            <div className="bg-white dark:bg-dark-card p-6 rounded-lg border border-primary-200 dark:border-dark-border">
              <h3 className="text-xl font-semibold text-primary-900 dark:text-dark-text-primary mb-4">
                🎲 Mistake Patterns
              </h3>
              <div className="space-y-4">
                {mistakePatterns.map((pattern, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-primary-900 dark:text-dark-text-primary">
                        {pattern.type}:
                      </span>
                      <span className="font-semibold">{pattern.percentage}%</span>
                    </div>
                    <div className="h-2 bg-primary-200 dark:bg-dark-border rounded-full">
                      <div 
                        className={`h-2 rounded-full ${pattern.color} transition-all duration-500`}
                        style={{ width: `${pattern.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-primary-900 dark:text-dark-text-primary mb-4">
            📅 Recent Activity
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-dark-card p-4 rounded-lg border border-primary-200 dark:border-dark-border">
              <h4 className="font-medium text-primary-900 dark:text-dark-text-primary mb-3">Test History</h4>
              <div className="space-y-2">
                {recentActivity.filter(item => item.type === 'test').map((item, index) => (
                  <div key={index} className="text-sm">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-primary-600 dark:text-dark-text-secondary">
                      {item.score} • {item.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-dark-card p-4 rounded-lg border border-primary-200 dark:border-dark-border">
              <h4 className="font-medium text-primary-900 dark:text-dark-text-primary mb-3">Practice Sessions</h4>
              <div className="space-y-2">
                {recentActivity.filter(item => item.type === 'practice').map((item, index) => (
                  <div key={index} className="text-sm">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-primary-600 dark:text-dark-text-secondary">
                      {item.score} • {item.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-dark-card p-4 rounded-lg border border-primary-200 dark:border-dark-border">
              <h4 className="font-medium text-primary-900 dark:text-dark-text-primary mb-3">Study Streak</h4>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-500 mb-1">🔥 7</div>
                <div className="text-sm text-primary-600 dark:text-dark-text-secondary">Days</div>
                <div className="text-xs text-primary-500 dark:text-dark-text-secondary mt-2">
                  Keep it up! You're on fire!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
