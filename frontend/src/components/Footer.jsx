const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Courses',
      links: [
        { name: 'Quantitative Aptitude', href: '/courses/quantitative' },
        { name: 'Logical Reasoning', href: '/courses/logical' },
        { name: 'Data Interpretation', href: '/courses/data' },
        { name: 'Verbal Ability', href: '/courses/verbal' },
        { name: 'All Courses', href: '/courses' }
      ]
    },
    {
      title: 'Practice',
      links: [
        { name: 'Topic-wise Practice', href: '/practice' },
        { name: 'Mock Tests', href: '/tests' },
        { name: 'Previous Papers', href: '/papers' },
        { name: 'Daily Quiz', href: '/quiz' },
        { name: 'Leaderboard', href: '/leaderboard' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Study Materials', href: '/resources/materials' },
        { name: 'Formula Sheets', href: '/resources/formulas' },
        { name: 'Tips & Tricks', href: '/resources/tips' },
        { name: 'Blog', href: '/blog' },
        { name: 'Success Stories', href: '/success' }
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Community', href: '/community' },
        { name: 'Feedback', href: '/feedback' }
      ]
    }
  ];

  const socialLinks = [
    { name: 'LinkedIn', href: '#', iconSrc: '/icons/li.svg' },
    { name: 'Instagram', href: 'https://www.instagram.com/aptiprep?igsh=bXlydDhpYXgyMWV1', iconSrc: '/icons/instagram.svg' },
    { name: 'X', href: '#', iconSrc: '/icons/x.svg' },
    { name: 'YouTube', href: 'https://youtube.com/@aptiprep?si=cuqAgPT7MUO6CvjL', iconSrc: '/icons/youtube.svg' },
    { name: 'Telegram', href: '#', iconSrc: '/icons/telegram.svg' }
  ];

  return (
    <footer className="bg-primary-900 dark:bg-dark-primary text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Top area arranged responsively to avoid long scroll on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <div className="flex items-center space-x-2 mb-4 sm:mb-6">
              <img
                src="/logo-1.png"
                alt="Aptiprep Logo"
                className="w-10 h-10 rounded-lg object-cover"
                loading="eager"
                decoding="async"
              />
              <span className="text-2xl font-bold">APTIPREP</span>
            </div>

            {/* Description */}
            <p className="text-primary-300 dark:text-dark-text-secondary mb-5 sm:mb-6 leading-relaxed text-sm sm:text-base">
              Master aptitude tests with AI-powered adaptive learning. Join thousands of students who achieved their dream careers with personalized study paths and expert guidance.
            </p>

            {/* App Download Buttons */}
            <div className="space-y-2 sm:space-y-3">
              <h4 className="font-semibold text-white mb-2 sm:mb-3">Download Our App</h4>
              <div className="flex flex-col xs:flex-row items-center xs:items-start justify-center xs:justify-start space-y-2 xs:space-y-0 xs:space-x-3">
                <a
                  href="/coming-soon"
                  className="inline-flex h-14 w-48 items-center justify-center"
                  aria-label="Download on the App Store"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                    alt="Download on the App Store"
                    className="w-full h-auto object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                </a>
                <a
                  href="/coming-soon"
                  className="inline-flex h-14 w-48 items-center justify-center"
                  aria-label="Get it on Google Play"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                    alt="Get it on Google Play"
                    className="w-full h-auto object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Footer Links - Compact accordion on mobile, full lists from md+ */}
          {/* Mobile accordion */}
          <div className="md:hidden col-span-1 sm:col-span-2">
            <div className="divide-y divide-primary-800/60">
              {footerSections.map((section, index) => (
                <details key={index} className="py-2">
                  <summary className="cursor-pointer list-none flex items-center justify-between py-2 text-sm font-semibold">
                    <span>{section.title}</span>
                    <span className="text-primary-300">+</span>
                  </summary>
                  <ul className="mt-1 pb-2 grid grid-cols-2 gap-2">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a
                          href={link.href}
                          className="text-primary-300 dark:text-dark-text-secondary hover:text-accent-400 transition-colors duration-200 text-sm"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </div>

          {/* Desktop / Tablet lists */}
          {footerSections.map((section, index) => (
            <div key={index} className="hidden md:block">
              <h3 className="font-semibold text-white mb-3">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-primary-300 dark:text-dark-text-secondary hover:text-accent-400 transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-primary-700 dark:border-dark-border">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Stay Updated</h3>
              <p className="text-primary-300 dark:text-dark-text-secondary text-sm sm:text-base">
                Get the latest study tips, exam updates, and success strategies delivered to your inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-primary-800 dark:bg-dark-secondary border border-primary-600 dark:border-dark-border text-white placeholder-primary-400 dark:placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
              <button className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-primary-700 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-primary-300 dark:text-dark-text-secondary text-xs sm:text-sm text-center">
              © {currentYear} Aptiprep. All rights reserved. Made with ❤️ for students.
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <span className="text-primary-300 dark:text-dark-text-secondary text-sm">Follow us:</span>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="transition-opacity duration-200 hover:opacity-80"
                    aria-label={social.name}
                    title={social.name}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={social.iconSrc}
                      alt={social.name}
                      className="h-5 w-5"
                      loading="lazy"
                      decoding="async"
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-3 text-xs sm:text-sm">
              <a href="/privacy" className="text-primary-300 dark:text-dark-text-secondary hover:text-accent-400 transition-colors">
                Privacy Policy
              </a>
              <span className="text-primary-600">•</span>
              <a href="/terms" className="text-primary-300 dark:text-dark-text-secondary hover:text-accent-400 transition-colors">
                Terms of Service
              </a>
              <span className="text-primary-600">•</span>
              <a href="/cookies" className="text-primary-300 dark:text-dark-text-secondary hover:text-accent-400 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button - Back to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-11 h-11 sm:w-12 sm:h-12 bg-accent-500 hover:bg-accent-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50 group"
        aria-label="Back to top"
      >
        <svg className="w-6 h-6 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  );
};

export default Footer;
