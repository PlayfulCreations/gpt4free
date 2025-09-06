/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'studio': {
          'black': '#0a0a0a',
          'dark': '#1a1a1a',
          'medium': '#2a2a2a',
          'light': '#3a3a3a',
          'white': '#f8f9fa',
          'purple': '#8b5cf6',
          'yellow': '#fbbf24',
        },
        'gradient': {
          'purple': 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
          'yellow': 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
          'accent': 'linear-gradient(135deg, #8b5cf6 0%, #fbbf24 100%)',
        }
      },
      backgroundImage: {
        'gradient-purple': 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
        'gradient-yellow': 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        'gradient-accent': 'linear-gradient(135deg, #8b5cf6 0%, #fbbf24 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}