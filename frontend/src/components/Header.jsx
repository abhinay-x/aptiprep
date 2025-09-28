import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const { currentUser, userProfile, logout, isAdmin } = useAuth();
  const location = useLocation();
  const drawerMountedRef = useRef(false);
  const [drawerMounted, setDrawerMounted] = useState(false);
  const closeBtnRef = useRef(null);

  const openDrawer = () => {
    setDrawerMounted(true);
    // allow next paint for transition
    requestAnimationFrame(() => setIsMobileMenuOpen(true));
  };

  const closeDrawer = () => {
    setIsMobileMenuOpen(false);
    // unmount after transition
    setTimeout(() => setDrawerMounted(false), 250);
  };

  const toggleMobileMenu = () => {
    if (drawerMounted || isMobileMenuOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  };

  const navItems = [
    { name: 'Home', to: '/' },
    { name: 'Courses', to: '/courses' },
    { name: 'Practice', to: '/practice' },
    { name: 'Tests', to: '/tests' },
    { name: 'About', to: '/about' },
  ];

  // Lock body scroll when the drawer is mounted (mobile) without causing layout shift
  useEffect(() => {
    if (!drawerMounted) return;
    const { body, documentElement: html } = document;
    const prev = {
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyWidth: body.style.width,
      htmlOverflowX: html.style.overflowX,
    };
    const scrollY = window.scrollY || window.pageYOffset || 0;
    // Prevent vertical & horizontal scroll and layout width jumps
    html.style.overflowX = 'hidden';
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';

    return () => {
      // Restore styles
      body.style.overflow = prev.bodyOverflow;
      body.style.position = prev.bodyPosition;
      body.style.top = prev.bodyTop;
      body.style.width = prev.bodyWidth;
      html.style.overflowX = prev.htmlOverflowX;
      // Restore scroll position
      window.scrollTo(0, scrollY);
    };
  }, [drawerMounted]);

  // Auto-collapse on route change
  useEffect(() => {
    if (drawerMounted || isMobileMenuOpen) {
      closeDrawer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Auto-close drawer when resizing to desktop breakpoint to avoid stuck states
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768 && (drawerMounted || isMobileMenuOpen)) {
        closeDrawer();
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [drawerMounted, isMobileMenuOpen]);

  // Basic focus trap when drawer is mounted
  useEffect(() => {
    if (!drawerMounted) return;
    // focus the close button
    setTimeout(() => closeBtnRef.current?.focus(), 0);
    const drawer = document.getElementById('mobile-drawer');
    if (!drawer) return;
    const getFocusable = () => drawer.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeDrawer();
      } else if (e.key === 'Tab') {
        const items = getFocusable();
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    drawer.addEventListener('keydown', onKeyDown);
    return () => drawer.removeEventListener('keydown', onKeyDown);
  }, [drawerMounted]);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-dark-primary/60 border-b border-white/20 dark:border-white/10 supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-dark-primary/50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/logo-1.png"
                alt="Aptiprep Logo"
                className="w-8 h-8 rounded-lg object-cover"
                loading="eager"
                decoding="async"
              />
              <span className="text-xl font-bold text-primary-900 dark:text-dark-text-primary">
                APTIPREP
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) => `
                  px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
                  ${isActive
                    ? 'bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-200'
                    : 'text-primary-700 hover:text-primary-900 hover:bg-primary-100 dark:text-dark-text-secondary dark:hover:text-white/90 dark:hover:bg-white/10'}
                `}
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {userProfile?.displayName?.charAt(0) || currentUser.email?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {userProfile?.displayName || 'User'}
                  </span>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/analytics"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Analytics
                    </Link>
                    {isAdmin() && (
                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-outline btn-sm">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary btn-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile actions */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-lg border border-primary-200 dark:border-dark-border text-primary-700 dark:text-white hover:bg-primary-100/60 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-accent-500"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-drawer"
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

      {/* Mobile overlay & drawer */}
      {drawerMounted && (
        <div className="md:hidden">
          {/* Overlay */}
          <div
            className={`fixed inset-0 z-[9998] transition-opacity duration-200 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'} bg-black/70 backdrop-blur-sm`}
            onClick={closeDrawer}
          />
          {/* Drawer */}
          <div
            id="mobile-drawer"
            className={`fixed right-0 top-0 h-screen w-full max-w-sm z-[9999] bg-white dark:bg-dark-primary rounded-l-2xl shadow-2xl flex flex-col overflow-hidden transform transition-transform duration-200 ease-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-primary-200 dark:border-dark-border">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-2">
                <img src="/logo-1.png" alt="Aptiprep Logo" className="w-8 h-8 rounded-lg object-cover" />
                <span className="text-lg font-bold text-primary-900 dark:text-white">APTIPREP</span>
              </Link>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                  ref={closeBtnRef}
                  onClick={closeDrawer}
                  className="inline-flex items-center justify-center p-2 rounded-lg border border-primary-200 dark:border-dark-border text-primary-700 dark:text-white hover:bg-primary-100/60 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  aria-label="Close menu"
                >
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="px-4 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  onClick={closeDrawer}
                  className={({ isActive }) => `
                    block px-3 py-3 rounded-lg text-base font-medium transition-colors duration-200
                    ${isActive
                      ? 'bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-200'
                      : 'text-primary-700 hover:text-primary-900 hover:bg-primary-100 dark:text-dark-text-secondary dark:hover:text-white/90 dark:hover:bg-white/10'}
                  `}
                >
                  {item.name}
                </NavLink>
              ))}
            </div>

            <div className="mt-2 border-t border-primary-200 dark:border-dark-border px-2 py-2 overflow-y-auto">
              {currentUser ? (
                <div className="">
                  {/* Account header (toggle) */}
                  <button
                    className="w-full px-2 py-3 flex items-center gap-3 rounded-lg hover:bg-primary-100 dark:hover:bg-white/10"
                    onClick={() => setIsAccountOpen((v) => !v)}
                    aria-expanded={isAccountOpen}
                    aria-controls="mobile-account-section"
                  >
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {userProfile?.displayName?.charAt(0) || currentUser.email?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {userProfile?.displayName || 'User'}
                      </p>
                      <p className="text-xs text-primary-500 dark:text-dark-text-secondary">Account</p>
                    </div>
                    <svg className={`h-5 w-5 transition-transform ${isAccountOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {/* Collapsible content */}
                  {isAccountOpen && (
                    <div id="mobile-account-section" className="mt-2 grid grid-cols-2 gap-2 px-2 pb-2">
                      <Link
                        to="/dashboard"
                        className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        onClick={closeDrawer}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/analytics"
                        className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        onClick={closeDrawer}
                      >
                        Analytics
                      </Link>
                      {isAdmin() && (
                        <Link
                          to="/admin/dashboard"
                          className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded col-span-2"
                          onClick={closeDrawer}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          closeDrawer();
                        }}
                        className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded col-span-2"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 px-2 pb-4">
                  <Link to="/login" className="btn-outline btn-sm flex-1">
                    Login
                  </Link>
                  <Link to="/signup" className="btn-primary btn-sm flex-1">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
