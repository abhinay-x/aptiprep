import { useState, useEffect } from 'react';

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      id: 1,
      name: 'Anjali Sharma',
      role: 'Software Engineer',
      company: 'TCS',
      college: 'VIT University',
      image: '👩‍💻',
      rating: 5,
      text: "Got placed in TCS thanks to Aptiprep! The adaptive practice questions really helped me identify my weak areas and improve systematically. The mock tests were exactly like the real placement tests.",
      achievement: 'Placed in TCS',
      course: 'Complete Aptitude Package'
    },
    {
      id: 2,
      name: 'Rahul Patel',
      role: 'Data Analyst',
      company: 'Infosys',
      college: 'IIT Delhi',
      image: '👨‍💼',
      rating: 5,
      text: "The analytics dashboard helped me track my progress perfectly. I could see exactly which topics needed more work. The explanations for each question were crystal clear and helped me understand concepts deeply.",
      achievement: 'CAT 99.2 Percentile',
      course: 'Quantitative Aptitude Mastery'
    },
    {
      id: 3,
      name: 'Priya Singh',
      role: 'Business Analyst',
      company: 'Wipro',
      college: 'NIT Trichy',
      image: '👩‍🎓',
      rating: 5,
      text: "Amazing platform! The personalized study paths made all the difference. I went from struggling with basic concepts to solving advanced problems confidently. Highly recommend to anyone preparing for aptitude tests.",
      achievement: 'Placed in Wipro',
      course: 'Logical Reasoning Pro'
    },
    {
      id: 4,
      name: 'Arjun Kumar',
      role: 'Software Developer',
      company: 'Accenture',
      college: 'BITS Pilani',
      image: '👨‍🔬',
      rating: 5,
      text: "The AI-powered adaptive practice is revolutionary! Questions automatically adjusted to my skill level, ensuring I was always challenged but never overwhelmed. This smart approach saved me months of preparation time.",
      achievement: 'Multiple Offers',
      course: 'Data Interpretation Expert'
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-accent-500' : 'text-primary-300 dark:text-dark-border'}`}>
        ⭐
      </span>
    ));
  };

  return (
    <section className="py-20 bg-primary-50 dark:bg-dark-secondary overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-900 dark:text-dark-text-primary mb-4">
            Success <span className="text-gradient">Stories</span>
          </h2>
          <p className="text-xl text-primary-600 dark:text-dark-text-secondary max-w-3xl mx-auto">
            Hear from students who achieved their dream careers with Aptiprep
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Main Testimonial Display */}
          <div className="relative overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.id} className="w-full flex-shrink-0">
                  <div className="bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-primary-200 dark:border-dark-border p-8 md:p-12 mx-4">
                    <div className="grid md:grid-cols-3 gap-8 items-center">
                      {/* Testimonial Content */}
                      <div className="md:col-span-2">
                        {/* Quote */}
                        <div className="mb-6">
                          <svg className="w-8 h-8 text-accent-500 mb-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                          </svg>
                          <p className="text-lg md:text-xl text-primary-800 dark:text-dark-text-primary leading-relaxed italic">
                            "{testimonial.text}"
                          </p>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center mb-4">
                          {renderStars(testimonial.rating)}
                        </div>

                        {/* Achievement Badge */}
                        <div className="inline-flex items-center px-4 py-2 bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300 rounded-full text-sm font-medium mb-4">
                          <span className="mr-2">🏆</span>
                          {testimonial.achievement}
                        </div>
                      </div>

                      {/* Author Info */}
                      <div className="text-center md:text-left">
                        {/* Avatar */}
                        <div className="w-24 h-24 mx-auto md:mx-0 mb-4 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center text-4xl shadow-lg">
                          {testimonial.image}
                        </div>

                        {/* Author Details */}
                        <div>
                          <h4 className="text-xl font-bold text-primary-900 dark:text-dark-text-primary mb-1">
                            {testimonial.name}
                          </h4>
                          <p className="text-primary-600 dark:text-dark-text-secondary mb-1">
                            {testimonial.role}
                          </p>
                          <p className="text-accent-600 dark:text-accent-400 font-medium mb-2">
                            {testimonial.company}
                          </p>
                          <p className="text-sm text-primary-500 dark:text-dark-text-secondary mb-3">
                            {testimonial.college}
                          </p>
                          <div className="px-3 py-1 bg-primary-100 dark:bg-dark-secondary rounded-full text-xs text-primary-600 dark:text-dark-text-secondary">
                            {testimonial.course}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white dark:bg-dark-card shadow-lg rounded-full flex items-center justify-center text-primary-600 dark:text-dark-text-secondary hover:text-accent-500 hover:shadow-xl transition-all duration-200 z-10"
            aria-label="Previous testimonial"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 w-12 h-12 bg-white dark:bg-dark-card shadow-lg rounded-full flex items-center justify-center text-primary-600 dark:text-dark-text-secondary hover:text-accent-500 hover:shadow-xl transition-all duration-200 z-10"
            aria-label="Next testimonial"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide 
                  ? 'bg-accent-500 w-8' 
                  : 'bg-primary-300 dark:bg-dark-border hover:bg-accent-300'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: '10,000+', label: 'Students Placed', icon: '🎓' },
            { number: '95%', label: 'Success Rate', icon: '📈' },
            { number: '500+', label: 'Partner Companies', icon: '🏢' },
            { number: '4.8/5', label: 'Average Rating', icon: '⭐' }
          ].map((stat, index) => (
            <div key={index} className="text-center animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl md:text-3xl font-bold text-primary-900 dark:text-dark-text-primary mb-1">
                {stat.number}
              </div>
              <div className="text-primary-600 dark:text-dark-text-secondary text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
