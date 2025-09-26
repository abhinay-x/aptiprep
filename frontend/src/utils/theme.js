import { useState, useEffect } from 'react';

// Theme Management Utility
export class ThemeManager {
  constructor() {
    this.theme = this.getStoredTheme() || this.getSystemTheme();
    this.applyTheme(this.theme);
    this.setupSystemThemeListener();
  }

  getStoredTheme() {
    try {
      return localStorage.getItem('aptiprep-theme');
    } catch (error) {
      console.warn('localStorage not available:', error);
      return null;
    }
  }

  getSystemTheme() {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }

  setTheme(theme) {
    this.theme = theme;
    this.applyTheme(theme);
    this.storeTheme(theme);
    this.notifyThemeChange(theme);
  }

  applyTheme(theme) {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }

  storeTheme(theme) {
    try {
      localStorage.setItem('aptiprep-theme', theme);
    } catch (error) {
      console.warn('Failed to store theme:', error);
    }
  }

  toggleTheme() {
    const newTheme = this.theme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
    return newTheme;
  }

  getCurrentTheme() {
    return this.theme;
  }

  setupSystemThemeListener() {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        if (!this.getStoredTheme()) {
          const systemTheme = e.matches ? 'dark' : 'light';
          this.setTheme(systemTheme);
        }
      });
    }
  }

  notifyThemeChange(theme) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    }
  }

  // Subscribe to theme changes
  onThemeChange(callback) {
    if (typeof window !== 'undefined') {
      window.addEventListener('themechange', (e) => callback(e.detail.theme));
    }
  }

  // Unsubscribe from theme changes
  offThemeChange(callback) {
    if (typeof window !== 'undefined') {
      window.removeEventListener('themechange', callback);
    }
  }
}

// Create singleton instance
export const themeManager = new ThemeManager();

// React hook for theme management
export function useTheme() {
  const [theme, setThemeState] = useState(themeManager.getCurrentTheme());

  useEffect(() => {
    const handleThemeChange = (newTheme) => {
      setThemeState(newTheme);
    };

    themeManager.onThemeChange(handleThemeChange);
    
    return () => {
      themeManager.offThemeChange(handleThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = themeManager.toggleTheme();
    return newTheme;
  };

  const setTheme = (newTheme) => {
    themeManager.setTheme(newTheme);
  };

  return {
    theme,
    toggleTheme,
    setTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  };
}

// Vanilla JS functions for non-React usage
export const getTheme = () => themeManager.getCurrentTheme();
export const setTheme = (theme) => themeManager.setTheme(theme);
export const toggleTheme = () => themeManager.toggleTheme();
export const isDarkTheme = () => themeManager.getCurrentTheme() === 'dark';
export const isLightTheme = () => themeManager.getCurrentTheme() === 'light';
