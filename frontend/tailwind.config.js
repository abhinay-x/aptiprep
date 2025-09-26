/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light Theme Colors
        light: {
          primary: {
            50:  '#f5faff',
            100: '#e0f2ff',
            200: '#b9e3ff',
            300: '#7cc4ff',   // 👈 this fixes your error
            400: '#3da6ff',
            500: '#007bff',
            600: '#005fcc',
            700: '#004799',
            800: '#003066',
            900: '#001933',
          },
          secondary: '#F8F9FA',
          card: '#FFFFFF',
          'text-primary': '#1A1A1A',
          'text-secondary': '#6C757D',
          border: '#E9ECEF',
          accent: '#FFB800',
          success: '#28A745',
          error: '#DC3545',
        },
        // Dark Theme Colors
        dark: {
          primary: '#0D1117',
          secondary: '#161B22',
          card: '#21262D',
          'text-primary': '#F0F6FC',
          'text-secondary': '#7D8590',
          border: '#30363D',
          accent: '#FFB800',
          success: '#2EA043',
          error: '#F85149',
        },
        // Unified color system
        primary: {
          50: '#F8F9FA',
          100: '#E9ECEF',
          200: '#DEE2E6',
          300: '#CED4DA',
          400: '#ADB5BD',
          500: '#6C757D',
          600: '#495057',
          700: '#343A40',
          800: '#212529',
          900: '#1A1A1A',
        },
        accent: {
          50: '#FFF8E1',
          100: '#FFECB3',
          200: '#FFE082',
          300: '#FFD54F',
          400: '#FFCA28',
          500: '#FFB800',
          600: '#FFB300',
          700: '#FFA000',
          800: '#FF8F00',
          900: '#FF6F00',
        },
        success: {
          50: '#E8F5E8',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#28A745',
          600: '#2EA043',
          700: '#388E3C',
          800: '#2E7D32',
          900: '#1B5E20',
        },
        error: {
          50: '#FFEBEE',
          100: '#FFCDD2',
          200: '#EF9A9A',
          300: '#E57373',
          400: '#EF5350',
          500: '#DC3545',
          600: '#F85149',
          700: '#D32F2F',
          800: '#C62828',
          900: '#B71C1C',
        }
      },
      fontSize: {
        // Typography Scale
        'h1-desktop': ['32px', { lineHeight: '40px', fontWeight: '700' }],
        'h1-mobile': ['28px', { lineHeight: '36px', fontWeight: '700' }],
        'h2-desktop': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'h2-mobile': ['22px', { lineHeight: '28px', fontWeight: '600' }],
        'h3-desktop': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'h3-mobile': ['18px', { lineHeight: '24px', fontWeight: '600' }],
        'body-desktop': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-mobile': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'caption-desktop': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'caption-mobile': ['12px', { lineHeight: '18px', fontWeight: '400' }],
      },
      spacing: {
        // Spacing System
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
      },
      screens: {
        // Responsive Breakpoints
        'mobile-sm': '0px',
        'mobile-lg': '576px',
        'tablet': '768px',
        'laptop': '1024px',
        'desktop': '1200px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-10px)' },
          '60%': { transform: 'translateY(-5px)' },
        },
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
        'modal': '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}
