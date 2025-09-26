import { useState } from 'react'
import { useParams } from 'react-router-dom'

export default function Course() {
  const { slug } = useParams()
  const [activeTab, setActiveTab] = useState('overview')

  const courseData = {
    title: 'Quantitative Aptitude Mastery',
    description: 'Master all topics from basics to advanced',
    instructor: 'Prof. Sharma',
    rating: 4.8,
    reviews: 1234,
    lessons: 25,
    duration: '15 hours',
    level: 'Beginner',
    thumbnail: '/api/placeholder/300/200',
    enrolled: false
  }

  const curriculum = [
    {
      title: 'Number System',
      lessons: [
        { title: 'Introduction', duration: '5:30', type: 'video' },
        { title: 'Prime Numbers', duration: '8:45', type: 'video' },
        { title: 'LCM & HCF', duration: '12:20', type: 'video' },
        { title: 'Practice Quiz', duration: '10 questions', type: 'quiz' }
      ]
    },
    {
      title: 'Percentages',
      lessons: [
        { title: 'Basics', duration: '6:15', type: 'video' },
        { title: 'Applications', duration: '10:30', type: 'video' },
        { title: 'Advanced Problems', duration: '15:20', type: 'video' },
        { title: 'Practice Quiz', duration: '15 questions', type: 'quiz' }
      ]
    },
    {
      title: 'Profit & Loss',
      lessons: [
        { title: 'Basic Concepts', duration: '8:00', type: 'video' },
        { title: 'Discount & Markup', duration: '12:45', type: 'video' },
        { title: 'Practice Quiz', duration: '12 questions', type: 'quiz' }
      ]
    }
  ]

  const reviews = [
    { name: 'Anjali Sharma', rating: 5, comment: 'Excellent course! Helped me crack TCS placement.', date: '2 days ago' },
    { name: 'Rahul Kumar', rating: 4, comment: 'Great explanations and practice problems.', date: '1 week ago' },
    { name: 'Priya Singh', rating: 5, comment: 'Best aptitude course I have taken so far.', date: '2 weeks ago' }
  ]

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-dark-secondary">
      {/* Course Hero */}
      <div className="bg-white dark:bg-dark-primary border-b border-primary-200 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-80 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400">📹 Course Preview</span>
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-primary-900 dark:text-dark-text-primary mb-2">
                    {courseData.title}
                  </h1>
                  <p className="text-lg text-primary-600 dark:text-dark-text-secondary mb-4">
                    {courseData.description}
                  </p>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-primary-700 dark:text-dark-text-secondary">👨‍🏫 By {courseData.instructor}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-accent-500">⭐</span>
                      <span className="font-medium">{courseData.rating}</span>
                      <span className="text-primary-600 dark:text-dark-text-secondary">({courseData.reviews.toLocaleString()})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-primary-600 dark:text-dark-text-secondary">
                    <span>📚 {courseData.lessons} Lessons</span>
                    <span>⏱️ {courseData.duration}</span>
                    <span>🏷️ {courseData.level}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-primary-50 dark:bg-dark-secondary p-6 rounded-lg">
              <div className="space-y-4">
                <button className="btn-primary w-full">
                  🎯 Enroll Free
                </button>
                <button className="btn-outline w-full">
                  📱 Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white dark:bg-dark-primary border-b border-primary-200 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: '📋 Overview' },
              { id: 'curriculum', label: '📚 Curriculum' },
              { id: 'instructor', label: '👨‍🏫 Instructor' },
              { id: 'reviews', label: '💬 Reviews' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-accent-500 text-accent-600 dark:text-accent-400'
                    : 'border-transparent text-primary-600 dark:text-dark-text-secondary hover:text-primary-900 dark:hover:text-dark-text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-dark-card p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">What you'll learn</h3>
                  <ul className="space-y-2">
                    {[
                      'Master all aptitude topics from basics to advanced',
                      'Solve 1000+ practice problems with detailed solutions',
                      'Learn time-saving tricks and shortcuts',
                      'Crack placement tests with confidence'
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-success-500 mt-1">✅</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white dark:bg-dark-card p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Requirements</h3>
                  <ul className="space-y-2">
                    <li>• Basic mathematics knowledge (10th grade level)</li>
                    <li>• Internet connection for video streaming</li>
                    <li>• Dedication to practice regularly</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'curriculum' && (
              <div className="space-y-4">
                {curriculum.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="bg-white dark:bg-dark-card rounded-lg overflow-hidden">
                    <div className="p-4 bg-primary-50 dark:bg-dark-secondary border-b border-primary-200 dark:border-dark-border">
                      <h3 className="font-semibold">📂 Section {sectionIndex + 1}: {section.title}</h3>
                    </div>
                    <div className="divide-y divide-primary-200 dark:divide-dark-border">
                      {section.lessons.map((lesson, lessonIndex) => (
                        <div key={lessonIndex} className="p-4 flex items-center justify-between hover:bg-primary-50 dark:hover:bg-dark-secondary">
                          <div className="flex items-center gap-3">
                            <span>{lesson.type === 'video' ? '📹' : '🎯'}</span>
                            <span>{lesson.title}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-primary-600 dark:text-dark-text-secondary">
                              {lesson.duration}
                            </span>
                            <button className="text-accent-500 hover:text-accent-600">▶️</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'instructor' && (
              <div className="bg-white dark:bg-dark-card p-6 rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👨‍🏫</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Prof. Sharma</h3>
                    <p className="text-primary-600 dark:text-dark-text-secondary mb-4">
                      Senior Mathematics Faculty with 15+ years of experience in competitive exam preparation.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>📚 50+ Courses Created</div>
                      <div>👥 25,000+ Students Taught</div>
                      <div>⭐ 4.9 Average Rating</div>
                      <div>🏆 Top Instructor Badge</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <div key={index} className="bg-white dark:bg-dark-card p-6 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{review.name}</h4>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < review.rating ? 'text-accent-500' : 'text-gray-300'}>⭐</span>
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-primary-600 dark:text-dark-text-secondary">{review.date}</span>
                    </div>
                    <p className="text-primary-700 dark:text-dark-text-secondary">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-dark-card p-6 rounded-lg">
              <h3 className="font-semibold mb-4">Course Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Total Lessons</span>
                  <span className="font-medium">{courseData.lessons}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration</span>
                  <span className="font-medium">{courseData.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span>Level</span>
                  <span className="font-medium">{courseData.level}</span>
                </div>
                <div className="flex justify-between">
                  <span>Certificate</span>
                  <span className="font-medium">Yes</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-dark-card p-6 rounded-lg">
              <h3 className="font-semibold mb-4">Related Courses</h3>
              <div className="space-y-3">
                {['Logical Reasoning', 'Data Interpretation', 'Verbal Ability'].map((course, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border border-primary-200 dark:border-dark-border rounded-lg hover:bg-primary-50 dark:hover:bg-dark-secondary cursor-pointer">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                      📚
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{course}</div>
                      <div className="text-xs text-primary-600 dark:text-dark-text-secondary">⭐ 4.7 • 15 lessons</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
