import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'

export default function Lesson() {
  const { slug, lesson } = useParams()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(330) // 5:30
  const [duration] = useState(765) // 12:45

  const lessonData = {
    title: 'Percentage Applications',
    section: 'Section 2 of 8',
    courseTitle: 'Quantitative Aptitude Mastery',
    lessonNumber: 12,
    totalLessons: 25,
    progress: 48
  }

  const curriculum = [
    {
      title: 'Section 1: Basics',
      lessons: [
        { title: 'Introduction', completed: true },
        { title: 'Number Types', completed: true },
        { title: 'Practice Quiz', completed: true }
      ]
    },
    {
      title: 'Section 2: Percentages',
      lessons: [
        { title: 'Percentage Basics', completed: true },
        { title: 'Applications', current: true },
        { title: 'Advanced Problems', completed: false },
        { title: 'Practice Quiz', completed: false }
      ]
    },
    {
      title: 'Section 3: Profit & Loss',
      lessons: [
        { title: 'Basic Concepts', completed: false },
        { title: 'Discount & Markup', completed: false },
        { title: 'Practice Quiz', completed: false }
      ]
    }
  ]

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-primary">
      {/* Video Player Area */}
      <div className="grid lg:grid-cols-4 gap-0">
        <div className="lg:col-span-3">
          {/* Video Player */}
          <div className="relative bg-black aspect-video">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">📹</div>
                <div className="text-xl">Video Player</div>
                <div className="text-sm opacity-75 mt-2">Lesson: {lessonData.title}</div>
              </div>
            </div>
            
            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center gap-4 text-white">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-2xl hover:text-accent-400"
                >
                  {isPlaying ? '⏸️' : '▶️'}
                </button>
                <button className="text-xl hover:text-accent-400">⏮️</button>
                <button className="text-xl hover:text-accent-400">⏭️</button>
                <button className="text-xl hover:text-accent-400">🔊</button>
                
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-sm">{formatTime(currentTime)}</span>
                  <div className="flex-1 h-1 bg-white/30 rounded">
                    <div 
                      className="h-1 bg-accent-500 rounded"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm">{formatTime(duration)}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <select className="bg-black/50 border border-white/30 rounded px-2 py-1">
                    <option>720p</option>
                    <option>480p</option>
                    <option>360p</option>
                  </select>
                  <select className="bg-black/50 border border-white/30 rounded px-2 py-1">
                    <option>1.0x</option>
                    <option>1.25x</option>
                    <option>1.5x</option>
                    <option>2.0x</option>
                  </select>
                  <button className="hover:text-accent-400">📺</button>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Info Bar */}
          <div className="bg-primary-50 dark:bg-dark-secondary border-b border-primary-200 dark:border-dark-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-primary-900 dark:text-dark-text-primary">
                  Lesson {lessonData.lessonNumber}: {lessonData.title}
                </h1>
                <p className="text-primary-600 dark:text-dark-text-secondary">
                  {lessonData.section} • {lessonData.courseTitle}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link 
                  to={`/courses/${slug}/lesson-${lessonData.lessonNumber - 1}`}
                  className="btn-outline btn-sm"
                >
                  ← Previous
                </Link>
                <button className="btn-primary btn-sm">
                  Mark Complete
                </button>
                <Link 
                  to={`/courses/${slug}/lesson-${lessonData.lessonNumber + 1}`}
                  className="btn-primary btn-sm"
                >
                  Next →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="bg-primary-50 dark:bg-dark-secondary border-l border-primary-200 dark:border-dark-border">
          <div className="p-4">
            {/* Course Progress */}
            <div className="mb-6">
              <h3 className="font-semibold text-primary-900 dark:text-dark-text-primary mb-2">
                📚 Course Progress
              </h3>
              <div className="flex items-center justify-between text-sm text-primary-600 dark:text-dark-text-secondary mb-2">
                <span>{lessonData.lessonNumber}/{lessonData.totalLessons} Lessons</span>
                <span>{lessonData.progress}%</span>
              </div>
              <div className="h-2 bg-primary-200 dark:bg-dark-border rounded-full">
                <div 
                  className="h-2 bg-accent-500 rounded-full transition-all duration-300"
                  style={{ width: `${lessonData.progress}%` }}
                />
              </div>
            </div>

            {/* Curriculum */}
            <div>
              <h3 className="font-semibold text-primary-900 dark:text-dark-text-primary mb-4">
                📋 Curriculum
              </h3>
              <div className="space-y-3">
                {curriculum.map((section, sectionIndex) => (
                  <div key={sectionIndex}>
                    <div className="font-medium text-sm text-primary-800 dark:text-dark-text-primary mb-2">
                      📂 {section.title}
                    </div>
                    <div className="space-y-1 ml-4">
                      {section.lessons.map((lesson, lessonIndex) => (
                        <div 
                          key={lessonIndex}
                          className={`flex items-center gap-2 p-2 rounded text-sm cursor-pointer transition-colors ${
                            lesson.current 
                              ? 'bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300' 
                              : 'text-primary-600 dark:text-dark-text-secondary hover:bg-primary-100 dark:hover:bg-dark-card'
                          }`}
                        >
                          <span className="text-xs">
                            {lesson.completed ? '✅' : lesson.current ? '🔄' : '⏸️'}
                          </span>
                          <span className="flex-1">{lesson.title}</span>
                          {lesson.current && <span>←</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes Section (Future) */}
            <div className="mt-8 p-4 bg-white dark:bg-dark-card rounded-lg">
              <h4 className="font-medium text-primary-900 dark:text-dark-text-primary mb-2">📝 Notes</h4>
              <p className="text-sm text-primary-600 dark:text-dark-text-secondary">
                Take notes while watching the lesson. Coming soon!
              </p>
            </div>

            {/* Downloads Section (Future) */}
            <div className="mt-4 p-4 bg-white dark:bg-dark-card rounded-lg">
              <h4 className="font-medium text-primary-900 dark:text-dark-text-primary mb-2">💾 Downloads</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>📄 Lesson Notes</span>
                  <button className="text-accent-500 hover:text-accent-600">↓</button>
                </div>
                <div className="flex items-center justify-between">
                  <span>📊 Practice Sheet</span>
                  <button className="text-accent-500 hover:text-accent-600">↓</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
