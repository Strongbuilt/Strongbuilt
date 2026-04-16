/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './src/**/*.{html,js}',
    './theme-config.js',
    './script.js',
    './project-gallery.js',
  ],
  theme: {
    extend: {
      screens: {
        'xs':  '360px',
        '3xl': '1920px',
        '4k':  '2560px',
      },
      colors: {
        brand: {
          black:     '#231F20',
          dark:      '#1a1718',
          gold:      '#EFBF04',
          darkGold:  '#EFBF04',
          lightGold: '#EFBF04',
          gray:      '#AAAAAA',
          silver:    '#EEEEEE',
        },
        clay: {
          base:    '#231F20',
          mist:    '#1a1718',
          sunken:  '#15110f',
          paper:   '#2a2627',
          surface: '#ffffff',
          ink:     '#EEEEEE',
          muted:   '#AAAAAA',
          faint:   '#888888',
          border:  'rgba(238, 238, 238, 0.10)',
        },
      },
      spacing: { '18': '4.5rem' },
      fontFamily: {
        hero:    ['"Oswald"', '"Agency FB"', '"Barlow Condensed"', 'Impact', 'Helvetica', 'Arial', 'sans-serif'],
        heading: ['"Barlow Condensed"', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['Archivo', 'Helvetica', 'sans-serif'],
        body:    ['Inter', 'Helvetica', 'Arial', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'float':        'float 8s ease-in-out infinite',
        'float-delayed':'float 8s ease-in-out 4s infinite',
        'pulse-slow':   'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow':    'spin 12s linear infinite',
        'glow-pulse':   'glow 3s ease-in-out infinite',
        'scroll':       'scroll 30s linear infinite',
        'ken-burns':    'kenBurns 20s ease-out infinite alternate',
      },
      keyframes: {
        float:   { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-15px)' } },
        glow:    {
          '0%, 100%': { boxShadow: '0 0 5px #EFBF04, 0 0 10px #EFBF04' },
          '50%':      { boxShadow: '0 0 20px #EFBF04, 0 0 30px #EFBF04' },
        },
        scroll:  { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-100%)' } },
        kenBurns:{ '0%': { transform: 'scale(1)' }, '100%': { transform: 'scale(1.15)' } },
      },
    },
  },
  plugins: [],
};
