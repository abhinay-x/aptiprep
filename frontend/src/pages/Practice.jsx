import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Practice() {
  const [selectedTopic, setSelectedTopic] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')

  const topics = [
    { id: 'number-system', name: 'Number System', icon: '🔢', mastery: 80, lastPracticed: 'Today' },
    { id: 'percentage', name: 'Percentage', icon: '📊', mastery: 60, lastPracticed: 'Yesterday' },
    { id: 'profit-loss', name: 'Profit & Loss', icon: '💰', mastery: 20, lastPracticed: '3 days ago' },
    { id: 'time-work', name: 'Time & Work', icon: '⏰', mastery: 0, lastPracticed: 'Never' },
    { id: 'ratio-proportion', name: 'Ratio & Proportion', icon: '⚖️', mastery: 45, lastPracticed: '1 week ago' },
    { id: 'simple-interest', name: 'Simple Interest', icon: '💵', mastery: 75, lastPracticed: '2 days ago' },
    { id: 'compound-interest', name: 'Compound Interest', icon: '📈', mastery: 30, lastPracticed: '5 days ago' },
    { id: 'algebra', name: 'Algebra', icon: '🔤', mastery: 55, lastPracticed: '4 days ago' }
  ]

  const recentSessions = [
    { topic: 'Percentage Problems', score: '8/10', rating: 3, time: 'Today, 2:30 PM' },
    { topic: 'Number System', score: '6/10', rating: 2, time: 'Yesterday, 4:15 PM' },
    { topic: 'Profit & Loss', score: '9/10', rating: 3, time: '2 days ago' },
    { topic: 'Simple Interest', score: '7/10', rating: 2, time: '3 days ago' }
  ]

  const getMasteryColor = (mastery) => {
    if (mastery >= 70) return 'bg-success-500'
    if (mastery >= 40) return 'bg-accent-500'
    return 'bg-error-500'
  }

  const getMasteryText = (mastery) => {
    if (mastery >= 70) return 'Expert'
    if (mastery >= 40) return 'Intermediate'
    if (mastery > 0) return 'Beginner'
    return 'Not Started'
  }

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-dark-secondary">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-900 dark:text-dark-text-primary mb-2">
            🎯 Adaptive Practice Hub
          </h1>
          <p className="text-primary-600 dark:text-dark-text-secondary">
            Practice smart with AI-powered adaptive questions
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white dark:bg-dark-card p-4 rounded-lg mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <select 
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="input"
            >
              <option value="all">All Topics</option>
              {topics.map(topic => (
                <option key={topic.id} value={topic.id}>{topic.name}</option>
              ))}
            </select>
            
            <select 
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="input"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <select className="input">
              <option>Any Duration</option>
              <option>5 minutes</option>
              <option>10 minutes</option>
              <option>15 minutes</option>
              <option>30 minutes</option>
            </select>

            <div className="flex-1">
              <input 
                type="text" 
                placeholder="🔍 Search topics..."
                className="input w-full"
              />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Topic Grid */}
            <div>
              <h2 className="text-xl font-semibold text-primary-900 dark:text-dark-text-primary mb-4">
                Practice Topics
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {topics.map(topic => (
                  <div key={topic.id} className="bg-white dark:bg-dark-card p-6 rounded-lg border border-primary-200 dark:border-dark-border hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{topic.icon}</span>
                        <div>
                          <h3 className="font-semibold text-primary-900 dark:text-dark-text-primary">
                            {topic.name}
                          </h3>
                          <p className="text-sm text-primary-600 dark:text-dark-text-secondary">
                            Last practiced: {topic.lastPracticed}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-primary-600 dark:text-dark-text-secondary">Mastery</span>
                        <span className="font-medium">{topic.mastery}% • {getMasteryText(topic.mastery)}</span>
                      </div>
                      <div className="h-2 bg-primary-200 dark:bg-dark-border rounded-full">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getMasteryColor(topic.mastery)}`}
                          style={{ width: `${topic.mastery}%` }}
                        />
                      </div>
                    </div>

                    <Link 
                      to="/practice/session"
                      className="btn-primary w-full"
                    >
                      Practice Now
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Practice Sessions */}
            <div>
              <h2 className="text-xl font-semibold text-primary-900 dark:text-dark-text-primary mb-4">
                📈 Your Practice History
              </h2>
              <div className="bg-white dark:bg-dark-card rounded-lg border border-primary-200 dark:border-dark-border">
                <div className="divide-y divide-primary-200 dark:divide-dark-border">
                  {recentSessions.map((session, index) => (
                    <div key={index} className="p-4 flex items-center justify-between hover:bg-primary-50 dark:hover:bg-dark-secondary">
                      <div>
                        <h4 className="font-medium text-primary-900 dark:text-dark-text-primary">
                          {session.topic}
                        </h4>
                        <p className="text-sm text-primary-600 dark:text-dark-text-secondary">
                          📅 {session.time}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium">{session.score}</div>
                          <div className="flex">
                            {[...Array(3)].map((_, i) => (
                              <span key={i} className={i < session.rating ? 'text-accent-500' : 'text-gray-300'}>⭐</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-primary-200 dark:border-dark-border">
                  <button className="btn-outline w-full">View All Sessions</button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Smart Recommendations */}
            <div className="bg-white dark:bg-dark-card p-6 rounded-lg border border-primary-200 dark:border-dark-border">
              <h3 className="font-semibold text-primary-900 dark:text-dark-text-primary mb-3">
                💡 Smart Recommendations
              </h3>
              <div className="bg-accent-50 dark:bg-accent-900/20 p-4 rounded-lg mb-4">
                <p className="text-sm text-primary-700 dark:text-dark-text-primary mb-3">
                  "Based on your performance, we recommend practicing 'Percentage Applications' next!"
                </p>
                <Link to="/practice/session" className="btn-primary btn-sm w-full">
                  Start Recommended Practice
                </Link>
              </div>
            </div>

            {/* Practice Stats */}
            <div className="bg-white dark:bg-dark-card p-6 rounded-lg border border-primary-200 dark:border-dark-border">
              <h3 className="font-semibold text-primary-900 dark:text-dark-text-primary mb-4">
                📊 This Week
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Sessions', value: '12', icon: '🎯' },
                  { label: 'Questions', value: '156', icon: '❓' },
                  { label: 'Accuracy', value: '78%', icon: '🎯' },
                  { label: 'Time Saved', value: '2.5h', icon: '⏱️' }
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

            {/* Quick Actions */}
            <div className="bg-white dark:bg-dark-card p-6 rounded-lg border border-primary-200 dark:border-dark-border">
              <h3 className="font-semibold text-primary-900 dark:text-dark-text-primary mb-4">
                ⚡ Quick Actions
              </h3>
              <div className="space-y-3">
                <Link to="/practice/session" className="btn-outline w-full">
                  🎲 Random Practice
                </Link>
                <Link to="/practice/session" className="btn-outline w-full">
                  🔄 Review Mistakes
                </Link>
                <Link to="/tests" className="btn-outline w-full">
                  📝 Take Mock Test
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
