const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 to-accent-50 dark:from-dark-primary dark:to-dark-secondary">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFB800' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 text-sm font-medium mb-6 animate-slide-down">
              <span className="mr-2">🎯</span>
              Join 10,000+ Students
              <span className="ml-2">✅</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-900 dark:text-dark-text-primary mb-6 animate-slide-up">
              Level Up Your{' '}
              <span className="text-gradient">Learning</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl sm:text-2xl text-primary-600 dark:text-dark-text-secondary mb-8 max-w-2xl mx-auto lg:mx-0 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Master Aptitude Tests for Your Dream Career
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <button className="btn-primary btn-lg group">
                Start Learning Free
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button className="btn-outline btn-lg group">
                <svg className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10V9a2 2 0 012-2h2a2 2 0 012 2v1M9 10v5a2 2 0 002 2h2a2 2 0 002-2v-5" />
                </svg>
                Take Demo Test
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-primary-500 dark:text-dark-text-secondary animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center">
                <span className="text-accent-500 mr-1">🔥</span>
                Free Trial Available
              </div>
              <div className="flex items-center">
                <span className="text-accent-500 mr-1">⭐</span>
                4.8/5 Rating
              </div>
              <div className="flex items-center">
                <span className="text-accent-500 mr-1">🎓</span>
                1000+ Success Stories
              </div>
            </div>
          </div>

          {/* Right Content - Illustration */}
          <div className="relative animate-float">
            <div className="relative max-w-md mx-auto lg:max-w-lg">
              {/* Main Illustration Container */}
              <div className="relative bg-white dark:bg-dark-card rounded-2xl shadow-2xl p-8 border border-primary-200 dark:border-dark-border">
                {/* Success Steps Illustration */}
                <div className="space-y-6">
                  {/* Step 1 */}
                  <div className="flex items-center space-x-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                    <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center">
                      <span className="text-accent-600 dark:text-accent-400 text-xl">📚</span>
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-primary-200 dark:bg-dark-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-accent-500 rounded-full animate-pulse" style={{ width: '90%' }}></div>
                      </div>
                      <p className="text-sm text-primary-600 dark:text-dark-text-secondary mt-1">Learn Concepts</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-center space-x-4 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                    <div className="w-12 h-12 bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center">
                      <span className="text-success-600 dark:text-success-400 text-xl">🎯</span>
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-primary-200 dark:bg-dark-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-success-500 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                      </div>
                      <p className="text-sm text-primary-600 dark:text-dark-text-secondary mt-1">Practice Smart</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-center space-x-4 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-800/30 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 dark:text-primary-400 text-xl">📝</span>
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-primary-200 dark:bg-dark-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary-500 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                      </div>
                      <p className="text-sm text-primary-600 dark:text-dark-text-secondary mt-1">Take Tests</p>
                    </div>
                  </div>

                  {/* Success Badge */}
                  <div className="text-center pt-4 animate-slide-up" style={{ animationDelay: '0.7s' }}>
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full text-white text-sm font-medium">
                      <span className="mr-2">🏆</span>
                      Dream Job Achieved!
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center text-white text-2xl animate-bounce-gentle">
                🚀
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-success-500 rounded-full flex items-center justify-center text-white text-xl animate-bounce-gentle" style={{ animationDelay: '1s' }}>
                ✨
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-primary-400 dark:text-dark-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
