import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { name: 'Home', to: '/' },
    { name: 'Courses', to: '/courses' },
    { name: 'Practice', to: '/practice' },
    { name: 'Tests', to: '/tests' },
  ];

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/20 dark:border-white/10 animate-fade-in-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center animate-glow">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-bold text-primary-900 dark:text-dark-text-primary">
                Aptiprep
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) => `
                  px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                  ${isActive
                    ? 'bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-300'
                    : 'text-primary-600 hover:text-primary-900 hover:bg-primary-100 dark:text-dark-text-secondary dark:hover:text-dark-text-primary dark:hover:bg-dark-secondary'}
                `}
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />
            <Link to="/login" className="btn-outline btn-sm">
              Login
            </Link>
            <Link to="/signup" className="btn-primary btn-sm">
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-primary-600 dark:text-dark-text-secondary hover:text-primary-900 dark:hover:text-dark-text-primary hover:bg-primary-100 dark:hover:bg-dark-secondary focus:outline-none focus:ring-2 focus:ring-accent-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Close icon */}
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-dark-primary border-t border-primary-200 dark:border-dark-border">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => `
                block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200
                ${isActive
                  ? 'bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-300'
                  : 'text-primary-600 hover:text-primary-900 hover:bg-primary-100 dark:text-dark-text-secondary dark:hover:text-dark-text-primary dark:hover:bg-dark-secondary'}
              `}
            >
              {item.name}
            </NavLink>
          ))}
          <div className="pt-4 pb-3 border-t border-primary-200 dark:border-dark-border">
            <div className="flex items-center px-3 space-x-3">
              <Link to="/login" className="btn-outline btn-sm flex-1">
                Login
              </Link>
              <Link to="/signup" className="btn-primary btn-sm flex-1">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
