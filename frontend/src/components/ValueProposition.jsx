const ValueProposition = () => {
  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered',
      subtitle: 'Adaptive Practice',
      description: 'Smart questions that adapt to your level and learning pace',
      gradient: 'from-blue-500 to-purple-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      icon: '📊',
      title: 'Analytics',
      subtitle: 'Dashboard',
      description: 'Track every mistake and improvement with detailed insights',
      gradient: 'from-green-500 to-teal-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconBg: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      icon: '🛤️',
      title: 'Study Paths',
      subtitle: 'Personalized',
      description: 'Custom roadmaps for Campus/CAT/Government exams',
      gradient: 'from-accent-500 to-orange-600',
      bgColor: 'bg-accent-50 dark:bg-accent-900/20',
      iconBg: 'bg-accent-100 dark:bg-accent-900/30',
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-dark-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-900 dark:text-dark-text-primary mb-4">
            Why Choose <span className="text-gradient">Aptiprep</span>?
          </h2>
          <p className="text-xl text-primary-600 dark:text-dark-text-secondary max-w-3xl mx-auto">
            Experience the future of aptitude test preparation with our cutting-edge features
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`
                relative group card-hover p-8 text-center
                ${feature.bgColor}
                transform hover:scale-105 transition-all duration-300
                animate-slide-up
              `}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-lg transition-opacity duration-300`} />
              
              {/* Icon */}
              <div className={`
                w-20 h-20 ${feature.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-6
                group-hover:scale-110 transition-transform duration-300
              `}>
                <span className="text-4xl">{feature.icon}</span>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-primary-900 dark:text-dark-text-primary mb-2">
                  {feature.title}
                </h3>
                <h4 className="text-lg font-semibold text-primary-700 dark:text-dark-text-secondary mb-4">
                  {feature.subtitle}
                </h4>
                <p className="text-primary-600 dark:text-dark-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Hover Effect Border */}
              <div className={`
                absolute inset-0 rounded-lg border-2 border-transparent
                group-hover:border-gradient-to-br group-hover:${feature.gradient}
                transition-all duration-300 opacity-0 group-hover:opacity-100
              `} />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-4 px-6 py-3 bg-primary-50 dark:bg-dark-secondary rounded-full">
            <span className="text-primary-600 dark:text-dark-text-secondary font-medium">
              Ready to experience the difference?
            </span>
            <button className="btn-primary btn-sm">
              Get Started Free
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
