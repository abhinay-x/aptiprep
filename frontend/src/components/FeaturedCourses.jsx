const FeaturedCourses = () => {
  const courses = [
    {
      id: 1,
      title: 'Quantitative Aptitude',
      description: 'Master numbers, percentages, and mathematical reasoning',
      lessons: 25,
      duration: '15 hours',
      rating: 4.8,
      reviews: 1234,
      level: 'Beginner',
      thumbnail: '🔢',
      progress: 0,
      instructor: 'Prof. Sharma',
      topics: ['Number System', 'Percentages', 'Profit & Loss', 'Time & Work'],
      color: 'blue'
    },
    {
      id: 2,
      title: 'Logical Reasoning',
      description: 'Develop critical thinking and problem-solving skills',
      lessons: 20,
      duration: '12 hours',
      rating: 4.7,
      reviews: 856,
      level: 'Intermediate',
      thumbnail: '🧠',
      progress: 0,
      instructor: 'Dr. Patel',
      topics: ['Syllogisms', 'Blood Relations', 'Coding-Decoding', 'Puzzles'],
      color: 'green'
    },
    {
      id: 3,
      title: 'Data Interpretation',
      description: 'Analyze charts, graphs, and statistical data effectively',
      lessons: 15,
      duration: '10 hours',
      rating: 4.9,
      reviews: 623,
      level: 'Advanced',
      thumbnail: '📊',
      progress: 0,
      instructor: 'Ms. Singh',
      topics: ['Bar Charts', 'Line Graphs', 'Pie Charts', 'Tables'],
      color: 'purple'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-600 dark:text-blue-400',
        badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      },
      green: {
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-600 dark:text-green-400',
        badge: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      },
      purple: {
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        border: 'border-purple-200 dark:border-purple-800',
        text: 'text-purple-600 dark:text-purple-400',
        badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
      }
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <section className="py-20 bg-white dark:bg-dark-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-900 dark:text-dark-text-primary mb-4">
            Featured <span className="text-gradient">Courses</span>
          </h2>
          <p className="text-xl text-primary-600 dark:text-dark-text-secondary max-w-3xl mx-auto">
            Start your journey with our most popular and comprehensive courses
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {courses.map((course, index) => {
            const colors = getColorClasses(course.color);
            return (
              <div
                key={course.id}
                className={`
                  group card-hover overflow-hidden
                  transform hover:scale-105 transition-all duration-300
                  animate-slide-up
                `}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Course Thumbnail */}
                <div className={`relative h-48 ${colors.bg} flex items-center justify-center`}>
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {course.thumbnail}
                  </div>
                  
                  {/* Level Badge */}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${colors.badge}`}>
                    {course.level}
                  </div>

                  {/* Progress Overlay (if enrolled) */}
                  {course.progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-1 mt-1">
                        <div 
                          className="bg-accent-500 h-1 rounded-full transition-all duration-300"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Course Content */}
                <div className="p-6">
                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-primary-900 dark:text-dark-text-primary mb-2 group-hover:text-accent-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-primary-600 dark:text-dark-text-secondary mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Course Stats */}
                  <div className="flex items-center justify-between text-sm text-primary-500 dark:text-dark-text-secondary mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        📚 {course.lessons} Lessons
                      </span>
                      <span className="flex items-center">
                        ⏱️ {course.duration}
                      </span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <span className="text-accent-500">⭐</span>
                        <span className="font-semibold text-primary-900 dark:text-dark-text-primary ml-1">
                          {course.rating}
                        </span>
                      </div>
                      <span className="text-primary-500 dark:text-dark-text-secondary text-sm">
                        ({course.reviews.toLocaleString()})
                      </span>
                    </div>
                    <span className="text-sm text-primary-500 dark:text-dark-text-secondary">
                      By {course.instructor}
                    </span>
                  </div>

                  {/* Topics Preview */}
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {course.topics.slice(0, 2).map((topic, topicIndex) => (
                        <span
                          key={topicIndex}
                          className="px-2 py-1 bg-primary-100 dark:bg-dark-secondary text-primary-700 dark:text-dark-text-secondary text-xs rounded-md"
                        >
                          {topic}
                        </span>
                      ))}
                      {course.topics.length > 2 && (
                        <span className="px-2 py-1 bg-primary-100 dark:bg-dark-secondary text-primary-500 dark:text-dark-text-secondary text-xs rounded-md">
                          +{course.topics.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button className="btn-primary flex-1 group-hover:shadow-lg transition-shadow">
                      {course.progress > 0 ? 'Continue' : 'Start Free'}
                    </button>
                    <button className="btn-outline px-4 hover:scale-110 transition-transform">
                      ❤️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Courses CTA */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 p-6 bg-primary-50 dark:bg-dark-secondary rounded-2xl">
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-semibold text-primary-900 dark:text-dark-text-primary mb-1">
                Explore More Courses
              </h3>
              <p className="text-primary-600 dark:text-dark-text-secondary">
                Discover 50+ courses across all aptitude topics
              </p>
            </div>
            <button className="btn-outline btn-lg whitespace-nowrap group">
              View All Courses
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
