import { Link } from 'react-router-dom'

export default function Courses() {
  const courses = [
    {
      id: 'quantitative-aptitude',
      title: 'Quantitative Aptitude Mastery',
      description: 'Master all topics from basics to advanced level',
      instructor: 'Prof. Sharma',
      rating: 4.8,
      reviews: 1234,
      lessons: 25,
      duration: '15 hours',
      level: 'Beginner',
      price: 'Free',
      enrolled: 5420,
      tags: ['Mathematics', 'Problem Solving', 'CAT Prep']
    },
    {
      id: 'logical-reasoning',
      title: 'Logical Reasoning Complete',
      description: 'Develop logical thinking and analytical skills',
      instructor: 'Dr. Patel',
      rating: 4.7,
      reviews: 856,
      lessons: 20,
      duration: '12 hours',
      level: 'Intermediate',
      price: 'Free',
      enrolled: 3240,
      tags: ['Logic', 'Critical Thinking', 'Puzzles']
    },
    {
      id: 'data-interpretation',
      title: 'Data Interpretation & Analysis',
      description: 'Analyze charts, graphs, and tables effectively',
      instructor: 'Prof. Kumar',
      rating: 4.9,
      reviews: 623,
      lessons: 15,
      duration: '10 hours',
      level: 'Advanced',
      price: 'Free',
      enrolled: 2180,
      tags: ['Data Analysis', 'Charts', 'Statistics']
    }
  ]

  const getLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400'
      case 'intermediate': return 'bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-400'
      case 'advanced': return 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400'
      default: return 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
    }
  }

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-dark-secondary">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-900 dark:text-dark-text-primary mb-2">📚 All Courses</h1>
          <p className="text-primary-600 dark:text-dark-text-secondary">Master aptitude skills with our comprehensive library</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-white dark:bg-dark-card rounded-lg border border-primary-200 dark:border-dark-border overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-4xl">📹</span>
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>{course.level}</span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-primary-900 dark:text-dark-text-primary mb-2">{course.title}</h3>
                <p className="text-sm text-primary-600 dark:text-dark-text-secondary mb-3">{course.description}</p>

                <div className="flex items-center gap-1 mb-3">
                  <span className="text-accent-500">⭐</span>
                  <span className="font-medium">{course.rating}</span>
                  <span className="text-primary-600 dark:text-dark-text-secondary">({course.reviews.toLocaleString()})</span>
                </div>

                <div className="text-xs text-primary-600 dark:text-dark-text-secondary mb-4">📚 {course.lessons} Lessons • ⏱️ {course.duration}</div>

                <Link to={`/courses/${course.id}`} className="btn-primary w-full">View Course</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
