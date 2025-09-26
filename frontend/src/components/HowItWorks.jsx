const HowItWorks = () => {
  const steps = [
    {
      number: '1',
      title: 'Choose Goal',
      description: 'Select your target exam and career path',
      icon: '🎯',
      color: 'accent',
    },
    {
      number: '2',
      title: 'Watch Videos',
      description: 'Learn from expert instructors with clear explanations',
      icon: '📹',
      color: 'blue',
    },
    {
      number: '3',
      title: 'Practice Smart',
      description: 'Solve adaptive questions that match your level',
      icon: '🧠',
      color: 'green',
    },
    {
      number: '4',
      title: 'Take Tests',
      description: 'Assess your progress with realistic mock tests',
      icon: '📝',
      color: 'purple',
    },
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      accent: {
        bg: 'bg-accent-500',
        lightBg: 'bg-accent-100 dark:bg-accent-900/30',
        text: 'text-accent-600 dark:text-accent-400',
        border: 'border-accent-500',
      },
      blue: {
        bg: 'bg-blue-500',
        lightBg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-500',
      },
      green: {
        bg: 'bg-green-500',
        lightBg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-600 dark:text-green-400',
        border: 'border-green-500',
      },
      purple: {
        bg: 'bg-purple-500',
        lightBg: 'bg-purple-100 dark:bg-purple-900/30',
        text: 'text-purple-600 dark:text-purple-400',
        border: 'border-purple-500',
      },
    };
    return colorMap[color] || colorMap.accent;
  };

  return (
    <section className="py-20 bg-primary-50 dark:bg-dark-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-900 dark:text-dark-text-primary mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-xl text-primary-600 dark:text-dark-text-secondary max-w-3xl mx-auto">
            Your journey to success in just 4 simple steps
          </p>
        </div>

        {/* Steps - Desktop Horizontal Layout */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-16 left-0 right-0 h-0.5 bg-primary-200 dark:bg-dark-border" />
            <div className="absolute top-16 left-0 h-0.5 bg-accent-500 transition-all duration-1000 animate-pulse" style={{ width: '100%' }} />

            <div className="grid grid-cols-4 gap-8">
              {steps.map((step, index) => {
                const colors = getColorClasses(step.color);
                return (
                  <div
                    key={index}
                    className="relative text-center animate-slide-up"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    {/* Step Circle */}
                    <div className={`
                      relative w-32 h-32 mx-auto mb-6 rounded-full ${colors.lightBg}
                      flex items-center justify-center group cursor-pointer
                      transform hover:scale-110 transition-all duration-300
                      border-4 border-white dark:border-dark-card shadow-lg
                    `}>
                      {/* Number Badge */}
                      <div className={`
                        absolute -top-2 -right-2 w-8 h-8 ${colors.bg} text-white
                        rounded-full flex items-center justify-center text-sm font-bold
                        shadow-lg
                      `}>
                        {step.number}
                      </div>
                      
                      {/* Icon */}
                      <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                        {step.icon}
                      </span>

                      {/* Pulse Effect */}
                      <div className={`
                        absolute inset-0 rounded-full ${colors.bg} opacity-20
                        animate-ping group-hover:animate-pulse
                      `} />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-primary-900 dark:text-dark-text-primary mb-2">
                      {step.title}
                    </h3>
                    <p className="text-primary-600 dark:text-dark-text-secondary">
                      {step.description}
                    </p>

                    {/* Arrow (except for last step) */}
                    {index < steps.length - 1 && (
                      <div className="absolute top-16 -right-4 transform -translate-y-1/2">
                        <svg className="w-8 h-8 text-accent-500 animate-bounce-gentle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Steps - Mobile Vertical Layout */}
        <div className="lg:hidden space-y-8">
          {steps.map((step, index) => {
            const colors = getColorClasses(step.color);
            return (
              <div
                key={index}
                className="relative animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start space-x-4">
                  {/* Step Circle */}
                  <div className={`
                    flex-shrink-0 w-16 h-16 rounded-full ${colors.lightBg}
                    flex items-center justify-center relative
                    border-4 border-white dark:border-dark-card shadow-lg
                  `}>
                    {/* Number Badge */}
                    <div className={`
                      absolute -top-1 -right-1 w-6 h-6 ${colors.bg} text-white
                      rounded-full flex items-center justify-center text-xs font-bold
                    `}>
                      {step.number}
                    </div>
                    
                    {/* Icon */}
                    <span className="text-2xl">{step.icon}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-2">
                    <h3 className="text-lg font-bold text-primary-900 dark:text-dark-text-primary mb-2">
                      {step.title}
                    </h3>
                    <p className="text-primary-600 dark:text-dark-text-secondary">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Connecting Line (except for last step) */}
                {index < steps.length - 1 && (
                  <div className="ml-8 mt-4 mb-4">
                    <div className="w-0.5 h-8 bg-primary-200 dark:bg-dark-border mx-auto" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 p-6 bg-white dark:bg-dark-card rounded-2xl shadow-lg border border-primary-200 dark:border-dark-border">
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-semibold text-primary-900 dark:text-dark-text-primary mb-1">
                Ready to start your journey?
              </h3>
              <p className="text-primary-600 dark:text-dark-text-secondary">
                Join thousands of successful students today
              </p>
            </div>
            <button className="btn-primary btn-lg whitespace-nowrap">
              Begin Step 1
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
