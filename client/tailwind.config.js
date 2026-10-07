/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fdf2f4',
          100: '#fce7ea',
          200: '#f8d0d6',
          300: '#f2aab5',
          400: '#e87589',
          500: '#d94060',
          600: '#c0274a',
          700: '#8B2635', // Primary maroon
          800: '#7a2130',
          900: '#6b1f2c',
          950: '#3d0d16',
        },
        gold: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#C9A84C', // Primary gold
          600: '#b8932e',
          700: '#9a7520',
          800: '#7d5c1c',
          900: '#674d19',
        },
        cream: {
          50:  '#fefdfb',
          100: '#fdf8f0',
          200: '#faf0e0',
          300: '#f5e6c8',
          400: '#eed5a3',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.14)',
        'brand': '0 4px 14px rgba(139, 38, 53, 0.25)',
      },
    },
  },
  plugins: [],
}
